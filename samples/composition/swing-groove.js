// 스윙: 똑같은 간격(50%) vs MPC 방식 스윙 비율(예: 62%)로 뒷박 16분음표를 늦춤
GTL.register({
  id: 'swing-groove',
  title: '스윙 그루브 (스윙 비율)',
  summary: '16분음표 두 개를 한 쌍으로 보고 뒤 음을 늦추는 스윙 비교. 50%는 똑같은 간격이라 기계적으로 들림. 55~70%로 늦추면 몸이 흔들리는 그루브가 생김.',
  views: { a: '스윙 없음 (50%)', b: '스윙 62%' },
  info: `
    <p><b>스윙(Swing)</b>은 같은 길이로 적힌 음 두 개 중 앞 음을 길게, 뒤 음을 짧게 연주하는 방식. 재즈, 셔플, 힙합, 하우스의 그루브를 만드는 핵심.</p>
    <p>드럼 머신과 DAW는 스윙을 <b>퍼센트</b>로 나타냄. Roger Linn이 LinnDrum과 MPC에 넣은 방식.</p>
    <ul>
      <li>한 쌍(예: 8분음표 하나 길이)의 시작을 0%, 끝을 100%로 봄</li>
      <li>뒤 음이 놓이는 위치가 스윙 값. 50% = 똑같은 간격, 66.7% = 셋잇단 셔플 (2:1), 75% = 점음표 (3:1).</li>
      <li>앞 음 : 뒤 음 길이 비 = s : (100 - s). 62%면 약 1.6:1.</li>
      <li>실제 연주의 스윙은 템포에 따라 바뀜. 빠를수록 비율이 1:1에 가까워지는 경향.</li>
    </ul>
    <p>스윙은 칸 단위 시퀀서에서 거의 공짜로 넣을 수 있음. 짝수 번째가 아닌 칸(뒷박)의 발음 시각에만 지연을 더하면 됨.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="16" class="t-small t-dim">${L('16분음표 한 쌍 (8분음표 길이)', 'One pair of 16th notes (an 8th-note span)')}</text>
    <line x1="60" y1="40" x2="480" y2="40" class="d-dim"/>
    <line x1="60" y1="30" x2="60" y2="150" class="d-line"/><line x1="480" y1="30" x2="480" y2="150" class="d-line"/>
    <text x="60" y="164" text-anchor="middle" class="t-small">0%</text><text x="480" y="164" text-anchor="middle" class="t-small">100%</text>
    <rect x="58" y="56" width="5" height="18" class="f-a"/><rect x="268" y="56" width="5" height="18" class="f-a"/>
    <text x="290" y="70" class="t-small t-a">${L('50%: 똑같은 간격 (1:1)', '50%: even (1:1)')}</text>
    <rect x="58" y="86" width="5" height="18" class="f-b"/><rect x="318" y="86" width="5" height="18" class="f-b"/>
    <text x="340" y="100" class="t-small t-b">${L('62%: MPC 스윙 (약 1.6:1)', '62%: MPC swing (about 1.6:1)')}</text>
    <rect x="58" y="116" width="5" height="18" class="f-accent"/><rect x="338" y="116" width="5" height="18" class="f-accent"/>
    <text x="360" y="130" class="t-small">${L('66.7%: 셋잇단 셔플 (2:1)', '66.7%: triplet shuffle (2:1)')}</text>
    <line x1="270" y1="30" x2="270" y2="150" class="d-dim" stroke-dasharray="3 3"/>
  </svg>`,
  look: [
    '"소리 켜기"를 누르고 A와 B를 번갈아 들으면 B의 하이햇이 통통 튀는 느낌이 남',
    'B의 스윙을 66%로 올리면 셔플(셋잇단) 느낌이 됨. 75%면 점음표 리듬처럼 절뚝거림.',
    '스윙 단위를 8분음표로 바꾸면 늦춰지는 음이 16분음표 자리에서 8분음표 자리로 옮겨감',
    '아래 그래프의 막대 높이가 늦춘 시간. 템포를 올리면 같은 퍼센트라도 ms 값이 줄어듦.',
  ],
  refs: [
    { type: 'article', title: "Roger Linn on Swing, Groove & the Magic of the MPC's Timing (Attack Magazine)", year: 2013, note: 'LinnDrum과 MPC의 스윙 퍼센트 설계 설명' },
    { type: 'paper', title: 'Fernando Benadon, "Slicing the Beat: Jazz Eighth-Notes as Expressive Microrhythm", Ethnomusicology 50(1)', year: 2006, note: '재즈 연주의 실제 스윙 비율 측정' },
    { type: 'paper', title: 'Anders Friberg, Andreas Sundström, "Swing Ratios and Ensemble Timing in Jazz Performance", Music Perception 19(3)', year: 2002, note: '템포가 빠를수록 스윙 비율이 작아지는 경향' },
    { type: 'engine', title: 'Akai Professional MPC Owner\'s Manual (Swing / Timing Correct)', note: '50~75% 스윙 값과 16분음표, 8분음표 단위' },
  ],
  params: [
    { key: 'swing', label: '스윙 (%)', type: 'range', min: 50, max: 75, step: 0.5, a: 50, b: 62, default: 50, group: '그루브' },
    { key: 'unit', label: '스윙 단위', type: 'select', options: [{ value: 16, label: '16분음표' }, { value: 8, label: '8분음표' }], default: 16, shared: true },
    { key: 'bpm', label: '템포 (BPM)', type: 'int', min: 60, max: 140, default: 92, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Swing Groove (Swing Ratio)',
    summary: 'Swing treats two 16th notes as a pair and delays the second one. At 50% the gaps are equal and it sounds mechanical. Delaying it to 55~70% gives a groove that makes you move.',
    views: { a: 'No swing (50%)', b: 'Swing 62%' },
    info: `
    <p><b>Swing</b> plays two equally written notes as long then short. It is the core of the groove in jazz, shuffle, hip hop and house.</p>
    <p>Drum machines and DAWs give swing as a <b>percent</b>. Roger Linn put this method into the LinnDrum and the MPC.</p>
    <ul>
      <li>The start of a pair (for example one 8th-note span) is 0% and the end is 100%.</li>
      <li>The swing value is where the second note lands. 50% = even, 66.7% = triplet shuffle (2:1), 75% = dotted (3:1).</li>
      <li>Long : short ratio = s : (100 - s). At 62% it is about 1.6:1.</li>
      <li>Real players change swing with tempo. Faster tempos tend toward 1:1.</li>
    </ul>
    <p>Swing is almost free in a step sequencer. Add a delay only to the off-beat steps.</p>`,
    look: [
      'Press "Sound on" and switch between A and B. B\'s hi-hats bounce.',
      'Raise B\'s swing to 66%. It feels like a triplet shuffle. At 75% it limps like a dotted rhythm.',
      'Set the swing unit to 8th notes. The delayed notes move from 16th positions to 8th positions.',
      'The bar height in the lower graph is the delay. Raise the tempo. The same percent gives fewer ms.',
    ],
    refs: ['Roger Linn explains the swing percent design of the LinnDrum and MPC.', 'Measured swing ratios in jazz performance.', 'Swing ratio gets smaller at faster tempos.', '50~75% swing on 16th or 8th notes.'],
    params: {
      swing: { label: 'Swing (%)', group: 'Groove' },
      unit: { label: 'Swing unit', options: { 16: '16th note', 8: '8th note' } },
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
    // 한 마디 16칸 패턴
    const TR = [
      { kind: 'kick', ko: '킥', en: 'Kick', p: '1000000010100000' },
      { kind: 'snare', ko: '스네어', en: 'Snare', p: '0000100000001001' },
      { kind: 'hat', ko: '하이햇', en: 'Hi-hat', p: '1111111111111111' },
    ];
    const s16 = () => 60 / P.bpm / 4;
    // 칸 s의 스윙 지연(초)
    function delay(s) {
      const u = Number(P.unit), pairSteps = u === 16 ? 2 : 4; // 한 쌍이 차지하는 16분 칸 수
      const half = pairSteps / 2;
      if (s % pairSteps !== half) return 0;
      return (P.swing / 100 - 0.5) * pairSteps * s16();
    }
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        runAudio(l, r, sr, n, (t0, t1, trig) => {
          const sd = s16();
          for (let idx = Math.max(0, Math.floor(t0 / sd) - 4); idx * sd < t1; idx++) {
            const s = idx % 16, t = idx * sd + delay(s);
            if (t < t0 || t >= t1) continue;
            TR.forEach((tr) => { if (tr.p[s] === '1') trig(tr.kind, t, { vel: tr.kind === 'hat' ? (s % 2 ? 0.5 : 0.9) : tr.kind === 'snare' && s % 4 ? 0.35 : 1 }); });
          }
        });
      },
    });

    const inst = {
      update(dt) { tick(dt); },
      render() { ctx.g.save(); ctx.g.translate(0, TOP); try { inst.drawView(); } finally { ctx.g.restore(); } },
      drawView() {
        const g = ctx.g, W = ctx.width, H = ctx.height - TOP, pad = 10, sd = s16(), bar = sd * 16;
        const pos = (clock.t % bar) / bar;
        const gx = pad + 52, gw = W - gx - pad;
        D.text(g, L('한 마디 (회색 눈금 = 똑같은 16분음표 격자)', 'One bar (gray ticks = even 16th grid)'), pad, pad, { size: 10, color: C.dim });
        const ty = pad + 18, rh = Math.min(34, (H * 0.45) / 3);
        for (let s = 0; s <= 16; s++) D.line(g, gx + (s / 16) * gw, ty, gx + (s / 16) * gw, ty + rh * 3, s % 4 === 0 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)', 1);
        TR.forEach((tr, k) => {
          D.text(g, L(tr.ko, tr.en), pad, ty + k * rh + rh / 2 - 6, { size: 11 });
          for (let s = 0; s < 16; s++) {
            if (tr.p[s] !== '1') continue;
            const x = gx + ((s * sd + delay(s)) / bar) * gw, hot = Math.abs(pos * bar - (s * sd + delay(s))) < sd * 0.4;
            D.rect(g, x - 2, ty + k * rh + 4, 5, rh - 8, hot ? '#fff' : col);
          }
        });
        D.line(g, gx + pos * gw, ty - 4, gx + pos * gw, ty + rh * 3 + 4, C.warn, 1.5);
        // 확대: 한 쌍의 위치
        const zy = ty + rh * 3 + 30, zw = W - pad * 2 - 40, zx = pad + 20;
        const u = Number(P.unit);
        D.text(g, L(`한 쌍 확대 (${u === 16 ? '16분음표 2개' : '8분음표 2개'})`, `One pair zoomed (${u === 16 ? 'two 16ths' : 'two 8ths'})`), pad, zy - 18, { size: 10, color: C.dim });
        D.line(g, zx, zy + 14, zx + zw, zy + 14, C.dim, 1);
        D.line(g, zx, zy, zx, zy + 28, C.text, 1.5); D.line(g, zx + zw, zy, zx + zw, zy + 28, C.text, 1.5);
        D.line(g, zx + zw / 2, zy, zx + zw / 2, zy + 28, C.dim, 1);
        D.line(g, zx + zw * 2 / 3, zy + 4, zx + zw * 2 / 3, zy + 24, C.accent, 1);
        D.text(g, L('셋잇단', 'triplet'), zx + zw * 2 / 3 + 3, zy + 30, { size: 9, color: C.accent });
        D.text(g, '50%', zx + zw / 2 - 10, zy + 30, { size: 9, color: C.dim });
        D.rect(g, zx - 3, zy + 2, 6, 24, col);
        D.rect(g, zx + zw * P.swing / 100 - 3, zy + 2, 6, 24, col);
        // 템포별 지연 그래프 (현재 스윙 값)
        const gy = zy + 56, gh = Math.max(30, H - gy - 24);
        const pairDur = (bpm) => (u === 16 ? 2 : 4) * 60 / bpm / 4;
        D.rect(g, pad, gy, W - pad * 2, gh, 'rgba(0,0,0,0.3)');
        D.text(g, L('템포별 뒤 음 지연 (ms), 60~140 BPM', 'Delay of the second note by tempo (ms), 60~140 BPM'), pad + 4, gy + 3, { size: 9, color: C.dim });
        const maxMs = 0.25 * pairDur(60) * 1000;
        for (let i = 0; i < 9; i++) {
          const bpm = 60 + i * 10, ms = (P.swing / 100 - 0.5) * pairDur(bpm) * 1000;
          const bw = (W - pad * 2) / 9, bh = (ms / maxMs) * (gh - 18);
          D.rect(g, pad + i * bw + 3, gy + gh - bh - 1, bw - 6, bh, Math.abs(bpm - P.bpm) < 5 ? '#fff' : col);
        }
        const dms = (P.swing / 100 - 0.5) * pairDur(P.bpm) * 1000;
        ctx.stat(L('뒤 음 지연', 'Second-note delay'), dms.toFixed(1) + ' ms');
        ctx.stat(L('앞 음 : 뒤 음 길이', 'Long : short'), (P.swing / (100 - P.swing)).toFixed(2) + ' : 1');
        ctx.stat(L('한 쌍 길이', 'Pair length'), (pairDur(P.bpm) * 1000).toFixed(0) + ' ms');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
    return inst;
  },
});
