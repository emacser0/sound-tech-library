// 퀀타이즈와 휴머나이즈: 사람이 친 그대로 vs 격자 쪽으로 당기기(강도 %) + 작은 무작위 흔들림 더하기
GTL.register({
  id: 'quantize-humanize',
  title: '퀀타이즈와 휴머나이즈',
  summary: '사람이 연주한 드럼은 박자에서 조금씩 어긋남. 퀀타이즈는 음을 격자 쪽으로 당기고, 강도를 100% 미만으로 두면 연주 느낌이 남음. 휴머나이즈는 반대로 기계적인 패턴에 작은 흔들림을 더함.',
  views: { a: '연주 그대로', b: '퀀타이즈 75%' },
  info: `
    <p>MIDI로 녹음한 연주는 사람의 타이밍 오차를 그대로 가짐. <b>퀀타이즈(Quantize)</b>는 각 음의 시작 시각을 가장 가까운 격자(16분음표 등) 쪽으로 옮기는 기능.</p>
    <ul>
      <li><b>강도(Strength)</b>: 새 시각 = 원래 시각 + 강도 × (격자 - 원래 시각). 100%면 격자에 딱 붙고, 50%면 오차가 절반으로 줄어듦.</li>
      <li><b>격자 선택이 중요</b>: 16분음표로 친 음을 8분음표 격자로 퀀타이즈하면 엉뚱한 칸으로 끌려감</li>
      <li>오차가 격자 간격의 절반을 넘으면 이웃 칸으로 붙어 버림. 그래서 많은 DAW가 "창(window)" 옵션으로 너무 먼 음은 그대로 둠.</li>
    </ul>
    <p><b>휴머나이즈(Humanize)</b>는 반대 방향. 격자에 딱 맞은 음에 작은 무작위 시간 오차와 세기(velocity) 변화를 더해 기계 느낌을 줄임. 다만 순수한 무작위는 실제 연주자의 일관된 밀고 당김(예: 스네어를 늘 조금 늦게)과 다름.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="16" class="t-small t-dim">${L('격자선 사이에서 음 하나의 위치', 'Position of one note between grid lines')}</text>
    <line x1="80" y1="30" x2="80" y2="140" class="d-line"/><line x1="400" y1="30" x2="400" y2="140" class="d-line"/>
    <text x="80" y="154" text-anchor="middle" class="t-small">${L('격자', 'grid')}</text><text x="400" y="154" text-anchor="middle" class="t-small">${L('다음 격자', 'next grid')}</text>
    <circle cx="170" cy="50" r="7" class="f-a"/><text x="184" y="54" class="t-small t-a">${L('연주한 위치 (오차 90)', 'played (error 90)')}</text>
    <circle cx="125" cy="85" r="7" class="f-b"/><text x="139" y="89" class="t-small t-b">${L('강도 50%: 오차 45', '50% strength: error 45')}</text>
    <circle cx="80" cy="120" r="7" class="f-b"/><text x="94" y="124" class="t-small t-b">${L('강도 100%: 격자에 붙음', '100% strength: on the grid')}</text>
    <line x1="240" y1="30" x2="240" y2="140" class="d-dim" stroke-dasharray="3 3"/>
    <text x="246" y="118" class="t-small t-dim">${L('절반 지점: 넘으면 다음 격자로 감', 'halfway: past it, the note goes to the next grid')}</text>
  </svg>`,
  look: [
    'A의 원은 격자선(세로줄) 주변에 흩어져 있음. B는 격자 쪽으로 당겨지고 회색 선이 이동 거리를 보여줌.',
    'B의 퀀타이즈 강도를 100%로 올리면 오차가 0이 되고 소리가 기계적으로 들림',
    '"연주 오차 (ms)"를 60 이상으로 올리면 빨간 원이 생김. 격자 절반을 넘어 다른 칸으로 붙은 음.',
    '격자를 8분음표로 바꾸면 16분음표 자리의 킥이 엉뚱한 칸으로 끌려가 빨간색이 됨',
    '강도 100%에서 휴머나이즈를 6ms 정도 넣으면 격자 주변에 작게 흩어짐. 소리는 덜 딱딱해짐.',
  ],
  refs: [
    { type: 'engine', title: 'Ableton Live Reference Manual, "Quantizing MIDI Notes"', url: 'https://www.ableton.com/en/live-manual/', note: '격자, 강도(Amount) 설정' },
    { type: 'engine', title: 'Steinberg Cubase Operation Manual, "Quantizing MIDI and Audio" (Quantize Panel)', note: '강도, 스윙, 캡처 범위(iterative, magnetic) 옵션' },
    { type: 'paper', title: 'Holger Hennig et al., "The Nature and Perception of Fluctuations in Human Musical Rhythms", PLoS ONE 6(10)', year: 2011, note: '사람 연주의 타이밍 오차는 상관이 있는 1/f 형태. 단순 무작위 휴머나이즈보다 선호됨.' },
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', year: 1996, note: 'MIDI 시퀀서의 퀀타이즈' },
  ],
  params: [
    { key: 'strength', label: '퀀타이즈 강도 (%)', type: 'range', min: 0, max: 100, step: 1, a: 0, b: 75, default: 0, group: '퀀타이즈' },
    { key: 'grid', label: '격자', type: 'select', options: [{ value: 16, label: '16분음표' }, { value: 8, label: '8분음표' }], default: 16, shared: true },
    { key: 'human', label: '휴머나이즈 시간 (ms)', type: 'range', min: 0, max: 20, step: 0.5, default: 0, group: '휴머나이즈', help: '퀀타이즈 뒤에 더하는 무작위 오차의 표준편차' },
    { key: 'humanVel', label: '휴머나이즈 세기 (%)', type: 'range', min: 0, max: 40, step: 1, default: 0 },
    { key: 'sloppy', label: '연주 오차 (ms)', type: 'range', min: 0, max: 80, step: 1, default: 22, shared: true, group: '연주', help: '녹음된 연주의 타이밍 오차 표준편차' },
    { key: 'bpm', label: '템포 (BPM)', type: 'int', min: 70, max: 140, default: 96, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Quantize & Humanize',
    summary: 'A human drum take drifts a little off the beat. Quantize pulls notes toward the grid. Below 100% strength some of the human feel stays. Humanize goes the other way and adds small wobbles to a mechanical pattern.',
    views: { a: 'As played', b: 'Quantize 75%' },
    info: `
    <p>A recorded MIDI take keeps the player's timing errors. <b>Quantize</b> moves the start of each note toward the nearest grid line (16th note and so on).</p>
    <ul>
      <li><b>Strength</b>: new time = old time + strength × (grid - old time). At 100% notes sit on the grid. At 50% the error is cut in half.</li>
      <li><b>The grid choice matters</b>: quantizing notes played as 16ths to an 8th grid drags them to the wrong place.</li>
      <li>If the error is more than half a grid step, the note snaps to the neighbor line. Many DAWs offer a "window" option that leaves far notes alone.</li>
    </ul>
    <p><b>Humanize</b> goes the other way. It adds small random timing errors and velocity changes to notes that sit on the grid, so they sound less mechanical. But pure randomness is not the same as a real player's steady push and pull (for example, a snare that is always a bit late).</p>`,
    look: [
      'A\'s circles are scattered around the grid lines. B pulls them toward the grid, and the gray lines show how far they moved.',
      'Raise B\'s quantize strength to 100%. The error becomes 0 and it sounds mechanical.',
      'Raise "Playing error (ms)" above 60. Red circles appear. These notes passed half a grid step and snapped to another line.',
      'Set the grid to 8th notes. The kick on a 16th position gets dragged to the wrong place and turns red.',
      'At 100% strength, add about 6 ms of humanize. Notes scatter a little around the grid and sound less stiff.',
    ],
    refs: ['Grid and amount settings.', 'Strength, swing and capture range (iterative, magnetic) options.', 'Human timing errors are correlated (1/f). Listeners prefer them over plain random humanize.', 'Quantize in MIDI sequencers.'],
    params: {
      strength: { label: 'Quantize strength (%)', group: 'Quantize' },
      grid: { label: 'Grid', options: { 16: '16th note', 8: '8th note' } },
      human: { label: 'Humanize time (ms)', group: 'Humanize', help: 'Std dev of the random error added after quantize' },
      humanVel: 'Humanize velocity (%)',
      sloppy: { label: 'Playing error (ms)', group: 'Performance', help: 'Std dev of the timing error in the recorded take' },
      bpm: 'Tempo (BPM)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const L = (k, e) => GTL.L(k, e);
    const col = ctx.side === 'a' ? C.a : C.b;
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
    // 의도한 2마디 패턴 (16분음표 칸 번호)
    const LANES = [
      { kind: 'kick', ko: '킥', en: 'Kick', steps: [0, 3, 8, 10, 16, 19, 24, 27, 29] },
      { kind: 'snare', ko: '스네어', en: 'Snare', steps: [4, 12, 20, 28, 31] },
      { kind: 'hat', ko: '하이햇', en: 'Hi-hat', steps: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30] },
    ];
    let key = '', notes = [];
    function compute() {
      const k = [P.strength, P.grid, P.human, P.humanVel, P.sloppy, P.bpm].join(',');
      if (k === key) return notes;
      key = k;
      const s16 = 60 / P.bpm / 4, loop = s16 * 32, gridDur = s16 * (16 / Number(P.grid));
      const rp = U.rng(ctx.seed * 17 + 5), rh = U.rng(ctx.seed * 29 + 11);
      notes = [];
      let drift = 0;
      LANES.forEach((ln, li) => ln.steps.forEach((st) => {
        const ideal = st * s16;
        drift = drift * 0.6 + rp.gauss() * 0.4; // 연주자의 오차는 앞 음과 조금 이어짐
        const played = ideal + drift * P.sloppy / 1000;
        const pvel = U.clamp(0.75 + (st % 4 === 0 ? 0.15 : -0.1) + rp.gauss() * 0.1, 0.2, 1);
        const grid = Math.round(played / gridDur) * gridDur;
        let t = played + (P.strength / 100) * (grid - played);
        let vel = pvel;
        const hg = rh.gauss(), hv = rh.gauss();
        t += hg * P.human / 1000;
        vel = U.clamp(vel * (1 + hv * P.humanVel / 100), 0.1, 1);
        const wrong = P.strength >= 50 && Math.abs(grid - ideal) > 1e-6;
        notes.push({ lane: li, kind: ln.kind, ideal, played, t: ((t % loop) + loop) % loop, tr: t, vel, wrong });
      }));
      return notes;
    }
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        runAudio(l, r, sr, n, (t0, t1, trig) => {
          const ns = compute(), loop = 60 / P.bpm / 4 * 32;
          loopEach(ns, loop, t0, t1, (e, t) => trig(e.kind, t, { vel: e.vel * (e.kind === 'hat' ? 0.8 : 1) }));
        });
      },
    });

    const inst = {
      update(dt) { tick(dt); },
      render() { ctx.g.save(); ctx.g.translate(0, TOP); try { inst.drawView(); } finally { ctx.g.restore(); } },
      drawView() {
        const g = ctx.g, W = ctx.width, H = ctx.height - TOP, pad = 10;
        const ns = compute(), s16 = 60 / P.bpm / 4, loop = s16 * 32, gridDur = s16 * (16 / Number(P.grid));
        const gx = pad + 52, gw = W - gx - pad, ty = pad + 18;
        const lh = Math.min(56, (H - 120) / 3.6), vy = ty + lh * 3 + 24, vh = Math.max(30, H - vy - 26);
        const X = (t) => gx + (t / loop) * gw;
        D.text(g, L('2마디. 세로줄 = 격자, 흐린 원 = 연주 위치, 진한 원 = 결과', '2 bars. Lines = grid, faint circle = played, solid = result'), pad, pad, { size: 10, color: C.dim });
        for (let t = 0; t <= loop + 1e-9; t += gridDur) D.line(g, X(t), ty, X(t), ty + lh * 3, Math.abs((t / (s16 * 4)) % 1) < 1e-6 ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)', 1);
        LANES.forEach((ln, li) => D.text(g, L(ln.ko, ln.en), pad, ty + li * lh + lh / 2 - 6, { size: 11 }));
        const ph = clock.t % loop;
        let sumErr = 0, maxErr = 0, wrong = 0, vs = 0, vs2 = 0;
        for (const nt of ns) {
          const y = ty + nt.lane * lh + lh / 2;
          const xp = X(((nt.played % loop) + loop) % loop), xr = X(nt.t);
          if (Math.abs(xp - xr) > 1) D.line(g, xp, y, xr, y, 'rgba(255,255,255,0.35)', 1);
          D.circle(g, xp, y, 4, null, 'rgba(255,255,255,0.35)', 1);
          const hot = Math.abs(ph - nt.t) < 0.04;
          D.circle(g, xr, y, 5, nt.wrong ? C.bad : hot ? '#fff' : col);
          const err = Math.abs(nt.tr - nt.ideal) * 1000;
          sumErr += err; maxErr = Math.max(maxErr, err); if (nt.wrong) wrong++;
          vs += nt.vel; vs2 += nt.vel * nt.vel;
          // 세기 막대
          D.rect(g, xr - 1.5, vy + vh - nt.vel * (vh - 12), 3, nt.vel * (vh - 12), nt.wrong ? C.bad : col);
        }
        D.line(g, X(ph), ty - 4, X(ph), vy + vh, C.warn, 1);
        D.rect(g, gx, vy, gw, vh, null, C.grid, 1);
        D.text(g, L('세기 (velocity)', 'Velocity'), pad, vy + 2, { size: 10, color: C.dim });
        const m = vs / ns.length, sdv = Math.sqrt(Math.max(0, vs2 / ns.length - m * m));
        ctx.stat(L('평균 오차 (의도한 칸 기준)', 'Mean error (vs intended step)'), (sumErr / ns.length).toFixed(1) + ' ms');
        ctx.stat(L('최대 오차', 'Max error'), maxErr.toFixed(1) + ' ms');
        ctx.stat(L('다른 칸으로 붙은 음', 'Notes snapped to a wrong step'), wrong);
        ctx.stat(L('세기 표준편차', 'Velocity std dev'), (sdv * 127).toFixed(1) + ' / 127');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
    return inst;
  },
});
