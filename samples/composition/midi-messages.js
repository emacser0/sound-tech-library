// MIDI 메시지: 매번 상태 바이트를 보내는 방식 vs 러닝 스테이터스 + 세기 0 노트 온(노트 오프 대신). 바이트 수와 전송 시간 비교
GTL.register({
  id: 'midi-messages',
  title: 'MIDI 메시지와 러닝 스테이터스',
  summary: '같은 프레이즈(노트 온, 노트 오프, 컨트롤 체인지)를 MIDI 바이트로 바꿔 비교. 메시지마다 상태 바이트를 보내면 3바이트씩 필요함. 러닝 스테이터스와 "세기 0 노트 온"을 쓰면 상태 바이트를 생략해 바이트 수와 전송 지연이 최대 약 1/3 줄어듦.',
  views: { a: '항상 상태 바이트', b: '러닝 스테이터스' },
  info: `
    <p><b>MIDI 1.0</b>은 1983년 규격. 악기끼리 음을 주고받는 메시지를 바이트로 정함. 5핀 DIN 케이블은 31,250 bps의 직렬 전송이고, 1바이트에 10비트(시작, 8데이터, 정지)가 들어 <b>바이트당 0.32ms</b>가 걸림.</p>
    <ul>
      <li><b>상태 바이트</b>: 최상위 비트가 1. 종류(상위 4비트)와 채널(하위 4비트). 노트 온 = 0x9n, 노트 오프 = 0x8n, 컨트롤 체인지(CC) = 0xBn.</li>
      <li><b>데이터 바이트</b>: 최상위 비트가 0이라 값은 0~127. 노트 온은 음 번호와 세기(velocity), CC는 컨트롤러 번호와 값.</li>
      <li><b>러닝 스테이터스</b>: 상태 바이트가 바로 앞과 같으면 생략 가능. 받는 쪽은 마지막 상태를 기억함.</li>
      <li><b>세기 0 노트 온 = 노트 오프</b>: 규격이 허용하는 관례. 노트 온과 노트 오프가 섞여도 상태가 바뀌지 않아 러닝 스테이터스가 계속 이어짐.</li>
    </ul>
    <p>화음처럼 동시에 보낸 음도 케이블 위에서는 한 줄로 늘어섬. 3음 화음 = 9바이트 = 약 2.9ms. 바이트가 줄면 이 번짐도 줄어듦. USB MIDI와 MIDI 2.0은 패킷 단위로 보내므로 이 문제가 작음.</p>`,
  diagram: (L) => {
    const box = (x, y, t, cls, w = 34) => `<rect x="${x}" y="${y}" width="${w}" height="20" class="${cls}"/><text x="${x + w / 2}" y="${y + 14}" text-anchor="middle" class="t-small t-mono">${t}</text>`;
    const A = [['90', 'f-a'], ['3C', 'f-dim'], ['64', 'f-dim'], ['90', 'f-a'], ['40', 'f-dim'], ['50', 'f-dim'], ['80', 'f-a'], ['3C', 'f-dim'], ['40', 'f-dim']];
    const B = [['90', 'f-b'], ['3C', 'f-dim'], ['64', 'f-dim'], ['40', 'f-dim'], ['50', 'f-dim'], ['3C', 'f-dim'], ['00', 'f-dim']];
    return `<svg viewBox="0 0 540 140" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="16" class="t-small t-dim">${L('노트 온 C4, 노트 온 E4, 노트 오프 C4 (16진수)', 'Note on C4, note on E4, note off C4 (hex)')}</text>
    <text x="4" y="44" class="t-small t-a">A</text>${A.map(([t, c], i) => box(20 + i * 38, 30, t, c)).join('')}
    <text x="370" y="44" class="t-small t-a">${L('9바이트', '9 bytes')}</text>
    <text x="4" y="84" class="t-small t-b">B</text>${B.map(([t, c], i) => box(20 + i * 38, 70, t, c)).join('')}
    <text x="290" y="84" class="t-small t-b">${L('7바이트 (상태 1번, 오프 = 세기 0)', '7 bytes (one status, off = velocity 0)')}</text>
    <text x="4" y="124" class="t-small t-dim">${L('색 칸 = 상태 바이트, 회색 칸 = 데이터 바이트. 1바이트 = 0.32ms.', 'Colored = status byte, gray = data byte. 1 byte = 0.32 ms.')}</text>
  </svg>`;
  },
  look: [
    'A의 바이트 줄은 3칸마다 색 칸(상태 바이트)이 있음. B는 CC가 끼어들 때만 상태 바이트가 다시 나옴.',
    '"한 바퀴 바이트 수"와 "절약"을 보면 B가 약 20% 적음. CC74를 보내지 않으면 약 30%.',
    '"화음 번짐"은 첫 화음의 마지막 음이 첫 음보다 늦게 도착하는 시간. B가 더 짧음.',
    'CC 간격을 "16분음표마다"로 줄이면 CC가 노트 사이에 자주 끼어 러닝 스테이터스가 자주 끊기고 절약이 줄어듦',
    '"소리 켜기"를 누르면 CC74(밝기)가 필터를 열고 닫는 소리가 들림. 두 뷰의 소리는 같음 (바이트만 다름).',
  ],
  refs: [
    { type: 'engine', title: 'MIDI Manufacturers Association, The Complete MIDI 1.0 Detailed Specification', year: 1996, note: '상태 바이트, 러닝 스테이터스, 세기 0 노트 온' },
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', year: 1996, note: 'MIDI 장, 전송 속도와 타이밍 한계' },
    { type: 'paper', title: 'F. Richard Moore, "The Dysfunctions of MIDI", Computer Music Journal 12(1)', year: 1988, note: '31.25kbps 대역폭과 화음 번짐 문제 지적' },
    { type: 'engine', title: 'MDN, Web MIDI API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API', note: '브라우저에서 MIDIMessageEvent.data로 바이트를 받음' },
  ],
  params: [
    { key: 'running', label: '러닝 스테이터스', type: 'bool', a: false, b: true, default: false, group: '인코딩' },
    { key: 'zeroOff', label: '노트 오프를 세기 0 노트 온으로', type: 'bool', a: false, b: true, default: false },
    { key: 'ccRate', label: 'CC74 간격', type: 'select', options: [{ value: 0, label: '보내지 않음' }, { value: 1, label: '4분음표마다' }, { value: 2, label: '8분음표마다' }, { value: 4, label: '16분음표마다' }], default: 1, shared: true },
    { key: 'bpm', label: '템포 (BPM)', type: 'int', min: 60, max: 180, default: 108, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'MIDI Messages & Running Status',
    summary: 'The same phrase (note on, note off, control change) encoded as MIDI bytes. Sending a status byte with every message takes 3 bytes each. Running status plus "note on with velocity 0" drops repeated status bytes and cuts bytes and wire delay by up to about a third.',
    views: { a: 'Always status byte', b: 'Running status' },
    info: `
    <p><b>MIDI 1.0</b> is a 1983 standard. It defines byte messages that instruments use to send notes to each other. The 5-pin DIN cable is a 31,250 bps serial line. One byte takes 10 bits (start, 8 data, stop), so each byte takes <b>0.32 ms</b>.</p>
    <ul>
      <li><b>Status byte</b>: top bit is 1. Type in the upper 4 bits, channel in the lower 4 bits. Note on = 0x9n, note off = 0x8n, control change (CC) = 0xBn.</li>
      <li><b>Data bytes</b>: top bit is 0, so values are 0~127. Note on carries the note number and velocity. CC carries the controller number and value.</li>
      <li><b>Running status</b>: if the status byte is the same as the last one, it can be left out. The receiver remembers the last status.</li>
      <li><b>Note on with velocity 0 = note off</b>: a convention the standard allows. Mixed note on and note off messages then keep the same status, so running status continues.</li>
    </ul>
    <p>Notes sent "at the same time", like a chord, still line up one by one on the cable. A 3-note chord = 9 bytes = about 2.9 ms. Fewer bytes means less smear. USB MIDI and MIDI 2.0 send packets, so this problem is smaller there.</p>`,
    look: [
      'A\'s byte row has a colored cell (status byte) every 3 cells. In B a status byte comes back only when a CC cuts in.',
      'Compare "Bytes per loop" and "Saved". B uses about 20% fewer bytes. Without CC74 it is about 30%.',
      '"Chord smear" is how much later the last note of the first chord arrives than the first note. B is shorter.',
      'Set the CC74 interval to "Every 16th". CCs cut in between notes often, running status breaks often, and the saving shrinks.',
      'Press "Sound on". CC74 (brightness) opens and closes the filter. Both views sound the same (only the bytes differ).',
    ],
    refs: ['Status bytes, running status, note on with velocity 0.', 'MIDI chapter, bandwidth and timing limits.', 'Points out the 31.25 kbps bandwidth and chord smear problems.', 'Browsers receive bytes in MIDIMessageEvent.data.'],
    params: {
      running: { label: 'Running status', group: 'Encoding' },
      zeroOff: 'Note off as note on with velocity 0',
      ccRate: { label: 'CC74 interval', options: { 0: 'Do not send', 1: 'Every quarter', 2: 'Every 8th', 4: 'Every 16th' } },
      bpm: 'Tempo (BPM)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const L = (k, e) => GTL.L(k, e);
    const col = ctx.side === 'a' ? C.a : C.b;
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
    const BYTE_MS = 10 / 31.25; // 0.32ms
    // 프레이즈 (2마디, 박 단위): 화음 하나 + 선율
    const NOTES = [
      [0, 60, 1.8, 96], [0, 64, 1.8, 90], [0, 67, 1.8, 88],
      [2, 72, 0.45, 100], [2.5, 71, 0.45, 70], [3, 67, 0.45, 84], [3.5, 69, 0.9, 76],
      [4, 62, 1.8, 92], [4, 65, 1.8, 86], [4, 69, 1.8, 84],
      [6, 74, 0.45, 104], [6.5, 72, 0.45, 72], [7, 71, 0.45, 88], [7.5, 67, 0.4, 64],
    ];
    const LOOP = 8;
    let key = '', enc = null;
    // 메시지 목록 → 바이트. 같은 시각의 메시지는 줄을 서서 전송됨
    function encode() {
      const k = [P.running, P.zeroOff, P.ccRate].join(',');
      if (k === key) return enc;
      key = k;
      const msgs = [];
      NOTES.forEach(([b, m, d, v], i) => { msgs.push({ b, type: 'on', m, v, i, ord: 1 }); msgs.push({ b: b + d, type: 'off', m, v: 0, i, ord: 0 }); });
      const cr = Number(P.ccRate);
      if (cr) for (let s = 0; s < LOOP * cr; s++) { const b = s / cr; msgs.push({ b, type: 'cc', v: Math.round(64 + 60 * Math.sin((b / LOOP) * Math.PI * 2)), ord: -1 }); }
      msgs.sort((x, y) => x.b - y.b || x.ord - y.ord);
      let last = -1, total = 0, status = 0, prevB = -1, queue = 0;
      for (const ms of msgs) {
        let st, d1, d2;
        if (ms.type === 'cc') { st = 0xb0; d1 = 74; d2 = ms.v; }
        else if (ms.type === 'on') { st = 0x90; d1 = ms.m; d2 = ms.v; }
        else if (P.zeroOff) { st = 0x90; d1 = ms.m; d2 = 0; }
        else { st = 0x80; d1 = ms.m; d2 = 64; }
        const bytes = [];
        if (!(P.running && st === last)) { bytes.push(st); status++; }
        bytes.push(d1, d2);
        last = st;
        // 같은 박 위치면 앞 메시지 뒤에 줄을 섬
        if (Math.abs(ms.b - prevB) > 1e-9) queue = 0;
        ms.wire = queue * BYTE_MS; // 이 메시지가 시작되기까지 기다린 시간
        queue += bytes.length; prevB = ms.b;
        ms.bytes = bytes; ms.st = st; total += bytes.length;
      }
      const chord = msgs.filter((x) => x.type === 'on' && x.b === 0);
      const arr = chord.map((x) => x.wire + x.bytes.length * BYTE_MS); // 마지막 바이트 도착 시각
      const smear = arr.length ? Math.max(...arr) - Math.min(...arr) : 0;
      enc = { msgs, total, status, smear };
      return enc;
    }
    const hex = (b) => b.toString(16).toUpperCase().padStart(2, '0');
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        runAudio(l, r, sr, n, (t0, t1, trig) => {
          const e = encode(), beat = 60 / P.bpm, len = LOOP * beat;
          let cc;
          const ccAt = (b) => { let v = 64; for (const ms of e.msgs) if (ms.type === 'cc' && ms.b <= b + 1e-9) v = ms.v; return v; };
          for (let c = Math.floor(t0 / len); c * len < t1; c++) for (const ms of e.msgs) {
            if (ms.type !== 'on') continue;
            const t = c * len + ms.b * beat + (ms.wire + ms.bytes.length * BYTE_MS) / 1000; // 마지막 바이트가 도착해야 소리가 남
            if (t < t0 || t >= t1) continue;
            cc = Number(P.ccRate) ? ccAt(ms.b) : 64;
            const nt = NOTES[ms.i];
            trig('tone', t, { f: A.mtof(nt[1]), dur: nt[2] * beat * 0.95, vel: (nt[3] / 127) * 0.6, cut: 0.03 + (cc / 127) * 0.3 });
          }
        });
      },
    });

    const inst = {
      update(dt) { tick(dt); },
      render() { ctx.g.save(); ctx.g.translate(0, TOP); try { inst.drawView(); } finally { ctx.g.restore(); } },
      drawView() {
        const g = ctx.g, W = ctx.width, H = ctx.height - TOP, pad = 10;
        const e = encode(), beat = 60 / P.bpm, pos = (clock.t / beat) % LOOP;
        // 피아노 롤 + CC 곡선
        const rx = pad + 26, ry = pad + 16, rw = W - rx - pad, rh = Math.max(60, H * 0.36);
        const lo = 58, hi = 76, rowH = rh / (hi - lo + 1), X = (b) => rx + (b / LOOP) * rw, Y = (m) => ry + rh - (m - lo + 1) * rowH;
        D.rect(g, rx, ry, rw, rh, 'rgba(0,0,0,0.3)');
        D.text(g, L('노트 (밝을수록 세기가 큼)와 CC74 값 (노란 선)', 'Notes (brighter = higher velocity) and CC74 value (yellow line)'), pad, pad, { size: 10, color: C.dim });
        for (let b = 0; b <= LOOP; b++) D.line(g, X(b), ry, X(b), ry + rh, b % 4 === 0 ? 'rgba(255,255,255,0.25)' : C.grid, 1);
        for (const m of [60, 72]) D.text(g, A.noteName(m), pad, Y(m) + rowH / 2 - 5, { size: 9, color: C.dim });
        for (const [b, m, d, v] of NOTES) {
          const on = pos >= b && pos < b + d;
          g.globalAlpha = 0.35 + 0.65 * (v / 127);
          D.rect(g, X(b) + 1, Y(m) + 1, (d / LOOP) * rw - 2, rowH - 2, on ? '#fff' : col);
          g.globalAlpha = 1;
        }
        const ccs = e.msgs.filter((x) => x.type === 'cc');
        if (ccs.length) {
          g.beginPath();
          let lastY = 0;
          ccs.forEach((x, i) => { const px = X(x.b), py = ry + rh - (x.v / 127) * rh; if (i) { g.lineTo(px, lastY); g.lineTo(px, py); } else g.moveTo(px, py); lastY = py; });
          g.lineTo(X(LOOP), lastY);
          g.strokeStyle = C.warn; g.lineWidth = 1.2; g.stroke();
        }
        D.line(g, X(pos), ry, X(pos), ry + rh, C.warn, 1.5);
        // 바이트 줄: 지금 위치 근처의 메시지
        const by = ry + rh + 26, bs = Math.max(14, Math.min(26, (W - pad * 2) / 18));
        D.text(g, L('최근 메시지의 바이트 (색 = 상태 바이트, 회색 = 데이터)', 'Bytes of recent messages (color = status, gray = data)'), pad, by - 16, { size: 10, color: C.dim });
        let idx = e.msgs.findIndex((x) => x.b > pos + 1e-9); if (idx < 0) idx = e.msgs.length;
        const recent = [];
        for (let k = 1; recent.length < 7 && k <= e.msgs.length; k++) recent.unshift(e.msgs[(idx - k + e.msgs.length * 2) % e.msgs.length]);
        const lineH = Math.max(16, Math.min(22, (H - by - 8) / 7));
        recent.forEach((ms, j) => {
          const y = by + j * lineH;
          let x = pad;
          ms.bytes.forEach((b, i) => {
            const isSt = b >= 0x80;
            D.rect(g, x, y, bs * 1.4, lineH - 3, isSt ? col : 'rgba(255,255,255,0.12)');
            D.text(g, hex(b), x + bs * 0.7, y + 2, { size: 10, align: 'center', color: isSt ? '#111' : C.text });
            x += bs * 1.4 + 3;
          });
          const kind = ms.type === 'cc' ? L(`CC74 = ${ms.v}`, `CC74 = ${ms.v}`) : ms.type === 'on' ? L(`노트 온 ${A.noteName(ms.m)} 세기 ${ms.v}`, `Note on ${A.noteName(ms.m)} vel ${ms.v}`) : L(`노트 오프 ${A.noteName(ms.m)}`, `Note off ${A.noteName(ms.m)}`);
          D.text(g, kind, pad + (bs * 1.4 + 3) * 3 + 8, y + 2, { size: 10, color: ms.bytes.length < 3 ? C.good : C.dim });
        });
        const full = e.msgs.length * 3;
        ctx.stat(L('한 바퀴 바이트 수', 'Bytes per loop'), `${e.total} (${L('메시지', 'messages')} ${e.msgs.length})`);
        ctx.stat(L('절약 (매번 상태 바이트 대비)', 'Saved (vs status every time)'), (((full - e.total) / full) * 100).toFixed(0) + '%');
        ctx.stat(L('한 바퀴 전송 시간', 'Wire time per loop'), (e.total * BYTE_MS).toFixed(1) + ' ms');
        ctx.stat(L('화음 번짐 (첫 화음)', 'Chord smear (first chord)'), e.smear.toFixed(2) + ' ms');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
    return inst;
  },
});
