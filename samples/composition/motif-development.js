// 동기 발전: 원래 동기 vs 변형(이조, 전위, 역행, 역행 전위, 확대, 축소, 반복 진행)
GTL.register({
  id: 'motif-development',
  title: '동기 발전 (전위, 역행, 확대)',
  summary: '짧은 동기 하나를 규칙대로 바꿔 새 재료를 만드는 기법 비교. 전위는 위아래를 뒤집고, 역행은 시간을 뒤집고, 확대는 길이를 늘림. 바뀐 선율도 원래 동기와 같은 뿌리로 들림.',
  views: { a: '원래 동기', b: '전위 (위아래 뒤집기)' },
  info: `
    <p><b>동기(Motif)</b>는 곡의 재료가 되는 짧은 음형. 작곡가는 동기를 그대로 반복하기보다 규칙대로 바꿔서 통일감과 변화를 함께 얻음. 바흐의 푸가, 베토벤의 교향곡, 12음 기법이 모두 이 방식을 씀.</p>
    <ul>
      <li><b>이조(Transposition)</b>: 모든 음을 같은 만큼 올리거나 내림</li>
      <li><b>전위(Inversion)</b>: 첫 음을 축으로 음정 방향을 뒤집음. 위로 3도는 아래로 3도가 됨.</li>
      <li><b>역행(Retrograde)</b>: 끝에서부터 거꾸로 연주</li>
      <li><b>역행 전위</b>: 전위한 것을 다시 역행</li>
      <li><b>확대, 축소(Augmentation, Diminution)</b>: 모든 길이를 2배 또는 1/2배</li>
      <li><b>반복 진행(Sequence)</b>: 동기를 한 단계씩 낮추거나 높여 여러 번 반복</li>
    </ul>
    <p><b>온음계(diatonic)</b> 방식은 음계의 칸 수로 계산해서 조성 안에 머묾. <b>반음계(chromatic)</b> 방식은 반음 수로 계산해서 정확히 같은 음정이지만 조성 밖의 음이 생길 수 있음.</p>`,
  diagram: (L) => {
    const pts = [[0, 0], [1, 2], [1.5, 3], [2, 4], [3, 2], [4, 1], [4.5, 2], [5, 0]];
    const path = (f) => pts.map(([t, d], i) => `${i ? 'L' : 'M'}${f(t, d)}`).join(' ');
    return `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <text x="20" y="16" class="t-small t-a">${L('원래', 'Original')}</text>
    <path d="${path((t, d) => `${20 + t * 22},${90 - d * 14}`)}" class="d-a"/>
    <text x="160" y="16" class="t-small t-b">${L('전위 (축 = 첫 음)', 'Inversion (axis = first note)')}</text>
    <line x1="150" y1="90" x2="290" y2="90" class="d-dim" stroke-dasharray="3 3"/>
    <path d="${path((t, d) => `${160 + t * 22},${90 + d * 14}`)}" class="d-b"/>
    <text x="320" y="16" class="t-small t-b">${L('역행 (시간 뒤집기)', 'Retrograde (time reversed)')}</text>
    <path d="${path((t, d) => `${320 + (5 - t) * 22},${90 - d * 14}`)}" class="d-b"/>
    <text x="270" y="150" text-anchor="middle" class="t-small t-dim">${L('가로 = 시간, 세로 = 음 높이 (음계 칸)', 'Horizontal = time, vertical = pitch (scale steps)')}</text>
    </svg>`;
  },
  look: [
    'B의 흐린 테두리가 원래 동기. 전위는 점선(축)을 기준으로 위아래가 뒤집힌 모양.',
    '변형을 "역행"으로 바꾸면 그림이 좌우로 뒤집힘. 음정 목록도 거꾸로 되고 부호가 바뀜.',
    '"온음계"를 끄고 전위하면 Eb처럼 조성 밖의 음이 생김 (빨간 막대)',
    '"확대"는 막대가 2배 길어지고, "반복 진행"은 같은 모양이 한 칸씩 내려가며 3번 나옴',
  ],
  refs: [
    { type: 'book', title: 'Arnold Schoenberg, Fundamentals of Musical Composition', year: 1967, note: '동기, 동기 변형, 악절 구성' },
    { type: 'book', title: 'Edward Aldwell, Carl Schachter, Harmony and Voice Leading', year: 2010, note: '반복 진행(sequence)과 온음계 이조' },
    { type: 'book', title: 'Dmitri Tymoczko, A Geometry of Music', year: 2011, note: '이조와 전위를 음 공간의 기하 변환으로 설명' },
  ],
  params: [
    { key: 'op', label: '변형', type: 'select', options: [{ value: 'orig', label: '원래 동기' }, { value: 'trans', label: '이조' }, { value: 'inv', label: '전위' }, { value: 'retro', label: '역행' }, { value: 'ri', label: '역행 전위' }, { value: 'aug', label: '확대 (×2)' }, { value: 'dim', label: '축소 (×1/2)' }, { value: 'seq', label: '반복 진행' }], a: 'orig', b: 'inv', group: '동기' },
    { key: 'shift', label: '이조 크기', type: 'int', min: -7, max: 7, default: 3, help: '온음계면 음계 칸 수, 아니면 반음 수', when: (p) => p.op === 'trans' || p.op === 'seq' },
    { key: 'diatonic', label: '온음계 (C장조 안에서)', type: 'bool', default: true, shared: true },
    { key: 'bpm', label: '템포 (BPM)', type: 'int', min: 60, max: 160, default: 100, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Motif Development (Inversion, Retrograde, Augmentation)',
    summary: 'Ways to turn one short motif into new material with fixed rules. Inversion flips it up and down, retrograde flips it in time, augmentation stretches it. The changed lines still sound related to the original.',
    views: { a: 'Original motif', b: 'Inversion (flipped)' },
    info: `
    <p>A <b>motif</b> is a short figure that a piece is built from. Composers rarely repeat a motif as is. They change it with rules to get both unity and variety. Bach's fugues, Beethoven's symphonies and twelve-tone music all work this way.</p>
    <ul>
      <li><b>Transposition</b>: move every note up or down by the same amount.</li>
      <li><b>Inversion</b>: flip interval directions around the first note. A 3rd up becomes a 3rd down.</li>
      <li><b>Retrograde</b>: play it backward from the end.</li>
      <li><b>Retrograde inversion</b>: the inversion played backward.</li>
      <li><b>Augmentation, diminution</b>: multiply every length by 2 or 1/2.</li>
      <li><b>Sequence</b>: repeat the motif several times, one step lower or higher each time.</li>
    </ul>
    <p>The <b>diatonic</b> method counts scale steps, so it stays in the key. The <b>chromatic</b> method counts semitones, so the intervals are exact but notes outside the key can appear.</p>`,
    look: [
      'The faint outline in B is the original motif. Inversion flips it up and down around the dashed line (axis).',
      'Set the change to "Retrograde". The picture flips left to right. The interval list reverses and changes sign.',
      'Turn "Diatonic" off and invert. A note outside the key (Eb) appears (red bar).',
      '"Augmentation" makes bars twice as long. "Sequence" plays the same shape 3 times, one step lower each time.',
    ],
    refs: ['Motif, motif variation, phrase building.', 'Sequences and diatonic transposition.', 'Transposition and inversion as geometric moves in pitch space.'],
    params: {
      op: { label: 'Change', group: 'Motif', options: { orig: 'Original', trans: 'Transposition', inv: 'Inversion', retro: 'Retrograde', ri: 'Retrograde inversion', aug: 'Augmentation (×2)', dim: 'Diminution (×1/2)', seq: 'Sequence' } },
      shift: { label: 'Transpose amount', help: 'Scale steps if diatonic, otherwise semitones' },
      diatonic: 'Diatonic (in C major)',
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
    // 원래 동기: [MIDI, 시작 박, 길이 박]
    const MOTIF = [[67, 0, 1], [71, 1, 0.5], [72, 1.5, 0.5], [74, 2, 1], [71, 3, 1], [69, 4, 0.5], [71, 4.5, 0.5], [67, 5, 1]];
    const MLEN = 6;
    const SC = [0, 2, 4, 5, 7, 9, 11];
    const toDeg = (m) => { const o = Math.floor(m / 12), pc = m - o * 12; let i = SC.indexOf(pc); if (i < 0) i = SC.findIndex((x) => x > pc) - 1; return o * 7 + i; };
    const fromDeg = (d) => { const o = Math.floor(d / 7), i = d - o * 7; return o * 12 + SC[i]; };
    function transform(op) {
      const dia = P.diatonic, axis = MOTIF[0][0], axisD = toDeg(axis);
      const mv = (m, k) => (dia ? fromDeg(toDeg(m) + k) : m + k);
      const inv = (m) => (dia ? fromDeg(2 * axisD - toDeg(m)) : 2 * axis - m);
      const rev = (ns, len) => ns.map(([m, t, d]) => [m, len - t - d, d]).sort((a, b) => a[1] - b[1]);
      let ns = MOTIF.map((n) => n.slice()), len = MLEN;
      switch (op) {
        case 'trans': ns = ns.map(([m, t, d]) => [mv(m, P.shift), t, d]); break;
        case 'inv': ns = ns.map(([m, t, d]) => [inv(m), t, d]); break;
        case 'retro': ns = rev(ns, len); break;
        case 'ri': ns = rev(ns.map(([m, t, d]) => [inv(m), t, d]), len); break;
        case 'aug': ns = ns.map(([m, t, d]) => [m, t * 2, d * 2]); len *= 2; break;
        case 'dim': ns = ns.map(([m, t, d]) => [m, t / 2, d / 2]); len /= 2; break;
        case 'seq': {
          const st = P.shift === 0 ? -1 : -Math.sign(P.shift) * Math.min(2, Math.abs(P.shift));
          const out = [];
          for (let k = 0; k < 3; k++) for (const [m, t, d] of MOTIF) out.push([mv(m, st * k), t + k * MLEN, d]);
          ns = out; len = MLEN * 3; break;
        }
      }
      return { ns, len };
    }
    const cur = () => transform(P.op);
    const loopBeats = (len) => Math.ceil(len + 2);
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        runAudio(l, r, sr, n, (t0, t1, trig) => {
          const beat = 60 / P.bpm, { ns, len } = cur(), lb = loopBeats(len) * beat;
          const evs = ns.map(([m, t, d]) => ({ t: t * beat, m, d: d * beat }));
          loopEach(evs, lb, t0, t1, (e, t) => trig('tone', t, { f: A.mtof(e.m), dur: e.d * 0.85, vel: 0.8, cut: 0.16 }));
          for (let i = Math.ceil(t0 / beat - 1e-9); i * beat < t1; i++) if (i * beat >= t0) trig('hat', i * beat, { vel: 0.2 });
        });
      },
    });

    const inst = {
      update(dt) { tick(dt); },
      render() { ctx.g.save(); ctx.g.translate(0, TOP); try { inst.drawView(); } finally { ctx.g.restore(); } },
      drawView() {
        const g = ctx.g, W = ctx.width, H = ctx.height - TOP, pad = 10;
        const { ns, len } = cur(), beat = 60 / P.bpm, lb = loopBeats(len), pos = (clock.t / beat) % lb;
        const all = ns.map((n) => n[0]).concat(MOTIF.map((n) => n[0]));
        const lo = Math.min(...all) - 2, hi = Math.max(...all) + 2;
        const span = Math.max(lb, loopBeats(MLEN));
        const rx = pad + 30, ry = pad + 16, rw = W - rx - pad, rh = Math.max(80, H - ry - 70);
        const rowH = rh / (hi - lo + 1);
        const X = (b) => rx + (b / span) * rw, Y = (m) => ry + rh - (m - lo + 1) * rowH;
        D.rect(g, rx, ry, rw, rh, 'rgba(0,0,0,0.3)');
        for (let m = lo; m <= hi; m++) {
          if (A.isBlackKey(m)) D.rect(g, rx, Y(m), rw, rowH, 'rgba(255,255,255,0.03)');
          if (A.pitchClass(m) === 0 || A.pitchClass(m) === 7) D.text(g, A.noteName(m), pad, Y(m) + rowH / 2 - 5, { size: 9, color: C.dim });
        }
        for (let b = 0; b <= span; b++) D.line(g, X(b), ry, X(b), ry + rh, b % 4 === 0 ? 'rgba(255,255,255,0.18)' : C.grid, 1);
        if (P.op !== 'orig') for (const [m, t, d] of MOTIF) D.rect(g, X(t) + 1, Y(m) + 1, (d / span) * rw - 2, rowH - 2, null, 'rgba(255,255,255,0.35)', 1);
        if (P.op === 'inv' || P.op === 'ri') { const y = Y(MOTIF[0][0]) + rowH / 2; g.setLineDash([4, 3]); D.line(g, rx, y, rx + rw, y, C.warn, 1); g.setLineDash([]); }
        let outKey = 0;
        for (const [m, t, d] of ns) {
          const on = pos >= t && pos < t + d, out = A.isBlackKey(m);
          if (out) outKey++;
          D.rect(g, X(t) + 1, Y(m) + 1, (d / span) * rw - 2, rowH - 2, on ? '#fff' : out ? C.bad : col);
        }
        D.line(g, X(pos), ry, X(pos), ry + rh, C.warn, 1.5);
        const ivs = (arr) => arr.slice(1).map((n, i) => n[0] - arr[i][0]).map((v) => (v > 0 ? '+' : '') + v).join(' ');
        D.text(g, L('원래 음정: ', 'Original intervals: ') + ivs(MOTIF), pad, ry + rh + 10, { size: 11, color: C.dim });
        D.text(g, L('결과 음정: ', 'Result intervals: ') + ivs(ns), pad, ry + rh + 28, { size: 11, color: col });
        ctx.stat(L('음 수', 'Notes'), ns.length);
        ctx.stat(L('길이', 'Length'), len + L(' 박', ' beats'));
        ctx.stat(L('음역', 'Range'), `${A.noteName(Math.min(...ns.map((n) => n[0])))}~${A.noteName(Math.max(...ns.map((n) => n[0])))}`);
        ctx.stat(L('조성 밖의 음', 'Notes outside the key'), outKey);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
    return inst;
  },
});
