// 템포와 음표 길이: BPM → ms 변환표 (점음표, 셋잇단), 템포에 맞춘 딜레이 시간
GTL.register({
  id: 'tempo-note-durations',
  title: '템포와 음표 길이 (딜레이 싱크)',
  summary: 'BPM에서 각 음표의 길이를 ms로 바꾸는 계산. 4분음표 = 60000 / BPM ms이고, 점음표는 1.5배, 셋잇단은 2/3배. 딜레이 시간을 이 값에 맞추면 메아리가 박자 격자 위에 떨어짐.',
  single: true,
  info: `
    <p><b>BPM(Beats Per Minute)</b>은 1분에 4분음표(박)가 몇 번 오는지를 나타냄. 다른 음표 길이는 모두 여기서 계산됨.</p>
    <ul>
      <li>4분음표 = 60000 / BPM ms. 120 BPM이면 500ms.</li>
      <li>2분음표는 2배, 8분음표는 1/2, 16분음표는 1/4</li>
      <li><b>점음표</b>: 1.5배 (원래 길이 + 절반). 점8분음표 = 3/16 마디.</li>
      <li><b>셋잇단</b>: 2/3배 (두 개 자리에 세 개)</li>
      <li>주파수로 바꾸면 Hz = 1000 / ms. LFO를 템포에 맞출 때 씀.</li>
      <li>샘플 수 = ms × 샘플레이트 / 1000. 딜레이 버퍼 길이를 정할 때 씀.</li>
    </ul>
    <p>딜레이를 템포에 맞추면 메아리가 리듬의 일부가 됨. 점8분음표 딜레이는 8분음표 연주 사이를 메워 16분음표처럼 들리게 하는 유명한 기법. 템포와 맞지 않는 딜레이는 리듬을 흐리게 만듦.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="16" class="t-small t-dim">${L('120 BPM, 1박 = 500ms', '120 BPM, 1 beat = 500 ms')}</text>
    ${[0, 1, 2, 3, 4].map((b) => `<line x1="${30 + b * 120}" y1="26" x2="${30 + b * 120}" y2="130" class="d-dim"/>`).join('')}
    <rect x="30" y="34" width="60" height="16" class="f-b"/><text x="96" y="47" class="t-small">${L('8분음표 250ms', '8th 250 ms')}</text>
    <rect x="30" y="60" width="90" height="16" class="f-b"/><text x="126" y="73" class="t-small">${L('점8분음표 375ms (×1.5)', 'dotted 8th 375 ms (×1.5)')}</text>
    <rect x="30" y="86" width="40" height="16" class="f-b"/><rect x="70" y="86" width="40" height="16" class="f-dim"/><rect x="110" y="86" width="40" height="16" class="f-b"/>
    <text x="156" y="99" class="t-small">${L('8분 셋잇단 167ms (×2/3)', '8th triplet 167 ms (×2/3)')}</text>
    <text x="30" y="144" class="t-small t-dim">${L('세로선 = 박. 길이는 모두 4분음표 길이에 배수를 곱해 계산.', 'Lines = beats. Every length is the quarter note times a factor.')}</text>
  </svg>`,
  look: [
    '템포를 바꾸면 표의 모든 ms 값이 함께 바뀜. 120 BPM의 4분음표는 정확히 500ms.',
    '"소리 켜기"를 누르고 딜레이를 점8분음표로 두면 메아리가 박 사이를 메워 16분음표처럼 들림',
    '딜레이를 "템포 무시 (370ms 고정)"로 바꾸면 메아리가 박자 격자에서 벗어나 리듬이 흐려짐',
    '아래 타임라인에서 메아리 막대가 세로 격자선과 겹치는지 보면 싱크 여부를 알 수 있음',
  ],
  refs: [
    { type: 'book', title: 'Bob Katz, Mastering Audio: The Art and the Science', year: 2007, note: '템포에 맞춘 딜레이, 리버브 시간' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects', year: 2011, note: '딜레이 라인과 피드백 구조' },
    { type: 'engine', title: 'MDN, DelayNode', url: 'https://developer.mozilla.org/en-US/docs/Web/API/DelayNode', note: 'Web Audio에서 딜레이 시간을 초 단위로 지정' },
  ],
  params: [
    { key: 'bpm', label: '템포 (BPM)', type: 'int', min: 40, max: 240, default: 120, group: '템포' },
    { key: 'note', label: '딜레이 음표', type: 'select', options: [
      { value: 'q', label: '4분음표' }, { value: 'e', label: '8분음표' }, { value: 'ed', label: '점8분음표' }, { value: 'et', label: '8분 셋잇단' },
      { value: 's', label: '16분음표' }, { value: 'qd', label: '점4분음표' }, { value: 'qt', label: '4분 셋잇단' }, { value: 'free', label: '템포 무시 (370ms 고정)' }], default: 'ed', group: '딜레이' },
    { key: 'fb', label: '피드백', type: 'range', min: 0, max: 0.85, step: 0.01, default: 0.45 },
    { key: 'mix', label: '딜레이 음량', type: 'range', min: 0, max: 1, step: 0.01, default: 0.6 },
    ...GTL.audio.params({ single: true }),
  ],
  en: {
    title: 'Tempo & Note Durations (Delay Sync)',
    summary: 'Converts BPM into the length of each note value in ms. A quarter note = 60000 / BPM ms, a dotted note is 1.5 times longer and a triplet is 2/3. If the delay time uses these values, the echoes land on the beat grid.',
    info: `
    <p><b>BPM (beats per minute)</b> is how many quarter notes (beats) come in one minute. Every other note length comes from it.</p>
    <ul>
      <li>Quarter note = 60000 / BPM ms. At 120 BPM it is 500 ms.</li>
      <li>Half note is 2 times, 8th is 1/2, 16th is 1/4.</li>
      <li><b>Dotted</b>: 1.5 times (the note plus half). A dotted 8th = 3/16 of a bar.</li>
      <li><b>Triplet</b>: 2/3 times (three in the space of two).</li>
      <li>As a frequency, Hz = 1000 / ms. Use it to sync an LFO to the tempo.</li>
      <li>Samples = ms × sample rate / 1000. Use it to size a delay buffer.</li>
    </ul>
    <p>A delay synced to the tempo makes the echoes part of the rhythm. A dotted 8th delay fills the gaps between played 8th notes so they sound like 16ths. This is a well known trick. A delay that ignores the tempo blurs the rhythm.</p>`,
    look: [
      'Change the tempo. Every ms value in the table changes with it. A quarter note at 120 BPM is exactly 500 ms.',
      'Press "Sound on" and set the delay to dotted 8th. The echoes fill the gaps between beats and sound like 16ths.',
      'Set the delay to "Ignore tempo (fixed 370 ms)". The echoes leave the beat grid and the rhythm blurs.',
      'In the timeline below, check whether the echo bars line up with the vertical grid lines to see if the delay is synced.',
    ],
    refs: ['Delay and reverb times synced to the tempo.', 'Delay lines and feedback.', 'Setting the delay time in seconds in Web Audio.'],
    params: {
      bpm: { label: 'Tempo (BPM)', group: 'Tempo' },
      note: { label: 'Delay note', group: 'Delay', options: { q: 'Quarter', e: '8th', ed: 'Dotted 8th', et: '8th triplet', s: '16th', qd: 'Dotted quarter', qt: 'Quarter triplet', free: 'Ignore tempo (fixed 370 ms)' } },
      fb: 'Feedback',
      mix: 'Delay level',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const L = (k, e) => GTL.L(k, e);
    const col = C.b;
    // ── 작은 드럼, 음 합성기 (이 카테고리 샘플마다 같은 코드를 둠). 시드 노이즈, 블록 안 샘플 위치에서 시작 ──
    function makeKit(seed) {
      let s = (seed >>> 0) || 1;
      const nz = () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return (s >>> 0) / 2147483648 - 1; };
      const vs = [];
      const LEN = { kick: 0.6, snare: 0.35, hat: 0.12, ohat: 0.5, clap: 0.35, rim: 0.08, tom: 0.5, bell: 0.9 };
      return {
        vs,
        // kind: kick, snare, hat, ohat, clap, rim, tom, bell, tone, bass. at: 블록 안 시작 샘플. o: { vel, f, dur, pan, cut }
        trig(kind, at, o = {}) {
          if (vs.length > 48) vs.shift();
          vs.push({ kind, at: Math.max(0, at | 0), t: 0, vel: o.vel ?? 1, f: o.f || 220, dur: o.dur || 0.2, pan: o.pan || 0, cut: o.cut || 0, ph: 0, lp: 0, lp2: 0, x1: 0 });
        },
        render(Lb, Rb, n, sr) {
          Lb.fill(0); Rb.fill(0);
          const dt = 1 / sr, T = 6.283185307;
          for (let j = vs.length - 1; j >= 0; j--) {
            const v = vs[j];
            const end = v.kind === 'tone' || v.kind === 'bass' ? v.dur + 0.12 : LEN[v.kind] || 0.3;
            const gl = v.vel * (1 - Math.max(0, v.pan)), gr = v.vel * (1 + Math.min(0, v.pan));
            for (let i = v.at; i < n && v.t < end; i++) {
              const t = v.t; let y = 0;
              switch (v.kind) {
                case 'kick': { v.ph += (48 + 120 * Math.exp(-t * 28)) * dt; y = Math.sin(T * v.ph) * Math.exp(-t * 6) * 0.9; break; }
                case 'tom': { v.ph += (v.f * 0.5 + v.f * 0.3 * Math.exp(-t * 20)) * dt; y = Math.sin(T * v.ph) * Math.exp(-t * 8) * 0.6; break; }
                case 'snare': { const w = nz(), h = w - v.x1; v.x1 = w; y = h * 0.35 * Math.exp(-t * 18) + Math.sin(T * 185 * t) * 0.4 * Math.exp(-t * 25); break; }
                case 'hat': case 'ohat': { const w = nz(), h = w - v.x1; v.x1 = w; y = h * 0.16 * Math.exp(-t * (v.kind === 'hat' ? 50 : 9)); break; }
                case 'clap': {
                  const w = nz(), h = w - v.x1; v.x1 = w; let e = 0;
                  for (let k = 0; k < 3; k++) { const tk = t - k * 0.011; if (tk >= 0) e += Math.exp(-tk * 140); }
                  if (t > 0.022) e += Math.exp(-(t - 0.022) * 16) * 0.6;
                  y = h * 0.3 * e; break;
                }
                case 'rim': y = Math.sin(T * 1650 * t) * Math.exp(-t * 80) * 0.45; break;
                case 'bell': y = (Math.sin(T * v.f * t) + 0.4 * Math.sin(T * v.f * 2.76 * t)) * Math.exp(-t * 5) * 0.35 * Math.min(1, t / 0.002); break;
                default: { // tone, bass: 톱니파(+삼각파) + 2차 원폴 로우패스, 짧은 어택과 릴리스
                  v.ph += v.f * dt; v.ph -= Math.floor(v.ph);
                  const bass = v.kind === 'bass';
                  const raw = bass ? (2 * v.ph - 1) * 0.5 + (4 * Math.abs(v.ph - 0.5) - 1) * 0.6 : 2 * v.ph - 1;
                  const c = v.cut || (bass ? 0.05 : 0.12);
                  v.lp += c * (raw - v.lp); v.lp2 += c * (v.lp - v.lp2);
                  const env = Math.min(1, t / 0.004) * (t < v.dur ? 1 : Math.max(0, 1 - (t - v.dur) / 0.12)) * (bass ? Math.exp(-t * 1.2) : Math.exp(-t * 2.5));
                  y = v.lp2 * env * (bass ? 0.9 : 0.7);
                }
              }
              Lb[i] += y * gl; Rb[i] += y * gr;
              v.t += dt;
            }
            v.at = 0;
            if (v.t >= end) vs.splice(j, 1);
          }
          for (let i = 0; i < n; i++) { Lb[i] = Math.tanh(Lb[i] * 1.1) * 0.6; Rb[i] = Math.tanh(Rb[i] * 1.1) * 0.6; }
        },
      };
    }
    // 시드 해시 (0~1). 같은 i, salt면 같은 값. 화면과 소리가 같은 난수를 씀
    const hash = (i, salt = 0) => {
      let x = (Math.imul(i | 0, 2654435761) ^ Math.imul((salt | 0) + 1 + ctx.seed, 2246822519)) >>> 0;
      x ^= x >>> 15; x = Math.imul(x, 2246822519); x ^= x >>> 13; x = Math.imul(x, 3266489917); x ^= x >>> 16;
      return (x >>> 0) / 4294967296;
    };
    // 반복 이벤트 목록(evs: [{ t, ... }], 0 <= t < len) 중 [t0, t1)에 걸리는 것을 fn(e, 절대 시각)으로 넘김
    const loopEach = (evs, len, t0, t1, fn) => {
      if (!(len > 0)) return;
      for (let c = Math.floor(t0 / len); c * len < t1; c++) for (const e of evs) { const t = c * len + e.t; if (t >= t0 && t < t1) fn(e, t); }
    };
    // 재생 시계: 소리가 꺼져 있으면 update의 dt로, 켜져 있으면 오디오 블록으로 진행. 일시정지 중에는 소리를 멈춤
    const clock = { t: 0, seen: 0 };
    const kit = makeKit(ctx.seed * 7 + 3);
    const runAudio = (l, r, sr, n, schedule) => {
      if (ctx.now() - clock.seen > 400) { l.fill(0); r.fill(0); return; }
      const t0 = clock.t, t1 = t0 + n / sr;
      schedule(t0, t1, (kind, t, o) => kit.trig(kind, (t - t0) * sr, o));
      kit.render(l, r, n, sr);
      clock.t = t1;
    };
    const tick = (dt) => { clock.seen = ctx.now(); if (!snd.on) clock.t += dt; snd.update(); };
    // 뷰 왼쪽 위의 뷰 이름 표시와 겹치지 않게 그림 전체를 TOP만큼 내림
    const TOP = 26;
    const FACT = { q: 1, e: 0.5, ed: 0.75, et: 1 / 3, s: 0.25, qd: 1.5, qt: 2 / 3 };
    const delayMs = () => (P.note === 'free' ? 370 : (60000 / P.bpm) * FACT[P.note]);
    // 딜레이 라인 (스테레오, 2초)
    const MAXD = 96000 * 2;
    const bufL = new Float32Array(MAXD), bufR = new Float32Array(MAXD);
    let wi = 0, dS = 0;
    // 연주: 8분음표 리듬의 짧은 플럭 (마디 단위 반복)
    const RIFF = [[0, 64], [0.5, 67], [1.5, 71], [2, 69], [3, 67], [3.5, 64]];
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        runAudio(l, r, sr, n, (t0, t1, trig) => {
          const beat = 60 / P.bpm, bar = beat * 4;
          loopEach(RIFF.map(([b, m]) => ({ t: b * beat, m })), bar, t0, t1, (e, t) => trig('tone', t, { f: A.mtof(e.m + 12), dur: 0.05, vel: 0.9, cut: 0.25 }));
          for (let i = Math.ceil(t0 / beat - 1e-9); i * beat < t1; i++) if (i * beat >= t0) trig('rim', i * beat, { vel: i % 4 === 0 ? 0.35 : 0.2 });
        });
        const target = Math.min(MAXD - 4, delayMs() * sr / 1000);
        if (!dS) dS = target;
        const fb = P.fb, mix = P.mix;
        for (let i = 0; i < n; i++) {
          dS += (target - dS) * 0.0005; // 딜레이 시간을 부드럽게 바꿈 (클릭 잡음 방지)
          let rp = wi - dS; while (rp < 0) rp += MAXD;
          const i0 = Math.floor(rp), fr = rp - i0, i1 = (i0 + 1) % MAXD;
          const dl = bufL[i0] + (bufL[i1] - bufL[i0]) * fr, dr = bufR[i0] + (bufR[i1] - bufR[i0]) * fr;
          bufL[wi] = l[i] + dr * fb; bufR[wi] = r[i] + dl * fb; // 핑퐁
          l[i] = (l[i] + dl * mix) * 0.8; r[i] = (r[i] + dr * mix) * 0.8;
          wi = (wi + 1) % MAXD;
        }
      },
    });

    const ROWS = [['온음표', 'Whole', 4], ['2분음표', 'Half', 2], ['4분음표', 'Quarter', 1], ['8분음표', '8th', 0.5], ['16분음표', '16th', 0.25], ['32분음표', '32nd', 0.125]];
    const inst = {
      update(dt) { tick(dt); },
      render() { ctx.g.save(); ctx.g.translate(0, TOP); try { inst.drawView(); } finally { ctx.g.restore(); } },
      drawView() {
        const g = ctx.g, W = ctx.width, H = ctx.height - TOP, pad = 10, q = 60000 / P.bpm;
        // 표
        const cols = [L('음표', 'Note'), L('보통', 'Normal'), L('점음표 ×1.5', 'Dotted ×1.5'), L('셋잇단 ×2/3', 'Triplet ×2/3')];
        const cw = (W - pad * 2) / 4, rh = Math.min(22, (H * 0.5) / 7);
        cols.forEach((c, i) => D.text(g, c, pad + i * cw, pad, { size: 11, color: C.dim }));
        const sel = P.note === 'free' ? null : { q: [2, 1], e: [3, 1], ed: [3, 2], et: [3, 3], s: [4, 1], qd: [2, 2], qt: [2, 3] }[P.note];
        ROWS.forEach(([ko, en, f], ri) => {
          const y = pad + (ri + 1) * rh + 4;
          if (ri % 2 === 0) D.rect(g, pad, y - 3, W - pad * 2, rh, 'rgba(255,255,255,0.03)');
          D.text(g, L(ko, en), pad, y, { size: 11 });
          [f, f * 1.5, (f * 2) / 3].forEach((m, ci) => {
            const ms = q * m, on = sel && sel[0] === ri && sel[1] === ci + 1;
            if (on) D.rect(g, pad + (ci + 1) * cw - 4, y - 3, cw, rh, 'rgba(79,195,247,0.25)');
            D.text(g, `${ms.toFixed(ms < 100 ? 1 : 0)} ms`, pad + (ci + 1) * cw, y, { size: 11, color: on ? '#fff' : C.text });
          });
        });
        // 타임라인: 1마디. 연주 음과 메아리
        const ty = pad + 8 * rh + 20, th = Math.max(60, H - ty - 16), tw = W - pad * 2, bar = q * 4;
        D.rect(g, pad, ty, tw, th, 'rgba(0,0,0,0.3)');
        D.text(g, L('1마디: 흰 막대 = 연주, 색 막대 = 메아리 (높이 = 크기)', '1 bar: white = played, color = echoes (height = level)'), pad, ty - 14, { size: 10, color: C.dim });
        for (let s = 0; s <= 16; s++) D.line(g, pad + (s / 16) * tw, ty, pad + (s / 16) * tw, ty + th, s % 4 === 0 ? 'rgba(255,255,255,0.3)' : C.grid, 1);
        const dm = delayMs();
        for (const [b] of RIFF) {
          const x0 = pad + ((b * q) / bar) * tw;
          D.rect(g, x0 - 2, ty + 8, 4, th - 16, '#fff');
          let amp = P.mix;
          for (let k = 1; k < 12 && amp > 0.03; k++) {
            const t = b * q + k * dm;
            const x = pad + ((t % bar) / bar) * tw;
            const h = amp * (th - 16);
            D.rect(g, x - 1.5, ty + th - 8 - h, 3, h, col);
            amp *= P.fb;
          }
        }
        const ph = ((clock.t * 1000) % bar) / bar;
        D.line(g, pad + ph * tw, ty, pad + ph * tw, ty + th, C.warn, 1.5);
        ctx.stat(L('4분음표', 'Quarter note'), q.toFixed(1) + ' ms');
        ctx.stat(L('딜레이 시간', 'Delay time'), dm.toFixed(1) + ' ms');
        ctx.stat(L('딜레이 샘플 수 (48kHz)', 'Delay samples (48 kHz)'), Math.round((dm * 48000) / 1000));
        ctx.stat(L('같은 주기의 LFO', 'LFO at the same period'), (1000 / dm).toFixed(3) + ' Hz');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
    return inst;
  },
});
