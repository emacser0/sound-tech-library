// 음악 상태 기계: 위협도 문턱 하나로 바로 전환 (상태가 계속 뒤집힘) vs 히스테리시스 + 최소 유지 시간 + 마디 맞춤
GTL.register({
  id: 'music-state-machine',
  title: '음악 상태 기계와 히스테리시스',
  summary: '게임의 위협도 같은 값은 문턱 근처에서 계속 오르내림. 문턱 하나로 바로 음악 상태를 바꾸면 탐험과 긴장 음악이 1초마다 뒤집힘. 들어가는 문턱과 나오는 문턱을 다르게 두고(히스테리시스) 최소 유지 시간과 마디 맞춤을 더하면 상태가 안정됨.',
  views: { a: '문턱 하나, 즉시 전환', b: '히스테리시스 + 유지 시간 + 마디' },
  controls: '조작 없음. 파라미터로 전환 규칙을 바꿈.',
  info: `
    <p>적응형 음악은 보통 <b>상태 기계(State Machine)</b>로 만듦. 상태(탐험, 긴장, 전투)마다 음악이 있고, 게임 값과 규칙에 따라 상태 사이를 옮겨 감. Wwise의 State, Switch와 Music Switch Container, FMOD의 파라미터와 전환 영역이 이 구조.</p>
    <p>게임 값은 깨끗하지 않음. 적이 시야 경계에서 들락날락하면 위협도가 문턱 근처에서 흔들림. 문턱 하나로 판단하면 상태가 계속 뒤집히는 <b>떨림(chattering)</b>이 생김. 플레이어에게는 음악이 고장 난 것처럼 들림.</p>
    <ul>
      <li><b>히스테리시스(Hysteresis)</b>: 들어가는 문턱은 높게, 나오는 문턱은 낮게. 그 사이에서는 지금 상태를 유지. 온도 조절기와 같은 원리.</li>
      <li><b>최소 유지 시간</b>: 상태에 들어간 뒤 몇 초 동안은 나가지 않음</li>
      <li><b>마디 맞춤</b>: 전환을 다음 마디까지 미룸. 그 사이 원래 상태로 돌아오면 전환을 취소.</li>
    </ul>
    <p>단점: 규칙이 강할수록 반응이 늦어짐. 전투 시작처럼 바로 반응해야 하는 전환은 유지 시간 없이 스팅어와 함께 바로 넘어가고, 전투 종료처럼 천천히 가도 되는 전환에만 긴 유지 시간을 주는 식으로 방향마다 규칙을 다르게 둠.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <circle cx="70" cy="60" r="34" class="f-dim"/><text x="70" y="64" text-anchor="middle">${L('탐험', 'Explore')}</text>
    <circle cx="270" cy="60" r="34" class="f-dim"/><text x="270" y="64" text-anchor="middle">${L('긴장', 'Tension')}</text>
    <circle cx="470" cy="60" r="34" class="f-dim"/><text x="470" y="64" text-anchor="middle">${L('전투', 'Combat')}</text>
    <path d="M106,48 Q170,24 234,48" class="d-accent" marker-end="url(#arr)"/><path d="M234,72 Q170,96 106,72" class="d-accent" marker-end="url(#arr)"/>
    <path d="M306,48 Q370,24 434,48" class="d-accent" marker-end="url(#arr)"/><path d="M434,72 Q370,96 306,72" class="d-accent" marker-end="url(#arr)"/>
    <text x="170" y="24" text-anchor="middle" class="t-small">${L('위협 > 0.3 + h', 'threat > 0.3 + h')}</text><text x="170" y="106" text-anchor="middle" class="t-small">${L('위협 < 0.3 - h', 'threat < 0.3 - h')}</text>
    <text x="370" y="24" text-anchor="middle" class="t-small">${L('위협 > 0.6 + h', 'threat > 0.6 + h')}</text><text x="370" y="106" text-anchor="middle" class="t-small">${L('위협 < 0.6 - h', 'threat < 0.6 - h')}</text>
    <line x1="20" y1="150" x2="520" y2="150" class="d-dim"/><text x="20" y="144" class="t-small t-dim">${L('위협도', 'threat')}</text>
    <rect x="150" y="140" width="60" height="20" class="f-b" opacity="0.3"/><text x="180" y="176" text-anchor="middle" class="t-small t-b">${L('유지 구간 (2h)', 'hold band (2h)')}</text>
    <line x1="180" y1="136" x2="180" y2="164" class="d-a"/><text x="180" y="192" text-anchor="middle" class="t-small t-a">${L('A: 문턱 하나', 'A: single threshold')}</text>
    <text x="300" y="176" class="t-small t-dim">${L('그리고 최소 유지 시간, 다음 마디까지 대기', 'plus minimum hold time and wait for the next bar')}</text>
  </svg>`,
  look: [
    '아래 상태 띠를 보면 위협도가 문턱 근처에서 흔들릴 때 A는 색이 잘게 쪼개지고, B는 긴 덩어리로 유지됨',
    '"전환 횟수 (최근 30초)" 측정값이 A는 B의 몇 배',
    '"소리 켜기"를 누르고 A를 들으면 탐험과 긴장 음악이 계속 툭툭 바뀜. B는 한 번 바뀌면 몇 마디 이어짐.',
    'B의 히스테리시스를 0으로, 유지 시간을 0으로 바꾸면 마디 맞춤만으로는 떨림이 다 사라지지 않음',
  ],
  refs: [
    { type: 'engine', title: 'Audiokinetic Wwise Help - States and Switches', url: 'https://www.audiokinetic.com/library/edge/?source=Help&id=understanding_states_and_switches', note: '게임 상태를 음악 상태로 연결' },
    { type: 'engine', title: 'Audiokinetic Wwise Help - Music Switch Container transitions', url: 'https://www.audiokinetic.com/library/edge/?source=Help&id=understanding_music_transitions', note: '상태 사이의 전환 규칙' },
    { type: 'book', title: 'Robert Nystrom, Game Programming Patterns - State', year: 2014, url: 'https://gameprogrammingpatterns.com/state.html', note: '게임의 상태 기계 패턴' },
    { type: 'book', title: 'Karen Collins, Game Sound', year: 2008, note: '적응형 음악의 상태와 전환' },
  ],
  params: [
    { key: 'hyst', label: '히스테리시스 h', type: 'range', min: 0, max: 0.2, step: 0.01, a: 0, b: 0.08, group: '전환 규칙', help: '들어가는 문턱 = 기준 + h, 나오는 문턱 = 기준 - h' },
    { key: 'dwell', label: '최소 유지 시간 (초)', type: 'range', min: 0, max: 8, step: 0.5, a: 0, b: 3 },
    { key: 'quant', label: '다음 마디에 전환', type: 'bool', a: false, b: true },
    { key: 'noise', label: '위협도 흔들림', type: 'range', min: 0, max: 0.2, step: 0.01, default: 0.09, shared: true, group: '게임' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Music State Machine & Hysteresis',
    summary: 'Game values such as threat keep moving up and down near a threshold. Switching music states on one threshold makes explore and tension music flip every second. Different enter and exit thresholds (hysteresis), a minimum hold time and bar sync make the state stable.',
    views: { a: 'One threshold, switch at once', b: 'Hysteresis + hold time + bar' },
    controls: 'No input. Change the transition rules with the parameters.',
    info: `
    <p>Adaptive music is usually built as a <b>state machine</b>. Each state (explore, tension, combat) has music, and game values and rules move between states. Wwise States, Switches and Music Switch Containers, and FMOD parameters with transition regions, use this structure.</p>
    <p>Game values are not clean. When an enemy moves in and out of view, threat shakes near the threshold. Deciding on one threshold makes the state flip again and again (<b>chattering</b>). To the player the music sounds broken.</p>
    <ul>
      <li><b>Hysteresis</b>: a high threshold to enter and a low one to leave. Between them the current state stays. Same idea as a thermostat.</li>
      <li><b>Minimum hold time</b>: after entering a state, do not leave for a few seconds.</li>
      <li><b>Bar sync</b>: delay the switch to the next bar. If the value returns before that, cancel the switch.</li>
    </ul>
    <p>Downside: stronger rules respond later. So rules differ per direction: combat start switches at once with a stinger and no hold time, while combat end, which can be slow, gets a long hold time.</p>`,
    look: [
      'Look at the state strip below. When threat shakes near a threshold, A\'s colors break into small pieces. B keeps long blocks.',
      'The "Switches (last 30 s)" stat of A is several times B\'s.',
      'Press "Sound on" and listen to A. Explore and tension music keep cutting back and forth. In B, a state lasts several bars once it changes.',
      'Set B\'s hysteresis and hold time to 0. Bar sync alone does not remove all chattering.',
    ],
    refs: ['Connecting game states to music states.', 'Transition rules between states.', 'The state machine pattern in games.', 'States and transitions in adaptive music.'],
    params: {
      hyst: { label: 'Hysteresis h', group: 'Transition rules', help: 'Enter threshold = base + h, exit threshold = base - h' },
      dwell: 'Minimum hold time (s)',
      quant: 'Switch on the next bar',
      noise: { label: 'Threat jitter', group: 'Game' },
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

    const BPM = 110, S16 = 60 / BPM / 4, BAR = S16 * 16;
    const TH = [0.3, 0.6];
    const ST = [{ ko: '탐험', en: 'Explore', c: '#66d17a' }, { ko: '긴장', en: 'Tension', c: '#ffcb6b' }, { ko: '전투', en: 'Combat', c: '#ff5370' }];
    // 위협도: 시나리오 + 시드 잡음 (0.25초 간격 값을 보간)
    const nr = U.rng(ctx.seed + 61), NZ = Array.from({ length: 1200 }, () => nr.range(-1, 1));
    const noiseAt = (t) => { const x = t * 4, i = Math.floor(x), f = x - i; return NZ[i % 1200] * (1 - f) + NZ[(i + 1) % 1200] * f; };
    function threat(t) {
      const u = (t % 36) / 36;
      let b;
      if (u < 0.12) b = 0.12;
      else if (u < 0.4) b = 0.3;                 // 적이 시야 경계에서 들락날락
      else if (u < 0.5) b = 0.3 + (u - 0.4) * 3;
      else if (u < 0.7) b = 0.62;                // 전투 경계
      else if (u < 0.85) b = 0.3;
      else b = 0.12;
      return U.clamp(b + noiseAt(t) * P.noise * 1.4, 0, 1);
    }
    const syn = makeSynth(29);
    const st = { t: 0, step: -1, cur: 0, since: 0, pending: null, x: 0, hist: [], histT: 0, segs: [{ t: 0, s: 0 }], switches: [] };
    const out = [0, 0];

    function desired(x) {
      const h = P.hyst;
      let s = st.cur;
      // 한 단계씩 위아래로 이동. 들어갈 때는 기준 + h, 나올 때는 기준 - h
      if (s < 2 && x > TH[s] + h) s++;
      else if (s > 0 && x < TH[s - 1] - h) s--;
      if (s < 2 && x > TH[s] + h) s++;
      if (s > 0 && x < TH[s - 1] - h) s--;
      return s;
    }
    function change(s) {
      if (P.quant) syn.release(); else syn.cut();
      st.cur = s; st.since = st.t; st.step = -1;
      st.segs.push({ t: st.t, s }); if (st.segs.length > 200) st.segs.shift();
      st.switches.push(st.t);
    }
    function fire(s) {
      const b = s % 16, bar = Math.floor(s / 16) % 2, S = st.cur;
      const root = bar ? 41 : 45;
      if (S === 0) {
        if (b === 0) [root + 12, root + 19, root + 24].forEach((m, i) => syn.play('pad', { f: A.mtof(m), len: BAR * 0.95, amp: 0.11, pan: (i - 1) * 0.4 }));
        if (b % 6 === 0) syn.play('bell', { f: A.mtof([76, 79, 74, 72][(s / 6 | 0) % 4]), len: S16 * 4, amp: 0.1, pan: 0.3 });
      } else if (S === 1) {
        if (b === 0) [root + 12, root + 15, root + 22].forEach((m, i) => syn.play('pad', { f: A.mtof(m), len: BAR * 0.95, amp: 0.09, pan: (i - 1) * 0.4 }));
        if (b % 2 === 0) syn.play('bass', { f: A.mtof(root - 12 + 12), len: S16, amp: 0.15 });
        syn.play('hat', { amp: b % 4 === 0 ? 0.09 : 0.04, pan: 0.3 });
        if (b === 0) syn.play('kick', { amp: 0.25 });
      } else {
        if ([0, 3, 6, 8, 10, 14].includes(b)) syn.play('kick', { amp: 0.38 });
        if (b === 4 || b === 12) syn.play('snare', { amp: 0.2 });
        syn.play('hat', { amp: 0.07, pan: 0.3 });
        syn.play('bass', { f: A.mtof(root + (b % 4 === 3 ? 12 : 0)), len: S16 * 0.8, amp: 0.14 });
        if (b === 0 || b === 10) [root + 24, root + 27, root + 31].forEach((m) => syn.play('brass', { f: A.mtof(m), len: S16 * (b ? 2 : 5), amp: 0.06 }));
      }
    }
    function step(l, r, sr, n) {
      for (let i = 0; i < n; i++) {
        if ((i & 63) === 0) {
          st.x = threat(st.t);
          const d = desired(st.x);
          const canLeave = st.t - st.since >= P.dwell;
          if (d !== st.cur && canLeave) {
            if (!P.quant) change(d);
            else if (!st.pending) st.pending = { target: d, at: Math.ceil(st.t / BAR - 1e-9) * BAR };
            else st.pending.target = d;
          } else if (st.pending && d === st.cur) st.pending = null;   // 원래 상태로 돌아오면 취소
        }
        if (st.pending && st.t >= st.pending.at) { const p = st.pending; st.pending = null; change(p.target); }
        const s16 = Math.floor(st.t / S16 + 1e-9);
        if (s16 !== st.step) { st.step = s16; fire(s16); }
        out[0] = out[1] = 0;
        syn.tick(sr, out, null);
        l[i] = out[0] * 0.85; r[i] = out[1] * 0.85;
        st.t += 1 / sr;
      }
      syn.gc();
      while (st.histT <= st.t) { st.hist.push({ t: st.histT, x: st.x }); st.histT += 0.05; }
      if (st.hist.length > 420) st.hist.splice(0, st.hist.length - 420);
      while (st.switches.length && st.switches[0] < st.t - 30) st.switches.shift();
    }
    const snd = A.player(ctx, { process: step });
    const bufL = new Float32Array(4800), bufR = new Float32Array(4800);

    return {
      update(dt) {
        snd.update();
        if (!snd.on) step(bufL, bufR, 48000, Math.min(4800, Math.round(dt * 48000)));
      },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, tw = W - pad * 2, PAST = 20, t0 = st.t - PAST;
        const X = (t) => pad + (t - t0) / PAST * tw;
        const py = 22, ph = Math.max(80, H * 0.5);
        D.rect(g, pad, py, tw, ph, 'rgba(0,0,0,0.35)');
        const Y = (v) => py + ph - v * ph;
        for (const th of TH) {
          if (P.hyst > 0) D.rect(g, pad, Y(th + P.hyst), tw, Y(th - P.hyst) - Y(th + P.hyst), U.rgb(79, 195, 247, 0.12));
          D.line(g, pad, Y(th), pad + tw, Y(th), 'rgba(255,255,255,0.3)', 1);
        }
        g.beginPath();
        let f = true;
        for (const h of st.hist) { if (h.t < t0) continue; const x = X(h.t), y = Y(h.x); f ? g.moveTo(x, y) : g.lineTo(x, y); f = false; }
        g.strokeStyle = C.text; g.lineWidth = 1.5; g.stroke();
        D.text(g, L('위협도 (가로선 = 문턱, 파란 띠 = 유지 구간)', 'Threat (lines = thresholds, blue band = hold band)'), pad, 6, { size: 10, color: C.dim });
        // 상태 띠
        const by = py + ph + 8, bh = 26;
        for (let i = 0; i < st.segs.length; i++) {
          const s = st.segs[i], e = i + 1 < st.segs.length ? st.segs[i + 1].t : st.t;
          if (e < t0) continue;
          const xa = Math.max(pad, X(s.t)), xb = X(e);
          D.rect(g, xa, by, Math.max(1, xb - xa - 1), bh, ST[s.s].c);
        }
        if (st.pending) D.rect(g, X(st.t) - 2, by - 4, 4, bh + 8, col);
        D.text(g, L('음악 상태', 'Music state'), pad, by + bh + 4, { size: 9, color: C.dim });
        // 범례 겸 현재 상태
        const lx = pad, ly = by + bh + 22;
        if (ly + 16 < H) ST.forEach((s, i) => {
          const x = lx + i * Math.min(110, tw / 3);
          D.rect(g, x, ly, 12, 12, s.c, i === st.cur ? C.text : null, 2);
          D.text(g, L(s.ko, s.en), x + 16, ly, { size: 11, color: i === st.cur ? C.text : C.dim });
        });
        const short = st.segs.filter((s, i) => i > 0 && i + 1 < st.segs.length && st.segs[i + 1].t - s.t < 2 && s.t > st.t - 30).length;
        ctx.stat(L('현재 상태', 'Current state'), L(ST[st.cur].ko, ST[st.cur].en) + (st.pending ? ' → ' + L(ST[st.pending.target].ko, ST[st.pending.target].en) : ''));
        ctx.stat(L('전환 횟수 (최근 30초)', 'Switches (last 30 s)'), st.switches.length);
        ctx.stat(L('2초 안에 끝난 상태 (최근 30초)', 'States shorter than 2 s (last 30 s)'), short);
        ctx.stat(L('위협도', 'Threat'), st.x.toFixed(2));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
