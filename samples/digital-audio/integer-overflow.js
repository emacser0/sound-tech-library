// 정수 오버플로: 고정 소수점에서 최대값을 넘으면 반대쪽 끝으로 넘어감(랩어라운드). 포화 연산은 끝에 붙잡아 둠
GTL.register({
  id: 'integer-overflow',
  title: '정수 오버플로: 랩어라운드 vs 포화',
  summary: '16비트 정수로 게인을 올리거나 여러 소리를 더할 때 최대값을 넘는 경우를 비교. 랩어라운드는 큰 양수가 큰 음수로 뒤집혀 폭발음이 나고, 포화는 끝에서 잘려 비교적 순한 왜곡이 됨.',
  views: { a: '랩어라운드 (보통 정수 연산)', b: '포화 연산' },
  controls: '파라미터 표에서 게인과 신호를 바꿈',
  info: `
    <p>DSP 칩, 오래된 게임기, 임베디드 기기, WAV 파일은 샘플을 <b>고정 소수점 정수</b>로 다룸. 16비트 부호 있는 정수의 범위는 -32768~32767.</p>
    <p>보통 정수 연산(2의 보수)은 범위를 넘으면 반대쪽 끝으로 넘어감. 32767에 1을 더하면 -32768. 이것이 <b>랩어라운드(Wraparound)</b>. 파형 꼭대기가 바닥으로 뒤집혀 아주 큰 계단이 생기고, 날카롭고 시끄러운 잡음이 됨.</p>
    <ul>
      <li><b>포화 연산(Saturating arithmetic)</b>: 범위를 넘으면 최대값이나 최소값에 붙잡아 둠. 하드 클리핑과 같음. DSP 명령어 세트(ARM QADD, x86 PADDSW 등)가 따로 제공함.</li>
      <li>여러 보이스를 더하는 믹서는 중간 합을 더 넓은 정수(32비트 누산기)에 담고 마지막에 한 번 포화시킴</li>
      <li>부동 소수점(float)은 1.0을 넘어도 값이 보존되어 이 문제가 없음. 대신 최종 출력 직전에 범위를 확인해야 함.</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <circle cx="110" cy="85" r="55" class="d-line"/>
    <text x="110" y="24" text-anchor="middle" class="t-small t-mono">0</text>
    <text x="110" y="156" text-anchor="middle" class="t-small t-mono t-a">32767 | -32768</text>
    <text x="178" y="89" class="t-small t-mono">+16384</text>
    <text x="14" y="89" class="t-small t-mono">-16384</text>
    <path d="M150,124 A55,55 0 0 1 72,124" class="d-a" marker-end="url(#arr)"/>
    <text x="110" y="100" text-anchor="middle" class="t-small t-a">${L('넘으면 반대쪽', 'wraps to the other end')}</text>
    <line x1="290" y1="60" x2="520" y2="60" class="d-dim" stroke-dasharray="3 3"/>
    <line x1="290" y1="130" x2="520" y2="130" class="d-dim" stroke-dasharray="3 3"/>
    <path d="M290,95 C300,70 310,60 318,60 L322,60 V130 C340,130 345,95 350,95" class="d-a"/>
    <path d="M370,95 C380,70 390,60 398,60 H430 C440,60 445,95 450,95" class="d-b"/>
    <text x="320" y="152" text-anchor="middle" class="t-small t-a">${L('랩어라운드', 'Wraparound')}</text>
    <text x="410" y="152" text-anchor="middle" class="t-small t-b">${L('포화', 'Saturation')}</text>
    <text x="470" y="56" class="t-small t-dim">32767</text>
  </svg>`,
  look: [
    'A의 파형은 꼭대기에서 바닥으로 뚝 떨어지는 세로선이 보임. B는 꼭대기가 평평하게 잘림.',
    '"소리 켜기"로 A를 들으면 찢어지는 큰 잡음. B는 같은 게인에서도 찌그러진 정도.',
    '게인을 0 dB로 내리면 두 뷰가 같아짐 (넘치는 값이 없음)',
    '신호를 "세 음 더하기"로 바꾸면 하나하나는 범위 안이어도 합이 넘쳐 A에서 간헐적으로 터지는 소리가 남',
  ],
  refs: [
    { type: 'book', title: 'Udo Zölzer, Digital Audio Signal Processing, 2nd ed.', year: 2008, note: '고정 소수점 수 표현과 오버플로' },
    { type: 'article', title: 'Arm, "QADD" instruction, Arm Architecture Reference Manual', note: '포화 덧셈 명령' },
    { type: 'book', title: 'Will Pirkle, Designing Audio Effect Plugins in C++, 2nd ed.', year: 2019, note: '정수와 부동 소수점 오디오 데이터' },
  ],
  params: [
    { key: 'mode', label: '넘칠 때 동작', type: 'select', options: [{ value: 'wrap', label: '랩어라운드' }, { value: 'sat', label: '포화' }], a: 'wrap', b: 'sat', default: 'wrap', group: '16비트 정수 연산' },
    { key: 'gain', label: '게인 (dB)', type: 'range', min: 0, max: 18, step: 0.5, default: 6, shared: true },
    { key: 'sig', label: '신호', type: 'select', options: [{ value: 'sine', label: '사인파 (-3 dBFS)' }, { value: 'mix', label: '세 음 더하기 (각 -7 dBFS)' }], default: 'sine', shared: true, group: '신호' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Integer Overflow: Wraparound vs Saturation',
    summary: 'Compares what happens when a 16 bit integer goes past its maximum while raising gain or summing sounds. Wraparound flips a large positive value into a large negative one and explodes into noise. Saturation stops at the edge and gives milder distortion.',
    views: { a: 'Wraparound (plain integer math)', b: 'Saturating math' },
    controls: 'Change the gain and signal in the parameter table.',
    info: `
    <p>DSP chips, older consoles, embedded devices and WAV files handle samples as <b>fixed-point integers</b>. A signed 16 bit integer ranges from -32768 to 32767.</p>
    <p>Plain integer math (two's complement) wraps to the other end when it goes out of range. 32767 plus 1 is -32768. This is <b>wraparound</b>. The top of the waveform flips to the bottom, which makes a huge step and a harsh, loud noise.</p>
    <ul>
      <li><b>Saturating arithmetic</b>: values out of range are held at the max or min. This is the same as hard clipping. DSP instruction sets provide it (ARM QADD, x86 PADDSW and others).</li>
      <li>A mixer that sums many voices keeps the running sum in a wider integer (a 32 bit accumulator) and saturates once at the end.</li>
      <li>Floating point keeps values above 1.0, so this problem does not occur. You still need to check the range right before the final output.</li>
    </ul>`,
    look: [
      'A\'s waveform shows vertical lines where the top drops straight to the bottom. B\'s tops are cut flat.',
      'Press "Sound on" and listen to A: a loud tearing noise. B at the same gain is only crunchy.',
      'Lower the gain to 0 dB. Both views become the same (nothing overflows).',
      'Switch the signal to "Three tones summed". Each tone fits, but the sum overflows and A crackles now and then.',
    ],
    refs: ['Fixed-point number formats and overflow.', 'Saturating add instruction.', 'Integer and floating-point audio data.'],
    params: {
      mode: { label: 'On overflow', group: '16 bit integer math', options: { wrap: 'Wraparound', sat: 'Saturation' } },
      gain: 'Gain (dB)',
      sig: { label: 'Signal', group: 'Signal', options: { sine: 'Sine (-3 dBFS)', mix: 'Three tones summed (-7 dBFS each)' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, N = 8192, TAU = Math.PI * 2;

    const src = (t) => (P.sig === 'sine' ? 0.708 * Math.sin(TAU * 187.5 * t) : 0.447 * (Math.sin(TAU * 187.5 * t) + Math.sin(TAU * 234.375 * t + 1) + Math.sin(TAU * 281.25 * t + 2)));
    // 16비트 정수로 바꾼 뒤 정수 곱셈. 넘치면 wrap 또는 포화
    function proc(x, gl, mode) {
      const xi = U.clamp(Math.round(x * 32767), -32768, 32767);
      const yi = Math.round(xi * gl);
      const o = mode === 'wrap' ? ((((yi + 32768) % 65536) + 65536) % 65536) - 32768 : U.clamp(yi, -32768, 32767);
      return { y: o / 32768, over: yi > 32767 || yi < -32768 };
    }

    let n = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, cnt) {
        const gl = A.dbToLin(P.gain);
        for (let i = 0; i < cnt; i++) { const v = proc(src(n / sr), gl, P.mode).y * 0.45; n++; l[i] = v; r[i] = v; }
      },
    });

    let key = '', buf = null, ideal = null, mags = null, overPct = 0, distDb = 0;
    function analyze() {
      const k = P.mode + '|' + P.gain + '|' + P.sig;
      if (k === key) return;
      key = k;
      const gl = A.dbToLin(P.gain);
      buf = new Float32Array(N); ideal = new Float32Array(N);
      let ov = 0, pe = 0, ps = 0;
      for (let i = 0; i < N; i++) {
        const x = src(i / SR), r = proc(x, gl, P.mode);
        buf[i] = r.y; ideal[i] = x * gl; if (r.over) ov++;
        pe += (r.y - ideal[i]) ** 2; ps += ideal[i] ** 2;
      }
      overPct = ov / N * 100;
      distDb = pe > 1e-12 ? 10 * Math.log10(pe / ps) : -120;
      mags = A.spectrum(buf, N, { window: 'blackman' });
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2;
        const th = Math.max(60, H * 0.48), amp = 0.55, cnt = 768;
        D.rect(g, pad, pad, w, th, 'rgba(0,0,0,0.35)');
        const mid = pad + th / 2;
        for (const s of [1, -1]) { const y = mid - s * amp * th / 2; D.line(g, pad, y, pad + w, y, C.bad, 1); }
        A.drawWave(g, ideal, pad, pad, w, th, { count: cnt, amp, color: 'rgba(216,221,230,0.3)', background: false, lineWidth: 1 });
        A.drawWave(g, buf, pad, pad, w, th, { count: cnt, amp, color: col, background: false, axis: false, lineWidth: 1.6 });
        D.text(g, Lx('파형 (흐린 선 = 넘치지 않았다면, 빨간 선 = 정수 최대, 최소)', 'Waveform (faint = without overflow, red = integer max and min)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        const sy = pad * 2 + th, sh = H - sy - pad;
        A.drawSpectrum(g, mags, SR, pad, sy, w, sh, { color: col, minDb: -100, maxDb: 0, dbStep: 20, label: Lx('스펙트럼', 'Spectrum') });
        ctx.stat(Lx('넘친 샘플', 'Overflowed samples'), overPct.toFixed(1) + '%');
        ctx.stat(Lx('왜곡 (오차 / 신호)', 'Distortion (error / signal)'), distDb.toFixed(1) + ' dB');
        ctx.stat(Lx('필요한 최대값', 'Peak needed'), A.linToDb(A.peak(ideal)).toFixed(1) + ' dBFS');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
