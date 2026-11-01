// 지연선 피치 시프터: 읽기 탭 1개(되감길 때 클릭) vs 탭 2개 크로스페이드 vs 그레인 4개 + 지터
GTL.register({
  id: 'pitch-shift',
  title: '피치 시프트 (지연선 탭과 그레인)',
  summary: '지연 시간을 일정한 속도로 줄이거나 늘리면 도플러 효과로 음 높이가 바뀜. 하지만 지연선 길이가 한정되어 있어 탭이 되감길 때 클릭이 남. 탭 2개를 엇갈려 크로스페이드하거나 그레인 여러 개를 겹치면 클릭이 사라짐.',
  views: { a: '탭 1개 (되감기 클릭)', b: '탭 2개 크로스페이드' },
  controls: '파라미터 표에서 방식, 반음 수, 창 길이를 바꿈. "소리 켜기"를 누르면 소리 내는 뷰가 들림.',
  info: `
    <p>실시간 피치 시프터의 기본은 <b>변조 지연선</b>. 지연 D가 샘플마다 (1 - r)씩 변하면 읽기 속도가 r배가 되어 음 높이가 r배가 됨. 한 옥타브 위(r = 2)면 지연이 샘플마다 1씩 줄어듦.</p>
    <p>지연은 무한히 줄거나 늘 수 없으므로 창 길이 W 안에서 톱니처럼 되감김. 되감는 순간 읽는 위치가 W만큼 튀어 파형이 끊김.</p>
    <ul>
      <li><b>탭 1개</b>: 되감을 때마다 클릭. 초당 |1 - r| × sr / W번.</li>
      <li><b>탭 2개 크로스페이드</b>: 반 주기 어긋난 탭 2개에 sin², cos² 창을 곱해 더함. 한 탭이 되감길 때 그 탭의 음량은 0. 1970~80년대 하모나이저(Eventide H910 등)의 방식. 두 탭이 같은 소리를 시간 차이를 두고 읽으므로 콤 필터처럼 음색이 떨리는 단점이 있음.</li>
      <li><b>그레인 4개 + 지터</b>: 1/4씩 어긋난 탭 4개에 해닝 창을 씌우고, 그레인이 시작할 때마다 읽기 위치를 무작위로 조금 옮김. 탭 사이의 규칙적인 간섭이 흩어져 떨림이 줄지만 약간 거친 질감이 생김. 그래뉼러 합성과 같은 원리.</li>
    </ul>
    <p>더 좋은 방법: 주기를 찾아 그 길이에 맞춰 자르는 PSOLA(목소리), 위상 보코더(화음). 창 길이 W가 길면 저음에 좋고, 짧으면 반응이 빠르지만 저음이 흔들림.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="6" y="16" class="t-small t-dim">${L('지연 시간 (r > 1이면 줄어듦)', 'Delay time (shrinks when r > 1)')}</text>
    <line x1="20" y1="130" x2="520" y2="130" class="d-dim"/><line x1="20" y1="30" x2="20" y2="130" class="d-dim"/>
    <text x="8" y="34" class="t-small">W</text><text x="8" y="130" class="t-small">0</text>
    <path d="M20,30 L140,130 M140,30 L260,130 M260,30 L380,130 M380,30 L500,130" class="d-a"/>
    <path d="M20,80 L80,130 M80,30 L200,130 M200,30 L320,130 M320,30 L440,130 M440,30 L500,80" class="d-b" stroke-dasharray="4 3"/>
    <circle cx="140" cy="80" r="16" class="d-a"/><text x="160" y="72" class="t-small t-a">${L('되감기 = 클릭', 'Wrap = click')}</text>
    <path d="M20,148 Q80,108 140,148 Q200,108 260,148 Q320,108 380,148 Q440,108 500,148" class="d-a" opacity="0.6"/>
    <text x="270" y="166" text-anchor="middle" class="t-small">${L('창 sin²: 되감기 순간 음량 0, 다른 탭이 이어받음', 'sin² window: level 0 at the wrap, the other tap takes over')}</text>
  </svg>`,
  look: [
    'A와 B의 출력 파형을 비교하면 A는 일정 간격으로 파형이 끊기고 B는 매끈하게 이어짐',
    'A는 "되감기 (초당, 탭당)" 값만큼 1초에 틱 소리가 남. 반음 수를 0 근처로 하면 줄어듦.',
    'B의 스펙트럼에서 목표 주파수 옆에 작은 측파대가 보임. 두 탭이 섞이며 생기는 음량 떨림 때문.',
    '방식을 "그레인 4개"로 바꾸면 측파대가 흩어져 잡음 바닥처럼 퍼짐',
    '창 길이를 20ms로 줄이면 떨림이 빨라져 거친 소리, 150ms로 늘리면 메아리처럼 번지는 소리가 남',
  ],
  refs: [
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed., Wiley', year: 2011, note: '6장 시간 영역 피치 시프트와 타임 스트레치' },
    { type: 'paper', title: 'Jon Dattorro, "Effect Design, Part 2: Delay-Line Modulation and Chorus", Journal of the Audio Engineering Society 45(10)', year: 1997, note: '변조 지연선과 도플러 피치 변화' },
    { type: 'book', title: 'Curtis Roads, Microsound, MIT Press', year: 2001, note: '그래뉼러 처리' },
    { type: 'book', title: 'Miller Puckette, The Theory and Technique of Electronic Music, World Scientific', year: 2007, url: 'http://msp.ucsd.edu/techniques.htm', note: '7장 지연선 피치 시프터' },
  ],
  params: [
    { key: 'method', label: '방식', type: 'select', options: [{ value: 'single', label: '탭 1개' }, { value: 'dual', label: '탭 2개 크로스페이드' }, { value: 'grain', label: '그레인 4개 + 지터' }], a: 'single', b: 'dual', group: '피치 시프트' },
    { key: 'semi', label: '피치 변화 (반음)', type: 'range', min: -12, max: 12, step: 1, default: 7, shared: true },
    { key: 'win', label: '창 길이 W (ms)', type: 'range', min: 20, max: 150, step: 1, default: 60, shared: true },
    { key: 'dry', label: '원음 섞기', type: 'bool', default: false, shared: true },
    { key: 'src', label: '음원', type: 'select', options: [{ value: 'melody', label: '멜로디' }, { value: 'sine', label: '사인파 (A4)' }], default: 'melody', shared: true, group: '음원' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Pitch Shift (Delay Line Taps and Grains)',
    summary: 'Shrinking or growing a delay at a steady rate changes the pitch through the Doppler effect. But the delay line is finite, so the tap must wrap around, which makes a click. Two taps half a cycle apart with a crossfade, or several overlapping grains, remove the click.',
    views: { a: '1 tap (wrap click)', b: '2 taps with crossfade' },
    controls: 'Change method, semitones and window length in the parameter table. Press "Sound on" to hear the view that plays sound.',
    info: `
    <p>The basic real-time pitch shifter is a <b>modulated delay line</b>. If delay D changes by (1 - r) every sample, the read speed is r times, so the pitch is r times higher. One octave up (r = 2) shrinks the delay by 1 every sample.</p>
    <p>The delay cannot shrink or grow forever, so it wraps like a saw inside a window of length W. At the wrap the read position jumps by W and the waveform breaks.</p>
    <ul>
      <li><b>1 tap</b>: a click at every wrap, |1 - r| × sr / W times per second.</li>
      <li><b>2 taps with crossfade</b>: two taps half a cycle apart, weighted by sin² and cos² windows. When one tap wraps, its level is 0. This is how 1970s and 80s harmonizers (such as the Eventide H910) worked. The two taps read the same sound at different times, so the tone wobbles like a comb filter.</li>
      <li><b>4 grains + jitter</b>: four taps a quarter apart with Hann windows. Each grain starts at a slightly random read position. The regular interference between taps is scattered, so the wobble drops, but the texture gets a little rough. Same idea as granular synthesis.</li>
    </ul>
    <p>Better methods: PSOLA cuts at detected pitch periods (voice). A phase vocoder handles chords. A long window W suits low notes. A short one reacts faster but makes low notes wobble.</p>`,
    look: [
      'Compare the output waveforms. A breaks at regular intervals. B joins smoothly.',
      'A ticks as many times per second as its "Wraps (per s, per tap)" stat. Setting semitones near 0 reduces them.',
      'B\'s spectrum shows small sidebands next to the target frequency. They come from the level wobble when the two taps mix.',
      'Switch the method to "4 grains". The sidebands scatter and spread like a noise floor.',
      'Shorten the window to 20 ms for a fast, rough wobble. Lengthen it to 150 ms for an echo-like smear.',
    ],
    refs: ['Ch. 6 time-domain pitch shifting and time stretching.', 'Modulated delay lines and Doppler pitch change.', 'Granular processing.', 'Ch. 7 delay-line pitch shifter.'],
    params: {
      method: { label: 'Method', group: 'Pitch shift', options: { single: '1 tap', dual: '2 taps with crossfade', grain: '4 grains + jitter' } },
      semi: 'Pitch change (semitones)',
      win: 'Window length W (ms)',
      dry: 'Mix in dry',
      src: { label: 'Source', group: 'Source', options: { melody: 'Melody', sine: 'Sine (A4)' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b, TAU = Math.PI * 2;
    const SRV = 24000, N = 8192;

    function makeSource(sr, kind) {
      const mel = [57, 60, 64, 62, 60, 59, 57, 52];
      let n = 0, ph = 0;
      return () => {
        n++;
        if ((kind || P.src) === 'sine') { ph = (ph + 440 / sr) % 1; return Math.sin(TAU * ph) * 0.5; }
        const step = Math.round(sr * 0.3), k = Math.floor(n / step) % 8, t = (n % step) / sr;
        ph = (ph + A.mtof(mel[k]) / sr) % 1;
        return (0.55 * Math.sin(TAU * ph) + 0.25 * Math.sin(2 * TAU * ph) + 0.15 * A.wave.saw(ph)) * Math.min(1, t * 80) * (0.6 + 0.4 * Math.exp(-t * 4)) * 0.5;
      };
    }
    const ntaps = () => (P.method === 'single' ? 1 : P.method === 'dual' ? 2 : 4);

    // 피치 시프터. taps: 각 탭의 위상(0~1)과 지터 오프셋
    function makeShifter(sr, seed) {
      const size = Math.ceil(sr * 0.4) + 8, buf = new Float32Array(size), rng = U.rng(seed);
      let w = 0, phase = 0;
      const jit = new Float64Array(4), lastPh = new Float64Array(4).fill(-1);
      const o = { taps: [], wraps: 0 };
      o.step = (x) => {
        buf[w] = x;
        const r = Math.pow(2, P.semi / 12), W = P.win / 1000 * sr, nt = ntaps();
        phase += (1 - r) / W; phase -= Math.floor(phase);
        let y = 0, gs = 0;
        for (let k = 0; k < nt; k++) {
          const ph = (phase + k / nt) % 1;
          // 되감기 감지 (위상이 크게 튐) → 그레인 모드면 새 지터
          if (lastPh[k] >= 0 && Math.abs(ph - lastPh[k]) > 0.5) { o.wraps++; if (P.method === 'grain') jit[k] = rng.range(0, 0.3) * W; }
          lastPh[k] = ph;
          const dl = 2 + ph * W + (P.method === 'grain' ? jit[k] : 0);
          let p = w - dl; while (p < 0) p += size;
          const i0 = Math.floor(p), fr = p - i0, v = buf[i0] + (buf[(i0 + 1) % size] - buf[i0]) * fr;
          const g = nt === 1 ? 1 : Math.pow(Math.sin(Math.PI * ph), 2);
          y += v * g; gs += g;
          o.taps[k] = ph;
        }
        if (nt === 4) y *= 0.5; // 해닝 4개 합 = 2
        w = (w + 1) % size;
        return P.dry ? (x + y) * 0.6 : y;
      };
      return o;
    }

    let live = null;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (!live || live.sr !== sr) live = { sr, src: makeSource(sr), fx: makeShifter(sr, 9) };
        for (let i = 0; i < n; i++) { const v = live.fx.step(live.src()); l[i] = v; r[i] = v; }
      },
    });

    let key = '', out = null, mags = null, purity = 0, ripple = 0;
    function analyze() {
      const k = [P.method, P.semi, P.win, P.dry].join();
      if (k === key) return;
      key = k;
      const src = makeSource(SRV, 'sine'), fx = makeShifter(SRV, 9), warm = 4000, M = warm + N;
      out = new Float32Array(M);
      for (let i = 0; i < M; i++) out[i] = fx.step(src());
      mags = A.spectrum(out, N, { offset: warm, window: 'blackman' });
      // 목표 주파수 ±3 bin 에너지 비율
      const ft = 440 * Math.pow(2, P.semi / 12), bin = SRV / N, b0 = Math.round(ft / bin);
      let et = 0, ea = 0;
      for (let b = 1; b < mags.length; b++) { const e = Math.pow(10, mags[b] / 10); ea += e; if (Math.abs(b - b0) <= 3) et += e; }
      purity = 10 * Math.log10(Math.max(1e-12, et) / Math.max(1e-12, ea - et));
      // 음량 떨림: 5ms 창 RMS의 최대/최소
      const wn = Math.round(0.005 * SRV);
      let mx = 0, mn = 1e9;
      for (let s = warm; s + wn < M; s += wn) { const v = A.rms(out, s, s + wn); mx = Math.max(mx, v); mn = Math.min(mn, v); }
      ripple = A.linToDb(mx / Math.max(1e-6, mn));
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2;
        const h1 = (H - pad * 4) * 0.3, h2 = (H - pad * 4) * 0.3, h3 = H - pad * 4 - h1 - h2;
        // 탭 지연 궤적 (시각화용 이론값, 3창)
        D.rect(g, pad, pad, w, h1, 'rgba(0,0,0,0.35)');
        const r = Math.pow(2, P.semi / 12), nt = ntaps(), Ws = P.win / 1000, span = Math.abs(1 - r) > 1e-6 ? 3 * Ws / Math.abs(1 - r) : 1;
        const cols = [col, C.good, C.warn, C.accent];
        for (let k = 0; k < nt; k++) {
          for (let i = 0; i < w; i += 2) {
            const t = span * i / w, ph = (((1 - r) * t / Ws + k / nt) % 1 + 1) % 1;
            const gk = nt === 1 ? 1 : Math.pow(Math.sin(Math.PI * ph), 2);
            g.globalAlpha = 0.25 + 0.75 * gk;
            D.rect(g, pad + i, pad + h1 - 4 - ph * (h1 - 18), 2, 2, cols[k]);
          }
        }
        g.globalAlpha = 1;
        D.text(g, GTL.L(`탭별 지연 (0 ~ W, 진할수록 음량 큼), ${(span * 1000).toFixed(0)}ms`, `Delay per tap (0 to W, brighter = louder), ${(span * 1000).toFixed(0)} ms`), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 출력 파형 (사인 입력)
        const y2 = pad * 2 + h1;
        A.drawWave(g, out, pad, y2, w, h2, { from: 4000, count: Math.round(SRV * Math.min(0.25, Math.max(0.03, span))), color: col, amp: 1.6, label: GTL.L('출력 파형 (사인 440Hz 입력)', 'Output waveform (sine 440 Hz input)') });
        // 스펙트럼 (선형, 0 ~ 2kHz)
        const y3 = pad * 3 + h1 + h2, ft = 440 * r;
        A.drawSpectrum(g, mags, SRV, pad, y3, w, h3, { color: col, fmin: 100, fmax: 3000, minDb: -90, maxDb: 0, label: GTL.L('출력 스펙트럼 (노란 선 = 목표 주파수)', 'Output spectrum (yellow = target frequency)') });
        const tx = A.freqX(ft, pad, w, 100, 3000);
        D.line(g, tx, y3, tx, y3 + h3, C.warn, 1);
        ctx.stat(GTL.L('피치 비율 r', 'Pitch ratio r'), r.toFixed(3) + ` (${ft.toFixed(0)} Hz)`);
        ctx.stat(GTL.L('되감기 (초당, 탭당)', 'Wraps (per s, per tap)'), (Math.abs(1 - r) / Ws).toFixed(1) + (nt === 1 ? GTL.L(' 클릭', ' clicks') : ''));
        ctx.stat(GTL.L('목표음 대 나머지', 'Target vs rest'), purity.toFixed(1) + ' dB');
        ctx.stat(GTL.L('음량 떨림 (5ms RMS)', 'Level wobble (5 ms RMS)'), ripple.toFixed(1) + ' dB');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
