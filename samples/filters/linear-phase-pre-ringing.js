// 선형 위상 vs 최소 위상: 크기 응답이 같은 가파른 FIR 두 개를 드럼 타격에 걸어 프리링잉(앞울림) 비교
GTL.register({
  id: 'linear-phase-pre-ringing',
  title: '선형 위상 EQ의 프리링잉',
  summary: '선형 위상 필터는 임펄스 응답이 좌우 대칭이라 타격음보다 먼저 울림(프리링잉)이 나옴. 같은 크기 응답의 최소 위상 필터는 울림이 모두 타격 뒤로 가서 앞울림이 없음.',
  views: { a: '선형 위상', b: '최소 위상' },
  info: `
    <p><b>선형 위상(Linear Phase)</b> 필터는 모든 주파수를 같은 시간만큼 늦춤. 위상 왜곡이 없지만 임펄스 응답이 중심 기준으로 좌우 대칭. 그래서 가파른 필터일수록 울림의 절반이 타격 <b>앞</b>에 나옴. 이것이 <b>프리링잉(Pre-ringing)</b>.</p>
    <p>귀는 소리 뒤의 울림은 잘 못 듣지만(시간 마스킹), 소리 앞의 울림은 잘 들음. 킥, 스네어 앞에 "스윽" 하는 번진 소리로 들림.</p>
    <ul>
      <li><b>최소 위상(Minimum Phase)</b>: 같은 크기 응답에서 에너지를 가장 앞으로 모은 필터. 울림이 모두 뒤에 있고 지연이 거의 없음. 아날로그 EQ와 일반 IIR EQ가 최소 위상.</li>
      <li>이 샘플은 선형 위상 FIR에서 켑스트럼(Cepstrum) 방법으로 최소 위상 FIR을 만듦. 크기 응답은 같고 위상만 다름.</li>
      <li>선형 위상 EQ는 지연이 탭 수의 절반이라 실시간 모니터링에 불리함</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="18" class="t-small t-a">${L('선형 위상: 대칭 울림', 'Linear phase: symmetric ringing')}</text>
    <line x1="20" y1="80" x2="250" y2="80" class="d-dim"/>
    <path d="M20,80 L50,79 L60,83 L70,76 L80,86 L90,72 L100,92 L110,62 L120,30 L130,62 L140,92 L150,72 L160,86 L170,76 L180,83 L190,79 L220,80" class="d-a"/>
    <line x1="120" y1="24" x2="120" y2="120" class="d-dim" stroke-dasharray="3 3"/>
    <text x="75" y="112" text-anchor="middle" class="t-small t-a">${L('타격 전 울림', 'ringing before the hit')}</text>
    <text x="120" y="136" text-anchor="middle" class="t-small t-dim">${L('타격 시점 (지연 후)', 'hit time (after delay)')}</text>
    <text x="290" y="18" class="t-small t-b">${L('최소 위상: 울림이 모두 뒤에', 'Minimum phase: all ringing after')}</text>
    <line x1="290" y1="80" x2="520" y2="80" class="d-dim"/>
    <path d="M290,80 L300,80 L306,30 L314,95 L322,68 L330,90 L340,73 L350,86 L362,76 L376,83 L392,78 L420,80.5 L520,80" class="d-b"/>
    <line x1="303" y1="24" x2="303" y2="120" class="d-dim" stroke-dasharray="3 3"/>
    <text x="400" y="112" text-anchor="middle" class="t-small t-b">${L('타격 뒤 울림 (마스킹되어 잘 안 들림)', 'ringing after the hit (masked, hard to hear)')}</text>
  </svg>`,
  look: [
    '"타격음 출력" 그래프에서 A는 점선(타격 시점) 앞에 진동이 보임. B는 점선 앞이 평평함.',
    '"프리링잉 에너지" 측정값을 비교하면 A는 약 -40dB, B는 "없음" (최소 위상은 타격 전에 출력이 없음)',
    '"소리 켜기" 후 A를 들으면 킥과 스네어 앞에 "스윽" 하는 번짐이 들림. B는 타격이 또렷함.',
    '탭 수를 늘리면(더 가파른 필터) A의 앞울림이 길어지고 "지연" 측정값도 커짐',
  ],
  refs: [
    { type: 'book', title: 'Julius O. Smith III, Introduction to Digital Filters with Audio Applications (Minimum Phase Filters)', url: 'https://ccrma.stanford.edu/~jos/filters/', note: '최소 위상의 정의와 성질' },
    { type: 'book', title: 'Alan V. Oppenheim, Ronald W. Schafer, Discrete-Time Signal Processing, 3rd ed.', year: 2009, note: '켑스트럼으로 최소 위상 시퀀스를 만드는 방법' },
    { type: 'book', title: 'Bob Katz, Mastering Audio: The Art and the Science, 3rd ed.', year: 2014, note: '선형 위상 EQ의 프리링잉과 사용 시점' },
    { type: 'book', title: 'Hugo Fastl, Eberhard Zwicker, Psychoacoustics: Facts and Models, 3rd ed.', year: 2007, note: '앞 마스킹과 뒤 마스킹의 길이 차이' },
  ],
  params: [
    { key: 'phase', label: '위상', type: 'select', group: '필터', options: [{ value: 'linear', label: '선형 위상' }, { value: 'minimum', label: '최소 위상' }], a: 'linear', b: 'minimum' },
    { key: 'type', label: '종류', type: 'select', options: [{ value: 'lowpass', label: '로우패스' }, { value: 'highpass', label: '하이패스' }], default: 'lowpass', shared: true },
    { key: 'fc', label: '컷오프 (Hz)', type: 'range', min: 100, max: 6000, step: 10, default: 800, shared: true },
    { key: 'taps', label: '탭 수', type: 'select', options: [{ value: 255, label: '255' }, { value: 511, label: '511' }, { value: 1023, label: '1023' }], default: 511, shared: true, help: '많을수록 가파르고 울림이 김' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Pre-Ringing of Linear Phase EQ',
    summary: 'A linear phase filter has a symmetric impulse response, so it rings before the hit (pre-ringing). A minimum phase filter with the same magnitude puts all ringing after the hit, so there is no pre-ringing.',
    views: { a: 'Linear phase', b: 'Minimum phase' },
    info: `
    <p>A <b>linear phase</b> filter delays every frequency by the same time. It has no phase distortion, but its impulse response is symmetric around the center. So the steeper the filter, the more ringing comes <b>before</b> the hit. This is <b>pre-ringing</b>.</p>
    <p>Our ears barely notice ringing after a sound (temporal masking), but they notice ringing before it. It sounds like a smeared "swish" before kicks and snares.</p>
    <ul>
      <li><b>Minimum phase</b>: the filter that puts the energy as early as possible for a given magnitude response. All ringing comes after and there is almost no delay. Analog EQs and normal IIR EQs are minimum phase.</li>
      <li>This sample makes a minimum phase FIR from the linear phase FIR with the cepstrum method. The magnitude is the same, only the phase differs.</li>
      <li>A linear phase EQ is delayed by half its taps, which is bad for live monitoring.</li>
    </ul>`,
    look: [
      'In the "Drum hit output" graph, A shows ripples before the dashed line (hit time). B is flat before it.',
      'Compare the "Pre-ringing energy" stat. A is about -40 dB and B is "None" (a minimum phase filter has no output before the hit).',
      'Press "Sound on" and listen to A. You hear a "swish" before the kick and snare. B keeps the hits sharp.',
      'Raise the taps (a steeper filter). A\'s pre-ringing gets longer and the "Delay" stat grows.',
    ],
    refs: ['Definition and properties of minimum phase.', 'Making a minimum phase sequence with the cepstrum.', 'Pre-ringing of linear phase EQ and when to use it.', 'How backward and forward masking differ in length.'],
    params: {
      phase: { label: 'Phase', group: 'Filter', options: { linear: 'Linear phase', minimum: 'Minimum phase' } },
      type: { label: 'Type', options: { lowpass: 'Lowpass', highpass: 'Highpass' } },
      fc: 'Cutoff (Hz)',
      taps: { label: 'Taps', help: 'More taps are steeper and ring longer' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, NF = 8192;

    function linearTaps(type, fc, n, sr) {
      const h = new Float64Array(n), m = (n - 1) / 2, wc = 2 * fc / sr;
      let s = 0;
      for (let i = 0; i < n; i++) {
        const x = i - m, sinc = x === 0 ? wc : Math.sin(Math.PI * wc * x) / (Math.PI * x);
        h[i] = sinc * A.windows.blackman(i, n); s += h[i];
      }
      for (let i = 0; i < n; i++) h[i] /= s;
      if (type === 'highpass') { for (let i = 0; i < n; i++) h[i] = -h[i]; h[m] += 1; } // 스펙트럼 반전
      return h;
    }
    // 켑스트럼 방법: 같은 크기 응답의 최소 위상 FIR
    function minimumTaps(h) {
      const re = new Float64Array(NF), im = new Float64Array(NF);
      re.set(h);
      A.fft(re, im);
      for (let k = 0; k < NF; k++) { re[k] = Math.log(Math.max(1e-9, Math.hypot(re[k], im[k]))); im[k] = 0; }
      A.fft(re, im, true); // 실수 켑스트럼
      for (let k = 1; k < NF / 2; k++) { re[k] *= 2; im[k] = 0; }
      for (let k = NF / 2 + 1; k < NF; k++) { re[k] = 0; im[k] = 0; }
      im[0] = 0; im[NF / 2] = 0;
      A.fft(re, im);
      for (let k = 0; k < NF; k++) { const e = Math.exp(re[k]), ph = im[k]; re[k] = e * Math.cos(ph); im[k] = e * Math.sin(ph); }
      A.fft(re, im, true);
      return Float64Array.from(re.subarray(0, h.length));
    }
    const design = (sr) => { const h = linearTaps(P.type, P.fc, +P.taps, sr); return P.phase === 'minimum' ? minimumTaps(h) : h; };

    // 합성 드럼: 킥(사인 하강) + 스네어(노이즈 + 톤). 120BPM 8분음표
    function makeDrums(sr, seed) {
      const r = U.rng(seed); let n = 0;
      const step = Math.round(sr * 0.25), pat = ['k', '', 's', '', 'k', 'k', 's', ''];
      let kind = '', t0 = 0, kph = 0;
      return () => {
        if (n % step === 0) { kind = pat[(n / step) % pat.length]; t0 = n; kph = 0; }
        const t = (n - t0) / sr; n++;
        if (kind === 'k') { const f = 45 + 110 * Math.exp(-t * 30); kph += f / sr; return Math.sin(U.TAU * kph) * Math.exp(-t * 9) * 0.8; }
        if (kind === 's') return (r.range(-1, 1) * Math.exp(-t * 22) * 0.5 + Math.sin(U.TAU * 190 * t) * Math.exp(-t * 30) * 0.4);
        return 0;
      };
    }

    const live = { key: '', h: null, buf: new Float64Array(2048), idx: 0, drum: makeDrums(SR, 2) };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const k = [P.phase, P.type, P.fc, P.taps, sr].join();
        if (k !== live.key) { live.key = k; live.h = design(sr); }
        const h = live.h, m = h.length, buf = live.buf;
        for (let i = 0; i < n; i++) {
          buf[live.idx] = live.drum();
          let y = 0;
          for (let j = 0; j < m; j++) y += h[j] * buf[(live.idx - j + 2048) & 2047];
          live.idx = (live.idx + 1) & 2047;
          y *= 0.7; l[i] = y; r[i] = y;
        }
      },
    });

    // 분석: 스네어 한 번을 필터에 통과시킴
    const HN = 4096, ONSET = 1600;
    let key = '', taps = null, hit = null, out = null, pre = 0, lat = 0, peakAt = 0, mag = null;
    function analyze() {
      const k = [P.phase, P.type, P.fc, P.taps].join();
      if (k === key) return;
      key = k;
      taps = design(SR);
      // 지연(플러그인이 보고하는 지연 보정량): 선형 위상은 (N-1)/2, 최소 위상은 0
      let pk = 0; for (let i = 0; i < taps.length; i++) if (Math.abs(taps[i]) > Math.abs(taps[pk])) pk = i;
      peakAt = pk;
      lat = P.phase === 'linear' ? (taps.length - 1) / 2 : 0;
      const r = U.rng(5);
      hit = new Float32Array(HN);
      for (let i = ONSET; i < HN; i++) { const t = (i - ONSET) / SR; hit[i] = r.range(-1, 1) * Math.exp(-t * 22) * 0.5 + Math.sin(U.TAU * 190 * t) * Math.exp(-t * 30) * 0.4; }
      out = new Float32Array(HN);
      for (let i = 0; i < HN; i++) { let y = 0; for (let j = 0; j < taps.length && j <= i; j++) y += taps[j] * hit[i - j]; out[i] = y; }
      // 지연을 보정한 타격 시점 앞의 에너지 / 전체 에너지
      const on = ONSET + Math.round(lat);
      let e0 = 0, e1 = 0;
      for (let i = 0; i < HN; i++) { const e = out[i] * out[i]; if (i < on) e0 += e; e1 += e; }
      pre = 10 * Math.log10(Math.max(1e-12, e0 / Math.max(1e-12, e1))); // 최소 위상은 인과적이라 0 (-120dB)
      const re = new Float64Array(NF), im = new Float64Array(NF); re.set(taps); A.fft(re, im);
      mag = (f) => { const b = Math.round(f / SR * NF); return A.linToDb(Math.hypot(re[b], im[b])); };
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 8, rw = W - pad * 2;
        const h1 = (H - pad * 4) * 0.28, h2 = (H - pad * 4) * 0.42, h3 = H - pad * 4 - h1 - h2;
        A.drawResponse(g, mag, pad, pad, rw, h1, { color: col, minDb: -90, maxDb: 6, dbStep: 30, label: L('크기 응답 (두 방식이 같음)', 'Magnitude (same for both)') });
        // 타격음 출력: 지연을 빼고 타격 시점 근처 40ms
        const y2 = pad * 2 + h1, on = ONSET + Math.round(lat), from = Math.max(0, on - 960), cnt = Math.min(HN - from, 1920);
        A.drawWave(g, out, pad, y2, rw, h2, { from, count: cnt, color: col, amp: 0.9 / Math.max(0.05, A.peak(out)), label: L('타격음 출력 (지연 보정, 40ms)', 'Drum hit output (delay removed, 40 ms)') });
        const ox = pad + rw * (on - from) / (cnt - 1);
        g.setLineDash([3, 3]); D.line(g, ox, y2, ox, y2 + h2, C.text, 1); g.setLineDash([]);
        D.rect(g, pad, y2 + h2 - 4, ox - pad, 4, 'rgba(255,83,112,0.5)');
        const y3 = y2 + h2 + pad;
        A.drawWave(g, taps, pad, y3, rw, h3, { color: col, amp: 0.9 / Math.max(0.01, A.peak(taps)), label: L(`임펄스 응답 (${taps.length} 탭)`, `Impulse response (${taps.length} taps)`) });
        ctx.stat(L('프리링잉 에너지', 'Pre-ringing energy'), pre < -100 ? L('없음', 'None') : pre.toFixed(1) + ' dB');
        ctx.stat(L('지연', 'Delay'), `${Math.round(lat)} ${L('샘플', 'samples')} (${(lat / SR * 1000).toFixed(1)} ms)`);
        ctx.stat(L('임펄스 응답 최대값 위치', 'Impulse response peak at'), `${peakAt} ${L('샘플', 'samples')}`);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
