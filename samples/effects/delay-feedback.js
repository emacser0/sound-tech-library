// 딜레이: 피드백 없는 한 번 메아리 vs 피드백 + 핑퐁 + 템포 동기. 임펄스 응답 타임라인으로 메아리 개수와 좌우 위치를 보여줌
GTL.register({
  id: 'delay-feedback',
  title: '딜레이와 피드백 (핑퐁, 템포 동기)',
  summary: '딜레이는 소리를 링 버퍼에 넣었다가 늦게 꺼내는 이펙트. 출력의 일부를 다시 입력으로 돌리는 피드백이 메아리 개수를 정하고, 핑퐁은 메아리를 좌우로 번갈아 보냄.',
  views: { a: '메아리 1번 (피드백 0)', b: '피드백 + 핑퐁' },
  controls: '파라미터 표에서 피드백, 박자 길이, 핑퐁을 바꿈. "소리 켜기"를 누르면 소리 내는 뷰가 들림.',
  info: `
    <p><b>딜레이(Delay)</b>는 입력을 링 버퍼(원형 버퍼)에 쓰고, 쓰기 위치보다 D 샘플 뒤를 읽는 이펙트. 읽은 값이 메아리가 됨.</p>
    <ul>
      <li><b>피드백(Feedback)</b>: 지연된 출력에 g를 곱해 다시 입력에 더함. 메아리 k번째의 크기는 g<sup>k-1</sup>. g가 1에 가까울수록 메아리가 오래 남음.</li>
      <li><b>톤(Tone)</b>: 피드백 경로에 로우패스 필터를 넣으면 메아리가 돌 때마다 어두워짐. 테이프 에코, 아날로그 BBD 딜레이의 특징.</li>
      <li><b>핑퐁(Ping-pong)</b>: 왼쪽 딜레이의 출력이 오른쪽 입력으로, 오른쪽 출력이 왼쪽 입력으로 감. 메아리가 좌우로 번갈아 들림.</li>
      <li><b>템포 동기(Tempo sync)</b>: 지연 시간을 박자 단위로 정함. 8분음표 = 60 / BPM / 2초. 점8분(3/16)은 리듬 사이를 채워서 많이 씀.</li>
    </ul>
    <p>지연 시간을 갑자기 바꾸면 읽기 위치가 튀어 클릭이 남. 여기서는 지연 시간을 원폴 필터로 천천히 따라가게 해서 테이프처럼 음이 미끄러짐.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="10" y="44" class="t-small">${L('입력', 'In')}</text>
    <line x1="40" y1="40" x2="88" y2="40" class="d-line" marker-end="url(#arr)"/>
    <circle cx="100" cy="40" r="11" class="d-line"/><text x="100" y="44" text-anchor="middle">+</text>
    <line x1="111" y1="40" x2="158" y2="40" class="d-line" marker-end="url(#arr)"/>
    <rect x="160" y="24" width="110" height="32" class="f-dim"/><text x="215" y="44" text-anchor="middle" class="t-small">${L('지연 D (L)', 'Delay D (L)')}</text>
    <line x1="270" y1="40" x2="330" y2="40" class="d-line" marker-end="url(#arr)"/><text x="336" y="44" class="t-small">${L('왼쪽 출력', 'Left out')}</text>
    <rect x="160" y="110" width="110" height="32" class="f-dim"/><text x="215" y="130" text-anchor="middle" class="t-small">${L('지연 D (R)', 'Delay D (R)')}</text>
    <line x1="270" y1="126" x2="330" y2="126" class="d-line" marker-end="url(#arr)"/><text x="336" y="130" class="t-small">${L('오른쪽 출력', 'Right out')}</text>
    <path d="M300,40 L300,80 L130,80 L130,118 L158,118" class="d-b" marker-end="url(#arr)"/>
    <path d="M300,126 L300,96 L100,96 L100,52" class="d-b" marker-end="url(#arr)"/>
    <text x="140" y="76" class="t-small t-b">${L('× g (톤 필터)', '× g (tone filter)')}</text>
    <text x="440" y="70" text-anchor="middle" class="t-small t-b">${L('핑퐁: 출력이 반대쪽', 'Ping-pong: output goes')}</text>
    <text x="440" y="84" text-anchor="middle" class="t-small t-b">${L('입력으로 감', 'to the other side')}</text>
    <text x="440" y="110" text-anchor="middle" class="t-small t-dim">${L('메아리 k의 크기 = g^(k-1)', 'Echo k level = g^(k-1)')}</text>
  </svg>`,
  look: [
    'A와 B의 타임라인을 비교하면 A는 메아리가 하나, B는 박자선마다 메아리가 이어짐',
    'B에서 핑퐁을 켜고 끄면 메아리가 L, R 레인을 번갈아 가는지 양쪽에 같이 나오는지 바뀜',
    '피드백을 0.9 이상으로 올리면 "-60dB까지 시간"이 몇 초로 길어지고 메아리가 쌓여 소리가 탁해짐',
    '톤을 2kHz로 낮추고 소리를 들으면 메아리가 돌 때마다 더 어두워짐',
    '박자를 1/4에서 1/8 점음표로 바꾸면 메아리가 박자 사이에 떨어져 리듬이 촘촘해짐',
  ],
  refs: [
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed., Wiley', year: 2011, note: '2장 필터, 3장 지연 기반 이펙트' },
    { type: 'book', title: 'Will Pirkle, Designing Audio Effect Plugins in C++, 2nd ed., Routledge', year: 2019, note: '지연 이펙트와 링 버퍼 구현' },
    { type: 'book', title: 'Julius O. Smith III, Physical Audio Signal Processing (CCRMA online book)', url: 'https://ccrma.stanford.edu/~jos/pasp/', note: '지연선과 피드백 콤 필터' },
    { type: 'article', title: 'MDN Web Docs, DelayNode', url: 'https://developer.mozilla.org/en-US/docs/Web/API/DelayNode', note: 'Web Audio API의 지연 노드' },
  ],
  params: [
    { key: 'feedback', label: '피드백 g', type: 'range', min: 0, max: 0.95, step: 0.01, a: 0, b: 0.6, group: '딜레이' },
    { key: 'pingpong', label: '핑퐁', type: 'bool', a: false, b: true },
    { key: 'sync', label: '지연 시간 (박자)', type: 'select', options: [{ value: '4', label: '1/4' }, { value: '8d', label: '1/8 점음표' }, { value: '8', label: '1/8' }, { value: '16', label: '1/16' }, { value: 'free', label: '자유 (ms)' }], default: '8d', shared: true },
    { key: 'ms', label: '지연 시간 (ms)', type: 'range', min: 20, max: 1000, step: 1, default: 300, shared: true, when: (p) => p.sync === 'free' },
    { key: 'tone', label: '톤 (피드백 로우패스, Hz)', type: 'range', min: 1000, max: 20000, step: 100, default: 6000, shared: true },
    { key: 'mix', label: '딜레이 음량 (wet)', type: 'range', min: 0, max: 1, step: 0.01, default: 0.6, shared: true },
    { key: 'bpm', label: '템포 (BPM)', type: 'int', min: 60, max: 180, default: 120, shared: true, group: '음원' },
    { key: 'src', label: '음원', type: 'select', options: [{ value: 'pluck', label: '플럭' }, { value: 'drums', label: '드럼' }], default: 'pluck', shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Delay and Feedback (Ping-Pong, Tempo Sync)',
    summary: 'A delay writes sound into a ring buffer and reads it back later. Feedback sends part of the output back to the input and sets how many echoes you hear. Ping-pong sends the echoes left and right in turn.',
    views: { a: 'One echo (feedback 0)', b: 'Feedback + ping-pong' },
    controls: 'Change feedback, note length and ping-pong in the parameter table. Press "Sound on" to hear the view that plays sound.',
    info: `
    <p>A <b>delay</b> writes the input into a ring buffer (circular buffer) and reads the value D samples behind the write position. That value is the echo.</p>
    <ul>
      <li><b>Feedback</b>: the delayed output is multiplied by g and added back to the input. Echo k has level g<sup>k-1</sup>. The closer g is to 1, the longer the echoes last.</li>
      <li><b>Tone</b>: a lowpass filter in the feedback path makes each echo darker than the one before. Tape echo and analog BBD delays sound like this.</li>
      <li><b>Ping-pong</b>: the left delay output feeds the right input, and the right output feeds the left input. Echoes alternate between left and right.</li>
      <li><b>Tempo sync</b>: the delay time is set in note values. An eighth note is 60 / BPM / 2 seconds. A dotted eighth (3/16) fills the gaps in a rhythm, so it is very common.</li>
    </ul>
    <p>If the delay time jumps, the read position jumps and you hear a click. Here the delay time follows the target through a one-pole filter, so the pitch glides like tape.</p>`,
    look: [
      'Compare the A and B timelines. A has one echo. B keeps echoing on each beat line.',
      'Turn ping-pong on and off in B. Echoes switch between alternating L and R lanes and appearing on both.',
      'Raise feedback above 0.9. "Time to -60 dB" grows to several seconds and the echoes pile up into a muddy sound.',
      'Lower tone to 2 kHz and listen. Each echo gets darker as it goes around.',
      'Change the note length from 1/4 to dotted 1/8. Echoes land between the beats and the rhythm gets busier.',
    ],
    refs: ['Ch. 2 filters, Ch. 3 delay-based effects.', 'Delay effects and ring buffer code.', 'Delay lines and feedback comb filters.', 'The delay node of the Web Audio API.'],
    params: {
      feedback: { label: 'Feedback g', group: 'Delay' },
      pingpong: 'Ping-pong',
      sync: { label: 'Delay time (note)', options: { '8d': 'Dotted 1/8', free: 'Free (ms)' } },
      ms: 'Delay time (ms)',
      tone: 'Tone (feedback lowpass, Hz)',
      mix: 'Delay level (wet)',
      bpm: { label: 'Tempo (BPM)', group: 'Source' },
      src: { label: 'Source', options: { pluck: 'Pluck', drums: 'Drums' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SRV = 16000; // 시각화용 샘플레이트

    const delaySec = () => {
      const beat = 60 / P.bpm;
      switch (P.sync) {
        case '4': return beat;
        case '8d': return beat * 0.75;
        case '8': return beat / 2;
        case '16': return beat / 4;
        default: return P.ms / 1000;
      }
    };

    // 음원: 8분음표 8칸 루프. 플럭은 1, 4, 6번째 칸, 드럼은 킥, 스네어, 하이햇
    function makeSource(sr) {
      const noise = A.noiseBuffer(sr, 11);
      const notes = [57, 0, 0, 64, 0, 60, 0, 0];
      let n = 0, ph = 0;
      return () => {
        const step = Math.round(sr * 30 / P.bpm), i = n % (step * 8), k = Math.floor(i / step), t = (i - k * step) / sr;
        n++;
        if (P.src === 'pluck') {
          const m = notes[k];
          if (!m || t > 0.4) return 0;
          ph += A.mtof(m) / sr;
          return (0.7 * Math.sin(2 * Math.PI * ph) + 0.3 * A.wave.saw(ph)) * Math.exp(-t * 14) * 0.45;
        }
        const nz = noise[n % sr];
        if (k === 0 || k === 5) { const f = 50 + 110 * Math.exp(-t * 30); ph += f / sr; return Math.sin(2 * Math.PI * ph) * Math.exp(-t * 9) * 0.5; }
        if (k === 2 || k === 6) return (nz * 0.7 + Math.sin(2 * Math.PI * 190 * t) * 0.3) * Math.exp(-t * 22) * 0.4;
        return (nz - (noise[(n + 1) % sr])) * Math.exp(-t * 70) * 0.12;
      };
    }

    // 스테레오 딜레이 엔진. 시각화와 소리가 같은 함수를 씀
    function makeDelay(sr) {
      const size = Math.ceil(sr * 1.5) + 4;
      const bl = new Float32Array(size), br = new Float32Array(size);
      let w = 0, dCur = delaySec() * sr, lpL = 0, lpR = 0;
      const out = { l: 0, r: 0 };
      const read = (buf, d) => {
        let p = w - d; while (p < 0) p += size;
        const i0 = Math.floor(p), fr = p - i0, i1 = (i0 + 1) % size;
        return buf[i0] + (buf[i1] - buf[i0]) * fr;
      };
      out.step = (x, smooth) => {
        const target = U.clamp(delaySec() * sr, 1, size - 3);
        dCur = smooth ? dCur + (target - dCur) * 0.0004 : target;
        const yl = read(bl, dCur), yr = read(br, dCur);
        const a = A.onePoleCoef(P.tone, sr), g = P.feedback;
        lpL += a * (yl - lpL); lpR += a * (yr - lpR);
        if (P.pingpong) { bl[w] = x + g * lpR; br[w] = g * lpL; }
        else { bl[w] = x + g * lpL; br[w] = x + g * lpR; }
        w = (w + 1) % size;
        out.l = x + P.mix * yl; out.r = x + P.mix * yr;
        return out;
      };
      return out;
    }

    let live = null;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (!live || live.sr !== sr) live = { sr, src: makeSource(sr), fx: makeDelay(sr) };
        for (let i = 0; i < n; i++) { const o = live.fx.step(live.src(), true); l[i] = o.l * 0.8; r[i] = o.r * 0.8; }
      },
    });

    // 임펄스 응답 (파라미터가 바뀔 때만)
    let key = '', irL, irR, T = 0, echoes = 0, t60 = 0, wave = null;
    function analyze() {
      const k = [P.feedback, P.pingpong, P.sync, P.ms, P.tone, P.mix, P.bpm, P.src].join();
      if (k === key) return;
      key = k;
      peakCache.clear();
      const d = delaySec();
      T = U.clamp(d * 9, 2, 6);
      const n = Math.floor(T * SRV), fx = makeDelay(SRV);
      irL = new Float32Array(n); irR = new Float32Array(n);
      for (let i = 0; i < n; i++) { const o = fx.step(i === 0 ? 1 : 0, false); irL[i] = o.l; irR[i] = o.r; }
      // 메아리 개수와 -60dB 시간
      echoes = 0; t60 = 0;
      const ds = Math.round(d * SRV);
      for (let e = 1; e * ds < n; e++) {
        let pk = 0;
        for (let j = e * ds - 2; j < Math.min(n, e * ds + 40); j++) pk = Math.max(pk, Math.abs(irL[j]), Math.abs(irR[j]));
        if (pk > 0.001) { echoes = e; t60 = e * d; }
      }
      if (P.feedback > 0 && echoes * ds + ds >= n) t60 = Math.log(0.001 / Math.max(1e-6, P.mix)) / Math.log(P.feedback) * d + d; // 화면 밖까지 이어짐
      // 음원을 통과한 출력 (2마디)
      const src = makeSource(SRV), fx2 = makeDelay(SRV), m = Math.floor(SRV * 60 / P.bpm * 8);
      wave = new Float32Array(m);
      for (let i = 0; i < m; i++) { const o = fx2.step(src(), false); wave[i] = (o.l + o.r) * 0.5; }
    }

    // 열마다 최대값. 버퍼와 폭이 같으면 다시 계산하지 않음
    const peakCache = new Map();
    function columnPeaks(buf, w) {
      const c0 = peakCache.get(buf);
      if (c0 && c0.length === w) return c0;
      const n = buf.length, out = new Float32Array(w);
      for (let c = 0; c < w; c++) {
        const i0 = Math.floor(c * n / w), i1 = Math.max(i0 + 1, Math.floor((c + 1) * n / w));
        let pk = 0;
        for (let i = i0; i < i1; i++) pk = Math.max(pk, Math.abs(buf[i] || 0));
        out[c] = pk;
      }
      peakCache.set(buf, out);
      return out;
    }
    function lane(g, buf, x, y, w, h, name) {
      D.rect(g, x, y, w, h, 'rgba(0,0,0,0.35)');
      const pks = columnPeaks(buf, Math.floor(w));
      for (let c = 0; c < pks.length; c++) {
        const pk = pks[c];
        if (pk < 0.001) continue;
        const v = U.clamp((A.linToDb(pk) + 60) / 60, 0, 1);
        D.rect(g, x + c, y + h * (1 - v), 1.5, h * v, c < 2 ? C.text : col);
      }
      D.text(g, name, x + 4, y + 3, { size: 10, color: C.dim });
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, x = pad + 14, w = W - x - pad;
        const lh = Math.max(36, (H * 0.55 - 40) / 2);
        D.text(g, GTL.L('임펄스 응답 (막대 높이 = dB, 0 ~ -60)', 'Impulse response (bar height = dB, 0 to -60)'), pad, pad, { size: 10, color: C.dim });
        const y1 = pad + 16, y2 = y1 + lh + 6;
        lane(g, irL, x, y1, w, lh, 'L'); lane(g, irR, x, y2, w, lh, 'R');
        // 박자선
        const beat = 60 / P.bpm;
        for (let b = 0; b * beat <= T; b++) {
          const px = x + (b * beat / T) * w;
          D.line(g, px, y1, px, y2 + lh, b % 4 === 0 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)', 1);
        }
        D.text(g, `${T.toFixed(1)} s`, x + w - 30, y2 + lh + 2, { size: 9, color: C.dim });
        // 출력 파형
        const wy = y2 + lh + 18, wh = H - wy - pad;
        if (wh > 30) {
          D.rect(g, x, wy, w, wh, 'rgba(0,0,0,0.35)');
          const pks = columnPeaks(wave, Math.floor(w)), mid = wy + wh / 2;
          for (let c = 0; c < pks.length; c++) { const a = Math.min(1, pks[c] * 1.2) * wh / 2; D.rect(g, x + c, mid - a, 1, a * 2 + 0.5, col); }
          D.text(g, GTL.L('출력 파형 (2마디, 시작 직후)', 'Output waveform (2 bars from the start)'), x + 4, wy + 3, { size: 10, color: C.dim });
        }
        const d = delaySec();
        ctx.stat(GTL.L('지연 시간', 'Delay time'), `${(d * 1000).toFixed(0)} ms (${Math.round(d * 48000)} ${GTL.L('샘플 @48k', 'samples @48k')})`);
        ctx.stat(GTL.L('들리는 메아리 수 (-60dB 위)', 'Audible echoes (above -60 dB)'), echoes + (t60 > T ? '+' : ''));
        ctx.stat(GTL.L('-60dB까지 시간', 'Time to -60 dB'), t60 ? t60.toFixed(2) + ' s' : '-');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
