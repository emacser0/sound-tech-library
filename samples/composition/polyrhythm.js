// 폴리리듬: 같은 시간 안에 서로 다른 개수의 박(p : q)을 겹침. 3:2와 4:3, 5:4 등 비교
GTL.register({
  id: 'polyrhythm',
  title: '폴리리듬 (3:2, 4:3)',
  summary: '같은 길이의 주기를 한 성부는 p개, 다른 성부는 q개로 고르게 나눠 동시에 연주. 3:2는 헤미올라로 익숙하지만 4:3, 5:4로 갈수록 두 박이 만나는 곳이 드물어지고 결합 리듬이 복잡해짐.',
  views: { a: '3:2', b: '4:3' },
  info: `
    <p><b>폴리리듬(Polyrhythm)</b>은 같은 시간 구간을 서로 다른 수로 나눈 박을 동시에 연주하는 것. 3:2는 한 마디에 셋잇단 3개와 보통 박 2개를 겹친 것과 같음.</p>
    <ul>
      <li>두 성부는 주기의 시작에서만 함께 울림 (p와 q가 서로소일 때)</li>
      <li>두 성부를 모두 표시하려면 최소공배수 LCM(p, q) 칸의 격자가 필요. 3:2는 6칸, 4:3은 12칸, 5:4는 20칸.</li>
      <li>두 성부를 합친 <b>결합 리듬(resultant rhythm)</b>은 간격이 고르지 않은 새 리듬이 됨. 3:2의 결합 리듬은 2-1-1-2 (6칸 기준).</li>
    </ul>
    <p>서아프리카 음악, 쇼팽과 브람스의 피아노곡, 프로그레시브 메탈에 자주 나옴. 폴리미터(박 길이는 같고 반복 길이가 다름)와는 다른 개념.</p>`,
  diagram: (L) => {
    const W = 360, x0 = 120;
    const row = (y, n, cls) => Array.from({ length: n }, (_, i) => `<circle cx="${x0 + (i / n) * W}" cy="${y}" r="7" class="${cls}"/>`).join('');
    return `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    ${Array.from({ length: 7 }, (_, i) => `<line x1="${x0 + i * W / 6}" y1="24" x2="${x0 + i * W / 6}" y2="136" class="d-dim" stroke-dasharray="2 3"/>`).join('')}
    <text x="4" y="16" class="t-small t-dim">${L('3:2, 격자 = LCM(3, 2) = 6칸', '3:2, grid = LCM(3, 2) = 6 steps')}</text>
    <text x="4" y="48" class="t-a">${L('성부 1: 3박', 'Voice 1: 3 beats')}</text>${row(44, 3, 'f-a')}
    <text x="4" y="88" class="t-b">${L('성부 2: 2박', 'Voice 2: 2 beats')}</text>${row(84, 2, 'f-b')}
    <text x="4" y="128">${L('결합 리듬', 'Resultant')}</text>${[0, 2, 3, 4].map((s) => `<rect x="${x0 + s * W / 6 - 5}" y="118" width="10" height="16" class="f-accent"/>`).join('')}
    <text x="${x0 + W + 4}" y="20" class="t-small t-dim">${L('주기 끝', 'cycle end')}</text>
    <text x="270" y="160" text-anchor="middle" class="t-small t-dim">${L('결합 리듬 간격 2-1-1-2: 두 박이 겹치는 곳은 시작뿐', 'Resultant gaps 2-1-1-2: the beats meet only at the start')}</text>
  </svg>`;
  },
  look: [
    '바늘이 돌 때 두 다각형의 꼭짓점이 동시에 울리는 곳은 12시 방향뿐',
    'A(3:2)는 결합 리듬이 4개 타격, B(4:3)는 6개 타격. 간격 종류도 B가 더 많음.',
    '"소리 켜기"를 누르면 높은 벨이 성부 1, 낮은 탐이 성부 2. 3:2는 쉽게 따라 부를 수 있지만 5:4는 헷갈림.',
    'p와 q를 4와 2처럼 약수 관계로 두면 폴리리듬이 사라지고 성부 2가 성부 1의 일부가 됨',
  ],
  refs: [
    { type: 'book', title: 'Godfried Toussaint, The Geometry of Musical Rhythm', year: 2013, note: '원형 표현, 폴리리듬과 결합 리듬' },
    { type: 'book', title: 'Simha Arom, African Polyphony and Polyrhythm: Musical Structure and Methodology', year: 1991, note: '중앙아프리카 음악의 폴리리듬 분석' },
    { type: 'book', title: 'Justin London, Hearing in Time: Psychological Aspects of Musical Meter', year: 2004, note: '박과 미터 지각, 폴리리듬이 어려운 이유' },
  ],
  params: [
    { key: 'p', label: '성부 1 박 수 (p)', type: 'int', min: 2, max: 9, a: 3, b: 4, default: 3, group: '폴리리듬' },
    { key: 'q', label: '성부 2 박 수 (q)', type: 'int', min: 1, max: 9, a: 2, b: 3, default: 2 },
    { key: 'cycle', label: '주기 길이 (초)', type: 'range', min: 0.8, max: 4, step: 0.05, default: 1.8, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Polyrhythm (3:2, 4:3)',
    summary: 'One voice splits a cycle evenly into p beats, another into q beats, and both play at once. 3:2 is the familiar hemiola. With 4:3 and 5:4 the beats meet less often and the combined rhythm gets more complex.',
    views: { a: '3:2', b: '4:3' },
    info: `
    <p>A <b>polyrhythm</b> plays beats that split the same span into different counts at the same time. 3:2 is like three triplet beats over two normal beats in one bar.</p>
    <ul>
      <li>The two voices sound together only at the start of the cycle (when p and q share no factor).</li>
      <li>To write both voices you need a grid of LCM(p, q) steps. 3:2 needs 6 steps, 4:3 needs 12, 5:4 needs 20.</li>
      <li>The two voices together make a <b>resultant rhythm</b> with uneven gaps. For 3:2 it is 2-1-1-2 (in 6 steps).</li>
    </ul>
    <p>It is common in West African music, piano music by Chopin and Brahms, and progressive metal. It differs from polymeter (same beat length, different loop lengths).</p>`,
    look: [
      'As the hand turns, the corners of both shapes sound together only at 12 o\'clock.',
      'A (3:2) has 4 hits in its resultant rhythm. B (4:3) has 6. B also has more gap sizes.',
      'Press "Sound on". The high bell is voice 1 and the low tom is voice 2. 3:2 is easy to sing along, 5:4 is confusing.',
      'Set p and q to a divisor pair like 4 and 2. The polyrhythm disappears and voice 2 becomes part of voice 1.',
    ],
    refs: ['Circle view, polyrhythm and resultant rhythms.', 'Analysis of polyrhythm in Central African music.', 'Beat and meter perception, and why polyrhythms are hard.'],
    params: {
      p: { label: 'Voice 1 beats (p)', group: 'Polyrhythm' },
      q: 'Voice 2 beats (q)',
      cycle: 'Cycle length (s)',
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
    const gcd = (a, b) => (b ? gcd(b, a % b) : a);
    const events = () => {
      const evs = [], T = P.cycle;
      for (let i = 0; i < P.p; i++) evs.push({ t: (i / P.p) * T, v: 1, i });
      for (let i = 0; i < P.q; i++) evs.push({ t: (i / P.q) * T, v: 2, i });
      return evs;
    };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        runAudio(l, r, sr, n, (t0, t1, trig) => {
          loopEach(events(), P.cycle, t0, t1, (e, t) => {
            if (e.v === 1) trig('bell', t, { f: 1046.5, vel: e.i === 0 ? 1 : 0.75, pan: 0.3 });
            else trig('tom', t, { f: 220, vel: e.i === 0 ? 1 : 0.8, pan: -0.3 });
            if (e.v === 1 && e.i === 0) trig('kick', t, { vel: 0.6 });
          });
        });
      },
    });

    const inst = {
      update(dt) { tick(dt); },
      render() { ctx.g.save(); ctx.g.translate(0, TOP); try { inst.drawView(); } finally { ctx.g.restore(); } },
      drawView() {
        const g = ctx.g, W = ctx.width, H = ctx.height - TOP, pad = 10;
        const p = P.p, q = P.q, T = P.cycle, ph = (clock.t % T) / T;
        const lcm = (p * q) / gcd(p, q);
        const R = Math.max(30, Math.min(W * 0.42, (H - 130) / 2) - 6), cx = W / 2, cy = pad + R + 12;
        D.circle(g, cx, cy, R, null, C.grid, 1);
        const poly = (n, r, color) => {
          const pts = [];
          for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (i / n) * Math.PI * 2; pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r }); }
          if (n > 1) D.poly(g, pts, null, color, 2, n > 2);
          pts.forEach((pt, i) => { const near = Math.abs(((ph - i / n + 1.5) % 1) - 0.5) < 0.03; D.circle(g, pt.x, pt.y, near ? 9 : 6, near ? '#fff' : color); });
        };
        poly(p, R, C.a);
        poly(q, R * 0.72, C.b);
        const ha = -Math.PI / 2 + ph * Math.PI * 2;
        D.line(g, cx, cy, cx + Math.cos(ha) * R, cy + Math.sin(ha) * R, C.warn, 2);
        // 격자 표기
        const gy = cy + R + 24, gw = W - pad * 2 - 70, gx = pad + 70, ch = 16;
        const cw = gw / lcm;
        const rows = [[L('성부 1', 'Voice 1'), (s) => (s * p) % lcm === 0 ? 0 : -1, C.a, (s) => s % (lcm / p) === 0], [L('성부 2', 'Voice 2'), null, C.b, (s) => s % (lcm / q) === 0]];
        const res = [];
        for (let s = 0; s < lcm; s++) if (s % (lcm / p) === 0 || s % (lcm / q) === 0) res.push(s);
        rows.push([L('결합', 'Resultant'), null, C.accent, (s) => res.includes(s)]);
        rows.forEach(([name, , c, on], k) => {
          D.text(g, name, pad, gy + k * (ch + 4) + 2, { size: 10, color: c });
          for (let s = 0; s < lcm; s++) D.rect(g, gx + s * cw + 0.5, gy + k * (ch + 4), Math.max(1, cw - 1), ch, on(s) ? c : 'rgba(255,255,255,0.07)');
        });
        D.line(g, gx + ph * gw, gy - 3, gx + ph * gw, gy + 3 * (ch + 4), C.warn, 1.5);
        const gaps = res.map((s, i) => (i + 1 < res.length ? res[i + 1] : lcm) - s);
        D.text(g, L(`격자 ${lcm}칸, 결합 리듬 간격 `, `Grid ${lcm} steps, resultant gaps `) + gaps.join('-'), pad, gy + 3 * (ch + 4) + 6, { size: 11 });
        ctx.stat(L('비율', 'Ratio'), `${p}:${q}`);
        ctx.stat(L('격자 (LCM)', 'Grid (LCM)'), lcm + L(' 칸', ' steps'));
        ctx.stat(L('결합 리듬 타격 수', 'Resultant hits'), res.length);
        ctx.stat(L('함께 울리는 곳', 'Shared hits'), gcd(p, q));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
    return inst;
  },
});
