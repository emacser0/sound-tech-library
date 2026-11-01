// AM vs 링 모듈레이션: 반송파에 (1 + m) 을 곱하면 반송파가 남고, m 을 그대로 곱하면 반송파가 사라지고 합과 차 주파수만 남음
GTL.register({
  id: 'am-ring-modulation',
  title: 'AM과 링 모듈레이션',
  summary: '두 신호를 곱하면 두 주파수의 합과 차가 생김. AM은 반송파가 남아 원래 음 높이가 들리고, 링 모듈레이션은 반송파가 사라져 합과 차 주파수만 남는 금속성 소리가 됨.',
  views: { a: 'AM (진폭 변조)', b: '링 모듈레이션' },
  controls: '파라미터 표에서 반송파와 변조파 주파수를 바꿈. "소리 켜기"를 누르면 소리 내는 뷰의 소리가 들림.',
  info: `
    <p>삼각함수의 곱셈 공식 <code>sin(a) sin(b) = [cos(a - b) - cos(a + b)] / 2</code> 때문에, 두 사인파를 곱하면 원래 주파수는 사라지고 합과 차 주파수(사이드밴드)가 생김</p>
    <ul>
      <li><b>링 모듈레이션(Ring Modulation)</b>: <code>c(t) x m(t)</code>. 변조파가 양수와 음수를 오가므로(바이폴라) 반송파가 남지 않음. 다이오드 4개를 고리 모양으로 연결한 회로에서 이름이 나옴.</li>
      <li><b>AM(Amplitude Modulation)</b>: <code>c(t) x (1 + d m(t))</code>. 변조파를 0 이상으로 올려(유니폴라) 곱하므로 반송파가 그대로 남고, 양옆에 d/2 크기의 사이드밴드가 붙음.</li>
    </ul>
    <p>변조 주파수가 20Hz보다 낮으면 사이드밴드가 너무 가까워 따로 들리지 않음. 대신 AM은 트레몰로, 링 모듈레이션은 위상이 뒤집히는 떨림으로 들림. 20Hz를 넘으면 새로운 음이 생김. 반송파와 변조파의 비율이 정수가 아니면 사이드밴드가 배음 관계를 벗어나 종이나 로봇 목소리처럼 들림.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
    <text x="135" y="16" text-anchor="middle" class="t-a">AM</text><text x="405" y="16" text-anchor="middle" class="t-b">${L('링 모듈레이션', 'Ring modulation')}</text>
    <line x1="20" y1="110" x2="250" y2="110" class="d-line"/><line x1="290" y1="110" x2="520" y2="110" class="d-line"/>
    <line x1="135" y1="110" x2="135" y2="35" class="d-a"/><line x1="95" y1="110" x2="95" y2="72" class="d-a"/><line x1="175" y1="110" x2="175" y2="72" class="d-a"/>
    <line x1="405" y1="110" x2="405" y2="40" class="d-dim" stroke-dasharray="3 3"/><line x1="365" y1="110" x2="365" y2="55" class="d-b"/><line x1="445" y1="110" x2="445" y2="55" class="d-b"/>
    <text x="135" y="126" text-anchor="middle" class="t-small">fc</text><text x="95" y="126" text-anchor="middle" class="t-small">fc-fm</text><text x="175" y="126" text-anchor="middle" class="t-small">fc+fm</text>
    <text x="405" y="126" text-anchor="middle" class="t-small t-dim">${L('fc 없음', 'no fc')}</text><text x="365" y="126" text-anchor="middle" class="t-small">fc-fm</text><text x="445" y="126" text-anchor="middle" class="t-small">fc+fm</text>
    <text x="135" y="144" text-anchor="middle" class="t-small t-dim">c x (1 + d m)</text><text x="405" y="144" text-anchor="middle" class="t-small t-dim">c x m</text>
  </svg>`,
  look: [
    '스펙트럼에서 A는 반송파 막대(가운데)가 가장 크고, B는 그 자리가 비어 있고 양옆 두 막대만 있음',
    '파형에서 A의 윤곽은 0 위로만 출렁이고, B는 윤곽이 0을 지나며 위상이 뒤집힘',
    '변조 주파수를 5Hz로 내리고 소리를 들으면 A는 트레몰로, B는 더 빠르게 떨리는 소리 (윤곽의 마루가 두 배)',
    '반송파 파형을 "배음 4개"로 바꾸면 배음마다 사이드밴드 쌍이 생기고, 링 모듈레이션의 소리가 종처럼 금속성으로 바뀜',
  ],
  refs: [
    { type: 'book', title: 'Miller Puckette, The Theory and Technique of Electronic Music', year: 2007, url: 'http://msp.ucsd.edu/techniques.htm', note: '5장 변조, 링 모듈레이션과 사이드밴드' },
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', year: 1996, note: 'AM, 링 모듈레이션' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed.', year: 2011, note: '변조 기반 이펙트' },
  ],
  params: [
    { key: 'mode', label: '변조 방식', type: 'select', options: [{ value: 'am', label: 'AM' }, { value: 'ring', label: '링 모듈레이션' }], a: 'am', b: 'ring', group: '변조' },
    { key: 'fc', label: '반송파 (Hz)', type: 'range', min: 100, max: 2000, step: 1, default: 440, shared: true },
    { key: 'fm', label: '변조파 (Hz)', type: 'range', min: 0.5, max: 1000, step: 0.5, default: 150, shared: true },
    { key: 'depth', label: 'AM 깊이 (d)', type: 'range', min: 0, max: 1, step: 0.01, default: 1, shared: true, when: (p) => p.mode === 'am' },
    { key: 'carrier', label: '반송파 파형', type: 'select', options: [{ value: 'sine', label: '사인파' }, { value: 'rich', label: '배음 4개' }], default: 'sine', shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'AM and Ring Modulation',
    summary: 'Multiplying two signals creates their sum and difference frequencies. AM keeps the carrier, so you still hear the original pitch. Ring modulation removes the carrier and leaves only sum and difference tones, which sound metallic.',
    views: { a: 'AM (amplitude modulation)', b: 'Ring modulation' },
    controls: 'Change the carrier and modulator frequencies in the parameter table. Press "Sound on" to hear the view that plays sound.',
    info: `
    <p>Because of the product identity <code>sin(a) sin(b) = [cos(a - b) - cos(a + b)] / 2</code>, multiplying two sine waves removes the original frequencies and creates the sum and difference frequencies (sidebands).</p>
    <ul>
      <li><b>Ring modulation</b>: <code>c(t) x m(t)</code>. The modulator goes positive and negative (bipolar), so the carrier does not remain. The name comes from a circuit of four diodes wired in a ring.</li>
      <li><b>AM (amplitude modulation)</b>: <code>c(t) x (1 + d m(t))</code>. The modulator is lifted above 0 (unipolar), so the carrier remains, with sidebands of size d/2 on each side.</li>
    </ul>
    <p>Below about 20 Hz the sidebands are too close to hear separately. AM then sounds like tremolo, and ring modulation sounds like a flutter with phase flips. Above 20 Hz you hear new tones. If the carrier and modulator are not in a whole number ratio, the sidebands are not harmonic, and the sound becomes bell-like or robotic.</p>`,
    look: [
      'In the spectrum, A\'s carrier bar (center) is the tallest. In B that spot is empty and only the two side bars remain.',
      'In the waveform, A\'s outline stays above 0. B\'s outline crosses 0 and the phase flips.',
      'Lower the modulator to 5 Hz and listen. A is a tremolo. B flutters twice as fast (twice as many peaks in the outline).',
      'Set the carrier waveform to "4 harmonics". Each harmonic gets its own sideband pair, and ring modulation sounds metallic like a bell.',
    ],
    refs: ['Chapter 5 on modulation, ring modulation and sidebands.', 'AM and ring modulation.', 'Modulation based effects.'],
    params: {
      mode: { label: 'Modulation type', group: 'Modulation', options: { ring: 'Ring modulation' } },
      fc: 'Carrier (Hz)', fm: 'Modulator (Hz)', depth: 'AM depth (d)',
      carrier: { label: 'Carrier waveform', options: { sine: 'Sine', rich: '4 harmonics' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L, TAU = Math.PI * 2;
    const col = ctx.side === 'a' ? C.a : C.b;
    const HARM = () => (P.carrier === 'rich' ? [1, 0.5, 0.33, 0.25] : [1]);
    const carrierAt = (ph) => { const h = HARM(); let s = 0; for (let k = 0; k < h.length; k++) s += h[k] * Math.sin(TAU * ph * (k + 1)); return s / (P.carrier === 'rich' ? 1.6 : 1); };
    const modEnv = (pm) => { const m = Math.sin(TAU * pm); return P.mode === 'ring' ? m : (1 + P.depth * m) / (1 + P.depth); };

    const live = { pc: 0, pm: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        for (let i = 0; i < n; i++) {
          const o = carrierAt(live.pc) * modEnv(live.pm) * 0.45;
          live.pc = (live.pc + P.fc / sr) % 1; live.pm = (live.pm + P.fm / sr) % 1;
          l[i] = o; r[i] = o;
        }
      },
    });

    // 이론 선 스펙트럼: 주파수 → 크기 (음수 주파수는 접음)
    function lines() {
      const out = new Map(), h = HARM(), sc = P.carrier === 'rich' ? 1 / 1.6 : 1;
      const add = (f, a) => { f = Math.abs(f); const k = Math.round(f * 10) / 10; out.set(k, (out.get(k) || 0) + a); };
      h.forEach((a0, k) => {
        const f = P.fc * (k + 1), a = a0 * sc;
        if (P.mode === 'ring') { add(f - P.fm, a / 2); add(f + P.fm, a / 2); }
        else { const nrm = 1 / (1 + P.depth); add(f, a * nrm); add(f - P.fm, a * P.depth / 2 * nrm); add(f + P.fm, a * P.depth / 2 * nrm); }
      });
      return [...out.entries()].filter(([, a]) => a > 1e-5);
    }

    let t0 = 0;
    return {
      update(dt) { snd.update(); t0 += dt * 0.05; },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        // 1) 파형: 변조파 2주기 (최대 80ms) 또는 반송파 12주기 중 긴 쪽
        const span = Math.min(0.08, Math.max(2 / P.fm, 12 / P.fc)), N = 1200, wave = new Float32Array(N), envU = new Float32Array(N);
        for (let i = 0; i < N; i++) {
          const t = t0 + i / (N - 1) * span;
          const e = modEnv((P.fm * t) % 1);
          wave[i] = carrierAt((P.fc * t) % 1) * e; envU[i] = e;
        }
        const wh = Math.max(60, (H - pad * 3) * 0.45);
        A.drawWave(g, wave, pad, pad, W - pad * 2, wh, { color: col, amp: 0.9, label: Lx(`파형 (${(span * 1000).toFixed(1)} ms, 점선 = 변조 윤곽)`, `Waveform (${(span * 1000).toFixed(1)} ms, dotted = modulation outline)`) });
        g.setLineDash([4, 3]);
        D.plot(g, envU, pad, pad, W - pad * 2, wh, { min: -1 / 0.9, max: 1 / 0.9, color: C.text, background: false, lineWidth: 1 });
        g.setLineDash([]);
        // 2) 선 스펙트럼 (선형 축)
        const sy = pad * 2 + wh, sh = H - sy - pad - 12, sw = W - pad * 2;
        const fmax = Math.max(500, (P.fc * HARM().length + P.fm) * 1.15);
        D.rect(g, pad, sy, sw, sh, 'rgba(0,0,0,0.35)');
        const fx = (f) => pad + f / fmax * sw;
        for (let k = 1; k <= HARM().length; k++) { g.setLineDash([3, 3]); D.line(g, fx(P.fc * k), sy, fx(P.fc * k), sy + sh, C.grid, 1); g.setLineDash([]); D.text(g, k === 1 ? 'fc' : k + 'fc', fx(P.fc * k), sy + sh + 2, { size: 9, color: C.dim, align: 'center' }); }
        const ls = lines();
        for (const [f, a] of ls) D.line(g, fx(f), sy + sh, fx(f), sy + sh - U.clamp(a / 0.6, 0, 1) * (sh - 16), col, 3);
        D.text(g, Lx('선 스펙트럼 (선형 크기)', 'Line spectrum (linear level)'), pad + 4, sy + 3, { size: 10, color: C.dim });
        D.text(g, `0 ~ ${fmax.toFixed(0)} Hz`, pad + sw - 4, sy + 3, { size: 9, color: C.dim, align: 'right' });
        const carrierLeft = P.mode === 'am' ? 1 / (1 + P.depth) : 0;
        ctx.stat(Lx('사이드밴드', 'Sidebands'), `${Math.abs(P.fc - P.fm).toFixed(1)} Hz, ${(P.fc + P.fm).toFixed(1)} Hz`);
        ctx.stat(Lx('반송파 크기', 'Carrier level'), carrierLeft > 0 ? A.linToDb(carrierLeft).toFixed(1) + ' dB' : Lx('없음', 'none'));
        ctx.stat(Lx('스펙트럼 선 수', 'Spectral lines'), ls.length);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
