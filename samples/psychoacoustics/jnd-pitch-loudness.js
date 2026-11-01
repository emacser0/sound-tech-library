// 최소 식별 차이(JND): 음 높이와 크기의 차이를 얼마나 작게 구별하는지 적응형 계단법(2-down 1-up)으로 측정
GTL.register({
  id: 'jnd-pitch-loudness',
  title: '최소 식별 차이 (음 높이, 크기)',
  summary: '두 음을 차례로 들려주고 어느 쪽이 높은지(큰지) 고르게 해서 구별 한계를 찾음. 맞히면 차이를 줄이고 틀리면 늘리는 2-down 1-up 계단법으로 약 71% 정답 지점에 수렴함.',
  single: true,
  controls: '"소리 켜기" 후 "가상 청취자"를 끄면 직접 테스트함. Space 다시 듣기, 1 또는 2 키로 더 높은(큰) 쪽 고르기.',
  info: `
    <p><b>최소 식별 차이(JND, Just noticeable difference)</b>는 두 자극의 차이를 알아챌 수 있는 가장 작은 값. 심리음향에서는 <b>차이 역치(Difference limen)</b>라고도 부름.</p>
    <ul>
      <li><b>음 높이</b>: 1 kHz 근처에서 훈련된 사람은 약 0.2% (약 3~4센트, 2 Hz 안팎)까지 구별함. 아주 낮은 음과 4 kHz 위에서는 커짐.</li>
      <li><b>크기</b>: 약 0.5~1 dB. 크기 차이의 비율이 거의 일정한 베버의 법칙(Weber's law)을 대략 따름.</li>
    </ul>
    <p>측정은 <b>2구간 강제 선택(2AFC)</b>: 두 구간 중 하나에만 차이를 넣고 어느 쪽인지 고르게 함. 모르면 50%를 맞히므로 이 방법은 추측의 영향을 계산할 수 있음.</p>
    <p><b>2-down 1-up 계단법</b>(Levitt 1971): 두 번 연속 맞히면 차이를 줄이고, 한 번 틀리면 늘림. 정답률 70.7% 지점으로 수렴. 방향이 바뀌는 지점(반전)의 평균이 역치.</p>
    <p>실무 의미: 피치 보정, 튜닝, 게인 자동화의 허용 오차를 정할 때 기준이 됨. 예를 들어 1 dB보다 작은 볼륨 차이나 5센트보다 작은 튜닝 차이는 대부분 듣는 사람이 알아채지 못함.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <line x1="40" y1="140" x2="520" y2="140" class="d-line"/><line x1="40" y1="20" x2="40" y2="140" class="d-line"/>
    <text x="520" y="158" text-anchor="end" class="t-small t-dim">${L('시행', 'Trial')}</text>
    <text x="46" y="16" class="t-small t-dim">${L('차이 (로그)', 'Difference (log)')}</text>
    <path d="M60,30 L90,30 L90,50 L120,50 L120,70 L150,70 L150,90 L180,90 L180,70 L210,70 L210,90 L240,90 L240,110 L270,110 L270,90 L300,90 L300,110 L330,110 L330,90 L360,90 L360,110 L390,110 L390,100 L420,100 L420,110 L450,110" class="d-b"/>
    <circle cx="180" cy="90" r="5" class="d-accent"/><circle cx="240" cy="110" r="5" class="d-accent"/><circle cx="270" cy="90" r="5" class="d-accent"/><circle cx="300" cy="110" r="5" class="d-accent"/>
    <line x1="40" y1="100" x2="520" y2="100" class="d-good" stroke-dasharray="5 4"/>
    <text x="520" y="94" text-anchor="end" class="t-small">${L('역치 (반전 평균)', 'Threshold (mean of reversals)')}</text>
    <text x="96" y="22" class="t-small">${L('두 번 맞히면 내림', '2 correct: step down')}</text>
    <text x="150" y="128" class="t-small">${L('한 번 틀리면 올림', '1 wrong: step up')}</text>
  </svg>`,
  look: [
    '가상 청취자를 켜 두면 계단이 처음에 빠르게 내려가다가 역치 근처에서 오르내림. 반전(보라색 원)이 쌓이면 추정값이 정해짐.',
    '가상 청취자 역치 배율을 2로 바꾸면 수렴 높이가 약 2배 위로 올라감',
    '시험 종류를 "크기"로 바꾸면 역치가 1 dB 조금 아래(약 0.7 dB)에서 수렴함',
    '"소리 켜기"를 누르고 가상 청취자를 끈 뒤 직접 해 보면 음 높이 역치가 보통 5~20센트 사이에서 나옴',
  ],
  refs: [
    { type: 'paper', title: 'Levitt, "Transformed up-down methods in psychoacoustics", JASA 49(2B)', year: 1971, note: '2-down 1-up 계단법과 70.7% 수렴점' },
    { type: 'paper', title: 'Wier, Jesteadt, Green, "Frequency discrimination as a function of frequency and sensation level", JASA 61(1)', year: 1977, note: '주파수와 레벨에 따른 음 높이 JND' },
    { type: 'paper', title: 'Jesteadt, Wier, Green, "Intensity discrimination as a function of frequency and sensation level", JASA 61(1)', year: 1977, note: '크기 JND와 베버 법칙에서의 작은 이탈' },
    { type: 'book', title: 'Brian C. J. Moore, An Introduction to the Psychology of Hearing (6th ed.)', year: 2012, note: '차이 역치와 측정 방법' },
  ],
  params: [
    { key: 'test', label: '시험 종류', type: 'select', options: [{ value: 'pitch', label: '음 높이 (센트)' }, { value: 'loud', label: '크기 (dB)' }], default: 'pitch', reset: true, group: '시험' },
    { key: 'freq', label: '기준 주파수 (Hz)', type: 'range', min: 200, max: 4000, step: 10, default: 1000 },
    { key: 'sim', label: '가상 청취자', type: 'bool', default: true, help: '자동으로 답하는 모의 청취자. 끄면 직접 답함.' },
    { key: 'skill', label: '가상 청취자 역치 배율', type: 'range', min: 0.5, max: 3, step: 0.1, default: 1, help: '1 = 음 높이 5센트, 크기 1 dB에서 약 82% 정답', when: (p) => p.sim },
    { key: 'play', label: '다시 듣기', type: 'button', buttonLabel: '다시 듣기 (Space)', group: '응답' },
    { key: 'ans1', label: '1번이 더 높음/큼', type: 'button', buttonLabel: '1번 (1 키)' },
    { key: 'ans2', label: '2번이 더 높음/큼', type: 'button', buttonLabel: '2번 (2 키)' },
    { key: 'restart', label: '처음부터', type: 'button', buttonLabel: '처음부터' },
    ...GTL.audio.params({ single: true }),
  ],
  en: {
    title: 'Just Noticeable Difference (Pitch, Loudness)',
    summary: 'Two tones play in turn and you pick the higher (or louder) one to find your limit. A 2-down 1-up staircase makes the difference smaller after correct answers and bigger after a mistake, and it settles at about 71% correct.',
    controls: 'After "Sound on", turn off "Simulated listener" to test yourself. Space plays again, 1 or 2 picks the higher (louder) tone.',
    info: `
    <p>The <b>JND (just noticeable difference)</b> is the smallest difference between two stimuli you can notice. In psychoacoustics it is also called the <b>difference limen</b>.</p>
    <ul>
      <li><b>Pitch</b>: near 1 kHz, trained listeners can tell about 0.2% (about 3~4 cents, around 2 Hz). It gets bigger for very low notes and above 4 kHz.</li>
      <li><b>Loudness</b>: about 0.5~1 dB. It roughly follows Weber\'s law: the ratio of the difference stays about the same.</li>
    </ul>
    <p>The test is a <b>two-interval forced choice (2AFC)</b>: only one interval has the difference, and you pick which one. Guessing gives 50%, so the effect of guessing can be accounted for.</p>
    <p>The <b>2-down 1-up staircase</b> (Levitt 1971): two correct answers in a row make the difference smaller, one wrong answer makes it bigger. It settles at 70.7% correct. The mean of the turning points (reversals) is the threshold.</p>
    <p>In practice it sets the tolerance for pitch correction, tuning and gain automation. For example, most listeners do not notice a volume change under 1 dB or a tuning change under 5 cents.</p>`,
    look: [
      'With the simulated listener on, the staircase drops fast at first, then goes up and down near the threshold. As reversals (purple circles) pile up, the estimate is fixed.',
      'Set the simulated listener threshold to 2x. It settles about 2 times higher.',
      'Switch the test to "Loudness". The threshold settles a little under 1 dB (about 0.7 dB).',
      'Press "Sound on", turn off the simulated listener and try it yourself. A pitch threshold between 5 and 20 cents is common.',
    ],
    refs: ['The 2-down 1-up staircase and the 70.7% point.', 'Pitch JND by frequency and level.', 'Loudness JND and the "near miss" to Weber\'s law.', 'Difference limens and how to measure them.'],
    params: {
      test: { label: 'Test', group: 'Test', options: { pitch: 'Pitch (cents)', loud: 'Loudness (dB)' } },
      freq: 'Reference frequency (Hz)',
      sim: { label: 'Simulated listener', help: 'A model listener that answers by itself. Turn off to answer yourself.' },
      skill: { label: 'Simulated listener threshold (x)', help: '1 = about 82% correct at 5 cents of pitch or 1 dB of loudness' },
      play: { label: 'Play again', buttonLabel: 'Play again (Space)', group: 'Answer' },
      ans1: { label: '1st is higher/louder', buttonLabel: '1st (key 1)' },
      ans2: { label: '2nd is higher/louder', buttonLabel: '2nd (key 2)' },
      restart: { label: 'Start over', buttonLabel: 'Start over' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = C.b;
    const pitch = P.test === 'pitch';
    const START = pitch ? 60 : 6, UNIT = pitch ? L('센트', ' cents') : ' dB', REF_JND = pitch ? 5 : 1;
    const TONE = 0.4, GAP = 0.3, END = TONE * 2 + GAP;
    let clock = 0, trials = [], reversals = [], delta = START, streak = 0, lastDir = 0, cur = null, done = false, doneAt = 0;
    const rng = U.rng(ctx.seed || 5);
    function newTrial() { cur = { delta, which: rng.chance(0.5) ? 1 : 2, t0: clock + 0.3, answered: false }; }
    function restart() { trials = []; reversals = []; delta = START; streak = 0; lastDir = 0; done = false; newTrial(); }
    restart();
    function answer(k) {
      if (!cur || cur.answered || done || clock < cur.t0 + END - 0.05) return;
      cur.answered = true;
      const ok = k === cur.which;
      trials.push({ delta: cur.delta, ok });
      let dir = 0;
      if (ok) { streak++; if (streak >= 2) { streak = 0; dir = -1; } } else { streak = 0; dir = 1; }
      if (dir) {
        if (lastDir && dir !== lastDir) reversals.push({ i: trials.length - 1, delta: cur.delta });
        lastDir = dir;
        const f = reversals.length < 4 ? 2 : Math.SQRT2;
        delta = U.clamp(dir < 0 ? delta / f : delta * f, pitch ? 0.25 : 0.05, START * 2);
      }
      if (reversals.length >= 12) { done = true; doneAt = clock; }
      else newTrial();
    }
    // 2AFC 정답 확률 (와이블): 0.5 + 0.5 (1 - exp(-(Δ/α)^β))
    const pCorrect = (d) => 1 - 0.5 * Math.exp(-Math.pow(d / (REF_JND * P.skill), 2));
    const estimate = () => {
      const last = reversals.slice(-8);
      if (last.length < 2) return null;
      return Math.exp(last.reduce((s, r) => s + Math.log(r.delta), 0) / last.length);
    };
    // 시각 e(초, 시행 시작 기준)에서 소리: { on, f, gainDb }
    function stim(e) {
      if (!cur || e < 0 || e > END) return null;
      const k = e < TONE ? 1 : e >= TONE + GAP ? 2 : 0;
      if (!k) return null;
      const local = k === 1 ? e : e - TONE - GAP;
      const env = Math.min(1, local / 0.02, (TONE - local) / 0.02);
      const target = k === cur.which;
      return { env: Math.max(0, env), f: P.freq * (pitch && target ? Math.pow(2, cur.delta / 1200) : 1), db: !pitch && target ? cur.delta : 0, k };
    }

    let ph = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        for (let i = 0; i < n; i++) {
          const s = cur ? stim(clock - cur.t0) : null;
          let v = 0;
          if (s) { v = 0.25 * s.env * A.dbToLin(s.db - 3) * Math.sin(ph); ph += 2 * Math.PI * s.f / sr; if (ph > 6.283185307) ph -= 6.283185307; }
          l[i] = v; r[i] = v;
          clock += 1 / sr;
        }
      },
    });

    return {
      update(dt) {
        snd.update();
        if (!snd.on) clock += dt;
        if (ctx.input.pressed('Space') && cur && !done) cur.t0 = clock + 0.15;
        if (ctx.input.pressed('Digit1')) answer(1);
        if (ctx.input.pressed('Digit2')) answer(2);
        if (P.sim && cur && !cur.answered && !done && clock > cur.t0 + END + 0.25) answer(rng.chance(pCorrect(cur.delta)) ? cur.which : 3 - cur.which);
        if (done && P.sim && clock - doneAt > 4) restart();
      },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        // 위: 현재 시행 타임라인
        const ty = pad + 14, th = 30, tw = Math.min(360, W - pad * 2);
        const e = cur ? clock - cur.t0 : -1;
        D.text(g, L('현재 시행: 1번, 2번 중 한쪽만 차이가 있음', 'Current trial: only one of 1st and 2nd has the difference'), pad, pad, { size: 10, color: C.dim });
        for (let k = 1; k <= 2; k++) {
          const x = pad + (k - 1) * (tw / 2 + 6), w = tw / 2 - 6;
          const s = stim(e), lit = s && s.k === k;
          D.rect(g, x, ty, w, th, lit ? 'rgba(79,195,247,0.55)' : 'rgba(255,255,255,0.06)', C.dim);
          D.text(g, k + L('번', ''), x + w / 2, ty + 9, { size: 12, align: 'center' });
        }
        if (done) D.text(g, L('측정 끝', 'Finished'), pad + tw + 12, ty + 9, { size: 12, color: C.good });
        else if (cur && cur.answered === false && e > END) D.text(g, P.sim ? L('가상 청취자가 답하는 중', 'Simulated listener answering') : L('1 또는 2를 고르기', 'Pick 1 or 2'), pad + tw + 12, ty + 9, { size: 11, color: C.warn });
        // 아래: 계단 그래프 (로그 축)
        const gx = pad + 36, gy = ty + th + 18, gw = W - gx - pad, gh = H - gy - 22;
        D.rect(g, gx, gy, gw, gh, 'rgba(0,0,0,0.35)');
        const lo = pitch ? 0.5 : 0.1, hi = START * 2;
        const yOf = (d) => gy + gh - (Math.log(U.clamp(d, lo, hi)) - Math.log(lo)) / (Math.log(hi) - Math.log(lo)) * gh;
        const ticks = pitch ? [1, 2, 5, 10, 20, 50, 100] : [0.2, 0.5, 1, 2, 5, 10];
        for (const v of ticks) { D.line(g, gx, yOf(v), gx + gw, yOf(v), C.grid); D.text(g, String(v), gx - 4, yOf(v) - 5, { size: 9, align: 'right', color: C.dim }); }
        D.text(g, L(`차이 (${pitch ? '센트' : 'dB'}, 로그 축), x: 시행`, `Difference (${pitch ? 'cents' : 'dB'}, log axis), x: trial`), gx, gy - 13, { size: 10, color: C.dim });
        const n = Math.max(30, trials.length + 2), xOf = (i) => gx + 8 + (gw - 16) * i / (n - 1);
        g.setLineDash([2, 4]); D.line(g, gx, yOf(REF_JND * P.skill), gx + gw, yOf(REF_JND * P.skill), C.dim, 1); g.setLineDash([]);
        if (P.sim) D.text(g, L('가상 청취자 기준', 'Sim listener scale'), gx + gw - 4, yOf(REF_JND * P.skill) + 2, { size: 9, align: 'right', color: C.dim });
        g.beginPath();
        trials.forEach((t, i) => { const x = xOf(i), y = yOf(t.delta); i ? g.lineTo(x, y) : g.moveTo(x, y); });
        g.strokeStyle = 'rgba(79,195,247,0.5)'; g.lineWidth = 1.5; g.stroke();
        trials.forEach((t, i) => D.circle(g, xOf(i), yOf(t.delta), 3.5, t.ok ? C.good : C.bad));
        for (const rv of reversals) D.circle(g, xOf(rv.i), yOf(rv.delta), 7, null, C.accent, 1.5);
        const est = estimate();
        if (est) { g.setLineDash([6, 4]); D.line(g, gx, yOf(est), gx + gw, yOf(est), col, 1.5); g.setLineDash([]); }
        if (cur && !done) D.circle(g, xOf(trials.length), yOf(cur.delta), 4, null, C.text, 1.5);
        const fmt = (d) => (pitch ? d.toFixed(1) : d.toFixed(2)) + UNIT;
        ctx.stat(L('현재 차이', 'Current difference'), fmt(cur ? cur.delta : delta) + (pitch ? ` (${(P.freq * (Math.pow(2, (cur ? cur.delta : delta) / 1200) - 1)).toFixed(1)} Hz)` : ''));
        ctx.stat(L('시행 수, 반전 수', 'Trials, reversals'), `${trials.length}, ${reversals.length} / 12`);
        ctx.stat(L('정답률', 'Correct'), trials.length ? (100 * trials.filter((t) => t.ok).length / trials.length).toFixed(0) + '%' : '-');
        ctx.stat(L('역치 추정', 'Threshold estimate'), est ? fmt(est) + (pitch ? ` (${(100 * (Math.pow(2, est / 1200) - 1)).toFixed(2)}%)` : '') : '-');
        snd.stat();
      },
      onAction(k) {
        if (k === 'sound') snd.toggle();
        else if (k === 'play' && cur && !done) { cur.t0 = clock + 0.15; }
        else if (k === 'ans1') answer(1);
        else if (k === 'ans2') answer(2);
        else if (k === 'restart') restart();
      },
      dispose() { snd.stop(); },
    };
  },
});
