// 조성 검출: 장음계에 들어가는 음 세기 vs Krumhansl-Schmuckler 프로필 상관. 단조 선율에서 나란한조 혼동을 비교
GTL.register({
  id: 'key-detection',
  title: '조성 검출 (Krumhansl-Schmuckler)',
  summary: '선율의 음 이름별 길이 분포(음높이 집합 히스토그램)로 조를 추정함. 장음계에 들어가는 음만 세면 A단조와 C장조처럼 같은 음을 쓰는 나란한조를 구분하지 못함. 조마다 음의 중요도를 담은 프로필과 상관을 구하면 으뜸음, 3음, 5음의 비중으로 단조를 찾아냄.',
  views: { a: '음계 포함 개수', b: 'Krumhansl-Schmuckler' },
  controls: '파라미터 표에서 선율과 방식을 바꿈. "소리 켜기"를 누르면 선율과 함께 추정한 조의 으뜸화음이 낮게 깔림. 틀린 조는 어색하게 들림.',
  info: `
    <p><b>조성 검출(Key Detection)</b>은 곡의 으뜸음과 장조, 단조를 찾는 일. DJ의 하모닉 믹싱, 자동 반주, 악보 조표 추정, 음악 검색에 쓰임.</p>
    <ol>
      <li>음 이름 12개마다 울린 시간을 더해 히스토그램을 만듦 (오디오라면 크로마의 평균)</li>
      <li>24개 조(장조 12, 단조 12)마다 점수를 매겨 가장 높은 조를 고름</li>
    </ol>
    <ul>
      <li><b>음계 포함 개수</b>: 장음계 7음에 들어가는 길이의 합. 단순하지만 C장조와 A단조는 같은 7음이라 점수가 같음. 단조를 모르는 방식.</li>
      <li><b>Krumhansl-Schmuckler</b>: 청취 실험(탐침음 실험)으로 얻은 "이 조에서 각 음이 얼마나 잘 어울리는가" 프로필 24개와 히스토그램의 피어슨 상관. 으뜸음, 3음, 5음에 무게가 있어 나란한조를 가름. A가 길게 울리면 C장조보다 a단조 프로필과 더 닮음.</li>
      <li><b>Temperley 프로필</b>: 악보 말뭉치에서 다시 만든 프로필. 짧은 선율에서 결과가 조금 다름.</li>
    </ul>
    <p>단점: 짧은 구간, 전조, 선법(도리아, 믹소리디아) 음악에서 자주 틀림. 실제 시스템은 구간별로 추정하고 시간 흐름을 HMM 등으로 매끄럽게 만듦.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="14" class="t-small t-dim">${L('Krumhansl-Kessler 프로필 (C장조, a단조)', 'Krumhansl-Kessler profiles (C major, A minor)')}</text>
    ${[6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88].map((v, i) => `<rect x="${20 + i * 20}" y="${130 - v * 15}" width="14" height="${v * 15}" class="f-a" opacity="0.8"/>`).join('')}
    ${['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map((n, i) => `<text x="${27 + i * 20}" y="146" text-anchor="middle" class="t-small">${n}</text>`).join('')}
    <text x="140" y="164" text-anchor="middle" class="t-small t-a">${L('C장조: C, G, E가 높음', 'C major: C, G, E are high')}</text>
    ${[5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17, 6.33, 2.68, 3.52].map((v, i) => `<rect x="${290 + i * 20}" y="${130 - v * 15}" width="14" height="${v * 15}" class="f-b" opacity="0.8"/>`).join('')}
    ${['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map((n, i) => `<text x="${297 + i * 20}" y="146" text-anchor="middle" class="t-small">${n}</text>`).join('')}
    <text x="410" y="164" text-anchor="middle" class="t-small t-b">${L('a단조: A, C, E가 높음', 'A minor: A, C, E are high')}</text>
  </svg>`,
  look: [
    '기본 선율(a단조)에서 A는 C장조를 고름. B는 a단조를 고름.',
    '선율을 "G장조"로 바꾸면 두 방식 모두 맞음. A의 방식은 장조만 맞힐 수 있음.',
    '"d단조" 선율에서 A는 F장조(나란한조)를 고름. B는 d단조를 고름.',
    '"소리 켜기" 후 A와 B를 번갈아 들으면 A의 으뜸화음(C장조)이 선율의 끝음 A와 어울리지 않음',
  ],
  refs: [
    { type: 'book', title: 'Carol L. Krumhansl, Cognitive Foundations of Musical Pitch', year: 1990, note: 'Krumhansl-Schmuckler 조성 검출과 프로필' },
    { type: 'paper', title: 'C. L. Krumhansl, E. J. Kessler, "Tracing the dynamic changes in perceived tonal organization in a spatial representation of musical keys", Psychological Review 89(4)', year: 1982, note: '탐침음 실험으로 얻은 장조, 단조 프로필' },
    { type: 'paper', title: 'D. Temperley, "What\'s Key for Key? The Krumhansl-Schmuckler Key-Finding Algorithm Reconsidered", Music Perception 17(1)', year: 1999, note: '프로필 수정과 개선' },
    { type: 'paper', title: 'E. Gómez, "Tonal Description of Music Audio Signals", PhD thesis, Universitat Pompeu Fabra', year: 2006, note: '오디오(HPCP)에서 조성 검출' },
  ],
  params: [
    { key: 'method', label: '방식', type: 'select', options: [{ value: 'scale', label: '음계 포함 개수' }, { value: 'ks', label: 'Krumhansl-Schmuckler' }, { value: 'temperley', label: 'Temperley 프로필' }], a: 'scale', b: 'ks', group: '검출' },
    { key: 'tune', label: '선율', type: 'select', options: [{ value: 'amin', label: 'a단조' }, { value: 'gmaj', label: 'G장조' }, { value: 'dmin', label: 'd단조' }, { value: 'ebmaj', label: 'E♭장조' }], default: 'amin', shared: true, group: '음악' },
    { key: 'drone', label: '으뜸화음 크기', type: 'range', min: 0, max: 1, step: 0.05, default: 0.5, shared: true, group: '소리' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Key Detection (Krumhansl-Schmuckler)',
    summary: 'The key is estimated from how long each note name sounds in the melody (a pitch class histogram). Counting only notes inside a major scale cannot tell relative keys apart, like A minor and C major, which use the same notes. Correlating with profiles of how important each note is in each key finds minor keys through the weight of the tonic, third and fifth.',
    views: { a: 'Scale note count', b: 'Krumhansl-Schmuckler' },
    controls: 'Change the melody and method in the parameter table. Press "Sound on" to hear the melody over a low tonic chord of the estimated key. A wrong key sounds awkward.',
    info: `
    <p><b>Key detection</b> finds the tonic and whether a piece is major or minor. It is used for harmonic mixing in DJ software, auto accompaniment, key signature estimation and music search.</p>
    <ol>
      <li>Add up how long each of the 12 note names sounds to build a histogram (for audio, the average chroma).</li>
      <li>Score each of 24 keys (12 major, 12 minor) and pick the highest.</li>
    </ol>
    <ul>
      <li><b>Scale note count</b>: total length of notes inside the 7-note major scale. Simple, but C major and A minor use the same 7 notes and get the same score. This method knows nothing about minor.</li>
      <li><b>Krumhansl-Schmuckler</b>: Pearson correlation between the histogram and 24 profiles from listening tests (probe tone experiments) of "how well each note fits this key". The tonic, third and fifth carry weight, which separates relative keys. If A sounds long, the histogram looks more like the A minor profile than the C major one.</li>
      <li><b>Temperley profiles</b>: profiles rebuilt from a corpus of scores. Results differ a little on short melodies.</li>
    </ul>
    <p>Weak spots: short passages, modulation and modal music (Dorian, Mixolydian) are often wrong. Real systems estimate per section and smooth over time with an HMM or similar.</p>`,
    look: [
      'With the default melody (A minor), A picks C major. B picks A minor.',
      'Switch the melody to "G major". Both methods are right. A can only get major keys right.',
      'With the "D minor" melody, A picks F major (the relative key). B picks D minor.',
      'Press "Sound on" and switch between A and B. A\'s tonic chord (C major) does not fit the final A of the melody.',
    ],
    refs: ['Krumhansl-Schmuckler key finding and the profiles.', 'Major and minor profiles from probe tone experiments.', 'Revised profiles and improvements.', 'Key detection from audio (HPCP).'],
    params: {
      method: { label: 'Method', group: 'Detection', options: { scale: 'Scale note count', temperley: 'Temperley profiles' } },
      tune: { label: 'Melody', group: 'Music', options: { amin: 'A minor', gmaj: 'G major', dmin: 'D minor', ebmaj: 'E♭ major' } },
      drone: { label: 'Tonic chord level', group: 'Sound' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b, TAU = Math.PI * 2, BEAT = 0.4;
    const NAMES = ['C', 'C#', 'D', 'E♭', 'E', 'F', 'F#', 'G', 'A♭', 'A', 'B♭', 'B'];
    // 선율 [MIDI, 박]. 직접 만든 짧은 선율 (단조는 화성단음계의 이끔음 포함)
    const TUNES = {
      amin: { key: 21, notes: [[69, 1], [72, 1], [76, 1], [74, 1], [72, 1], [71, 1], [68, 1], [69, 2], [76, 1], [77, 1], [76, 1], [74, 1], [72, 1], [71, 1], [69, 3]] },
      gmaj: { key: 7, notes: [[67, 1], [71, 1], [74, 1], [71, 1], [72, 1], [69, 1], [66, 1], [67, 2], [74, 1], [76, 1], [74, 1], [72, 1], [71, 1], [69, 1], [67, 3]] },
      dmin: { key: 14, notes: [[62, 1], [65, 1], [69, 1], [67, 1], [65, 1], [64, 1], [61, 1], [62, 2], [69, 1], [70, 1], [69, 1], [67, 1], [65, 1], [64, 1], [62, 3]] },
      ebmaj: { key: 3, notes: [[63, 1], [67, 1], [70, 1], [67, 1], [68, 1], [65, 1], [62, 1], [63, 2], [70, 1], [72, 1], [70, 1], [68, 1], [67, 1], [65, 1], [63, 3]] },
    };
    const PROF = {
      ks: { maj: [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88], min: [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17] },
      temperley: { maj: [5.0, 2.0, 3.5, 2.0, 4.5, 4.0, 2.0, 4.5, 2.0, 3.5, 1.5, 4.0], min: [5.0, 2.0, 3.5, 4.5, 2.0, 4.0, 2.0, 4.5, 3.5, 2.0, 1.5, 4.0] },
    };
    const MAJOR = [0, 2, 4, 5, 7, 9, 11];
    const keyName = (k) => (k < 12 ? NAMES[k] + Lg(' 장조', ' major') : NAMES[k - 12] + Lg(' 단조', ' minor'));
    const pearson = (x, y) => {
      let mx = 0, my = 0; for (let i = 0; i < 12; i++) { mx += x[i]; my += y[i]; } mx /= 12; my /= 12;
      let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < 12; i++) { const a = x[i] - mx, b = y[i] - my; sxy += a * b; sxx += a * a; syy += b * b; }
      return sxy / Math.sqrt(sxx * syy + 1e-12);
    };

    let key = '', hist = null, scores = null, est = 0, tune = null, events = [], LEN = 0;
    function analyze() {
      const k = P.tune + P.method;
      if (k === key) return;
      key = k;
      tune = TUNES[P.tune];
      hist = new Float32Array(12);
      events = []; let t = 0;
      for (const [m, b] of tune.notes) { hist[m % 12] += b; events.push([t, m, b * BEAT]); t += b * BEAT; }
      LEN = t + BEAT;
      scores = new Float32Array(24);
      if (P.method === 'scale') {
        for (let r = 0; r < 12; r++) { let s = 0; for (const iv of MAJOR) s += hist[(r + iv) % 12]; scores[r] = s; }
        for (let r = 0; r < 12; r++) scores[12 + r] = 0;   // 단조는 고려하지 않음
      } else {
        const pr = PROF[P.method];
        for (let r = 0; r < 12; r++) {
          const rot = (p) => Array.from({ length: 12 }, (_, i) => p[(i - r + 12) % 12]);
          scores[r] = pearson(hist, rot(pr.maj)); scores[12 + r] = pearson(hist, rot(pr.min));
        }
      }
      est = 0; for (let i = 1; i < 24; i++) if (scores[i] > scores[est]) est = i;
    }
    analyze();

    // 소리: 선율(실시간 합성) + 추정 조의 으뜸화음 지속음
    const live = { t: 0, ph: new Float64Array(8) };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const dt = 1 / sr, tonic = est % 12, third = est < 12 ? 4 : 3;
        const dr = [48 + tonic, 48 + tonic + third, 48 + tonic + 7, 36 + tonic].map(A.mtof);
        for (let i = 0; i < n; i++) {
          const t = live.t;
          let v = 0;
          for (const [t0, m, d] of events) {
            const tt = t - t0;
            if (tt < 0 || tt > d + 0.2) continue;
            const f = A.mtof(m), e = Math.min(1, tt / 0.005) * Math.exp(-tt * 3) * (tt > d ? Math.max(0, 1 - (tt - d) / 0.2) : 1);
            v += e * (Math.sin(TAU * f * tt) + 0.4 * Math.sin(2 * TAU * f * tt) + 0.2 * Math.sin(3 * TAU * f * tt));
          }
          let dv = 0;
          for (let k = 0; k < 4; k++) { live.ph[k] = (live.ph[k] + TAU * dr[k] * dt) % TAU; dv += Math.sin(live.ph[k]); }
          const out = 0.22 * v + 0.07 * P.drone * dv;
          l[i] = out; r[i] = out;
          live.t += dt; if (live.t >= LEN) live.t -= LEN;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, tw = W - pad * 2;
        // 위: 피아노 롤
        const h1 = Math.max(50, H * 0.28);
        D.rect(g, pad, pad, tw, h1, 'rgba(0,0,0,0.35)');
        let lo = 127, hi = 0; for (const [, m] of events) { lo = Math.min(lo, m); hi = Math.max(hi, m); }
        lo -= 2; hi += 2;
        const tonic = est % 12;
        for (const [t0, m, d] of events) {
          const x = pad + t0 / LEN * tw, y = pad + h1 - (m - lo + 1) / (hi - lo + 1) * h1;
          D.rect(g, x, y, d / LEN * tw - 2, Math.max(3, h1 / (hi - lo + 1) - 1), m % 12 === tonic ? col : 'rgba(216,221,230,0.7)');
        }
        if (snd.on) D.line(g, pad + live.t / LEN * tw, pad, pad + live.t / LEN * tw, pad + h1, '#fff', 1);
        D.text(g, Lg('선율 (색 = 추정 으뜸음)', 'Melody (colored = estimated tonic)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 가운데: 히스토그램 + 추정 조의 프로필
        const y2 = pad * 2 + h1, h2 = Math.max(50, H * 0.3), bw = tw / 12;
        D.rect(g, pad, y2, tw, h2, 'rgba(0,0,0,0.35)');
        let hm = 1e-9; for (let i = 0; i < 12; i++) hm = Math.max(hm, hist[i]);
        for (let i = 0; i < 12; i++) {
          const v = hist[i] / hm, bh = v * (h2 - 30);
          D.rect(g, pad + i * bw + 3, y2 + h2 - 14 - bh, bw - 6, bh, 'rgba(216,221,230,0.55)');
          D.text(g, NAMES[i], pad + i * bw + bw / 2, y2 + h2 - 12, { size: 10, color: C.text, align: 'center' });
        }
        // 추정 조의 프로필 (또는 장음계 7음 표시)
        const pr = P.method === 'scale' ? null : PROF[P.method];
        if (pr) {
          const p = est < 12 ? pr.maj : pr.min, pm = Math.max(...p);
          g.beginPath();
          for (let i = 0; i < 12; i++) { const v = p[(i - tonic + 12) % 12] / pm, px = pad + i * bw + bw / 2, py = y2 + h2 - 14 - v * (h2 - 30); i ? g.lineTo(px, py) : g.moveTo(px, py); }
          g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        } else for (const iv of MAJOR) D.rect(g, pad + ((tonic + iv) % 12) * bw + 3, y2 + h2 - 16, bw - 6, 3, col);
        D.text(g, pr ? Lg('음 이름별 길이 (막대)와 추정 조의 프로필 (선)', 'Length per note name (bars) and profile of the estimated key (line)') : Lg('음 이름별 길이 (막대). 색 띠 = 추정 장음계의 7음', 'Length per note name (bars). Colored marks = 7 notes of the estimated major scale'), pad + 4, y2 + 3, { size: 10, color: C.dim });
        // 아래: 24개 조 점수
        const y3 = y2 + h2 + pad, h3 = H - y3 - pad, rowH = h3 / 2;
        let smin = Infinity, smax = -Infinity; for (let i = 0; i < 24; i++) { smin = Math.min(smin, scores[i]); smax = Math.max(smax, scores[i]); }
        if (P.method === 'scale') smin = 0;
        for (let row = 0; row < 2; row++) {
          D.rect(g, pad, y3 + row * rowH, tw, rowH - 2, 'rgba(0,0,0,0.35)');
          for (let i = 0; i < 12; i++) {
            const k = row * 12 + i, v = (scores[k] - smin) / (smax - smin + 1e-9), bh = v * (rowH - 18);
            const c = k === est ? col : k === tune.key ? C.good : 'rgba(216,221,230,0.35)';
            D.rect(g, pad + i * bw + 4, y3 + row * rowH + rowH - 14 - bh, bw - 8, bh, c);
            D.text(g, NAMES[i] + (row ? 'm' : ''), pad + i * bw + bw / 2, y3 + row * rowH + rowH - 13, { size: 9, color: C.dim, align: 'center' });
          }
          D.text(g, row ? Lg('단조', 'Minor') : Lg('장조', 'Major'), pad + 4, y3 + row * rowH + 2, { size: 9, color: C.dim });
        }
        D.text(g, Lg('초록 = 정답 조', 'Green = true key'), pad + tw - 4, y3 + 2, { size: 9, color: C.good, align: 'right' });
        const sorted = Array.from(scores).map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]);
        ctx.stat(Lg('추정 조', 'Estimated key'), keyName(est));
        ctx.stat(Lg('정답 조', 'True key'), keyName(tune.key));
        const gap = sorted[0][0] - sorted[1][0];
        ctx.stat(Lg('2위', 'Runner-up'), `${keyName(sorted[1][1])} (${P.method === 'scale' ? gap.toFixed(0) + Lg('박 차이', ' beats behind') : gap.toFixed(3) + Lg(' 차이', ' behind')})`);
        ctx.stat(Lg('점수', 'Score'), P.method === 'scale' ? scores[est].toFixed(0) + Lg('박 / ', ' / ') + Array.from(hist).reduce((a, b) => a + b, 0) + Lg('박', ' beats') : 'r = ' + scores[est].toFixed(3));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
