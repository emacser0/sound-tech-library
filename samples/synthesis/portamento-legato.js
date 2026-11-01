// 포르타멘토와 레가토: 모노 신시사이저에서 음 사이를 미끄러지고(글라이드), 겹친 음에서 엔벨로프를 다시 시작하지 않음
GTL.register({
  id: 'portamento-legato',
  title: '포르타멘토와 레가토 (모노 보이스)',
  summary: '모노 신시사이저는 음 하나만 냄. 새 음이 오면 음 높이를 바로 바꿀지, 미끄러지듯 옮겨 갈지(포르타멘토), 엔벨로프를 다시 시작할지(레가토 여부)를 정해야 함. 이 선택이 리드와 베이스의 연주감을 좌우함.',
  views: { a: '바로 바뀜, 매번 재시작', b: '글라이드 + 레가토' },
  controls: '파라미터 표에서 글라이드 시간과 방식을 바꿈. "소리 켜기"를 누르면 선율이 반복됨.',
  info: `
    <p><b>모노 보이스</b>는 동시에 한 음만 냄. 건반을 겹쳐 누르면 마지막에 누른 음이 이기고(마지막 음 우선), 이때 두 가지를 정함.</p>
    <ul>
      <li><b>포르타멘토(글라이드)</b>: 이전 음 높이에서 새 음 높이로 정해진 시간 동안 미끄러짐. "항상" 모드는 모든 음에, "레가토만" 모드는 겹쳐 누른 음에만 적용 (TB-303의 슬라이드, Minimoog의 글라이드).</li>
      <li><b>레가토</b>: 겹쳐 누른 음에서 엔벨로프를 다시 시작하지 않음. 한 숨에 부르는 노래처럼 이어짐. 끄면(멀티 트리거) 음마다 어택이 다시 생겨 또박또박 들림.</li>
      <li><b>글라이드 곡선</b>: 일정한 시간 동안 반음 단위로 직선 이동하거나, 아날로그처럼 RC 회로의 지수 곡선으로 다가감. 지수 곡선은 처음에 빠르고 끝에서 느림.</li>
    </ul>
    <p>음 높이는 Hz가 아니라 반음(로그) 단위로 미끄러져야 귀에 고르게 들림. 아날로그 신시사이저는 1V/옥타브 제어 전압을 미끄러뜨려 자연스럽게 이렇게 동작함.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="16" class="t-small t-dim">${L('음 높이', 'Pitch')}</text>
    <rect x="30" y="100" width="120" height="10" class="f-dim"/><rect x="140" y="50" width="130" height="10" class="f-dim"/>
    <polyline points="30,105 140,105 140,55 270,55" class="d-a"/>
    <path d="M30,108 L140,108 C160,70 175,58 270,58" class="d-b"/>
    <text x="200" y="44" text-anchor="middle" class="t-small">${L('겹쳐 누름', 'overlapping keys')}</text>
    <text x="10" y="132" class="t-small t-dim">${L('음량', 'Level')}</text>
    <path d="M30,150 L36,124 L60,134 L140,134 L146,124 L170,134 L270,134" class="d-a"/>
    <path d="M30,152 L36,126 L60,136 L270,136" class="d-b"/>
    <text x="300" y="60" class="t-small t-a">${L('A: 계단, 어택 재시작', 'A: step, attack restarts')}</text>
    <text x="300" y="78" class="t-small t-b">${L('B: 미끄러짐, 엔벨로프 유지', 'B: glide, envelope continues')}</text>
  </svg>`,
  look: [
    '위 피아노 롤에서 A의 음 높이 선은 계단, B는 겹친 음 사이를 곡선으로 미끄러짐',
    '아래 음량 줄에서 A는 음마다 어택 봉우리(삼각형 표시)가 생기고, B는 겹친 음에서 봉우리 없이 이어짐',
    '"소리 켜기"를 누르고 B를 들으면 노래하듯 이어지는 리드. A는 또박또박 끊어 치는 소리.',
    '글라이드 방식을 "항상"으로 바꾸면 떨어진 음(가운데 세 음)도 미끄러짐. 글라이드 시간을 0.4초로 늘리면 음에 도착하기 전에 다음 음이 와서 음정이 흐려짐.',
  ],
  refs: [
    { type: 'book', title: 'Will Pirkle, Designing Software Synthesizer Plugins in C++', year: 2021, note: '모노 모드, 레가토, 포르타멘토 구현' },
    { type: 'engine', title: 'Roland TB-303 Owner\'s Manual', note: '슬라이드(겹친 음 글라이드)와 액센트' },
    { type: 'article', title: 'MIDI Manufacturers Association, MIDI 1.0 Detailed Specification', note: 'Portamento Time (CC 5), Portamento On/Off (CC 65), Legato Footswitch (CC 68)' },
  ],
  params: [
    { key: 'glide', label: '글라이드', type: 'bool', default: true, a: false, b: true, group: '모노 보이스' },
    { key: 'legato', label: '레가토 (재시작 안 함)', type: 'bool', default: true, a: false, b: true },
    { key: 'glideTime', label: '글라이드 시간 (초)', type: 'range', min: 0.01, max: 0.6, step: 0.01, default: 0.12, shared: true, when: (p) => p.glide },
    { key: 'glideMode', label: '글라이드 방식', type: 'select', options: [{ value: 'legato', label: '레가토만' }, { value: 'always', label: '항상' }], default: 'legato', shared: true, when: (p) => p.glide },
    { key: 'curve', label: '글라이드 곡선', type: 'select', options: [{ value: 'exp', label: '지수 (RC)' }, { value: 'lin', label: '직선 (일정 시간)' }], default: 'exp', shared: true, when: (p) => p.glide },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Portamento and Legato (Mono Voice)',
    summary: 'A mono synth plays one note at a time. When a new note comes, you choose whether the pitch jumps or glides (portamento), and whether the envelope restarts (legato or not). These choices shape how leads and basses feel to play.',
    views: { a: 'Jump, restart each note', b: 'Glide + legato' },
    controls: 'Change glide time and mode in the parameter table. Press "Sound on" to hear the melody loop.',
    info: `
    <p>A <b>mono voice</b> plays one note at a time. When keys overlap, the last key wins (last note priority), and two things must be decided.</p>
    <ul>
      <li><b>Portamento (glide)</b>: slides from the old pitch to the new one over a set time. "Always" applies it to every note. "Legato only" applies it only to overlapping notes (the TB-303 slide, the Minimoog glide).</li>
      <li><b>Legato</b>: overlapping notes do not restart the envelope, so the line flows like one sung breath. Turn it off (multi-trigger) and every note gets a new attack.</li>
      <li><b>Glide curve</b>: a straight line in semitones over a fixed time, or an exponential approach like an analog RC circuit. The exponential curve is fast at first and slow at the end.</li>
    </ul>
    <p>Pitch must glide in semitones (log scale), not in Hz, to sound even. Analog synths do this naturally because they slide a 1 V/octave control voltage.</p>`,
    look: [
      'In the piano roll at the top, A\'s pitch line is a staircase. B slides on a curve between overlapping notes.',
      'In the level lane at the bottom, A has an attack peak (triangle mark) on every note. B flows without peaks on overlapping notes.',
      'Press "Sound on" and listen to B. It is a singing, connected lead. A sounds separate and choppy.',
      'Set glide mode to "Always". The detached notes (the three in the middle) glide too. Raise glide time to 0.4 s. The next note comes before the pitch arrives, and the tuning blurs.',
    ],
    refs: ['Mono mode, legato and portamento implementation.', 'Slide (glide on overlapping notes) and accent.', 'Portamento Time (CC 5), Portamento On/Off (CC 65), Legato Footswitch (CC 68).'],
    params: {
      glide: { label: 'Glide', group: 'Mono voice' },
      legato: 'Legato (no restart)',
      glideTime: 'Glide time (s)',
      glideMode: { label: 'Glide mode', options: { legato: 'Legato only', always: 'Always' } },
      curve: { label: 'Glide curve', options: { exp: 'Exponential (RC)', lin: 'Linear (fixed time)' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    // 선율 (초): 겹치는 음 = 레가토, 사이가 뜬 음 = 떨어진 음
    const NOTES = [
      { t: 0.0, d: 0.34, m: 60 }, { t: 0.3, d: 0.34, m: 64 }, { t: 0.6, d: 0.34, m: 67 }, { t: 0.9, d: 0.55, m: 72 },
      { t: 1.55, d: 0.22, m: 71 }, { t: 1.85, d: 0.22, m: 67 },
      { t: 2.1, d: 0.34, m: 64 }, { t: 2.4, d: 0.34, m: 62 }, { t: 2.7, d: 0.6, m: 60 },
    ];
    const LOOP = 3.6;
    function activeAt(t) { let best = -1; for (let i = 0; i < NOTES.length; i++) { const n = NOTES[i]; if (t >= n.t && t < n.t + n.d) best = i; } return best; }

    // 모노 보이스 한 단계. st: { cur, pitch, target, rate, env, stage(0 쉼, 1 어택, 2 디케이, 3 릴리스), events }
    const newState = () => ({ cur: -1, pitch: 60, target: 60, rate: 0, env: 0, stage: 0 });
    function step(st, t, dt, log) {
      const a = activeAt(t);
      if (a !== st.cur) {
        if (a >= 0) {
          const legatoMove = st.cur >= 0;
          st.target = NOTES[a].m;
          const doGlide = P.glide && (P.glideMode === 'always' || legatoMove);
          if (!doGlide) st.pitch = st.target;
          else st.rate = Math.abs(st.target - st.pitch) / Math.max(0.005, P.glideTime);
          if (!(legatoMove && P.legato) || st.stage === 0 || st.stage === 3) { st.stage = 1; if (log) log.push(t); }
        } else st.stage = 3;
        st.cur = a;
      }
      // 음 높이 (반음 단위)
      if (st.pitch !== st.target) {
        if (P.curve === 'lin') { const d = st.target - st.pitch, m = st.rate * dt; st.pitch = Math.abs(d) <= m ? st.target : st.pitch + Math.sign(d) * m; }
        else { st.pitch += (st.target - st.pitch) * (1 - Math.exp(-dt * 3 / Math.max(0.005, P.glideTime))); if (Math.abs(st.target - st.pitch) < 1e-3) st.pitch = st.target; }
      }
      // 엔벨로프 (지수)
      if (st.stage === 1) { st.env += (1.25 - st.env) * (1 - Math.exp(-dt / 0.006)); if (st.env >= 1) { st.env = 1; st.stage = 2; } }
      else if (st.stage === 2) st.env += (0.5 - st.env) * (1 - Math.exp(-dt / 0.08));
      else if (st.stage === 3) st.env *= Math.exp(-dt / 0.05);
      return st;
    }

    const live = { n: 0, st: newState(), ph: 0, lp: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const k = A.onePoleCoef(2200, sr);
        for (let i = 0; i < n; i++) {
          const t = (live.n++ / sr) % LOOP;
          const s = step(live.st, t, 1 / sr, null), f = A.mtof(s.pitch), dt = f / sr;
          const v = 2 * live.ph - 1 - A.polyBlep(live.ph, dt);
          live.ph += dt; if (live.ph >= 1) live.ph -= 1;
          live.lp += k * (v - live.lp);
          const o = live.lp * s.env * 0.5; l[i] = o; r[i] = o;
        }
      },
    });

    // 오프라인 궤적 (1kHz, 두 바퀴 돌려 두 번째 바퀴 사용)
    const ER = 1000;
    let key = '', pitchC = null, envC = null, trig = [];
    function analyze() {
      const k = [P.glide, P.legato, P.glideTime, P.glideMode, P.curve].join();
      if (k === key) return;
      key = k;
      const N = Math.round(LOOP * ER), st = newState(), log = [];
      for (let i = 0; i < N; i++) step(st, i / ER, 1 / ER, null);
      pitchC = new Float32Array(N); envC = new Float32Array(N);
      for (let i = 0; i < N; i++) { step(st, i / ER, 1 / ER, log); pitchC[i] = st.pitch; envC[i] = st.env; }
      trig = log;
    }

    let visT = 0;
    return {
      update(dt) { snd.update(); visT += dt; },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const tp = (snd.on ? live.n / (snd.sr || 48000) : visT) % LOOP;
        const x0 = pad + 30, w = W - x0 - pad, tx = (t) => x0 + t / LOOP * w;
        // 1) 피아노 롤
        const h1 = (H - pad * 3) * 0.62, lo = 58, hi = 74, my = (m) => pad + h1 - (m - lo) / (hi - lo) * h1;
        D.rect(g, x0, pad, w, h1, 'rgba(0,0,0,0.35)');
        for (let m = lo; m <= hi; m++) if (A.isBlackKey(m)) D.rect(g, x0, my(m + 0.5), w, h1 / (hi - lo), 'rgba(255,255,255,0.025)');
        for (const m of [60, 64, 67, 72]) D.text(g, A.noteName(m), x0 - 4, my(m) - 5, { size: 9, color: C.dim, align: 'right' });
        for (const n of NOTES) D.rect(g, tx(n.t), my(n.m + 0.4), n.d / LOOP * w, h1 / (hi - lo) * 0.8, 'rgba(200,210,230,0.22)');
        g.beginPath();
        for (let i = 0; i < pitchC.length; i += 2) { const px = tx(i / ER), py = my(pitchC[i]); i ? g.lineTo(px, py) : g.moveTo(px, py); }
        g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        D.text(g, Lx('피아노 롤 (회색 = 누른 건반, 선 = 실제 음 높이)', 'Piano roll (gray = keys held, line = actual pitch)'), x0 + 4, pad + 3, { size: 10, color: C.dim });
        // 2) 음량
        const y2 = pad * 2 + h1, h2 = H - y2 - pad;
        D.rect(g, x0, y2, w, h2, 'rgba(0,0,0,0.35)');
        g.beginPath();
        for (let i = 0; i < envC.length; i += 2) { const px = tx(i / ER), py = y2 + h2 - envC[i] * (h2 - 14); i ? g.lineTo(px, py) : g.moveTo(px, py); }
        g.strokeStyle = col; g.lineWidth = 1.5; g.stroke();
        for (const t of trig) D.poly(g, [{ x: tx(t), y: y2 + 2 }, { x: tx(t) - 4, y: y2 + 9 }, { x: tx(t) + 4, y: y2 + 9 }], C.warn);
        D.text(g, Lx('음량 (삼각형 = 엔벨로프 재시작)', 'Level (triangle = envelope restart)'), x0 + 8, y2 + 10, { size: 10, color: C.dim });
        D.line(g, tx(tp), pad, tx(tp), y2 + h2, C.text, 1);
        // 음에 도착하지 못한 정도: 음이 끝날 때 남은 차이(센트)의 최대
        let miss = 0;
        for (const n of NOTES) { const i = Math.min(pitchC.length - 1, Math.floor((n.t + n.d) * ER) - 1); miss = Math.max(miss, Math.abs(pitchC[i] - n.m) * 100); }
        ctx.stat(Lx('현재 음 높이', 'Current pitch'), A.noteName(pitchC[Math.floor(tp * ER)] || 60) + ` (${(pitchC[Math.floor(tp * ER)] || 60).toFixed(2)})`);
        ctx.stat(Lx('엔벨로프 재시작 (한 바퀴)', 'Envelope restarts (per loop)'), trig.length + ' / ' + NOTES.length);
        ctx.stat(Lx('음 끝에서 남은 음정 차이 (최대)', 'Pitch left at note end (max)'), miss.toFixed(0) + ' cents');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
