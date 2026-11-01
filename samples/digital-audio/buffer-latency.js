// 버퍼 크기, 지연, 언더런: 버퍼가 작으면 반응이 빠르지만 잠깐의 처리 지연에도 소리가 끊김 (시뮬레이션)
GTL.register({
  id: 'buffer-latency',
  title: '오디오 버퍼 크기와 지연, 언더런',
  summary: '오디오 콜백의 버퍼 크기를 64와 512로 비교하는 시뮬레이션. 작은 버퍼는 지연이 짧지만 OS가 잠깐 멈출 때마다 마감을 놓쳐 소리가 끊기고, 큰 버퍼는 안정적이지만 반응이 늦음.',
  views: { a: '버퍼 64 샘플', b: '버퍼 512 샘플' },
  controls: 'Space: 소리 내기 (지연만큼 늦게 들림). 파라미터 표에서 버퍼 크기, 처리 부하, 끼어들기를 바꿈.',
  info: `
    <p>오디오 장치는 일정한 간격으로 "다음 버퍼를 채워 달라"고 콜백을 부름. 콜백은 버퍼 하나(예: 256 샘플)를 계산해 돌려줌. 버퍼 하나의 길이가 곧 <b>마감 시간</b>: 48 kHz에서 256 샘플이면 5.3 ms.</p>
    <ul>
      <li><b>지연(Latency)</b>: 계산 중인 버퍼와 재생 대기 중인 버퍼가 있어서 출력은 대략 버퍼 2개만큼 늦음. 악기 연주는 10 ms 안팎부터 늦다고 느낌.</li>
      <li><b>언더런(Underrun)</b>: 콜백이 마감 안에 끝나지 못하면 장치는 빈 버퍼(무음)를 내보냄. 딱, 틱 하는 끊김으로 들림.</li>
      <li>원인: 평균 처리 부하보다 <b>가끔 생기는 끼어들기</b>(OS 스케줄링, 메모리 할당, 잠금 대기, 파일 입출력, 가비지 컬렉션). 버퍼가 작으면 몇 ms짜리 끼어들기도 마감을 넘김.</li>
    </ul>
    <p>그래서 오디오 스레드에서는 할당, 잠금, 입출력을 피함. 녹음, 라이브 연주는 작은 버퍼, 믹싱, 게임 배경음처럼 반응이 덜 중요한 곳은 큰 버퍼를 씀. 이 샘플은 실제 장치가 아니라 콜백 시간표를 흉내 낸 시뮬레이션.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="16" class="t-small t-dim">${L('시간 →', 'time →')}</text>
    ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<line x1="${40 + i * 60}" y1="26" x2="${40 + i * 60}" y2="120" class="d-dim" stroke-dasharray="2 3"/>`).join('')}
    <text x="20" y="44" class="t-small">${L('마감', 'due')}</text>
    <rect x="42" y="56" width="30" height="16" class="f-good"/><rect x="102" y="56" width="30" height="16" class="f-good"/>
    <rect x="162" y="56" width="30" height="16" class="f-good"/><rect x="192" y="56" width="70" height="16" class="f-accent"/>
    <rect x="262" y="56" width="30" height="16" class="f-bad"/><rect x="292" y="56" width="30" height="16" class="f-good"/>
    <rect x="342" y="56" width="30" height="16" class="f-good"/><rect x="402" y="56" width="30" height="16" class="f-good"/>
    <text x="228" y="50" text-anchor="middle" class="t-small">${L('끼어들기', 'interruption')}</text>
    <text x="20" y="68" class="t-small">${L('콜백', 'work')}</text>
    <rect x="220" y="86" width="60" height="16" class="f-bad"/>
    <text x="250" y="116" text-anchor="middle" class="t-small">${L('무음 (언더런)', 'silence (underrun)')}</text>
    <text x="20" y="98" class="t-small">${L('출력', 'output')}</text>
    <text x="270" y="146" text-anchor="middle" class="t-small t-dim">${L('초록 = 마감 안에 끝남, 빨강 = 마감을 넘김', 'green = done before the deadline, red = missed the deadline')}</text>
    <text x="270" y="162" text-anchor="middle" class="t-small t-dim">${L('점선 간격 = 버퍼 길이 = 마감 간격', 'dashed spacing = buffer length = deadline interval')}</text>
  </svg>`,
  look: [
    'A의 시간표에는 보라색 끼어들기 뒤에 빨간 콜백(마감 넘김)이 생김. B는 같은 끼어들기를 버퍼 안에서 흡수해 모두 초록.',
    '"소리 켜기" 후 A를 들으면 아르페지오 중간중간 틱 하는 끊김이 들림. B는 매끄러움.',
    'Space를 누르면 A는 바로 소리가 나고, B는 버퍼 크기를 4096으로 올리면 확실히 늦게 들림',
    '끼어들기 길이를 0으로 내리면 A도 끊김이 사라짐. 처리 부하를 95%로 올리면 작은 끼어들기에도 끊김.',
  ],
  refs: [
    { type: 'article', title: 'Ross Bencina, "Real-time audio programming 101: time waits for nothing"', year: 2011, url: 'http://www.rossbencina.com/code/real-time-audio-programming-101-time-waits-for-nothing', note: '오디오 스레드에서 피할 일' },
    { type: 'article', title: 'W3C, Web Audio API: AudioContext baseLatency, outputLatency', url: 'https://www.w3.org/TR/webaudio/', note: '브라우저의 지연 정보' },
    { type: 'article', title: 'Steinberg, ASIO SDK', note: '이중 버퍼 콜백 구조' },
    { type: 'book', title: 'Karen Collins, Game Sound: An Introduction to the History, Theory, and Practice of Video Game Music and Sound Design', year: 2008, note: '게임 오디오의 지연과 반응성' },
  ],
  params: [
    { key: 'buf', label: '버퍼 크기 (샘플)', type: 'select', options: [32, 64, 128, 256, 512, 1024, 2048, 4096].map((v) => ({ value: v, label: String(v) })), a: 64, b: 512, default: 64, group: '오디오 장치' },
    { key: 'load', label: '처리 부하 (%)', type: 'range', min: 10, max: 95, step: 1, default: 50, shared: true, group: '부하', help: '버퍼 길이 대비 평균 계산 시간' },
    { key: 'spikeMs', label: '끼어들기 길이 (ms)', type: 'range', min: 0, max: 20, step: 0.5, default: 3, shared: true },
    { key: 'spikeRate', label: '끼어들기 빈도 (초당)', type: 'range', min: 0, max: 20, step: 0.5, default: 4, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Audio Buffer Size, Latency and Underruns',
    summary: 'A simulation that compares audio callback buffer sizes of 64 and 512. A small buffer has short latency, but every brief OS stall makes it miss the deadline and the sound drops out. A large buffer is stable but slow to respond.',
    views: { a: 'Buffer 64 samples', b: 'Buffer 512 samples' },
    controls: 'Space: play a sound (heard late by the latency). Change buffer size, load and interruptions in the parameter table.',
    info: `
    <p>An audio device calls a callback at fixed intervals to ask for the next buffer. The callback computes one buffer (for example 256 samples) and returns it. The length of one buffer is the <b>deadline</b>: 256 samples at 48 kHz is 5.3 ms.</p>
    <ul>
      <li><b>Latency</b>: one buffer is being computed and one waits to play, so output is late by about 2 buffers. Players start to feel an instrument is late from around 10 ms.</li>
      <li><b>Underrun</b>: if the callback misses the deadline, the device plays an empty buffer (silence). You hear a click or tick.</li>
      <li>The cause is less the average load and more <b>occasional interruptions</b> (OS scheduling, memory allocation, waiting on locks, file I/O, garbage collection). With a small buffer even a few ms of interruption misses the deadline.</li>
    </ul>
    <p>That is why audio threads avoid allocation, locks and I/O. Recording and live playing use small buffers. Mixing and game ambience, where response time matters less, use large buffers. This sample is a simulation of the callback schedule, not a real device.</p>`,
    look: [
      'In A\'s schedule a red callback (missed deadline) follows each purple interruption. B absorbs the same interruptions inside its buffer and stays green.',
      'Press "Sound on" and listen to A. The arpeggio has ticks and gaps. B is smooth.',
      'Press Space. A responds at once. Raise B\'s buffer size to 4096 and it is clearly late.',
      'Set interruption length to 0 and A\'s dropouts stop. Raise the load to 95% and even small interruptions cause dropouts.',
    ],
    refs: ['What to avoid on the audio thread.', 'Latency information in the browser.', 'Double-buffered callback design.', 'Latency and responsiveness in game audio.'],
    params: {
      buf: { label: 'Buffer size (samples)', group: 'Audio device' },
      load: { label: 'Processing load (%)', group: 'Load', help: 'Average compute time relative to the buffer length' },
      spikeMs: 'Interruption length (ms)',
      spikeRate: 'Interruptions per second',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, WINDOW = 0.2, TAU = Math.PI * 2;

    // 콜백 시간표 시뮬레이터. step()이 다음 콜백 하나를 처리하고 기록을 돌려줌
    function makeSim(sr) {
      const rng = U.rng(ctx.seed + 99);
      const B = +P.buf, T = B / sr;
      let k = 0, busy = 0, nextSpike = 0;
      const spikes = []; // 아직 지나지 않은 끼어들기 {t, d}
      const genTo = (t) => {
        while (P.spikeRate > 0 && nextSpike <= t) {
          const d = P.spikeMs * 0.001 * (0.5 + rng.next());
          if (d > 0) spikes.push({ t: nextSpike, d });
          nextSpike += -Math.log(1 - rng.next() * 0.999) / P.spikeRate;
        }
        if (P.spikeRate <= 0) nextSpike = t + 1;
      };
      nextSpike = -Math.log(1 - rng.next() * 0.999) / Math.max(0.01, P.spikeRate);
      return {
        B, T,
        step() {
          const avail = k * T, start = Math.max(avail, busy);
          let finish = start + (P.load / 100) * T + 0.00005;
          const hits = [];
          genTo(finish + 0.05);
          let changed = true;
          while (changed) { // 처리 중에 시작한 끼어들기만큼 늦어짐
            changed = false;
            for (let i = 0; i < spikes.length; i++) {
              const s = spikes[i];
              if (!s.used && s.t >= start && s.t < finish) { s.used = true; finish += s.d; hits.push(s); changed = true; }
            }
          }
          while (spikes.length && (spikes[0].used || spikes[0].t < start)) spikes.shift();
          busy = finish;
          const rec = { k, start, finish, due: (k + 1) * T, late: finish > (k + 1) * T, hits };
          k++;
          return rec;
        },
      };
    }

    // 소리: 아르페지오 + Space 음. 늦은 버퍼는 무음
    let aSim = null, aN = 0, aLate = false, trigAt = -1, trigReq = false;
    const notes = [57, 64, 69, 72, 76, 72, 69, 64];
    function synth(n, sr) {
      const t = n / sr, step = 0.125, idx = Math.floor(t / step), tt = t - idx * step;
      const f = A.mtof(notes[idx % notes.length]);
      let v = Math.sin(TAU * f * t) * Math.exp(-tt * 18) * 0.3;
      if (trigAt >= 0 && n >= trigAt) { const u = (n - trigAt) / sr; if (u < 1.2) v += (Math.sin(TAU * 1046.5 * u) + 0.4 * Math.sin(TAU * 2093 * u)) * Math.exp(-u * 5) * 0.2; }
      return v;
    }
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (!aSim || aSim.sr !== sr) { aSim = makeSim(sr); aSim.sr = sr; aN = 0; }
        if (trigReq) { trigAt = aN + 2 * aSim.B; trigReq = false; }
        for (let i = 0; i < n; i++) {
          if (aN % aSim.B === 0) aLate = aSim.step().late;
          const v = aLate ? 0 : synth(aN, sr);
          aN++;
          l[i] = v; r[i] = v;
        }
      },
    });

    // 화면용 시뮬레이션
    let sim = makeSim(SR), simT = 0, recs = [], lateTimes = [], keyT = -10;
    function reset() { sim = makeSim(SR); simT = 0; recs = []; lateTimes = []; aSim = null; }

    return {
      update(dt) {
        snd.update();
        simT += dt;
        while ((recs.length ? recs[recs.length - 1].due : 0) < simT + 0.001) {
          const r = sim.step();
          recs.push(r);
          if (r.late) lateTimes.push(r.due);
        }
        while (recs.length && recs[0].due < simT - WINDOW - 0.1) recs.shift();
        while (lateTimes.length && lateTimes[0] < simT - 2) lateTimes.shift();
        if (ctx.input.pressed('Space')) { keyT = simT; trigReq = true; }
      },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2;
        const T = sim.T, lat = 2 * T;
        const t0 = simT - WINDOW, tx = (t) => pad + ((t - t0) / WINDOW) * w;
        const rowH = Math.max(18, H * 0.09);
        const y1 = pad + 18, y2 = y1 + rowH + 16, y3 = y2 + rowH + 16;
        D.rect(g, pad, pad, w, y3 + rowH + 8 - pad, 'rgba(0,0,0,0.35)');
        D.text(g, Lx('콜백 시간표 (최근 0.2초)', 'Callback schedule (last 0.2 s)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 마감 눈금
        if (T * 1000 > 0.4) for (const r of recs) { const x = tx(r.due); if (x >= pad && x <= pad + w) D.line(g, x, y1, x, y1 + rowH, 'rgba(255,255,255,0.18)', 1); }
        D.text(g, Lx('마감', 'Deadlines'), pad + 4, y1 + rowH / 2 - 5, { size: 9, color: C.dim });
        // 콜백 처리 막대 + 끼어들기
        for (const r of recs) {
          const xa = Math.max(pad, tx(r.start)), xb = Math.min(pad + w, tx(r.finish));
          if (xb > xa) D.rect(g, xa, y2, Math.max(1, xb - xa), rowH, r.late ? C.bad : C.good);
          for (const s of r.hits) { const sa = Math.max(pad, tx(s.t)), sb = Math.min(pad + w, tx(s.t + s.d)); if (sb > sa) D.rect(g, sa, y2 - 6, sb - sa, 5, C.accent); }
        }
        D.text(g, Lx('콜백 처리 (보라 = 끼어들기)', 'Callback work (purple = interruption)'), pad + 4, y2 - 18, { size: 9, color: C.dim });
        // 출력: 늦은 버퍼 = 무음
        D.rect(g, pad, y3, w, rowH, 'rgba(102,209,122,0.25)');
        for (const r of recs) if (r.late) { const xa = Math.max(pad, tx(r.due)), xb = Math.min(pad + w, tx(r.due + T)); if (xb > xa) D.rect(g, xa, y3, Math.max(2, xb - xa), rowH, C.bad); }
        D.text(g, Lx('출력 (빨강 = 무음)', 'Output (red = silence)'), pad + 4, y3 - 13, { size: 9, color: C.dim });
        // Space 표시
        if (keyT > t0 - lat) {
          const kx = tx(keyT), hx = tx(keyT + lat);
          if (kx >= pad) { D.line(g, kx, y1, kx, y3 + rowH, C.warn, 2); D.text(g, Lx('누름', 'press'), kx + 3, y1 - 12, { size: 9, color: C.warn }); }
          if (hx <= pad + w) { D.line(g, hx, y1, hx, y3 + rowH, col, 2); D.text(g, Lx('들림', 'heard'), hx + 3, y3 + rowH - 12, { size: 9, color: col }); }
        }
        // 지연 막대
        const by = y3 + rowH + 22, bh = H - by - pad;
        if (bh > 30) {
          const maxMs = 200, bx = (ms) => pad + U.clamp(ms / maxMs, 0, 1) * w;
          D.rect(g, pad, by, w, bh, 'rgba(0,0,0,0.35)');
          const bar = Math.min(22, bh * 0.4), yy = by + bh / 2 - bar / 2 + 4;
          D.rect(g, pad, yy, bx(lat * 1000) - pad, bar, col);
          for (const ms of [10, 50, 100, 150]) { D.line(g, bx(ms), by + 14, bx(ms), by + bh, C.grid, 1); D.text(g, ms + ' ms', bx(ms) + 2, by + bh - 12, { size: 9, color: C.dim }); }
          D.text(g, Lx(`출력 지연 ≈ 버퍼 2개 = ${(lat * 1000).toFixed(1)} ms`, `Output latency ≈ 2 buffers = ${(lat * 1000).toFixed(1)} ms`), pad + 4, by + 3, { size: 10, color: C.dim });
        }
        ctx.stat(Lx('버퍼 길이 (마감)', 'Buffer length (deadline)'), (T * 1000).toFixed(2) + ' ms');
        ctx.stat(Lx('출력 지연', 'Output latency'), (lat * 1000).toFixed(1) + ' ms');
        ctx.stat(Lx('언더런 (최근 2초)', 'Underruns (last 2 s)'), String(lateTimes.length));
        ctx.stat(Lx('콜백 횟수 (초당)', 'Callbacks per second'), (1 / T).toFixed(0));
        snd.stat();
      },
      onParam(k) { if (k === 'buf' || k === 'spikeRate' || k === 'spikeMs' || k === 'load') reset(); },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
