// 선행음 효과 (하스 효과): 같은 소리가 두 스피커에서 조금 어긋나 나오면 먼저 온 쪽에서 들림
GTL.register({
  id: 'haas-precedence-effect',
  title: '선행음 효과 (하스 효과)',
  summary: '같은 소리를 두 스피커로 내보내되 오른쪽만 몇 ms 늦춤. A(0ms)는 소리가 가운데에 맺히고, B(12ms)는 소리 하나가 먼저 도착한 왼쪽에서 들림. 지연이 더 길어지면 메아리로 갈라짐.',
  views: { a: '지연 0ms (같은 시각)', b: '오른쪽 12ms 지연' },
  controls: '파라미터 표에서 지연과 늦은 쪽 레벨을 바꿈. 스피커 두 대나 헤드폰으로 들음.',
  info: `
    <p><b>선행음 효과(Precedence Effect)</b>: 같은 소리가 두 방향에서 짧은 간격으로 오면 뇌는 먼저 온 소리의 방향만 씀. 늦게 온 소리는 따로 들리지 않고 음색과 공간감에만 섞임. 방 안 반사음 속에서도 음원 방향을 잃지 않는 이유.</p>
    <ul>
      <li><b>0~1ms</b>: 합산 위치 결정(Summing Localization). 두 소리가 섞여 그 사이 어딘가에 하나의 상이 맺힘. 지연이 커질수록 먼저 온 쪽으로 이동.</li>
      <li><b>1ms~메아리 문턱</b>: 선행음 구간. 상은 먼저 온 쪽에 고정. 하스(Haas)는 늦은 소리가 약 10dB 더 커도 먼저 온 쪽에서 들린다고 보고함.</li>
      <li><b>메아리 문턱 이상</b>: 늦은 소리가 따로 메아리(Echo)로 들림. 문턱은 음원에 따라 다름. 클릭은 약 5ms, 말소리는 30~50ms.</li>
    </ul>
    <p>활용: 공연장 보조 스피커를 지연시켜 소리가 무대에서 나는 것처럼 들리게 함. 믹싱에서는 한쪽을 10~30ms 늦춰 넓게 만드는 하스 트릭으로 씀(모노로 합치면 콤 필터가 생김).</p>
    <p>이 샘플의 "들리는 위치"는 위 구간을 따르는 설명용 근사. 실제 문턱은 사람과 소리에 따라 다름.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="18" class="t-small t-dim">${L('늦은 쪽 지연 (ms)', 'Delay of the late speaker (ms)')}</text>
    <rect x="20" y="40" width="40" height="34" class="f-dim"/>
    <rect x="60" y="40" width="280" height="34" class="f-b" opacity="0.35"/>
    <rect x="340" y="40" width="180" height="34" class="f-a" opacity="0.35"/>
    <text x="40" y="61" text-anchor="middle" class="t-small">${L('합산', 'sum')}</text>
    <text x="200" y="61" text-anchor="middle" class="t-small">${L('선행음 구간: 먼저 온 쪽에서 하나로', 'precedence: one image at the first speaker')}</text>
    <text x="430" y="61" text-anchor="middle" class="t-small">${L('메아리로 갈라짐', 'heard as an echo')}</text>
    <line x1="20" y1="84" x2="520" y2="84" class="d-line"/>
    <text x="20" y="98" text-anchor="middle" class="t-small t-mono">0</text>
    <text x="60" y="98" text-anchor="middle" class="t-small t-mono">1</text>
    <text x="340" y="98" text-anchor="middle" class="t-small t-mono">5~50</text>
    <text x="20" y="124" class="t-small t-dim">${L('메아리 문턱은 음원마다 다름 (클릭은 짧고, 말소리와 음악은 길음)', 'The echo threshold depends on the sound (short for clicks, long for speech and music)')}</text>
    <text x="20" y="140" class="t-small t-dim">${L('선행음 구간에서는 늦은 소리가 약 10dB 더 커도 먼저 온 쪽에서 들림', 'In the precedence zone the first speaker wins even if the late sound is about 10 dB louder')}</text>
  </svg>`,
  look: [
    'A와 B를 번갈아 들으면 A는 가운데, B는 왼쪽에서 하나의 소리로 들림. B에서도 오른쪽 스피커는 같은 크기로 울리고 있음.',
    'B의 지연을 0.3ms, 0.6ms, 1ms로 올리면 "들리는 위치" 점이 가운데에서 왼쪽으로 이동함',
    '음원을 "클릭"으로 두고 지연을 8ms 넘게 올리면 메아리 구간에 들어가 클릭이 두 번 들림',
    '음원을 "음절"로 바꾸면 같은 지연에서도 메아리가 덜 들림. 말소리는 메아리 문턱이 더 김.',
    '지연 12ms에서 늦은 쪽 레벨을 +8dB로 올려도 여전히 왼쪽에서 들림',
  ],
  refs: [
    { type: 'paper', title: 'H. Haas, "The Influence of a Single Echo on the Audibility of Speech", Journal of the Audio Engineering Society 20(2) (English translation of the 1951 paper)', year: 1972, note: '늦은 소리가 더 커도 먼저 온 쪽에서 들리는 실험' },
    { type: 'paper', title: 'H. Wallach, E. B. Newman, M. R. Rosenzweig, "The Precedence Effect in Sound Localization", American Journal of Psychology 62', year: 1949, note: '선행음 효과라는 이름을 붙인 연구' },
    { type: 'paper', title: 'R. Y. Litovsky, H. S. Colburn, W. A. Yost, S. J. Guzman, "The precedence effect", Journal of the Acoustical Society of America 106(4)', year: 1999, note: '음원별 메아리 문턱 등 정리 논문' },
    { type: 'book', title: 'Jens Blauert, Spatial Hearing (Revised Edition), MIT Press', year: 1997, note: '합산 위치 결정과 선행음 효과' },
  ],
  params: [
    { key: 'delay', label: '오른쪽 지연 (ms)', type: 'range', min: 0, max: 60, step: 0.1, a: 0, b: 12, group: '두 스피커' },
    { key: 'lagDb', label: '늦은 쪽 레벨 (dB)', type: 'range', min: -12, max: 12, step: 0.5, default: 0, help: '오른쪽 스피커 레벨. + 면 늦은 쪽이 더 큼' },
    { key: 'src', label: '음원', type: 'select', options: [{ value: 'click', label: '클릭' }, { value: 'noise', label: '노이즈 버스트' }, { value: 'syll', label: '음절 (합성 모음)' }], default: 'click', shared: true, group: '장면' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Precedence Effect (Haas Effect)',
    summary: 'The same sound plays from two speakers, but the right one is delayed by a few ms. In A (0 ms) the sound sits in the middle. In B (12 ms) one sound is heard from the left speaker, which arrives first. With longer delays it splits into an echo.',
    views: { a: 'Delay 0 ms (same time)', b: 'Right delayed 12 ms' },
    controls: 'Change the delay and the level of the late speaker in the parameter table. Use two speakers or headphones.',
    info: `
    <p><b>Precedence Effect</b>: when the same sound comes from two directions with a short gap, the brain uses only the direction of the first one. The late sound is not heard on its own. It only adds to tone color and sense of space. This is why we keep the source direction even among room reflections.</p>
    <ul>
      <li><b>0~1 ms</b>: Summing localization. The two sounds merge into one image somewhere between them. As the delay grows, the image moves toward the first speaker.</li>
      <li><b>1 ms up to the echo threshold</b>: the precedence zone. The image stays at the first speaker. Haas reported that the late sound can be about 10 dB louder and the first speaker still wins.</li>
      <li><b>Above the echo threshold</b>: the late sound is heard as a separate echo. The threshold depends on the sound: about 5 ms for clicks, 30~50 ms for speech.</li>
    </ul>
    <p>Uses: delayed fill speakers in a venue so the sound seems to come from the stage. In mixing, the "Haas trick" delays one side by 10~30 ms to make a sound wide (it creates a comb filter when summed to mono).</p>
    <p>The "perceived position" in this sample is a teaching model that follows the zones above. Real thresholds vary by listener and sound.</p>`,
    look: [
      'Switch between A and B. A is heard in the middle. B is heard as one sound on the left, even though the right speaker plays just as loud.',
      'Raise B\'s delay to 0.3, 0.6 and 1 ms. The "perceived position" dot moves from the middle to the left.',
      'Keep the source on "Click" and raise the delay above 8 ms. You enter the echo zone and hear each click twice.',
      'Change the source to "Syllable". At the same delay the echo is less clear. Speech has a longer echo threshold.',
      'At 12 ms delay, raise the late level to +8 dB. You still hear the sound on the left.',
    ],
    refs: ['Experiments showing the first speaker wins even when the late sound is louder.', 'The study that named the precedence effect.', 'Review paper, including echo thresholds per sound type.', 'Summing localization and the precedence effect.'],
    params: {
      delay: { label: 'Right delay (ms)', group: 'Two speakers' },
      lagDb: { label: 'Late speaker level (dB)', help: 'Level of the right speaker. + means the late side is louder' },
      src: { label: 'Source', group: 'Scene', options: { click: 'Click', noise: 'Noise burst', syll: 'Syllable (synthetic vowel)' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const noise = A.noiseBuffer(1 << 16, 5);
    const ECHO = { click: 5, noise: 10, syll: 30 }; // 메아리 문턱 (ms, 대략)
    const PERIOD = { click: 0.5, noise: 0.6, syll: 0.7 };

    // 들리는 위치 모델. 반환: { zone, imgs: [pos(-1 왼쪽 ~ 1 오른쪽)] }
    function percept(d = P.delay) {
      const G = P.lagDb, thr = ECHO[P.src];
      if (d < 1) {
        const p = U.clamp(-d / 1.0 + G / 15, -1, 1);
        return { zone: 'sum', imgs: [p] };
      }
      if (d < thr) {
        const p = G > 10 ? U.clamp(-1 + (G - 10) / 4, -1, 1) : -1;
        return { zone: 'prec', imgs: [p] };
      }
      return { zone: 'echo', imgs: [-1, 1] };
    }

    // 음원
    let bp1 = null, bp2 = null, bpSr = 0;
    let glot = 0;
    function source(t, sr) {
      const per = PERIOD[P.src], tt = t % per;
      if (P.src === 'click') return tt < 0.0003 ? Math.sin(Math.PI * tt / 0.0003) * 0.9 : 0;
      if (P.src === 'noise') { if (tt > 0.08) return 0; return noise[Math.floor(t * sr) & 0xffff] * Math.min(1, tt / 0.001) * Math.exp(-tt / 0.02) * 0.8; }
      // 음절: 130Hz 성문 펄스를 두 포먼트 대역 필터에 통과
      glot += 130 / sr; let pulse = 0; if (glot >= 1) { glot -= 1; pulse = 1; }
      const env = tt > 0.22 ? 0 : Math.min(1, tt / 0.01) * Math.min(1, (0.22 - tt) / 0.05);
      const x = pulse * env;
      return (bp1.process(x) * 3 + bp2.process(x) * 2) * 1.2;
    }

    const M = 8191, buf = new Float32Array(M + 1);
    let w = 0, tS = 0, sD = 0, sG = 1;
    const readD = (d) => { const p = w - 1 - d, i0 = Math.floor(p), fr = p - i0; return buf[i0 & M] * (1 - fr) + buf[(i0 + 1) & M] * fr; };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (bpSr !== sr) { bp1 = A.biquad('bandpass', 700, 5, 0, sr); bp2 = A.biquad('bandpass', 1150, 6, 0, sr); bpSr = sr; }
        const dT = Math.min(P.delay / 1000 * sr, M - 2), gT = A.dbToLin(P.lagDb);
        for (let i = 0; i < n; i++) {
          const x = source(tS, sr); tS += 1 / sr;
          buf[w] = x; w = (w + 1) & M;
          sD += (dT - sD) * 0.003; sG += (gT - sG) * 0.003;
          l[i] = x * 0.45; r[i] = readD(sD) * sG * 0.45;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const pc = percept();
        // 위: 스피커 두 대와 청취자
        const sh = Math.max(110, H * 0.42), cx = W / 2, ly = pad + sh - 18, spread = Math.min(W * 0.3, sh * 0.75);
        const spL = { x: cx - spread, y: pad + 26 }, spR = { x: cx + spread, y: pad + 26 };
        D.rect(g, pad, pad, W - pad * 2, sh, 'rgba(0,0,0,0.35)');
        for (const [s, lab, gain] of [[spL, Lg('왼쪽 (먼저)', 'Left (first)'), 0], [spR, Lg('오른쪽 (늦게)', 'Right (late)'), P.lagDb]]) {
          D.rect(g, s.x - 12, s.y - 12, 24, 24, '#2a2f38', C.dim, 1.5);
          D.circle(g, s.x, s.y, 7 * U.clamp(A.dbToLin(gain), 0.4, 2.2), null, C.text, 1.2);
          D.text(g, lab, s.x, s.y + 15, { size: 10, align: 'center', color: C.dim });
          D.line(g, s.x, s.y, cx, ly, C.grid, 1);
        }
        D.circle(g, cx, ly, 12, '#2a2f38', C.dim, 1.5);
        D.text(g, Lg('청취자', 'Listener'), cx, ly + 14, { size: 10, align: 'center', color: C.dim });
        // 들리는 위치 (스피커 사이 선 위)
        const imgY = pad + 26;
        D.line(g, spL.x + 14, imgY, spR.x - 14, imgY, C.grid, 2);
        pc.imgs.forEach((p, i) => {
          const x = cx + p * spread;
          D.circle(g, x, imgY + 34, i === 0 ? 9 : 6, i === 0 ? col : null, i === 0 ? null : col, 2);
          D.line(g, x, imgY + 26, x, imgY + 4, col, 1.5);
        });
        D.text(g, pc.zone === 'echo' ? Lg('들리는 위치: 원음 + 메아리', 'Perceived: source + echo') : Lg('들리는 위치', 'Perceived position'), cx, imgY + 46, { size: 10, align: 'center', color: col });
        // 가운데: 도착 시각 타임라인
        const ty = pad + sh + 10, th = Math.max(50, H * 0.22), tx = pad, tw = W - pad * 2;
        D.rect(g, tx, ty, tw, th, 'rgba(0,0,0,0.35)');
        const tmax = 60, tX = (ms) => tx + 50 + (tw - 60) * ms / tmax;
        for (let ms = 0; ms <= tmax; ms += 10) { D.line(g, tX(ms), ty, tX(ms), ty + th, C.grid, 1); D.text(g, ms + 'ms', tX(ms) + 2, ty + th - 12, { size: 9, color: C.dim }); }
        const r1 = ty + th * 0.32, r2 = ty + th * 0.62, sc = th * 0.24;
        D.text(g, Lg('왼쪽', 'Left'), tx + 4, r1 - 6, { size: 10, color: C.warn });
        D.text(g, Lg('오른쪽', 'Right'), tx + 4, r2 - 6, { size: 10, color: C.accent });
        D.line(g, tX(0), r1, tX(0), r1 - sc, C.warn, 3);
        const gl = U.clamp(A.dbToLin(P.lagDb), 0.25, 2);
        D.line(g, tX(P.delay), r2, tX(P.delay), r2 - sc * gl * 0.8, C.accent, 3);
        // 메아리 문턱
        const thr = ECHO[P.src];
        D.rect(g, tX(0), ty + th - 4, tX(1) - tX(0), 4, C.dim);
        D.rect(g, tX(1), ty + th - 4, tX(thr) - tX(1), 4, C.b);
        D.rect(g, tX(thr), ty + th - 4, tX(tmax) - tX(thr), 4, C.a);
        // 아래: 지연에 따른 들리는 위치 곡선
        const cy0 = ty + th + 10, ch = H - cy0 - pad;
        if (ch > 40) {
          D.rect(g, tx, cy0, tw, ch, 'rgba(0,0,0,0.35)');
          const yP = (p) => cy0 + ch / 2 - p * (ch / 2 - 14);
          D.line(g, tX(0), yP(0), tX(tmax), yP(0), C.grid, 1);
          g.beginPath();
          for (let i = 0; i <= 240; i++) {
            const ms = tmax * i / 240;
            const q = percept(ms), y = yP(-q.imgs[0]);
            i ? g.lineTo(tX(ms), y) : g.moveTo(tX(ms), y);
          }
          g.strokeStyle = C.good; g.lineWidth = 1.5; g.stroke();
          D.line(g, tX(thr), cy0, tX(thr), cy0 + ch, C.a, 1);
          D.circle(g, tX(P.delay), yP(-pc.imgs[0]), 5, col);
          D.text(g, Lg('지연에 따른 들리는 위치 (위 = 왼쪽)', 'Perceived position vs delay (up = left)'), tx + 4, cy0 + 3, { size: 10, color: C.dim });
        }
        const zn = { sum: Lg('합산 위치 결정', 'Summing localization'), prec: Lg('선행음 구간', 'Precedence zone'), echo: Lg('메아리', 'Echo') }[pc.zone];
        ctx.stat(Lg('구간', 'Zone'), zn);
        ctx.stat(Lg('지연', 'Delay'), `${P.delay.toFixed(1)} ms`);
        ctx.stat(Lg('메아리 문턱 (대략)', 'Echo threshold (approx)'), `${thr} ms`);
        ctx.stat(Lg('들리는 위치', 'Perceived position'), pc.zone === 'echo' ? Lg('두 곳', 'two places') : `${(pc.imgs[0] * 100).toFixed(0)}% ${pc.imgs[0] < 0 ? Lg('왼쪽', 'left') : Lg('오른쪽', 'right')}`);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
