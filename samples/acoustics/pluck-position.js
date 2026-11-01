// 퉁기는 위치와 배음: 현의 가운데를 퉁기면 짝수 배음이 사라지고, 브리지 근처를 퉁기면 밝아짐
GTL.register({
  id: 'pluck-position',
  title: '현을 퉁기는 위치와 배음',
  summary: '현을 길이의 1/k 지점에서 퉁기면 k의 배수 배음이 사라짐. 가운데를 퉁기면 짝수 배음이 없는 둥근 소리, 브리지 가까이 퉁기면 높은 배음이 많은 밝은 소리가 남.',
  views: { a: '가운데 (1/2 지점)', b: '브리지 근처 (12%)' },
  controls: '파라미터 표에서 퉁기는 위치를 바꿈. "다시 퉁기기" 버튼이나 자동 반복으로 현을 퉁김. "소리 켜기"를 누르면 소리 내는 뷰의 현 소리가 들림.',
  info: `
    <p>현을 손가락으로 당겼다 놓으면 처음 모양은 퉁긴 점이 꼭짓점인 삼각형. 이 삼각형을 현의 진동 모드(sin(nπx/L))로 나누면 n번째 배음의 크기는 <b>sin(nπβ) / n²</b> (β = 퉁긴 위치 / 현 길이).</p>
    <ul>
      <li>퉁긴 점이 n번째 모드의 마디에 있으면 sin(nπβ) = 0. 그 모드는 전혀 울리지 않음.</li>
      <li>β = 1/2 (가운데): 2, 4, 6...배음이 사라짐. 둥글고 속이 빈 소리.</li>
      <li>β = 1/5: 5, 10, 15...배음이 사라짐</li>
      <li>β가 작을수록(브리지 근처) 높은 배음이 많이 남아 밝고 날카로운 소리. 기타의 "폰티첼로" 주법.</li>
    </ul>
    <p>브리지가 몸통에 전하는 힘은 배음마다 n을 더 곱한 sin(nπβ)/n에 비례함. 이 샘플의 소리와 막대는 이 값을 씀. 높은 배음일수록 빨리 사라지게 모드마다 감쇠를 다르게 둠.</p>
    <p>디지털 현 모델(Karplus-Strong, 도파관)에서는 들뜸 신호를 위치 β만큼 지연시킨 자신과 빼는 콤 필터 1 - z^(-βN)로 같은 효과를 냄</p>`,
  diagram: (L) => {
    const x0 = 30, w = 220;
    const tri = (b, y) => `M${x0},${y} L${(x0 + b * w).toFixed(1)},${y - 30} L${x0 + w},${y}`;
    const bars = (b, y, cls) => { let s = ''; for (let n = 1; n <= 12; n++) { const a = Math.abs(Math.sin(n * Math.PI * b)) / n; const hh = a * 40; s += `<rect x="${300 + (n - 1) * 18}" y="${(y - hh).toFixed(1)}" width="12" height="${hh.toFixed(1)}" class="${cls}"/>`; s += `<text x="${306 + (n - 1) * 18}" y="${y + 12}" text-anchor="middle" class="t-small t-dim">${n}</text>`; } return s; };
    return `<svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg">
    <path d="${tri(0.5, 60)}" class="d-a"/><path d="${tri(0.12, 150)}" class="d-b"/>
    <circle cx="${x0 + 0.5 * w}" cy="30" r="3" class="f-accent"/><circle cx="${(x0 + 0.12 * w).toFixed(1)}" cy="120" r="3" class="f-accent"/>
    <text x="${x0 + w / 2}" y="78" text-anchor="middle" class="t-small t-a">${L('가운데를 퉁김 (β = 1/2)', 'plucked at the middle (β = 1/2)')}</text>
    <text x="${x0 + w / 2}" y="168" text-anchor="middle" class="t-small t-b">${L('브리지 근처를 퉁김 (β = 0.12)', 'plucked near the bridge (β = 0.12)')}</text>
    ${bars(0.5, 64, 'f-a')}${bars(0.12, 154, 'f-b')}
    <text x="300" y="16" class="t-small t-dim">${L('배음 크기 |sin(nπβ)| / n', 'harmonic level |sin(nπβ)| / n')}</text>
    <text x="300" y="98" class="t-small t-a">${L('짝수 배음 0', 'even harmonics = 0')}</text>
  </svg>`;
  },
  look: [
    '"소리 켜기"를 누르고 A와 B를 번갈아 들으면 A는 둥글고 B는 밝고 쨍한 소리',
    'A의 배음 막대에서 2, 4, 6번이 비어 있음. "사라진 배음" 측정값으로도 확인.',
    'B의 퉁기는 위치를 0.2로 바꾸면 5, 10, 15번 배음이 사라짐',
    '현 그림을 보면 처음 삼각형 모양이 두 갈래로 나뉘어 오가는 모습이 보임 (슬로모션)',
  ],
  refs: [
    { type: 'book', title: 'Neville H. Fletcher, Thomas D. Rossing, The Physics of Musical Instruments (2nd ed.)', year: 1998, note: '2장: 퉁긴 현의 모드 분해' },
    { type: 'book', title: 'Julius O. Smith III, Physical Audio Signal Processing', url: 'https://ccrma.stanford.edu/~jos/pasp/', note: '현 도파관 모델과 퉁기는 위치 콤 필터' },
    { type: 'paper', title: 'David A. Jaffe, Julius O. Smith, "Extensions of the Karplus-Strong Plucked-String Algorithm", Computer Music Journal 7(2)', year: 1983, note: '퉁기는 위치 효과를 포함한 확장' },
  ],
  params: [
    { key: 'pos', label: '퉁기는 위치 β (현 길이 비율)', type: 'range', min: 0.03, max: 0.5, step: 0.01, a: 0.5, b: 0.12, default: 0.5, group: '퉁기기' },
    { key: 'note', label: '음 높이 (MIDI)', type: 'int', min: 40, max: 64, default: 45, shared: true, group: '현', help: '45 = A2 (110Hz), 기타 5번 줄' },
    { key: 'decay', label: '울림 길이 (초)', type: 'range', min: 0.4, max: 4, step: 0.1, default: 2, shared: true, group: '현', help: '기본음이 1/e로 줄어드는 시간. 높은 배음은 더 빨리 줄어듦.' },
    { key: 'auto', label: '자동 반복 (1.6초마다)', type: 'bool', default: true, shared: true, group: '퉁기기' },
    { key: 'pluck', label: '다시 퉁기기', type: 'button', buttonLabel: '퉁기기', group: '퉁기기' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Pluck Position and Harmonics',
    summary: 'Pluck a string at 1/k of its length and every harmonic that is a multiple of k disappears. Plucking the middle gives a round sound with no even harmonics. Plucking near the bridge gives a bright sound with many high harmonics.',
    views: { a: 'Middle (1/2)', b: 'Near the bridge (12%)' },
    controls: 'Change the pluck position in the parameter table. Pluck with the "Pluck again" button or auto repeat. Press "Sound on" to hear the string in the selected view.',
    info: `
    <p>When you pull a string and let go, its starting shape is a triangle with its corner at the pluck point. Split this triangle into the string modes (sin(nπx/L)) and harmonic n has the size <b>sin(nπβ) / n²</b> (β = pluck point / string length).</p>
    <ul>
      <li>If the pluck point sits on a node of mode n, sin(nπβ) = 0. That mode does not ring at all.</li>
      <li>β = 1/2 (middle): harmonics 2, 4, 6... vanish. A round, hollow sound.</li>
      <li>β = 1/5: harmonics 5, 10, 15... vanish.</li>
      <li>Smaller β (near the bridge) keeps more high harmonics, so the sound is bright and sharp. This is the "ponticello" technique on guitar.</li>
    </ul>
    <p>The force the bridge passes to the body is n times larger per harmonic: sin(nπβ)/n. The sound and bars in this sample use this value. Each mode has its own decay so higher harmonics die out faster.</p>
    <p>Digital string models (Karplus-Strong, waveguides) get the same effect with a comb filter 1 - z^(-βN) that subtracts a copy of the excitation delayed by β.</p>`,
    look: [
      'Press "Sound on" and switch between A and B. A sounds round and B sounds bright and twangy.',
      'In A\'s harmonic bars, numbers 2, 4 and 6 are empty. The "Missing harmonics" stat shows the same.',
      'Change B\'s pluck position to 0.2. Harmonics 5, 10 and 15 disappear.',
      'Watch the string. The starting triangle splits into two corners that travel back and forth (slow motion).',
    ],
    refs: ['Chapter 2: mode decomposition of a plucked string.', 'String waveguide models and the pluck-position comb filter.', 'Extensions including the pluck-position effect.'],
    params: {
      pos: { label: 'Pluck position β (fraction of length)', group: 'Pluck' },
      note: { label: 'Pitch (MIDI)', group: 'String', help: '45 = A2 (110 Hz), guitar 5th string' },
      decay: { label: 'Ring time (s)', group: 'String', help: 'Time for the fundamental to fall to 1/e. Higher harmonics fall faster.' },
      auto: { label: 'Auto repeat (every 1.6 s)', group: 'Pluck' },
      pluck: { label: 'Pluck again', buttonLabel: 'Pluck', group: 'Pluck' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const NM = 40, FV = 0.35, VIS_PERIOD = 6, AUD_PERIOD = 1.6;
    let t = 0, tPluck = 0;

    const disp = (n) => (2 / (n * n * Math.PI * Math.PI * P.pos * (1 - P.pos))) * Math.sin(n * Math.PI * P.pos); // 변위 모드 크기
    const force = (n) => Math.sin(n * Math.PI * P.pos) / n;                                                    // 브리지 힘 (상대값)
    const tau = (n, f0) => P.decay / (1 + (n - 1) * f0 / 1200);

    // 소리: 감쇠 회전자 40개
    const re = new Float64Array(NM + 1), im = new Float64Array(NM + 1), cr = new Float64Array(NM + 1), ci = new Float64Array(NM + 1);
    const live = { time: 0, next: 0, key: '', norm: 1 };
    function pluckAudio(sr) {
      const f0 = A.mtof(P.note);
      let pk = 0;
      for (let i = 0; i < 256; i++) { let v = 0; for (let n = 1; n <= NM; n++) if (n * f0 < sr * 0.45) v += force(n) * Math.cos(U.TAU * n * i / 256); pk = Math.max(pk, Math.abs(v)); }
      live.norm = pk > 0 ? 0.45 / pk : 1;
      for (let n = 1; n <= NM; n++) {
        const ok = n * f0 < sr * 0.45, w = U.TAU * n * f0 / sr, d = Math.exp(-1 / (tau(n, f0) * sr));
        re[n] = ok ? force(n) : 0; im[n] = 0;
        cr[n] = Math.cos(w) * d; ci[n] = Math.sin(w) * d;
      }
    }
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        for (let i = 0; i < n; i++) {
          live.time += 1 / sr;
          if (live.trigger || (P.auto && live.time >= live.next)) { pluckAudio(sr); live.next = live.time + AUD_PERIOD; live.trigger = false; }
          let v = 0;
          for (let m = 1; m <= NM; m++) {
            const a = re[m], b = im[m];
            re[m] = a * cr[m] - b * ci[m]; im[m] = a * ci[m] + b * cr[m];
            v += re[m];
          }
          v *= live.norm; l[i] = v; r[i] = v;
        }
      },
    });

    return {
      update(dt) {
        t += dt;
        if (P.auto && t - tPluck > VIS_PERIOD) tPluck = t;
        snd.update();
      },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, f0 = A.mtof(P.note);
        // 현 (슬로모션)
        const sh = Math.max(70, H * 0.4), sx = pad + 10, sw = W - pad * 2 - 20, sy = pad + sh / 2 + 6;
        D.rect(g, pad, pad, W - pad * 2, sh, 'rgba(0,0,0,0.35)');
        D.line(g, sx, sy, sx + sw, sy, C.grid, 1);
        const te = t - tPluck, amp = sh * 0.38;
        g.beginPath();
        for (let i = 0; i <= 200; i++) {
          const x = i / 200;
          let y = 0;
          for (let n = 1; n <= NM; n++) y += disp(n) * Math.sin(n * Math.PI * x) * Math.cos(U.TAU * n * FV * te) * Math.exp(-te / (tau(n, f0) * 3));
          const px = sx + x * sw, py = sy - y * amp;
          i ? g.lineTo(px, py) : g.moveTo(px, py);
        }
        g.strokeStyle = col; g.lineWidth = 2.5; g.stroke();
        D.rect(g, sx - 4, sy - 14, 4, 28, C.text); D.rect(g, sx + sw, sy - 14, 4, 28, C.text);
        const pxp = sx + P.pos * sw;
        D.line(g, pxp, sy - amp - 4, pxp, sy - amp + 6, C.accent, 2);
        D.text(g, 'β', pxp + 4, sy - amp - 6, { size: 10, color: C.accent });
        D.text(g, Lx('브리지', 'Bridge'), sx, pad + sh - 12, { size: 9, color: C.dim });
        D.text(g, Lx('너트', 'Nut'), sx + sw - 20, pad + sh - 12, { size: 9, color: C.dim });
        D.text(g, Lx('현 모양 (슬로모션, 보라 = 퉁긴 위치)', 'String shape (slow motion, purple = pluck point)'), pad + 4, pad + 3, { size: 10, color: C.dim });

        // 배음 막대 (dB)
        const by = pad * 2 + sh, bh = H - by - pad, bw = W - pad * 2, NB = 24;
        D.rect(g, pad, by, bw, bh, 'rgba(0,0,0,0.35)');
        const cw = bw / NB, top = by + 16, span = bh - 32;
        for (let db = 0; db >= -48; db -= 12) { const y = top + (-db / 48) * span; D.line(g, pad, y, pad + bw, y, C.grid, 1); D.text(g, db + 'dB', pad + bw - 34, y - 10, { size: 9, color: C.dim }); }
        const missing = [];
        let num = 0, den = 0;
        for (let n = 1; n <= NM; n++) { const e = force(n) ** 2; num += e * n * f0; den += e; }
        for (let n = 1; n <= NB; n++) {
          const a = Math.abs(force(n)), db = A.linToDb(a), x = pad + (n - 1) * cw;
          const hh = U.clamp((db + 48) / 48, 0, 1) * span;
          if (hh > 0.5) D.rect(g, x + 2, top + span - hh, cw - 4, hh, col);
          else if (n <= 16) missing.push(n);
          if (hh <= 0.5) D.text(g, '×', x + cw / 2, top + span - 12, { size: 10, color: C.bad, align: 'center' });
          D.text(g, String(n), x + cw / 2, by + bh - 13, { size: 9, color: C.dim, align: 'center' });
        }
        D.text(g, Lx('배음 크기 |sin(nπβ)| / n (× = 사라진 배음)', 'Harmonic level |sin(nπβ)| / n (× = missing)'), pad + 4, by + 3, { size: 10, color: C.dim });

        ctx.stat(Lx('퉁기는 위치', 'Pluck point'), `β = ${P.pos.toFixed(2)} (${Lx('65cm 현에서', 'on a 65 cm string')} ${(P.pos * 65).toFixed(1)} cm)`);
        ctx.stat(Lx('사라진 배음 (16번까지)', 'Missing harmonics (up to 16)'), missing.length ? missing.join(', ') : Lx('없음', 'None'));
        ctx.stat(Lx('스펙트럼 중심 (밝기)', 'Spectral centroid (brightness)'), (num / den).toFixed(0) + ' Hz');
        snd.stat();
      },
      onAction(k) {
        if (k === 'sound') snd.toggle();
        if (k === 'pluck') { tPluck = t; live.trigger = true; }
      },
      dispose() { snd.stop(); },
    };
  },
});
