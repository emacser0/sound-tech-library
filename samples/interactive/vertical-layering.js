// 수직 레이어링: 고정된 한 곡 vs 게임 강도에 따라 스템(stem) 게인을 바꾸는 적응형 음악
GTL.register({
  id: 'vertical-layering',
  title: '수직 레이어링 (Vertical Layering)',
  summary: '한 곡을 패드, 베이스, 드럼, 아르페지오 스템으로 나눠 동시에 재생하고, 게임 강도에 맞춰 각 스템의 음량만 바꿈. 고정된 한 곡은 조용한 장면에서도 전투처럼 들리지만, 레이어링은 박자를 끊지 않고 분위기를 바꿈.',
  views: { a: '고정 트랙 (모든 스템 항상 켬)', b: '레이어링 (강도로 페이드)' },
  controls: '"자동 시나리오"를 끄면 "게임 강도"를 직접 움직일 수 있음',
  info: `
    <p><b>수직 레이어링(Vertical Layering)</b>은 같은 길이, 같은 템포로 만든 여러 스템(stem)을 처음부터 함께 재생하고, 게임 값에 따라 스템의 음량만 바꾸는 적응형 음악 기법. 악보를 위아래로 쌓는다는 뜻에서 "수직". 수직 리믹싱(Vertical Remixing)이라고도 부름.</p>
    <p>모든 스템이 같은 시계로 돌기 때문에 레이어를 켜고 꺼도 박자와 화성이 어긋나지 않음. 그래서 전환을 기다릴 필요 없이 게임 변화에 바로 반응함.</p>
    <ul>
      <li><b>고정 트랙</b>: 장면과 상관없이 같은 편곡. 탐험 중에도 드럼과 리드가 계속 나옴.</li>
      <li><b>스위치</b>: 강도가 문턱을 넘는 순간 스템을 켜고 끔. 반응은 빠르지만 음이 중간에 잘려 툭 끊김.</li>
      <li><b>레이어링</b>: 문턱 근처에서 몇백 ms에 걸쳐 페이드. Wwise의 RTPC, FMOD의 파라미터 오토메이션으로 흔히 만듦.</li>
    </ul>
    <p>단점: 스템을 모두 동시에 재생하므로 음성 수와 메모리가 늘어남. 곡 구조(코드 진행, 템포)는 바꿀 수 없어서 큰 장면 변화에는 수평 재배열과 함께 씀.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="14" class="t-small t-dim">${L('가로: 게임 강도, 세로: 스템 게인', 'x: game intensity, y: stem gain')}</text>
    <line x1="110" y1="170" x2="520" y2="170" class="d-line"/>
    <text x="110" y="184" class="t-small" text-anchor="middle">0</text><text x="520" y="184" class="t-small" text-anchor="end">1</text>
    <text x="100" y="42" text-anchor="end" class="t-small">${L('패드', 'Pad')}</text>
    <text x="100" y="74" text-anchor="end" class="t-small">${L('베이스', 'Bass')}</text>
    <text x="100" y="106" text-anchor="end" class="t-small">${L('드럼', 'Drums')}</text>
    <text x="100" y="138" text-anchor="end" class="t-small">${L('아르페지오', 'Arpeggio')}</text>
    <path d="M110,30 L520,30" class="d-b"/>
    <path d="M110,82 L190,82 Q215,82 225,72 Q235,62 260,62 L520,62" class="d-b"/>
    <path d="M110,114 L295,114 Q320,114 330,104 Q340,94 365,94 L520,94" class="d-b"/>
    <path d="M110,146 L397,146 Q422,146 432,136 Q442,126 467,126 L520,126" class="d-b"/>
    <path d="M110,40 L520,40 M110,72 L520,72 M110,104 L520,104 M110,136 L520,136" class="d-a" stroke-dasharray="5 4" opacity="0.7"/>
    <line x1="227" y1="20" x2="227" y2="170" class="d-dim" stroke-dasharray="3 3"/><line x1="332" y1="20" x2="332" y2="170" class="d-dim" stroke-dasharray="3 3"/><line x1="434" y1="20" x2="434" y2="170" class="d-dim" stroke-dasharray="3 3"/>
    <text x="330" y="160" class="t-small t-dim" text-anchor="middle">${L('문턱 근처에서 페이드', 'fade near each threshold')}</text>
    <text x="516" y="22" class="t-small t-b" text-anchor="end">${L('B 레이어링', 'B layering')}</text>
    <text x="516" y="52" class="t-small t-a" text-anchor="end">${L('A 항상 켬', 'A always on')}</text>
  </svg>`,
  look: [
    '자동 시나리오의 조용한 구간을 보면 A는 드럼과 아르페지오가 계속 울리고, B는 패드만 남음',
    '방식을 "스위치"로 바꾸고 "페이드 시간"과 비교하면 문턱을 넘을 때 스템 게인 막대가 0에서 100%로 바로 튐',
    '"소리 켜기"를 누르고 강도가 오를 때 B를 들으면 박자가 끊기지 않고 악기가 하나씩 더해짐',
    '"페이드 시간"을 2000ms로 늘리면 B의 반응이 느려져 강도가 짧게 튈 때는 레이어가 다 올라오지 않음',
  ],
  refs: [
    { type: 'book', title: 'Karen Collins, Game Sound: An Introduction to the History, Theory, and Practice of Video Game Music and Sound Design', year: 2008, note: '적응형 음악의 수직, 수평 기법 분류' },
    { type: 'book', title: 'Winifred Phillips, A Composer\'s Guide to Game Music', year: 2014, note: '수직 레이어링과 수평 재배열을 작곡가 관점에서 설명' },
    { type: 'book', title: 'Michael Sweet, Writing Interactive Music for Video Games', year: 2014, note: '레이어 설계와 스템 구성' },
    { type: 'engine', title: 'Audiokinetic Wwise Help - Game Parameters (RTPC)', url: 'https://www.audiokinetic.com/library/edge/?source=Help&id=working_with_game_parameters', note: '게임 값으로 버스, 트랙 볼륨을 움직이는 방법' },
  ],
  params: [
    { key: 'mode', label: '방식', type: 'select', options: [{ value: 'fixed', label: '고정 트랙' }, { value: 'switch', label: '스위치 (즉시 켜고 끔)' }, { value: 'layers', label: '레이어링 (페이드)' }], a: 'fixed', b: 'layers', group: '레이어' },
    { key: 'fade', label: '페이드 시간 (ms)', type: 'range', min: 20, max: 2000, step: 10, default: 400, when: (p) => p.mode === 'layers' },
    { key: 'auto', label: '자동 시나리오', type: 'bool', default: true, shared: true, group: '게임', help: '32초 동안 탐험, 긴장, 전투, 회복을 반복' },
    { key: 'intensity', label: '게임 강도', type: 'range', min: 0, max: 1, step: 0.01, default: 0.3, shared: true, when: (p) => !p.auto },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Vertical Layering',
    summary: 'The song is split into pad, bass, drums and arpeggio stems that play together. Only the stem volumes follow the game intensity. A fixed track sounds like combat even in quiet scenes. Layering changes the mood without breaking the beat.',
    views: { a: 'Fixed track (all stems on)', b: 'Layering (fade by intensity)' },
    controls: 'Turn off "Auto scenario" to move "Game intensity" by hand.',
    info: `
    <p><b>Vertical layering</b> is an adaptive music technique. Several stems with the same length and tempo start together, and only their volumes follow a game value. "Vertical" means stacking parts on top of each other in the score. It is also called vertical remixing.</p>
    <p>All stems run on one clock, so turning layers on and off never breaks the beat or the harmony. The music can react at once, without waiting for a transition.</p>
    <ul>
      <li><b>Fixed track</b>: the same arrangement in every scene. Drums and lead keep playing while you explore.</li>
      <li><b>Switch</b>: a stem turns on or off the moment intensity crosses its threshold. Fast, but notes are cut in the middle.</li>
      <li><b>Layering</b>: fades over a few hundred ms near each threshold. Usually built with an RTPC in Wwise or parameter automation in FMOD.</li>
    </ul>
    <p>Downsides: all stems play at the same time, so voice count and memory go up. The song structure (chords, tempo) cannot change, so big scene changes also need horizontal re-sequencing.</p>`,
    look: [
      'Watch the quiet part of the auto scenario. A keeps the drums and arpeggio playing. B keeps only the pad.',
      'Set the method to "Switch". When intensity crosses a threshold, the stem gain bar jumps from 0 to 100% at once.',
      'Press "Sound on" and listen to B while intensity rises. Instruments join one by one and the beat never breaks.',
      'Raise "Fade time" to 2000 ms. B reacts slowly, and short intensity peaks do not bring the layers all the way up.',
    ],
    refs: ['Classification of vertical and horizontal adaptive music.', 'Vertical layering and horizontal re-sequencing from a composer\'s view.', 'Layer design and stem layout.', 'Driving bus and track volume from game values.'],
    params: {
      mode: { label: 'Method', group: 'Layers', options: { fixed: 'Fixed track', switch: 'Switch (instant on/off)', layers: 'Layering (fade)' } },
      fade: 'Fade time (ms)',
      auto: { label: 'Auto scenario', group: 'Game', help: 'Explore, tension, combat and recovery repeat every 32 s' },
      intensity: 'Game intensity',
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

    const BPM = 112, S16 = 60 / BPM / 4;
    // Am F C G. 코드 구성음과 베이스 근음
    const CHORDS = [[57, 60, 64], [53, 57, 60], [52, 55, 60], [55, 59, 62]], ROOTS = [45, 41, 48, 43];
    const STEMS = [
      { ko: '패드', en: 'Pad', th: -1 },
      { ko: '베이스', en: 'Bass', th: 0.25 },
      { ko: '드럼', en: 'Drums', th: 0.5 },
      { ko: '아르페지오', en: 'Arpeggio', th: 0.75 },
    ];
    const ARP = [0, 1, 2, 1, 0, 2, 1, 2];
    const HN = 240, HDT = 0.05;   // 기록: 12초
    const syn = makeSynth(7);
    const st = { t: 0, step: -1, I: 0, g: [1, 0, 0, 0], hit: [0, 0, 0, 0], histT: 0, hi: 0, hI: new Float32Array(HN), hG: [0, 1, 2, 3].map(() => new Float32Array(HN)) };
    const out = [0, 0];

    // 자동 시나리오: 탐험 → 긴장 → 전투 → 회복 (32초 주기)
    function scenario(t) {
      const u = (t % 32) / 32;
      if (u < 0.22) return 0.1 + 0.04 * Math.sin(t * 1.3);
      if (u < 0.45) return 0.1 + (u - 0.22) / 0.23 * 0.5;
      if (u < 0.5) return 0.6 + (u - 0.45) / 0.05 * 0.35;
      if (u < 0.75) return 0.95 - 0.08 * Math.max(0, Math.sin(t * 2.1));
      return 0.95 - (u - 0.75) / 0.25 * 0.85;
    }
    function target(k, I) {
      if (P.mode === 'fixed' || k === 0) return 1;
      if (P.mode === 'switch') return I >= STEMS[k].th ? 1 : 0;
      return U.smoothstep(STEMS[k].th - 0.06, STEMS[k].th + 0.06, I);
    }
    function fire(step) {
      const bar = Math.floor(step / 16) % 4, s = step % 16, ch = CHORDS[bar];
      const bl = S16 * 16;
      if (s === 0) { ch.forEach((m, i) => syn.play('pad', { f: A.mtof(m), len: bl * 0.92, amp: 0.16, bus: 0, pan: (i - 1) * 0.4 })); st.hit[0] = 1; }
      if (s % 2 === 0) { syn.play('bass', { f: A.mtof(ROOTS[bar] + (s % 4 === 2 ? 12 : 0)), len: S16 * 1.5, amp: 0.2, bus: 1 }); st.hit[1] = 1; }
      if (s === 0 || s === 8 || s === 10) { syn.play('kick', { amp: 0.42, bus: 2 }); st.hit[2] = 1; }
      if (s === 4 || s === 12) { syn.play('snare', { amp: 0.2, bus: 2 }); st.hit[2] = 1; }
      if (s % 2 === 0) syn.play(s === 14 ? 'ohat' : 'hat', { amp: 0.12, bus: 2, pan: 0.3 });
      syn.play('pluck', { f: A.mtof(ch[ARP[s % 8]] + 12 + (s >= 8 ? 12 : 0)), len: S16 * 0.8, amp: 0.09, bus: 3, pan: -0.3 }); st.hit[3] = Math.max(st.hit[3], 0.6);
    }
    // 오디오 블록 하나 진행. 소리를 끈 상태에서는 update()가 같은 함수로 시간을 진행
    function step(l, r, sr, n) {
      const I = P.auto ? scenario(st.t) : P.intensity;
      st.I = I;
      const k = 1 - Math.exp(-1 / (Math.max(0.02, P.fade / 1000) * sr));
      const tg = [0, 1, 2, 3].map((i) => target(i, I));
      for (let i = 0; i < n; i++) {
        const s16 = Math.floor(st.t / S16);
        if (s16 !== st.step) { st.step = s16; fire(s16); }
        for (let j = 0; j < 4; j++) st.g[j] = P.mode === 'layers' ? st.g[j] + (tg[j] - st.g[j]) * k : tg[j];
        out[0] = out[1] = 0;
        syn.tick(sr, out, st.g);
        l[i] = out[0] * 0.75; r[i] = out[1] * 0.75;
        st.t += 1 / sr;
      }
      syn.gc();
      while (st.histT <= st.t) {
        st.hI[st.hi % HN] = I;
        for (let j = 0; j < 4; j++) st.hG[j][st.hi % HN] = st.g[j];
        st.hi++; st.histT += HDT;
      }
    }
    const snd = A.player(ctx, { process: step });
    const bufL = new Float32Array(4800), bufR = new Float32Array(4800);

    return {
      update(dt) {
        snd.update();
        if (!snd.on) step(bufL, bufR, 48000, Math.min(4800, Math.round(dt * 48000)));
        for (let j = 0; j < 4; j++) st.hit[j] = Math.max(0, st.hit[j] - dt * 5);
      },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        // 강도 기록
        const ph = Math.max(60, H * 0.3), pw = W - pad * 2;
        D.rect(g, pad, pad, pw, ph, 'rgba(0,0,0,0.35)');
        const cnt = Math.min(HN, st.hi), x0 = pad;
        const hx = (i) => x0 + pw * (1 - (cnt - 1 - i) / (HN - 1));
        if (P.mode !== 'fixed') for (let k = 1; k < 4; k++) {
          const y = pad + ph - STEMS[k].th * (ph - 6) - 3;
          D.line(g, pad, y, pad + pw, y, 'rgba(255,255,255,0.15)', 1);
          D.text(g, L(STEMS[k].ko, STEMS[k].en), pad + pw - 4, y - 12, { size: 9, color: C.dim, align: 'right' });
        }
        g.beginPath();
        for (let i = 0; i < cnt; i++) {
          const v = st.hI[(st.hi - cnt + i) % HN], px = hx(i), py = pad + ph - v * (ph - 6) - 3;
          i ? g.lineTo(px, py) : g.moveTo(px, py);
        }
        g.strokeStyle = C.warn; g.lineWidth = 2; g.stroke();
        D.text(g, L('게임 강도 (최근 12초)', 'Game intensity (last 12 s)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 스템 줄
        const ry = pad * 2 + ph, rh = (H - ry - pad - 16) / 4, lw = Math.min(90, W * 0.2);
        for (let k = 0; k < 4; k++) {
          const y = ry + k * rh, h = rh - 6, gv = st.g[k];
          D.rect(g, pad, y, W - pad * 2, h, 'rgba(0,0,0,0.3)');
          const lit = st.hit[k] * gv;
          D.rect(g, pad, y, 6, h, U.rgb(255, 255, 255, 0.15 + 0.7 * lit));
          D.text(g, L(STEMS[k].ko, STEMS[k].en), pad + 12, y + h / 2 - 6, { size: 11, color: gv > 0.05 ? C.text : C.dim });
          // 게인 막대
          const bx = pad + lw, bw = Math.min(70, W * 0.14);
          D.rect(g, bx, y + h * 0.25, bw, h * 0.5, 'rgba(255,255,255,0.07)');
          D.rect(g, bx, y + h * 0.25, bw * gv, h * 0.5, col);
          D.text(g, Math.round(gv * 100) + '%', bx + bw + 4, y + h / 2 - 6, { size: 10, color: C.dim });
          // 게인 기록
          const gx = bx + bw + 40, gw = W - pad - gx - 4;
          if (gw > 20) {
            g.beginPath();
            for (let i = 0; i < cnt; i++) {
              const v = st.hG[k][(st.hi - cnt + i) % HN], px = gx + gw * (1 - (cnt - 1 - i) / (HN - 1)), py = y + h - 3 - v * (h - 6);
              i ? g.lineTo(px, py) : g.moveTo(px, py);
            }
            g.strokeStyle = col; g.lineWidth = 1.5; g.stroke();
          }
        }
        const beat = Math.floor(st.t / (S16 * 4));
        D.text(g, L('마디 ', 'Bar ') + (Math.floor(beat / 4) % 4 + 1) + '  ' + L('박 ', 'beat ') + (beat % 4 + 1) + '   ' + BPM + ' BPM', pad, H - pad - 12, { size: 10, color: C.dim });
        ctx.stat(L('게임 강도', 'Game intensity'), st.I.toFixed(2));
        ctx.stat(L('들리는 스템 수', 'Audible stems'), st.g.filter((v) => v > 0.5).length + ' / 4');
        ctx.stat(L('스템 게인', 'Stem gains'), st.g.map((v) => Math.round(v * 100)).join(' / ') + ' %');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
