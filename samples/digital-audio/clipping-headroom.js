// 헤드룸과 인터샘플 피크: 샘플 값은 0 dBFS 아래여도 샘플 사이의 실제 파형은 그 위로 넘을 수 있음. 트루 피크 미터는 오버샘플링으로 이를 잡음
GTL.register({
  id: 'clipping-headroom',
  title: '헤드룸과 인터샘플 피크 (트루 피크)',
  summary: '샘플 피크를 0 dBFS에 맞춘 신호와 트루 피크를 -1 dBTP에 맞춘 신호를 비교. 샘플 사이의 복원 파형이 0 dBFS를 넘으면 DAC나 리샘플러에서 잘려 왜곡이 생김.',
  views: { a: '샘플 피크 0 dBFS로 정규화', b: '트루 피크 -1 dBTP로 정규화' },
  controls: '파라미터 표에서 신호와 정규화 기준을 바꿈',
  info: `
    <p>디지털 신호의 최대값은 0 dBFS. 그래서 샘플 값의 최대(<b>샘플 피크</b>)만 0 dBFS 아래로 두면 안전해 보임. 하지만 DAC와 리샘플러는 샘플 사이를 매끄러운 곡선으로 복원함. 이 곡선은 샘플 사이에서 샘플보다 더 높이 올라갈 수 있음. 이것이 <b>인터샘플 피크(Inter-sample peak)</b>.</p>
    <p>극단적인 예: fs/4(12 kHz) 사인파를 45도 위상에서 샘플링하면 모든 샘플이 실제 꼭대기의 0.707배. 샘플 피크를 0 dBFS로 맞추면 실제 파형은 +3 dB까지 올라감. 리미터로 세게 누른 음악도 샘플 피크가 납작하게 붙어 있어 비슷한 일이 생김.</p>
    <ul>
      <li><b>트루 피크(True peak)</b>: 4배 이상 오버샘플링한 뒤 최대값을 잼. 단위 dBTP. ITU-R BS.1770의 방식.</li>
      <li>방송, 스트리밍 규격은 보통 -1 dBTP 또는 -2 dBTP를 상한으로 둠. 손실 압축(MP3, AAC) 뒤에는 피크가 더 올라가기 때문.</li>
      <li>이 샘플의 출력은 "4배 오버샘플링, ±1에서 자르기, 다시 48 kHz로"를 거친 소리. 고정 소수점 DAC나 리샘플러를 흉내 냄.</li>
    </ul>`,
  diagram: (L) => {
    const x0 = 30, yOf = (x) => 100 - 70.7 * Math.sin(2 * Math.PI * (x - x0) / 240);
    let pts = '';
    for (let x = x0; x <= 510; x += 4) pts += `${x},${yOf(x).toFixed(1)} `;
    const dots = [];
    for (let x = x0 + 30; x <= 510; x += 60) dots.push(`<line x1="${x}" y1="100" x2="${x}" y2="${yOf(x).toFixed(1)}" class="d-dim"/><circle cx="${x}" cy="${yOf(x).toFixed(1)}" r="4" class="f-accent"/>`);
    return `<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="50" x2="520" y2="50" class="d-bad" stroke-dasharray="5 3"/>
    <line x1="20" y1="150" x2="520" y2="150" class="d-bad" stroke-dasharray="5 3"/>
    <text x="474" y="44" class="t-small">0 dBFS</text>
    <line x1="20" y1="100" x2="520" y2="100" class="d-dim"/>
    <polyline points="${pts}" class="d-b"/>
    ${dots.join('')}
    <text x="90" y="22" text-anchor="middle" class="t-small t-a">${L('샘플 사이 꼭대기 +3 dB', 'peak between samples +3 dB')}</text>
    <text x="270" y="192" text-anchor="middle" class="t-small t-dim">${L('보라 점 = 샘플 (모두 0 dBFS), 파란 선 = DAC가 복원하는 실제 파형', 'Purple dots = samples (all at 0 dBFS), blue = real waveform rebuilt by the DAC')}</text>
  </svg>`;
  },
  look: [
    'A의 확대 파형에서 곡선이 빨간 0 dBFS 선을 넘어감. 샘플 점은 선 아래에 있음.',
    'A의 미터에서 샘플 피크는 0.0이지만 트루 피크는 0보다 큼. B는 둘 다 0 아래.',
    '신호를 "fs/4 사인파"로 바꾸면 A의 트루 피크가 약 +3 dBTP',
    '추가 게인을 +4 dB로 올리고 들으면 두 뷰 모두 잘림 왜곡이 들림. "잘림 왜곡" 측정값이 같이 커짐.',
  ],
  refs: [
    { type: 'article', title: 'ITU-R BS.1770-4, Algorithms to measure audio programme loudness and true-peak audio level', year: 2015, url: 'https://www.itu.int/rec/R-REC-BS.1770', note: '부록 2: 4배 오버샘플링 트루 피크 측정' },
    { type: 'article', title: 'EBU R 128, Loudness normalisation and permitted maximum level of audio signals', url: 'https://tech.ebu.ch/publications/r128', note: '-1 dBTP 최대 허용 레벨' },
    { type: 'book', title: 'Bob Katz, Mastering Audio: The Art and the Science', note: '인터샘플 오버와 헤드룸' },
    { type: 'paper', title: 'S. Nielsen, T. Lund, "0dBFS+ Levels in Digital Mastering", AES 109th Convention', year: 2000, note: '인터샘플 피크 측정 연구' },
  ],
  params: [
    { key: 'norm', label: '정규화 기준', type: 'select', options: [{ value: 'sample', label: '샘플 피크 0 dBFS' }, { value: 'true', label: '트루 피크 -1 dBTP' }], a: 'sample', b: 'true', default: 'sample', group: '정규화' },
    { key: 'gain', label: '추가 게인 (dB)', type: 'range', min: -6, max: 6, step: 0.5, default: 0, shared: true, help: '정규화 뒤에 더함' },
    { key: 'sig', label: '신호', type: 'select', options: [{ value: 'master', label: '세게 누른 음악 (클리핑된 화음)' }, { value: 'quarter', label: 'fs/4 사인파 (45도 위상)' }], default: 'master', shared: true, group: '신호' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Headroom and Inter-Sample Peaks (True Peak)',
    summary: 'Compares a signal normalized to 0 dBFS sample peak with one normalized to -1 dBTP true peak. When the rebuilt waveform between samples goes over 0 dBFS, a DAC or resampler clips it and adds distortion.',
    views: { a: 'Sample peak to 0 dBFS', b: 'True peak to -1 dBTP' },
    controls: 'Change the signal and normalization target in the parameter table.',
    info: `
    <p>The largest digital value is 0 dBFS. So keeping the largest sample value (the <b>sample peak</b>) below 0 dBFS looks safe. But DACs and resamplers rebuild a smooth curve between the samples, and that curve can rise higher than the samples. This is an <b>inter-sample peak</b>.</p>
    <p>An extreme case: a sine at fs/4 (12 kHz) sampled at 45 degrees phase. Every sample is 0.707 of the real top. Normalize the sample peak to 0 dBFS and the real waveform reaches +3 dB. Music pushed hard by a limiter has flat sample peaks and shows the same effect.</p>
    <ul>
      <li><b>True peak</b>: oversample 4x or more, then take the maximum. Unit: dBTP. This is the ITU-R BS.1770 method.</li>
      <li>Broadcast and streaming specs usually cap at -1 dBTP or -2 dBTP, because lossy codecs (MP3, AAC) raise peaks further.</li>
      <li>The sound here goes through "4x oversampling, clip at ±1, back to 48 kHz". It imitates a fixed-point DAC or resampler.</li>
    </ul>`,
    look: [
      'In A\'s zoomed waveform the curve goes over the red 0 dBFS line, while the sample dots stay below it.',
      'In A\'s meters the sample peak is 0.0 but the true peak is above 0. In B both are below 0.',
      'Switch the signal to "fs/4 sine". A\'s true peak is about +3 dBTP.',
      'Raise extra gain to +4 dB and listen. Both views now clip and the "Clip distortion" stat grows.',
    ],
    refs: ['Annex 2: true-peak measurement with 4x oversampling.', 'The -1 dBTP maximum permitted level.', 'Inter-sample overs and headroom.', 'Study of inter-sample peak levels.'],
    params: {
      norm: { label: 'Normalize to', group: 'Normalization', options: { sample: 'Sample peak 0 dBFS', true: 'True peak -1 dBTP' } },
      gain: { label: 'Extra gain (dB)', help: 'Added after normalization' },
      sig: { label: 'Signal', group: 'Signal', options: { master: 'Loud master (clipped chord)', quarter: 'fs/4 sine (45 degree phase)' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, LEN = SR, OS = 4, TAU = Math.PI * 2;
    const HT = 6; // 위상당 탭 12개 (BS.1770 부록처럼 4위상 x 12탭 = 48탭)

    // 4배 보간 계수: 위상 p, 탭 k=-HT+1..HT
    const kern = [];
    for (let p = 0; p < OS; p++) {
      const row = new Float32Array(HT * 2);
      for (let j = 0; j < HT * 2; j++) {
        const t = (j - HT + 1) - p / OS, s = Math.abs(t) < 1e-9 ? 1 : Math.sin(Math.PI * t) / (Math.PI * t);
        const wn = (t + HT) / (2 * HT), w = 0.42 - 0.5 * Math.cos(TAU * wn) + 0.08 * Math.cos(2 * TAU * wn);
        row[j] = s * w;
      }
      kern.push(row);
    }
    const upsample = (x) => { // 길이 LEN*OS, 순환
      const y = new Float32Array(x.length * OS), n = x.length;
      for (let i = 0; i < n; i++) for (let p = 0; p < OS; p++) {
        const row = kern[p]; let s = 0;
        for (let j = 0; j < HT * 2; j++) s += row[j] * x[(i + j - HT + 1 + n) % n];
        y[i * OS + p] = s;
      }
      return y;
    };
    // 4배 레이트에서 다시 48 kHz로: 63탭 로우패스 (차단 22 kHz)
    const DT = 63, dec = new Float32Array(DT);
    { const fc = 22000 / (SR * OS / 2); let sum = 0;
      for (let j = 0; j < DT; j++) { const t = j - (DT - 1) / 2, s = t === 0 ? 1 : Math.sin(Math.PI * fc * t) / (Math.PI * fc * t); dec[j] = fc * s * (0.42 - 0.5 * Math.cos(TAU * j / (DT - 1)) + 0.08 * Math.cos(2 * TAU * j / (DT - 1))); sum += dec[j]; }
      for (let j = 0; j < DT; j++) dec[j] /= sum; }

    let srcKey = '', raw = null, rawUp = null, sPk = 1, tPk = 1;
    function buildSource() {
      if (P.sig === srcKey) return;
      srcKey = P.sig; raw = new Float32Array(LEN);
      if (P.sig === 'quarter') for (let i = 0; i < LEN; i++) raw[i] = Math.sin(TAU * i / 4 + Math.PI / 4);
      else {
        // 대역 제한 톱니파 화음(55 Hz의 배수라 1초에 정확히 반복) + 4 Hz 펌핑, 샘플 단위에서 세게 잘라 납작한 피크를 만듦
        const fs = [110, 165, 220, 275];
        for (const f of fs) for (let h = 1; f * h < 18000; h++) {
          const a = 0.32 / h / fs.length * 2, w = TAU * f * h / SR, c = Math.cos(w); let s0 = 0, s1 = Math.sin(w);
          for (let i = 1; i < LEN; i++) { raw[i] += a * s1; const s2 = 2 * c * s1 - s0; s0 = s1; s1 = s2; }
        }
        for (let i = 0; i < LEN; i++) { const pump = 0.75 + 0.25 * Math.cos(TAU * 4 * i / SR); raw[i] = U.clamp(raw[i] * pump * 2.2, -0.6, 0.6); }
      }
      rawUp = upsample(raw);
      sPk = A.peak(raw); tPk = A.peak(rawUp);
    }

    let key = '', gainLin = 1, outBuf = null, overs = 0, clipDb = -200, tpIdx = 0;
    function analyze() {
      buildSource();
      const k = srcKey + '|' + P.norm + '|' + P.gain;
      if (k === key) return;
      key = k;
      gainLin = (P.norm === 'sample' ? 1 / sPk : A.dbToLin(-1) / tPk) * A.dbToLin(P.gain);
      // DAC 흉내: 4배 신호를 ±1에서 자르고 다시 48 kHz로
      const n4 = rawUp.length, clipped = new Float32Array(n4);
      overs = 0; let pe = 0, ps = 0, best = 0;
      for (let i = 0; i < n4; i++) {
        const v = rawUp[i] * gainLin, c = U.clamp(v, -1, 1);
        if (v !== c) overs++;
        if (Math.abs(v) > best) { best = Math.abs(v); tpIdx = i; }
        clipped[i] = c; pe += (v - c) * (v - c); ps += v * v;
      }
      clipDb = pe > 0 ? 10 * Math.log10(pe / ps) : -200;
      outBuf = new Float32Array(LEN);
      for (let i = 0; i < LEN; i++) {
        let s = 0; const c0 = i * OS - (DT - 1) / 2;
        for (let j = 0; j < DT; j++) s += dec[j] * clipped[(c0 + j + n4) % n4];
        outBuf[i] = s;
      }
    }

    let pos = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (!outBuf) return;
        const step = SR / sr;
        for (let i = 0; i < n; i++) {
          const i0 = Math.floor(pos), fr = pos - i0, v = (outBuf[i0 % LEN] * (1 - fr) + outBuf[(i0 + 1) % LEN] * fr) * 0.5;
          pos += step; if (pos >= LEN) pos -= LEN;
          l[i] = v; r[i] = v;
        }
      },
    });

    function meter(g, x, y, w, h, db, label) {
      const lo = -12, hi = 4, v = U.clamp((db - lo) / (hi - lo), 0, 1), zy = y + h * (1 - (0 - lo) / (hi - lo));
      D.rect(g, x, y, w, h, 'rgba(0,0,0,0.4)');
      D.rect(g, x, y + h * (1 - v), w, h * v, db > 0 ? C.bad : db > -1 ? C.warn : C.good);
      D.line(g, x - 3, zy, x + w + 3, zy, C.bad, 1);
      D.text(g, label, x + w / 2, y + h + 3, { size: 10, align: 'center', color: C.dim });
      D.text(g, (db >= 0 ? '+' : '') + db.toFixed(1), x + w / 2, y - 13, { size: 10, align: 'center', color: C.text });
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const mw = 120, w = W - pad * 3 - mw, th = H - pad * 2;
        // 확대 파형: 트루 피크 주변 샘플 24개
        const NS = 24, c0 = Math.floor(tpIdx / OS) - NS / 2;
        const amp = 0.75, mid = pad + th / 2, sy = (v) => mid - v * amp * th / 2;
        D.rect(g, pad, pad, w, th, 'rgba(0,0,0,0.35)');
        D.rect(g, pad, pad, w, sy(1) - pad, 'rgba(255,83,112,0.08)');
        D.rect(g, pad, sy(-1), w, pad + th - sy(-1), 'rgba(255,83,112,0.08)');
        D.line(g, pad, sy(1), pad + w, sy(1), C.bad, 1); D.line(g, pad, sy(-1), pad + w, sy(-1), C.bad, 1);
        D.line(g, pad, mid, pad + w, mid, C.grid, 1);
        const xOf = (t) => pad + ((t - c0) / NS) * w;
        g.beginPath();
        for (let q = 0; q <= NS * OS; q++) {
          const i4 = ((c0 * OS + q) % (LEN * OS) + LEN * OS) % (LEN * OS), v = rawUp[i4] * gainLin;
          const px = xOf(c0 + q / OS); q ? g.lineTo(px, sy(v)) : g.moveTo(px, sy(v));
        }
        g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        for (let q = 0; q <= NS * OS; q++) {
          const i4 = ((c0 * OS + q) % (LEN * OS) + LEN * OS) % (LEN * OS), v = rawUp[i4] * gainLin;
          if (Math.abs(v) > 1) D.circle(g, xOf(c0 + q / OS), sy(v), 2.5, C.bad);
        }
        for (let s = 0; s <= NS; s++) {
          const i = ((c0 + s) % LEN + LEN) % LEN, v = raw[i] * gainLin;
          D.line(g, xOf(c0 + s), mid, xOf(c0 + s), sy(v), 'rgba(255,255,255,0.2)', 1);
          D.circle(g, xOf(c0 + s), sy(v), 3, C.accent);
        }
        D.text(g, Lx('트루 피크 주변 샘플 24개. 보라 점 = 샘플, 선 = 4배 복원 파형, 빨간 선 = 0 dBFS', '24 samples around the true peak. Purple = samples, line = 4x rebuilt waveform, red = 0 dBFS'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 미터
        const mx = pad * 2 + w, my = pad + 30, mh = th - 60;
        const sp = A.linToDb(sPk * gainLin), tp = A.linToDb(tPk * gainLin);
        meter(g, mx + 14, my, 34, mh, sp, Lx('샘플', 'Sample'));
        meter(g, mx + 70, my, 34, mh, tp, Lx('트루', 'True'));
        D.text(g, Lx('피크 (dB)', 'Peak (dB)'), mx + mw / 2, pad + 3, { size: 10, align: 'center', color: C.dim });

        ctx.stat(Lx('샘플 피크', 'Sample peak'), sp.toFixed(2) + ' dBFS');
        ctx.stat(Lx('트루 피크', 'True peak'), tp.toFixed(2) + ' dBTP');
        ctx.stat(Lx('0 dBFS를 넘은 4배 샘플', '4x samples over 0 dBFS'), String(overs));
        ctx.stat(Lx('잘림 왜곡', 'Clip distortion'), clipDb < -150 ? Lx('없음', 'None') : clipDb.toFixed(1) + ' dB');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
