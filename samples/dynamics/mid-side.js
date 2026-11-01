// 미드/사이드 처리: L, R을 합(M)과 차(S)로 바꿔 S만 키우거나 줄이면 스테레오 폭이 바뀜
GTL.register({
  id: 'mid-side',
  title: '미드/사이드 처리 (스테레오 폭)',
  summary: '스테레오 신호를 가운데 성분(Mid = L + R)과 양옆 성분(Side = L - R)으로 나누면 폭을 따로 조절할 수 있음. A는 원래 폭(100%). B는 사이드를 키워(170%) 소리가 넓어지지만 L과 R의 상관도가 내려가 모노로 합치면 넓힌 부분이 사라짐.',
  views: { a: '원래 폭 (100%)', b: '넓힘 (170%)' },
  controls: '파라미터 표에서 폭과 사이드 저역 차단을 바꿈. 소리는 헤드폰으로 들으면 차이가 잘 들림.',
  info: `
    <p><b>미드/사이드(M/S)</b>는 스테레오를 L, R 대신 M, S 두 성분으로 나타내는 방법. M = (L + R) / 2, S = (L - R) / 2. 되돌릴 때는 L = M + S, R = M - S.</p>
    <ul>
      <li>가운데에 있는 보컬, 베이스, 킥은 L과 R이 같아서 M에만 있음</li>
      <li>좌우로 벌어진 패드, 잔향, 더블링 기타는 S에 많음</li>
      <li><b>폭(Width)</b>: S에 곱하는 값. 0%면 모노, 100%면 원래대로, 100% 위는 넓힘.</li>
      <li><b>사이드 저역 차단</b>: S에 하이패스 필터를 걸어 저음을 모노로 만듦. 클럽 스피커, 바이닐 커팅에서 저음 위상 문제를 막음.</li>
    </ul>
    <p>단점: 폭을 너무 키우면 L과 R의 위상이 반대인 성분이 커짐. 모노 스피커(휴대폰, 매장 스피커)로 합치면 S는 사라지므로 넓게 들리던 소리가 작아지거나 빠짐.</p>
    <p>왼쪽 원은 <b>고니오미터(Goniometer)</b>. 세로축이 M, 가로축이 S. 모노 소리는 세로선, 넓은 소리는 옆으로 퍼진 모양. 아래 막대는 <b>상관도 미터</b>(+1 = 모노, 0 = 서로 무관, -1 = 위상 반대).</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect x="10" y="30" width="40" height="26" class="f-dim"/><text x="30" y="47" text-anchor="middle">L</text>
    <rect x="10" y="100" width="40" height="26" class="f-dim"/><text x="30" y="117" text-anchor="middle">R</text>
    <rect x="100" y="30" width="110" height="26" class="f-dim"/><text x="155" y="47" text-anchor="middle" class="t-small">M = (L + R) / 2</text>
    <rect x="100" y="100" width="110" height="26" class="f-dim"/><text x="155" y="117" text-anchor="middle" class="t-small">S = (L - R) / 2</text>
    <path d="M50,43 L98,43" class="d-accent" marker-end="url(#arr)"/><path d="M50,113 L98,113" class="d-accent" marker-end="url(#arr)"/>
    <path d="M50,43 L98,108" class="d-dim"/><path d="M50,113 L98,48" class="d-dim"/>
    <rect x="250" y="100" width="100" height="26" class="f-dim"/><text x="300" y="117" text-anchor="middle" class="t-small">${L('× 폭', '× width')}</text>
    <path d="M210,43 L378,43" class="d-accent" marker-end="url(#arr)"/><path d="M210,113 L248,113" class="d-accent" marker-end="url(#arr)"/><path d="M350,113 L378,113" class="d-accent" marker-end="url(#arr)"/>
    <rect x="380" y="30" width="110" height="26" class="f-dim"/><text x="435" y="47" text-anchor="middle" class="t-small">L = M + S</text>
    <rect x="380" y="100" width="110" height="26" class="f-dim"/><text x="435" y="117" text-anchor="middle" class="t-small">R = M - S</text>
    <text x="10" y="156" class="t-small t-dim">${L('모노로 합치면 L + R = 2M. S는 아무리 키워도 모노에서는 들리지 않음', 'Summed to mono, L + R = 2M. However much you raise S, it is gone in mono')}</text>
  </svg>`,
  look: [
    '고니오미터에서 A는 세로로 길쭉한 모양, B는 옆으로 퍼진 모양',
    '"상관도"가 A는 0.5 안팎, B는 0 근처. 폭을 200%로 올리면 음수가 되어 막대가 빨갛게 바뀜.',
    '"모노로 합칠 때 레벨 변화"가 B에서 더 크게 음수가 됨 (넓힌 부분이 모노에서 사라짐)',
    '폭을 0%로 내리면 고니오미터가 세로선 하나가 되고 상관도가 +1이 됨',
    '사이드 저역 차단을 150 Hz로 올리면 저음은 가운데에 모이고 패드의 폭은 유지됨',
  ],
  refs: [
    { type: 'paper', title: 'Blumlein, British Patent 394,325 "Improvements in and relating to Sound-transmission, Sound-recording and Sound-reproducing Systems"', year: 1931, note: '합과 차 신호로 스테레오를 다루는 방식의 기원' },
    { type: 'book', title: 'Bob Katz, Mastering Audio: The Art and the Science, 3rd ed.', year: 2015, note: '마스터링의 M/S 처리와 모노 호환' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed.', year: 2011, note: '스테레오 신호 처리' },
    { type: 'book', title: 'Mike Senior, Mixing Secrets for the Small Studio', year: 2011, note: '스테레오 폭, 상관도 미터, 모노 확인' },
  ],
  params: [
    { key: 'width', label: '폭 (%)', type: 'range', min: 0, max: 200, step: 1, default: 100, a: 100, b: 170, group: 'M/S' },
    { key: 'sideHp', label: '사이드 저역 차단 (Hz)', type: 'range', min: 0, max: 300, step: 5, default: 0, shared: true, help: '0 = 끔' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Mid/Side Processing (Stereo Width)',
    summary: 'Split a stereo signal into a center part (Mid = L + R) and a sides part (Side = L - R), and you can control the width on its own. A keeps the original width (100%). B raises the side (170%), so it sounds wider, but the correlation between L and R drops and the extra width disappears when summed to mono.',
    views: { a: 'Original width (100%)', b: 'Wider (170%)' },
    controls: 'Change the width and side low cut in the parameter table. Headphones make the difference easier to hear.',
    info: `
    <p><b>Mid/side (M/S)</b> describes stereo with two parts M and S instead of L and R. M = (L + R) / 2, S = (L - R) / 2. To go back, L = M + S and R = M - S.</p>
    <ul>
      <li>Vocals, bass and kick in the center are equal in L and R, so they are only in M.</li>
      <li>Wide pads, reverb and double tracked guitars are mostly in S.</li>
      <li><b>Width</b>: the value S is multiplied by. 0% is mono, 100% is unchanged, above 100% is wider.</li>
      <li><b>Side low cut</b>: a high pass filter on S that makes the lows mono. It prevents low end phase problems on club systems and in vinyl cutting.</li>
    </ul>
    <p>Downside: too much width raises the parts where L and R are out of phase. Mono speakers (phones, in-store speakers) drop S, so the sound that seemed wide gets quieter or disappears.</p>
    <p>The circle on the left is a <b>goniometer</b>. The vertical axis is M and the horizontal axis is S. Mono sound is a vertical line, wide sound spreads sideways. The bar below is a <b>correlation meter</b> (+1 = mono, 0 = unrelated, -1 = out of phase).</p>`,
    look: [
      'On the goniometer, A is a tall vertical shape. B spreads out to the sides.',
      '"Correlation" is about 0.5 in A and near 0 in B. Raise the width to 200% and it goes negative, and the bar turns red.',
      '"Level change when summed to mono" is more negative in B (the extra width disappears in mono).',
      'Lower the width to 0%. The goniometer becomes a single vertical line and correlation becomes +1.',
      'Raise the side low cut to 150 Hz. The bass gathers in the center, and the pad keeps its width.',
    ],
    refs: ['Origin of handling stereo with sum and difference signals.', 'M/S processing in mastering and mono compatibility.', 'Stereo signal processing.', 'Stereo width, correlation meters, mono checks.'],
    params: {
      width: { label: 'Width (%)', group: 'M/S' },
      sideHp: { label: 'Side low cut (Hz)', help: '0 = off' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 24000, LEN = 2;

    // 스테레오 소스: 가운데 베이스와 리드, 좌우로 벌린 패드 두 대, 좌우가 다른 잔향 잡음
    function makeSource(sr) {
      const n = Math.round(LEN * sr), L = new Float32Array(n), R = new Float32Array(n);
      const nl = A.noiseBuffer(n, 5, 'pink'), nr = A.noiseBuffer(n, 6, 'pink');
      const lpL = A.biquad('lowpass', 1600, 0.7, 0, sr), lpR = A.biquad('lowpass', 1600, 0.7, 0, sr), lpLead = A.biquad('lowpass', 2500, 0.7, 0, sr);
      const pad = [57, 60, 64], lead = [69, 72, 71, 67];
      for (let i = 0; i < n; i++) {
        const t = i / sr;
        let pl = 0, pr = 0;
        for (const m of pad) { const f = A.mtof(m); pl += 2 * ((f * 0.996 * t) % 1) - 1; pr += 2 * ((f * 1.004 * t + 0.37) % 1) - 1; }
        const bass = 0.12 * Math.sin(2 * Math.PI * 55 * t);
        const tl = t % 0.5, fl = A.mtof(lead[Math.floor(t / 0.5) % 4]);
        const ld = lpLead.process((2 * ((fl * t) % 1) - 1)) * 0.12 * Math.exp(-tl * 3);
        const c = bass + ld;
        L[i] = c + lpL.process(pl) * 0.1 + nl[i] * 0.02;
        R[i] = c + lpR.process(pr) * 0.1 + nr[i] * 0.02;
      }
      return { L, R, n };
    }
    function newSt(sr) { const hp = P.sideHp > 0; return { hz: P.sideHp, hp1: hp ? A.biquad('highpass', P.sideHp, 0.7071, 0, sr) : null, hp2: hp ? A.biquad('highpass', P.sideHp, 0.7071, 0, sr) : null }; }
    // 한 샘플 M/S 처리. 반환 [L, R]
    function step(st, l, r, w, out) {
      const m = (l + r) / 2;
      let s = (l - r) / 2;
      if (st.hp1) s = st.hp2.process(st.hp1.process(s));
      s *= w;
      out[0] = m + s; out[1] = m - s;
    }

    const S = makeSource(SR), N = S.n;
    let key = '', oL, oR, stats;
    function analyze() {
      const k = P.width + ',' + P.sideHp;
      if (k === key) return;
      key = k;
      const st = newSt(SR), o = [0, 0], w = P.width / 100;
      oL = new Float32Array(N); oR = new Float32Array(N);
      let lr = 0, ll = 0, rr = 0, mm = 0, ss = 0;
      for (let i = 0; i < N; i++) {
        step(st, S.L[i], S.R[i], w, o); oL[i] = o[0]; oR[i] = o[1];
        lr += o[0] * o[1]; ll += o[0] * o[0]; rr += o[1] * o[1];
        const m = (o[0] + o[1]) / 2, s = (o[0] - o[1]) / 2; mm += m * m; ss += s * s;
      }
      // 모노 합 (L + R) / 2의 전력 vs 스테레오 평균 전력
      stats = { corr: lr / Math.sqrt(Math.max(1e-20, ll * rr)), sm: 10 * Math.log10(Math.max(1e-20, ss) / Math.max(1e-20, mm)), mono: 10 * Math.log10(Math.max(1e-20, mm) / Math.max(1e-20, (ll + rr) / 2)), peak: A.linToDb(Math.max(A.peak(oL), A.peak(oR))) };
    }

    let live = null, liveSrc = null, liveSr = 0, pos = 0;
    const o2 = [0, 0];
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (sr !== liveSr) { liveSrc = makeSource(sr); liveSr = sr; pos = 0; live = null; }
        if (!live || live.hz !== P.sideHp) live = newSt(sr);
        const w = P.width / 100;
        for (let i = 0; i < n; i++) {
          step(live, liveSrc.L[pos], liveSrc.R[pos], w, o2);
          pos = (pos + 1) % liveSrc.n;
          l[i] = o2[0] * 1.2; r[i] = o2[1] * 1.2;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        // 고니오미터 (세로 = M, 가로 = S)
        const size = Math.min(H - pad * 2 - 40, W * 0.55), cx = pad + size / 2, cy = pad + size / 2, rad = size / 2;
        D.circle(g, cx, cy, rad, 'rgba(0,0,0,0.35)', C.grid);
        D.line(g, cx, cy - rad, cx, cy + rad, C.grid); D.line(g, cx - rad, cy, cx + rad, cy, C.grid);
        D.line(g, cx - rad * 0.707, cy - rad * 0.707, cx + rad * 0.707, cy + rad * 0.707, C.grid);
        D.line(g, cx + rad * 0.707, cy - rad * 0.707, cx - rad * 0.707, cy + rad * 0.707, C.grid);
        D.text(g, 'M', cx + 3, cy - rad + 2, { size: 10, color: C.dim }); D.text(g, 'S', cx + rad - 10, cy + 2, { size: 10, color: C.dim });
        D.text(g, 'L', cx - rad * 0.707 - 10, cy - rad * 0.707 - 4, { size: 10, color: C.dim }); D.text(g, 'R', cx + rad * 0.707 + 4, cy - rad * 0.707 - 4, { size: 10, color: C.dim });
        const head = Math.floor(((snd.on && liveSrc ? pos / liveSrc.n : (ctx.time / LEN) % 1)) * N), cnt = 1200, sc = rad * 1.4;
        g.fillStyle = col;
        for (let j = 0; j < cnt; j += 1) {
          const i = (head + j) % N, l = oL[i], r = oR[i];
          const x = cx + (r - l) * 0.707 * sc, y = cy - (l + r) * 0.707 * sc;
          g.fillRect(x, y, 1.5, 1.5);
        }
        // 상관도 미터
        const by = pad + size + 14, bw = size, bx = pad;
        D.rect(g, bx, by, bw, 12, 'rgba(0,0,0,0.4)');
        D.line(g, bx + bw / 2, by - 2, bx + bw / 2, by + 14, C.dim);
        const cxp = bx + (stats.corr + 1) / 2 * bw;
        D.rect(g, Math.min(cxp, bx + bw / 2), by + 2, Math.abs(cxp - (bx + bw / 2)), 8, stats.corr < 0 ? C.bad : col);
        D.text(g, '-1', bx, by + 14, { size: 9, color: C.dim }); D.text(g, '0', bx + bw / 2, by + 14, { size: 9, color: C.dim, align: 'center' }); D.text(g, '+1', bx + bw, by + 14, { size: 9, color: C.dim, align: 'right' });
        D.text(g, GTL.L('상관도', 'Correlation'), bx + 2, by - 13, { size: 9, color: C.dim });
        // M, S 레벨 막대
        const rx = pad + size + 24, rw = W - rx - pad;
        if (rw > 60) {
          D.text(g, GTL.L('S / M 에너지 비', 'S / M energy ratio'), rx, pad + 2, { size: 10, color: C.dim });
          const v = U.clamp((stats.sm + 30) / 36, 0, 1), bh = H - pad * 2 - 40;
          D.rect(g, rx, pad + 20, Math.min(30, rw / 3), bh, 'rgba(0,0,0,0.4)');
          D.rect(g, rx, pad + 20 + bh * (1 - v), Math.min(30, rw / 3), bh * v, col);
          D.text(g, stats.sm.toFixed(1) + ' dB', rx, pad + 24 + bh, { size: 10, color: C.text });
          D.text(g, GTL.L('(-30 ~ +6 dB)', '(-30 to +6 dB)'), rx, pad + 36 + bh, { size: 9, color: C.dim });
        }

        ctx.stat(GTL.L('상관도', 'Correlation'), stats.corr.toFixed(2));
        ctx.stat(GTL.L('S / M 에너지 비', 'S / M energy ratio'), stats.sm.toFixed(1) + ' dB');
        ctx.stat(GTL.L('모노로 합칠 때 레벨 변화', 'Level change when summed to mono'), stats.mono.toFixed(1) + ' dB');
        ctx.stat(GTL.L('출력 피크', 'Output peak'), stats.peak.toFixed(1) + ' dBFS');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
