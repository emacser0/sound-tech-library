// 인트로 + 루프 + 아웃트로: 대충 정한 루프 지점(초 단위 반올림, 꼬리 잘림) vs 샘플 정확한 루프 지점 + 꼬리(post-exit) 겹치기
GTL.register({
  id: 'intro-loop-structure',
  title: '인트로, 루프, 아웃트로 구조',
  summary: '게임 배경 음악은 인트로 뒤에 루프 구간을 반복하고, 끝날 때 아웃트로로 나감. 루프 끝을 0.05초 단위로 반올림하고 음의 꼬리를 잘라 내면 이음매마다 툭 소리와 박자 흔들림이 생김. 샘플 단위로 정확한 루프 지점과 꼬리 겹치기를 쓰면 이음매가 들리지 않음.',
  views: { a: '반올림 루프 지점, 꼬리 자름', b: '정확한 루프 지점 + 꼬리 겹침' },
  controls: '"아웃트로로 끝내기" 버튼을 누르면 현재 루프가 끝날 때 아웃트로로 나감',
  info: `
    <p>게임 음악은 언제 끝날지 모르는 장면에 깔리므로 <b>인트로 → 루프 반복 → 아웃트로</b> 구조로 만듦. 루프 이음매가 들리면 플레이어가 반복을 바로 알아챔.</p>
    <p>이음매가 들리는 이유는 두 가지</p>
    <ul>
      <li><b>루프 길이 오차</b>: 93 BPM에서 2마디는 5.1613초. 이것을 5.15초처럼 반올림하면 루프마다 11ms씩 일찍 돌아가서 박이 당겨지고, 그 순간 파형이 끊겨 클릭이 남. 루프 지점은 BPM과 샘플레이트로 계산한 샘플 번호로 정해야 함.</li>
      <li><b>잘린 꼬리</b>: 루프 끝에서 울린 음(벨, 패드, 리버브)은 루프가 끝난 뒤에도 이어져야 함. 루프 구간만 잘라서 반복하면 꼬리가 사라지고, 루프 첫 부분에는 앞 바퀴의 꼬리가 없음.</li>
    </ul>
    <p>해결: 각 구간을 <b>본체 + 꼬리</b>로 렌더링하고, 끝 지점(exit cue)에서 다음 구간을 시작하면서 앞 구간의 꼬리(post-exit)는 계속 재생해 겹침. Wwise 음악 세그먼트의 Entry cue, Exit cue, pre-entry, post-exit가 이 구조. 오디오 파일 하나로 끝내야 할 때는 루프 뒤쪽 꼬리를 루프 앞쪽에 미리 섞어 두는 방식(tail wrap)을 씀.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="14" class="t-small t-dim">${L('구간 = 본체 (진한 색) + 꼬리 (옅은 색)', 'Segment = body (solid) + tail (light)')}</text>
    <rect x="20" y="30" width="90" height="24" class="f-accent"/><text x="65" y="46" text-anchor="middle" class="t-small">${L('인트로', 'Intro')}</text>
    <rect x="110" y="30" width="150" height="24" class="f-b"/><text x="185" y="46" text-anchor="middle" class="t-small">${L('루프', 'Loop')}</text>
    <rect x="260" y="60" width="150" height="24" class="f-b"/><text x="335" y="76" text-anchor="middle" class="t-small">${L('루프', 'Loop')}</text>
    <rect x="410" y="90" width="80" height="24" class="f-good"/><text x="450" y="106" text-anchor="middle" class="t-small">${L('아웃트로', 'Outro')}</text>
    <rect x="110" y="56" width="40" height="10" class="f-accent" opacity="0.4"/><rect x="260" y="56" width="40" height="10" class="f-b" opacity="0.4"/>
    <rect x="410" y="86" width="40" height="10" class="f-b" opacity="0.4"/><rect x="490" y="116" width="40" height="10" class="f-good" opacity="0.4"/>
    <line x1="110" y1="24" x2="110" y2="150" class="d-dim" stroke-dasharray="3 3"/><line x1="260" y1="24" x2="260" y2="150" class="d-dim" stroke-dasharray="3 3"/><line x1="410" y1="24" x2="410" y2="150" class="d-dim" stroke-dasharray="3 3"/>
    <text x="260" y="140" text-anchor="middle" class="t-small">${L('exit cue = 다음 구간의 시작', 'exit cue = next segment starts')}</text>
    <text x="20" y="162" class="t-small t-b">${L('B: 꼬리를 다음 구간 위에 겹쳐 재생', 'B: tails play on top of the next segment')}</text>
    <text x="330" y="162" class="t-small t-a">${L('A: 꼬리를 버리고 바로 끊음', 'A: tails are dropped and cut')}</text>
  </svg>`,
  look: [
    '아래 "이음매 확대" 파형을 보면 A는 루프 지점에서 파형이 뚝 끊겨 세로로 뜀. B는 매끄럽게 이어짐.',
    '"소리 켜기"를 누르고 A를 들으면 루프가 돌아갈 때마다 벨 소리가 잘리며 툭 소리가 나고 박이 살짝 당겨짐',
    '"루프 길이 오차" 측정값은 A가 -11ms, B가 0. A의 오차는 루프를 돌 때마다 쌓임.',
    '"아웃트로로 끝내기"를 누르면 B는 마지막 화음이 자연스럽게 사라지고, A는 아웃트로 시작 지점에서 앞 루프의 울림이 잘림',
  ],
  refs: [
    { type: 'engine', title: 'Audiokinetic Wwise Help - Music Segments: Entry and Exit cues, pre-entry and post-exit', url: 'https://www.audiokinetic.com/library/edge/?source=Help&id=understanding_music_segments', note: '본체와 꼬리를 나눠 다음 세그먼트와 겹치는 구조' },
    { type: 'book', title: 'Karen Collins, Game Sound', year: 2008, note: '루프 기반 게임 음악과 반복 문제' },
    { type: 'book', title: 'Winifred Phillips, A Composer\'s Guide to Game Music', year: 2014, note: '매끄러운 루프를 작곡하고 렌더링하는 방법' },
    { type: 'article', title: 'MDN - AudioBufferSourceNode.loopStart, loopEnd', url: 'https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/loopStart', note: '웹 오디오에서 루프 지점을 초 단위로 지정 (샘플 단위로 계산해서 넣어야 함)' },
  ],
  params: [
    { key: 'cue', label: '루프 지점', type: 'select', options: [{ value: 'round', label: '0.05초 단위 반올림' }, { value: 'exact', label: '샘플 정확 (BPM으로 계산)' }], a: 'round', b: 'exact', group: '루프' },
    { key: 'tail', label: '꼬리 겹치기 (post-exit)', type: 'bool', a: false, b: true },
    { key: 'loops', label: '아웃트로 전 루프 횟수', type: 'int', min: 1, max: 6, default: 3, shared: true, group: '재생' },
    { key: 'outro', label: '아웃트로로 끝내기', type: 'button', buttonLabel: '아웃트로로 끝내기' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Intro, Loop and Outro Structure',
    summary: 'Game music plays an intro, repeats a loop, and leaves through an outro. If the loop end is rounded to 0.05 s and note tails are cut off, every seam clicks and the beat wobbles. Sample-accurate loop points plus overlapping tails make the seam inaudible.',
    views: { a: 'Rounded loop point, tails cut', b: 'Exact loop point + tail overlap' },
    controls: 'Press "End with outro" to go to the outro when the current loop ends.',
    info: `
    <p>Game music plays under scenes of unknown length, so it is built as <b>intro → repeated loop → outro</b>. If the loop seam is audible, the player notices the repetition at once.</p>
    <p>There are two reasons a seam is audible.</p>
    <ul>
      <li><b>Loop length error</b>: at 93 BPM, 2 bars last 5.1613 s. Rounding it to 5.15 s makes each loop jump back 11 ms early, so the beat rushes and the waveform breaks with a click. Compute loop points as sample numbers from BPM and sample rate.</li>
      <li><b>Cut tails</b>: notes played near the loop end (bells, pads, reverb) must keep ringing after the loop ends. Repeating only the loop region drops these tails, and the loop start lacks the tail of the previous pass.</li>
    </ul>
    <p>The fix: render each segment as <b>body + tail</b>. At the end point (exit cue) the next segment starts, and the previous segment's tail (post-exit) keeps playing on top. Wwise music segments use this with entry cue, exit cue, pre-entry and post-exit. When everything must fit in one audio file, mix the tail from the loop end into the loop start in advance (tail wrap).</p>`,
    look: [
      'Look at the "Seam zoom" waveform below. In A the waveform breaks at the loop point and jumps vertically. In B it continues smoothly.',
      'Press "Sound on" and listen to A. Each time the loop restarts, a bell is cut with a click and the beat rushes a little.',
      'The "Loop length error" stat is -11 ms in A and 0 in B. A\'s error adds up on every loop.',
      'Press "End with outro". In B the last chord fades naturally. In A the ringing of the last loop is cut where the outro starts.',
    ],
    refs: ['Splitting body and tail to overlap with the next segment.', 'Loop-based game music and the problem of repetition.', 'How to compose and render seamless loops.', 'Loop points in seconds in Web Audio (compute them from samples).'],
    params: {
      cue: { label: 'Loop point', group: 'Loop', options: { round: 'Rounded to 0.05 s', exact: 'Sample exact (from BPM)' } },
      tail: 'Tail overlap (post-exit)',
      loops: { label: 'Loops before outro', group: 'Playback' },
      outro: { label: 'End with outro', buttonLabel: 'End with outro' },
      ...GTL.audio.enParams,
    },
  },
  _cache: {},

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

    const BPM = 93, S16 = 60 / BPM / 4, BAR = S16 * 16;
    // 구간 악보: [16분음표 위치, 종류, MIDI, 길이(16분음표), 음량]
    const SCORE = {
      intro: { bars: 1, tail: 2, ev: [[0, 'pad', 50, 15, 0.08], [0, 'pad', 57, 15, 0.08], [0, 'pad', 64, 15, 0.07], [0, 'bell', 74, 2, 0.12], [4, 'bell', 72, 2, 0.1], [8, 'bell', 69, 2, 0.1], [12, 'bell', 67, 4, 0.1], [14, 'snare', 0, 1, 0.08], [15, 'snare', 0, 1, 0.12]] },
      loop: { bars: 2, tail: 2, ev: [] },
      outro: { bars: 1, tail: 3, ev: [[0, 'kick', 0, 1, 0.28], [0, 'crash', 0, 1, 0.1], [0, 'pad', 50, 14, 0.09], [0, 'pad', 57, 14, 0.08], [0, 'pad', 65, 14, 0.07], [0, 'bell', 74, 8, 0.13], [0, 'bass', 38, 10, 0.12], [6, 'bell', 69, 8, 0.1], [12, 'bell', 62, 8, 0.12]] },
    };
    const lp = SCORE.loop.ev;
    for (let s = 0; s < 32; s++) {
      const b = s % 16, bar = s >> 4, root = bar ? 43 : 38;
      if (b === 0) [root + 12, root + 17, root + 22].forEach((m) => lp.push([s, 'pad', bar ? m - 2 : m, 15, 0.06]));
      if (b === 0 || b === 8 || b === 11) lp.push([s, 'kick', 0, 1, 0.38]);
      if (b === 4 || b === 12) lp.push([s, 'snare', 0, 1, 0.16]);
      if (b % 2 === 0) lp.push([s, 'hat', 0, 1, 0.09]);
      if (b % 4 === 0 || b === 6) lp.push([s, 'bass', root + (b === 6 ? 12 : 0), 2, 0.17]);
    }
    [[0, 74], [3, 77], [6, 76], [10, 72], [16, 71], [19, 74], [22, 72], [28, 69], [30, 81]].forEach(([s, m]) => lp.push([s, 'bell', m, 2, s === 30 ? 0.16 : 0.11]));

    // 구간 렌더 (본체 + 꼬리, 모노). 샘플레이트별로 한 번만 만들고 두 뷰가 같이 씀
    function renderSeg(name, sr) {
      const sc = SCORE[name], bodySec = sc.bars * BAR, n = Math.ceil((bodySec + sc.tail) * sr);
      const sy = makeSynth(41), data = new Float32Array(n), o = [0, 0];
      const ev = sc.ev.slice().sort((a, b) => a[0] - b[0]);
      let k = 0;
      for (let i = 0; i < n; i++) {
        const t = i / sr;
        while (k < ev.length && ev[k][0] * S16 <= t) {
          const [, kind, m, len, amp] = ev[k++];
          sy.play(kind, { f: m ? A.mtof(m) : 220, len: len * S16, amp });
        }
        o[0] = o[1] = 0;
        sy.tick(sr, o, null);
        data[i] = o[0] + o[1];
        if ((i & 2047) === 0) sy.gc();
      }
      return { name, data, body: bodySec, exact: Math.round(bodySec * sr), rounded: Math.round(Math.round(bodySec / 0.05) * 0.05 * sr) };
    }
    const cache = ctx.def._cache;
    function segs(sr) {
      if (!cache[sr]) cache[sr] = { intro: renderSeg('intro', sr), loop: renderSeg('loop', sr), outro: renderSeg('outro', sr) };
      return cache[sr];
    }
    const cueOf = (s) => (P.cue === 'exact' ? s.exact : s.rounded);

    const st = { t: 0, sr: 48000, players: [], cur: null, loopN: 0, outroReq: false, gap: 0, log: [], lastSeamJump: 0, drift: 0 };
    function start(name, sr) {
      const p = { seg: segs(sr)[name], pos: 0, t0: st.t, cut: null };
      st.players.push(p); st.cur = p;
      st.log.push({ name, t0: st.t, cueSec: cueOf(p.seg) / sr, fullSec: p.seg.data.length / sr, tail: P.tail });
      if (st.log.length > 30) st.log.shift();
      if (name === 'loop') st.loopN++;
      if (name === 'intro') { st.loopN = 0; st.drift = 0; }
    }
    function step(l, r, sr, n) {
      if (sr !== st.sr || !st.cur) { st.sr = sr; st.players = []; st.cur = null; start('intro', sr); }
      for (let i = 0; i < n; i++) {
        let y = 0;
        const cur = st.cur;
        if (cur && cur.pos >= cueOf(cur.seg)) {
          // exit cue: 다음 구간 시작
          if (!P.tail) cur.cut = cur.pos;
          if (cur.seg.name === 'outro') { st.cur = null; st.gap = sr * 1.5; }
          else if (cur.seg.name === 'loop' && (st.outroReq || st.loopN >= P.loops)) { st.outroReq = false; start('outro', sr); }
          else { if (cur.seg.name === 'loop') st.drift += (cueOf(cur.seg) - cur.seg.exact) / sr * 1000; start('loop', sr); }
        }
        if (!st.cur && st.gap > 0 && --st.gap <= 0) start('intro', sr);
        for (const p of st.players) {
          const end = p.cut != null ? p.cut : p.seg.data.length;
          if (p.pos < end) y += p.seg.data[p.pos];
          p.pos++;
        }
        y *= 0.48;
        l[i] = y; r[i] = y;
        st.t += 1 / sr;
      }
      st.players = st.players.filter((p) => p === st.cur || p.pos < (p.cut != null ? p.cut : p.seg.data.length));
    }
    const snd = A.player(ctx, { process: step });
    const bufL = new Float32Array(4800), bufR = new Float32Array(4800);

    // 이음매 확대: 루프 → 루프 지점 앞뒤 파형 (현재 설정으로 계산, 설정이 바뀔 때만)
    let seamKey = '', seam = null, jump = 0;
    function calcSeam() {
      const k = P.cue + P.tail;
      if (k === seamKey) return;
      seamKey = k;
      const s = segs(48000).loop, c = cueOf(s), N = 480;
      seam = new Float32Array(N * 2);
      for (let i = 0; i < N; i++) seam[i] = s.data[c - N + i] * 0.48;
      for (let i = 0; i < N; i++) seam[N + i] = (s.data[i] + (P.tail ? s.data[c + i] : 0)) * 0.48;
      jump = Math.abs(seam[N] - seam[N - 1]);
    }

    return {
      update(dt) {
        snd.update();
        if (!snd.on) step(bufL, bufR, 48000, Math.min(4800, Math.round(dt * 48000)));
      },
      render() {
        calcSeam();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, tw = W - pad * 2, PAST = 16, FUT = 4, t0 = st.t - PAST;
        const X = (t) => pad + (t - t0) / (PAST + FUT) * tw;
        const ty = 22, th = Math.max(60, H * 0.3);
        D.rect(g, pad, ty, tw, th, 'rgba(0,0,0,0.35)');
        const SC = { intro: C.accent, loop: col, outro: C.good };
        const rows = { intro: 0, loop: 1, outro: 2 }, rh = (th - 8) / 3;
        let alt = 0;
        for (const e of st.log) {
          if (e.t0 + e.fullSec < t0) continue;
          const y = ty + 4 + rows[e.name] * rh + (e.name === 'loop' ? (alt++ % 2) * 0 : 0);
          const xa = X(e.t0), xb = X(e.t0 + e.cueSec), xc = X(e.t0 + e.fullSec);
          D.rect(g, xa, y, xb - xa - 1, rh - 3, SC[e.name]);
          if (e.tail) D.rect(g, xb, y + rh * 0.3, xc - xb, rh * 0.4, U.rgb(255, 255, 255, 0.18));
          else D.line(g, xb, y - 2, xb, y + rh, C.bad, 2);
          D.text(g, e.name === 'intro' ? L('인트로', 'Intro') : e.name === 'loop' ? L('루프', 'Loop') : L('아웃트로', 'Outro'), xa + 3, y + 2, { size: 9, color: '#111' });
        }
        const nx = X(st.t);
        D.line(g, nx, ty, nx, ty + th, C.text, 1.5);
        D.text(g, P.tail ? L('흰 띠 = 다음 구간 위에 겹쳐 재생되는 꼬리', 'White band = tail played over the next segment') : L('빨간 선 = 꼬리를 잘라 낸 지점', 'Red line = where the tail is cut'), pad, 6, { size: 10, color: C.dim });
        // 이음매 확대
        const sy = ty + th + 26, sh = H - sy - 30;
        if (sh > 30) {
          A.drawWave(g, seam, pad, sy, tw, sh, { color: col, amp: 2.5, label: L('이음매 확대 (루프 끝 10ms + 루프 시작 10ms, 2.5배)', 'Seam zoom (last 10 ms + first 10 ms of loop, x2.5)') });
          D.line(g, pad + tw / 2, sy, pad + tw / 2, sy + sh, C.warn, 1);
          D.text(g, L('루프 지점', 'loop point'), pad + tw / 2 + 3, sy + sh - 12, { size: 9, color: C.warn });
        }
        const s = segs(48000).loop, err = (cueOf(s) - s.exact) / 48;
        D.text(g, L('루프 지점: ', 'Loop point: ') + cueOf(s) + L(' 샘플 (정확한 값 ', ' samples (exact ') + s.exact + ')', pad, H - 18, { size: 10, color: col });
        ctx.stat(L('루프 길이 오차', 'Loop length error'), err.toFixed(1) + ' ms');
        ctx.stat(L('누적 박 어긋남', 'Accumulated beat drift'), st.drift.toFixed(0) + ' ms');
        ctx.stat(L('이음매 점프 (샘플 차)', 'Seam jump (sample step)'), jump.toFixed(3));
        ctx.stat(L('재생 중', 'Playing'), st.cur ? (st.cur.seg.name === 'intro' ? L('인트로', 'Intro') : st.cur.seg.name === 'loop' ? L('루프 ', 'Loop ') + st.loopN : L('아웃트로', 'Outro')) : L('쉼', 'Rest'));
        snd.stat();
      },
      onAction(k) {
        if (k === 'sound') snd.toggle();
        if (k === 'outro') st.outroReq = true;
      },
      dispose() { snd.stop(); },
    };
  },
});
