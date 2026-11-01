// DC 오프셋과 DC 차단 필터: 파형 중심이 0에서 벗어나면 헤드룸이 줄고, 편집점과 뮤트에서 '퍽' 소리가 남
GTL.register({
  id: 'dc-offset',
  title: 'DC 오프셋과 DC 차단 필터',
  summary: '파형의 중심이 0에서 벗어난 신호(DC 오프셋)를 그대로 쓸 때와 DC 차단 필터를 거칠 때를 비교. DC가 남으면 소리를 켜고 끌 때마다 퍽 소리가 나고 헤드룸이 줄어듦.',
  views: { a: 'DC 그대로', b: 'DC 차단 필터' },
  controls: '파라미터 표에서 DC 크기와 필터 극점을 바꿈',
  info: `
    <p><b>DC 오프셋</b>은 파형 전체가 위나 아래로 치우쳐 평균이 0이 아닌 상태. 0 Hz 성분이라 귀에는 안 들림. 원인은 ADC, 아날로그 회로의 치우침, 비대칭 왜곡(웨이브셰이퍼), 잘못 만든 합성 파형 등.</p>
    <p>들리지 않아도 문제를 일으킴:</p>
    <ul>
      <li><b>클릭, 퍽 소리</b>: 뮤트, 편집점, 게이트에서 신호가 0으로 끊기면 DC만큼 계단이 생김</li>
      <li><b>헤드룸 감소</b>: 한쪽 피크가 먼저 0 dBFS에 닿음. 컴프레서, 리미터도 치우친 레벨에 반응함.</li>
    </ul>
    <p><b>DC 차단 필터</b>는 차단 주파수가 아주 낮은 1차 하이패스. <code>y[n] = x[n] - x[n-1] + R y[n-1]</code>. 0 Hz에 영점, R에 극점이 있음. 차단 주파수는 약 <code>(1 - R) fs / 2π</code>. R이 1에 가까울수록 저음을 덜 건드리지만 DC가 사라지는 데 오래 걸림.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="80" x2="250" y2="80" class="d-dim"/>
    <line x1="20" y1="55" x2="250" y2="55" class="d-a" stroke-dasharray="4 3"/>
    <path d="M20,80 H60 V55 C70,25 80,25 90,55 S110,85 120,55 S140,25 150,55 S170,85 180,55 S200,25 210,55 V80 H250" class="d-a"/>
    <text x="60" y="110" text-anchor="middle" class="t-small t-a">${L('계단 = 퍽', 'step = thump')}</text>
    <text x="210" y="110" text-anchor="middle" class="t-small t-a">${L('계단 = 퍽', 'step = thump')}</text>
    <text x="135" y="20" text-anchor="middle" class="t-small">${L('DC가 있는 신호를 켜고 끔', 'Gating a signal with DC')}</text>
    <line x1="290" y1="80" x2="520" y2="80" class="d-dim"/>
    <path d="M290,80 H330 C340,50 350,50 360,80 S380,110 390,80 S410,50 420,80 S440,110 450,80 S470,50 480,80 H520" class="d-b"/>
    <text x="405" y="20" text-anchor="middle" class="t-small">${L('DC 차단 뒤에 켜고 끔', 'Gating after DC blocking')}</text>
    <text x="405" y="110" text-anchor="middle" class="t-small t-b">${L('0에서 시작하고 0에서 끝남', 'starts and ends at 0')}</text>
    <text x="270" y="140" text-anchor="middle" class="t-small t-dim t-mono">y[n] = x[n] - x[n-1] + R y[n-1]</text>
  </svg>`,
  look: [
    'A의 파형은 가운데 선 위로 치우쳐 있고 켜고 끄는 지점마다 계단이 보임. B는 0을 중심으로 대칭.',
    '"소리 켜기"로 A를 들으면 음이 켜지고 꺼질 때마다 퍽 소리가 남. B는 깨끗함.',
    'DC 크기를 0으로 내리면 A의 퍽 소리도 사라짐',
    'B의 극점 R을 0.99로 내리면 차단 주파수가 76 Hz로 올라가 응답 곡선이 오른쪽으로 이동',
  ],
  refs: [
    { type: 'article', title: 'Julius O. Smith III, "DC Blocker", Introduction to Digital Filters', url: 'https://ccrma.stanford.edu/~jos/filters/DC_Blocker.html', note: 'DC 차단 필터의 식과 응답' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed.', year: 2011, note: '비선형 처리 뒤의 DC 제거' },
    { type: 'book', title: 'Will Pirkle, Designing Audio Effect Plugins in C++, 2nd ed.', year: 2019, note: '1차 필터 구현' },
  ],
  params: [
    { key: 'block', label: 'DC 차단 필터', type: 'bool', a: false, b: true, default: false, group: '처리' },
    { key: 'R', label: '극점 R', type: 'range', min: 0.99, max: 0.9999, step: 0.0001, default: 0.998, shared: true, when: (p) => p.block, help: '1에 가까울수록 차단 주파수가 낮음' },
    { key: 'dc', label: 'DC 크기', type: 'range', min: -0.4, max: 0.4, step: 0.01, default: 0.25, shared: true, group: '신호' },
    { key: 'gate', label: '0.5초마다 켜고 끄기', type: 'bool', default: true, shared: true, help: '뮤트, 편집점, 게이트 흉내' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'DC Offset and the DC Blocker',
    summary: 'Compares a signal whose center is shifted away from 0 (DC offset) with the same signal after a DC blocking filter. With DC left in, every mute or cut makes a thump and the headroom shrinks.',
    views: { a: 'DC left in', b: 'DC blocker' },
    controls: 'Change the DC amount and filter pole in the parameter table.',
    info: `
    <p>A <b>DC offset</b> means the whole waveform is shifted up or down, so its average is not 0. It is a 0 Hz component, so you cannot hear it. Causes include ADC and analog circuit bias, asymmetric distortion (waveshapers), and badly built synth waveforms.</p>
    <p>Even though you cannot hear it, it causes problems:</p>
    <ul>
      <li><b>Clicks and thumps</b>: when the signal is cut to 0 at a mute, edit or gate, the DC leaves a step.</li>
      <li><b>Less headroom</b>: one side reaches 0 dBFS first. Compressors and limiters also react to the shifted level.</li>
    </ul>
    <p>A <b>DC blocker</b> is a 1st order highpass with a very low cutoff: <code>y[n] = x[n] - x[n-1] + R y[n-1]</code>. It has a zero at 0 Hz and a pole at R. The cutoff is about <code>(1 - R) fs / 2π</code>. R closer to 1 touches less bass, but the DC takes longer to die out.</p>`,
    look: [
      'A\'s waveform sits above the center line and shows a step at every on/off point. B is symmetric around 0.',
      'Press "Sound on" and listen to A. Each time the tone turns on or off you hear a thump. B is clean.',
      'Lower the DC amount to 0. A\'s thumps disappear too.',
      'Lower B\'s pole R to 0.99. The cutoff rises to 76 Hz and the response curve moves right.',
    ],
    refs: ['DC blocker formula and response.', 'Removing DC after nonlinear processing.', 'Implementing 1st order filters.'],
    params: {
      block: { label: 'DC blocker', group: 'Processing' },
      R: { label: 'Pole R', help: 'Closer to 1 means a lower cutoff' },
      dc: { label: 'DC amount', group: 'Signal' },
      gate: { label: 'Toggle every 0.5 s', help: 'Imitates mutes, edits and gates' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, TAU = Math.PI * 2, F0 = 220;

    // 상태를 가진 처리기. step(sr)이 출력 샘플 1개
    function chain() {
      const st = { ph: 0, t: 0, x1: 0, y1: 0, gSm: 0 };
      st.step = (sr) => {
        st.ph += F0 / sr; if (st.ph >= 1) st.ph -= 1;
        st.t += 1 / sr;
        let x = Math.sin(TAU * st.ph) * 0.35 + P.dc;
        if (P.block) { const y = x - st.x1 + P.R * st.y1; st.x1 = x; st.y1 = y; x = y; } else { st.x1 = x; st.y1 = 0; }
        const on = !P.gate || (Math.floor(st.t / 0.5) % 2 === 0) ? 1 : 0;
        st.gSm += (on - st.gSm) * (1 - Math.exp(-1 / (0.001 * sr))); // 1 ms 램프 (편집 페이드)
        return x * st.gSm;
      };
      return st;
    }
    const live = chain();
    const snd = A.player(ctx, {
      process(l, r, sr, n) { for (let i = 0; i < n; i++) { const v = live.step(sr) * 0.75; l[i] = v; r[i] = v; } },
    });

    const SHOW = Math.round(SR * 1.5);
    let key = '', buf = null, mean = 0, pkPos = 0, pkNeg = 0, step = 0;
    function analyze() {
      const k = [P.block, P.R, P.dc, P.gate].join('|');
      if (k === key) return;
      key = k;
      const st = chain(), pre = SR * 2; // 2초 동안 안정시킨 뒤 1.5초 기록
      for (let i = 0; i < pre; i++) st.step(SR);
      buf = new Float32Array(SHOW);
      let s = 0, cnt = 0; pkPos = 0; pkNeg = 0; step = 0;
      for (let i = 0; i < SHOW; i++) {
        const v = st.step(SR); buf[i] = v;
        if (st.gSm > 0.99) { s += v; cnt++; pkPos = Math.max(pkPos, v); pkNeg = Math.min(pkNeg, v); }
      }
      mean = cnt ? s / cnt : 0;
      // 켜고 끌 때 남는 계단 크기 = 꺼지기 직전 짧은 구간 평균의 절대값 (DC 성분)
      step = Math.abs(mean);
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2;
        const th = Math.max(60, H * 0.32), zh = Math.max(50, H * 0.26);
        A.drawWave(g, buf, pad, pad, w, th, { color: col, amp: 1.4, label: Lx('출력 파형 1.5초', 'Output waveform, 1.5 s') });
        const my = pad + th / 2 - U.clamp(mean * 1.4, -1, 1) * th / 2;
        g.setLineDash([4, 3]); D.line(g, pad, my, pad + w, my, C.warn, 1); g.setLineDash([]);
        D.text(g, Lx('평균', 'Mean'), pad + w - 30, my - 12, { size: 9, color: C.warn });
        // 꺼지는 지점 확대 (0.5 s 전후 20 ms)
        const zy = pad * 2 + th, z0 = Math.round(SR * 0.5) - Math.round(SR * 0.01);
        A.drawWave(g, buf, pad, zy, w, zh, { from: z0, count: Math.round(SR * 0.02), color: col, amp: 1.4, label: Lx('꺼지는 순간 확대 (20 ms)', 'Zoom on the cut (20 ms)') });
        // 필터 응답
        const ry = zy + zh + pad, rh = H - ry - pad;
        const resp = (f) => {
          if (!P.block) return 0;
          const wv = TAU * f / SR, nr = 1 - Math.cos(wv), ni = Math.sin(wv), dr = 1 - P.R * Math.cos(wv), di = P.R * Math.sin(wv);
          return 10 * Math.log10((nr * nr + ni * ni) / (dr * dr + di * di));
        };
        A.drawResponse(g, resp, pad, ry, w, rh, { fmin: 2, fmax: 2000, minDb: -36, maxDb: 6, color: col, label: Lx(P.block ? 'DC 차단 필터 응답 (2 Hz~2 kHz)' : '필터 없음 (0 Hz도 통과)', P.block ? 'DC blocker response (2 Hz to 2 kHz)' : 'No filter (0 Hz passes too)') });
        const fc = (1 - P.R) * SR / TAU;
        if (P.block) { const px = A.freqX(fc, pad, w, 2, 2000); g.setLineDash([3, 3]); D.line(g, px, ry, px, ry + rh, C.warn, 1); g.setLineDash([]); }

        ctx.stat(Lx('평균 (DC)', 'Mean (DC)'), mean.toFixed(3));
        ctx.stat(Lx('양/음 피크', 'Positive/negative peak'), `+${pkPos.toFixed(2)} / ${pkNeg.toFixed(2)}`);
        ctx.stat(Lx('편집점 계단 크기', 'Step at cut'), step.toFixed(3));
        if (P.block) ctx.stat(Lx('차단 주파수', 'Cutoff'), fc.toFixed(1) + ' Hz');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
