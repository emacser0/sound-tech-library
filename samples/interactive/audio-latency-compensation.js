// 소리와 화면의 지연 보정: 출력 지연을 무시 vs 예측 가능한 소리를 지연만큼 일찍 예약 vs 화면을 지연만큼 늦춤
GTL.register({
  id: 'audio-latency-compensation',
  title: '소리와 화면의 지연 보정',
  summary: '공이 북에 닿는 순간 소리를 내도, 오디오 출력 지연(버퍼, 블루투스) 때문에 소리는 그만큼 늦게 들림. 언제 일어날지 아는 소리는 지연만큼 일찍 예약하면 화면과 소리가 맞음. 화면을 늦추는 방법도 있지만 입력 반응이 느려짐.',
  views: { a: '보정 없음', b: '지연만큼 일찍 예약' },
  controls: '조작 없음. "출력 지연"으로 장치의 지연을 흉내 냄.',
  info: `
    <p>게임이 소리를 "지금" 재생해도 스피커에서 나오기까지 <b>출력 지연(output latency)</b>이 있음. 오디오 버퍼(보통 5~50ms), 운영체제 믹서, TV의 영상 처리, 블루투스 코덱(150~250ms)이 쌓임. 화면 쪽에도 지연이 있지만 보통 오디오와 크기가 다름.</p>
    <p>사람은 소리가 화면보다 <b>늦는 것</b>에 더 너그러움(자연에서 빛이 소리보다 빠르므로). ITU-R BT.1359는 소리가 45ms 넘게 빠르거나 125ms 넘게 늦으면 알아챈다고 봄.</p>
    <ul>
      <li><b>보정 없음</b>: 화면의 충돌보다 소리가 지연만큼 늦게 들림</li>
      <li><b>일찍 예약</b>: 충돌 시각을 미리 아는 소리(음악, 리듬, 애니메이션 이벤트)는 지연만큼 앞당겨 예약. 화면 지연이 늘지 않음. 물리 충돌처럼 미리 모르는 소리에는 쓸 수 없음.</li>
      <li><b>화면 늦추기</b>: 게임 화면을 지연만큼 늦게 보여 줌. 모든 소리가 맞지만 입력에 대한 화면 반응이 그만큼 느려짐. 리듬 게임의 "화면 오프셋" 설정이 이 방식.</li>
    </ul>
    <p>지연 값은 장치마다 다름. 브라우저는 <code>AudioContext.outputLatency</code>, <code>baseLatency</code>로 추정값을 알려 줌. 정확하지 않을 때가 많아서 보정 화면으로 직접 재는 게임이 많음.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="4" y="14" class="t-small t-dim">${L('시간 →', 'time →')}</text>
    <line x1="240" y1="20" x2="240" y2="160" class="d-dim" stroke-dasharray="3 3"/><text x="240" y="168" text-anchor="middle" class="t-small">${L('화면의 충돌', 'impact on screen')}</text>
    <text x="4" y="46" class="t-a">A</text>
    <rect x="236" y="34" width="8" height="16" class="f-dim"/><text x="228" y="46" text-anchor="end" class="t-small">${L('재생 요청', 'play call')}</text>
    <path d="M246,42 L346,42" class="d-accent" marker-end="url(#arr)"/><rect x="350" y="34" width="8" height="16" class="f-a"/>
    <text x="364" y="46" class="t-small t-a">${L('들림 (늦음)', 'heard (late)')}</text>
    <text x="296" y="34" text-anchor="middle" class="t-small">${L('출력 지연', 'output latency')}</text>
    <text x="4" y="106" class="t-b">B</text>
    <rect x="126" y="94" width="8" height="16" class="f-dim"/><text x="118" y="106" text-anchor="end" class="t-small">${L('일찍 요청', 'early call')}</text>
    <path d="M136,102 L230,102" class="d-accent" marker-end="url(#arr)"/><rect x="236" y="94" width="8" height="16" class="f-b"/>
    <text x="252" y="106" class="t-small t-b">${L('충돌과 함께 들림', 'heard with the impact')}</text>
    <text x="4" y="140" class="t-small t-dim">${L('일찍 예약은 충돌 시각을 미리 알 때만 가능', 'Early scheduling works only when the impact time is known')}</text>
  </svg>`,
  look: [
    '아래 타임라인을 보면 A는 "화면 충돌" 표시와 "소리 들림" 표시 사이가 출력 지연만큼 벌어지고, B는 같은 세로줄에 있음',
    '"소리 켜기"를 누르고 A를 보면 공이 북에 닿은 뒤에 소리가 남. 출력 지연을 250ms로 올리면 확실히 어긋남.',
    'B의 "보정 값"을 50ms로 바꾸면 남은 차이만큼 다시 어긋남. 보정 값은 실제 지연과 같아야 함.',
    'B를 "화면 늦추기"로 바꾸면 소리와 화면은 맞지만 "추가된 화면 지연" 측정값이 지연만큼 늘어남',
  ],
  refs: [
    { type: 'paper', title: 'ITU-R BT.1359-1, Relative timing of sound and vision for broadcasting', year: 1998, note: '소리와 화면 시차를 알아채는 범위 (+45ms ~ -125ms)' },
    { type: 'article', title: 'MDN - AudioContext.outputLatency', url: 'https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/outputLatency', note: '출력 지연 추정값' },
    { type: 'article', title: 'MDN - AudioContext.baseLatency', url: 'https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/baseLatency', note: '오디오 처리 자체의 지연' },
    { type: 'article', title: 'Chris Wilson, "A Tale of Two Clocks - Scheduling Web Audio with Precision", web.dev', year: 2013, url: 'https://web.dev/articles/audio-scheduling', note: '오디오 시계로 미리 예약하는 방법' },
  ],
  params: [
    { key: 'mode', label: '보정 방식', type: 'select', options: [{ value: 'none', label: '없음' }, { value: 'early', label: '소리를 일찍 예약' }, { value: 'video', label: '화면 늦추기' }], a: 'none', b: 'early', group: '보정' },
    { key: 'comp', label: '보정 값 (ms)', type: 'range', min: 0, max: 400, step: 5, default: 150, when: (p) => p.mode !== 'none', help: '측정한 출력 지연. 실제 지연과 같아야 맞음' },
    { key: 'lat', label: '출력 지연 (ms)', type: 'range', min: 0, max: 400, step: 5, default: 150, shared: true, group: '장치', help: '블루투스 이어폰은 150~250ms' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Audio-Video Latency Compensation',
    summary: 'Even if the sound plays at the moment the ball hits the drum, output latency (buffers, Bluetooth) makes it heard that much later. For sounds whose time is known in advance, scheduling them early by the latency makes picture and sound match. Delaying the picture also works but slows the response to input.',
    views: { a: 'No compensation', b: 'Schedule early by latency' },
    controls: 'No input. "Output latency" simulates the device delay.',
    info: `
    <p>Even when a game plays a sound "now", there is <b>output latency</b> before it leaves the speaker. Audio buffers (usually 5~50 ms), the OS mixer, TV picture processing and Bluetooth codecs (150~250 ms) add up. The picture also has delay, but usually a different amount.</p>
    <p>People tolerate sound that comes <b>after</b> the picture better (light is faster than sound in nature). ITU-R BT.1359 says viewers notice when sound is more than 45 ms early or more than 125 ms late.</p>
    <ul>
      <li><b>No compensation</b>: the sound comes later than the impact on screen by the latency.</li>
      <li><b>Schedule early</b>: sounds whose time is known in advance (music, rhythm, animation events) are scheduled earlier by the latency. No extra picture delay. Not possible for sounds you cannot predict, like physics impacts.</li>
      <li><b>Delay the picture</b>: show the game picture later by the latency. All sounds match, but the picture reacts to input that much later. The "visual offset" setting of rhythm games works this way.</li>
    </ul>
    <p>Latency differs per device. Browsers report estimates with <code>AudioContext.outputLatency</code> and <code>baseLatency</code>. They are often wrong, so many games measure it with a calibration screen.</p>`,
    look: [
      'Look at the timeline below. In A the "impact on screen" and "sound heard" marks are apart by the output latency. In B they are on the same vertical line.',
      'Press "Sound on" and watch A. The sound comes after the ball touches the drum. Raise output latency to 250 ms and the gap is obvious.',
      'Set B\'s "Compensation" to 50 ms. It goes out of sync again by the remaining difference. The compensation must equal the real latency.',
      'Set B to "Delay the picture". Sound and picture match, but the "Added picture delay" stat grows by the latency.',
    ],
    refs: ['Range in which the timing difference of sound and picture is noticed (+45 ms ~ -125 ms).', 'Output latency estimate.', 'Delay of the audio processing itself.', 'Scheduling ahead with the audio clock.'],
    params: {
      mode: { label: 'Compensation method', group: 'Compensation', options: { none: 'None', early: 'Schedule sound early', video: 'Delay the picture' } },
      comp: { label: 'Compensation (ms)', help: 'Measured output latency. It must equal the real latency' },
      lat: { label: 'Output latency (ms)', group: 'Device', help: 'Bluetooth earbuds are 150~250 ms' },
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

    const T = 0.8;                         // 튕기는 주기 (초)
    const NOTES = [45, 52, 48, 55];
    const syn = makeSynth(23);
    const MAXD = 24000 * 2;                // 지연선 (최대 0.5초 @ 96kHz)
    const dl = [new Float32Array(MAXD), new Float32Array(MAXD)];
    const st = { t: 0, trig: -1, wi: 0, heard: [], seen: [], lastHeard: -9, out: [0, 0] };
    const lead = () => (P.mode === 'early' ? P.comp / 1000 : 0);
    const vdel = () => (P.mode === 'video' ? P.comp / 1000 : 0);

    function step(l, r, sr, n) {
      const dN = Math.min(MAXD - 1, Math.round(P.lat / 1000 * sr)), o = st.out;
      for (let i = 0; i < n; i++) {
        // 소리 재생 요청: 충돌 시각 k*T 에서 lead 만큼 일찍
        const k = Math.floor((st.t + lead()) / T);
        if (k > st.trig) {
          {
            syn.play('kick', { amp: 0.4 });
            syn.play('pluck', { f: A.mtof(NOTES[((k % 4) + 4) % 4] + 12), len: 0.3, amp: 0.2 });
            st.heard.push({ t: st.t + P.lat / 1000, k });
          }
          st.trig = k;
        }
        o[0] = o[1] = 0;
        syn.tick(sr, o, null);
        // 장치 출력 지연 흉내: 지연선
        dl[0][st.wi] = o[0]; dl[1][st.wi] = o[1];
        const ri = (st.wi - dN + MAXD) % MAXD;
        l[i] = dl[0][ri]; r[i] = dl[1][ri];
        st.wi = (st.wi + 1) % MAXD;
        st.t += 1 / sr;
      }
      syn.gc();
      // 화면의 충돌: 화면 지연을 더한 시각에 보임
      const kv = Math.floor((st.t - vdel()) / T);
      if (!st.seen.length || st.seen[st.seen.length - 1].k < kv) st.seen.push({ t: kv * T + vdel(), k: kv });
      if (st.heard.length > 30) st.heard.shift();
      if (st.seen.length > 30) st.seen.shift();
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
        // 장면: 화면에 보이는 시각 = t - vdel
        const tv = st.t - vdel(), u = ((tv % T) + T) % T / T;
        const sh = Math.max(110, H * 0.5), cx = W * 0.3, floor = 20 + sh - 24;
        const by = floor - 12 - 4 * (sh - 60) * u * (1 - u);
        D.rect(g, pad, 20, W - pad * 2, sh, 'rgba(0,0,0,0.3)');
        const hitV = u < 0.06 || u > 0.97;
        D.rect(g, cx - 50, floor, 100, 14, hitV ? C.warn : '#555');
        D.circle(g, cx, by, 12, col);
        D.text(g, L('화면', 'Picture'), cx, 24, { size: 10, color: C.dim, align: 'center' });
        // 스피커: 소리가 들리는 순간 빛남
        let hearAge = 9;
        for (const h of st.heard) if (h.t <= st.t) hearAge = Math.min(hearAge, st.t - h.t);
        const sx = W * 0.7, sy = 20 + sh / 2;
        D.rect(g, sx - 16, sy - 22, 32, 44, '#333', C.dim);
        D.circle(g, sx, sy + 4, 10, '#222', C.dim);
        const glow = Math.max(0, 1 - hearAge / 0.15);
        if (glow > 0) for (let k = 1; k <= 3; k++) { g.beginPath(); g.arc(sx + 10, sy + 4, 14 + k * 9, -0.6, 0.6); g.strokeStyle = U.rgb(255, 203, 107, glow); g.lineWidth = 2; g.stroke(); }
        D.text(g, L('들리는 소리', 'What you hear'), sx, 24, { size: 10, color: C.dim, align: 'center' });
        // 타임라인
        const ty = 20 + sh + 16, th = Math.max(40, H - ty - 36), tw = W - pad * 2, PAST = 3, t0 = st.t - PAST;
        const X = (t) => pad + (t - t0) / (PAST + 0.4) * tw;
        D.rect(g, pad, ty, tw, th, 'rgba(0,0,0,0.35)');
        const r1 = ty + th * 0.3, r2 = ty + th * 0.75;
        D.text(g, L('화면 충돌', 'Impact on screen'), pad + 4, ty + 2, { size: 9, color: C.dim });
        D.text(g, L('소리 들림', 'Sound heard'), pad + 4, r2 - th * 0.25 + 2, { size: 9, color: C.dim });
        let off = 0;
        for (const s of st.seen) {
          if (s.t < t0 || s.t > st.t) continue;
          D.rect(g, X(s.t) - 2, r1 - 6, 4, 12, C.warn);
          const h = st.heard.find((q) => q.k === s.k);
          if (h && h.t <= st.t + 0.4) { D.line(g, X(s.t), r1 + 6, X(h.t), r2 - 6, U.rgb(255, 255, 255, 0.3), 1); off = (h.t - s.t) * 1000; }
        }
        for (const h of st.heard) if (h.t >= t0 && h.t <= st.t) D.rect(g, X(h.t) - 2, r2 - 6, 4, 12, col);
        D.line(g, X(st.t), ty, X(st.t), ty + th, C.text, 1);
        const detect = off > 125 || off < -45;
        ctx.stat(L('소리 - 화면 시차', 'Sound minus picture'), (off >= 0 ? '+' : '') + off.toFixed(0) + ' ms');
        ctx.stat(L('알아챌 수 있나 (BT.1359)', 'Noticeable (BT.1359)'), detect ? L('예', 'Yes') : L('아니요', 'No'));
        ctx.stat(L('추가된 화면 지연', 'Added picture delay'), (vdel() * 1000).toFixed(0) + ' ms');
        if (snd.ac && snd.ac.outputLatency != null && typeof snd.ac.outputLatency === 'number') ctx.stat(L('브라우저 추정 출력 지연 (실제 장치)', 'Browser output latency estimate (real device)'), (snd.ac.outputLatency * 1000).toFixed(0) + ' ms');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
