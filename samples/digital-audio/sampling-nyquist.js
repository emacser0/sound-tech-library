// 샘플링과 나이퀴스트: 샘플레이트의 절반보다 높은 사인파는 낮은 주파수로 접혀 들림 (에일리어싱)
GTL.register({
  id: 'sampling-nyquist',
  title: '샘플링과 나이퀴스트 주파수',
  summary: '같은 사인파를 두 샘플레이트로 샘플링. 나이퀴스트 주파수(샘플레이트의 절반)보다 높은 음은 낮은 주파수로 접혀 다른 음으로 들림.',
  views: { a: '샘플레이트 8 kHz', b: '샘플레이트 16 kHz' },
  controls: '파라미터 표에서 입력 주파수를 바꿈. "주파수 훑기"를 켜면 입력이 계속 올라감.',
  info: `
    <p><b>샘플링(Sampling)</b>은 연속 신호를 일정한 간격으로 재서 숫자 열로 바꾸는 일. 1초에 재는 횟수가 <b>샘플레이트</b>(fs).</p>
    <p>샘플링 정리(Nyquist-Shannon)에 따르면 fs/2보다 낮은 주파수만 원래대로 되살릴 수 있음. fs/2가 <b>나이퀴스트 주파수</b>. 그보다 높은 사인파도 샘플 값은 만들어지지만, 그 점들은 더 낮은 사인파와 정확히 같음. 그래서 재생하면 낮은 음이 들림. 이것이 <b>에일리어싱(Aliasing)</b>.</p>
    <ul>
      <li>접힌 주파수: f를 fs로 나눈 나머지 r을 구하고, r이 fs/2보다 크면 fs - r</li>
      <li>그래서 CD(44.1 kHz)는 22.05 kHz까지 담음. 사람의 가청 한계(약 20 kHz) 바로 위.</li>
      <li>실제 ADC는 샘플링 전에 아날로그 로우패스(안티에일리어싱 필터)로 fs/2 위를 먼저 지움</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="4" y="16" class="t-small t-dim">${L('주파수 축 (fs = 8 kHz)', 'Frequency axis (fs = 8 kHz)')}</text>
    <line x1="30" y1="110" x2="520" y2="110" class="d-line"/>
    <rect x="270" y="40" width="250" height="70" class="f-dim"/>
    <text x="395" y="56" text-anchor="middle" class="t-small t-dim">${L('표현할 수 없는 영역', 'Cannot be represented')}</text>
    <line x1="270" y1="30" x2="270" y2="120" class="d-dim" stroke-dasharray="4 3"/>
    <text x="270" y="134" text-anchor="middle" class="t-small">${L('fs/2 = 4 kHz', 'fs/2 = 4 kHz')}</text>
    <text x="30" y="134" text-anchor="middle" class="t-small t-dim">0</text>
    <text x="510" y="134" text-anchor="middle" class="t-small t-dim">8 kHz</text>
    <line x1="360" y1="110" x2="360" y2="70" class="d-a"/>
    <text x="360" y="64" text-anchor="middle" class="t-small t-a">${L('입력 5.5 kHz', 'input 5.5 kHz')}</text>
    <line x1="180" y1="110" x2="180" y2="70" class="d-b"/>
    <text x="180" y="64" text-anchor="middle" class="t-small t-b">${L('들리는 음 2.5 kHz', 'heard 2.5 kHz')}</text>
    <path d="M352,88 Q270,58 190,88" class="d-accent" marker-end="url(#arr)"/>
    <text x="270" y="158" text-anchor="middle" class="t-small t-dim">${L('fs/2를 거울처럼 접음: 8 - 5.5 = 2.5 kHz', 'Folds around fs/2 like a mirror: 8 - 5.5 = 2.5 kHz')}</text>
  </svg>`,
  look: [
    '기본 상태(입력 5 kHz)에서 A의 샘플 점을 이은 곡선은 3 kHz 사인파. B는 입력과 같은 5 kHz.',
    '"주파수 훑기"를 켜고 소리를 들으면 A는 4 kHz를 넘는 순간 음이 다시 내려감',
    '입력 주파수를 8 kHz로 맞추면 A의 샘플 점이 모두 같은 높이가 되어 소리가 사라짐 (0 Hz로 접힘)',
    '입력을 3 kHz 아래로 내리면 두 뷰가 같은 음을 냄',
  ],
  refs: [
    { type: 'paper', title: 'C. E. Shannon, "Communication in the Presence of Noise", Proceedings of the IRE', year: 1949, note: '샘플링 정리' },
    { type: 'paper', title: 'H. Nyquist, "Certain Topics in Telegraph Transmission Theory", Transactions of the AIEE', year: 1928, note: '나이퀴스트 주파수의 출발점' },
    { type: 'book', title: 'Julius O. Smith III, Mathematics of the Discrete Fourier Transform (DFT)', url: 'https://ccrma.stanford.edu/~jos/mdft/', note: '샘플링 정리와 에일리어싱' },
    { type: 'book', title: 'Ken C. Pohlmann, Principles of Digital Audio', note: '샘플링, ADC 안티에일리어싱 필터' },
  ],
  params: [
    { key: 'fs', label: '샘플레이트 (Hz)', type: 'select', options: [4000, 8000, 11025, 16000, 22050, 32000, 44100].map((v) => ({ value: v, label: String(v) })), a: 8000, b: 16000, default: 8000, group: '샘플링' },
    { key: 'freq', label: '입력 주파수 (Hz)', type: 'range', min: 50, max: 16000, step: 10, default: 5000, shared: true, group: '입력 사인파' },
    { key: 'sweep', label: '주파수 훑기', type: 'bool', default: false, shared: true, help: '8초 동안 100 Hz에서 16 kHz까지 올라감' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Sampling and the Nyquist Frequency',
    summary: 'The same sine wave is sampled at two sample rates. A tone above the Nyquist frequency (half the sample rate) folds down and plays as a different, lower tone.',
    views: { a: 'Sample rate 8 kHz', b: 'Sample rate 16 kHz' },
    controls: 'Change the input frequency in the parameter table. Turn on "Frequency sweep" to keep raising the input.',
    info: `
    <p><b>Sampling</b> measures a continuous signal at fixed intervals and turns it into a list of numbers. The number of measurements per second is the <b>sample rate</b> (fs).</p>
    <p>The sampling theorem (Nyquist-Shannon) says that only frequencies below fs/2 can be rebuilt exactly. fs/2 is the <b>Nyquist frequency</b>. A sine above it still produces sample values, but those points match a lower sine exactly. So playback gives the lower tone. This is <b>aliasing</b>.</p>
    <ul>
      <li>Folded frequency: take r = f mod fs. If r is above fs/2, the result is fs - r.</li>
      <li>This is why CD audio (44.1 kHz) holds up to 22.05 kHz, just above the hearing limit (about 20 kHz).</li>
      <li>A real ADC removes content above fs/2 with an analog lowpass (anti-aliasing filter) before sampling.</li>
    </ul>`,
    look: [
      'At the default input (5 kHz), the curve through A\'s sample points is a 3 kHz sine. B shows the real 5 kHz.',
      'Turn on "Frequency sweep" and listen. In A the tone turns around and goes down once it passes 4 kHz.',
      'Set the input to 8 kHz. All of A\'s sample points sit at the same height and the sound disappears (it folds to 0 Hz).',
      'Lower the input below 3 kHz. Both views play the same tone.',
    ],
    refs: ['The sampling theorem.', 'Origin of the Nyquist frequency.', 'Sampling theorem and aliasing.', 'Sampling and ADC anti-aliasing filters.'],
    params: {
      fs: { label: 'Sample rate (Hz)', group: 'Sampling' },
      freq: { label: 'Input frequency (Hz)', group: 'Input sine' },
      sweep: { label: 'Frequency sweep', help: 'Rises from 100 Hz to 16 kHz over 8 seconds' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const TAU = Math.PI * 2;
    let curF = P.freq, sweepT = 0;

    // 접힌 주파수와 부호. 샘플 값 sin(2π f n/fs) = sign * sin(2π fa n/fs)
    function fold(f, fs) {
      const r = ((f % fs) + fs) % fs;
      return r <= fs / 2 ? { fa: r, sign: 1 } : { fa: fs - r, sign: -1 };
    }

    let ph = 0, fSm = curF;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const fa = fold(curF, +P.fs).fa;
        for (let i = 0; i < n; i++) {
          fSm += (fa - fSm) * 0.002;
          ph += fSm / sr; if (ph >= 1) ph -= 1;
          const v = Math.sin(TAU * ph) * 0.45;
          l[i] = v; r[i] = v;
        }
      },
    });

    return {
      update(dt) {
        snd.update();
        if (P.sweep) { sweepT = (sweepT + dt) % 8; curF = 100 * Math.pow(160, sweepT / 8); }
        else curF = P.freq;
      },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, fs = +P.fs, f = curF;
        const { fa, sign } = fold(f, fs);
        const pad = 10, th = Math.max(60, H * 0.55);
        // 시간 영역: 샘플 24개 구간
        const nS = 24, T = nS / fs, x0 = pad, w = W - pad * 2, mid = pad + th / 2, amp = th * 0.4;
        D.rect(g, x0, pad, w, th, 'rgba(0,0,0,0.35)');
        D.line(g, x0, mid, x0 + w, mid, C.grid, 1);
        const tx = (t) => x0 + (t / T) * w;
        // 연속 입력 (흐리게)
        g.beginPath();
        const steps = Math.max(200, Math.floor(w * 2));
        for (let i = 0; i <= steps; i++) { const t = (i / steps) * T, y = mid - Math.sin(TAU * f * t) * amp; i ? g.lineTo(tx(t), y) : g.moveTo(tx(t), y); }
        g.strokeStyle = 'rgba(216,221,230,0.35)'; g.lineWidth = 1; g.stroke();
        // 복원된 신호 (이상적 재구성 = 접힌 주파수의 사인)
        g.beginPath();
        for (let i = 0; i <= steps; i++) { const t = (i / steps) * T, y = mid - sign * Math.sin(TAU * fa * t) * amp; i ? g.lineTo(tx(t), y) : g.moveTo(tx(t), y); }
        g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        // 샘플 점
        for (let n = 0; n <= nS; n++) {
          const t = n / fs, y = mid - Math.sin(TAU * f * t) * amp;
          D.line(g, tx(t), mid, tx(t), y, 'rgba(255,255,255,0.25)', 1);
          D.circle(g, tx(t), y, 3, C.warn);
        }
        D.text(g, Lx('흐린 선 = 입력, 노란 점 = 샘플, 색 선 = 샘플에서 되살린 신호', 'Faint = input, yellow dots = samples, colored = signal rebuilt from samples'), x0 + 4, pad + 3, { size: 10, color: C.dim });

        // 주파수 축 (0 ~ 16 kHz 선형)
        const fy = pad * 2 + th, fh = H - fy - pad, FMAX = 16000;
        D.rect(g, x0, fy, w, fh, 'rgba(0,0,0,0.35)');
        const fx = (fr) => x0 + U.clamp(fr / FMAX, 0, 1) * w;
        const base = fy + fh - 18;
        if (fs / 2 < FMAX) D.rect(g, fx(fs / 2), fy, x0 + w - fx(fs / 2), fh, 'rgba(255,83,112,0.08)');
        D.line(g, x0, base, x0 + w, base, C.dim, 1);
        for (let k = 0; k <= FMAX; k += 2000) { D.line(g, fx(k), base, fx(k), base + 4, C.dim, 1); D.text(g, k / 1000 + 'k', fx(k) + 2, base + 4, { size: 9, color: C.dim }); }
        for (let m = 1; m * fs / 2 <= FMAX; m++) {
          const px = fx(m * fs / 2);
          g.setLineDash([4, 3]); D.line(g, px, fy + 14, px, base, m % 2 ? C.warn : C.dim, 1); g.setLineDash([]);
          D.text(g, m === 1 ? 'fs/2' : m === 2 ? 'fs' : (m + '/2 fs'), px + 2, fy + 14, { size: 9, color: m % 2 ? C.warn : C.dim });
        }
        const hh = fh - 40;
        D.line(g, fx(f), base, fx(f), base - hh, 'rgba(216,221,230,0.6)', 2);
        D.line(g, fx(fa), base, fx(fa), base - hh * 0.85, col, 3);
        if (Math.abs(fa - f) > 1) {
          g.beginPath(); g.moveTo(fx(f), base - hh); g.quadraticCurveTo((fx(f) + fx(fa)) / 2, fy + 4, fx(fa), base - hh * 0.85);
          g.strokeStyle = C.accent; g.lineWidth = 1.5; g.stroke();
        }
        D.text(g, Lx('주파수 (흰 막대 = 입력, 색 막대 = 들리는 음)', 'Frequency (white bar = input, colored bar = what you hear)'), x0 + 4, fy + 3, { size: 10, color: C.dim });

        ctx.stat(Lx('나이퀴스트', 'Nyquist'), (fs / 2).toFixed(0) + ' Hz');
        ctx.stat(Lx('입력', 'Input'), f.toFixed(0) + ' Hz');
        ctx.stat(Lx('들리는 음', 'Heard tone'), fa.toFixed(0) + ' Hz');
        ctx.stat(Lx('에일리어싱', 'Aliasing'), f > fs / 2 ? Lx('있음 (접힘)', 'Yes (folded)') : Lx('없음', 'No'));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
