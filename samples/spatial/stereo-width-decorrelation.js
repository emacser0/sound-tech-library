// 모노 음원을 넓게 만들기: 하스 지연 트릭 vs 올패스 역상관 사이드 신호 (모노 호환)
GTL.register({
  id: 'stereo-width-decorrelation',
  title: '스테레오 넓히기와 역상관',
  summary: '모노 소리를 넓게 만드는 흔한 방법은 한쪽을 10~30ms 늦추는 하스 트릭. 넓게 들리지만 모노로 합치면 콤 필터로 음색이 망가짐. 올패스로 만든 역상관 신호를 사이드(S)에만 넣으면 넓으면서도 모노 합이 원음과 같음.',
  views: { a: '하스 지연 (12ms)', b: '올패스 역상관 (M/S)' },
  controls: '"모노로 듣기"를 켜면 L+R 합을 들음. 클럽, 휴대폰 스피커, 방송의 모노 재생을 흉내 냄.',
  info: `
    <p>두 채널이 같으면(상관 계수 +1) 소리는 가운데 한 점. 두 채널이 서로 달라질수록(상관이 0에 가까울수록) 소리가 넓게 퍼짐. 넓히기는 결국 <b>역상관(Decorrelation)</b>을 만드는 작업.</p>
    <ul>
      <li><b>하스 트릭</b>: <code>L = x, R = x(t - D)</code>. 쉽고 효과가 큼. 그러나 <code>L + R</code>에서 <code>1/(2D)</code>의 홀수 배 주파수가 상쇄되는 콤 필터가 생김. 선행음 효과 때문에 상이 먼저 나온 쪽으로 쏠림.</li>
      <li><b>M/S 역상관</b>: <code>L = x + w d, R = x - w d</code>. d는 x를 올패스 필터 사슬에 통과시킨 신호(크기는 같고 위상만 다름). 모노 합 <code>L + R = 2x</code>라서 원음 그대로.</li>
    </ul>
    <p>넓이 w와 상관 계수의 관계: d가 x와 무상관이면 <code>ρ = (1 - w²)/(1 + w²)</code>. w=1이면 0.</p>
    <p>단점: M/S 방식도 각 채널만 들으면 주파수마다 커지고 작아지는 색이 생김(두 채널이 서로 보완함). 올패스가 길면 트랜지언트가 번짐. 실제 플러그인은 대역별로 넓이를 다르게 두고, 저음은 모노로 둠.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="4" y="16" class="t-small t-a">${L('A 하스: 모노 합의 응답', 'A Haas: mono sum response')}</text>
    <path d="M10,40 Q30,40 40,90 Q50,40 70,40 Q90,40 100,90 Q110,40 130,40 Q150,40 160,90 Q170,40 190,40 Q210,40 220,90 Q230,40 250,40" class="d-a"/>
    <text x="10" y="110" class="t-small t-dim">${L('1/(2D)마다 깊은 골 (콤 필터)', 'deep notch every 1/(2D) (comb filter)')}</text>
    <text x="290" y="16" class="t-small t-b">${L('B M/S 역상관', 'B M/S decorrelation')}</text>
    <rect x="290" y="30" width="44" height="26" class="f-dim"/><text x="312" y="47" text-anchor="middle" class="t-small">x</text>
    <path d="M334,43 L360,43" class="d-accent" marker-end="url(#arr)"/>
    <rect x="362" y="30" width="80" height="26" class="f-dim"/><text x="402" y="47" text-anchor="middle" class="t-small">${L('올패스 사슬', 'allpass chain')}</text>
    <path d="M442,43 L466,43" class="d-accent" marker-end="url(#arr)"/>
    <text x="470" y="47" class="t-small">d × w</text>
    <text x="300" y="84" class="t-small t-mono">L = x + w d</text>
    <text x="300" y="102" class="t-small t-mono">R = x - w d</text>
    <text x="300" y="126" class="t-small t-mono">L + R = 2x</text>
    <text x="384" y="126" class="t-small t-b">${L('모노 합은 원음 그대로', 'mono sum equals the original')}</text>
    <line x1="10" y1="148" x2="530" y2="148" class="d-dim"/>
    <text x="10" y="164" class="t-small t-dim">${L('둘 다 상관 계수를 낮춰 넓게 들리게 함. 차이는 모노로 합쳤을 때 나타남', 'Both lower the correlation to sound wide. The difference shows when summed to mono')}</text>
  </svg>`,
  look: [
    '헤드폰으로 A와 B를 번갈아 들으면 둘 다 넓게 들림. A는 소리가 왼쪽으로 쏠림.',
    '"모노로 듣기"를 켜면 A는 속이 빈 듯한 금속성 소리로 바뀜. B는 원래 소리 그대로.',
    '아래 "모노 합 응답"에서 A는 골이 반복되고 B는 0dB로 평평함',
    'A의 지연을 1ms로 줄이면 첫 골이 500Hz로 올라가고 골 간격이 넓어짐. 넓은 느낌은 사라지고 소리가 한쪽으로 쏠림.',
    'B의 넓이를 1로 올리면 상관 계수가 0 가까이 내려가고 벡터스코프 모양이 원에 가까워짐',
  ],
  refs: [
    { type: 'paper', title: 'Gary S. Kendall, "The Decorrelation of Audio Signals and Its Impact on Spatial Imagery", Computer Music Journal 19(4)', year: 1995, note: '역상관 필터와 공간감' },
    { type: 'paper', title: 'M. R. Schroeder, "An Artificial Stereophonic Effect Obtained from a Single Audio Signal", Journal of the Audio Engineering Society 6(2)', year: 1958, note: '모노에서 유사 스테레오를 만드는 초기 연구' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects (2nd Edition), Wiley', year: 2011, note: '공간 효과와 M/S 처리' },
    { type: 'book', title: 'Bob Katz, Mastering Audio: The Art and the Science (3rd Edition), Focal Press', year: 2014, note: '모노 호환성과 M/S 마스터링' },
  ],
  params: [
    { key: 'method', label: '방식', type: 'select', options: [{ value: 'mono', label: '모노 (넓히기 없음)' }, { value: 'haas', label: '하스 지연' }, { value: 'msap', label: '올패스 역상관 (M/S)' }], a: 'haas', b: 'msap', group: '넓히기' },
    { key: 'delay', label: '하스 지연 (ms)', type: 'range', min: 0.5, max: 40, step: 0.5, default: 12, when: (p) => p.method === 'haas' },
    { key: 'width', label: '넓이 w', type: 'range', min: 0, max: 1, step: 0.01, default: 0.8, when: (p) => p.method === 'msap' },
    { key: 'monoSum', label: '모노로 듣기', type: 'bool', default: false, shared: true, group: '재생' },
    { key: 'src', label: '음원', type: 'select', options: [{ value: 'pluck', label: '기타풍 아르페지오' }, { value: 'noise', label: '노이즈 버스트' }], default: 'pluck', shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Stereo Widening and Decorrelation',
    summary: 'A common way to widen a mono sound is the Haas trick: delay one side by 10~30 ms. It sounds wide, but summed to mono a comb filter ruins the tone. Putting an allpass-decorrelated signal only in the side (S) channel sounds wide and keeps the mono sum equal to the original.',
    views: { a: 'Haas delay (12 ms)', b: 'Allpass decorrelation (M/S)' },
    controls: 'Turn on "Listen in mono" to hear L+R. This imitates mono playback in clubs, phone speakers and broadcast.',
    info: `
    <p>If both channels are the same (correlation +1), the sound is a single point in the middle. The more the channels differ (correlation closer to 0), the wider the sound. Widening is really about creating <b>decorrelation</b>.</p>
    <ul>
      <li><b>Haas trick</b>: <code>L = x, R = x(t - D)</code>. Easy and strong. But <code>L + R</code> gets a comb filter that cancels odd multiples of <code>1/(2D)</code>. Because of the precedence effect, the image also pulls toward the earlier side.</li>
      <li><b>M/S decorrelation</b>: <code>L = x + w d, R = x - w d</code>. d is x passed through a chain of allpass filters (same magnitude, different phase). The mono sum is <code>L + R = 2x</code>, exactly the original.</li>
    </ul>
    <p>Width w and correlation: if d is uncorrelated with x, <code>ρ = (1 - w²)/(1 + w²)</code>. With w=1 it is 0.</p>
    <p>Downsides: in the M/S method each channel on its own gets some coloration that goes up and down with frequency (the two channels complement each other). Long allpasses smear transients. Real plugins set the width per band and keep the bass in mono.</p>`,
    look: [
      'Switch between A and B on headphones. Both sound wide. A pulls to the left.',
      'Turn on "Listen in mono". A turns hollow and metallic. B sounds like the original.',
      'In the "mono sum response" at the bottom, A has repeating notches and B is flat at 0 dB.',
      'Lower A\'s delay to 1 ms. The first notch moves up to 500 Hz and the notches spread apart. The wide feeling goes away and the sound pulls to one side.',
      'Raise B\'s width to 1. The correlation drops close to 0 and the vectorscope shape becomes close to a circle.',
    ],
    refs: ['Decorrelation filters and spatial impression.', 'An early study on making pseudo-stereo from mono.', 'Spatial effects and M/S processing.', 'Mono compatibility and M/S mastering.'],
    params: {
      method: { label: 'Method', group: 'Widening', options: { mono: 'Mono (no widening)', haas: 'Haas delay', msap: 'Allpass decorrelation (M/S)' } },
      delay: 'Haas delay (ms)',
      width: 'Width w',
      monoSum: { label: 'Listen in mono', group: 'Playback' },
      src: { label: 'Source', options: { pluck: 'Guitar-like arpeggio', noise: 'Noise burst' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const AP_D = [142, 107, 379, 277], AP_G = 0.6;

    // 처리기 상태 (실시간과 분석에서 같은 코드 사용)
    function makeProc(sr) {
      const M = 4095;
      return { sr, M, dl: new Float32Array(M + 1), w: 0, ap: AP_D.map((d) => ({ d: Math.round(d * sr / 44100), buf: new Float32Array(2048), i: 0 })), sd: 0 };
    }
    // 한 샘플 처리 → [L, R]
    function proc(s, x, out) {
      s.dl[s.w] = x;
      if (P.method === 'mono') { out[0] = x; out[1] = x; }
      else if (P.method === 'haas') {
        const target = U.clamp(P.delay / 1000 * s.sr, 0, s.M - 2);
        s.sd += (target - s.sd) * 0.002;
        const p = s.w - s.sd, i0 = Math.floor(p), fr = p - i0, y = s.dl[i0 & s.M] * (1 - fr) + s.dl[(i0 + 1) & s.M] * fr;
        out[0] = x; out[1] = y;
      } else {
        let d = x;
        for (const a of s.ap) { // Schroeder 올패스: y = -g x + x[n-D] + g y[n-D]
          const j = (a.i - a.d) & 2047, del = a.buf[j];
          const v = d + AP_G * del; a.buf[a.i] = v; a.i = (a.i + 1) & 2047;
          d = del - AP_G * v;
        }
        out[0] = x + P.width * d; out[1] = x - P.width * d;
      }
      s.w = (s.w + 1) & s.M;
    }

    // 분석: 백색 잡음을 통과시켜 상관 계수와 벡터스코프 점 계산
    const N = 8192, white = A.noiseBuffer(N, 4);
    let key = '', scope = null, corr = 1;
    function analyze() {
      const k = P.method + P.delay + P.width;
      if (k === key) return;
      key = k;
      const s = makeProc(48000), o = [0, 0];
      if (P.method === 'haas') s.sd = P.delay / 1000 * 48000;
      const Ls = new Float32Array(N), Rs = new Float32Array(N);
      for (let i = 0; i < N; i++) { proc(s, white[i] * 0.5, o); Ls[i] = o[0]; Rs[i] = o[1]; }
      let sl = 0, sr = 0, slr = 0;
      for (let i = 2048; i < N; i++) { sl += Ls[i] * Ls[i]; sr += Rs[i] * Rs[i]; slr += Ls[i] * Rs[i]; }
      corr = slr / Math.sqrt(Math.max(1e-12, sl * sr));
      scope = { Ls, Rs };
    }

    // 실시간 소리
    const noise = A.noiseBuffer(1 << 16, 8);
    const CHORD = [52, 59, 64, 67, 71, 76];
    let tS = 0, live = null;
    const phs = new Float64Array(CHORD.length);
    function source(sr) {
      const t = tS; tS += 1 / sr;
      if (P.src === 'noise') { const tt = t % 0.6; return tt > 0.4 ? 0 : noise[Math.floor(t * sr) & 0xffff] * Math.min(1, tt / 0.005, (0.4 - tt) / 0.05) * 0.4; }
      let v = 0;
      for (let j = 0; j < CHORD.length; j++) {
        const tt = (t - j * 0.12) % 1.6;
        if (tt < 0) continue;
        phs[j] += A.mtof(CHORD[j]) / sr; if (phs[j] >= 1) phs[j] -= 1;
        v += A.wave.triangle(phs[j]) * Math.exp(-tt / 0.5) * Math.min(1, tt / 0.003) + (2 * phs[j] - 1) * Math.exp(-tt / 0.06) * 0.3;
      }
      return v * 0.145;
    }
    const out = [0, 0];
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (!live || live.sr !== sr) live = makeProc(sr);
        for (let i = 0; i < n; i++) {
          proc(live, source(sr), out);
          if (P.monoSum) { const m = (out[0] + out[1]) * 0.5; l[i] = m; r[i] = m; } else { l[i] = out[0]; r[i] = out[1]; }
        }
      },
    });

    // 모노 합 응답 (dB): (L+R)/2
    function monoResp(f) {
      if (P.method === 'haas') { const w = 2 * Math.PI * f * P.delay / 1000; return A.linToDb(Math.abs(Math.cos(w / 2))); }
      return 0;
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        // 위 왼쪽: 벡터스코프
        const topH = Math.max(120, H * 0.52), sz = Math.min(topH, W * 0.5 - pad * 2);
        const sx = pad, sy = pad, cx = sx + sz / 2, cy = sy + sz / 2;
        D.rect(g, sx, sy, sz, sz, 'rgba(0,0,0,0.35)');
        D.line(g, cx, sy, cx, sy + sz, C.grid, 1); D.line(g, sx, cy, sx + sz, cy, C.grid, 1);
        D.line(g, sx, sy, sx + sz, sy + sz, C.grid, 1); D.line(g, sx + sz, sy, sx, sy + sz, C.grid, 1);
        g.fillStyle = col; g.globalAlpha = 0.35;
        const sc = sz * 0.42;
        for (let i = 2048; i < N; i += 3) {
          const Lv = scope.Ls[i], Rv = scope.Rs[i], m = (Lv + Rv) * Math.SQRT1_2, s = (Rv - Lv) * Math.SQRT1_2;
          g.fillRect(cx + U.clamp(s * sc * 1.4, -sz / 2, sz / 2), cy - U.clamp(m * sc * 1.4, -sz / 2, sz / 2), 1.5, 1.5);
        }
        g.globalAlpha = 1;
        D.text(g, Lg('벡터스코프 (세로 = M, 가로 = S)', 'Vectorscope (up = M, side = S)'), sx + 4, sy + 3, { size: 10, color: C.dim });
        // 위 오른쪽: 상관 계수 미터
        const mx = sx + sz + 20, mw = W - mx - pad, my = sy + 10;
        D.text(g, Lg('상관 계수', 'Correlation'), mx, my, { size: 11, color: C.dim });
        const bx = mx, by = my + 20, bw = Math.max(40, mw), bh = 16;
        D.rect(g, bx, by, bw, bh, 'rgba(0,0,0,0.4)');
        D.line(g, bx + bw / 2, by - 3, bx + bw / 2, by + bh + 3, C.dim, 1);
        const cxp = bx + bw * (corr + 1) / 2;
        D.rect(g, Math.min(bx + bw / 2, cxp), by + 2, Math.abs(cxp - (bx + bw / 2)), bh - 4, corr < 0 ? C.bad : col);
        D.text(g, '-1', bx, by + bh + 4, { size: 9, color: C.dim }); D.text(g, '0', bx + bw / 2, by + bh + 4, { size: 9, color: C.dim, align: 'center' }); D.text(g, '+1', bx + bw, by + bh + 4, { size: 9, color: C.dim, align: 'right' });
        D.text(g, corr.toFixed(2), bx + bw / 2, by + bh + 18, { size: 16, color: C.text, align: 'center' });
        if (P.method === 'msap') D.text(g, Lg(`이론값 ${((1 - P.width ** 2) / (1 + P.width ** 2)).toFixed(2)}`, `theory ${((1 - P.width ** 2) / (1 + P.width ** 2)).toFixed(2)}`), bx + bw / 2, by + bh + 40, { size: 10, color: C.dim, align: 'center' });
        // 아래: 모노 합 응답
        const ry = sy + Math.max(sz, 110) + 10, rh = H - ry - pad;
        if (rh > 40) A.drawResponse(g, monoResp, pad, ry, W - pad * 2, rh, { fmin: 20, fmax: 20000, minDb: -36, maxDb: 6, dbStep: 12, color: col, label: Lg('모노 합 응답 (L+R)/2', 'Mono sum response (L+R)/2') });
        ctx.stat(Lg('상관 계수', 'Correlation'), corr.toFixed(2));
        if (P.method === 'haas') ctx.stat(Lg('모노 합 첫 골', 'First mono notch'), `${(1000 / (2 * P.delay)).toFixed(0)} Hz`);
        else ctx.stat(Lg('모노 합 골', 'Mono notches'), Lg('없음', 'None'));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
