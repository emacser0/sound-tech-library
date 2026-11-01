// 생성 앰비언트: 고정된 짧은 루프 반복 vs 게임 상태(분위기)를 따라 음계, 음역, 밀도가 바뀌는 마르코프 멜로디
GTL.register({
  id: 'generative-ambient',
  title: '게임 상태로 바뀌는 생성 앰비언트',
  summary: '오래 머무는 장소의 배경 음악을 짧은 루프로 만들면 몇 번만 돌아도 반복이 귀에 걸림. 규칙과 확률로 음을 그때그때 고르면 같은 마디가 다시 나오지 않고, 게임 상태(밤, 위험)를 음계와 밀도로 바로 반영할 수 있음.',
  views: { a: '고정 루프 (6.7초 반복)', b: '생성 (마르코프 + 분위기)' },
  controls: '"자동 시나리오"를 끄면 "분위기"를 직접 움직일 수 있음',
  info: `
    <p><b>생성 음악(Generative Music)</b>은 음표를 미리 다 써 두지 않고, 규칙과 확률로 실행 중에 만드는 음악. 브라이언 이노(Brian Eno)의 앰비언트 작업과 No Man's Sky, Spore 같은 게임의 절차적 음악이 대표적인 예.</p>
    <p>이 샘플의 규칙:</p>
    <ul>
      <li><b>음계</b>: 분위기 값에 따라 장조 5음 음계 → 단조 5음 음계 → 프리지안으로 바뀜. 어두울수록 반음 관계가 늘어 긴장이 생김.</li>
      <li><b>마르코프 선율</b>: 다음 음은 지금 음에서 몇 칸 움직일지를 확률로 고름(한 칸 30%, 제자리 5%, 세 칸 5% 등). 순차 진행이 많아 노래처럼 들림.</li>
      <li><b>밀도와 음역</b>: 분위기가 어두울수록 음이 드물고 낮아짐</li>
      <li><b>드론</b>: 4마디마다 근음이 바뀌는 패드. 선율이 아무 음이나 골라도 화성의 중심을 잡음.</li>
    </ul>
    <p>단점: 규칙이 단순하면 "어디로도 가지 않는" 음악이 되기 쉬움. 그래서 프레이즈 단위의 구조(질문과 대답, 반복과 변주)를 규칙에 더하거나, 작곡가가 만든 조각을 무작위로 이어 붙이는 방식과 섞어 씀. 시드 난수를 쓰면 같은 시드에서 같은 곡이 나와 디버깅과 재현이 쉬움.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="4" y="14" class="t-small t-dim">${L('마르코프 선율: 지금 음에서 다음 음으로 움직일 확률', 'Markov melody: chance of moving from the current note')}</text>
    ${[-3, -2, -1, 0, 1, 2, 3].map((d, i) => `<circle cx="${90 + i * 60}" cy="110" r="16" class="${d === 0 ? 'f-b' : 'f-dim'}"/><text x="${90 + i * 60}" y="114" text-anchor="middle" class="t-small">${d > 0 ? '+' + d : d}</text>`).join('')}
    ${[[-3, 5], [-2, 10], [-1, 30], [1, 30], [2, 15], [3, 5]].map(([d, p]) => `<path d="M270,92 Q${270 + d * 30},${50 - p} ${270 + d * 60},${92}" class="d-accent" marker-end="url(#arr)" opacity="${0.35 + p / 50}"/><text x="${270 + d * 60}" y="${150}" text-anchor="middle" class="t-small">${p}%</text>`).join('')}
    <text x="270" y="150" text-anchor="middle" class="t-small">5%</text>
    <text x="270" y="166" text-anchor="middle" class="t-small t-dim">${L('음계 안에서 몇 칸 움직이나 (쉼표 확률은 분위기로 바뀜)', 'Scale steps to move (rest chance follows the mood)')}</text>
  </svg>`,
  look: [
    '피아노 롤을 보면 A는 점선(루프 경계)마다 같은 음 모양이 똑같이 반복되고, B는 비슷한 결이지만 매번 다름',
    '"직전 구간과 같은 비율" 측정값이 A는 100%, B는 대부분 30% 아래',
    '"분위기"를 1로 올리면 B는 음이 낮고 드물어지며 프리지안 음계로 바뀜. A는 아무 변화가 없음.',
    '"소리 켜기"를 누르고 1분 정도 들으면 A는 반복이 금방 지루해지지만, B는 계속 새로움',
  ],
  refs: [
    { type: 'book', title: 'Karen Collins, Game Sound', year: 2008, note: '절차적, 생성 음악과 반복 문제' },
    { type: 'book', title: 'Gerhard Nierhaus, Algorithmic Composition: Paradigms of Automated Music Generation', year: 2009, note: '마르코프 체인을 포함한 알고리즘 작곡 기법 정리' },
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', year: 1996, note: '알고리즘 작곡과 확률 모델' },
    { type: 'article', title: 'Brian Eno, "Generative Music" (talk at Imagination Conference, San Francisco)', year: 1996, note: '생성 음악이라는 이름과 생각을 알린 강연' },
  ],
  params: [
    { key: 'mode', label: '방식', type: 'select', options: [{ value: 'loop', label: '고정 루프' }, { value: 'gen', label: '생성 (마르코프)' }], a: 'loop', b: 'gen', group: '음악' },
    { key: 'auto', label: '자동 시나리오', type: 'bool', default: true, shared: true, group: '게임', help: '40초 주기로 낮(밝음)과 밤(어두움)이 바뀜' },
    { key: 'mood', label: '분위기 (0 밝음, 1 어두움)', type: 'range', min: 0, max: 1, step: 0.01, default: 0.2, shared: true, when: (p) => !p.auto },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Generative Ambient Music',
    summary: 'If background music for a place where players stay long is a short loop, the repetition becomes obvious after a few passes. Choosing notes on the fly with rules and chance never repeats the same bar, and the game state (night, danger) can change the scale and density at once.',
    views: { a: 'Fixed loop (repeats every 6.7 s)', b: 'Generative (Markov + mood)' },
    controls: 'Turn off "Auto scenario" to move "Mood" by hand.',
    info: `
    <p><b>Generative music</b> is not fully written in advance. Rules and chance create the notes while it runs. Brian Eno's ambient work and the procedural music of games like No Man's Sky and Spore are well-known examples.</p>
    <p>Rules in this sample:</p>
    <ul>
      <li><b>Scale</b>: the mood value moves from major pentatonic to minor pentatonic to Phrygian. Darker scales have more half steps, which add tension.</li>
      <li><b>Markov melody</b>: the next note is chosen by the chance of moving some steps from the current note (one step 30%, stay 5%, three steps 5% and so on). Mostly stepwise motion sounds like singing.</li>
      <li><b>Density and register</b>: the darker the mood, the fewer and lower the notes.</li>
      <li><b>Drone</b>: a pad whose root changes every 4 bars. It keeps a harmonic center whatever notes the melody picks.</li>
    </ul>
    <p>Downside: simple rules easily make music that "goes nowhere". So phrase-level structure (question and answer, repeat and vary) is added to the rules, or mixed with random joining of pieces written by a composer. A seeded random generator makes the same seed play the same piece, which helps debugging and reproduction.</p>`,
    look: [
      'Look at the piano roll. In A the same note shape repeats exactly at every dashed line (loop boundary). B has a similar feel but differs every time.',
      'The "Same as previous window" stat is 100% in A and mostly below 30% in B.',
      'Raise "Mood" to 1. B\'s notes become lower and sparser and the scale turns Phrygian. A does not change.',
      'Press "Sound on" and listen for about a minute. A\'s repetition gets boring fast. B keeps sounding new.',
    ],
    refs: ['Procedural and generative music and the problem of repetition.', 'Survey of algorithmic composition, including Markov chains.', 'Algorithmic composition and probability models.', 'The talk that spread the name and idea of generative music.'],
    params: {
      mode: { label: 'Method', group: 'Music', options: { loop: 'Fixed loop', gen: 'Generative (Markov)' } },
      auto: { label: 'Auto scenario', group: 'Game', help: 'Day (bright) and night (dark) change every 40 s' },
      mood: 'Mood (0 bright, 1 dark)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    // 미니 합성기: 드럼과 음을 샘플 단위로 합성 (이 카테고리 샘플마다 같은 코드를 둠)
    // kind: kick, snare, hat, ohat, crash, riser, click, bass, pluck, lead, pad, brass, bell, sine
    function makeSynth(seed) {
      const TAU = Math.PI * 2, vs = [];
      let s32 = (seed | 0) || 1, srC = 0, cLo = 0, cHi = 0;
      const rnd = () => { s32 ^= s32 << 13; s32 ^= s32 >>> 17; s32 ^= s32 << 5; return (s32 >>> 0) / 2147483648 - 1; };
      return {
        vs,
        play(kind, o = {}) {
          const a = ((o.pan || 0) + 1) * Math.PI / 4;
          if (vs.length >= 64) vs.shift();
          const v = { kind, t: 0, f: o.f || 220, len: o.len ?? 0.25, amp: o.amp ?? 0.3, bus: o.bus || 0, rate: o.rate || 1, gl: Math.cos(a), gr: Math.sin(a), ph: 0, ph2: 0, z: 0, z2: 0, dead: false };
          vs.push(v);
          return v;
        },
        cut(bus) { for (const v of vs) if (bus == null || v.bus === bus) v.dead = true; },               // 즉시 끊음 (클릭이 남)
        release(bus) { for (const v of vs) if ((bus == null || v.bus === bus) && v.t < v.len) v.len = v.t; }, // 음을 놓음 (릴리스로 사라짐)
        // 한 샘플을 out[0], out[1]에 더함. gains[bus]: 버스 게인 (없으면 1)
        tick(sr, out, gains) {
          if (sr !== srC) { srC = sr; cLo = 1 - Math.exp(-TAU * 900 / sr); cHi = 1 - Math.exp(-TAU * 2500 / sr); }
          const dt = 1 / sr;
          for (let k = 0; k < vs.length; k++) {
            const v = vs[k];
            if (v.dead) continue;
            const t = v.t, rt = v.rate;
            v.t += dt * rt;
            let s = 0;
            switch (v.kind) {
              case 'kick': v.ph += (46 + 130 * Math.exp(-t * 32)) * rt * dt; s = Math.sin(TAU * v.ph) * Math.exp(-t * 7); if (t > 0.6) v.dead = true; break;
              case 'snare': { const n = rnd(); v.z += 0.5 * (n - v.z); s = (n - v.z) * Math.exp(-t * 18) + 0.6 * Math.sin(TAU * 185 * rt * t) * Math.exp(-t * 30); if (t > 0.45) v.dead = true; break; }
              case 'hat': case 'ohat': { const n = rnd(); s = (n - v.z) * 0.5 * Math.exp(-t * (v.kind === 'hat' ? 55 : 12)); v.z = n; if (t > 0.5) v.dead = true; break; }
              case 'crash': { const n = rnd(); s = (n - v.z) * 0.45 * Math.exp(-t * 2.5); v.z = n; if (t > 2) v.dead = true; break; }
              case 'riser': { const n = rnd(), q = Math.min(1, t / Math.max(0.01, v.len)), c = 1 - Math.exp(-TAU * (300 + 6000 * q * q) / sr); v.z += c * (n - v.z); s = v.z * q * q; if (t >= v.len) v.dead = true; break; }
              case 'click': s = Math.sin(TAU * v.f * rt * t) * Math.exp(-t * 60); if (t > 0.1) v.dead = true; break;
              default: {
                const f = v.f * rt, rel = t - v.len;
                v.ph += f * dt; v.ph -= Math.floor(v.ph);
                const p = v.ph;
                let raw, env;
                switch (v.kind) {
                  case 'bass': v.z += cLo * (2 * p - 1 - v.z); v.z2 += cLo * (v.z - v.z2); raw = v.z2 * 1.6; env = Math.min(1, t / 0.005) * (rel < 0 ? 1 : Math.exp(-rel * 30)); if (rel > 0.2) v.dead = true; break;
                  case 'pluck': raw = 4 * Math.abs(p - 0.5) - 1 + 0.3 * Math.sin(2 * TAU * p); env = Math.min(1, t / 0.003) * Math.exp(-t * 5) * (rel < 0 ? 1 : Math.exp(-rel * 20)); if (rel > 0.3 || t > 3) v.dead = true; break;
                  case 'lead': v.z += cHi * (2 * p - 1 - v.z); raw = v.z; env = Math.min(1, t / 0.01) * (0.6 + 0.4 * Math.exp(-t * 6)) * (rel < 0 ? 1 : Math.exp(-rel * 25)); if (rel > 0.25) v.dead = true; break;
                  case 'pad': v.ph2 += f * 1.006 * dt; v.ph2 -= Math.floor(v.ph2); v.z += cLo * 0.5 * (p + v.ph2 - 1 - v.z); v.z2 += cLo * 0.5 * (v.z - v.z2); raw = v.z2 * 2.2; env = Math.min(1, t / 0.35) * (rel < 0 ? 1 : Math.exp(-rel * 4)); if (rel > 1.5) v.dead = true; break;
                  case 'brass': { const c = 1 - Math.exp(-TAU * (500 + 3500 * Math.exp(-t * 6)) / sr); v.z += c * (2 * p - 1 - v.z); v.z2 += c * (v.z - v.z2); raw = v.z2 * 1.4; env = Math.min(1, t / 0.02) * (rel < 0 ? 1 : Math.exp(-rel * 10)); if (rel > 0.6) v.dead = true; break; }
                  case 'bell': v.ph2 += f * 2.76 * dt; v.ph2 -= Math.floor(v.ph2); raw = Math.sin(TAU * p) + 0.4 * Math.sin(TAU * v.ph2) * Math.exp(-t * 3); env = Math.min(1, t / 0.004) * Math.exp(-t * 1.6) * (rel < 0 ? 1 : Math.exp(-rel * 3)); if (t > 4 || rel > 1.5) v.dead = true; break;
                  default: raw = Math.sin(TAU * p); env = Math.min(1, t / 0.01) * (rel < 0 ? 1 : Math.exp(-rel * 20)); if (rel > 0.3) v.dead = true;
                }
                s = raw * env;
              }
            }
            const g = v.amp * (gains && gains[v.bus] != null ? gains[v.bus] : 1);
            out[0] += s * g * v.gl; out[1] += s * g * v.gr;
          }
        },
        // 끝난 음을 목록에서 뺌. 블록마다 한 번 호출
        gc() { let j = 0; for (let i = 0; i < vs.length; i++) if (!vs[i].dead) vs[j++] = vs[i]; vs.length = j; },
      };
    }

    const BPM = 72, S8 = 60 / BPM / 2, LOOPN = 16;
    const SCALES = [
      { ko: '장조 5음', en: 'Major pentatonic', iv: [0, 2, 4, 7, 9] },
      { ko: '단조 5음', en: 'Minor pentatonic', iv: [0, 3, 5, 7, 10] },
      { ko: '프리지안', en: 'Phrygian', iv: [0, 1, 3, 5, 7, 8, 10] },
    ];
    const MOVES = [[-3, 0.05], [-2, 0.1], [-1, 0.3], [0, 0.05], [1, 0.3], [2, 0.15], [3, 0.05]];
    const ROOTS = [0, -3, 5, -5];   // 4마디마다 드론 근음 (반음)
    const KEY = 62;                 // D
    const deg2midi = (sc, d) => { const n = sc.iv.length, o = Math.floor(d / n); return KEY + o * 12 + sc.iv[((d % n) + n) % n]; };
    // A: 시드로 한 번 만든 16스텝 루프 (밝은 음계)
    const lr = U.rng(ctx.seed + 71), LOOP = [];
    for (let i = 0, d = 2; i < LOOPN; i++) { if (lr.next() < 0.55) { d = U.clamp(d + lr.pick([-2, -1, 1, 1, 2]), -2, 9); LOOP.push(deg2midi(SCALES[0], d)); } else LOOP.push(-1); }
    const gr = U.rng(ctx.seed + 72);
    const syn = makeSynth(31);
    const st = { t: 0, step: -1, deg: 4, mood: 0, sc: 0, seq: [], notes: [], same: 0, dl: null, di: 0 };
    const out = [0, 0];

    function moodAt(t) { return P.auto ? 0.5 - 0.5 * Math.cos(2 * Math.PI * t / 40) : P.mood; }
    function fire(s) {
      const mood = st.mood;
      const bar = Math.floor(s / 8);
      if (s % 32 === 0) {
        const root = KEY - 24 + (P.mode === 'gen' ? ROOTS[(bar / 4) % 4] : 0);
        [root, root + 7, root + 12].forEach((m, i) => syn.play('pad', { f: A.mtof(m), len: S8 * 30, amp: 0.07, pan: (i - 1) * 0.5 }));
      }
      let m = -1;
      if (P.mode === 'loop') m = LOOP[s % LOOPN];
      else {
        const sc = SCALES[st.sc];
        if (gr.next() < 0.6 - 0.35 * mood) {
          let u = gr.next(), mv = 0;
          for (const [d, p] of MOVES) { if ((u -= p) <= 0) { mv = d; break; } }
          const lo = -2 - Math.round(mood * 4), hi = 8 - Math.round(mood * 5);
          st.deg = U.clamp(st.deg + mv, lo, hi);
          if (st.deg === lo || st.deg === hi) st.deg += st.deg === lo ? 1 : -1;
          m = deg2midi(sc, st.deg);
        }
      }
      if (m > 0) {
        syn.play('bell', { f: A.mtof(m), len: S8 * 2, amp: 0.12, pan: ((m % 7) - 3) * 0.12 });
        st.notes.push({ t: st.t, m });
        if (st.notes.length > 200) st.notes.shift();
      }
      // 직전 16스텝과 같은 비율
      st.seq.push(m);
      if (st.seq.length > 64) st.seq.shift();
      const N = st.seq.length;
      if (N >= 32) {
        let same = 0, cnt = 0;
        for (let i = N - 16; i < N; i++) { const a = st.seq[i], b = st.seq[i - 16]; if (a < 0 && b < 0) continue; cnt++; if (a === b) same++; }
        st.same = cnt ? same / cnt : 1;
      }
    }
    function step(l, r, sr, n) {
      st.mood = moodAt(st.t);
      st.sc = st.mood < 0.35 ? 0 : st.mood < 0.7 ? 1 : 2;
      if (!st.dl || st.dl.sr !== sr) { const len = Math.ceil(sr * 1.2); st.dl = { sr, b: [new Float32Array(len), new Float32Array(len)], len }; st.di = 0; }
      const dlb = st.dl.b, len = st.dl.len, dA = Math.round(0.625 * sr), dB = Math.round(0.833 * sr);
      for (let i = 0; i < n; i++) {
        const s8 = Math.floor(st.t / S8 + 1e-9);
        if (s8 !== st.step) { st.step = s8; fire(s8); }
        out[0] = out[1] = 0;
        syn.tick(sr, out, null);
        // 공간감용 교차 피드백 딜레이
        const ea = dlb[0][(st.di - dA + len) % len], eb = dlb[1][(st.di - dB + len) % len];
        dlb[0][st.di] = out[0] + eb * 0.4; dlb[1][st.di] = out[1] + ea * 0.4;
        st.di = (st.di + 1) % len;
        l[i] = (out[0] + ea * 0.45) * 1.2; r[i] = (out[1] + eb * 0.45) * 1.2;
        st.t += 1 / sr;
      }
      syn.gc();
    }
    const snd = A.player(ctx, { process: step });
    const bufL = new Float32Array(4800), bufR = new Float32Array(4800);

    return {
      update(dt) {
        snd.update();
        if (!snd.on) step(bufL, bufR, 48000, Math.min(4800, Math.round(dt * 48000)));
      },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, tw = W - pad * 2, PAST = 20, t0 = st.t - PAST;
        const X = (t) => pad + (t - t0) / PAST * tw;
        // 분위기 띠
        D.rect(g, pad, 20, tw, 10, U.rgb(255, 255, 255, 0.06));
        D.rect(g, pad, 20, tw * st.mood, 10, U.hsl(220 - 180 * st.mood, 0.5, 0.45));
        D.text(g, L('분위기: ', 'Mood: ') + st.mood.toFixed(2) + '  ' + (P.mode === 'gen' ? L(SCALES[st.sc].ko, SCALES[st.sc].en) : L('루프는 분위기를 무시', 'the loop ignores mood')), pad, 4, { size: 10, color: C.dim });
        // 피아노 롤
        const ry = 40, rh = H - ry - 20, LO = 44, HI = 90, Y = (m) => ry + rh - (m - LO) / (HI - LO) * rh;
        D.rect(g, pad, ry, tw, rh, 'rgba(0,0,0,0.35)');
        for (let m = LO; m <= HI; m++) if (A.pitchClass(m) === 2) { D.line(g, pad, Y(m), pad + tw, Y(m), C.grid, 1); D.text(g, A.noteName(m), pad + 2, Y(m) - 11, { size: 9, color: C.dim }); }
        if (P.mode === 'loop') {
          g.setLineDash([4, 4]);
          const LT = LOOPN * S8;
          for (let k = Math.ceil(t0 / LT); k * LT <= st.t; k++) D.line(g, X(k * LT), ry, X(k * LT), ry + rh, C.warn, 1);
          g.setLineDash([]);
        }
        const nw = Math.max(3, X(S8 * 1.5) - X(0));
        for (const nt of st.notes) if (nt.t >= t0) D.rect(g, X(nt.t), Y(nt.m) - 3, nw, 6, col);
        D.line(g, X(st.t), ry, X(st.t), ry + rh, C.text, 1);
        D.text(g, L('피아노 롤 (최근 20초)', 'Piano roll (last 20 s)'), pad + 4, ry + rh + 4, { size: 9, color: C.dim });
        const recent = st.notes.filter((nt) => nt.t > st.t - 20).length;
        ctx.stat(L('직전 구간과 같은 비율', 'Same as previous window'), Math.round(st.same * 100) + ' %');
        ctx.stat(L('음 수 (분당)', 'Notes per minute'), Math.round(recent * 3));
        ctx.stat(L('음계', 'Scale'), P.mode === 'gen' ? L(SCALES[st.sc].ko, SCALES[st.sc].en) : L(SCALES[0].ko, SCALES[0].en) + L(' (고정)', ' (fixed)'));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
