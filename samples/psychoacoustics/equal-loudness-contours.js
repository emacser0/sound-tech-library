// 등청감 곡선 (ISO 226:2003): 작은 음량에서 저음과 고음이 덜 들리는 현상과 라우드니스 보정
GTL.register({
  id: 'equal-loudness-contours',
  title: '등청감 곡선과 라우드니스 보정',
  summary: '귀는 주파수마다 감도가 다르고, 음량이 작을수록 저음이 더 크게 줄어들어 들림. 80 phon에서 균형을 맞춘 믹스를 40 phon으로 줄이면 A는 저음이 사라지고, ISO 226 곡선으로 보정한 B는 균형이 유지됨.',
  views: { a: '보정 없음', b: '라우드니스 보정' },
  controls: '파라미터 표에서 청취 레벨을 바꿈. "소리 켜기"를 누르면 저음부터 고음까지 한 음씩 울린 뒤 모두 함께 울림.',
  info: `
    <p><b>등청감 곡선(Equal-loudness contour)</b>은 1 kHz 사인파와 같은 크기로 들리는 음압(dB SPL)을 주파수마다 이은 선. 1 kHz에서의 dB 값을 그 곡선의 <b>phon</b> 값으로 부름. 1933년 Fletcher와 Munson이 처음 측정했고, 지금 표준은 ISO 226.</p>
    <ul>
      <li>귀는 2~5 kHz에서 가장 민감. 외이도 공명 때문.</li>
      <li>100 Hz 아래로 갈수록 같은 크기로 들리려면 훨씬 큰 음압이 필요</li>
      <li>곡선 간격이 저음에서 좁음. 그래서 전체 음량을 줄이면 저음의 체감 크기가 1 kHz보다 빨리 줄어듦.</li>
    </ul>
    <p><b>라우드니스 보정(Loudness compensation)</b>은 재생 음량에 맞춰 저음과 고음을 올리는 EQ. 보정량은 "듣는 레벨의 곡선 - 믹스한 레벨의 곡선"으로 계산함. 오래된 앰프의 Loudness 버튼과 최신 기기의 음량 연동 EQ가 같은 원리.</p>
    <p>단점: 실제 재생 음압을 알아야 정확함. 기기와 이어폰마다 감도가 달라서 실무에서는 근사값을 씀.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="14" class="t-small t-dim">${L('음압 (dB SPL)', 'Level (dB SPL)')}</text>
    <line x1="40" y1="160" x2="520" y2="160" class="d-line"/><line x1="40" y1="20" x2="40" y2="160" class="d-line"/>
    <text x="520" y="176" text-anchor="end" class="t-small t-dim">${L('주파수 (로그)', 'Frequency (log)')}</text>
    <text x="60" y="176" class="t-small t-dim">20 Hz</text><text x="300" y="176" class="t-small t-dim">1 kHz</text>
    <path d="M50,40 C120,58 200,62 300,62 C380,62 420,70 470,58 L510,52" class="d-dim"/>
    <text x="512" y="48" text-anchor="end" class="t-small t-dim">${L('80 phon (믹스한 레벨)', '80 phon (mix level)')}</text>
    <path d="M50,80 C120,112 200,120 300,122 C380,124 420,130 470,116 L510,108" class="d-b"/>
    <text x="512" y="104" text-anchor="end" class="t-small t-b">${L('40 phon (듣는 레벨)', '40 phon (listening level)')}</text>
    <path d="M50,80 C120,98 200,102 300,102" class="d-a" stroke-dasharray="4 3"/>
    <text x="150" y="84" class="t-small t-a">${L('80 phon 곡선을 40dB 내림', '80 phon curve moved down 40 dB')}</text>
    <line x1="80" y1="96" x2="80" y2="140" class="d-dim" stroke-dasharray="2 2"/>
    <text x="86" y="140" class="t-small">${L('저음은 곡선 사이가 좁아 크게 모자람', 'Curves are close in the bass, so bass falls short')}</text>
  </svg>`,
  look: [
    '청취 레벨을 40 phon에 두면 A의 아래 막대에서 80 Hz와 160 Hz가 1 kHz보다 10 phon 넘게 낮음. B는 막대가 거의 평평함.',
    '청취 레벨을 80 phon으로 올리면 두 뷰가 같아짐 (믹스한 레벨이라 보정이 0)',
    '청취 레벨을 20 phon으로 내리면 A의 80 Hz 점이 가청 한계선 아래로 내려가 "안 들림"이 됨',
    '"소리 켜기"를 누르고 작은 기기 음량으로 들으면 A는 저음 음이 거의 안 들리고 B는 고르게 들림',
  ],
  refs: [
    { type: 'paper', title: 'ISO 226:2003, Acoustics: Normal equal-loudness-level contours', year: 2003, note: '이 샘플의 곡선 계산식과 표 (2023년 개정판도 있음)' },
    { type: 'paper', title: 'Fletcher, Munson, "Loudness, its definition, measurement and calculation", JASA 5', year: 1933, note: '등청감 곡선의 첫 측정' },
    { type: 'paper', title: 'Suzuki, Takeshima, "Equal-loudness-level contours for pure tones", JASA 116(2)', year: 2004, note: 'ISO 226:2003의 근거가 된 측정 정리' },
    { type: 'book', title: 'Zwicker, Fastl, Psychoacoustics: Facts and Models (3rd ed.)', year: 2007, note: '라우드니스, 가청 한계, phon과 sone' },
    { type: 'book', title: 'Bob Katz, Mastering Audio: The Art and the Science', note: '모니터링 레벨과 저음 균형' },
  ],
  params: [
    { key: 'comp', label: '라우드니스 보정', type: 'bool', a: false, b: true, group: '재생' },
    { key: 'level', label: '청취 레벨 (phon)', type: 'range', min: 20, max: 90, step: 1, default: 40, shared: true, help: '믹스는 80 phon에서 균형을 맞췄다고 가정' },
    { key: 'mode', label: '재생 방식', type: 'select', options: [{ value: 'seq', label: '한 음씩 + 함께' }, { value: 'all', label: '모두 함께' }], default: 'seq', shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Equal-Loudness Contours & Loudness Compensation',
    summary: 'The ear has a different sensitivity at each frequency, and at low volume the bass drops more. A mix balanced at 80 phon loses its bass in A when played at 40 phon. B corrects it with the ISO 226 contours and keeps the balance.',
    views: { a: 'No compensation', b: 'Loudness compensation' },
    controls: 'Change the listening level in the parameter table. Press "Sound on" to hear one tone at a time from low to high, then all together.',
    info: `
    <p>An <b>equal-loudness contour</b> connects the sound pressure levels (dB SPL) that sound as loud as a 1 kHz sine. The dB value at 1 kHz is the <b>phon</b> value of the contour. Fletcher and Munson measured it first in 1933. Today the standard is ISO 226.</p>
    <ul>
      <li>The ear is most sensitive at 2~5 kHz, because of the ear canal resonance.</li>
      <li>Below 100 Hz, a tone needs much more pressure to sound equally loud.</li>
      <li>The contours are close together in the bass. So when you turn the volume down, bass loudness falls faster than 1 kHz.</li>
    </ul>
    <p><b>Loudness compensation</b> is an EQ that raises the bass and treble to match the playback level. The boost is "contour at listening level minus contour at mix level". The Loudness button on old amplifiers and volume-linked EQ on new devices use the same idea.</p>
    <p>Drawback: it needs the real playback level to be exact. Devices and earphones differ, so products use an estimate.</p>`,
    look: [
      'Set the listening level to 40 phon. In A\'s bottom bars, 80 Hz and 160 Hz are more than 10 phon below 1 kHz. B\'s bars are almost flat.',
      'Raise the listening level to 80 phon. Both views become the same (this is the mix level, so the correction is 0).',
      'Lower the listening level to 20 phon. A\'s 80 Hz dot falls below the threshold line and becomes "inaudible".',
      'Press "Sound on" and listen at a low device volume. In A the bass tones almost vanish. In B all tones sound even.',
    ],
    refs: ['Contour formula and table used here (a 2023 revision also exists).', 'First measurement of equal-loudness contours.', 'Measurements behind ISO 226:2003.', 'Loudness, threshold of hearing, phon and sone.', 'Monitoring level and bass balance.'],
    params: {
      comp: { label: 'Loudness compensation', group: 'Playback' },
      level: { label: 'Listening level (phon)', help: 'Assumes the mix was balanced at 80 phon' },
      mode: { label: 'Play mode', options: { seq: 'One by one + together', all: 'All together' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    // ISO 226:2003 표 (주파수, af, Lu, Tf)
    const F = [20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500];
    const AF = [0.532, 0.506, 0.480, 0.455, 0.432, 0.409, 0.387, 0.367, 0.349, 0.330, 0.315, 0.301, 0.288, 0.276, 0.267, 0.259, 0.253, 0.250, 0.246, 0.244, 0.243, 0.243, 0.243, 0.242, 0.242, 0.245, 0.254, 0.271, 0.301];
    const LU = [-31.6, -27.2, -23.0, -19.1, -15.9, -13.0, -10.3, -8.1, -6.2, -4.5, -3.1, -2.0, -1.1, -0.4, 0.0, 0.3, 0.5, 0.0, -2.7, -4.1, -1.0, 1.7, 2.5, 1.2, -2.1, -7.1, -11.2, -10.7, -3.1];
    const TF = [78.5, 68.7, 59.5, 51.1, 44.0, 37.5, 31.5, 26.5, 22.1, 17.9, 14.4, 11.4, 8.6, 6.2, 4.4, 3.0, 2.2, 2.4, 3.5, 1.7, -1.3, -4.2, -6.0, -5.4, -1.5, 6.0, 12.6, 13.9, 12.3];
    // 표의 i번째 주파수에서 phon → dB SPL
    const lpIdx = (i, phon) => {
      const af = 4.47e-3 * (Math.pow(10, 0.025 * phon) - 1.15) + Math.pow(0.4 * Math.pow(10, (TF[i] + LU[i]) / 10 - 9), AF[i]);
      return 10 / AF[i] * Math.log10(Math.max(1e-12, af)) - LU[i] + 94;
    };
    // 임의 주파수 (로그 주파수로 선형 보간)
    const lp = (f, phon) => {
      const lf = Math.log(U.clamp(f, 20, 12500));
      let i = 0;
      while (i < F.length - 2 && Math.log(F[i + 1]) < lf) i++;
      const t = U.clamp((lf - Math.log(F[i])) / (Math.log(F[i + 1]) - Math.log(F[i])), 0, 1);
      return U.lerp(lpIdx(i, phon), lpIdx(i + 1, phon), t);
    };
    const thr = (f) => {
      const lf = Math.log(U.clamp(f, 20, 12500));
      let i = 0;
      while (i < F.length - 2 && Math.log(F[i + 1]) < lf) i++;
      const t = U.clamp((lf - Math.log(F[i])) / (Math.log(F[i + 1]) - Math.log(F[i])), 0, 1);
      return U.lerp(TF[i], TF[i + 1], t);
    };
    // dB SPL → phon (이분법). 가청 한계 아래면 null
    const phonOf = (f, spl) => {
      if (spl < thr(f)) return null;
      let lo = 0, hi = 100;
      for (let k = 0; k < 28; k++) { const m = (lo + hi) / 2; if (lp(f, m) < spl) lo = m; else hi = m; }
      return (lo + hi) / 2;
    };

    const TONES = [80, 160, 315, 1000, 4000, 8000];
    const REF = 80;
    let key = '', tones = [];
    function analyze() {
      const k = P.level + '|' + P.comp;
      if (k === key) return;
      key = k;
      tones = TONES.map((f) => {
        const mixSpl = lp(f, REF);                  // 80 phon에서 같은 크기로 맞춘 음압
        const plain = mixSpl - (REF - P.level);     // 전체 음량만 낮춤
        const spl = P.comp ? lp(f, P.level) : plain; // 보정: 듣는 레벨의 곡선 위로
        return { f, spl, gain: spl - plain, phon: phonOf(f, spl) };
      });
    }
    // 소리: 음압 - 청취 레벨 - 30 dBFS. 1 kHz가 약 -30 dBFS
    const ph = new Float64Array(TONES.length);
    let t = 0, cur = 0;
    const amps = new Float64Array(TONES.length);
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        analyze();
        const seq = P.mode === 'seq', slot = 0.55, cycle = slot * (TONES.length + 2);
        for (let i = 0; i < n; i++) {
          const tc = t % cycle, idx = Math.floor(tc / slot), local = tc - idx * slot;
          let v = 0;
          for (let j = 0; j < TONES.length; j++) {
            let on;
            if (!seq) on = 1;
            else if (idx < TONES.length) on = idx === j ? Math.min(1, local / 0.02, Math.max(0, (slot - 0.08 - local) / 0.02)) : 0;
            else on = idx === TONES.length ? 0.5 * Math.min(1, local / 0.02) : 0.5 * Math.max(0, Math.min(1, (slot - 0.1 - local) / 0.05));
            const target = on * Math.min(0.5, A.dbToLin(tones[j].spl - P.level - 30));
            amps[j] += (target - amps[j]) * 0.004;
            v += amps[j] * Math.sin(ph[j]);
            ph[j] += 2 * Math.PI * TONES[j] / sr; if (ph[j] > 6.283185307) ph[j] -= 6.283185307;
          }
          l[i] = v; r[i] = v;
          t += 1 / sr;
        }
        cur = P.mode === 'seq' ? Math.floor((t % (0.55 * (TONES.length + 2))) / 0.55) : TONES.length;
      },
    });

    // 곡선 캐시 (청취 레벨이 바뀔 때만)
    const FMIN = 20, FMAX = 12500, DBMIN = -10, DBMAX = 120;
    let ckey = '', curves = null;
    function buildCurves(w) {
      const k = P.level + '|' + Math.round(w);
      if (k === ckey) return;
      ckey = k;
      const steps = Math.max(40, Math.floor(w / 3));
      const fs = Array.from({ length: steps + 1 }, (_, i) => A.xFreq(i, 0, steps, FMIN, FMAX));
      const mk = (fn) => fs.map((f) => fn(f));
      curves = { fs, family: [20, 30, 40, 50, 60, 70, 80, 90].map((p) => mk((f) => lp(f, p))), thr: mk(thr), cur: mk((f) => lp(f, P.level)), shifted: mk((f) => lp(f, REF) - (REF - P.level)) };
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const gx = pad + 26, gy = pad, gw = W - gx - pad, gh = Math.max(80, H * 0.62);
        buildCurves(gw);
        D.rect(g, gx, gy, gw, gh, 'rgba(0,0,0,0.35)');
        A.drawFreqGrid(g, gx, gy, gw, gh, { fmin: FMIN, fmax: FMAX });
        const yOf = (db) => gy + gh - U.clamp((db - DBMIN) / (DBMAX - DBMIN), -0.02, 1.02) * gh;
        for (let db = 0; db <= 120; db += 20) { D.line(g, gx, yOf(db), gx + gw, yOf(db), C.grid); D.text(g, String(db), gx - 4, yOf(db) - 5, { size: 9, color: C.dim, align: 'right' }); }
        const path = (arr, color, lw, dash) => {
          g.beginPath();
          arr.forEach((db, i) => { const x = A.freqX(curves.fs[i], gx, gw, FMIN, FMAX), y = yOf(db); i ? g.lineTo(x, y) : g.moveTo(x, y); });
          g.setLineDash(dash || []); g.strokeStyle = color; g.lineWidth = lw; g.stroke(); g.setLineDash([]);
        };
        curves.family.forEach((c) => path(c, 'rgba(255,255,255,0.13)', 1));
        path(curves.thr, C.dim, 1.2, [4, 3]);
        path(curves.family[6], 'rgba(255,255,255,0.35)', 1.5);
        if (!P.comp) path(curves.shifted, C.a, 1.5, [5, 3]);
        path(curves.cur, P.comp ? C.b : 'rgba(79,195,247,0.5)', 2);
        D.text(g, L('등청감 곡선 (20~90 phon), 점선 = 가청 한계', 'Equal-loudness contours (20~90 phon), dotted = threshold'), gx + 4, gy + 3, { size: 10, color: C.dim });
        D.text(g, L(`굵은 선 = ${P.level.toFixed(0)} phon`, `Thick line = ${P.level.toFixed(0)} phon`), gx + 4, gy + 16, { size: 10, color: C.b });
        tones.forEach((tn, j) => {
          const x = A.freqX(tn.f, gx, gw, FMIN, FMAX), y = yOf(tn.spl);
          const playing = snd.audible && (cur === j || cur === TONES.length);
          D.circle(g, x, y, playing ? 6 : 4.5, tn.phon == null ? C.bad : col, playing ? '#fff' : null, 1.5);
        });
        // 아래: 체감 크기 막대 (phon)
        const by = gy + gh + 22, bh = H - by - 18;
        if (bh > 20) {
          D.text(g, L('각 음의 체감 크기 (phon). 평평해야 믹스 균형이 유지됨', 'Perceived loudness of each tone (phon). Flat = mix balance kept'), gx, by - 14, { size: 10, color: C.dim });
          const bw = gw / tones.length;
          const ref = P.level;
          const yb = (p) => by + bh - U.clamp(p / 100, 0, 1) * bh;
          D.line(g, gx, yb(ref), gx + gw, yb(ref), C.dim, 1);
          tones.forEach((tn, j) => {
            const x0 = gx + j * bw + bw * 0.2, w0 = bw * 0.6;
            if (tn.phon == null) D.text(g, L('안 들림', 'inaudible'), x0 + w0 / 2, by + bh - 14, { size: 10, align: 'center', color: C.bad });
            else D.rect(g, x0, yb(tn.phon), w0, by + bh - yb(tn.phon), col);
            D.text(g, tn.f >= 1000 ? tn.f / 1000 + 'k' : String(tn.f), x0 + w0 / 2, by + bh + 3, { size: 9, align: 'center', color: C.dim });
            if (tn.phon != null) D.text(g, tn.phon.toFixed(0), x0 + w0 / 2, yb(tn.phon) - 12, { size: 9, align: 'center', color: C.text });
          });
        }
        const p1k = tones[3].phon, p80 = tones[0].phon;
        let dev = 0;
        for (const tn of tones) dev = Math.max(dev, tn.phon == null ? Infinity : Math.abs(tn.phon - p1k));
        ctx.stat(L('청취 레벨', 'Listening level'), P.level.toFixed(0) + ' phon');
        ctx.stat(L('80 Hz 보정량', '80 Hz boost'), '+' + tones[0].gain.toFixed(1) + ' dB');
        ctx.stat(L('80 Hz 체감 크기', '80 Hz loudness'), p80 == null ? L('안 들림', 'inaudible') : p80.toFixed(1) + ' phon');
        ctx.stat(L('1 kHz 대비 최대 차이', 'Max diff from 1 kHz'), dev === Infinity ? L('안 들리는 음 있음', 'some tones inaudible') : dev.toFixed(1) + ' phon');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
