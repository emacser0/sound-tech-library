// 폴리미터: 모든 트랙이 같은 길이로 반복 vs 트랙마다 다른 반복 길이(4, 3, 5칸). 칸 길이는 같음
GTL.register({
  id: 'polymeter',
  title: '폴리미터 (트랙별 반복 길이)',
  summary: '칸 길이는 같고 트랙마다 반복 길이만 다르게 둔 패턴. 모든 트랙이 4칸이면 매 마디가 같음. 4, 3, 5칸으로 두면 트랙끼리 엇갈리며 위치가 바뀌고, 전체 패턴은 최소공배수(60칸)가 지나야 처음으로 돌아옴.',
  views: { a: '같은 길이 (4, 4, 4)', b: '다른 길이 (4, 3, 5)' },
  info: `
    <p><b>폴리미터(Polymeter)</b>는 박(칸)의 길이는 같고 반복 단위가 다른 패턴을 겹치는 것. 폴리리듬은 같은 길이를 다른 수로 나누지만, 폴리미터는 같은 박 위에서 반복 길이만 다름.</p>
    <ul>
      <li>길이 3인 패턴을 4/4 위에서 돌리면 강세가 매 마디 한 칸씩 밀림 (3 against 4)</li>
      <li>전체가 처음 상태로 돌아오는 길이 = 각 길이의 최소공배수. 4, 3, 5면 60칸.</li>
      <li>짧은 재료 몇 개로 긴 변화를 만듦. 테크노, IDM, 스티브 라이히의 위상 음악, 모듈러 신스 시퀀서에서 자주 씀.</li>
    </ul>
    <p>구현은 단순함. 트랙마다 <code>step % length</code>로 자기 칸을 고르면 됨. Elektron, Ableton의 트랙별 길이 기능이 이 방식.</p>`,
  diagram: (L) => {
    const x0 = 110, cw = 30;
    const row = (y, len, n, cls) => Array.from({ length: n }, (_, i) => `<rect x="${x0 + i * cw}" y="${y}" width="${cw - 3}" height="20" class="${i % len === 0 ? cls : 'f-dim'}"/>`).join('');
    return `<svg viewBox="0 0 540 130" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="16" class="t-small t-dim">${L('같은 칸 길이, 다른 반복 길이 (칸 12개)', 'Same step length, different loop lengths (12 steps)')}</text>
    <text x="4" y="40">${L('길이 4', 'Length 4')}</text>${row(26, 4, 12, 'f-b')}
    <text x="4" y="70">${L('길이 3', 'Length 3')}</text>${row(56, 3, 12, 'f-a')}
    <text x="4" y="114" class="t-small t-dim">${L('색칠한 칸 = 각 트랙 패턴의 시작. 12칸 (LCM) 뒤에 다시 함께 시작.', 'Filled = start of each track\'s loop. They start together again after 12 steps (LCM).')}</text>
    </svg>`;
  },
  look: [
    'A는 매 마디 같은 그림이 반복됨. B는 트랙마다 시작 위치(밝은 칸)가 다른 칸에 놓이며 매 마디 바뀜.',
    '아래 "펼친 타임라인"에서 B의 벨 음이 마디마다 다른 칸으로 미끄러짐',
    'B의 길이를 4, 6, 8처럼 공약수가 큰 값으로 두면 전체 주기가 짧아짐 (최소공배수 24)',
    '"전체 주기"는 B에서 60칸(약 8초). 같은 재료로 A보다 15배 긴 변화.',
  ],
  refs: [
    { type: 'book', title: 'Justin London, Hearing in Time: Psychological Aspects of Musical Meter', year: 2004, note: '미터, 폴리미터와 폴리리듬의 구분' },
    { type: 'book', title: 'Godfried Toussaint, The Geometry of Musical Rhythm', year: 2013, note: '반복 길이가 다른 패턴의 조합' },
    { type: 'engine', title: 'Elektron Digitakt User Manual', note: 'SCALE 메뉴의 트랙별 길이(Per Track 모드)로 폴리미터 만들기' },
  ],
  params: [
    { key: 'len1', label: '킥 반복 길이', type: 'int', min: 2, max: 16, default: 4, group: '반복 길이 (칸)' },
    { key: 'len2', label: '클랩 반복 길이', type: 'int', min: 2, max: 16, a: 4, b: 3, default: 4 },
    { key: 'len3', label: '벨 반복 길이', type: 'int', min: 2, max: 16, a: 4, b: 5, default: 4 },
    { key: 'bpm', label: '템포 (BPM)', type: 'int', min: 70, max: 160, default: 112, shared: true, help: '한 칸 = 16분음표' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Polymeter (Per-Track Loop Length)',
    summary: 'All tracks use the same step length, but each one loops after a different number of steps. If every track loops at 4, every bar is the same. With 4, 3 and 5 the tracks shift against each other, and the whole pattern only returns after the LCM (60 steps).',
    views: { a: 'Same length (4, 4, 4)', b: 'Different lengths (4, 3, 5)' },
    info: `
    <p><b>Polymeter</b> layers patterns that share the beat (step) length but loop at different lengths. A polyrhythm splits one span into different counts. A polymeter keeps the beat and changes only the loop length.</p>
    <ul>
      <li>A 3-step pattern over 4/4 moves its accent by one step every bar (3 against 4).</li>
      <li>The whole pattern returns to its start after the LCM of the lengths. For 4, 3 and 5 it is 60 steps.</li>
      <li>A few short pieces make a long changing pattern. Techno, IDM, Steve Reich's phase music and modular sequencers use it often.</li>
    </ul>
    <p>It is easy to build. Each track picks its step with <code>step % length</code>. Per-track length in Elektron and Ableton devices works this way.</p>`,
    look: [
      'A repeats the same picture every bar. In B each track\'s start (bright cell) lands on a different step and changes every bar.',
      'In the "unrolled timeline" below, B\'s bell notes slide to a different step each bar.',
      'Set B\'s lengths to values with big common factors, like 4, 6 and 8. The full cycle gets shorter (LCM 24).',
      '"Full cycle" is 60 steps in B (about 8 s). The same material changes over a span 15 times longer than A.',
    ],
    refs: ['Meter, and the difference between polymeter and polyrhythm.', 'Combining patterns with different loop lengths.', 'Making polymeters with per-track length (Per Track mode in the SCALE menu).'],
    params: {
      len1: { label: 'Kick loop length', group: 'Loop length (steps)' },
      len2: 'Clap loop length',
      len3: 'Bell loop length',
      bpm: { label: 'Tempo (BPM)', help: 'One step = a 16th note' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const L = (k, e) => GTL.L(k, e);
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
    const gcd = (a, b) => (b ? gcd(b, a % b) : a), lcm = (a, b) => (a * b) / gcd(a, b);
    // 트랙 재료: 앞에서부터 길이만큼 잘라 반복
    const TR = [
      { kind: 'kick', ko: '킥', en: 'Kick', key: 'len1', src: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0], color: C.series[0] },
      { kind: 'clap', ko: '클랩', en: 'Clap', key: 'len2', src: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1], color: C.series[1] },
      { kind: 'bell', ko: '벨', en: 'Bell', key: 'len3', src: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1], color: C.series[2] },
    ];
    const BELL = [72, 75, 79, 82, 77, 84, 79, 75, 72, 77, 80, 84, 79, 75, 82, 77];
    const hitAt = (k, step) => { const len = P[TR[k].key], i = step % len; return TR[k].src[i] ? i : -1; };
    const sd = () => 60 / P.bpm / 4;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        runAudio(l, r, sr, n, (t0, t1, trig) => {
          const d = sd();
          for (let idx = Math.ceil(t0 / d - 1e-9); idx * d < t1; idx++) {
            const t = idx * d; if (t < t0) continue;
            TR.forEach((tr, k) => {
              const i = hitAt(k, idx);
              if (i < 0) return;
              if (tr.kind === 'bell') trig('bell', t, { f: A.mtof(BELL[i]), vel: i === 0 ? 0.9 : 0.6 });
              else trig(tr.kind, t, { vel: i === 0 ? 1 : 0.7 });
            });
            if (idx % 2 === 0) trig('hat', t, { vel: 0.25 });
          }
        });
      },
    });

    const inst = {
      update(dt) { tick(dt); },
      render() { ctx.g.save(); ctx.g.translate(0, TOP); try { inst.drawView(); } finally { ctx.g.restore(); } },
      drawView() {
        const g = ctx.g, W = ctx.width, H = ctx.height - TOP, pad = 10, d = sd();
        const step = Math.floor(clock.t / d);
        const full = TR.reduce((a, tr) => lcm(a, P[tr.key]), 1);
        const gx = pad + 46, cw = Math.min(26, (W - gx - pad) / 16);
        // 트랙별 루프
        D.text(g, L('트랙별 루프 (밝은 칸 = 지금)', 'Loop of each track (bright = now)'), pad, pad, { size: 10, color: C.dim });
        TR.forEach((tr, k) => {
          const y = pad + 16 + k * 26, len = P[tr.key], cur = step % len;
          D.text(g, L(tr.ko, tr.en), pad, y + 4, { size: 11, color: tr.color });
          for (let i = 0; i < len; i++) D.rect(g, gx + i * cw + 1, y, cw - 2, 20, i === cur ? '#fff' : tr.src[i] ? tr.color : 'rgba(255,255,255,0.08)');
        });
        // 펼친 타임라인: 4마디 (64칸), 마디마다 한 줄
        const ty = pad + 16 + 3 * 26 + 26, rows = 4, uw = (W - gx - pad) / 16;
        const rh = Math.max(24, Math.min(46, (H - ty - 30) / rows));
        const barNow = Math.floor(step / 16), first = Math.max(0, barNow - rows + 1);
        D.text(g, L('펼친 타임라인 (한 줄 = 한 마디 16칸)', 'Unrolled timeline (one row = one 16-step bar)'), pad, ty - 14, { size: 10, color: C.dim });
        for (let r = 0; r < rows; r++) {
          const bar = first + r, y = ty + r * rh;
          D.text(g, L(`${bar + 1}마디`, `Bar ${bar + 1}`), pad, y + rh / 2 - 6, { size: 10, color: C.dim });
          for (let s = 0; s < 16; s++) {
            const gs = bar * 16 + s, x = gx + s * uw;
            D.rect(g, x + 0.5, y + 1, uw - 1, rh - 2, s % 4 === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)');
            TR.forEach((tr, k) => {
              const i = hitAt(k, gs);
              if (i < 0) return;
              const sub = (rh - 4) / 3;
              D.rect(g, x + 2, y + 2 + k * sub, uw - 4, sub - 1, i === 0 ? '#fff' : tr.color);
            });
            if (gs === step) D.rect(g, x, y, uw, rh, null, C.warn, 1.5);
          }
        }
        ctx.stat(L('반복 길이', 'Loop lengths'), TR.map((tr) => P[tr.key]).join(', '));
        ctx.stat(L('전체 주기', 'Full cycle'), `${full}${L('칸', ' steps')} (${(full * d).toFixed(1)} s)`);
        ctx.stat(L('지금 칸', 'Current step'), `${step % full + 1} / ${full}`);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
    return inst;
  },
});
