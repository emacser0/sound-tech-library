// 음악 크로스페이드: 새 트랙을 처음부터 시작 (박이 어긋남) vs 같은 마디 위치에서 시작 (박과 화성이 맞음)
GTL.register({
  id: 'music-crossfade-sync',
  title: '박자 맞춘 음악 크로스페이드',
  summary: '두 트랙을 몇 초 동안 겹치며 바꾸는 크로스페이드는 겹치는 동안 두 곡이 함께 들림. 새 트랙을 처음부터 시작하면 킥이 두 번씩 들리고 코드가 부딪힘. 같은 템포의 트랙을 같은 마디 위치에서 시작하면 겹쳐도 한 곡처럼 들림.',
  views: { a: '처음부터 시작', b: '마디 위치 맞춤' },
  controls: '"트랙 전환" 버튼으로 바로 바꿀 수 있음. 자동 전환도 5~9초마다 옴.',
  info: `
    <p>탐험 음악에서 추격 음악으로 넘어갈 때 가장 쉬운 방법은 <b>크로스페이드(Crossfade)</b>. 앞 트랙은 줄이고 새 트랙은 키움. 겹치는 몇 초 동안 두 트랙이 같이 들리므로 둘의 박과 화성이 맞아야 함.</p>
    <ul>
      <li><b>처음부터 시작</b>: 새 트랙의 1마디 1박이 아무 순간에나 시작됨. 두 킥이 어긋나 "쿵쿵" 두 번 들리고, 서로 다른 코드가 겹침.</li>
      <li><b>박 맞춤</b>: 새 트랙 위치를 앞 트랙 박의 위상에 맞춤. 킥은 맞지만 마디 안 위치가 달라 코드가 어긋날 수 있음.</li>
      <li><b>마디 맞춤</b>: 같은 템포, 같은 코드 진행으로 만든 트랙을 같은 위치에서 시작. 겹쳐도 한 곡의 편곡이 바뀌는 것처럼 들림.</li>
    </ul>
    <p>페이드 곡선은 <b>등전력(equal power)</b> 곡선(cos, sin)을 씀. 서로 상관없는 두 신호를 선형으로 섞으면 가운데에서 전력이 -3dB 꺼짐. 등전력 곡선은 gA² + gB² = 1이라 전체 크기가 일정함.</p>
    <p>단점: 마디 맞춤을 하려면 트랙들의 템포, 박자표, 길이를 처음부터 맞춰 작곡해야 함. Wwise에서는 Music Switch의 "Sync to: Same time as playing segment", FMOD에서는 같은 타임라인 위의 트랙 볼륨 오토메이션으로 만듦.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="14" class="t-small t-dim">${L('겹치는 구간에서 두 트랙의 킥 위치', 'Kick positions of both tracks during the overlap')}</text>
    <text x="4" y="48" class="t-small">${L('트랙 1', 'Track 1')}</text><text x="4" y="78" class="t-small">${L('트랙 2', 'Track 2')}</text>
    <text x="4" y="122" class="t-small">${L('트랙 1', 'Track 1')}</text><text x="4" y="152" class="t-small">${L('트랙 2', 'Track 2')}</text>
    ${[80, 160, 240, 320, 400, 480].map((x) => `<rect x="${x}" y="36" width="6" height="16" class="f-dim"/>`).join('')}
    ${[125, 205, 285, 365, 445].map((x) => `<rect x="${x}" y="66" width="6" height="16" class="f-a"/>`).join('')}
    <text x="536" y="64" text-anchor="end" class="t-small t-a">${L('A: 킥이 두 번 (플램)', 'A: double kicks (flam)')}</text>
    ${[80, 160, 240, 320, 400, 480].map((x) => `<rect x="${x}" y="110" width="6" height="16" class="f-dim"/>`).join('')}
    ${[160, 240, 320, 400, 480].map((x) => `<rect x="${x}" y="140" width="6" height="16" class="f-b"/>`).join('')}
    <text x="536" y="172" text-anchor="end" class="t-small t-b">${L('B: 같은 격자', 'B: same grid')}</text>
    <path d="M60,90 L540,90" class="d-dim" stroke-dasharray="3 3"/>
  </svg>`,
  look: [
    '오른쪽 위상 다이얼을 보면 A는 두 트랙의 바늘이 서로 다른 곳을 가리키고, B는 겹쳐 있음',
    '"소리 켜기"를 누르고 A의 크로스페이드 구간을 들으면 킥이 두 번씩 울리고 코드가 부딪힘',
    '"크로스페이드 길이"를 0.3초로 줄이면 A의 어긋남이 짧아져 덜 들리지만, 전환이 툭 바뀌는 느낌이 됨',
    'B의 맞춤 방식을 "박"으로 바꾸면 킥은 맞지만 "마디 위치 차이"가 0이 아니어서 코드가 어긋날 때가 있음',
  ],
  refs: [
    { type: 'engine', title: 'Audiokinetic Wwise Help - Music Transitions (Sync to, Fade-in, Fade-out)', url: 'https://www.audiokinetic.com/library/edge/?source=Help&id=understanding_music_transitions', note: '"Same time as playing segment"로 같은 위치에서 새 세그먼트를 시작' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed.', year: 2011, note: '믹싱과 게인 곡선의 기초' },
    { type: 'book', title: 'Boris Smus, Web Audio API (O\'Reilly)', year: 2013, note: '등전력 크로스페이드와 게임 오디오 예시' },
    { type: 'book', title: 'Winifred Phillips, A Composer\'s Guide to Game Music', year: 2014, note: '같은 템포, 같은 화성 구조로 트랙을 쓰는 이유' },
  ],
  params: [
    { key: 'sync', label: '새 트랙 시작 위치', type: 'select', options: [{ value: 'start', label: '처음부터' }, { value: 'beat', label: '박 맞춤' }, { value: 'bar', label: '마디 맞춤 (같은 위치)' }], a: 'start', b: 'bar', group: '크로스페이드' },
    { key: 'xf', label: '크로스페이드 길이 (초)', type: 'range', min: 0.2, max: 6, step: 0.1, default: 3, shared: true },
    { key: 'auto', label: '자동 전환', type: 'bool', default: true, shared: true, group: '게임' },
    { key: 'swap', label: '트랙 전환', type: 'button', buttonLabel: '트랙 1 ↔ 트랙 2' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Beat-Synced Music Crossfade',
    summary: 'A crossfade overlaps two tracks for a few seconds, so both songs are heard together. If the new track starts from the top, kicks double and chords clash. If tracks with the same tempo start at the same bar position, the overlap sounds like one song.',
    views: { a: 'Start from the top', b: 'Same bar position' },
    controls: 'Press "Switch track" to switch now. Automatic switches also come every 5~9 s.',
    info: `
    <p>The easiest way to go from explore music to chase music is a <b>crossfade</b>. The old track goes down and the new track comes up. Both play together for a few seconds, so their beats and chords must match.</p>
    <ul>
      <li><b>Start from the top</b>: bar 1, beat 1 of the new track starts at a random moment. The kicks miss each other and sound twice, and two different chords overlap.</li>
      <li><b>Beat sync</b>: the new track position matches the beat phase of the old track. Kicks line up, but the position inside the bar can differ, so chords can clash.</li>
      <li><b>Bar sync</b>: tracks written with the same tempo and chord progression start at the same position. The overlap sounds like one song changing its arrangement.</li>
    </ul>
    <p>The fade uses <b>equal power</b> curves (cos, sin). Mixing two unrelated signals linearly drops the power by 3 dB in the middle. With equal power, gA² + gB² = 1, so the total loudness stays the same.</p>
    <p>Downside: bar sync needs tracks composed with the same tempo, meter and length from the start. In Wwise use "Sync to: Same time as playing segment" in a Music Switch. In FMOD, put the tracks on one timeline and automate their volumes.</p>`,
    look: [
      'Look at the phase dial on the right. In A the two hands point to different places. In B they overlap.',
      'Press "Sound on" and listen to A during the crossfade. Kicks hit twice and chords clash.',
      'Lower "Crossfade length" to 0.3 s. A\'s clash is shorter and less audible, but the switch feels abrupt.',
      'Set B\'s position to "Beat sync". Kicks match, but "Bar position difference" is not 0, so chords sometimes clash.',
    ],
    refs: ['"Same time as playing segment" starts the new segment at the same position.', 'Basics of mixing and gain curves.', 'Equal-power crossfades and game audio examples.', 'Why tracks share tempo and harmony.'],
    params: {
      sync: { label: 'New track start position', group: 'Crossfade', options: { start: 'From the top', beat: 'Beat sync', bar: 'Bar sync (same position)' } },
      xf: 'Crossfade length (s)',
      auto: { label: 'Auto switch', group: 'Game' },
      swap: { label: 'Switch track', buttonLabel: 'Track 1 ↔ Track 2' },
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

    const BPM = 120, BEAT = 60 / BPM, S16 = BEAT / 4, BAR = BEAT * 4, LOOP = BAR * 4;
    // 두 트랙 모두 C, Am, F, G
    const CHORDS = [[60, 64, 67], [57, 60, 64], [57, 60, 65], [55, 59, 62]], ROOTS = [48, 45, 41, 43];
    const TRACK = [{ ko: '트랙 1 (탐험)', en: 'Track 1 (explore)', c: C.good }, { ko: '트랙 2 (추격)', en: 'Track 2 (chase)', c: C.warn }];
    const syn = makeSynth(9);
    const rq = U.rng(ctx.seed + 31);
    const st = { t: 0, p: [0, 0], step: [-1, -1], on: [true, false], cur: 0, f: 1, fading: false, nextReq: 4, manual: 0, ons: [], gl: [1, 0], hist: [] };
    const out = [0, 0];

    function fire(k, s) {
      const bar = Math.floor(s / 16) % 4, b = s % 16, ch = CHORDS[bar];
      const beat = b % 4 === 0;
      if (beat) st.ons.push({ t: st.t, k, bar: b === 0, kick: false });
      if (k === 0) {
        if (b === 0) ch.forEach((m, i) => syn.play('pad', { f: A.mtof(m), len: BAR * 0.95, amp: 0.1, bus: 0, pan: (i - 1) * 0.4 }));
        if (b % 2 === 0) syn.play('pluck', { f: A.mtof(ch[(b / 2) % 3] + 12), len: S16 * 1.5, amp: 0.12, bus: 0, pan: -0.3 });
        if (b === 0 || b === 8) { syn.play('kick', { amp: 0.32, bus: 0 }); st.ons.push({ t: st.t, k, kick: true }); }
        if (b % 4 === 2) syn.play('hat', { amp: 0.07, bus: 0, pan: 0.3 });
      } else {
        if (beat) { syn.play('kick', { amp: 0.4, bus: 1 }); st.ons.push({ t: st.t, k, kick: true }); }
        if (b === 4 || b === 12) syn.play('snare', { amp: 0.2, bus: 1 });
        if (b % 2 === 1) syn.play('hat', { amp: 0.09, bus: 1, pan: 0.3 });
        if (b % 2 === 0) syn.play('bass', { f: A.mtof(ROOTS[bar] + (b % 4 === 2 ? 12 : 0)), len: S16 * 1.6, amp: 0.17, bus: 1 });
        if (b === 0 || b === 6 || b === 12) syn.play('lead', { f: A.mtof(ch[b === 6 ? 1 : b === 12 ? 2 : 0] + 12), len: S16 * (b === 12 ? 3 : 5), amp: 0.06, bus: 1, pan: -0.2 });
      }
      if (st.ons.length > 200) st.ons.splice(0, st.ons.length - 200);
    }
    function swap() {
      const from = st.cur, to = 1 - st.cur;
      if (st.fading) { st.cur = to; st.f = 1 - st.f; return; } // 페이드 도중이면 방향만 뒤집음
      let p;
      if (P.sync === 'start') p = 0;
      else if (P.sync === 'beat') p = st.p[from] % BEAT;
      else p = st.p[from] % LOOP;
      st.p[to] = p;
      st.step[to] = p % S16 < 1e-6 ? -1 : Math.floor(p / S16);
      st.on[to] = true; st.cur = to; st.f = 0; st.fading = true;
    }
    function step(l, r, sr, n) {
      while (st.manual > 0) { st.manual--; swap(); }
      const df = 1 / (Math.max(0.05, P.xf) * sr);
      for (let i = 0; i < n; i++) {
        if (st.t >= st.nextReq) { if (P.auto) swap(); st.nextReq += rq.range(5, 9); }
        if (st.fading) {
          st.f = Math.min(1, st.f + df);
          if (st.f >= 1) { st.fading = false; const old = 1 - st.cur; st.on[old] = false; syn.release(old); }
        }
        const a = st.f * Math.PI / 2;
        st.gl[st.cur] = Math.sin(a); st.gl[1 - st.cur] = Math.cos(a);
        for (let k = 0; k < 2; k++) {
          if (!st.on[k]) continue;
          const s16 = Math.floor(st.p[k] / S16 + 1e-9);
          if (s16 !== st.step[k]) { st.step[k] = s16; fire(k, s16 % 64); }
          st.p[k] += 1 / sr;
        }
        out[0] = out[1] = 0;
        syn.tick(sr, out, st.gl);
        l[i] = out[0] * 0.85; r[i] = out[1] * 0.85;
        st.t += 1 / sr;
      }
      syn.gc();
      st.hist.push({ t: st.t, g0: st.gl[0], g1: st.gl[1] });
      if (st.hist.length > 600) st.hist.shift();
    }
    const snd = A.player(ctx, { process: step });
    const bufL = new Float32Array(4800), bufR = new Float32Array(4800);

    // 두 트랙의 박 위상 차이
    function offsets() {
      if (!(st.on[0] && st.on[1])) return null;
      const d = st.p[1] - st.p[0];
      const bph = ((d % BEAT) + BEAT) % BEAT, beatMs = Math.min(bph, BEAT - bph) * 1000;
      const bars = Math.round(((d % LOOP) + LOOP) % LOOP / BEAT) % 16;
      return { beatMs, beats: bars };
    }

    return {
      update(dt) {
        snd.update();
        if (!snd.on) step(bufL, bufR, 48000, Math.min(4800, Math.round(dt * 48000)));
      },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const dial = Math.min(110, W * 0.22), tw = W - pad * 3 - dial, PAST = 8, t0 = st.t - PAST;
        const X = (t) => pad + (t - t0) / PAST * tw;
        const lh = Math.max(50, (H - 90) / 2);
        for (let k = 0; k < 2; k++) {
          const y = 24 + k * (lh + 10);
          D.rect(g, pad, y, tw, lh, 'rgba(0,0,0,0.35)');
          // 게인 곡선
          g.beginPath();
          let first = true;
          for (const h of st.hist) {
            if (h.t < t0) continue;
            const px = X(h.t), py = y + lh - 2 - (k ? h.g1 : h.g0) * (lh - 4);
            first ? g.moveTo(px, py) : g.lineTo(px, py); first = false;
          }
          g.strokeStyle = TRACK[k].c; g.lineWidth = 2; g.stroke();
          // 박자선과 킥
          for (const o of st.ons) {
            if (o.k !== k || o.t < t0) continue;
            const x = X(o.t);
            if (o.kick) D.rect(g, x - 2, y + lh * 0.35, 4, lh * 0.3, k ? C.warn : C.good);
            else D.line(g, x, y, x, y + lh, o.bar ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)', o.bar ? 2 : 1);
          }
          D.text(g, L(TRACK[k].ko, TRACK[k].en) + '  ' + Math.round(st.gl[k] * 100) + '%', pad + 4, y + 3, { size: 10, color: C.text });
        }
        D.text(g, L('막대 = 킥, 굵은 선 = 마디 시작, 곡선 = 게인', 'Bars = kicks, thick lines = bar starts, curve = gain'), pad, 8, { size: 10, color: C.dim });
        // 위상 다이얼: 마디 안 위치 (한 바퀴 = 한 마디)
        const cx = W - pad - dial / 2, cy = 24 + dial / 2 + 10, rr = dial / 2 - 6;
        D.circle(g, cx, cy, rr, 'rgba(0,0,0,0.35)', C.grid, 1);
        for (let b = 0; b < 4; b++) { const a = -Math.PI / 2 + b * Math.PI / 2; D.line(g, cx + Math.cos(a) * rr * 0.85, cy + Math.sin(a) * rr * 0.85, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, C.dim, 2); }
        for (let k = 0; k < 2; k++) {
          if (!st.on[k]) continue;
          const ph = (st.p[k] % BAR) / BAR, a = -Math.PI / 2 + ph * Math.PI * 2;
          D.line(g, cx, cy, cx + Math.cos(a) * rr * (k ? 0.75 : 0.95), cy + Math.sin(a) * rr * (k ? 0.75 : 0.95), TRACK[k].c, 3);
        }
        D.text(g, L('마디 위상', 'Bar phase'), cx, cy + rr + 6, { size: 10, color: C.dim, align: 'center' });
        const o = offsets();
        D.text(g, o ? (o.beatMs > 15 || o.beats ? L('어긋남!', 'Clash!') : L('맞음', 'Aligned')) : L('한 트랙만 재생', 'One track only'), cx, cy + rr + 20, { size: 11, align: 'center', color: o ? (o.beatMs > 15 || o.beats ? C.bad : C.good) : C.dim });
        D.text(g, L('시작 위치: ', 'Start position: ') + (P.sync === 'start' ? L('처음부터', 'from the top') : P.sync === 'beat' ? L('박 맞춤', 'beat sync') : L('마디 맞춤', 'bar sync')), pad, H - pad - 12, { size: 11, color: col });
        ctx.stat(L('재생 중', 'Playing'), st.on[0] && st.on[1] ? L('두 트랙 (크로스페이드)', 'both (crossfade)') : L(TRACK[st.cur].ko, TRACK[st.cur].en));
        ctx.stat(L('박 어긋남', 'Beat offset'), o ? o.beatMs.toFixed(0) + ' ms' : '-');
        ctx.stat(L('마디 위치 차이', 'Bar position difference'), o ? o.beats + L(' 박', ' beats') : '-');
        ctx.stat(L('합친 전력 (g1² + g2²)', 'Total power (g1² + g2²)'), (st.gl[0] ** 2 + st.gl[1] ** 2).toFixed(2));
        snd.stat();
      },
      onAction(k) {
        if (k === 'sound') snd.toggle();
        if (k === 'swap') st.manual++;
      },
      dispose() { snd.stop(); },
    };
  },
});
