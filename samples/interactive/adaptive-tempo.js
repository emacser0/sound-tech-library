// 게임 속도를 따라가는 템포: 즉시 점프 vs 부드러운 램프 vs 재생 속도 변경(바리스피드, 음 높이도 바뀜)
GTL.register({
  id: 'adaptive-tempo',
  title: '게임 속도를 따라가는 템포',
  summary: '달리기, 레이스처럼 게임 속도가 바뀔 때 음악 템포를 따라 바꿈. 목표 템포로 바로 점프하면 박 간격이 갑자기 바뀌어 박자가 휘청거림. 박 위상을 이어 가며 천천히 바꾸면 자연스럽고, 음표 단위로 합성하므로 음 높이도 그대로임.',
  views: { a: '즉시 점프', b: '램프 (BPM/초 제한)' },
  controls: '"자동 시나리오"를 끄면 "게임 속도"를 직접 움직일 수 있음',
  info: `
    <p><b>적응형 템포(Adaptive Tempo)</b>는 게임 값(이동 속도, 남은 시간, 심박)에 따라 음악의 BPM을 바꾸는 기법. 시간이 얼마 안 남으면 빨라지는 퍼즐 게임 음악이 대표적인 예.</p>
    <p>구현의 핵심은 <b>박 위상(beat phase)</b>을 적분하는 것. 매 샘플 <code>beat += BPM / 60 × dt</code>로 박 위치를 누적하고, 음표는 박 위치로 발음함. 그래서 템포를 바꿔도 지금 있는 박 위치에서 이어짐.</p>
    <ul>
      <li><b>즉시 점프</b>: 목표 BPM을 바로 씀. 박 하나 사이에 간격이 30% 넘게 바뀌어 연주자가 넘어지는 것처럼 들림.</li>
      <li><b>램프</b>: 초당 변화량을 제한함(예: 20 BPM/초). 몇 마디에 걸쳐 가속하는 "accelerando"처럼 들림. 대신 게임 변화보다 늦게 따라감.</li>
      <li><b>바리스피드(Varispeed)</b>: 녹음된 오디오를 빨리 재생하는 방식. 템포와 함께 음 높이도 올라감(테이프 효과). 음 높이를 지키려면 타임 스트레칭이 필요하고 비용과 음질 손실이 있음.</li>
    </ul>
    <p>이 샘플처럼 음표 단위(MIDI, 트래커, 절차적 음악)로 재생하면 음 높이와 템포가 독립이라 문제가 없음. 녹음된 스템을 쓰는 게임은 템포별 스템을 따로 만들거나 타임 스트레칭을 씀.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="14" class="t-small t-dim">${L('위: 템포, 아래: 박이 울리는 시각', 'Top: tempo. Bottom: beat times')}</text>
    <path d="M20,90 L200,90 L200,40 L520,40" class="d-dim" stroke-dasharray="4 3"/>
    <text x="520" y="34" text-anchor="end" class="t-small t-dim">${L('목표 템포', 'target tempo')}</text>
    <path d="M20,92 L200,92 L200,44 L520,44" class="d-a"/>
    <path d="M20,96 L200,96 Q260,96 300,70 Q340,48 400,48 L520,48" class="d-b"/>
    <text x="210" y="62" class="t-small t-a">${L('A 점프', 'A jump')}</text><text x="320" y="86" class="t-small t-b">${L('B 램프', 'B ramp')}</text>
    ${[20, 60, 100, 140, 180, 200, 222, 244, 266, 288, 310, 332, 354, 376, 398, 420, 442, 464, 486, 508].map((x) => `<line x1="${x}" y1="118" x2="${x}" y2="132" class="d-a"/>`).join('')}
    ${[20, 60, 100, 140, 180, 218, 252, 282, 309, 334, 357, 379, 401, 423, 445, 467, 489, 511].map((x) => `<line x1="${x}" y1="142" x2="${x}" y2="156" class="d-b"/>`).join('')}
    <text x="4" y="130" class="t-small t-a">A</text><text x="4" y="154" class="t-small t-b">B</text>
    <text x="200" y="168" class="t-small t-dim" text-anchor="middle">${L('게임 속도 변경', 'game speed change')}</text>
  </svg>`,
  look: [
    '박 표시 줄을 보면 A는 게임 속도가 바뀌는 순간 박 간격이 확 바뀌고, B는 간격이 서서히 좁아지거나 넓어짐',
    '"박 간격 변화" 측정값이 A는 속도가 바뀔 때 30% 이상, B는 몇 %에 머묾',
    '방식을 "바리스피드"로 바꾸고 "소리 켜기"를 누르면 빨라질수록 음 높이도 올라감. "음 높이 변화"가 수백 센트까지 커짐.',
    '"램프 속도"를 5 BPM/초로 낮추면 B는 매우 매끄럽지만 게임 속도가 다시 바뀌기 전에 목표에 도달하지 못함',
  ],
  refs: [
    { type: 'book', title: 'Karen Collins, Game Sound', year: 2008, note: '템포, 음 높이 같은 음악 파라미터를 게임 값으로 바꾸는 예 (Space Invaders의 빨라지는 박자 등)' },
    { type: 'engine', title: 'Audiokinetic Wwise Help - Music Playback Speed (RTPC)', note: '음악 재생 속도를 RTPC로 바꾸는 기능. 음 높이도 함께 바뀜.' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed.', year: 2011, note: '타임 스트레칭과 피치 시프팅 (템포와 음 높이를 따로 바꾸는 방법)' },
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', year: 1996, note: '바리스피드와 그래뉼러 타임 스트레칭' },
  ],
  params: [
    { key: 'mode', label: '방식', type: 'select', options: [{ value: 'jump', label: '즉시 점프' }, { value: 'ramp', label: '램프' }, { value: 'vari', label: '바리스피드 (음 높이도 바뀜)' }], a: 'jump', b: 'ramp', group: '템포' },
    { key: 'rate', label: '램프 속도 (BPM/초)', type: 'range', min: 2, max: 80, step: 1, default: 20, when: (p) => p.mode !== 'jump' },
    { key: 'auto', label: '자동 시나리오', type: 'bool', default: true, shared: true, group: '게임', help: '4초마다 게임 속도가 바뀜' },
    { key: 'speed', label: '게임 속도', type: 'range', min: 0, max: 1, step: 0.01, default: 0.5, shared: true, when: (p) => !p.auto, help: '0 = 80 BPM, 1 = 160 BPM' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Adaptive Tempo',
    summary: 'When game speed changes (running, racing), the music tempo follows. Jumping straight to the target tempo changes the beat spacing suddenly and the rhythm stumbles. Changing it slowly while keeping the beat phase sounds natural, and because notes are synthesized one by one, the pitch stays the same.',
    views: { a: 'Instant jump', b: 'Ramp (BPM/s limit)' },
    controls: 'Turn off "Auto scenario" to move "Game speed" by hand.',
    info: `
    <p><b>Adaptive tempo</b> changes the music BPM from a game value (move speed, time left, heart rate). A puzzle game whose music speeds up when time runs out is a classic example.</p>
    <p>The key is to integrate the <b>beat phase</b>. Every sample, <code>beat += BPM / 60 × dt</code> adds up the beat position, and notes play at beat positions. So a tempo change continues from the current beat position.</p>
    <ul>
      <li><b>Instant jump</b>: uses the target BPM at once. The beat spacing changes by more than 30% within one beat, like a player tripping.</li>
      <li><b>Ramp</b>: limits the change per second (for example 20 BPM/s). It sounds like an accelerando over a few bars. But it follows the game late.</li>
      <li><b>Varispeed</b>: plays recorded audio faster. The pitch goes up with the tempo (tape effect). Keeping the pitch needs time stretching, which costs CPU and quality.</li>
    </ul>
    <p>When music plays note by note (MIDI, tracker, procedural music) like here, pitch and tempo are independent, so there is no problem. Games with recorded stems make separate stems per tempo or use time stretching.</p>`,
    look: [
      'Look at the beat row. In A the beat spacing changes at once when the game speed changes. In B it narrows or widens gradually.',
      'The "Beat interval change" stat goes above 30% in A when the speed changes. B stays at a few %.',
      'Set the method to "Varispeed" and press "Sound on". The pitch rises as the music speeds up. "Pitch shift" reaches hundreds of cents.',
      'Lower "Ramp rate" to 5 BPM/s. B is very smooth but does not reach the target before the game speed changes again.',
    ],
    refs: ['Changing music parameters such as tempo and pitch from game values (for example the speeding beat of Space Invaders).', 'Changes music playback speed with an RTPC. The pitch changes too.', 'Time stretching and pitch shifting (changing tempo and pitch separately).', 'Varispeed and granular time stretching.'],
    params: {
      mode: { label: 'Method', group: 'Tempo', options: { jump: 'Instant jump', ramp: 'Ramp', vari: 'Varispeed (pitch changes too)' } },
      rate: 'Ramp rate (BPM/s)',
      auto: { label: 'Auto scenario', group: 'Game', help: 'Game speed changes every 4 s' },
      speed: { label: 'Game speed', help: '0 = 80 BPM, 1 = 160 BPM' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    // 미니 합성기: 드럼과 음을 샘플 단위로 합성 (이 카테고리 샘플마다 같은 코드를 둠)
    // kind: kick, snare, hat, ohat, crash, riser, click, bass, pluck, lead, pad, brass, bell, sine
    function makeSynth(seed) {
      const TAU = Math.PI * 2, vs = [];
      let s32 = (seed | 0) || 1, srC = 0, cLo = 0, cHi = 0;
      const rnd = () => { s32 ^= s32 << 13; s32 ^= s32 >>> 17; s32 ^= s32 << 5; return (s32 >>> 0) / 2147483648 - 1; };
      return {
        vs,
        play(kind, o = {}) {
          const a = ((o.pan || 0) + 1) * Math.PI / 4;
          if (vs.length >= 64) vs.shift();
          const v = { kind, t: 0, f: o.f || 220, len: o.len ?? 0.25, amp: o.amp ?? 0.3, bus: o.bus || 0, rate: o.rate || 1, gl: Math.cos(a), gr: Math.sin(a), ph: 0, ph2: 0, z: 0, z2: 0, dead: false };
          vs.push(v);
          return v;
        },
        cut(bus) { for (const v of vs) if (bus == null || v.bus === bus) v.dead = true; },               // 즉시 끊음 (클릭이 남)
        release(bus) { for (const v of vs) if ((bus == null || v.bus === bus) && v.t < v.len) v.len = v.t; }, // 음을 놓음 (릴리스로 사라짐)
        // 한 샘플을 out[0], out[1]에 더함. gains[bus]: 버스 게인 (없으면 1)
        tick(sr, out, gains) {
          if (sr !== srC) { srC = sr; cLo = 1 - Math.exp(-TAU * 900 / sr); cHi = 1 - Math.exp(-TAU * 2500 / sr); }
          const dt = 1 / sr;
          for (let k = 0; k < vs.length; k++) {
            const v = vs[k];
            if (v.dead) continue;
            const t = v.t, rt = v.rate;
            v.t += dt * rt;
            let s = 0;
            switch (v.kind) {
              case 'kick': v.ph += (46 + 130 * Math.exp(-t * 32)) * rt * dt; s = Math.sin(TAU * v.ph) * Math.exp(-t * 7); if (t > 0.6) v.dead = true; break;
              case 'snare': { const n = rnd(); v.z += 0.5 * (n - v.z); s = (n - v.z) * Math.exp(-t * 18) + 0.6 * Math.sin(TAU * 185 * rt * t) * Math.exp(-t * 30); if (t > 0.45) v.dead = true; break; }
              case 'hat': case 'ohat': { const n = rnd(); s = (n - v.z) * 0.5 * Math.exp(-t * (v.kind === 'hat' ? 55 : 12)); v.z = n; if (t > 0.5) v.dead = true; break; }
              case 'crash': { const n = rnd(); s = (n - v.z) * 0.45 * Math.exp(-t * 2.5); v.z = n; if (t > 2) v.dead = true; break; }
              case 'riser': { const n = rnd(), q = Math.min(1, t / Math.max(0.01, v.len)), c = 1 - Math.exp(-TAU * (300 + 6000 * q * q) / sr); v.z += c * (n - v.z); s = v.z * q * q; if (t >= v.len) v.dead = true; break; }
              case 'click': s = Math.sin(TAU * v.f * rt * t) * Math.exp(-t * 60); if (t > 0.1) v.dead = true; break;
              default: {
                const f = v.f * rt, rel = t - v.len;
                v.ph += f * dt; v.ph -= Math.floor(v.ph);
                const p = v.ph;
                let raw, env;
                switch (v.kind) {
                  case 'bass': v.z += cLo * (2 * p - 1 - v.z); v.z2 += cLo * (v.z - v.z2); raw = v.z2 * 1.6; env = Math.min(1, t / 0.005) * (rel < 0 ? 1 : Math.exp(-rel * 30)); if (rel > 0.2) v.dead = true; break;
                  case 'pluck': raw = 4 * Math.abs(p - 0.5) - 1 + 0.3 * Math.sin(2 * TAU * p); env = Math.min(1, t / 0.003) * Math.exp(-t * 5) * (rel < 0 ? 1 : Math.exp(-rel * 20)); if (rel > 0.3 || t > 3) v.dead = true; break;
                  case 'lead': v.z += cHi * (2 * p - 1 - v.z); raw = v.z; env = Math.min(1, t / 0.01) * (0.6 + 0.4 * Math.exp(-t * 6)) * (rel < 0 ? 1 : Math.exp(-rel * 25)); if (rel > 0.25) v.dead = true; break;
                  case 'pad': v.ph2 += f * 1.006 * dt; v.ph2 -= Math.floor(v.ph2); v.z += cLo * 0.5 * (p + v.ph2 - 1 - v.z); v.z2 += cLo * 0.5 * (v.z - v.z2); raw = v.z2 * 2.2; env = Math.min(1, t / 0.35) * (rel < 0 ? 1 : Math.exp(-rel * 4)); if (rel > 1.5) v.dead = true; break;
                  case 'brass': { const c = 1 - Math.exp(-TAU * (500 + 3500 * Math.exp(-t * 6)) / sr); v.z += c * (2 * p - 1 - v.z); v.z2 += c * (v.z - v.z2); raw = v.z2 * 1.4; env = Math.min(1, t / 0.02) * (rel < 0 ? 1 : Math.exp(-rel * 10)); if (rel > 0.6) v.dead = true; break; }
                  case 'bell': v.ph2 += f * 2.76 * dt; v.ph2 -= Math.floor(v.ph2); raw = Math.sin(TAU * p) + 0.4 * Math.sin(TAU * v.ph2) * Math.exp(-t * 3); env = Math.min(1, t / 0.004) * Math.exp(-t * 1.6) * (rel < 0 ? 1 : Math.exp(-rel * 3)); if (t > 4 || rel > 1.5) v.dead = true; break;
                  default: raw = Math.sin(TAU * p); env = Math.min(1, t / 0.01) * (rel < 0 ? 1 : Math.exp(-rel * 20)); if (rel > 0.3) v.dead = true;
                }
                s = raw * env;
              }
            }
            const g = v.amp * (gains && gains[v.bus] != null ? gains[v.bus] : 1);
            out[0] += s * g * v.gl; out[1] += s * g * v.gr;
          }
        },
        // 끝난 음을 목록에서 뺌. 블록마다 한 번 호출
        gc() { let j = 0; for (let i = 0; i < vs.length; i++) if (!vs[i].dead) vs[j++] = vs[i]; vs.length = j; },
      };
    }

    const BASE = 120;
    const LEVELS = [0.25, 0.85, 0.5, 1, 0.1, 0.65, 0.35, 0.95];
    const MEL = [69, -1, 72, 74, 76, -1, 74, 72, 69, -1, 67, 69, 72, -1, -1, -1, 65, -1, 69, 72, 74, -1, 72, 69, 67, -1, 64, 67, 69, -1, -1, -1];
    const ROOTS = [45, 45, 41, 43];
    const syn = makeSynth(13);
    const st = { t: 0, beat: 0, bpm: 120, target: 120, step: -1, beats: [], hist: [], histT: 0, lastChange: 0 };
    const out = [0, 0];
    const gameSpeed = (t) => (P.auto ? LEVELS[Math.floor(t / 4) % LEVELS.length] : P.speed);

    function fire(s) {
      const b = s % 16, s32 = s % 32, bar = Math.floor(s / 16) % 4;
      const rate = P.mode === 'vari' ? st.bpm / BASE : 1;
      const d16 = 60 / st.bpm / 4;
      if (b % 4 === 0) {
        syn.play('kick', { amp: 0.38, rate });
        st.beats.push({ t: st.t, bar: b === 0 });
        if (st.beats.length > 80) st.beats.shift();
      }
      if (b === 4 || b === 12) syn.play('snare', { amp: 0.18, rate });
      if (b % 2 === 0) syn.play('hat', { amp: 0.09, rate, pan: 0.3 });
      if (b % 2 === 0) syn.play('bass', { f: A.mtof(ROOTS[bar] + (b % 4 === 2 ? 12 : 0)), len: d16 * 1.5, amp: 0.17, rate });
      if (MEL[s32] > 0) syn.play('lead', { f: A.mtof(MEL[s32]), len: d16 * 1.6, amp: 0.07, rate, pan: -0.2 });
      for (const v of syn.vs) v.rate = rate;
    }
    function step(l, r, sr, n) {
      st.target = 80 + 80 * gameSpeed(st.t);
      const dt = 1 / sr, maxD = P.rate * dt;
      for (let i = 0; i < n; i++) {
        if (P.mode === 'jump') st.bpm = st.target;
        else st.bpm += U.clamp(st.target - st.bpm, -maxD, maxD);
        st.beat += st.bpm / 60 * dt;
        const s16 = Math.floor(st.beat * 4 + 1e-9);
        if (s16 !== st.step) { st.step = s16; fire(s16); }
        out[0] = out[1] = 0;
        syn.tick(sr, out, null);
        l[i] = out[0] * 0.85; r[i] = out[1] * 0.85;
        st.t += dt;
      }
      syn.gc();
      while (st.histT <= st.t) { st.hist.push({ t: st.histT, bpm: st.bpm, target: st.target }); st.histT += 0.05; }
      if (st.hist.length > 300) st.hist.splice(0, st.hist.length - 300);
    }
    const snd = A.player(ctx, { process: step });
    const bufL = new Float32Array(4800), bufR = new Float32Array(4800);

    return {
      update(dt) {
        snd.update();
        if (!snd.on) step(bufL, bufR, 48000, Math.min(4800, Math.round(dt * 48000)));
      },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, tw = W - pad * 2, PAST = 12, t0 = st.t - PAST;
        const X = (t) => pad + (t - t0) / PAST * tw;
        const ph = Math.max(80, H * 0.42), py0 = 22;
        D.rect(g, pad, py0, tw, ph, 'rgba(0,0,0,0.35)');
        const Y = (b) => py0 + ph - (b - 70) / 100 * ph;
        for (const b of [80, 120, 160]) { D.line(g, pad, Y(b), pad + tw, Y(b), C.grid, 1); D.text(g, b + ' BPM', pad + 3, Y(b) - 11, { size: 9, color: C.dim }); }
        const line = (key, color, dash) => {
          g.beginPath();
          let f = true;
          for (const h of st.hist) { if (h.t < t0) continue; const x = X(h.t), y = Y(h[key]); f ? g.moveTo(x, y) : g.lineTo(x, y); f = false; }
          if (dash) g.setLineDash([5, 4]);
          g.strokeStyle = color; g.lineWidth = 2; g.stroke(); g.setLineDash([]);
        };
        line('target', C.warn, true); line('bpm', col, false);
        D.text(g, L('점선 = 게임이 원하는 템포, 실선 = 실제 템포', 'Dashed = tempo the game wants, solid = actual tempo'), pad, 6, { size: 10, color: C.dim });
        // 박 표시
        const by = py0 + ph + 12, bh = 34;
        D.rect(g, pad, by, tw, bh, 'rgba(0,0,0,0.3)');
        let worst = 0;
        for (let i = 0; i < st.beats.length; i++) {
          const b = st.beats[i];
          if (b.t >= t0) D.line(g, X(b.t), by + (b.bar ? 2 : 10), X(b.t), by + bh - 2, b.bar ? C.text : col, b.bar ? 2 : 1.5);
          if (i >= 2 && b.t > st.t - 4) {
            const d1 = b.t - st.beats[i - 1].t, d0 = st.beats[i - 1].t - st.beats[i - 2].t;
            worst = Math.max(worst, Math.abs(d1 / d0 - 1));
          }
        }
        D.text(g, L('박 (굵은 선 = 마디 시작)', 'Beats (thick = bar start)'), pad + 3, by + bh + 3, { size: 9, color: C.dim });
        // 음 높이 변화 막대
        const cents = P.mode === 'vari' ? 1200 * Math.log2(st.bpm / BASE) : 0;
        const my = by + bh + 22, mw = Math.min(260, tw);
        if (my + 20 < H) {
          D.rect(g, pad, my, mw, 10, 'rgba(255,255,255,0.08)');
          D.line(g, pad + mw / 2, my - 3, pad + mw / 2, my + 13, C.dim, 1);
          D.rect(g, pad + mw / 2, my, mw / 2 * U.clamp(cents / 1200, -1, 1), 10, Math.abs(cents) > 30 ? C.bad : C.good);
          D.text(g, L('음 높이 변화 (±1옥타브)', 'Pitch shift (±1 octave)'), pad + mw + 6, my - 1, { size: 9, color: C.dim });
        }
        const last = st.beats.length > 1 ? (st.beats[st.beats.length - 1].t - st.beats[st.beats.length - 2].t) * 1000 : 0;
        ctx.stat(L('템포', 'Tempo'), st.bpm.toFixed(1) + ' BPM');
        ctx.stat(L('목표 템포', 'Target tempo'), st.target.toFixed(0) + ' BPM');
        ctx.stat(L('박 간격', 'Beat interval'), last.toFixed(0) + ' ms');
        ctx.stat(L('박 간격 변화 (최근 4초 최대)', 'Beat interval change (max, last 4 s)'), (worst * 100).toFixed(1) + ' %');
        ctx.stat(L('음 높이 변화', 'Pitch shift'), cents.toFixed(0) + ' cents');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
