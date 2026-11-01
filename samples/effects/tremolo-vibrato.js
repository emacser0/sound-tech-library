// 트레몰로 vs 비브라토: 같은 LFO로 크기를 흔드는가(AM), 높이를 흔드는가(FM). 측파대 스펙트럼으로 차이를 보여줌
GTL.register({
  id: 'tremolo-vibrato',
  title: '트레몰로와 비브라토 (크기 변조 vs 높이 변조)',
  summary: '같은 LFO라도 음량에 걸면 트레몰로, 음 높이에 걸면 비브라토. 트레몰로는 원래 주파수 양옆에 측파대 2개만 만들고, 비브라토는 측파대를 여러 개 만들어 스펙트럼이 넓게 퍼짐.',
  views: { a: '트레몰로 (음량)', b: '비브라토 (음 높이)' },
  controls: '파라미터 표에서 방식, 속도, 깊이를 바꿈. "소리 켜기"를 누르면 소리 내는 뷰가 들림.',
  info: `
    <p>두 이펙트 모두 LFO(보통 4~7Hz)로 소리를 주기적으로 흔듦. 무엇을 흔드는지가 다름.</p>
    <ul>
      <li><b>트레몰로(Tremolo)</b>: 음량에 LFO를 곱함. <code>y = x × (1 - d(1 - sin)/2)</code>. 펜더 앰프의 "Vibrato" 스위치는 사실 트레몰로.</li>
      <li><b>비브라토(Vibrato)</b>: 음 높이를 흔듦. 디지털에서는 지연 시간을 LFO로 흔드는 변조 지연으로 만듦. 원음은 섞지 않음(섞으면 코러스).</li>
    </ul>
    <p>스펙트럼으로 보면 차이가 분명함. 사인파에 트레몰로를 걸면 f ± LFO 위치에 측파대 2개만 생김(진폭 변조, AM). 비브라토는 주파수 변조(FM)라서 f ± k × LFO 위치에 측파대가 여러 개 생기고, 크기는 베셀 함수 J<sub>k</sub>(β)를 따름. β = 주파수 편차 / LFO 속도.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="16" class="t-small t-a">${L('트레몰로: 크기가 흔들림', 'Tremolo: level moves')}</text>
    <path d="M10,60 q5,-26 10,0 t10,0 q5,-18 10,0 t10,0 q5,-10 10,0 t10,0 q5,-18 10,0 t10,0 q5,-26 10,0 t10,0 q5,-18 10,0 t10,0 q5,-10 10,0 t10,0 q5,-18 10,0 t10,0 q5,-26 10,0 t10,0" class="d-a"/>
    <text x="280" y="16" class="t-small t-b">${L('비브라토: 간격이 흔들림', 'Vibrato: spacing moves')}</text>
    <path d="M280,60 q4,-22 8,0 t8,0 q4,-22 8,0 t8,0 q6,-22 12,0 t12,0 q7,-22 14,0 t14,0 q6,-22 12,0 t12,0 q4,-22 8,0 t8,0 q4,-22 8,0 t8,0 q6,-22 12,0 t12,0 q7,-22 14,0 t14,0" class="d-b"/>
    <line x1="20" y1="140" x2="250" y2="140" class="d-line"/><line x1="290" y1="140" x2="530" y2="140" class="d-line"/>
    <line x1="135" y1="140" x2="135" y2="96" class="d-a"/><line x1="105" y1="140" x2="105" y2="118" class="d-a"/><line x1="165" y1="140" x2="165" y2="118" class="d-a"/>
    <line x1="410" y1="140" x2="410" y2="110" class="d-b"/><line x1="385" y1="140" x2="385" y2="104" class="d-b"/><line x1="435" y1="140" x2="435" y2="104" class="d-b"/>
    <line x1="360" y1="140" x2="360" y2="116" class="d-b"/><line x1="460" y1="140" x2="460" y2="116" class="d-b"/><line x1="335" y1="140" x2="335" y2="128" class="d-b"/><line x1="485" y1="140" x2="485" y2="128" class="d-b"/>
    <text x="135" y="154" text-anchor="middle" class="t-small">${L('f ± LFO: 2개', 'f ± LFO: 2 lines')}</text>
    <text x="410" y="154" text-anchor="middle" class="t-small">${L('f ± k×LFO: 여러 개', 'f ± k×LFO: many lines')}</text>
  </svg>`,
  look: [
    '두 뷰의 측파대 스펙트럼을 비교하면 A는 가운데 선 옆에 2개, B는 여러 개가 퍼져 있음',
    'B에서 깊이(센트)를 올리면 측파대가 더 넓게 퍼지고 가운데 선이 작아짐. 베셀 함수 때문에 특정 깊이에서 가운데 선이 거의 사라짐.',
    '속도를 1Hz 아래로 내리면 둘 다 흔들림이 느리게 들리고 측파대 간격이 좁아짐',
    '방식을 "둘 다"로 바꾸면 노래하는 목소리처럼 크기와 높이가 함께 흔들림',
  ],
  refs: [
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed., Wiley', year: 2011, note: '변조 이펙트: 트레몰로, 비브라토' },
    { type: 'paper', title: 'John M. Chowning, "The Synthesis of Complex Audio Spectra by Means of Frequency Modulation", Journal of the Audio Engineering Society 21(7)', year: 1973, note: 'FM 측파대와 베셀 함수' },
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial, MIT Press', year: 1996, note: '진폭 변조와 주파수 변조' },
    { type: 'book', title: 'Will Pirkle, Designing Audio Effect Plugins in C++, 2nd ed., Routledge', year: 2019, note: '트레몰로와 변조 지연 비브라토 구현' },
  ],
  params: [
    { key: 'mode', label: '방식', type: 'select', options: [{ value: 'trem', label: '트레몰로' }, { value: 'vib', label: '비브라토' }, { value: 'both', label: '둘 다' }], a: 'trem', b: 'vib', group: '변조' },
    { key: 'rate', label: '속도 (Hz)', type: 'range', min: 0.5, max: 12, step: 0.1, default: 5, shared: true },
    { key: 'tdepth', label: '트레몰로 깊이', type: 'range', min: 0, max: 1, step: 0.01, default: 0.7, shared: true, when: (p) => p.mode !== 'vib' },
    { key: 'vdepth', label: '비브라토 깊이 (센트)', type: 'range', min: 0, max: 100, step: 1, default: 40, shared: true, when: (p) => p.mode !== 'trem' },
    { key: 'note', label: '음 높이 (MIDI)', type: 'int', min: 48, max: 84, default: 69, shared: true, group: '음원', help: '69 = A4 (440Hz)' },
    { key: 'src', label: '음원', type: 'select', options: [{ value: 'sine', label: '사인파' }, { value: 'organ', label: '오르간 (배음 4개)' }], default: 'sine', shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Tremolo and Vibrato (Level vs Pitch Modulation)',
    summary: 'The same LFO makes tremolo when it moves the level and vibrato when it moves the pitch. Tremolo adds only 2 sidebands next to the original frequency. Vibrato adds many sidebands and spreads the spectrum.',
    views: { a: 'Tremolo (level)', b: 'Vibrato (pitch)' },
    controls: 'Change mode, rate and depth in the parameter table. Press "Sound on" to hear the view that plays sound.',
    info: `
    <p>Both effects move the sound with an LFO (usually 4 to 7 Hz). They differ in what they move.</p>
    <ul>
      <li><b>Tremolo</b>: multiplies the level by the LFO. <code>y = x × (1 - d(1 - sin)/2)</code>. The "Vibrato" switch on Fender amps is actually tremolo.</li>
      <li><b>Vibrato</b>: moves the pitch. In digital audio it is a modulated delay whose delay time follows the LFO. The dry signal is not mixed in (mixing it makes a chorus).</li>
    </ul>
    <p>The spectrum shows the difference clearly. Tremolo on a sine adds only 2 sidebands at f ± LFO (amplitude modulation, AM). Vibrato is frequency modulation (FM), so it adds many sidebands at f ± k × LFO with levels given by Bessel functions J<sub>k</sub>(β). β = frequency deviation / LFO rate.</p>`,
    look: [
      'Compare the sideband spectra. A has 2 lines next to the center. B has many lines spread out.',
      'Raise depth (cents) in B. The sidebands spread wider and the center line shrinks. Because of the Bessel function, the center almost disappears at certain depths.',
      'Lower rate below 1 Hz. Both wobble slowly and the sideband spacing gets narrow.',
      'Set mode to "Both". Level and pitch move together like a singing voice.',
    ],
    refs: ['Modulation effects: tremolo and vibrato.', 'FM sidebands and Bessel functions.', 'Amplitude and frequency modulation.', 'Tremolo and modulated-delay vibrato code.'],
    params: {
      mode: { label: 'Mode', group: 'Modulation', options: { trem: 'Tremolo', vib: 'Vibrato', both: 'Both' } },
      rate: 'Rate (Hz)',
      tdepth: 'Tremolo depth',
      vdepth: 'Vibrato depth (cents)',
      note: { label: 'Pitch (MIDI)', group: 'Source', help: '69 = A4 (440 Hz)' },
      src: { label: 'Source', options: { sine: 'Sine', organ: 'Organ (4 harmonics)' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b, TAU = Math.PI * 2;
    const SRV = 16000, N = 16384;

    function makeSource(sr) {
      let ph = 0;
      return () => {
        ph += A.mtof(P.note) / sr; ph -= Math.floor(ph);
        if (P.src === 'sine') return Math.sin(TAU * ph) * 0.5;
        return (Math.sin(TAU * ph) + 0.5 * Math.sin(2 * TAU * ph) + 0.33 * Math.sin(3 * TAU * ph) + 0.25 * Math.sin(4 * TAU * ph)) * 0.25;
      };
    }
    const trem = () => P.mode !== 'vib', vib = () => P.mode !== 'trem';
    // 비브라토 지연 진폭: 피치 비율 편차 r = 2^(c/1200) - 1 = d × 2π × rate
    const vibAmp = () => (Math.pow(2, P.vdepth / 1200) - 1) / (TAU * P.rate);

    function makeMod(sr) {
      const size = Math.ceil(sr * 0.25) + 4, buf = new Float32Array(size);
      let w = 0, n = 0;
      return (x) => {
        const t = n / sr, s = Math.sin(TAU * P.rate * t); n++;
        let y = x;
        buf[w] = x;
        if (vib()) {
          const d = vibAmp(), dl = (d + d * Math.sin(TAU * P.rate * t) + 0.001) * sr;
          let p = w - dl; while (p < 0) p += size;
          const i0 = Math.floor(p), fr = p - i0;
          y = buf[i0] + (buf[(i0 + 1) % size] - buf[i0]) * fr;
        }
        w = (w + 1) % size;
        if (trem()) y *= 1 - P.tdepth * (1 - s) / 2;
        return y;
      };
    }

    let live = null;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (!live || live.sr !== sr) live = { sr, src: makeSource(sr), fx: makeMod(sr) };
        for (let i = 0; i < n; i++) { const v = live.fx(live.src()); l[i] = v; r[i] = v; }
      },
    });

    let key = '', buf = null, mags = null, sidebands = 0;
    function analyze() {
      const k = [P.mode, P.rate, P.tdepth, P.vdepth, P.note, P.src].join();
      if (k === key) return;
      key = k;
      const src = makeSource(SRV), fx = makeMod(SRV);
      buf = new Float32Array(N + 4000);
      for (let i = 0; i < buf.length; i++) buf[i] = fx(src());
      mags = A.spectrum(buf, N, { offset: 4000, window: 'blackman' });
      // 기음 주변 ±10개 측파대 중 -40dB(최대 대비) 위 개수
      const f0 = A.mtof(P.note), bin = SRV / N;
      let mx = -200;
      const lv = [];
      for (let s = -10; s <= 10; s++) {
        const b = Math.round((f0 + s * P.rate) / bin);
        let m = -200;
        for (let j = b - 1; j <= b + 1; j++) if (j > 0 && j < mags.length) m = Math.max(m, mags[j]);
        lv.push(m); mx = Math.max(mx, m);
      }
      sidebands = lv.filter((m, i) => i !== 10 && m > mx - 40).length;
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2;
        const h3 = (H - pad * 4) / 3;
        // 파형 (1초)
        A.drawWave(g, buf, pad, pad, w, h3, { from: 4000, count: SRV, color: col, amp: 1.6, label: GTL.L('출력 파형 (1초)', 'Output waveform (1 s)') });
        // 피치 (센트)
        const py = pad * 2 + h3, mid = py + h3 / 2;
        D.rect(g, pad, py, w, h3, 'rgba(0,0,0,0.35)');
        D.line(g, pad, mid, pad + w, mid, C.grid, 1);
        g.beginPath();
        for (let i = 0; i <= 200; i++) {
          const t = i / 200, c = vib() ? -P.vdepth * Math.cos(TAU * P.rate * t) : 0; // 피치 비율 1 - dD/dt
          const yy = mid - U.clamp(c / 100, -1, 1) * h3 * 0.45;
          i ? g.lineTo(pad + w * t, yy) : g.moveTo(pad + w * t, yy);
        }
        g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        D.text(g, GTL.L('음 높이 편차 (센트, ±100, 1초)', 'Pitch offset (cents, ±100, 1 s)'), pad + 4, py + 3, { size: 10, color: C.dim });
        // 측파대 스펙트럼 (선형, 기음 ± 넓이)
        const sy = pad * 3 + h3 * 2, f0 = A.mtof(P.note), span = Math.max(30, P.rate * 8), bin = SRV / N;
        D.rect(g, pad, sy, w, h3, 'rgba(0,0,0,0.35)');
        const b0 = Math.floor((f0 - span) / bin), b1 = Math.ceil((f0 + span) / bin);
        let mx = -200;
        for (let b = b0; b <= b1; b++) mx = Math.max(mx, mags[b] ?? -200);
        for (let b = b0; b <= b1; b++) {
          const v = U.clamp(((mags[b] ?? -200) - mx + 60) / 60, 0, 1), px = pad + (b - b0) / (b1 - b0) * w;
          D.rect(g, px, sy + h3 * (1 - v), Math.max(1, w / (b1 - b0) - 0.5), h3 * v, col);
        }
        const cx = pad + w / 2;
        D.line(g, cx, sy, cx, sy + 6, C.text, 1);
        D.text(g, GTL.L(`측파대 스펙트럼 (${f0.toFixed(0)}Hz ± ${span.toFixed(0)}Hz, 위 60dB)`, `Sideband spectrum (${f0.toFixed(0)} Hz ± ${span.toFixed(0)} Hz, top 60 dB)`), pad + 4, sy + 3, { size: 10, color: C.dim });
        ctx.stat(GTL.L('음량 변화 (최대-최소)', 'Level swing (max to min)'), trem() ? (P.tdepth >= 0.999 ? '∞' : (-A.linToDb(1 - P.tdepth)).toFixed(1)) + ' dB' : '0 dB');
        ctx.stat(GTL.L('음 높이 변화', 'Pitch swing'), vib() ? '±' + Math.round(P.vdepth) + GTL.L(' 센트', ' cents') : '0');
        ctx.stat(GTL.L('측파대 수 (-40dB 위)', 'Sidebands (above -40 dB)'), sidebands);
        ctx.stat(GTL.L('FM 지수 β', 'FM index β'), vib() ? (f0 * (Math.pow(2, P.vdepth / 1200) - 1) / P.rate).toFixed(2) : '-');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
