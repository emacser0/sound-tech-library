// ADSR 엔벨로프: 직선 구간 vs 지수 구간. 같은 시간 설정이라도 귀에 들리는 감쇠가 다름
GTL.register({
  id: 'adsr-envelope',
  title: 'ADSR 엔벨로프 (직선 vs 지수 곡선)',
  summary: '음량이 시간에 따라 변하는 모양을 Attack, Decay, Sustain, Release 네 구간으로 정함. 같은 시간 값이라도 직선 구간은 끝에서 뚝 끊기고, 지수 구간은 dB 기준으로 고르게 줄어 자연스럽게 들림.',
  views: { a: '직선 구간', b: '지수 구간' },
  controls: '파라미터 표에서 구간 시간과 서스테인 레벨을 바꿈. "소리 켜기"를 누르면 같은 음이 반복해서 울림.',
  info: `
    <p><b>엔벨로프(Envelope)</b>는 음 하나의 음량 변화 곡선. 건반을 누르면(게이트 켜짐) 올라갔다가 내려오고, 떼면(게이트 꺼짐) 사라짐.</p>
    <ul>
      <li><b>Attack</b>: 0에서 최대까지 올라가는 시간</li>
      <li><b>Decay</b>: 최대에서 서스테인 레벨까지 내려가는 시간</li>
      <li><b>Sustain</b>: 건반을 누르고 있는 동안 유지하는 레벨 (시간이 아니라 높이)</li>
      <li><b>Release</b>: 건반을 뗀 뒤 0까지 내려가는 시간</li>
    </ul>
    <p>사람 귀는 음량을 로그(dB)로 느낌. 직선 감쇠는 dB로 보면 처음엔 거의 그대로이다가 끝에서 갑자기 떨어짐. 아날로그 신시사이저의 RC 회로는 지수 곡선을 만들고, 이 곡선은 dB로 보면 직선이라 고르게 사라지는 소리가 남. 대신 지수 곡선은 목표에 영원히 닿지 않으므로 문턱값(-80dB 등)에서 끊거나, 어택처럼 목표를 1보다 조금 높게 잡아 끝을 정함.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <line x1="30" y1="140" x2="520" y2="140" class="d-dim"/>
    <line x1="30" y1="20" x2="30" y2="140" class="d-dim"/>
    <line x1="350" y1="20" x2="350" y2="150" class="d-dim" stroke-dasharray="4 3"/>
    <polyline points="30,140 80,30 160,95 350,95 480,140" class="d-a"/>
    <path d="M30,140 C45,70 60,40 80,30 C100,75 120,92 160,95 L350,95 C380,128 420,138 480,140" class="d-b"/>
    <text x="55" y="20" text-anchor="middle" class="t-small">A</text>
    <text x="120" y="60" text-anchor="middle" class="t-small">D</text>
    <text x="255" y="88" text-anchor="middle" class="t-small">S</text>
    <text x="420" y="110" text-anchor="middle" class="t-small">R</text>
    <text x="190" y="160" text-anchor="middle" class="t-small t-dim">${L('게이트 켜짐 (건반 누름)', 'Gate on (key down)')}</text>
    <text x="430" y="160" text-anchor="middle" class="t-small t-dim">${L('게이트 꺼짐', 'Gate off')}</text>
    <text x="520" y="30" text-anchor="end" class="t-small t-a">${L('주황: 직선', 'Orange: linear')}</text>
    <text x="520" y="46" text-anchor="end" class="t-small t-b">${L('파랑: 지수 (RC 충방전)', 'Blue: exponential (RC charge)')}</text>
  </svg>`,
  look: [
    '가운데 dB 그래프를 보면 B의 디케이와 릴리스는 직선이고, A는 끝에서 꺾여 떨어짐',
    '릴리스를 3초로 늘리고 소리를 들으면 A는 한참 크게 남았다가 갑자기 사라짐. B는 고르게 사라짐.',
    '"릴리스 후 -20dB까지" 측정값을 비교하면 같은 릴리스 시간에서 B가 약 3배 빠름',
    '어택을 1초로 늘리면 A는 처음부터 고르게 커지고, B는 빠르게 오른 뒤 천천히 다가가는 볼록한 모양이 됨',
  ],
  refs: [
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', year: 1996, note: '엔벨로프 생성기와 ADSR' },
    { type: 'book', title: 'Will Pirkle, Designing Software Synthesizer Plugins in C++', year: 2021, note: '아날로그 방식 지수 엔벨로프 생성기 구현' },
    { type: 'article', title: 'Nigel Redmon, "Envelope generators: ADSR code" (EarLevel Engineering)', url: 'https://www.earlevel.com/main/2013/06/03/envelope-generators-adsr-code/', note: '목표값을 넘겨 잡는 지수 ADSR 코드' },
    { type: 'engine', title: 'MDN Web Docs, AudioParam.setTargetAtTime()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime', note: 'Web Audio의 지수 접근 함수' },
  ],
  params: [
    { key: 'curve', label: '구간 곡선', type: 'select', options: [{ value: 'linear', label: '직선' }, { value: 'exp', label: '지수' }], a: 'linear', b: 'exp', group: '엔벨로프' },
    { key: 'attack', label: 'Attack (초)', type: 'range', min: 0.002, max: 2, step: 0.001, default: 0.08, shared: true },
    { key: 'decay', label: 'Decay (초)', type: 'range', min: 0.01, max: 3, step: 0.01, default: 0.6, shared: true },
    { key: 'sustain', label: 'Sustain 레벨', type: 'range', min: 0, max: 1, step: 0.01, default: 0.4, shared: true },
    { key: 'release', label: 'Release (초)', type: 'range', min: 0.01, max: 4, step: 0.01, default: 1.5, shared: true },
    { key: 'gate', label: '건반 누르는 시간 (초)', type: 'range', min: 0.1, max: 3, step: 0.05, default: 1.2, shared: true, group: '음' },
    { key: 'note', label: '음 높이 (MIDI)', type: 'int', min: 36, max: 84, default: 57, shared: true, help: '60 = C4 (가운데 도)' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'ADSR Envelope (Linear vs Exponential)',
    summary: 'An envelope shapes the loudness of a note with four stages: Attack, Decay, Sustain, Release. With the same times, linear stages cut off suddenly at the end. Exponential stages fall evenly in dB and sound natural.',
    views: { a: 'Linear stages', b: 'Exponential stages' },
    controls: 'Change stage times and the sustain level in the parameter table. Press "Sound on" to hear the same note repeat.',
    info: `
    <p>An <b>envelope</b> is the loudness curve of one note. When you press a key (gate on), it rises and falls. When you release the key (gate off), it fades out.</p>
    <ul>
      <li><b>Attack</b>: time to rise from 0 to the peak.</li>
      <li><b>Decay</b>: time to fall from the peak to the sustain level.</li>
      <li><b>Sustain</b>: the level held while the key is down (a level, not a time).</li>
      <li><b>Release</b>: time to fall to 0 after the key is released.</li>
    </ul>
    <p>We hear loudness on a log scale (dB). A linear fade stays almost the same in dB and then drops suddenly at the end. The RC circuit in an analog synth makes an exponential curve. In dB this curve is a straight line, so the sound fades evenly. An exponential curve never reaches its target, so you stop at a threshold (such as -80 dB), or aim slightly above 1 for the attack.</p>`,
    look: [
      'Look at the dB graph in the middle. B\'s decay and release are straight lines. A bends and drops at the end.',
      'Set release to 3 s and listen. A stays loud for a long time and then vanishes. B fades evenly.',
      'Compare the "Release to -20 dB" stat. With the same release time, B is about 3 times faster.',
      'Set attack to 1 s. A rises evenly. B rises fast and then slowly approaches the peak (a convex shape).',
    ],
    refs: ['Envelope generators and ADSR.', 'Analog style exponential envelope generator.', 'Exponential ADSR code that aims past the target.', 'The exponential approach function in Web Audio.'],
    params: {
      curve: { label: 'Stage curve', group: 'Envelope', options: { linear: 'Linear', exp: 'Exponential' } },
      attack: 'Attack (s)', decay: 'Decay (s)', sustain: 'Sustain level', release: 'Release (s)',
      gate: { label: 'Key down time (s)', group: 'Note' },
      note: { label: 'Pitch (MIDI)', help: '60 = C4 (middle C)' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const LN1000 = Math.log(1000), OVER = 1.3;

    // 엔벨로프 한 단계. st: { stage(0 쉼, 1 A, 2 D, 3 S, 4 R), v, rate }
    function envStep(st, gate, dt) {
      const a = Math.max(0.001, P.attack), d = Math.max(0.005, P.decay), s = P.sustain, r = Math.max(0.005, P.release);
      if (gate && (st.stage === 0 || st.stage === 4)) st.stage = 1;
      if (!gate && st.stage >= 1 && st.stage <= 3) { st.stage = 4; st.rate = st.v / r; }
      if (P.curve === 'linear') {
        if (st.stage === 1) { st.v += dt / a; if (st.v >= 1) { st.v = 1; st.stage = 2; } }
        else if (st.stage === 2) { st.v -= dt * (1 - s) / d; if (st.v <= s) { st.v = s; st.stage = 3; } }
        else if (st.stage === 3) st.v = s;
        else if (st.stage === 4) { st.v -= st.rate * dt; if (st.v <= 0) { st.v = 0; st.stage = 0; } }
      } else {
        if (st.stage === 1) { // 1.3을 목표로 충전하다가 1에 닿으면 끝
          const tau = a / Math.log(OVER / (OVER - 1));
          st.v += (OVER - st.v) * (1 - Math.exp(-dt / tau));
          if (st.v >= 1) { st.v = 1; st.stage = 2; }
        } else if (st.stage === 2) { // 설정 시간에 차이가 1/1000(-60dB)로 줄어듦
          st.v = s + (st.v - s) * Math.exp(-dt * LN1000 / d);
          if (st.v - s < 1e-4) { st.v = s; st.stage = 3; }
        } else if (st.stage === 3) st.v = s;
        else if (st.stage === 4) { st.v *= Math.exp(-dt * LN1000 / r); if (st.v < 1e-4) { st.v = 0; st.stage = 0; } }
      }
      return st.v;
    }
    const period = () => P.gate + P.release * 1.15 + 0.3;

    // 소리: 반복되는 음. 톱니파를 원폴 로우패스로 살짝 부드럽게
    const live = { env: { stage: 0, v: 0, rate: 0 }, ph: 0, lp: 0, n: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const f = A.mtof(P.note), dt = f / sr, k = A.onePoleCoef(2500, sr);
        for (let i = 0; i < n; i++) {
          const t = (live.n++ / sr) % period();
          const e = envStep(live.env, t < P.gate, 1 / sr);
          let v = 2 * live.ph - 1 - A.polyBlep(live.ph, dt);
          live.ph += dt; if (live.ph >= 1) live.ph -= 1;
          live.lp += k * (v - live.lp);
          const o = live.lp * e * 0.45; l[i] = o; r[i] = o;
        }
      },
    });

    // 표시용 엔벨로프 (1kHz로 계산, 파라미터가 바뀔 때만)
    const ER = 1000;
    let key = '', curve = null, stats = {};
    function analyze() {
      const k = [P.curve, P.attack, P.decay, P.sustain, P.release, P.gate].join();
      if (k === key) return;
      key = k;
      const len = Math.ceil(period() * ER), st = { stage: 0, v: 0, rate: 0 };
      curve = new Float32Array(len);
      for (let i = 0; i < len; i++) curve[i] = envStep(st, i / ER < P.gate, 1 / ER);
      // 릴리스 시작값에서 -20dB, -60dB까지 걸린 시간
      const g0 = Math.floor(P.gate * ER), v0 = curve[g0] || 0;
      let t20 = NaN, t60 = NaN;
      for (let i = g0; i < len; i++) {
        if (isNaN(t20) && curve[i] <= v0 * 0.1) t20 = (i - g0) / ER;
        if (isNaN(t60) && curve[i] <= v0 * 0.001) { t60 = (i - g0) / ER; break; }
      }
      stats = { t20, t60, v0 };
    }

    let visT = 0;
    return {
      update(dt) { snd.update(); visT += dt; },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const per = period(), tp = ((snd.on ? live.n / (snd.sr || 48000) : visT) % per);
        const x0 = pad + 30, w = W - x0 - pad;
        const tx = (t) => x0 + (t / per) * w;
        const h1 = (H - pad * 4) * 0.42, h2 = (H - pad * 4) * 0.38, h3 = H - pad * 4 - h1 - h2;
        const y1 = pad, y2 = y1 + h1 + pad, y3 = y2 + h2 + pad;
        // 게이트 영역
        for (const [y, h] of [[y1, h1], [y2, h2]]) {
          D.rect(g, x0, y, w, h, 'rgba(0,0,0,0.35)');
          D.rect(g, x0, y, tx(P.gate) - x0, h, 'rgba(255,255,255,0.05)');
        }
        // 1) 선형 크기
        const plot = (y, h, fn) => {
          g.beginPath();
          for (let i = 0; i < curve.length; i += 2) {
            const px = tx(i / ER), py = y + h - fn(curve[i]) * h;
            i ? g.lineTo(px, py) : g.moveTo(px, py);
          }
          g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        };
        D.line(g, x0, y1 + h1 - P.sustain * h1 * 0.9, x0 + w, y1 + h1 - P.sustain * h1 * 0.9, C.grid, 1);
        plot(y1, h1, (v) => v * 0.9);
        D.text(g, Lx('크기 (선형)', 'Level (linear)'), x0 + 4, y1 + 3, { size: 10, color: C.dim });
        D.text(g, Lx('게이트 켜짐', 'Gate on'), tx(P.gate) - 4, y1 + 3, { size: 10, color: C.dim, align: 'right' });
        // 2) dB
        const minDb = -80;
        for (let db = 0; db >= minDb; db -= 20) {
          const py = y2 + h2 - (db - minDb) / -minDb * h2;
          D.line(g, x0, py, x0 + w, py, C.grid, 1);
          D.text(g, db + '', x0 - 4, py - 5, { size: 9, color: C.dim, align: 'right' });
        }
        plot(y2, h2, (v) => U.clamp((A.linToDb(v) - minDb) / -minDb, 0, 1));
        D.text(g, Lx('크기 (dB, 귀가 느끼는 척도)', 'Level (dB, how the ear hears it)'), x0 + 4, y2 + 3, { size: 10, color: C.dim });
        // 3) 소리 파형 모양 (엔벨로프 x 진동)
        D.rect(g, x0, y3, w, h3, 'rgba(0,0,0,0.35)');
        const mid = y3 + h3 / 2;
        g.beginPath();
        for (let px = 0; px < w; px++) {
          const i = Math.floor(px / w * curve.length), v = curve[i] || 0;
          g.moveTo(x0 + px + 0.5, mid - v * h3 * 0.45); g.lineTo(x0 + px + 0.5, mid + v * h3 * 0.45);
        }
        g.strokeStyle = col; g.globalAlpha = 0.5; g.lineWidth = 1; g.stroke(); g.globalAlpha = 1;
        D.text(g, Lx('소리 파형의 윤곽', 'Outline of the sound wave'), x0 + 4, y3 + 3, { size: 10, color: C.dim });
        // 재생 위치
        const px = tx(tp);
        D.line(g, px, y1, px, y3 + h3, C.text, 1);
        const cv = curve[Math.min(curve.length - 1, Math.floor(tp * ER))] || 0;
        D.circle(g, px, y1 + h1 - cv * 0.9 * h1, 4, col);

        ctx.stat(Lx('현재 크기', 'Current level'), cv > 1e-5 ? A.linToDb(cv).toFixed(1) + ' dB' : '-inf dB');
        ctx.stat(Lx('릴리스 후 -20dB까지', 'Release to -20 dB'), isNaN(stats.t20) ? '-' : stats.t20.toFixed(2) + ' s');
        ctx.stat(Lx('릴리스 후 -60dB까지', 'Release to -60 dB'), isNaN(stats.t60) ? '-' : stats.t60.toFixed(2) + ' s');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
