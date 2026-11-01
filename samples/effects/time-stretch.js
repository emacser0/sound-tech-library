// 타임 스트레치: 단순 OLA(위상 어긋남) vs WSOLA(가장 비슷한 위치를 찾아 이어 붙임). 이음매 상관도로 비교
GTL.register({
  id: 'time-stretch',
  title: '타임 스트레치 (OLA vs WSOLA)',
  summary: '음 높이는 그대로 두고 길이만 바꾸려면 소리를 짧은 조각으로 잘라 간격을 바꿔 다시 겹쳐 붙임. 단순 OLA는 조각끼리 위상이 어긋나 음이 떨리고 탁해짐. WSOLA는 조각마다 앞 조각과 가장 잘 이어지는 위치를 찾아 매끈하게 붙임.',
  views: { a: '단순 OLA', b: 'WSOLA' },
  controls: '파라미터 표에서 늘이기 비율과 방식을 바꿈. "소리 켜기"를 누르면 늘인 결과가 반복 재생됨.',
  info: `
    <p>테이프를 느리게 돌리면 길이와 함께 음 높이도 내려감. <b>타임 스트레치(Time stretch)</b>는 음 높이를 유지한 채 길이만 바꿈. 시간 영역 방식은 소리를 20~50ms 조각(프레임)으로 잘라 창을 씌우고, 읽는 간격(Ha)과 붙이는 간격(Hs)을 다르게 해서 겹쳐 더함. 늘이기 비율 = Hs / Ha.</p>
    <ul>
      <li><b>OLA (Overlap-Add)</b>: 조각을 정해진 간격으로만 읽음. 겹치는 두 조각의 주기가 맞지 않으면 서로 상쇄되어 음량이 떨리고(위상 간섭) 피치가 흔들려 들림.</li>
      <li><b>WSOLA (Waveform Similarity OLA, Verhelst와 Roelands 1993)</b>: 읽는 위치를 ±Δ 범위에서 옮겨 보며, 앞 조각이 자연스럽게 이어질 파형과 상호 상관이 가장 큰 위치를 고름. 이음매의 위상이 맞아 단선율 소리에 아주 깨끗함.</li>
      <li>단점: WSOLA는 여러 음이 섞인 소리(화음)나 타악기의 어택에서 조각이 겹치거나 빠지는 소리(트랜지언트 스미어)가 생김. 이때는 위상 보코더, 트랜지언트 보존 같은 방법을 섞어 씀.</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <text x="6" y="16" class="t-small">${L('입력: 간격 Ha로 읽음', 'Input: read every Ha')}</text>
    <path d="M10,40 q8,-16 16,0 t16,0 q8,-16 16,0 t16,0 q8,-16 16,0 t16,0 q8,-16 16,0 t16,0 q8,-16 16,0 t16,0 q8,-16 16,0 t16,0 q8,-16 16,0 t16,0 q8,-16 16,0 t16,0 q8,-16 16,0 t16,0" class="d-dim"/>
    <rect x="10" y="50" width="80" height="10" class="f-dim"/><rect x="50" y="62" width="80" height="10" class="f-dim"/><rect x="90" y="74" width="80" height="10" class="f-dim"/>
    <rect x="58" y="62" width="80" height="10" class="f-b" opacity="0.35"/><text x="140" y="70" class="t-small t-b">${L('WSOLA: ±Δ 안에서 옮겨 맞춤', 'WSOLA: shift within ±Δ to match')}</text>
    <text x="6" y="106" class="t-small">${L('출력: 간격 Hs로 붙임 (Hs > Ha면 길어짐)', 'Output: place every Hs (longer when Hs > Ha)')}</text>
    <path d="M10,130 Q50,110 90,130 Q130,150 170,130" class="d-a"/><path d="M70,130 Q110,150 150,130 Q190,110 230,130" class="d-a" stroke-dasharray="4 3"/>
    <text x="40" y="162" class="t-small t-a">${L('OLA: 위상이 어긋나 상쇄', 'OLA: phases clash and cancel')}</text>
    <path d="M300,130 Q340,110 380,130 Q420,150 460,130" class="d-b"/><path d="M340,130 Q380,150 420,130 Q460,110 500,130" class="d-b" stroke-dasharray="4 3" transform="translate(-40,0)"/>
    <text x="320" y="162" class="t-small t-b">${L('WSOLA: 위상이 맞아 보강', 'WSOLA: phases line up')}</text>
  </svg>`,
  look: [
    '이음매 상관도 막대를 비교하면 A는 0 아래로 내려가는 막대가 많고 B는 거의 모두 1 근처',
    '확대 파형에서 A는 음량이 출렁이고 파형 모양이 바뀜. B는 고른 주기가 이어짐.',
    '"소리 켜기"를 누르면 A는 떨리고 흐릿한 소리, B는 원래 음색 그대로 길어진 소리',
    '늘이기 비율을 1.0으로 하면 두 방식이 같아짐 (조각을 원래 자리에 다시 붙임)',
    '음원을 드럼으로 바꾸면 B에서도 어택이 두 번 들리거나 뭉개지는 곳이 생김',
  ],
  refs: [
    { type: 'paper', title: 'Werner Verhelst, Marc Roelands, "An Overlap-Add Technique Based on Waveform Similarity (WSOLA) for High Quality Time-Scale Modification of Speech", IEEE ICASSP', year: 1993, note: 'WSOLA 원 논문' },
    { type: 'paper', title: 'Jonathan Driedger, Meinard Müller, "A Review of Time-Scale Modification of Music Signals", Applied Sciences 6(2)', year: 2016, note: 'OLA, WSOLA, 위상 보코더 비교' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed., Wiley', year: 2011, note: '6장 시간 영역 타임 스트레치' },
  ],
  params: [
    { key: 'method', label: '방식', type: 'select', options: [{ value: 'ola', label: '단순 OLA' }, { value: 'wsola', label: 'WSOLA' }], a: 'ola', b: 'wsola', group: '스트레치' },
    { key: 'ratio', label: '늘이기 비율', type: 'range', min: 0.5, max: 2.5, step: 0.05, default: 1.6, shared: true, help: '1보다 크면 길어짐 (느려짐)' },
    { key: 'frame', label: '프레임 길이 (ms)', type: 'range', min: 20, max: 80, step: 1, default: 40, shared: true },
    { key: 'tol', label: '탐색 범위 Δ (ms)', type: 'range', min: 2, max: 20, step: 1, default: 10, shared: true, when: (p) => p.method === 'wsola' },
    { key: 'src', label: '음원', type: 'select', options: [{ value: 'voice', label: '낮은 멜로디' }, { value: 'drums', label: '드럼' }], default: 'voice', shared: true, group: '음원' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Time Stretch (OLA vs WSOLA)',
    summary: 'To change length but keep pitch, cut the sound into short pieces and overlap them again at a different spacing. Plain OLA joins pieces whose phases do not match, so the sound wobbles and gets muddy. WSOLA finds the position where each piece best continues the previous one and joins it smoothly.',
    views: { a: 'Plain OLA', b: 'WSOLA' },
    controls: 'Change the stretch ratio and method in the parameter table. Press "Sound on" to loop the stretched result.',
    info: `
    <p>Playing tape slower lowers the pitch along with the length. <b>Time stretch</b> changes only the length and keeps the pitch. Time-domain methods cut the sound into 20 to 50 ms pieces (frames), apply a window, and overlap-add them with a read spacing (Ha) different from the write spacing (Hs). Stretch ratio = Hs / Ha.</p>
    <ul>
      <li><b>OLA (overlap-add)</b>: reads frames only at fixed spacing. If two overlapping frames are out of step, they cancel each other, so the level wobbles (phase interference) and the pitch seems to shake.</li>
      <li><b>WSOLA (waveform similarity OLA, Verhelst and Roelands 1993)</b>: moves the read position within ±Δ and picks the spot with the highest cross-correlation against the natural continuation of the previous frame. The seams line up in phase, so single-voice sounds come out very clean.</li>
      <li>Downside: on mixed sounds (chords) and drum attacks, WSOLA can repeat or drop bits (transient smearing). Then phase vocoders or transient preservation are mixed in.</li>
    </ul>`,
    look: [
      'Compare the seam correlation bars. A has many bars below 0. B has almost all near 1.',
      'In the zoomed waveform, A\'s level swells and its shape changes. B keeps an even cycle.',
      'Press "Sound on". A sounds shaky and blurry. B sounds like the original tone, just longer.',
      'Set the stretch ratio to 1.0. Both methods become the same (frames go back to their own place).',
      'Switch the source to drums. Even B has places where an attack doubles or smears.',
    ],
    refs: ['The original WSOLA paper.', 'Comparison of OLA, WSOLA and phase vocoder.', 'Ch. 6 time-domain time stretching.'],
    params: {
      method: { label: 'Method', group: 'Stretch', options: { ola: 'Plain OLA' } },
      ratio: { label: 'Stretch ratio', help: 'Above 1 makes it longer (slower)' },
      frame: 'Frame length (ms)',
      tol: 'Search range Δ (ms)',
      src: { label: 'Source', group: 'Source', options: { voice: 'Low melody', drums: 'Drums' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b, TAU = Math.PI * 2;
    const SR = 24000;

    // 입력: 2초짜리 합성 음원
    let srcKey = '', input = null;
    function makeInput() {
      if (srcKey === P.src) return input;
      srcKey = P.src;
      const n = SR * 2, x = new Float32Array(n), noise = A.noiseBuffer(SR, 4);
      const mel = [45, 48, 52, 50, 47, 45];
      let ph = 0, kp = 0;
      for (let i = 0; i < n; i++) {
        const t = i / SR;
        if (P.src === 'voice') {
          const k = Math.min(5, Math.floor(t / 0.333)), tt = t - k * 0.333;
          ph = (ph + A.mtof(mel[k]) / SR) % 1;
          x[i] = (Math.sin(TAU * ph) + 0.6 * Math.sin(2 * TAU * ph) + 0.4 * Math.sin(3 * TAU * ph) + 0.25 * Math.sin(5 * TAU * ph)) * 0.22 * Math.min(1, tt * 60) * Math.min(1, (0.333 - tt) * 60 + 0.2);
        } else {
          const k = Math.floor(t / 0.25) % 8, tt = t - Math.floor(t / 0.25) * 0.25;
          if (k % 4 === 0) { kp = (kp + (50 + 120 * Math.exp(-tt * 30)) / SR) % 1; x[i] = Math.sin(TAU * kp) * Math.exp(-tt * 9) * 0.5; }
          else if (k % 4 === 2) x[i] = noise[i % SR] * Math.exp(-tt * 20) * 0.4;
          else x[i] = noise[i % SR] * Math.exp(-tt * 60) * 0.15;
        }
      }
      return (input = x);
    }

    // OLA / WSOLA. 결과: 출력 버퍼, 프레임 시작 위치, 이음매 상관도
    function stretch(x) {
      const N = Math.round(P.frame / 1000 * SR) & ~1, Hs = N / 2, Ha = Hs / P.ratio, tol = Math.round(P.tol / 1000 * SR);
      const outLen = Math.floor(x.length * P.ratio), y = new Float32Array(outLen + N), wsum = new Float32Array(outLen + N);
      const win = new Float32Array(N);
      for (let i = 0; i < N; i++) win[i] = 0.5 - 0.5 * Math.cos(TAU * i / N);
      const starts = [], seams = [];
      let prev = 0;
      const ov = N / 2;
      const ncc = (a, b) => { // a, b 시작 위치에서 ov 길이 정규화 상호 상관 (3칸 건너뜀)
        let s = 0, ea = 0, eb = 0;
        for (let i = 0; i < ov; i += 3) { const u = x[a + i] || 0, v = x[b + i] || 0; s += u * v; ea += u * u; eb += v * v; }
        return s / Math.sqrt(Math.max(1e-12, ea * eb));
      };
      for (let m = 0; m * Hs < outLen; m++) {
        let p = Math.round(m * Ha);
        if (m > 0 && P.method === 'wsola') {
          const target = prev + Hs; // 앞 프레임이 자연스럽게 이어질 위치
          let best = -2, bp = p;
          for (let d = -tol; d <= tol; d++) {
            const q = p + d;
            if (q < 0 || q + N > x.length) continue;
            const c = ncc(target, q);
            if (c > best) { best = c; bp = q; }
          }
          p = bp;
        }
        p = U.clamp(p, 0, x.length - N);
        if (m > 0) seams.push(ncc(prev + Hs, p));
        starts.push(p);
        const o = m * Hs;
        for (let i = 0; i < N; i++) { y[o + i] += x[p + i] * win[i]; wsum[o + i] += win[i]; }
        prev = p;
      }
      for (let i = 0; i < outLen; i++) y[i] = wsum[i] > 0.1 ? y[i] / wsum[i] : y[i];
      return { y: y.subarray(0, outLen), starts, seams, N, Hs, Ha };
    }

    let key = '', res = null, mean = 0, bad = 0, disp = null;
    function analyze() {
      const k = [P.method, P.ratio, P.frame, P.tol, P.src].join();
      if (k === key) return;
      key = k;
      res = stretch(makeInput());
      // 전체 파형 그리기용: 1024칸의 최대, 최소
      const y = res.y;
      disp = new Float32Array(2048);
      for (let c = 0; c < 1024; c++) {
        const i0 = Math.floor(c * y.length / 1024), i1 = Math.max(i0 + 1, Math.floor((c + 1) * y.length / 1024));
        let lo = 0, hi = 0;
        for (let i = i0; i < i1; i++) { const v = y[i] || 0; if (v < lo) lo = v; if (v > hi) hi = v; }
        disp[2 * c] = hi; disp[2 * c + 1] = lo;
      }
      mean = res.seams.reduce((a, b) => a + b, 0) / Math.max(1, res.seams.length);
      bad = res.seams.filter((c) => c < 0.5).length;
    }

    let live = null;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        analyze();
        if (!live) live = { pos: 0 };
        const y = res.y, step = SR / sr;
        for (let i = 0; i < n; i++) {
          const p = live.pos, i0 = Math.floor(p), fr = p - i0;
          const v = ((y[i0] || 0) + ((y[i0 + 1] || 0) - (y[i0] || 0)) * fr) * 0.9;
          l[i] = v; r[i] = v;
          live.pos += step; if (live.pos >= y.length + SR * 0.3) live.pos = 0;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2;
        const h1 = (H - pad * 4) * 0.3, h2 = (H - pad * 4) * 0.36, h3 = H - pad * 4 - h1 - h2;
        // 전체 출력과 프레임 위치
        A.drawWave(g, disp, pad, pad, w, h1, { color: col, amp: 1.4, label: GTL.L(`출력 전체 (${(res.y.length / SR).toFixed(2)}초, 입력 2초)`, `Whole output (${(res.y.length / SR).toFixed(2)} s, input 2 s)`) });
        if (live && snd.on) { const px = pad + w * Math.min(1, live.pos / res.y.length); D.line(g, px, pad, px, pad + h1, C.warn, 1); }
        // 확대 출력 (가운데 60ms)
        const y2 = pad * 2 + h1, zc = Math.round(0.06 * SR), z0 = Math.floor(res.y.length * 0.17);
        A.drawWave(g, res.y, pad, y2, w, h2, { from: z0, count: zc, color: col, amp: 1.5, label: GTL.L('확대 출력 60ms (세로선 = 프레임 경계)', 'Zoomed output 60 ms (lines = frame starts)') });
        for (let m = 0; m < res.starts.length; m++) {
          const o = m * res.Hs;
          if (o < z0 || o > z0 + zc) continue;
          const px = pad + w * (o - z0) / zc;
          D.line(g, px, y2 + 14, px, y2 + h2, 'rgba(255,255,255,0.25)', 1);
        }
        // 이음매 상관도 막대
        const y3 = pad * 3 + h1 + h2, mid = y3 + h3 / 2;
        D.rect(g, pad, y3, w, h3, 'rgba(0,0,0,0.35)');
        D.line(g, pad, mid, pad + w, mid, C.grid, 1);
        const s = res.seams, bw = w / Math.max(1, s.length);
        for (let i = 0; i < s.length; i++) {
          const v = U.clamp(s[i], -1, 1), hh = v * (h3 / 2 - 4);
          D.rect(g, pad + i * bw, v >= 0 ? mid - hh : mid, Math.max(1, bw - 1), Math.abs(hh), v < 0.5 ? C.bad : col);
        }
        D.text(g, GTL.L('이음매 상관도 (프레임마다, 위 = +1, 아래 = -1, 빨강 < 0.5)', 'Seam correlation (per frame, top = +1, bottom = -1, red < 0.5)'), pad + 4, y3 + 3, { size: 10, color: C.dim });
        ctx.stat(GTL.L('평균 이음매 상관도', 'Mean seam correlation'), mean.toFixed(2));
        ctx.stat(GTL.L('나쁜 이음매 (< 0.5)', 'Bad seams (< 0.5)'), `${bad} / ${s.length}`);
        ctx.stat(GTL.L('간격 Ha, Hs', 'Hop Ha, Hs'), `${res.Ha.toFixed(0)}, ${res.Hs} ${GTL.L('샘플', 'samples')}`);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') { snd.toggle(); live = { pos: 0 }; } },
      dispose() { snd.stop(); },
    };
  },
});
