// 청각 흐름 분리 (van Noorden): ABA- 음열이 음 간격과 빠르기에 따라 한 흐름(갤럽) 또는 두 흐름으로 들림
GTL.register({
  id: 'auditory-streaming',
  title: '청각 흐름 분리 (ABA 갤럽)',
  summary: '높이가 다른 두 음을 A B A 쉼으로 반복하면, 음 간격이 좁을 때는 말발굽 같은 한 흐름으로, 넓고 빠를 때는 높은 음 줄기와 낮은 음 줄기 두 흐름으로 갈라져 들림. A는 2반음이라 한 흐름, B는 11반음이라 두 흐름.',
  views: { a: '2반음 (한 흐름)', b: '11반음 (두 흐름)' },
  controls: '파라미터 표에서 음 간격과 빠르기를 바꿈. "소리 켜기"를 누르면 ABA 음열이 반복됨.',
  info: `
    <p>귀는 들어온 소리를 "누가 내는 소리인지"에 따라 여러 <b>흐름(Stream)</b>으로 묶음. Bregman은 이것을 <b>청각 장면 분석(Auditory scene analysis)</b>이라 불렀음.</p>
    <p>van Noorden(1975)의 실험: 음 A와 B를 <code>A B A _ A B A _</code>로 반복함</p>
    <ul>
      <li>간격이 좁으면 한 흐름. 세 음이 묶여 "따그닥 따그닥" 하는 갤럽(Gallop) 리듬으로 들림.</li>
      <li>간격이 넓고 빠르면 두 흐름. A는 A끼리 빠른 리듬, B는 B끼리 느린 리듬으로 따로 들리고 갤럽이 사라짐.</li>
      <li><b>분리 경계(Fission boundary)</b> 아래에서는 늘 한 흐름. <b>시간 일관성 경계(Temporal coherence boundary)</b> 위에서는 늘 두 흐름. 그 사이는 듣는 사람의 주의에 따라 바뀜.</li>
    </ul>
    <p>음악에서: 바로크의 <b>가상 다성부(Implied polyphony)</b>는 한 악기가 높은 음과 낮은 음을 빠르게 오가서 두 성부처럼 들리게 함. 사운드 디자인에서는 효과음끼리 음역을 벌리면 따로 들리고, 가까우면 한 덩어리로 들림.</p>
    <p>이 샘플의 두 경계선은 van Noorden 그림의 모양을 따른 근사선</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="14" class="t-small t-a">${L('좁은 간격: 한 흐름 (갤럽)', 'Small gap: one stream (gallop)')}</text>
    <circle cx="30" cy="60" r="5" class="f-a"/><circle cx="60" cy="45" r="5" class="f-a"/><circle cx="90" cy="60" r="5" class="f-a"/>
    <circle cx="150" cy="60" r="5" class="f-a"/><circle cx="180" cy="45" r="5" class="f-a"/><circle cx="210" cy="60" r="5" class="f-a"/>
    <path d="M30,60 L60,45 L90,60" class="d-a"/><path d="M150,60 L180,45 L210,60" class="d-a"/>
    <text x="294" y="14" class="t-small t-b">${L('넓은 간격: 두 흐름', 'Large gap: two streams')}</text>
    <circle cx="310" cy="80" r="5" class="f-b"/><circle cx="340" cy="30" r="5" class="f-b"/><circle cx="370" cy="80" r="5" class="f-b"/>
    <circle cx="430" cy="80" r="5" class="f-b"/><circle cx="460" cy="30" r="5" class="f-b"/><circle cx="490" cy="80" r="5" class="f-b"/>
    <path d="M310,80 L370,80 L430,80 L490,80" class="d-b"/><path d="M340,30 L460,30" class="d-b" stroke-dasharray="5 3"/>
    <line x1="20" y1="110" x2="520" y2="110" class="d-dim"/>
    <text x="270" y="134" text-anchor="middle" class="t-small">${L('A B A _ 반복. 음 간격이 넓고 빠를수록 높은 음과 낮은 음이 따로 들림', 'A B A _ repeats. Larger gaps and faster tempo split high and low tones apart')}</text>
    <text x="270" y="154" text-anchor="middle" class="t-small t-dim">${L('같은 음열이 간격에 따라 다른 리듬으로 들림', 'The same sequence is heard as a different rhythm')}</text>
  </svg>`,
  look: [
    'A의 위 그림은 A B A가 한 선으로 이어진 갤럽 모양. B는 높은 음과 낮은 음이 각각 다른 선으로 이어짐.',
    '"소리 켜기"를 누르고 A를 들으면 "따그닥" 리듬, B를 들으면 빠른 낮은 음 줄기 위로 느린 높은 음이 따로 들림',
    'B의 음 간격은 그대로 두고 음 간격 시간(TRT)을 200 ms로 늘리면 점이 경계 사이(모호한 영역)로 들어가 다시 갤럽으로 들리기도 함',
    'A의 음 간격을 6반음으로 늘리면 모호한 영역에 들어감. 오래 들으면 한 흐름에서 두 흐름으로 바뀌는 순간이 옴 (흐름 형성의 누적).',
  ],
  refs: [
    { type: 'paper', title: 'van Noorden, "Temporal coherence in the perception of tone sequences", PhD thesis, Eindhoven University of Technology', year: 1975, note: '분리 경계와 시간 일관성 경계' },
    { type: 'book', title: 'Albert S. Bregman, Auditory Scene Analysis: The Perceptual Organization of Sound', year: 1990, note: '청각 흐름과 장면 분석 이론' },
    { type: 'paper', title: 'Bregman, Campbell, "Primary auditory stream segregation and perception of order in rapid sequences of tones", Journal of Experimental Psychology 89(2)', year: 1971, note: '빠른 음열의 흐름 분리 실험' },
    { type: 'book', title: 'David Huron, Voice Leading: The Science behind a Musical Rule', year: 2016, note: '성부 진행 규칙을 흐름 분리로 설명' },
  ],
  params: [
    { key: 'semi', label: '음 간격 (반음)', type: 'range', min: 0, max: 15, step: 0.5, a: 2, b: 11, default: 2, group: '음열' },
    { key: 'trt', label: '음 간격 시간 TRT (ms)', type: 'range', min: 50, max: 250, step: 5, default: 110, shared: true, help: '한 음이 시작되고 다음 음이 시작될 때까지의 시간' },
    { key: 'fA', label: '낮은 음 A (Hz)', type: 'range', min: 200, max: 1200, step: 10, default: 500, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Auditory Streaming (ABA Gallop)',
    summary: 'Repeat two tones of different pitch as A B A rest. With a small gap you hear one stream, a galloping rhythm. With a large gap and fast tempo it splits into a high stream and a low stream. A uses 2 semitones (one stream), B uses 11 (two streams).',
    views: { a: '2 semitones (one stream)', b: '11 semitones (two streams)' },
    controls: 'Change the pitch gap and the tempo in the parameter table. Press "Sound on" to hear the ABA sequence repeat.',
    info: `
    <p>The ear groups incoming sound into <b>streams</b> by "what is making it". Bregman called this <b>auditory scene analysis</b>.</p>
    <p>The experiment of van Noorden (1975): repeat tones A and B as <code>A B A _ A B A _</code>.</p>
    <ul>
      <li>With a small gap you hear one stream. The three tones group into a galloping rhythm.</li>
      <li>With a large gap and a fast tempo you hear two streams. A tones form a fast rhythm, B tones a slow one, and the gallop is gone.</li>
      <li>Below the <b>fission boundary</b> it is always one stream. Above the <b>temporal coherence boundary</b> it is always two. Between them it depends on the listener\'s attention.</li>
    </ul>
    <p>In music: Baroque <b>implied polyphony</b> makes one instrument sound like two voices by jumping fast between high and low notes. In sound design, sound effects spread apart in range are heard separately, and close ones blend into one.</p>
    <p>The two boundary lines here are approximations that follow the shape of van Noorden\'s figure.</p>`,
    look: [
      'In A\'s top plot, A B A joins into one galloping line. In B the high and low tones each join their own line.',
      'Press "Sound on". A sounds like a gallop. In B a slow high line floats over a fast low line.',
      'Keep B\'s gap and raise the TRT to 200 ms. The dot moves between the boundaries (ambiguous area), and the gallop can come back.',
      'Raise A\'s gap to 6 semitones. It enters the ambiguous area. If you listen for a while, one stream can turn into two (streaming builds up).',
    ],
    refs: ['Fission boundary and temporal coherence boundary.', 'Theory of auditory streams and scene analysis.', 'Stream segregation in fast tone sequences.', 'Voice-leading rules explained by streaming.'],
    params: {
      semi: { label: 'Pitch gap (semitones)', group: 'Sequence' },
      trt: { label: 'Tone repetition time TRT (ms)', help: 'Time from the start of one tone to the start of the next' },
      fA: 'Low tone A (Hz)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    // 근사 경계 (반음). T: TRT(ms)
    const fission = () => 3;
    const tcb = (T) => Math.min(15, 1.5 + 0.06 * T);
    const region = () => (P.semi < fission(P.trt) ? 0 : P.semi > tcb(P.trt) ? 2 : 1);
    const PAT = [0, 1, 0, -1]; // 0 = A, 1 = B, -1 = 쉼

    let t = 0, ph = 0, env = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const T = P.trt / 1000, dur = Math.min(T * 0.75, T - 0.01), fB = P.fA * Math.pow(2, P.semi / 12);
        for (let i = 0; i < n; i++) {
          const slot = Math.floor(t / T), local = t - slot * T, k = PAT[slot % 4];
          const on = k >= 0 && local < dur ? 1 : 0;
          env += (on - env) * (on ? 0.02 : 0.01);
          const f = k === 1 ? fB : P.fA;
          const v = 0.3 * env * Math.sin(ph);
          l[i] = v; r[i] = v;
          ph += 2 * Math.PI * f / sr; if (ph > 6.283185307) ph -= 6.283185307;
          t += 1 / sr;
        }
      },
    });
    let vt = 0; // 소리가 꺼졌을 때 그림용 시간

    return {
      update(dt) { snd.update(); vt += dt; },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const rg = region();
        const now = snd.on ? t : vt, T = P.trt / 1000;
        // 위: 음열 타임라인 (최근 16칸)
        const tx = pad, ty = pad + 14, tw = W - pad * 2, th = Math.max(60, (H - 40) * 0.42);
        D.rect(g, tx, ty, tw, th, 'rgba(0,0,0,0.35)');
        D.text(g, L('음열 (x: 시간, y: 음 높이), 선 = 묶여 들리는 흐름', 'Sequence (x: time, y: pitch), lines = streams heard together'), tx, pad, { size: 10, color: C.dim });
        const SL = 16, cur = Math.floor(now / T), first = cur - SL + 1;
        const yA = ty + th - 16, yB = ty + th - 16 - (th - 32) * Math.min(1, P.semi / 15);
        const xs = (s) => tx + 10 + (tw - 20) * (s - first) / (SL - 1);
        const notes = [];
        for (let s = first; s <= cur; s++) { const k = PAT[((s % 4) + 4) % 4]; if (k >= 0 && s >= 0) notes.push({ s, k, x: xs(s), y: k ? yB : yA }); }
        const strokeLine = (pts, c, dash) => { if (pts.length < 2) return; g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y))); g.setLineDash(dash || []); g.strokeStyle = c; g.lineWidth = 2; g.stroke(); g.setLineDash([]); };
        if (rg === 0) strokeLine(notes, col);
        else if (rg === 2) { strokeLine(notes.filter((n) => n.k === 0), col); strokeLine(notes.filter((n) => n.k === 1), col, [6, 4]); }
        else { strokeLine(notes, 'rgba(255,255,255,0.25)', [3, 3]); strokeLine(notes.filter((n) => n.k === 0), col, [6, 4]); }
        for (const nt of notes) D.rect(g, nt.x - 7, nt.y - 4, 14, 8, nt.s === cur ? '#fff' : nt.k ? C.warn : col);
        D.text(g, 'A', tx + 2, yA - 5, { size: 9, color: C.dim }); D.text(g, 'B', tx + 2, yB - 5, { size: 9, color: C.dim });
        // 아래: van Noorden 그림
        const gx = pad + 30, gy = ty + th + 26, gw = W - gx - pad, gh = H - gy - 20;
        if (gh > 30) {
          const xT = (ms) => gx + gw * (ms - 50) / 200, yS = (s) => gy + gh - gh * s / 15;
          D.rect(g, gx, gy, gw, gh, 'rgba(0,0,0,0.35)');
          D.text(g, L('van Noorden 그림 (x: TRT, y: 음 간격)', 'van Noorden diagram (x: TRT, y: pitch gap)'), gx, gy - 14, { size: 10, color: C.dim });
          for (let ms = 50; ms <= 250; ms += 50) D.text(g, ms + ' ms', xT(ms), gy + gh + 3, { size: 9, align: 'center', color: C.dim });
          for (let s = 0; s <= 15; s += 5) D.text(g, String(s), gx - 4, yS(s) - 5, { size: 9, align: 'right', color: C.dim });
          // 영역 칠하기
          g.beginPath(); g.moveTo(xT(50), yS(fission())); g.lineTo(xT(250), yS(fission())); g.lineTo(xT(250), yS(0)); g.lineTo(xT(50), yS(0)); g.closePath(); g.fillStyle = 'rgba(102,209,122,0.10)'; g.fill();
          g.beginPath(); for (let ms = 50; ms <= 250; ms += 10) { const x = xT(ms), y = yS(tcb(ms)); ms === 50 ? g.moveTo(x, y) : g.lineTo(x, y); }
          g.lineTo(xT(250), yS(15)); g.lineTo(xT(50), yS(15)); g.closePath(); g.fillStyle = 'rgba(199,146,234,0.12)'; g.fill();
          D.line(g, xT(50), yS(fission()), xT(250), yS(fission()), C.good, 1.5);
          g.beginPath(); for (let ms = 50; ms <= 250; ms += 10) { const x = xT(ms), y = yS(tcb(ms)); ms === 50 ? g.moveTo(x, y) : g.lineTo(x, y); } g.strokeStyle = C.accent; g.lineWidth = 1.5; g.stroke();
          D.text(g, L('늘 한 흐름', 'always one'), xT(245), yS(fission()) + 3, { size: 9, align: 'right', color: C.good });
          D.text(g, L('늘 두 흐름', 'always two'), xT(55), yS(14.5), { size: 9, color: C.accent });
          D.circle(g, xT(P.trt), yS(P.semi), 6, col, '#fff', 1.5);
        }
        const names = [L('한 흐름 (갤럽)', 'one stream (gallop)'), L('모호함 (주의에 따라 바뀜)', 'ambiguous (depends on attention)'), L('두 흐름', 'two streams')];
        ctx.stat(L('예상 지각', 'Expected percept'), names[rg]);
        ctx.stat(L('B 음', 'Tone B'), (P.fA * Math.pow(2, P.semi / 12)).toFixed(0) + ' Hz');
        ctx.stat(L('경계 (분리, 일관성)', 'Boundaries (fission, coherence)'), `${fission().toFixed(1)}, ${tcb(P.trt).toFixed(1)} ${L('반음', 'st')}`);
        ctx.stat(L('A 음 빠르기', 'A tone rate'), (1 / (2 * T)).toFixed(1) + L('개/초', '/s'));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
