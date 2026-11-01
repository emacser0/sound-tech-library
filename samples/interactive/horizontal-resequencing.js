// 수평 재배열: 게임 이벤트가 오면 음악 구간을 즉시 바꿈 vs 다음 박, 다음 마디에 맞춰 바꿈 (+ 전환 효과)
GTL.register({
  id: 'horizontal-resequencing',
  title: '수평 재배열 (Horizontal Re-sequencing)',
  summary: '탐험 구간과 전투 구간을 게임 이벤트에 맞춰 이어 붙임. 요청 즉시 바꾸면 박자 격자가 어긋나고 울리던 음이 잘림. 다음 마디까지 기다렸다 바꾸고 기다리는 동안 라이저를 넣으면 늦어도 음악적으로 자연스러움.',
  views: { a: '즉시 전환', b: '다음 마디 + 전환 효과' },
  controls: '"상태 전환" 버튼으로 탐험과 전투를 직접 바꿀 수 있음. 자동 이벤트도 몇 초마다 옴.',
  info: `
    <p><b>수평 재배열(Horizontal Re-sequencing)</b>은 곡을 짧은 구간(세그먼트)으로 나누고, 게임 상태에 따라 다음에 이어 붙일 구간을 고르는 적응형 음악 기법. 시간 축(가로)으로 순서를 바꾼다는 뜻.</p>
    <p>핵심은 <b>언제</b> 바꾸는가. 게임 이벤트는 박자와 상관없는 순간에 옴.</p>
    <ul>
      <li><b>즉시</b>: 반응은 가장 빠름. 새 구간의 첫 박이 엉뚱한 순간에 시작돼 박자 격자가 어긋나고, 울리던 음이 끊겨 툭 소리가 남.</li>
      <li><b>다음 박</b>: 박자 격자는 유지. 하지만 마디의 첫 박이 아닌 곳에서 새 구간이 시작됨.</li>
      <li><b>다음 마디</b>: 가장 자연스러움. 대기 시간이 최대 한 마디(이 샘플은 2초)까지 늘어남.</li>
      <li><b>전환 효과</b>: 대기 시간을 라이저(점점 커지는 노이즈)로 채우고 전환 지점에 심벌을 침. 기다림이 "준비 동작"으로 들림.</li>
    </ul>
    <p>Wwise Music Switch Container의 전환 규칙(Exit source at: Immediate, Next beat, Next bar, Transition segment)과 FMOD의 Transition Region, Quantization이 같은 개념</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="4" y="14" class="t-small t-dim">${L('세로선 = 박, 굵은 선 = 마디. 화살표 = 게임 이벤트', 'Thin lines = beats, thick = bars. Arrow = game event')}</text>
    <text x="4" y="58" class="t-a">A</text><text x="4" y="128" class="t-b">B</text>
    <rect x="20" y="40" width="190" height="30" class="f-dim"/><rect x="210" y="40" width="310" height="30" class="f-a" opacity="0.35"/>
    <rect x="20" y="110" width="260" height="30" class="f-dim"/><rect x="280" y="110" width="240" height="30" class="f-b" opacity="0.35"/>
    ${[20, 85, 150, 215, 280, 345, 410, 475].map((x, i) => `<line x1="${x}" y1="${i % 4 === 0 ? 106 : 112}" x2="${x}" y2="${i % 4 === 0 ? 144 : 138}" class="d-line" stroke-width="${i % 4 === 0 ? 2 : 1}"/>`).join('')}
    ${[20, 85, 150].map((x) => `<line x1="${x}" y1="38" x2="${x}" y2="72" class="d-line"/>`).join('')}
    ${[210, 275, 340, 405, 470].map((x, i) => `<line x1="${x}" y1="${i % 4 === 0 ? 36 : 42}" x2="${x}" y2="${i % 4 === 0 ? 74 : 68}" class="d-a" stroke-width="${i % 4 === 0 ? 2.5 : 1}"/>`).join('')}
    <path d="M210,24 L210,38" class="d-accent" marker-end="url(#arr)"/><path d="M190,94 L190,108" class="d-accent" marker-end="url(#arr)"/>
    <text x="214" y="34" class="t-small t-a">${L('즉시 시작: 새 격자가 옛 격자와 어긋남', 'starts at once: new grid is off the old grid')}</text>
    <path d="M192,120 Q236,98 278,120" class="d-b" opacity="0.7"/>
    <text x="236" y="160" text-anchor="middle" class="t-small t-b">${L('라이저로 대기 시간을 채움', 'a riser fills the wait')}</text>
    <text x="284" y="104" class="t-small t-b">${L('다음 마디에서 전환 + 심벌', 'switch on next bar + cymbal')}</text>
  </svg>`,
  look: [
    '타임라인에서 A의 전환 지점을 보면 새 구간의 박자선이 앞 구간의 점선 격자(이어졌을 박)와 어긋남. B는 굵은 마디선에서만 바뀜.',
    '"소리 켜기"를 누르고 A를 들으면 전환 순간 음이 툭 잘리고 리듬이 한 번 휘청거림',
    'B의 "대기 시간" 측정값은 0~2000ms 사이로 바뀜. 전환 효과를 끄면 이 시간 동안 아무 변화가 없어 반응이 늦게 느껴짐.',
    'A의 전환 시점을 "다음 박"으로 바꾸면 박자 격자는 맞지만 마디의 첫 박 위치가 바뀜',
  ],
  refs: [
    { type: 'engine', title: 'Audiokinetic Wwise Help - Music Switch Container, Transitions', url: 'https://www.audiokinetic.com/library/edge/?source=Help&id=understanding_music_transitions', note: 'Exit source at (Immediate, Next beat, Next bar), Transition segment 설정' },
    { type: 'engine', title: 'FMOD Studio User Manual - Transitions, Transition Regions and Quantization', url: 'https://www.fmod.com/docs/2.02/studio/', note: '이벤트 타임라인 안에서 구간을 넘나드는 방법' },
    { type: 'book', title: 'Karen Collins, Game Sound', year: 2008, note: '수평 재배열(branching)과 전환 문제의 역사' },
    { type: 'book', title: 'Winifred Phillips, A Composer\'s Guide to Game Music', year: 2014, note: '수평 재배열용 구간을 쓰는 법' },
  ],
  params: [
    { key: 'quant', label: '전환 시점', type: 'select', options: [{ value: 'now', label: '즉시' }, { value: 'beat', label: '다음 박' }, { value: 'bar', label: '다음 마디' }], a: 'now', b: 'bar', group: '전환 규칙' },
    { key: 'fx', label: '전환 효과 (라이저 + 심벌)', type: 'bool', a: false, b: true },
    { key: 'auto', label: '자동 이벤트', type: 'bool', default: true, shared: true, group: '게임', help: '3.5~6.5초마다 탐험과 전투를 바꾸라는 이벤트가 옴' },
    { key: 'toggle', label: '상태 전환', type: 'button', buttonLabel: '탐험 ↔ 전투' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Horizontal Re-sequencing',
    summary: 'Explore and combat sections are joined in time as game events arrive. Switching at once breaks the beat grid and cuts ringing notes. Waiting for the next bar, with a riser during the wait, is later but sounds musical.',
    views: { a: 'Switch at once', b: 'Next bar + transition FX' },
    controls: 'Press "Switch state" to toggle explore and combat. Automatic events also arrive every few seconds.',
    info: `
    <p><b>Horizontal re-sequencing</b> is an adaptive music technique. The score is cut into short sections (segments), and the game state picks which section plays next. "Horizontal" means changing the order along the time axis.</p>
    <p>The key question is <b>when</b> to switch. Game events arrive at moments that ignore the beat.</p>
    <ul>
      <li><b>At once</b>: the fastest response. The first beat of the new section starts at a random moment, so the beat grid jumps, and ringing notes are cut with a click.</li>
      <li><b>Next beat</b>: the beat grid stays. But the new section may start on a beat that is not the first beat of a bar.</li>
      <li><b>Next bar</b>: the most natural. The wait can grow to one bar (2 s in this sample).</li>
      <li><b>Transition FX</b>: a riser (noise that grows louder) fills the wait, and a cymbal hits on the switch. The wait sounds like a build-up.</li>
    </ul>
    <p>The transition rules of the Wwise Music Switch Container (Exit source at: Immediate, Next beat, Next bar, Transition segment) and FMOD transition regions with quantization are the same idea.</p>`,
    look: [
      'Look at A\'s switch points on the timeline. The new beat lines do not match the dashed grid where the old beats would have been. B only switches on thick bar lines.',
      'Press "Sound on" and listen to A. At each switch a note is cut with a click and the rhythm stumbles once.',
      'B\'s "Wait time" stat moves between 0 and 2000 ms. Turn off transition FX and nothing happens during that time, so the response feels late.',
      'Set A\'s switch point to "Next beat". The beat grid now matches, but the position of the bar\'s first beat moves.',
    ],
    refs: ['Exit source at (Immediate, Next beat, Next bar) and transition segments.', 'Moving between sections inside an event timeline.', 'History of branching music and its transition problems.', 'How to write sections for re-sequencing.'],
    params: {
      quant: { label: 'Switch point', group: 'Transition rule', options: { now: 'At once', beat: 'Next beat', bar: 'Next bar' } },
      fx: 'Transition FX (riser + cymbal)',
      auto: { label: 'Auto events', group: 'Game', help: 'An event to toggle explore and combat arrives every 3.5~6.5 s' },
      toggle: { label: 'Switch state', buttonLabel: 'Explore ↔ Combat' },
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

    const BPM = 120, BEAT = 60 / BPM, S16 = BEAT / 4, BAR = BEAT * 4;
    const SEC = [{ ko: '탐험', en: 'Explore', c: 'rgba(102,209,122,0.22)' }, { ko: '전투', en: 'Combat', c: 'rgba(255,83,112,0.25)' }];
    const MEL = { 0: 76, 6: 74, 8: 72, 12: 71, 16: 72, 22: 69, 24: 72, 28: 67 };
    function fire(sec, s) {
      if (sec === 0) {
        if (s === 0) [57, 60, 64, 71].forEach((m, i) => syn.play('pad', { f: A.mtof(m), len: BAR * 0.95, amp: 0.13, pan: (i - 1.5) * 0.3 }));
        if (s === 16) [53, 57, 60, 67].forEach((m, i) => syn.play('pad', { f: A.mtof(m), len: BAR * 0.95, amp: 0.13, pan: (i - 1.5) * 0.3 }));
        if (MEL[s] != null) { syn.play('bell', { f: A.mtof(MEL[s]), len: BEAT, amp: 0.16, pan: 0.2 }); onset(0); }
        if (s % 4 === 0) { syn.play('hat', { amp: 0.06, pan: -0.3 }); onset(1); }
      } else {
        const b = s % 16;
        if ([0, 3, 6, 8, 11, 14].includes(b)) { syn.play('kick', { amp: 0.42 }); onset(2); }
        if (b === 4 || b === 12) { syn.play('snare', { amp: 0.22 }); onset(2); }
        syn.play('hat', { amp: b % 2 ? 0.04 : 0.08, pan: 0.3 });
        const root = s < 16 ? 45 : s < 28 ? 41 : 43;
        syn.play('bass', { f: A.mtof(root + (b % 4 === 3 ? 12 : 0)), len: S16 * 0.8, amp: 0.15 });
        const stab = { 0: [57, 60, 64], 10: [57, 60, 64], 16: [53, 57, 60], 28: [55, 59, 62] }[s];
        if (stab) { stab.forEach((m) => syn.play('brass', { f: A.mtof(m), len: s === 10 ? S16 * 2 : S16 * 5, amp: 0.07 })); onset(0); }
      }
    }
    const syn = makeSynth(3);
    const rq = U.rng(ctx.seed + 11);
    const st = { t: 0, sec: 0, secStart: 0, step: -1, desired: 0, pending: null, nextReq: 3, onsets: [], segs: [{ t0: 0, sec: 0, prevStart: null }], reqs: [], lastWait: 0, lastOff: 0, count: 0, manual: false };
    function onset(row) { st.onsets.push({ t: st.t, row }); if (st.onsets.length > 160) st.onsets.shift(); }
    const out = [0, 0];

    function request(t) {
      st.desired = 1 - st.desired;
      if (st.pending) { // 아직 전환 전이면 요청을 취소
        st.pending = null; syn.cut(5);
        st.reqs.push({ t, ts: t, cancel: true });
        return;
      }
      if (st.desired === st.sec) return;
      const q = P.quant === 'beat' ? BEAT : P.quant === 'bar' ? BAR : 0;
      const ts = q ? st.secStart + Math.ceil((t - st.secStart) / q - 1e-9) * q : t;
      st.pending = { ts, target: st.desired, req: t };
      st.reqs.push({ t, ts });
      if (st.reqs.length > 30) st.reqs.shift();
      if (P.fx && ts - t > 0.15) syn.play('riser', { len: ts - t, amp: 0.15, bus: 5 });
    }
    function doSwitch() {
      const p = st.pending;
      st.pending = null;
      // 옛 격자 기준으로 새 첫 박이 얼마나 어긋났는가
      const ph = ((p.ts - st.secStart) % BEAT + BEAT) % BEAT;
      st.lastOff = Math.min(ph, BEAT - ph) * 1000;
      st.lastWait = (p.ts - p.req) * 1000;
      if (P.quant === 'now') syn.cut(); else syn.release();
      if (P.fx) syn.play('crash', { amp: 0.2, bus: 5 });
      st.segs.push({ t0: p.ts, sec: p.target, prevStart: st.secStart });
      if (st.segs.length > 20) st.segs.shift();
      st.sec = p.target; st.secStart = p.ts; st.step = -1; st.count++;
    }
    function step(l, r, sr, n) {
      if (st.manual) { st.manual = false; request(st.t); }
      for (let i = 0; i < n; i++) {
        if (P.auto && st.t >= st.nextReq) { request(st.t); st.nextReq += rq.range(3.5, 6.5); }
        if (!P.auto && st.t >= st.nextReq) st.nextReq = st.t + 3;
        if (st.pending && st.t >= st.pending.ts) doSwitch();
        const s16 = Math.floor((st.t - st.secStart) / S16 + 1e-9);
        if (s16 !== st.step) { st.step = s16; fire(st.sec, ((s16 % 32) + 32) % 32); }
        out[0] = out[1] = 0;
        syn.tick(sr, out, null);
        l[i] = out[0] * 0.7; r[i] = out[1] * 0.7;
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
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const PAST = 10, FUT = 2.5, tw = W - pad * 2, t0 = st.t - PAST;
        const X = (t) => pad + (t - t0) / (PAST + FUT) * tw;
        const ty = 40, th = Math.max(80, H * 0.45);
        D.rect(g, pad, ty, tw, th, 'rgba(0,0,0,0.35)');
        // 구간 칠하기와 박자선
        for (let i = 0; i < st.segs.length; i++) {
          const s = st.segs[i], end = i + 1 < st.segs.length ? st.segs[i + 1].t0 : st.t + FUT;
          if (end < t0) continue;
          const xa = Math.max(pad, X(s.t0)), xb = Math.min(pad + tw, X(end));
          D.rect(g, xa, ty, xb - xa, th, SEC[s.sec].c);
          D.text(g, L(SEC[s.sec].ko, SEC[s.sec].en), xa + 4, ty + 4, { size: 10, color: C.text });
          for (let k = 0; s.t0 + k * BEAT < end; k++) {
            const bt = s.t0 + k * BEAT;
            if (bt < t0) continue;
            const x = X(bt), bar = k % 4 === 0;
            D.line(g, x, ty + (bar ? 0 : th * 0.3), x, ty + th, bar ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.18)', bar ? 2 : 1);
          }
          // 옛 격자가 이어졌다면 박이 있었을 자리 (점선)
          if (s.prevStart != null && s.t0 > t0) {
            g.setLineDash([3, 3]);
            const k0 = Math.ceil((s.t0 - s.prevStart) / BEAT - 1e-9);
            for (let k = k0; k < k0 + 4; k++) { const x = X(s.prevStart + k * BEAT); if (x < pad + tw) D.line(g, x, ty + th * 0.55, x, ty + th, C.warn, 1); }
            g.setLineDash([]);
          }
        }
        // 대기 중인 전환
        if (st.pending) {
          const xa = X(st.pending.req), xb = X(st.pending.ts);
          D.rect(g, xb, ty, Math.max(2, pad + tw - xb), th, SEC[st.pending.target].c);
          D.line(g, xb, ty, xb, ty + th, col, 2);
          D.arrow(g, xa, ty + th * 0.5, Math.max(xa + 2, xb), ty + th * 0.5, col, 2);
        }
        // 이벤트와 전환
        for (const q of st.reqs) {
          if (q.ts < t0) continue;
          const xa = X(q.t);
          D.poly(g, [{ x: xa - 5, y: ty - 10 }, { x: xa + 5, y: ty - 10 }, { x: xa, y: ty - 1 }], q.cancel ? C.dim : C.accent);
          if (!q.cancel && q.ts > q.t + 1e-3 && q.ts <= st.t) D.arrow(g, xa, ty + th * 0.5, X(q.ts), ty + th * 0.5, col, 1.5);
        }
        // 음 시작 표시
        const oy = ty + th + 8, oh = 30;
        D.rect(g, pad, oy, tw, oh, 'rgba(0,0,0,0.3)');
        for (const o of st.onsets) if (o.t >= t0) D.rect(g, X(o.t) - 1, oy + 3 + o.row * 9, 2, 7, [C.warn, C.dim, C.text][o.row]);
        const nx = X(st.t);
        D.line(g, nx, ty - 12, nx, oy + oh, C.text, 1.5);
        D.text(g, L('지금', 'now'), nx + 3, ty - 14, { size: 9, color: C.dim });
        D.text(g, L('▼ 게임 이벤트   점선 = 앞 구간 격자가 이어졌을 박', '▼ game event   dashed = where the old grid\'s beats would be'), pad, 10, { size: 10, color: C.dim });
        D.text(g, L('음 시작', 'Note onsets'), pad + 4, oy + oh + 4, { size: 9, color: C.dim });
        const info = P.quant === 'now' ? L('즉시', 'at once') : P.quant === 'beat' ? L('다음 박', 'next beat') : L('다음 마디', 'next bar');
        D.text(g, L('전환 시점: ', 'Switch point: ') + info + (P.fx ? L(' + 전환 효과', ' + transition FX') : ''), pad, H - pad - 12, { size: 11, color: col });
        ctx.stat(L('현재 구간', 'Section'), L(SEC[st.sec].ko, SEC[st.sec].en) + (st.pending ? L(' (전환 대기)', ' (switch pending)') : ''));
        ctx.stat(L('대기 시간', 'Wait time'), st.lastWait.toFixed(0) + ' ms');
        ctx.stat(L('박자 격자 어긋남', 'Beat grid offset'), st.lastOff.toFixed(0) + ' ms');
        ctx.stat(L('전환 횟수', 'Switches'), st.count);
        snd.stat();
      },
      onAction(k) {
        if (k === 'sound') snd.toggle();
        if (k === 'toggle') st.manual = true;
      },
      dispose() { snd.stop(); },
    };
  },
});
