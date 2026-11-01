// 코러스: 지연 시간을 LFO로 흔든 복사본을 원음에 섞음. 보이스 1개 vs 3개 (위상이 다른 LFO + 스테레오 배치)
GTL.register({
  id: 'chorus',
  title: '코러스 (LFO 변조 딜레이, 보이스 수)',
  summary: '코러스는 지연 시간이 천천히 흔들리는 복사본을 원음에 섞어 여러 명이 함께 연주하는 느낌을 냄. 위상이 다른 보이스를 여러 개 두고 좌우로 벌리면 소리가 넓고 두꺼워짐.',
  views: { a: '보이스 1개, 모노', b: '보이스 3개, 스테레오' },
  controls: '파라미터 표에서 보이스 수, 깊이, 속도를 바꿈. "소리 켜기"를 누르면 소리 내는 뷰가 들림.',
  info: `
    <p><b>코러스(Chorus)</b>는 원음과 지연된 복사본을 섞는 이펙트. 지연 시간은 10~30ms이고 LFO(저주파 오실레이터)로 몇 ms씩 흔듦.</p>
    <p>지연 시간이 늘어나는 동안은 읽기 위치가 느리게 움직여 음이 살짝 낮아지고, 줄어드는 동안은 높아짐(도플러 효과). 피치 변화는 <code>1 - dD/dt</code>배. 원음과 몇 센트 어긋난 복사본이 겹치면 맥놀이가 생겨 여러 악기가 함께 연주하는 소리가 됨.</p>
    <ul>
      <li><b>보이스 수</b>: LFO 위상을 1/N씩 어긋나게 둔 복사본 N개. 늘수록 어긋남이 고르게 퍼져 소리가 두꺼워짐.</li>
      <li><b>스테레오</b>: 보이스를 좌우로 나눠 놓으면 두 채널이 달라져 소리가 넓어짐. 모노로 합치면 넓이는 사라지고 맥놀이만 남음.</li>
      <li>단점: 깊이와 속도를 너무 키우면 음정이 흔들리는 비브라토처럼 들림</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="10" y="84" class="t-small">${L('입력', 'In')}</text>
    <line x1="40" y1="80" x2="440" y2="80" class="d-dim"/>
    <text x="230" y="74" class="t-small t-dim">${L('원음 (dry)', 'Dry')}</text>
    <line x1="70" y1="80" x2="70" y2="30" class="d-line"/><line x1="70" y1="30" x2="150" y2="30" class="d-line" marker-end="url(#arr)"/>
    <line x1="70" y1="80" x2="70" y2="130" class="d-line"/><line x1="70" y1="130" x2="150" y2="130" class="d-line" marker-end="url(#arr)"/>
    <rect x="152" y="16" width="120" height="28" class="f-dim"/><text x="212" y="34" text-anchor="middle" class="t-small">${L('지연 D1(t)', 'Delay D1(t)')}</text>
    <rect x="152" y="116" width="120" height="28" class="f-dim"/><text x="212" y="134" text-anchor="middle" class="t-small">${L('지연 D2(t)', 'Delay D2(t)')}</text>
    <path d="M290,30 q10,-12 20,0 t20,0 t20,0" class="d-b"/><text x="360" y="34" class="t-small t-b">${L('LFO 위상 0', 'LFO phase 0')}</text>
    <path d="M290,130 q10,12 20,0 t20,0 t20,0" class="d-b"/><text x="360" y="134" class="t-small t-b">${L('LFO 위상 1/2', 'LFO phase 1/2')}</text>
    <line x1="272" y1="30" x2="468" y2="30" class="d-dim"/><line x1="272" y1="130" x2="490" y2="130" class="d-dim"/>
    <line x1="468" y1="30" x2="468" y2="70" class="d-line" marker-end="url(#arr)"/><text x="474" y="40" class="t-small">L</text>
    <line x1="490" y1="130" x2="490" y2="90" class="d-line" marker-end="url(#arr)"/><text x="496" y="124" class="t-small">R</text>
    <text x="400" y="100" class="t-small t-dim">${L('피치 = 1 - dD/dt', 'Pitch = 1 - dD/dt')}</text>
  </svg>`,
  look: [
    '두 뷰의 고니오미터(L/R 점 그림)를 비교하면 A는 세로선 하나, B는 넓게 퍼진 구름 모양',
    '"L/R 상관도" 측정값이 A는 1, B는 1보다 크게 낮음. 낮을수록 넓게 들림.',
    '피치 그래프에서 깊이를 올리면 센트 진폭이 커짐. 10센트를 넘기면 코러스보다 비브라토처럼 들림.',
    '보이스 수를 1에서 4로 올리면 지연 곡선이 서로 어긋나 고르게 퍼짐',
  ],
  refs: [
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed., Wiley', year: 2011, note: '3장 지연 기반 이펙트 (비브라토, 플랜저, 코러스)' },
    { type: 'paper', title: 'Jon Dattorro, "Effect Design, Part 2: Delay-Line Modulation and Chorus", Journal of the Audio Engineering Society 45(10)', year: 1997, note: '변조 지연선과 코러스 설계' },
    { type: 'book', title: 'Will Pirkle, Designing Audio Effect Plugins in C++, 2nd ed., Routledge', year: 2019, note: '변조 지연 이펙트 구현' },
  ],
  params: [
    { key: 'voices', label: '보이스 수', type: 'int', min: 1, max: 4, a: 1, b: 3, group: '코러스' },
    { key: 'stereo', label: '스테레오 배치', type: 'bool', a: false, b: true },
    { key: 'base', label: '기본 지연 (ms)', type: 'range', min: 5, max: 30, step: 0.5, default: 15, shared: true },
    { key: 'depth', label: '깊이 (ms)', type: 'range', min: 0, max: 8, step: 0.1, default: 3, shared: true },
    { key: 'rate', label: '속도 (Hz)', type: 'range', min: 0.05, max: 3, step: 0.01, default: 0.6, shared: true },
    { key: 'mix', label: '복사본 음량 (wet)', type: 'range', min: 0, max: 1, step: 0.01, default: 0.7, shared: true },
    { key: 'src', label: '음원', type: 'select', options: [{ value: 'pad', label: '톱니 화음' }, { value: 'pluck', label: '플럭' }], default: 'pad', shared: true, group: '음원' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Chorus (LFO-Modulated Delay, Voice Count)',
    summary: 'A chorus mixes copies with slowly moving delay times into the dry sound, so one player sounds like many. Several voices with different LFO phases, spread left and right, make the sound wide and thick.',
    views: { a: '1 voice, mono', b: '3 voices, stereo' },
    controls: 'Change voice count, depth and rate in the parameter table. Press "Sound on" to hear the view that plays sound.',
    info: `
    <p>A <b>chorus</b> mixes the dry sound with delayed copies. The delay is 10 to 30 ms, and an LFO (low frequency oscillator) moves it by a few ms.</p>
    <p>While the delay grows, the read position moves slower, so the pitch drops a little. While it shrinks, the pitch rises (Doppler effect). The pitch ratio is <code>1 - dD/dt</code>. Copies a few cents off the dry sound beat against it, and it sounds like several players together.</p>
    <ul>
      <li><b>Voice count</b>: N copies with LFO phases 1/N apart. More voices spread the detune evenly and thicken the sound.</li>
      <li><b>Stereo</b>: put voices left and right. The two channels differ and the sound gets wide. Summed to mono, the width is gone and only the beating stays.</li>
      <li>Downside: too much depth or rate sounds like a pitch wobble (vibrato).</li>
    </ul>`,
    look: [
      'Compare the goniometer (L/R dot plot) in both views. A is one vertical line. B is a wide cloud.',
      'The "L/R correlation" stat is 1 in A and clearly below 1 in B. Lower means wider.',
      'Raise depth and watch the pitch graph. The cent swing grows. Above 10 cents it sounds more like vibrato than chorus.',
      'Raise voice count from 1 to 4. The delay curves shift apart and spread evenly.',
    ],
    refs: ['Ch. 3 delay-based effects (vibrato, flanger, chorus).', 'Modulated delay lines and chorus design.', 'Modulated delay effect code.'],
    params: {
      voices: { label: 'Voice count', group: 'Chorus' },
      stereo: 'Stereo spread',
      base: 'Base delay (ms)',
      depth: 'Depth (ms)',
      rate: 'Rate (Hz)',
      mix: 'Copy level (wet)',
      src: { label: 'Source', group: 'Source', options: { pad: 'Saw chord', pluck: 'Pluck' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b, TAU = Math.PI * 2;
    const SRV = 16000;

    // 음원
    function makeSource(sr) {
      const chord = [48, 55, 59, 64], ph = [0, 0, 0, 0], arp = [60, 64, 67, 71, 72, 71, 67, 64];
      let n = 0, pp = 0;
      return () => {
        n++;
        if (P.src === 'pad') {
          let v = 0;
          for (let i = 0; i < 4; i++) { ph[i] += A.mtof(chord[i]) / sr; ph[i] -= Math.floor(ph[i]); v += A.wave.saw(ph[i]); }
          return v * 0.09;
        }
        const step = Math.round(sr * 0.2), k = Math.floor(n / step) % 8, t = (n % step) / sr;
        pp += A.mtof(arp[k]) / sr;
        return (0.6 * A.wave.saw(pp) + 0.4 * Math.sin(TAU * pp)) * Math.exp(-t * 9) * 0.4;
      };
    }
    // 보이스 v의 지연 시간 (초). t: 초
    const delayAt = (v, t) => Math.max(0.5, P.base + P.depth * Math.sin(TAU * (P.rate * (1 + 0.07 * v) * t + v / P.voices))) / 1000;
    const panOf = (v) => (P.voices === 1 || !P.stereo ? 0 : -1 + 2 * v / (P.voices - 1));

    function makeChorus(sr) {
      const size = Math.ceil(sr * 0.05) + 4, buf = new Float32Array(size);
      let w = 0, n = 0;
      const out = { l: 0, r: 0 };
      out.step = (x) => {
        buf[w] = x;
        const t = n / sr;
        let wl = 0, wr = 0;
        for (let v = 0; v < P.voices; v++) {
          let p = w - delayAt(v, t) * sr; while (p < 0) p += size;
          const i0 = Math.floor(p), fr = p - i0, y = buf[i0] + (buf[(i0 + 1) % size] - buf[i0]) * fr;
          const pan = panOf(v), a = (pan + 1) * Math.PI / 4;
          wl += y * Math.cos(a); wr += y * Math.sin(a);
        }
        const gn = P.mix * Math.SQRT2 / Math.sqrt(P.voices);
        out.l = x + wl * gn; out.r = x + wr * gn;
        w = (w + 1) % size; n++;
        return out;
      };
      return out;
    }

    let live = null;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (!live || live.sr !== sr) live = { sr, src: makeSource(sr), fx: makeChorus(sr) };
        for (let i = 0; i < n; i++) { const o = live.fx.step(live.src()); l[i] = o.l * 0.7; r[i] = o.r * 0.7; }
      },
    });

    // 고니오미터용 출력 (파라미터가 바뀔 때만)
    let key = '', gl, gr, corr = 1;
    function analyze() {
      const k = [P.voices, P.stereo, P.base, P.depth, P.rate, P.mix, P.src].join();
      if (k === key) return;
      key = k;
      const n = SRV, src = makeSource(SRV), fx = makeChorus(SRV);
      gl = new Float32Array(n); gr = new Float32Array(n);
      let sl = 0, sr2 = 0, slr = 0;
      for (let i = 0; i < n; i++) { const o = fx.step(src()); gl[i] = o.l; gr[i] = o.r; if (i > 2000) { sl += o.l * o.l; sr2 += o.r * o.r; slr += o.l * o.r; } }
      corr = slr / Math.sqrt(Math.max(1e-12, sl * sr2));
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const gs = Math.min(H - pad * 2, W * 0.36), gx = W - pad - gs, gy = pad;
        const pw = gx - pad * 2, ph1 = (H - pad * 3) / 2;
        const span = 2 / Math.max(0.05, P.rate), now = ctx.time % span;
        // 지연 곡선
        D.rect(g, pad, pad, pw, ph1, 'rgba(0,0,0,0.35)');
        D.text(g, GTL.L('보이스별 지연 시간 (ms)', 'Delay time per voice (ms)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        const dmin = 0, dmax = 40, cols = C.series;
        for (let v = 0; v < P.voices; v++) {
          g.beginPath();
          for (let i = 0; i <= 120; i++) {
            const t = span * i / 120, d = delayAt(v, t) * 1000, px = pad + pw * i / 120, py = pad + ph1 - (d - dmin) / (dmax - dmin) * ph1;
            i ? g.lineTo(px, py) : g.moveTo(px, py);
          }
          g.strokeStyle = P.voices === 1 ? col : cols[v % cols.length]; g.lineWidth = 1.5; g.stroke();
        }
        // 피치 편차 (센트)
        const py0 = pad * 2 + ph1;
        D.rect(g, pad, py0, pw, ph1, 'rgba(0,0,0,0.35)');
        const cmax = 30, mid = py0 + ph1 / 2;
        D.line(g, pad, mid, pad + pw, mid, C.grid, 1);
        D.text(g, GTL.L('보이스별 피치 편차 (센트, ±30)', 'Pitch offset per voice (cents, ±30)'), pad + 4, py0 + 3, { size: 10, color: C.dim });
        let maxC = 0;
        for (let v = 0; v < P.voices; v++) {
          g.beginPath();
          for (let i = 0; i <= 120; i++) {
            const t = span * i / 120, e = 1e-4, dd = (delayAt(v, t + e) - delayAt(v, t - e)) / (2 * e);
            const cents = 1200 * Math.log2(Math.max(1e-3, 1 - dd));
            maxC = Math.max(maxC, Math.abs(cents));
            const px = pad + pw * i / 120, yy = mid - U.clamp(cents / cmax, -1, 1) * ph1 / 2;
            i ? g.lineTo(px, yy) : g.moveTo(px, yy);
          }
          g.strokeStyle = P.voices === 1 ? col : cols[v % cols.length]; g.lineWidth = 1.5; g.stroke();
        }
        const cx = pad + pw * now / span;
        D.line(g, cx, pad, cx, py0 + ph1, 'rgba(255,255,255,0.5)', 1);
        // 고니오미터: 세로 = L+R (mid), 가로 = L-R (side)
        D.rect(g, gx, gy, gs, gs, 'rgba(0,0,0,0.35)');
        D.line(g, gx + gs / 2, gy, gx + gs / 2, gy + gs, C.grid, 1); D.line(g, gx, gy + gs / 2, gx + gs, gy + gs / 2, C.grid, 1);
        g.fillStyle = col; g.globalAlpha = 0.5;
        const sc = gs * 0.9;
        for (let i = 2000; i < gl.length; i += 3) {
          const m = (gl[i] + gr[i]) * 0.5, s = (gl[i] - gr[i]) * 0.5;
          g.fillRect(gx + gs / 2 + s * sc, gy + gs / 2 - m * sc, 1.5, 1.5);
        }
        g.globalAlpha = 1;
        D.text(g, GTL.L('고니오미터 (가로 = L-R, 세로 = L+R)', 'Goniometer (x = L-R, y = L+R)'), gx + 4, gy + 3, { size: 9, color: C.dim });
        ctx.stat(GTL.L('L/R 상관도', 'L/R correlation'), corr.toFixed(2));
        ctx.stat(GTL.L('최대 피치 편차', 'Max pitch offset'), maxC.toFixed(1) + GTL.L(' 센트', ' cents'));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
