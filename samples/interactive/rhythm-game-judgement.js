// 리듬 게임 판정: 판정 창(Perfect, Great, Good)과 지연 보정(오프셋). 보정 없음 vs 자동 보정
GTL.register({
  id: 'rhythm-game-judgement',
  title: '리듬 게임 판정과 지연 보정',
  summary: '리듬 게임은 입력 시각과 음표 시각의 차이로 판정함. 스피커, 블루투스, 입력 장치의 지연 때문에 정확히 친 플레이어도 항상 늦게 찍힘. 오차의 평균을 오프셋으로 빼 주면 같은 실력으로 Perfect가 크게 늘어남.',
  views: { a: '보정 없음', b: '자동 보정 (평균 오차)' },
  controls: '"자동 연주"를 끄면 Space로 직접 칠 수 있음 (판정선에 음표가 닿을 때 누름)',
  info: `
    <p>리듬 게임은 음표마다 <b>오차 = 입력 시각 - 음표 시각</b>을 재고, 오차 크기로 판정함. 오차가 작을수록 높은 등급. 이 샘플의 판정 창은 Perfect ±33ms, Great ±66ms, Good ±100ms.</p>
    <p>문제는 사람 실력과 상관없는 <b>지연(latency)</b>. 오디오 출력(버퍼, 블루투스 150~250ms), 화면 출력, 입력 장치 폴링이 모두 시간을 늦춤. 플레이어는 들리는 소리에 맞춰 치므로 오차의 평균이 지연만큼 한쪽으로 밀림.</p>
    <ul>
      <li><b>보정 없음</b>: 오차 분포가 판정 창 바깥쪽으로 밀려 Great, Good이 많아짐</li>
      <li><b>수동 오프셋</b>: 설정 화면에서 플레이어가 직접 ms 값을 넣음</li>
      <li><b>자동 보정</b>: 일정한 박에 맞춰 몇 번 치게 하고 오차의 평균을 오프셋으로 씀. 많은 리듬 게임의 "보정(calibration)" 화면이 이 방식.</li>
    </ul>
    <p>보정은 평균(치우침)만 없앰. 손의 흔들림(표준편차)은 남음. 보정 오프셋은 판정에만 쓰고, 오디오 재생 시각 자체는 바꾸지 않는 것이 일반적.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="14" class="t-small t-dim">${L('오차 분포와 판정 창 (가운데 = 음표 시각)', 'Error distribution and timing windows (center = note time)')}</text>
    <rect x="170" y="30" width="200" height="110" class="f-dim"/><rect x="220" y="30" width="100" height="110" class="f-good" opacity="0.25"/>
    <line x1="270" y1="24" x2="270" y2="146" class="d-line"/>
    <text x="270" y="160" text-anchor="middle" class="t-small">0 ms</text>
    <text x="245" y="44" text-anchor="middle" class="t-small">Perfect</text><text x="190" y="44" text-anchor="middle" class="t-small">Good</text>
    <path d="M300,140 C330,140 340,60 365,60 C390,60 400,140 430,140" class="d-a"/>
    <path d="M235,140 C255,140 262,56 270,56 C278,56 285,140 305,140" class="d-b"/>
    <text x="400" y="56" class="t-small t-a">${L('A: 지연만큼 늦게 몰림', 'A: shifted late by the latency')}</text>
    <text x="70" y="70" class="t-small t-b">${L('B: 평균을 빼서 가운데로', 'B: mean removed, centered')}</text>
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <path d="M360,100 L276,100" class="d-accent" marker-end="url(#arr)"/>
    <text x="318" y="116" text-anchor="middle" class="t-small">${L('오프셋', 'offset')}</text>
  </svg>`,
  look: [
    '아래 오차 히스토그램을 보면 A는 분포가 오른쪽(늦음)으로 밀려 있고, B는 몇 음표 뒤 가운데로 모임',
    '"Perfect 비율" 측정값이 A는 낮고 B는 크게 높음. 두 뷰의 플레이어 실력(손 흔들림)은 같음.',
    '"시스템 지연"을 200ms(블루투스 수준)로 올리면 A는 거의 모두 Miss가 되지만 B는 다시 가운데로 맞춤',
    '"손 흔들림"을 40ms로 올리면 B도 Perfect가 줄어듦. 보정은 치우침만 없애고 흔들림은 못 없앰.',
  ],
  refs: [
    { type: 'article', title: 'Google Android Developers - Audio latency', url: 'https://developer.android.com/ndk/guides/audio/audio-latency', note: '출력, 입력 지연의 원인과 측정' },
    { type: 'article', title: 'MDN - AudioContext.outputLatency', url: 'https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/outputLatency', note: '브라우저가 알려 주는 출력 지연 추정값' },
    { type: 'book', title: 'Karen Collins, Game Sound', year: 2008, note: '리듬 게임과 음악 상호작용' },
    { type: 'paper', title: 'Bruno H. Repp, "Sensorimotor synchronization: A review of the tapping literature", Psychonomic Bulletin & Review 12(6)', year: 2005, note: '박에 맞춰 칠 때 사람의 오차와 흔들림 크기' },
  ],
  params: [
    { key: 'cal', label: '보정', type: 'select', options: [{ value: 'none', label: '없음' }, { value: 'manual', label: '수동 오프셋' }, { value: 'auto', label: '자동 (최근 16음 평균)' }], a: 'none', b: 'auto', group: '판정' },
    { key: 'offset', label: '수동 오프셋 (ms)', type: 'range', min: -50, max: 300, step: 1, default: 80, when: (p) => p.cal === 'manual' },
    { key: 'win', label: '판정 창 배율', type: 'range', min: 0.5, max: 2, step: 0.05, default: 1, shared: true },
    { key: 'lat', label: '시스템 지연 (ms)', type: 'range', min: 0, max: 300, step: 5, default: 90, shared: true, group: '플레이어와 장치' },
    { key: 'jit', label: '손 흔들림 (ms, 표준편차)', type: 'range', min: 0, max: 60, step: 1, default: 15, shared: true },
    { key: 'autoplay', label: '자동 연주', type: 'bool', default: true, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Rhythm Game Judgement & Calibration',
    summary: 'Rhythm games judge by the difference between input time and note time. Speaker, Bluetooth and input device latency make even a perfect player register late. Subtracting the mean error as an offset greatly raises Perfects for the same skill.',
    views: { a: 'No calibration', b: 'Auto calibration (mean error)' },
    controls: 'Turn off "Auto play" to play with Space (press when a note reaches the judgement line).',
    info: `
    <p>A rhythm game measures <b>error = input time - note time</b> for each note and grades by its size. A smaller error gets a higher grade. The windows here are Perfect ±33 ms, Great ±66 ms, Good ±100 ms.</p>
    <p>The problem is <b>latency</b> that has nothing to do with skill. Audio output (buffers, Bluetooth at 150~250 ms), display output and input polling all add delay. Players hit along with what they hear, so the mean error shifts by the latency.</p>
    <ul>
      <li><b>No calibration</b>: the error distribution moves outside the windows, so Greats and Goods increase.</li>
      <li><b>Manual offset</b>: the player types an ms value in the settings.</li>
      <li><b>Auto calibration</b>: the player taps along with a steady beat a few times, and the mean error becomes the offset. Many rhythm games use this "calibration" screen.</li>
    </ul>
    <p>Calibration removes only the mean (bias). Hand jitter (standard deviation) remains. The offset is usually applied only to judgement, not to audio playback time.</p>`,
    look: [
      'Look at the error histogram below. A\'s distribution is shifted right (late). B moves to the center after a few notes.',
      'The "Perfect rate" stat is low in A and much higher in B. Both views have the same player skill (hand jitter).',
      'Raise "System latency" to 200 ms (Bluetooth level). A becomes almost all Misses, but B centers again.',
      'Raise "Hand jitter" to 40 ms. B also loses Perfects. Calibration removes bias, not jitter.',
    ],
    refs: ['Causes and measurement of output and input latency.', 'The browser\'s estimate of output latency.', 'Rhythm games and musical interaction.', 'Size of human error and jitter when tapping to a beat.'],
    params: {
      cal: { label: 'Calibration', group: 'Judgement', options: { none: 'None', manual: 'Manual offset', auto: 'Auto (mean of last 16 notes)' } },
      offset: 'Manual offset (ms)',
      win: 'Window scale',
      lat: { label: 'System latency (ms)', group: 'Player and device' },
      jit: 'Hand jitter (ms, std dev)',
      autoplay: 'Auto play',
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

    const BPM = 120, S8 = 60 / BPM / 2, S16 = S8 / 2;
    const GRADES = [{ n: 'Perfect', w: 33, c: C.good }, { n: 'Great', w: 66, c: C.b }, { n: 'Good', w: 100, c: C.warn }];
    const MISS = { n: 'Miss', c: C.bad };
    const syn = makeSynth(19);
    const chartRng = U.rng(ctx.seed + 51), handRng = U.rng(ctx.seed + 52);
    const SCALE = [69, 72, 74, 76, 79, 81];
    const st = { t: 0, step: -1, notes: [], raw: [], errs: [], counts: { Perfect: 0, Great: 0, Good: 0, Miss: 0 }, pop: null, keys: 0, nextNote: 2 };
    const out = [0, 0];

    const offsetMs = () => {
      if (P.cal === 'manual') return P.offset;
      if (P.cal === 'auto' && st.raw.length >= 4) { const r = st.raw.slice(-16); return r.reduce((a, b) => a + b, 0) / r.length; }
      return 0;
    };
    function judge(note, hitT) {
      if (note.done) return;
      const raw = (hitT - note.t) * 1000, e = raw - offsetMs();
      let gr = MISS;
      for (const G of GRADES) if (Math.abs(e) <= G.w * P.win) { gr = G; break; }
      note.done = true; note.err = e; note.grade = gr;
      st.raw.push(raw); if (st.raw.length > 64) st.raw.shift();
      st.errs.push(e); if (st.errs.length > 120) st.errs.shift();
      st.counts[gr.n]++;
      st.pop = { g: gr, e, t: st.t };
      if (gr !== MISS) syn.play('click', { f: 1800, amp: 0.12, pan: 0.2 });
    }
    function miss(note) {
      note.done = true; note.grade = MISS; st.counts.Miss++;
      st.pop = { g: MISS, e: 0, t: st.t };
    }
    function fire(s) {
      const b = s % 16;
      if (b % 4 === 0) syn.play('kick', { amp: b === 0 ? 0.35 : 0.25 });
      if (b === 4 || b === 12) syn.play('snare', { amp: 0.13 });
      if (b % 2 === 0) syn.play('hat', { amp: 0.06, pan: 0.3 });
      if (b % 8 === 0) syn.play('bass', { f: A.mtof([45, 41, 43, 40][Math.floor(s / 16) % 4]), len: S8 * 3, amp: 0.15 });
      // 음표: 8분음표 격자에서 확률로 생성. 음악 안의 소리로도 재생
      if (s % 2 === 0) {
        const nt = st.t + 3;   // 3초 뒤 판정선에 도착하는 음표를 미리 생성
        if (chartRng.next() < 0.55) {
          const hand = st.t + 3 + (P.lat + handRng.gauss() * P.jit) / 1000;
          st.notes.push({ t: nt, m: chartRng.pick(SCALE), hit: hand, done: false, played: false });
        }
      }
    }
    function step(l, r, sr, n) {
      while (st.keys > 0) {
        st.keys--;
        // Space 입력: 가장 가까운 미판정 음표에 판정 (실제 장치 지연이 그대로 들어감)
        const hitT = st.t;
        let best = null;
        for (const nt of st.notes) if (!nt.done && Math.abs(hitT - nt.t) < 0.45 && (!best || Math.abs(hitT - nt.t) < Math.abs(hitT - best.t))) best = nt;
        if (best) judge(best, hitT);
      }
      for (let i = 0; i < n; i++) {
        const s16 = Math.floor(st.t / S16 + 1e-9);
        if (s16 !== st.step) { st.step = s16; fire(s16); }
        for (const nt of st.notes) {
          if (!nt.played && st.t >= nt.t) { nt.played = true; syn.play('pluck', { f: A.mtof(nt.m), len: S8, amp: 0.13, pan: -0.2 }); }
          if (!nt.done && P.autoplay && st.t >= nt.hit) judge(nt, nt.hit);
          if (!nt.done && st.t > nt.t + 0.5 && !(P.autoplay && nt.hit > st.t)) miss(nt);
        }
        out[0] = out[1] = 0;
        syn.tick(sr, out, null);
        l[i] = out[0] * 1.1; r[i] = out[1] * 1.1;
        st.t += 1 / sr;
      }
      st.notes = st.notes.filter((nt) => nt.t > st.t - 2);
      syn.gc();
    }
    const snd = A.player(ctx, { process: step });
    const bufL = new Float32Array(4800), bufR = new Float32Array(4800);

    return {
      update(dt) {
        snd.update();
        if (ctx.input.pressed('Space')) st.keys++;
        if (!snd.on) step(bufL, bufR, 48000, Math.min(4800, Math.round(dt * 48000)));
      },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, tw = W - pad * 2;
        // 레인: 오른쪽에서 왼쪽으로 흐름
        const ly = 24, lh = 44, jx = pad + tw * 0.18, speed = (tw * 0.8) / 3;
        D.rect(g, pad, ly, tw, lh, 'rgba(0,0,0,0.35)');
        D.line(g, jx, ly - 4, jx, ly + lh + 4, C.text, 2);
        for (const nt of st.notes) {
          const x = jx + (nt.t - st.t) * speed;
          if (x < pad || x > pad + tw) continue;
          if (nt.done) D.circle(g, x, ly + lh / 2, 6, null, nt.grade.c, 2);
          else D.circle(g, x, ly + lh / 2, 9, col);
        }
        if (st.pop && st.t - st.pop.t < 0.6) {
          D.text(g, st.pop.g.n + ' ' + (st.pop.e >= 0 ? '+' : '') + st.pop.e.toFixed(0) + 'ms', jx, ly + lh + 6, { size: 12, color: st.pop.g.c, align: 'center' });
        }
        D.text(g, L('판정선', 'Judgement line'), jx + 4, ly - 14, { size: 10, color: C.dim });
        // 오차 히스토그램
        const hy = ly + lh + 30, hh = H - hy - 40, R = 160, X = (ms) => pad + (ms + R) / (2 * R) * tw;
        if (hh > 30) {
          D.rect(g, pad, hy, tw, hh, 'rgba(0,0,0,0.35)');
          for (let k = GRADES.length - 1; k >= 0; k--) {
            const w = GRADES[k].w * P.win;
            D.rect(g, X(-w), hy, X(w) - X(-w), hh, U.rgb(...U.hexToRgb(GRADES[k].c), 0.12));
          }
          const bins = new Array(64).fill(0);
          for (const e of st.errs) { const k = Math.floor((e + R) / (2 * R) * 64); if (k >= 0 && k < 64) bins[k]++; }
          const mx = Math.max(4, ...bins), bw = tw / 64;
          bins.forEach((c, k) => { if (c) D.rect(g, pad + k * bw + 1, hy + hh - c / mx * (hh - 14), bw - 2, c / mx * (hh - 14), col); });
          D.line(g, X(0), hy, X(0), hy + hh, C.text, 1);
          for (const ms of [-150, -100, -50, 50, 100, 150]) D.text(g, (ms > 0 ? '+' : '') + ms, X(ms), hy + hh + 2, { size: 9, color: C.dim, align: 'center' });
          D.text(g, L('판정 오차 (ms, 오른쪽 = 늦음)', 'Judged error (ms, right = late)'), pad + 4, hy + 3, { size: 10, color: C.dim });
        }
        const tot = st.counts.Perfect + st.counts.Great + st.counts.Good + st.counts.Miss;
        const mean = st.errs.length ? st.errs.slice(-32).reduce((a, b) => a + b, 0) / Math.min(32, st.errs.length) : 0;
        ctx.stat(L('Perfect 비율', 'Perfect rate'), tot ? (st.counts.Perfect / tot * 100).toFixed(0) + ' %' : '-');
        ctx.stat(L('판정 수', 'Judgements'), `P ${st.counts.Perfect} / G ${st.counts.Great} / g ${st.counts.Good} / M ${st.counts.Miss}`);
        ctx.stat(L('평균 오차 (최근 32음)', 'Mean error (last 32)'), mean.toFixed(0) + ' ms');
        ctx.stat(L('적용 오프셋', 'Applied offset'), offsetMs().toFixed(0) + ' ms');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
