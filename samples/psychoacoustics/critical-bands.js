// 임계 대역 (Bark, ERB): 두 음이 같은 청각 필터 안에 있으면 맥놀이와 거칠기, 밖에 있으면 두 음으로 분리
GTL.register({
  id: 'critical-bands',
  title: '임계 대역 (Bark, ERB)',
  summary: '귀는 소리를 폭이 정해진 청각 필터 묶음으로 나눠 들음. 두 음이 한 필터 안에 들어간 A는 맥놀이와 거칠기로 들리고, 필터 둘로 나뉜 B는 또렷한 두 음으로 들리며 크기도 더 크게 느껴짐.',
  views: { a: '같은 대역 안 (60 Hz)', b: '다른 대역 (400 Hz)' },
  controls: '파라미터 표에서 두 음의 간격과 중심 주파수를 바꿈',
  info: `
    <p>달팽이관의 기저막은 위치마다 다른 주파수에 반응하는 <b>청각 필터</b> 묶음처럼 동작함. 필터 하나의 폭을 <b>임계 대역(Critical band)</b>이라 부름.</p>
    <ul>
      <li><b>Bark</b> (Zwicker): 임계 대역 하나 = 1 Bark. 가청 범위가 약 24 Bark. 500 Hz 아래에서 폭이 약 100 Hz, 위에서는 중심 주파수의 약 20%.</li>
      <li><b>ERB</b> (Glasberg, Moore): 등가 사각 대역폭(Equivalent rectangular bandwidth). <code>ERB = 24.7 (4.37 f/1000 + 1)</code>. 저음에서 Bark보다 좁음.</li>
    </ul>
    <p>임계 대역은 여러 현상의 경계가 됨</p>
    <ul>
      <li>한 대역 안의 두 음은 맥놀이(느릴 때)나 거칠기(빠를 때)로 들림. 대역 밖이면 두 음으로 분리됨.</li>
      <li>한 대역 안에서는 에너지가 더해지고(+3dB, 크기 약 1.2배), 대역이 다르면 크기(sone)가 더해짐(약 2배)</li>
      <li>마스킹 범위, 지각 부호화기의 대역 분할, MFCC 같은 음성 특징도 이 축을 씀</li>
    </ul>
    <p>이 샘플의 필터 모양은 roex(p) 필터 (Patterson). 크기는 필터 출력에 0.23제곱을 해서 더한 단순 모델.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="130" x2="520" y2="130" class="d-line"/>
    <text x="520" y="148" text-anchor="end" class="t-small t-dim">${L('주파수', 'Frequency')}</text>
    <path d="M60,130 Q100,40 140,130" class="d-dim"/><path d="M120,130 Q160,40 200,130" class="d-dim"/><path d="M180,130 Q220,40 260,130" class="d-dim"/>
    <path d="M300,130 Q340,40 380,130" class="d-dim"/><path d="M360,130 Q400,40 440,130" class="d-dim"/><path d="M420,130 Q460,40 500,130" class="d-dim"/>
    <line x1="152" y1="130" x2="152" y2="60" class="d-a"/><line x1="168" y1="130" x2="168" y2="60" class="d-a"/>
    <text x="160" y="30" text-anchor="middle" class="t-small t-a">${L('한 필터 안: 맥놀이, 거칠기', 'One filter: beats, roughness')}</text>
    <line x1="340" y1="130" x2="340" y2="60" class="d-b"/><line x1="460" y1="130" x2="460" y2="60" class="d-b"/>
    <text x="400" y="30" text-anchor="middle" class="t-small t-b">${L('다른 필터: 두 음으로 분리', 'Different filters: two separate tones')}</text>
    <text x="270" y="164" text-anchor="middle" class="t-small">${L('곡선 하나 = 청각 필터 하나 (폭 = 임계 대역)', 'Each curve = one auditory filter (width = critical band)')}</text>
  </svg>`,
  look: [
    'A의 파형은 두 음이 겹쳐 진폭이 느리게 출렁임 (초당 60번). B는 출렁임이 너무 빨라 맥놀이로 들리지 않음.',
    'A의 "크기 (한 음 대비)"는 약 1.2배, B는 약 1.9배. 둘 다 에너지는 한 음의 2배지만 대역이 나뉘면 더 크게 들림.',
    '간격을 천천히 늘리면 임계 대역 폭 근처에서 판정이 "다른 대역"으로 바뀌고 크기 비율이 가파르게 오름',
    '중심 주파수를 200 Hz로 내리고 축을 ERB로 바꾸면 같은 간격에서 Bark보다 대역 수가 더 많음 (저음에서 ERB가 더 좁음)',
    '"소리 켜기"를 누르면 A는 "와우와우" 하는 맥놀이, B는 화음처럼 두 음이 들림',
  ],
  refs: [
    { type: 'paper', title: 'Zwicker, Terhardt, "Analytical expressions for critical-band rate and critical bandwidth as a function of frequency", JASA 68(5)', year: 1980, note: 'Bark 변환식과 임계 대역폭 식' },
    { type: 'paper', title: 'Glasberg, Moore, "Derivation of auditory filter shapes from notched-noise data", Hearing Research 47', year: 1990, note: 'ERB 식과 roex 필터' },
    { type: 'paper', title: 'Fletcher, "Auditory patterns", Reviews of Modern Physics 12', year: 1940, note: '임계 대역 개념의 시작' },
    { type: 'paper', title: 'Zwicker, Flottorp, Stevens, "Critical band width in loudness summation", JASA 29(5)', year: 1957, note: '대역이 나뉘면 크기가 더해지는 현상' },
    { type: 'paper', title: 'Smith, Abel, "Bark and ERB bilinear transforms", IEEE Trans. Speech and Audio Processing 7(6)', year: 1999, note: 'Bark, ERB 축을 DSP에서 쓰는 방법' },
    { type: 'book', title: 'Julius O. Smith III, Spectral Audio Signal Processing (CCRMA online book)', url: 'https://ccrma.stanford.edu/~jos/sasp/', note: '청각 필터 뱅크와 Bark, ERB 축' },
  ],
  params: [
    { key: 'sep', label: '두 음 간격 (Hz)', type: 'range', min: 2, max: 1000, step: 1, a: 60, b: 400, default: 60, group: '두 음' },
    { key: 'f0', label: '중심 주파수 (Hz)', type: 'range', min: 150, max: 4000, step: 10, default: 1000, shared: true },
    { key: 'scale', label: '대역 축', type: 'select', options: [{ value: 'bark', label: 'Bark' }, { value: 'erb', label: 'ERB' }], default: 'bark', shared: true, group: '표시' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Critical Bands (Bark, ERB)',
    summary: 'The ear splits sound into a bank of auditory filters with set widths. In A both tones fall in one filter and you hear beats and roughness. In B they fall in two filters, so you hear two clear tones that also sound louder.',
    views: { a: 'Same band (60 Hz)', b: 'Different bands (400 Hz)' },
    controls: 'Change the gap between the two tones and the center frequency in the parameter table.',
    info: `
    <p>The basilar membrane in the cochlea acts like a bank of <b>auditory filters</b>, each place tuned to a different frequency. The width of one filter is a <b>critical band</b>.</p>
    <ul>
      <li><b>Bark</b> (Zwicker): one critical band = 1 Bark. The hearing range is about 24 Bark. Below 500 Hz a band is about 100 Hz wide. Above, about 20% of the center frequency.</li>
      <li><b>ERB</b> (Glasberg, Moore): equivalent rectangular bandwidth. <code>ERB = 24.7 (4.37 f/1000 + 1)</code>. In the bass it is narrower than Bark.</li>
    </ul>
    <p>Critical bands are the border for many effects.</p>
    <ul>
      <li>Two tones in one band sound like beats (slow) or roughness (fast). Outside one band they separate into two tones.</li>
      <li>Inside one band the energy adds (+3 dB, about 1.2 times as loud). In different bands the loudness (sone) adds (about 2 times).</li>
      <li>Masking range, the band split in perceptual coders, and speech features like MFCC use this axis too.</li>
    </ul>
    <p>The filter shape here is the roex(p) filter (Patterson). Loudness is a simple model: each filter output to the power 0.23, summed.</p>`,
    look: [
      'In A the two tones overlap and the waveform swells slowly (60 times per second). In B the swell is too fast to be heard as beats.',
      'A\'s "Loudness (vs one tone)" is about 1.2 times, B\'s about 1.9 times. Both have twice the energy of one tone, but split bands sound louder.',
      'Slowly widen the gap. Near the critical bandwidth the verdict changes to "different bands" and the loudness ratio rises fast.',
      'Lower the center to 200 Hz and switch the axis to ERB. The same gap spans more bands than in Bark (ERB is narrower in the bass).',
      'Press "Sound on". A gives a "wah-wah" beat. B sounds like two notes of a chord.',
    ],
    refs: ['Bark formula and critical bandwidth formula.', 'ERB formula and roex filters.', 'Origin of the critical band idea.', 'Loudness adds when the bands are split.', 'Using Bark and ERB axes in DSP.', 'Auditory filter banks and the Bark and ERB axes.'],
    params: {
      sep: { label: 'Gap between tones (Hz)', group: 'Two tones' },
      f0: 'Center frequency (Hz)',
      scale: { label: 'Band axis', group: 'Display' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const bark = (f) => 13 * Math.atan(0.00076 * f) + 3.5 * Math.atan((f / 7500) * (f / 7500));
    const cbw = (f) => 25 + 75 * Math.pow(1 + 1.4 * (f / 1000) * (f / 1000), 0.69);
    const erb = (f) => 24.7 * (4.37 * f / 1000 + 1);
    const erbNum = (f) => 21.4 * Math.log10(4.37 * f / 1000 + 1);
    const erbNumInv = (e) => (Math.pow(10, e / 21.4) - 1) * 1000 / 4.37;
    // roex(p) 필터 가중치 (파워)
    const roex = (fc, f) => { const p = 4 * fc / erb(fc), gg = Math.abs(f - fc) / fc; return (1 + p * gg) * Math.exp(-p * gg); };
    const tones = () => { const f1 = Math.max(20, P.f0 - P.sep / 2), f2 = P.f0 + P.sep / 2; return [f1, f2]; };
    // 크기 모델: 0.1 ERB 간격 채널마다 E^0.23을 더함
    function loudness(fs) {
      let N = 0;
      for (let e = 1; e < 40; e += 0.1) {
        const fc = erbNumInv(e);
        let E = 0;
        for (const f of fs) E += roex(fc, f) * 1e6;
        N += Math.pow(E, 0.23) * 0.1;
      }
      return N;
    }
    let key = '', ratio = 1;
    function analyze() {
      const k = P.f0 + '|' + P.sep;
      if (k === key) return;
      key = k;
      const [f1, f2] = tones();
      ratio = loudness([f1, f2]) / loudness([P.f0]);
    }

    let ph1 = 0, ph2 = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const [f1, f2] = tones();
        for (let i = 0; i < n; i++) {
          const v = 0.22 * (Math.sin(ph1) + Math.sin(ph2));
          l[i] = v; r[i] = v;
          ph1 += 2 * Math.PI * f1 / sr; if (ph1 > 6.283185307) ph1 -= 6.283185307;
          ph2 += 2 * Math.PI * f2 / sr; if (ph2 > 6.283185307) ph2 -= 6.283185307;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const [f1, f2] = tones();
        const fmin = Math.max(20, P.f0 / 4), fmax = Math.min(20000, P.f0 * 4);
        const gx = pad, gy = pad + 16, gw = W - pad * 2, gh = Math.max(60, (H - 40) * 0.58);
        const xOf = (f) => A.freqX(f, gx, gw, fmin, fmax);
        D.rect(g, gx, gy, gw, gh, 'rgba(0,0,0,0.35)');
        A.drawFreqGrid(g, gx, gy, gw, gh, { fmin, fmax });
        D.text(g, L(`청각 필터 (${P.scale === 'bark' ? '1 Bark' : '1 ERB'} 간격), 색 = 두 음이 들어간 필터`, `Auditory filters (${P.scale === 'bark' ? '1 Bark' : '1 ERB'} apart), color = filters the tones hit`), gx, pad, { size: 10, color: C.dim });
        // 필터 중심 목록 (선택한 축에서 1단위 간격)
        const centers = [];
        if (P.scale === 'bark') { const zLo = Math.ceil(bark(fmin)), zHi = Math.floor(bark(fmax)); for (let z = zLo; z <= zHi; z++) { let lo = 1, hi = 22000; for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; if (bark(m) < z) lo = m; else hi = m; } centers.push(lo); } }
        else { for (let e = Math.ceil(erbNum(fmin)); e <= erbNum(fmax); e++) centers.push(erbNumInv(e)); }
        const width = (fc) => (P.scale === 'bark' ? cbw(fc) : erb(fc));
        for (const fc of centers) {
          const w = width(fc);
          const hit1 = Math.abs(f1 - fc) <= w / 2, hit2 = Math.abs(f2 - fc) <= w / 2;
          g.beginPath();
          for (let i = 0; i <= 60; i++) {
            const f = fc * Math.pow(2, (i / 60 - 0.5) * 2.4);
            // roex 모양을 선택한 축의 폭에 맞게 늘림
            const wgt = roex(fc, fc + (f - fc) * erb(fc) / w);
            const x = xOf(f), y = gy + gh - wgt * gh * 0.8;
            i ? g.lineTo(x, y) : g.moveTo(x, y);
          }
          g.strokeStyle = hit1 && hit2 ? col : hit1 || hit2 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.14)';
          g.lineWidth = hit1 || hit2 ? 1.8 : 1; g.stroke();
        }
        // 중심 주파수의 대역 폭 표시
        const bw = width(P.f0);
        D.rect(g, xOf(P.f0 - bw / 2), gy + gh - 6, xOf(P.f0 + bw / 2) - xOf(P.f0 - bw / 2), 6, 'rgba(199,146,234,0.6)');
        for (const f of [f1, f2]) D.line(g, xOf(f), gy + 12, xOf(f), gy + gh, C.warn, 2);
        // 아래: 파형 (100 ms)
        const wy = gy + gh + 20, wh = H - wy - 14;
        if (wh > 20) {
          const N = 600, dur = 0.1, buf = new Float32Array(N);
          for (let i = 0; i < N; i++) { const tt = i / N * dur; buf[i] = 0.5 * (Math.sin(2 * Math.PI * f1 * tt) + Math.sin(2 * Math.PI * f2 * tt)); }
          A.drawWave(g, buf, gx, wy, gw, wh, { color: col, amp: 0.95, label: L('두 음을 더한 파형 (100 ms)', 'Sum of the two tones (100 ms)') });
        }
        const dz = bark(f2) - bark(f1), de = erbNum(f2) - erbNum(f1);
        const same = (P.scale === 'bark' ? dz : de) < 1;
        ctx.stat(L('두 음', 'Tones'), `${f1.toFixed(0)} Hz, ${f2.toFixed(0)} Hz`);
        ctx.stat(L('중심의 대역폭', 'Bandwidth at center'), `${cbw(P.f0).toFixed(0)} Hz (Bark), ${erb(P.f0).toFixed(0)} Hz (ERB)`);
        ctx.stat(L('간격', 'Gap'), `${dz.toFixed(2)} Bark, ${de.toFixed(2)} ERB`);
        ctx.stat(L('판정', 'Verdict'), same ? L('같은 대역 (맥놀이, 거칠기)', 'same band (beats, roughness)') : L('다른 대역 (두 음)', 'different bands (two tones)'));
        ctx.stat(L('크기 (한 음 대비)', 'Loudness (vs one tone)'), ratio.toFixed(2) + 'x');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
