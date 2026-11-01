// 박자에 맞춘 스팅어: 게임 이벤트 순간 바로 재생 vs 다음 박에 맞춰 재생
GTL.register({
  id: 'beat-quantized-stingers',
  title: '박자에 맞춘 스팅어 (Stinger)',
  summary: '아이템 획득 같은 이벤트에 짧은 음악 조각(스팅어)을 얹을 때, 이벤트 순간 바로 재생하면 배경 음악의 박과 어긋나 엇박으로 들림. 다음 박까지 기다렸다 재생하면 수십~수백 ms 늦지만 곡의 일부처럼 들림.',
  views: { a: '즉시 재생', b: '다음 박에 맞춤' },
  controls: 'Space 또는 "스팅어 재생" 버튼으로 이벤트를 직접 보냄. 자동 이벤트도 1.2~3.2초마다 옴.',
  info: `
    <p><b>스팅어(Stinger)</b>는 게임 이벤트(아이템 획득, 적 발견, 레벨 업)에 맞춰 배경 음악 위에 얹는 짧은 음악 조각. 효과음과 달리 음 높이와 리듬이 있어서 배경 음악과 박자, 화성이 맞아야 자연스러움.</p>
    <p>이벤트는 박자와 상관없는 순간에 옴. 그대로 재생하면 스팅어의 리듬이 배경 음악의 하이햇, 킥과 어긋나 "플램(flam)"처럼 겹쳐 들림.</p>
    <ul>
      <li><b>즉시</b>: 반응이 가장 빠름. 박과의 어긋남이 0~반 박까지 무작위.</li>
      <li><b>16분, 8분음표</b>: 대기는 짧고(최대 150, 300ms) 리듬은 격자에 맞음</li>
      <li><b>박, 마디</b>: 음악적으로 가장 자연스러움. 대기가 길어 "버튼을 눌렀는데 늦게 나옴"이 느껴질 수 있음.</li>
    </ul>
    <p>실전에서는 이벤트 종류마다 격자를 다르게 둠. 타격음처럼 바로 들려야 하는 소리는 효과음으로 즉시 내고, 음악 쪽 장식만 격자에 맞추는 조합이 흔함. 이 샘플은 스팅어 음 높이를 현재 코드의 구성음으로 골라 화성도 맞춤.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="4" y="14" class="t-small t-dim">${L('박자 격자 (세로선 = 박)', 'Beat grid (lines = beats)')}</text>
    ${[40, 140, 240, 340, 440].map((x) => `<line x1="${x}" y1="24" x2="${x}" y2="140" class="d-dim"/>`).join('')}
    <path d="M182,24 L182,40" class="d-accent"/><text x="182" y="52" text-anchor="middle" class="t-small">${L('이벤트', 'event')}</text>
    <text x="4" y="80" class="t-a">A</text>
    <rect x="182" y="68" width="22" height="16" class="f-a"/><rect x="207" y="68" width="22" height="16" class="f-a"/><rect x="232" y="68" width="22" height="16" class="f-a"/>
    <text x="262" y="80" class="t-small t-a">${L('박 사이에서 시작 (엇박)', 'starts between beats (off-grid)')}</text>
    <text x="4" y="124" class="t-b">B</text>
    <path d="M184,118 L238,118" class="d-b" marker-end="url(#arr)"/>
    <rect x="240" y="110" width="22" height="16" class="f-b"/><rect x="265" y="110" width="22" height="16" class="f-b"/><rect x="290" y="110" width="22" height="16" class="f-b"/>
    <text x="320" y="122" class="t-small t-b">${L('다음 박까지 기다린 뒤 시작', 'waits for the next beat')}</text>
    <text x="210" y="152" text-anchor="middle" class="t-small t-dim">${L('대기 시간', 'wait')}</text>
  </svg>`,
  look: [
    '타임라인의 스팅어 블록을 보면 A는 박자선 사이 아무 곳에서나 시작하고, B는 항상 박자선 위에서 시작함',
    '"소리 켜기"를 누르고 A를 들으면 스팅어 음이 하이햇과 엇갈려 덜컥거림. B는 곡의 일부처럼 들림.',
    'B의 격자를 "마디"로 바꾸면 "평균 대기" 측정값이 1초 안팎까지 늘어남. "16분음표"로 바꾸면 짧은 대기로도 격자에 맞음.',
    'Space를 박자에 맞춰 눌러 보면 A도 어긋남이 작아짐. 플레이어 입력은 박을 모르므로 B 방식이 필요함.',
  ],
  refs: [
    { type: 'engine', title: 'Audiokinetic Wwise Help - Music Stingers', url: 'https://www.audiokinetic.com/library/edge/?source=Help&id=understanding_stingers', note: 'Play at: Immediate, Next grid, Next bar, Next beat, Next cue 설정' },
    { type: 'engine', title: 'FMOD Studio User Manual - Quantization (Trigger behavior)', url: 'https://www.fmod.com/docs/2.02/studio/', note: '인스트루먼트 시작을 템포 격자에 맞추는 Quantization' },
    { type: 'book', title: 'Karen Collins, Game Sound', year: 2008, note: '스팅어와 적응형 음악 장식' },
    { type: 'article', title: 'MDN - Web Audio API: AudioScheduledSourceNode.start(when)', url: 'https://developer.mozilla.org/en-US/docs/Web/API/AudioScheduledSourceNode/start', note: '미래 시각에 정확히 재생을 예약하는 방법' },
  ],
  params: [
    { key: 'quant', label: '격자', type: 'select', options: [{ value: 0, label: '즉시' }, { value: 0.25, label: '16분음표' }, { value: 0.5, label: '8분음표' }, { value: 1, label: '박' }, { value: 4, label: '마디' }], a: 0, b: 1, group: '스팅어' },
    { key: 'harm', label: '현재 코드에 맞춘 음', type: 'bool', default: true, shared: true, help: '끄면 항상 같은 음 (C 장조 화음)' },
    { key: 'auto', label: '자동 이벤트', type: 'bool', default: true, shared: true, group: '게임' },
    { key: 'fire', label: '스팅어 재생', type: 'button', buttonLabel: '이벤트 보내기 (Space)' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Beat-Quantized Stingers',
    summary: 'A stinger is a short musical phrase played on top of the music for an event, like picking up an item. Played at the exact moment of the event, it lands off the beat. Waiting for the next beat makes it tens to hundreds of ms late, but it sounds like part of the song.',
    views: { a: 'Play at once', b: 'Wait for next beat' },
    controls: 'Press Space or "Play stinger" to send an event. Automatic events also arrive every 1.2~3.2 s.',
    info: `
    <p>A <b>stinger</b> is a short musical phrase played on top of the background music for a game event (item pickup, enemy spotted, level up). Unlike a sound effect it has pitch and rhythm, so it must fit the beat and the harmony of the music.</p>
    <p>Events arrive at moments that ignore the beat. Played as is, the stinger rhythm misses the hi-hat and kick of the music and sounds like a "flam".</p>
    <ul>
      <li><b>At once</b>: the fastest response. The offset from the beat is random, from 0 to half a beat.</li>
      <li><b>16th, 8th notes</b>: short wait (at most 150 or 300 ms) and the rhythm stays on the grid.</li>
      <li><b>Beat, bar</b>: the most musical. The wait is long, so the player may feel "I pressed it but it came late".</li>
    </ul>
    <p>In practice each event type uses its own grid. A common mix: sounds that must be heard at once (hits) are sound effects played immediately, and only the musical decoration waits for the grid. This sample also picks the stinger notes from the current chord, so the harmony fits.</p>`,
    look: [
      'Look at the stinger blocks on the timeline. In A they start anywhere between beat lines. In B they always start on a beat line.',
      'Press "Sound on" and listen to A. The stinger notes clash with the hi-hat and stumble. In B they sound like part of the song.',
      'Set B\'s grid to "Bar". The "Average wait" stat grows to about 1 s. With "16th note" the wait is short and still on the grid.',
      'Press Space in time with the beat. A\'s offset gets small too. Player input does not know the beat, so B\'s method is needed.',
    ],
    refs: ['Play at: Immediate, Next grid, Next bar, Next beat, Next cue.', 'Quantization that snaps instrument starts to the tempo grid.', 'Stingers and adaptive music decoration.', 'How to schedule playback at an exact future time.'],
    params: {
      quant: { label: 'Grid', group: 'Stinger', options: { 0: 'At once', 0.25: '16th note', 0.5: '8th note', 1: 'Beat', 4: 'Bar' } },
      harm: { label: 'Notes from current chord', help: 'When off, always the same notes (C major chord)' },
      auto: { label: 'Auto events', group: 'Game' },
      fire: { label: 'Play stinger', buttonLabel: 'Send event (Space)' },
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

    const BPM = 100, BEAT = 60 / BPM, S16 = BEAT / 4;
    const CHORDS = [[57, 60, 64], [53, 57, 60], [55, 60, 64], [55, 59, 62]], ROOTS = [45, 41, 48, 43];
    const syn = makeSynth(5);
    const rq = U.rng(ctx.seed + 21);
    const st = { t: 0, step: -1, nextReq: 1, manual: 0, pend: [], hist: [], onsets: [] };
    const out = [0, 0];

    function fire(s) {
      const bar = Math.floor(s / 16) % 4, b = s % 16;
      if (b === 0) CHORDS[bar].forEach((m, i) => syn.play('pad', { f: A.mtof(m), len: S16 * 15, amp: 0.1, pan: (i - 1) * 0.4 }));
      if (b % 4 === 0) syn.play('bass', { f: A.mtof(ROOTS[bar]), len: S16 * 3, amp: 0.18 });
      if (b === 0 || b === 8) { syn.play('kick', { amp: 0.38 }); st.onsets.push({ t: st.t, k: 0 }); }
      if (b === 4 || b === 12) { syn.play('snare', { amp: 0.16 }); st.onsets.push({ t: st.t, k: 1 }); }
      if (b % 2 === 0) { syn.play('hat', { amp: 0.11, pan: 0.35 }); st.onsets.push({ t: st.t, k: 2 }); }
      if (st.onsets.length > 120) st.onsets.splice(0, st.onsets.length - 120);
    }
    function request(t) {
      const q = +P.quant * BEAT;
      const ts = q > 0 ? Math.ceil(t / q - 1e-9) * q : t;
      st.pend.push({ req: t, ts, played: false });
    }
    function play(e) {
      e.played = true;
      const bar = Math.floor(e.ts / (BEAT * 4)) % 4;
      const ch = P.harm ? CHORDS[bar] : [60, 64, 67];
      // 짧은 팡파르: 16분음표 간격의 세 음 + 마지막 화음
      e.notes = [ch[0] + 12, ch[1] + 12, ch[2] + 12];
      const ph = ((e.ts % (BEAT / 2)) + BEAT / 2) % (BEAT / 2);
      e.err = Math.min(ph, BEAT / 2 - ph) * 1000;
      e.wait = (e.ts - e.req) * 1000;
      st.hist.push(e);
      if (st.hist.length > 40) st.hist.shift();
    }
    function step(l, r, sr, n) {
      while (st.manual > 0) { st.manual--; request(st.t); }
      for (let i = 0; i < n; i++) {
        if (st.t >= st.nextReq) { if (P.auto) request(st.t); st.nextReq += rq.range(1.2, 3.2); }
        const s16 = Math.floor(st.t / S16 + 1e-9);
        if (s16 !== st.step) { st.step = s16; fire(s16); }
        // 예약된 스팅어 음
        for (const e of st.pend) {
          if (!e.played && st.t >= e.ts) play(e);
          if (e.played) {
            const k = Math.floor((st.t - e.ts) / S16 + 1e-9);
            if (k !== e.k && k < 4) {
              e.k = k;
              if (k < 3) syn.play('brass', { f: A.mtof(e.notes[k]), len: S16 * 0.8, amp: 0.13, pan: -0.2 });
              else e.notes.forEach((m) => syn.play('brass', { f: A.mtof(m), len: S16 * 3, amp: 0.08, pan: -0.2 }));
            }
            if (k >= 4) e.done = true;
          }
        }
        out[0] = out[1] = 0;
        syn.tick(sr, out, null);
        l[i] = out[0] * 0.8; r[i] = out[1] * 0.8;
        st.t += 1 / sr;
      }
      st.pend = st.pend.filter((e) => !e.done);
      syn.gc();
    }
    const snd = A.player(ctx, { process: step });
    const bufL = new Float32Array(4800), bufR = new Float32Array(4800);

    return {
      update(dt) {
        snd.update();
        if (ctx.input.pressed('Space')) st.manual++;
        if (!snd.on) step(bufL, bufR, 48000, Math.min(4800, Math.round(dt * 48000)));
      },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const PAST = 6, FUT = 1.5, tw = W - pad * 2, t0 = st.t - PAST;
        const X = (t) => pad + (t - t0) / (PAST + FUT) * tw;
        const ty = 30, th = Math.max(90, H * 0.5);
        D.rect(g, pad, ty, tw, th, 'rgba(0,0,0,0.35)');
        const q = +P.quant * BEAT;
        for (let k = Math.ceil(t0 / (BEAT / 2)); k * BEAT / 2 < st.t + FUT; k++) {
          const x = X(k * BEAT / 2), bar = k % 8 === 0, beat = k % 2 === 0;
          D.line(g, x, ty, x, ty + th, bar ? 'rgba(255,255,255,0.5)' : beat ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.07)', bar ? 2 : 1);
        }
        // 배경 음악의 음 시작
        const rowY = [ty + th - 30, ty + th - 20, ty + th - 10];
        for (const o of st.onsets) if (o.t >= t0) D.rect(g, X(o.t) - 1, rowY[o.k], 2, 8, [C.warn, C.text, C.dim][o.k]);
        D.text(g, L('배경 음악 (킥, 스네어, 하이햇)', 'Music (kick, snare, hi-hat)'), pad + 4, ty + th - 44, { size: 9, color: C.dim });
        // 스팅어
        const sy = ty + 22, sh = 18;
        for (const e of st.hist.concat(st.pend.filter((p) => !p.played))) {
          if (e.ts < t0 - 1) continue;
          const xr = X(e.req), xs = X(e.ts);
          D.poly(g, [{ x: xr - 5, y: ty - 10 }, { x: xr + 5, y: ty - 10 }, { x: xr, y: ty - 1 }], C.accent);
          if (xs - xr > 2) D.arrow(g, xr, sy + sh / 2, xs, sy + sh / 2, col, 1.5, 5);
          for (let k = 0; k < 4; k++) {
            const xa = X(e.ts + k * S16);
            D.rect(g, xa + 1, sy + sh + 4 + (k < 3 ? 2 - k : 0) * 6, k < 3 ? X(e.ts + S16) - X(e.ts) - 2 : (X(e.ts + 4 * S16) - X(e.ts + 3 * S16)) * 2, 5, e.played ? col : 'rgba(255,255,255,0.25)');
          }
          if (e.played && e.err > 8) D.text(g, Math.round(e.err) + 'ms', xs + 2, sy - 2, { size: 9, color: C.bad });
        }
        const nx = X(st.t);
        D.line(g, nx, ty - 12, nx, ty + th, C.text, 1.5);
        D.text(g, L('▼ 게임 이벤트, 빨간 숫자 = 8분음표 격자에서 어긋난 시간', '▼ game event, red number = offset from the 8th-note grid'), pad, 8, { size: 10, color: C.dim });
        // 통계
        const rec = st.hist.slice(-10);
        const avg = (f) => (rec.length ? rec.reduce((s, e) => s + f(e), 0) / rec.length : 0);
        const by = ty + th + 12;
        D.text(g, L('격자: ', 'Grid: ') + (q ? (q / BEAT === 4 ? L('마디', 'bar') : q / BEAT === 1 ? L('박', 'beat') : q / BEAT === 0.5 ? L('8분음표', '8th note') : L('16분음표', '16th note')) : L('없음 (즉시)', 'none (at once)')), pad, by, { size: 11, color: col });
        // 어긋남 막대
        const bw = Math.min(260, W - pad * 2 - 10);
        D.rect(g, pad, by + 20, bw, 10, 'rgba(255,255,255,0.08)');
        D.rect(g, pad, by + 20, bw * U.clamp(avg((e) => e.err) / (BEAT * 250), 0, 1), 10, C.bad);
        D.text(g, L('평균 어긋남 (최대 = 반 8분음표)', 'Average offset (max = half an 8th)'), pad, by + 34, { size: 9, color: C.dim });
        ctx.stat(L('평균 대기', 'Average wait'), avg((e) => e.wait).toFixed(0) + ' ms');
        ctx.stat(L('평균 격자 어긋남', 'Average grid offset'), avg((e) => e.err).toFixed(0) + ' ms');
        ctx.stat(L('최대 대기', 'Max wait'), (rec.length ? Math.max(...rec.map((e) => e.wait)) : 0).toFixed(0) + ' ms');
        snd.stat();
      },
      onAction(k) {
        if (k === 'sound') snd.toggle();
        if (k === 'fire') st.manual++;
      },
      dispose() { snd.stop(); },
    };
  },
});
