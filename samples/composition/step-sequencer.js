// 스텝 시퀀서: 타이머(setTimeout 흉내)로 발음 vs 오디오 콜백 안에서 샘플 단위로 발음
GTL.register({
  id: 'step-sequencer',
  title: '스텝 시퀀서와 정확한 타이밍',
  summary: '16칸 드럼 그리드를 재생하는 스텝 시퀀서. 메인 스레드 타이머로 소리를 내면 칸마다 몇 ms씩 늦고 흔들림. 오디오 콜백 안에서 샘플 수로 시간을 세면 오차가 0이 됨.',
  views: { a: '타이머 방식', b: '샘플 단위 방식' },
  controls: '그리드 칸을 클릭하면 음표를 넣거나 뺌',
  info: `
    <p><b>스텝 시퀀서(Step Sequencer)</b>는 한 마디를 16칸 같은 고정 칸으로 나누고, 칸마다 소리를 켜고 끄는 도구. TR-808 같은 드럼 머신의 기본 방식.</p>
    <p>칸 길이는 템포로 정해짐. 16분음표 한 칸 = 60 / BPM / 4초. 120 BPM이면 125ms. 어려운 부분은 "그 시각에 정확히 소리를 내는 것".</p>
    <ul>
      <li><b>타이머 방식</b>: 메인 스레드의 setTimeout이나 requestAnimationFrame에서 소리를 냄. 타이머 해상도, 화면 그리기, 가비지 컬렉션 때문에 매번 몇 ms~수십 ms 늦음. 브라우저는 다시 128샘플 블록 경계로 맞춤.</li>
      <li><b>샘플 단위 방식</b>: 오디오 콜백 안에서 샘플 수로 시간을 셈. 음표가 블록 안의 정확한 샘플 위치에서 시작됨.</li>
      <li>Web Audio의 표준 해법은 "앞서 예약하기(lookahead scheduling)". 타이머로 조금 앞을 내다보고 <code>start(when)</code>에 정확한 시각을 넘김.</li>
    </ul>
    <p>사람은 10ms 안팎의 흔들림도 그루브가 무너진 것으로 느낌. 촘촘한 하이햇에서 특히 잘 들림.</p>`,
  diagram: (L) => {
    const xs = [60, 120, 180, 240, 300, 360, 420, 480], late = [6, 14, 3, 22, 8, 4, 30, 10];
    return `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="16" class="t-small t-dim">${L('16분음표 칸 경계 (이상적인 시각)', '16th-note step boundaries (ideal times)')}</text>
    ${xs.map((x) => `<line x1="${x}" y1="24" x2="${x}" y2="150" class="d-dim" stroke-dasharray="3 3"/>`).join('')}
    <line x1="40" y1="70" x2="520" y2="70" class="d-dim"/>
    <text x="4" y="58" class="t-a">${L('A 타이머', 'A timer')}</text>
    ${xs.map((x, i) => `<line x1="${x}" y1="70" x2="${x + late[i]}" y2="70" class="d-bad"/><rect x="${x + late[i] - 2}" y="60" width="4" height="20" class="f-a"/>`).join('')}
    <text x="426" y="94" class="t-small t-a">${L('늦음, 매번 다름', 'late, different each time')}</text>
    <line x1="40" y1="130" x2="520" y2="130" class="d-dim"/>
    <text x="4" y="118" class="t-b">${L('B 샘플 단위', 'B sample count')}</text>
    ${xs.map((x) => `<rect x="${x - 2}" y="120" width="4" height="20" class="f-b"/>`).join('')}
    <text x="270" y="164" text-anchor="middle" class="t-small t-b">${L('오디오 콜백이 샘플 수를 세어 칸 경계의 정확한 샘플에서 시작', 'The audio callback counts samples and starts each hit on the exact sample')}</text>
    </svg>`;
  },
  look: [
    '"소리 켜기"를 누르고 A와 B를 번갈아 들으면 A의 하이햇이 비틀거림. B는 기계처럼 고름.',
    '"타이머 지터 (ms)"를 40으로 올리면 A의 오차 막대가 크게 들쭉날쭉해짐. B는 계속 0.',
    '템포를 170 이상으로 올리면 칸 길이가 줄어 같은 지터라도 A의 흔들림이 더 크게 들림',
    '그리드 칸을 클릭해 패턴을 바꾸면 두 뷰에 같은 패턴이 들어감 (입력 동기화가 켜져 있을 때)',
  ],
  refs: [
    { type: 'article', title: 'Chris Wilson, "A Tale of Two Clocks: Scheduling Web Audio with Precision"', url: 'https://web.dev/articles/audio-scheduling', year: 2013, note: 'setTimeout 지터와 lookahead 예약 방식' },
    { type: 'engine', title: 'W3C, Web Audio API', url: 'https://www.w3.org/TR/webaudio/', note: '128샘플 렌더 퀀텀, AudioScheduledSourceNode.start(when)' },
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', year: 1996, note: '시퀀서와 MIDI 타이밍' },
    { type: 'engine', title: 'Roland TR-808 Rhythm Composer Owner\'s Manual', year: 1980, note: '16스텝 드럼 패턴 입력 방식의 원형' },
  ],
  params: [
    { key: 'timing', label: '발음 방식', type: 'select', options: [{ value: 'timer', label: '타이머 (메인 스레드)' }, { value: 'sample', label: '샘플 단위 (오디오 콜백)' }], a: 'timer', b: 'sample', group: '시퀀서' },
    { key: 'jitter', label: '타이머 지터 (ms)', type: 'range', min: 0, max: 40, step: 1, default: 18, shared: true, help: '타이머가 늦게 깨어나는 최대 시간. 가끔 2.5배 큰 지연(GC)도 섞음', when: (p) => p.timing === 'timer' },
    { key: 'bpm', label: '템포 (BPM)', type: 'int', min: 60, max: 180, default: 112, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Step Sequencer & Accurate Timing',
    summary: 'A step sequencer plays a 16-step drum grid. If a main-thread timer triggers the sounds, every step is a few ms late and the lateness wobbles. If the audio callback counts samples, the error is zero.',
    views: { a: 'Timer', b: 'Sample count' },
    controls: 'Click a grid cell to add or remove a note.',
    info: `
    <p>A <b>step sequencer</b> splits a bar into fixed steps (often 16) and turns a sound on or off on each step. This is how drum machines like the TR-808 work.</p>
    <p>The tempo sets the step length. One 16th step = 60 / BPM / 4 seconds. At 120 BPM that is 125 ms. The hard part is to make the sound at exactly that time.</p>
    <ul>
      <li><b>Timer</b>: setTimeout or requestAnimationFrame on the main thread triggers the sound. Timer resolution, drawing and garbage collection make it a few ms to tens of ms late each time. The browser then snaps it to a 128-sample block boundary.</li>
      <li><b>Sample count</b>: the audio callback counts time in samples. Each note starts on the exact sample inside the block.</li>
      <li>The standard Web Audio fix is lookahead scheduling. A timer looks a little ahead and passes the exact time to <code>start(when)</code>.</li>
    </ul>
    <p>People hear a wobble of about 10 ms as a broken groove. Dense hi-hats show it most.</p>`,
    look: [
      'Press "Sound on" and switch between A and B. A\'s hi-hats stumble. B is machine-tight.',
      'Raise "Timer jitter (ms)" to 40. A\'s error bars jump around a lot. B stays at 0.',
      'Raise the tempo above 170. Steps get shorter, so the same jitter sounds worse in A.',
      'Click grid cells to change the pattern. Both views get the same pattern (when input sync is on).',
    ],
    refs: ['setTimeout jitter and lookahead scheduling.', '128-sample render quantum, AudioScheduledSourceNode.start(when).', 'Sequencers and MIDI timing.', 'The original 16-step drum pattern entry.'],
    params: {
      timing: { label: 'Trigger method', group: 'Sequencer', options: { timer: 'Timer (main thread)', sample: 'Sample count (audio callback)' } },
      jitter: { label: 'Timer jitter (ms)', help: 'Maximum time the timer wakes up late. Sometimes a 2.5x larger delay (GC) is mixed in.' },
      bpm: 'Tempo (BPM)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const L = (k, e) => GTL.L(k, e);
    const col = ctx.side === 'a' ? C.a : C.b;
    const TRACKS = [
      { kind: 'kick', ko: '킥', en: 'Kick', vel: 1 },
      { kind: 'snare', ko: '스네어', en: 'Snare', vel: 0.9 },
      { kind: 'clap', ko: '클랩', en: 'Clap', vel: 0.6 },
      { kind: 'hat', ko: '하이햇', en: 'Hi-hat', vel: 0.8 },
    ];
    const pat = [
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];
    // ── 작은 드럼, 음 합성기 (이 카테고리 샘플마다 같은 코드를 둠). 시드 노이즈, 블록 안 샘플 위치에서 시작 ──
    function makeKit(seed) {
      let s = (seed >>> 0) || 1;
      const nz = () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return (s >>> 0) / 2147483648 - 1; };
      const vs = [];
      const LEN = { kick: 0.6, snare: 0.35, hat: 0.12, ohat: 0.5, clap: 0.35, rim: 0.08, tom: 0.5, bell: 0.9 };
      return {
        vs,
        // kind: kick, snare, hat, ohat, clap, rim, tom, bell, tone, bass. at: 블록 안 시작 샘플. o: { vel, f, dur, pan, cut }
        trig(kind, at, o = {}) {
          if (vs.length > 48) vs.shift();
          vs.push({ kind, at: Math.max(0, at | 0), t: 0, vel: o.vel ?? 1, f: o.f || 220, dur: o.dur || 0.2, pan: o.pan || 0, cut: o.cut || 0, ph: 0, lp: 0, lp2: 0, x1: 0 });
        },
        render(Lb, Rb, n, sr) {
          Lb.fill(0); Rb.fill(0);
          const dt = 1 / sr, T = 6.283185307;
          for (let j = vs.length - 1; j >= 0; j--) {
            const v = vs[j];
            const end = v.kind === 'tone' || v.kind === 'bass' ? v.dur + 0.12 : LEN[v.kind] || 0.3;
            const gl = v.vel * (1 - Math.max(0, v.pan)), gr = v.vel * (1 + Math.min(0, v.pan));
            for (let i = v.at; i < n && v.t < end; i++) {
              const t = v.t; let y = 0;
              switch (v.kind) {
                case 'kick': { v.ph += (48 + 120 * Math.exp(-t * 28)) * dt; y = Math.sin(T * v.ph) * Math.exp(-t * 6) * 0.9; break; }
                case 'tom': { v.ph += (v.f * 0.5 + v.f * 0.3 * Math.exp(-t * 20)) * dt; y = Math.sin(T * v.ph) * Math.exp(-t * 8) * 0.6; break; }
                case 'snare': { const w = nz(), h = w - v.x1; v.x1 = w; y = h * 0.35 * Math.exp(-t * 18) + Math.sin(T * 185 * t) * 0.4 * Math.exp(-t * 25); break; }
                case 'hat': case 'ohat': { const w = nz(), h = w - v.x1; v.x1 = w; y = h * 0.16 * Math.exp(-t * (v.kind === 'hat' ? 50 : 9)); break; }
                case 'clap': {
                  const w = nz(), h = w - v.x1; v.x1 = w; let e = 0;
                  for (let k = 0; k < 3; k++) { const tk = t - k * 0.011; if (tk >= 0) e += Math.exp(-tk * 140); }
                  if (t > 0.022) e += Math.exp(-(t - 0.022) * 16) * 0.6;
                  y = h * 0.3 * e; break;
                }
                case 'rim': y = Math.sin(T * 1650 * t) * Math.exp(-t * 80) * 0.45; break;
                case 'bell': y = (Math.sin(T * v.f * t) + 0.4 * Math.sin(T * v.f * 2.76 * t)) * Math.exp(-t * 5) * 0.35 * Math.min(1, t / 0.002); break;
                default: { // tone, bass: 톱니파(+삼각파) + 2차 원폴 로우패스, 짧은 어택과 릴리스
                  v.ph += v.f * dt; v.ph -= Math.floor(v.ph);
                  const bass = v.kind === 'bass';
                  const raw = bass ? (2 * v.ph - 1) * 0.5 + (4 * Math.abs(v.ph - 0.5) - 1) * 0.6 : 2 * v.ph - 1;
                  const c = v.cut || (bass ? 0.05 : 0.12);
                  v.lp += c * (raw - v.lp); v.lp2 += c * (v.lp - v.lp2);
                  const env = Math.min(1, t / 0.004) * (t < v.dur ? 1 : Math.max(0, 1 - (t - v.dur) / 0.12)) * (bass ? Math.exp(-t * 1.2) : Math.exp(-t * 2.5));
                  y = v.lp2 * env * (bass ? 0.9 : 0.7);
                }
              }
              Lb[i] += y * gl; Rb[i] += y * gr;
              v.t += dt;
            }
            v.at = 0;
            if (v.t >= end) vs.splice(j, 1);
          }
          for (let i = 0; i < n; i++) { Lb[i] = Math.tanh(Lb[i] * 1.1) * 0.6; Rb[i] = Math.tanh(Rb[i] * 1.1) * 0.6; }
        },
      };
    }
    // 시드 해시 (0~1). 같은 i, salt면 같은 값. 화면과 소리가 같은 난수를 씀
    const hash = (i, salt = 0) => {
      let x = (Math.imul(i | 0, 2654435761) ^ Math.imul((salt | 0) + 1 + ctx.seed, 2246822519)) >>> 0;
      x ^= x >>> 15; x = Math.imul(x, 2246822519); x ^= x >>> 13; x = Math.imul(x, 3266489917); x ^= x >>> 16;
      return (x >>> 0) / 4294967296;
    };
    // 반복 이벤트 목록(evs: [{ t, ... }], 0 <= t < len) 중 [t0, t1)에 걸리는 것을 fn(e, 절대 시각)으로 넘김
    const loopEach = (evs, len, t0, t1, fn) => {
      if (!(len > 0)) return;
      for (let c = Math.floor(t0 / len); c * len < t1; c++) for (const e of evs) { const t = c * len + e.t; if (t >= t0 && t < t1) fn(e, t); }
    };
    // 재생 시계: 소리가 꺼져 있으면 update의 dt로, 켜져 있으면 오디오 블록으로 진행. 일시정지 중에는 소리를 멈춤
    const clock = { t: 0, seen: 0 };
    const kit = makeKit(ctx.seed * 7 + 3);
    const runAudio = (l, r, sr, n, schedule) => {
      if (ctx.now() - clock.seen > 400) { l.fill(0); r.fill(0); return; }
      const t0 = clock.t, t1 = t0 + n / sr;
      schedule(t0, t1, (kind, t, o) => kit.trig(kind, (t - t0) * sr, o));
      kit.render(l, r, n, sr);
      clock.t = t1;
    };
    const tick = (dt) => { clock.seen = ctx.now(); if (!snd.on) clock.t += dt; snd.update(); };
    // 뷰 왼쪽 위의 뷰 이름 표시와 겹치지 않게 그림 전체를 TOP만큼 내림
    const TOP = 26;
    const stepDur = () => 60 / P.bpm / 4;
    // 타이머 방식의 지연(초). 칸 번호마다 정해진 시드 값이라 화면과 소리가 같음
    function late(idx) {
      if (P.timing === 'sample') return 0;
      let ms = hash(idx, 1) * P.jitter;
      if (hash(idx, 2) < 0.06) ms += P.jitter * 2.5; // 가끔 큰 지연 (GC, 긴 프레임)
      const q = 128 / 48; // 128샘플 렌더 퀀텀 (48kHz 기준 2.67ms) 경계로 올림
      return Math.ceil(ms / q) * q / 1000;
    }
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        runAudio(l, r, sr, n, (t0, t1, trig) => {
          const sd = stepDur();
          for (let idx = Math.max(0, Math.floor((t0 - 0.2) / sd)); idx * sd < t1; idx++) {
            const t = idx * sd + late(idx);
            if (t < t0 || t >= t1) continue;
            const s = idx % 16;
            TRACKS.forEach((tr, k) => { if (pat[k][s]) trig(tr.kind, t, { vel: tr.vel * (k === 3 && s % 4 ? 0.55 : 1) }); });
          }
        });
      },
    });

    let lay = null;
    const inst = {
      update(dt) { tick(dt); },
      render() { ctx.g.save(); ctx.g.translate(0, TOP); try { inst.drawView(); } finally { ctx.g.restore(); } },
      drawView() {
        const g = ctx.g, W = ctx.width, H = ctx.height - TOP, pad = 10;
        const sd = stepDur(), cur = Math.floor(clock.t / sd);
        // 그리드
        const gx = pad + 52, gy = pad + 16, gw = W - gx - pad, gh = Math.min(140, H * 0.36), rh = gh / 4, cw = gw / 16;
        lay = { gx, gy, gw, gh, rh, cw };
        D.text(g, L('패턴 (칸을 클릭해서 편집)', 'Pattern (click a cell to edit)'), pad, pad, { size: 10, color: C.dim });
        // 소리가 실제로 난 칸 (지연 반영)
        let shown = cur;
        while (shown > 0 && shown * sd + late(shown) > clock.t) shown--;
        for (let k = 0; k < 4; k++) {
          D.text(g, L(TRACKS[k].ko, TRACKS[k].en), pad, gy + k * rh + rh / 2 - 6, { size: 11, color: C.text });
          for (let s = 0; s < 16; s++) {
            const x = gx + s * cw, y = gy + k * rh, on = pat[k][s];
            const hot = s === shown % 16;
            D.rect(g, x + 1, y + 1, cw - 2, rh - 2, on ? (hot ? '#fff' : col) : (s % 4 === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'));
          }
        }
        D.rect(g, gx + (shown % 16) * cw, gy, cw, gh, null, C.warn, 1.5);
        // 최근 32칸의 타이밍 오차
        const ey = gy + gh + 30, eh = Math.max(40, H - ey - 46), ew = W - pad * 2;
        D.rect(g, pad, ey, ew, eh, 'rgba(0,0,0,0.35)');
        const maxMs = Math.max(10, P.jitter * 3.5 + 3);
        D.text(g, L(`최근 32칸의 발음 오차 (ms, 위로 갈수록 늦음, 최대 ${maxMs.toFixed(0)}ms)`, `Trigger error of the last 32 steps (ms, up = late, max ${maxMs.toFixed(0)} ms)`), pad + 4, ey - 14, { size: 10, color: C.dim });
        let sum = 0, sum2 = 0, mx = 0, cnt = 0;
        const bw = ew / 32;
        for (let j = 0; j < 32; j++) {
          const idx = shown - 31 + j;
          if (idx < 0) continue;
          const ms = late(idx) * 1000;
          sum += ms; sum2 += ms * ms; mx = Math.max(mx, ms); cnt++;
          const bh = Math.max(2, (ms / maxMs) * (eh - 6));
          D.rect(g, pad + j * bw + 1, ey + eh - bh, bw - 2, bh, ms > 0 ? col : C.good);
        }
        // 하이햇 발음 시각: 이상적인 시각(점선) vs 실제 시각(막대)
        const ty = ey + eh + 8, th = 24;
        D.text(g, L('최근 8칸: 점선 = 이상적인 시각, 막대 = 실제 발음', 'Last 8 steps: dashed = ideal, bar = actual'), pad + 4, ty + th + 2, { size: 9, color: C.dim });
        for (let j = 0; j < 8; j++) {
          const idx = shown - 7 + j; if (idx < 0) continue;
          const x0 = pad + 20 + j * (ew - 40) / 8, px = x0 + late(idx) / sd * (ew - 40) / 8;
          D.line(g, x0, ty, x0, ty + th, C.dim, 1);
          D.rect(g, px - 1.5, ty + 3, 3, th - 6, col);
        }
        const mean = cnt ? sum / cnt : 0, sdv = cnt ? Math.sqrt(Math.max(0, sum2 / cnt - mean * mean)) : 0;
        ctx.stat(L('칸 길이', 'Step length'), (sd * 1000).toFixed(1) + ' ms');
        ctx.stat(L('평균 지연', 'Mean delay'), mean.toFixed(1) + ' ms');
        ctx.stat(L('지터 (표준편차)', 'Jitter (std dev)'), sdv.toFixed(1) + ' ms');
        ctx.stat(L('최대 지연', 'Max delay'), mx.toFixed(1) + ' ms');
        snd.stat();
      },
      onPointer(type, m) {
        if (type !== 'down' || !lay) return;
        const s = Math.floor((m.x - lay.gx) / lay.cw), k = Math.floor((m.y - TOP - lay.gy) / lay.rh);
        if (s >= 0 && s < 16 && k >= 0 && k < 4) pat[k][s] = pat[k][s] ? 0 : 1;
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
    return inst;
  },
});
