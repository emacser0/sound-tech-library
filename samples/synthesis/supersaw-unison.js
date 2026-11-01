// 슈퍼소 (유니즌): 톱니파 여러 개를 조금씩 어긋나게 겹치고 좌우로 벌림. 1개 vs 7개
GTL.register({
  id: 'supersaw-unison',
  title: '슈퍼소와 유니즌 (디튠, 스테레오 퍼짐)',
  summary: '같은 음의 톱니파 여러 개를 몇 센트씩 어긋나게 겹치면 서로 맞물렸다 엇갈리며 넓고 두꺼운 소리가 됨. 좌우로 벌리면 스테레오 폭도 넓어짐. 트랜스와 EDM 리드, 패드의 기본 소리.',
  views: { a: '보이스 1개', b: '보이스 7개 (슈퍼소)' },
  controls: '파라미터 표에서 보이스 수, 디튠, 스테레오 퍼짐을 바꿈. "소리 켜기"를 누르면 화음이 계속 울림.',
  info: `
    <p><b>유니즌(Unison)</b>은 한 음을 오실레이터 여러 개로 동시에 연주하는 기법. 각 오실레이터를 몇 센트씩 다르게 조율(디튠)하면 주파수 차이만큼 맥놀이가 생기고, 여러 맥놀이가 겹쳐 합창처럼 풍성해짐. Roland JP-8000(1997)의 <b>슈퍼소(Supersaw)</b>는 톱니파 7개를 이렇게 겹친 것.</p>
    <ul>
      <li><b>디튠</b>: 가장 바깥 보이스의 어긋난 정도(센트). 배음 번호가 클수록 주파수 차이가 커져 높은 배음일수록 넓게 퍼짐.</li>
      <li><b>위상</b>: 보이스마다 시작 위상을 무작위로 정해야 첫 순간에 모두 겹쳐 튀는 소리가 나지 않음</li>
      <li><b>스테레오 퍼짐</b>: 보이스를 좌우에 나눠 놓으면 두 채널이 서로 달라져 넓게 들림. 대신 모노로 합치면 일부 성분이 상쇄됨.</li>
    </ul>
    <p>단점은 보이스 수만큼 계산이 늘고, 음량이 커지므로 대략 1/&radic;N로 줄여야 함</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="16" class="t-small t-dim">${L('배음마다 보이스가 모인 다발', 'A cluster of voices at each harmonic')}</text>
    <line x1="20" y1="120" x2="520" y2="120" class="d-line"/>
    <line x1="100" y1="120" x2="100" y2="40" class="d-a"/><text x="100" y="136" text-anchor="middle" class="t-small">f</text>
    <line x1="260" y1="120" x2="260" y2="70" class="d-a"/><text x="260" y="136" text-anchor="middle" class="t-small">2f</text>
    <line x1="420" y1="120" x2="420" y2="88" class="d-a"/><text x="420" y="136" text-anchor="middle" class="t-small">3f</text>
    <g class="d-b"><line x1="94" y1="120" x2="94" y2="50"/><line x1="97" y1="120" x2="97" y2="50"/><line x1="103" y1="120" x2="103" y2="50"/><line x1="106" y1="120" x2="106" y2="50"/></g>
    <g class="d-b"><line x1="248" y1="120" x2="248" y2="78"/><line x1="254" y1="120" x2="254" y2="78"/><line x1="266" y1="120" x2="266" y2="78"/><line x1="272" y1="120" x2="272" y2="78"/></g>
    <g class="d-b"><line x1="402" y1="120" x2="402" y2="94"/><line x1="411" y1="120" x2="411" y2="94"/><line x1="429" y1="120" x2="429" y2="94"/><line x1="438" y1="120" x2="438" y2="94"/></g>
    <text x="520" y="40" text-anchor="end" class="t-small t-a">${L('A: 보이스 1개 = 선 하나', 'A: 1 voice = one line')}</text>
    <text x="520" y="56" text-anchor="end" class="t-small t-b">${L('B: 높은 배음일수록 넓은 다발', 'B: wider clusters at higher harmonics')}</text>
  </svg>`,
  look: [
    '위 스펙트럼에서 A는 배음마다 선 하나, B는 배음마다 선 다발이 있고 오른쪽(높은 배음)으로 갈수록 다발이 넓어짐',
    '가운데 고니오미터(좌우 위상 그림)에서 A는 세로 막대(모노), B는 넓게 퍼진 구름',
    '"소리 켜기"를 누르고 B를 들으면 넓고 두꺼운 패드. A는 가늘고 정지된 소리.',
    '디튠을 60센트 이상으로 올리면 B가 음정이 흐린 "취한" 소리로 바뀜. 5센트 근처면 천천히 넘실거림.',
  ],
  refs: [
    { type: 'paper', title: 'Adam Szabo, "How to Emulate the Super Saw" (Master\'s thesis, KTH Royal Institute of Technology)', year: 2010, note: 'JP-8000 슈퍼소의 디튠과 믹스 곡선 분석' },
    { type: 'engine', title: 'Roland JP-8000 Owner\'s Manual', note: 'Super Saw 파형' },
    { type: 'book', title: 'Will Pirkle, Designing Software Synthesizer Plugins in C++', year: 2021, note: '유니즌과 디튠 구현' },
  ],
  params: [
    { key: 'voices', label: '보이스 수', type: 'int', min: 1, max: 9, default: 7, a: 1, b: 7, group: '유니즌' },
    { key: 'detune', label: '디튠 (센트, 바깥 보이스)', type: 'range', min: 0, max: 100, step: 0.5, default: 25, shared: true },
    { key: 'spread', label: '스테레오 퍼짐', type: 'range', min: 0, max: 1, step: 0.01, default: 0.8, shared: true },
    { key: 'chord', label: '화음 (A 단조)', type: 'bool', default: true, shared: true, group: '음' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Supersaw and Unison (Detune, Stereo Spread)',
    summary: 'Stack several saw waves of the same note, each detuned by a few cents. They drift in and out of phase and sound wide and thick. Panning them left and right also widens the stereo image. This is the basic sound of trance and EDM leads and pads.',
    views: { a: '1 voice', b: '7 voices (supersaw)' },
    controls: 'Change voice count, detune and stereo spread in the parameter table. Press "Sound on" to hear a held chord.',
    info: `
    <p><b>Unison</b> plays one note with several oscillators at once. If each is tuned a few cents apart (detune), their frequency differences cause beating. Many beats together sound rich, like a choir. The <b>Supersaw</b> of the Roland JP-8000 (1997) stacks seven saws this way.</p>
    <ul>
      <li><b>Detune</b>: how far the outer voices are off (in cents). Higher harmonics have larger frequency differences, so they spread wider.</li>
      <li><b>Phase</b>: each voice needs a random start phase. Otherwise all voices line up at the first moment and make a click.</li>
      <li><b>Stereo spread</b>: placing voices left and right makes the two channels differ, so it sounds wide. But summing to mono cancels part of it.</li>
    </ul>
    <p>The downside: CPU cost grows with the voice count, and the level grows too, so you scale by about 1/&radic;N.</p>`,
    look: [
      'In the top spectrum, A has one line per harmonic. B has a cluster per harmonic, and clusters get wider to the right (higher harmonics).',
      'In the goniometer (stereo phase plot) in the middle, A is a vertical bar (mono). B is a wide cloud.',
      'Press "Sound on" and listen to B. It is a wide, thick pad. A is thin and static.',
      'Raise detune above 60 cents. B sounds "drunk" with an unclear pitch. Near 5 cents it slowly swirls.',
    ],
    refs: ['Analysis of the JP-8000 supersaw detune and mix curves.', 'The Super Saw waveform.', 'Unison and detune implementation.'],
    params: {
      voices: { label: 'Voices', group: 'Unison' },
      detune: 'Detune (cents, outer voice)', spread: 'Stereo spread',
      chord: { label: 'Chord (A minor)', group: 'Note' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const notes = () => (P.chord ? [45, 57, 60, 64] : [57]);
    const r = U.rng(ctx.seed || 1), PH0 = [];
    for (let i = 0; i < 4 * 9; i++) PH0.push(r.next());
    // 보이스 i의 디튠(센트)과 팬(-1~1)
    function voice(i) {
      const N = P.voices;
      if (N === 1) return { c: 0, pan: 0 };
      const u = i / (N - 1) * 2 - 1;
      const side = (i & 1 ? 1 : -1) * (0.3 + 0.7 * Math.abs(u));
      return { c: u * P.detune, pan: Math.abs(u) < 1e-6 ? 0 : side * P.spread };
    }
    const saw = (x) => 2 * (x - Math.floor(x)) - 1;

    const live = { ph: new Float64Array(36), n: 0 };
    for (let i = 0; i < 36; i++) live.ph[i] = PH0[i];
    const snd = A.player(ctx, {
      process(l, r2, sr, n) {
        const ns = notes(), N = P.voices, vs = [], gl = [], gr = [];
        for (let i = 0; i < N; i++) { const v = voice(i); vs.push(v); gl.push(Math.cos((v.pan + 1) * Math.PI / 4)); gr.push(Math.sin((v.pan + 1) * Math.PI / 4)); }
        const gain = 0.42 / Math.sqrt(N * ns.length);
        for (let s = 0; s < n; s++) {
          let L = 0, R = 0;
          for (let k = 0; k < ns.length; k++) {
            const f = A.mtof(ns[k]);
            for (let i = 0; i < N; i++) {
              const j = k * 9 + i, dt = f * Math.pow(2, vs[i].c / 1200) / sr, p = live.ph[j];
              const v = 2 * p - 1 - A.polyBlep(p, dt);
              live.ph[j] = p + dt >= 1 ? p + dt - 1 : p + dt;
              L += v * gl[i]; R += v * gr[i];
            }
          }
          l[s] = L * gain; r2[s] = R * gain;
        }
        live.n += n;
      },
    });

    // 시각화용: 시각 t부터 M개 샘플 (단순 톱니파 공식, 상태 없음)
    const M = 1024, SR = 48000, bufL = new Float32Array(M), bufR = new Float32Array(M);
    function sampleWindow(t) {
      const ns = notes(), N = P.voices, gain = 0.42 / Math.sqrt(N * ns.length);
      bufL.fill(0); bufR.fill(0);
      for (let k = 0; k < ns.length; k++) {
        const f0 = A.mtof(ns[k]);
        for (let i = 0; i < N; i++) {
          const v = voice(i), f = f0 * Math.pow(2, v.c / 1200), a = Math.cos((v.pan + 1) * Math.PI / 4) * gain, b = Math.sin((v.pan + 1) * Math.PI / 4) * gain;
          const p0 = PH0[k * 9 + i] + f * t;
          for (let s = 0; s < M; s++) { const x = saw(p0 + f * s / SR); bufL[s] += x * a; bufR[s] += x * b; }
        }
      }
    }

    let visT = 0;
    return {
      update(dt) { snd.update(); visT += dt; },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const t = snd.on ? live.n / (snd.sr || SR) : visT;
        sampleWindow(t);
        // 1) 배음 다발 (가장 낮은 음 기준, 1~6번 배음)
        const h1 = (H - pad * 3) * 0.42, f0 = A.mtof(notes()[0]), NH = 6, fmax = f0 * (NH + 0.5), sw = W - pad * 2;
        D.rect(g, pad, pad, sw, h1, 'rgba(0,0,0,0.35)');
        for (let h = 1; h <= NH; h++) {
          for (let i = 0; i < P.voices; i++) {
            const f = h * f0 * Math.pow(2, voice(i).c / 1200), px = pad + f / fmax * sw;
            const bh = (1 / h) * (h1 - 20);
            D.line(g, px, pad + h1, px, pad + h1 - bh, col, 1.5);
          }
          D.text(g, h + 'f', pad + h * f0 / fmax * sw, pad + h1 - 12, { size: 9, color: C.dim, align: 'center' });
        }
        D.text(g, Lx(`보이스별 주파수 (가장 낮은 음 ${A.noteName(notes()[0])}의 배음 1~6)`, `Voice frequencies (harmonics 1 to 6 of the lowest note ${A.noteName(notes()[0])})`), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 2) 고니오미터 + 파형
        const y2 = pad * 2 + h1, h2 = H - y2 - pad, gs = Math.min(h2, sw * 0.4);
        D.rect(g, pad, y2, gs, gs, 'rgba(0,0,0,0.35)');
        const cx = pad + gs / 2, cy = y2 + gs / 2, sc = gs * 0.45 / 0.6;
        D.line(g, cx, y2, cx, y2 + gs, C.grid, 1); D.line(g, pad, cy, pad + gs, cy, C.grid, 1);
        g.fillStyle = col;
        let sLL = 0, sRR = 0, sLR = 0;
        for (let s = 0; s < M; s++) {
          const L = bufL[s], R = bufR[s];
          sLL += L * L; sRR += R * R; sLR += L * R;
          const mid = (L + R) * Math.SQRT1_2, side = (R - L) * Math.SQRT1_2;
          g.fillRect(cx + U.clamp(side * sc, -gs / 2, gs / 2) - 0.75, cy - U.clamp(mid * sc, -gs / 2, gs / 2) - 0.75, 1.5, 1.5);
        }
        D.text(g, Lx('고니오미터', 'Goniometer'), pad + 4, y2 + 3, { size: 10, color: C.dim });
        D.text(g, 'M', cx + 3, y2 + 14, { size: 9, color: C.dim }); D.text(g, 'L', pad + 4, y2 + gs - 14, { size: 9, color: C.dim }); D.text(g, 'R', pad + gs - 10, y2 + gs - 14, { size: 9, color: C.dim });
        const wx = pad * 2 + gs, ww = W - wx - pad;
        A.drawWave(g, bufL, wx, y2, ww, h2 / 2 - 2, { count: 600, color: col, amp: 1.4, lineWidth: 1, label: Lx('왼쪽 채널', 'Left channel') });
        A.drawWave(g, bufR, wx, y2 + h2 / 2 + 2, ww, h2 / 2 - 2, { count: 600, color: col, amp: 1.4, lineWidth: 1, label: Lx('오른쪽 채널', 'Right channel') });
        const corr = sLR / Math.sqrt(Math.max(1e-12, sLL * sRR));
        ctx.stat(Lx('보이스 수 x 음 수', 'Voices x notes'), `${P.voices} x ${notes().length} = ${P.voices * notes().length}`);
        ctx.stat(Lx('좌우 상관도', 'L/R correlation'), corr.toFixed(2) + Lx(' (1 = 모노)', ' (1 = mono)'));
        ctx.stat(Lx('6번 배음 다발 폭', 'Cluster width at 6th harmonic'), P.voices > 1 ? (6 * f0 * (Math.pow(2, P.detune / 1200) - Math.pow(2, -P.detune / 1200))).toFixed(1) + ' Hz' : '0 Hz');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
