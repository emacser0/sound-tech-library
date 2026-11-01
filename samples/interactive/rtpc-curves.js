// RTPC 매핑 곡선: 게임 값(체력)을 오디오 값(컷오프, 음량)으로 바꾸는 곡선. 선형 vs 로그 vs S 곡선
GTL.register({
  id: 'rtpc-curves',
  title: 'RTPC 매핑 곡선',
  summary: '체력이 줄수록 음악을 먹먹하게(로우패스) 만드는 연출에서, 체력을 Hz에 선형으로 연결하면 체력 대부분 구간에서 거의 안 바뀌다가 끝에서 갑자기 막힘. 귀는 주파수를 옥타브(로그)로 느끼므로 로그 곡선이 고르게 바뀜.',
  views: { a: '선형 (Hz)', b: '로그 (옥타브)' },
  controls: '"자동 시나리오"를 끄면 "체력"을 직접 움직일 수 있음',
  info: `
    <p><b>RTPC(Real-Time Parameter Control)</b>는 게임 값을 오디오 값에 연결하는 Wwise 용어. FMOD에서는 파라미터와 오토메이션 곡선이라 부름. 체력, 속도, 고도, 거리 같은 값을 받아 볼륨, 필터 컷오프, 피치, 센드 양을 움직임.</p>
    <p>연결하는 <b>곡선 모양</b>이 결과를 좌우함. 사람의 귀는 주파수를 비율(옥타브)로, 크기를 dB로 느낌. 그래서 Hz나 진폭에 선형으로 연결하면 느낌이 고르지 않음.</p>
    <ul>
      <li><b>선형</b>: f = 200 + (18000 - 200) × x. 체력 50%여도 컷오프가 9kHz라 거의 그대로 들림. 체력 10% 아래에서 갑자기 막힘.</li>
      <li><b>로그(지수)</b>: f = 200 × 90<sup>x</sup>. 체력 10%마다 같은 옥타브만큼 내려가 고르게 바뀜.</li>
      <li><b>S 곡선</b>: 로그 곡선의 양 끝을 완만하게. 체력이 가득하거나 바닥일 때는 거의 안 바뀌고 가운데에서 빨리 바뀜. 연출 의도를 담을 때 씀.</li>
    </ul>
    <p>음량도 같음. 진폭에 선형으로 연결하면 위쪽 절반은 6dB밖에 안 줄다가 아래에서 급하게 사라짐. dB에 선형인 곡선이 고르게 들림.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="14" class="t-small t-dim">${L('가로: 체력, 세로: 컷오프 (로그 축 = 귀가 느끼는 높이)', 'x: health, y: cutoff (log axis = how the ear hears it)')}</text>
    <line x1="60" y1="160" x2="300" y2="160" class="d-line"/><line x1="60" y1="160" x2="60" y2="24" class="d-line"/>
    <text x="56" y="30" text-anchor="end" class="t-small">18k</text><text x="56" y="100" text-anchor="end" class="t-small">2k</text><text x="56" y="160" text-anchor="end" class="t-small">200</text>
    <text x="60" y="174" class="t-small">0%</text><text x="300" y="174" text-anchor="end" class="t-small">100%</text>
    <path d="M60,160 C68,95 90,62 120,50 C170,36 240,28 300,26" class="d-a"/>
    <path d="M60,160 L300,26" class="d-b"/>
    <path d="M60,160 C140,160 120,26 300,26" class="d-accent" stroke-dasharray="4 3"/>
    <text x="110" y="42" class="t-small t-a">${L('선형 (Hz)', 'Linear (Hz)')}</text>
    <text x="210" y="96" class="t-small t-b">${L('로그', 'Log')}</text>
    <text x="196" y="140" class="t-small">${L('S 곡선', 'S-curve')}</text>
    <text x="330" y="50" class="t-small t-a">${L('A: 체력 100%~20% 사이에서', 'A: from 100% to 20% health')}</text>
    <text x="330" y="66" class="t-small t-a">${L('2.3옥타브만 내려감', 'drops only 2.3 octaves')}</text>
    <text x="330" y="96" class="t-small t-a">${L('20%~0%에서 4.2옥타브', 'and 4.2 octaves from 20% to 0%')}</text>
    <text x="330" y="130" class="t-small t-b">${L('B: 10%마다 0.65옥타브씩', 'B: 0.65 octave per 10%')}</text>
  </svg>`,
  look: [
    '곡선 그래프 오른쪽의 10% 눈금을 보면 A는 위쪽에 몰려 있고 B는 고르게 퍼져 있음',
    '"소리 켜기"를 누르고 A를 들으면 체력이 꽤 줄어도 음악이 그대로이다가 바닥 근처에서 갑자기 먹먹해짐',
    '대상을 "음량"으로 바꾸면 같은 문제가 dB 축에서 보임. 선형 진폭은 체력 50%에서 -6dB밖에 안 됨.',
    '곡선을 "S 곡선"으로 바꾸면 체력 가득과 바닥 근처에서는 거의 안 바뀌고 가운데에서 빨리 바뀜',
  ],
  refs: [
    { type: 'engine', title: 'Audiokinetic Wwise Help - Game Parameters (RTPC) and RTPC curves', url: 'https://www.audiokinetic.com/library/edge/?source=Help&id=working_with_game_parameters', note: '게임 파라미터를 속성에 연결하고 곡선 모양(Linear, Log, Exp, S-Curve)을 고름' },
    { type: 'engine', title: 'FMOD Studio User Manual - Parameters and Automation', url: 'https://www.fmod.com/docs/2.02/studio/', note: '파라미터로 오토메이션 곡선을 움직임' },
    { type: 'book', title: 'Thomas D. Rossing, F. Richard Moore, Paul A. Wheeler, The Science of Sound, 3rd ed.', year: 2002, note: '음 높이와 크기 지각이 로그에 가까운 이유' },
    { type: 'book', title: 'Guy Somberg (ed.), Game Audio Programming: Principles and Practices', year: 2016, note: '게임 값과 오디오 파라미터 연결' },
  ],
  params: [
    { key: 'curve', label: '곡선', type: 'select', options: [{ value: 'lin', label: '선형' }, { value: 'log', label: '로그 (지수)' }, { value: 's', label: 'S 곡선' }], a: 'lin', b: 'log', group: 'RTPC' },
    { key: 'target', label: '대상', type: 'select', options: [{ value: 'cutoff', label: '로우패스 컷오프' }, { value: 'volume', label: '음량' }], default: 'cutoff', shared: true },
    { key: 'auto', label: '자동 시나리오', type: 'bool', default: true, shared: true, group: '게임', help: '체력이 16초 주기로 100%와 0% 사이를 오감' },
    { key: 'health', label: '체력 (%)', type: 'range', min: 0, max: 100, step: 1, default: 40, shared: true, when: (p) => !p.auto },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'RTPC Mapping Curves',
    summary: 'A common effect makes music muffled (lowpass) as health drops. If health maps linearly to Hz, almost nothing changes for most of the range, then the sound closes suddenly at the end. The ear hears frequency in octaves (log), so a log curve changes evenly.',
    views: { a: 'Linear (Hz)', b: 'Log (octaves)' },
    controls: 'Turn off "Auto scenario" to move "Health" by hand.',
    info: `
    <p><b>RTPC (Real-Time Parameter Control)</b> is the Wwise name for linking a game value to an audio value. FMOD calls it parameters and automation curves. Values like health, speed, altitude and distance move volume, filter cutoff, pitch and send amounts.</p>
    <p>The <b>curve shape</b> decides the result. The ear hears frequency as ratios (octaves) and loudness in dB. So a linear link to Hz or amplitude does not feel even.</p>
    <ul>
      <li><b>Linear</b>: f = 200 + (18000 - 200) × x. At 50% health the cutoff is still 9 kHz, so it sounds almost the same. Below 10% it closes suddenly.</li>
      <li><b>Log (exponential)</b>: f = 200 × 90<sup>x</sup>. Every 10% of health drops the same number of octaves, so the change is even.</li>
      <li><b>S-curve</b>: the log curve with gentle ends. Little change near full or empty health, fast change in the middle. Use it to express a design intent.</li>
    </ul>
    <p>Volume works the same way. A linear link to amplitude drops only 6 dB over the top half, then fades out fast at the bottom. A curve that is linear in dB sounds even.</p>`,
    look: [
      'Look at the 10% ticks right of the curve graph. In A they crowd at the top. In B they are evenly spread.',
      'Press "Sound on" and listen to A. The music stays the same while health drops a lot, then gets muffled suddenly near the bottom.',
      'Set the target to "Volume". The same problem shows on the dB axis. Linear amplitude is only -6 dB at 50% health.',
      'Set the curve to "S-curve". Little changes near full and empty health, and the middle changes fast.',
    ],
    refs: ['Link game parameters to properties and pick the curve shape (Linear, Log, Exp, S-Curve).', 'Parameters drive automation curves.', 'Why pitch and loudness perception is close to logarithmic.', 'Linking game values to audio parameters.'],
    params: {
      curve: { label: 'Curve', group: 'RTPC', options: { lin: 'Linear', log: 'Log (exponential)', s: 'S-curve' } },
      target: { label: 'Target', options: { cutoff: 'Lowpass cutoff', volume: 'Volume' } },
      auto: { label: 'Auto scenario', group: 'Game', help: 'Health moves between 100% and 0% every 16 s' },
      health: 'Health (%)',
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

    const FMIN = 200, FMAX = 18000, DBMIN = -40;
    // 곡선: x(0~1) → 0~1 (선형은 Hz 또는 진폭 기준, 나머지는 옥타브 또는 dB 기준)
    function map(curve, target, x) {
      const s = curve === 's' ? U.smoothstep(0, 1, x) : x;
      if (target === 'cutoff') return curve === 'lin' ? FMIN + (FMAX - FMIN) * x : FMIN * Math.pow(FMAX / FMIN, s);
      if (curve === 'lin') return x;                      // 진폭
      return x <= 0 ? 0 : A.dbToLin(DBMIN * (1 - s));     // dB에 선형
    }
    const BPM = 108, S16 = 60 / BPM / 4;
    const CH = [[57, 60, 64, 67], [53, 57, 60, 64], [48, 52, 55, 59], [55, 59, 62, 65]];
    const syn = makeSynth(17);
    const st = { t: 0, step: -1, x: 1, fc: FMAX, gain: 1, cut: FMAX, vol: 1, hist: [] };
    const out = [0, 0];
    // 4차 로우패스 (2단 바이쿼드), 계수는 32샘플마다 갱신
    const fl = [{ x1: 0, x2: 0, y1: 0, y2: 0 }, { x1: 0, x2: 0, y1: 0, y2: 0 }, { x1: 0, x2: 0, y1: 0, y2: 0 }, { x1: 0, x2: 0, y1: 0, y2: 0 }];
    const cf = { b0: 1, b1: 0, b2: 0, a1: 0, a2: 0 };
    function setLP(fc, sr) {
      const w = 2 * Math.PI * U.clamp(fc, 20, sr * 0.45) / sr, cw = Math.cos(w), al = Math.sin(w) / (2 * 0.707), a0 = 1 + al;
      cf.b0 = (1 - cw) / 2 / a0; cf.b1 = (1 - cw) / a0; cf.b2 = cf.b0; cf.a1 = -2 * cw / a0; cf.a2 = (1 - al) / a0;
    }
    const bq = (s, x) => { const y = cf.b0 * x + cf.b1 * s.x1 + cf.b2 * s.x2 - cf.a1 * s.y1 - cf.a2 * s.y2; s.x2 = s.x1; s.x1 = x; s.y2 = s.y1; s.y1 = y; return y; };

    function fire(s) {
      const bar = Math.floor(s / 16) % 4, b = s % 16, ch = CH[bar];
      if (b === 0) ch.forEach((m, i) => syn.play('pad', { f: A.mtof(m), len: S16 * 15, amp: 0.07, pan: (i - 1.5) * 0.3 }));
      if (b % 2 === 0) syn.play('bass', { f: A.mtof(ch[0] - 12), len: S16 * 1.5, amp: 0.15 });
      if (b === 0 || b === 10) syn.play('kick', { amp: 0.32 });
      if (b === 4 || b === 12) syn.play('snare', { amp: 0.16 });
      syn.play('hat', { amp: b % 2 ? 0.05 : 0.1, pan: 0.3 });
      syn.play('pluck', { f: A.mtof(ch[[0, 2, 1, 3][b % 4]] + 12), len: S16, amp: 0.08, pan: -0.3 });
    }
    function step(l, r, sr, n) {
      const hp = P.auto ? 50 + 50 * Math.cos(2 * Math.PI * st.t / 16) : P.health;
      st.x = hp / 100;
      const isCut = P.target === 'cutoff';
      st.cut = isCut ? map(P.curve, 'cutoff', st.x) : FMAX;
      st.vol = isCut ? 1 : map(P.curve, 'volume', st.x);
      const k = 1 - Math.exp(-1 / (0.03 * sr));
      for (let i = 0; i < n; i++) {
        st.fc += (st.cut - st.fc) * k; st.gain += (st.vol - st.gain) * k;
        if ((i & 31) === 0) setLP(st.fc, sr);
        const s16 = Math.floor(st.t / S16 + 1e-9);
        if (s16 !== st.step) { st.step = s16; fire(s16); }
        out[0] = out[1] = 0;
        syn.tick(sr, out, null);
        l[i] = bq(fl[1], bq(fl[0], out[0])) * st.gain * 0.9;
        r[i] = bq(fl[3], bq(fl[2], out[1])) * st.gain * 0.9;
        st.t += 1 / sr;
      }
      syn.gc();
    }
    const snd = A.player(ctx, { process: step });
    const bufL = new Float32Array(4800), bufR = new Float32Array(4800);

    return {
      update(dt) {
        snd.update();
        if (!snd.on) step(bufL, bufR, 48000, Math.min(4800, Math.round(dt * 48000)));
      },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, isCut = P.target === 'cutoff';
        // 곡선 그래프. 세로축은 로그 Hz 또는 dB (귀가 느끼는 축)
        const gx = pad + 34, gy = 24, gw = Math.min(W * 0.55, W - gx - 60), gh = H - gy - 70;
        const yv = (v) => (isCut ? Math.log(v / FMIN) / Math.log(FMAX / FMIN) : U.clamp((A.linToDb(Math.max(v, 1e-6)) - DBMIN * 1.2) / (-DBMIN * 1.2), 0, 1));
        D.rect(g, gx, gy, gw, gh, 'rgba(0,0,0,0.35)');
        const marks = isCut ? [200, 500, 1000, 2000, 5000, 10000, 18000] : [0, -6, -12, -24, -36, -48];
        for (const m of marks) {
          const v = isCut ? m : A.dbToLin(m), y = gy + gh - yv(v) * gh;
          D.line(g, gx, y, gx + gw, y, C.grid, 1);
          D.text(g, isCut ? (m >= 1000 ? m / 1000 + 'k' : m) : m + 'dB', gx - 3, y - 5, { size: 9, color: C.dim, align: 'right' });
        }
        for (const c of ['lin', 'log', 's']) {
          g.beginPath();
          for (let i = 0; i <= 100; i++) { const x = gx + gw * i / 100, y = gy + gh - yv(map(c, P.target, i / 100)) * gh; i ? g.lineTo(x, y) : g.moveTo(x, y); }
          g.strokeStyle = c === P.curve ? col : 'rgba(255,255,255,0.18)'; g.lineWidth = c === P.curve ? 2.5 : 1; g.stroke();
        }
        // 10% 눈금 (오른쪽)
        for (let i = 0; i <= 10; i++) {
          const y = gy + gh - yv(map(P.curve, P.target, i / 10)) * gh;
          D.line(g, gx + gw + 4, y, gx + gw + 16, y, col, i % 5 === 0 ? 2 : 1);
        }
        D.text(g, L('10% 눈금', '10% ticks'), gx + gw + 4, gy - 12, { size: 9, color: C.dim });
        const v = isCut ? st.cut : st.vol, px = gx + st.x * gw, pyy = gy + gh - yv(v) * gh;
        D.line(g, px, gy + gh, px, pyy, C.warn, 1);
        D.circle(g, px, pyy, 5, C.warn);
        D.text(g, L('체력 →', 'Health →'), gx + gw, gy + gh + 4, { size: 10, color: C.dim, align: 'right' });
        D.text(g, isCut ? L('컷오프 (로그 축)', 'Cutoff (log axis)') : L('음량 (dB 축)', 'Volume (dB axis)'), gx, gy - 14, { size: 10, color: C.dim });
        // 오른쪽: 필터 응답 또는 미터
        const rx = gx + gw + 50, rw = W - rx - pad;
        if (rw > 50) {
          if (isCut) {
            const c2 = { b0: 0, b1: 0, b2: 0, a1: 0, a2: 0 };
            const w = 2 * Math.PI * st.cut / 48000, cw = Math.cos(w), al = Math.sin(w) / 1.414, a0 = 1 + al;
            c2.b0 = (1 - cw) / 2 / a0; c2.b1 = (1 - cw) / a0; c2.b2 = c2.b0; c2.a1 = -2 * cw / a0; c2.a2 = (1 - al) / a0;
            A.drawResponse(g, (f) => 2 * A.biquadResponse(c2, f, 48000).db, rx, gy, rw, gh * 0.6, { color: col, minDb: -48, maxDb: 6, label: L('필터 응답', 'Filter response') });
          } else {
            A.drawMeter(g, rx + rw / 2 - 10, gy, 20, gh * 0.6, A.linToDb(st.vol), { color: col, label: L('음량', 'Volume') });
          }
        }
        const oct = isCut ? Math.log2(FMAX / st.cut) : 0;
        D.text(g, isCut ? L('20kHz 근처에서 내려간 옥타브: ', 'Octaves below the top: ') + oct.toFixed(1) : L('감쇠: ', 'Attenuation: ') + A.linToDb(Math.max(st.vol, 1e-6)).toFixed(1) + ' dB', pad, H - 22, { size: 11, color: col });
        ctx.stat(L('체력', 'Health'), Math.round(st.x * 100) + ' %');
        if (isCut) ctx.stat(L('컷오프', 'Cutoff'), Math.round(st.cut) + ' Hz');
        else ctx.stat(L('음량', 'Volume'), A.linToDb(Math.max(st.vol, 1e-6)).toFixed(1) + ' dB');
        const half = map(P.curve, P.target, 0.5);
        ctx.stat(L('체력 50%일 때', 'At 50% health'), isCut ? Math.round(half) + ' Hz' : A.linToDb(half).toFixed(1) + ' dB');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
