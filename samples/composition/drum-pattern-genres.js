// 장르별 드럼 패턴: 록, 펑크, 디스코, 하우스, 붐뱁, 보사노바, 원 드롭, 트랩, 드럼 앤 베이스, 셔플을 16칸 그리드로 비교
GTL.register({
  id: 'drum-pattern-genres',
  title: '장르별 드럼 패턴',
  summary: '장르의 느낌은 킥과 스네어의 자리, 하이햇의 밀도, 템포, 스윙으로 대부분 정해짐. 같은 16칸 그리드에 장르별 기본 패턴을 놓고 두 장르를 나란히 비교.',
  views: { a: '록', b: '보사노바' },
  info: `
    <p>드럼 패턴은 장르를 알아보게 하는 가장 강한 단서. 같은 악기 몇 개로도 다음 네 가지를 바꾸면 전혀 다른 장르가 됨.</p>
    <ul>
      <li><b>킥과 스네어 자리</b>: 록과 팝은 2, 4박 스네어(백비트). 레게 원 드롭은 3박에 킥과 림을 함께 침. 드럼 앤 베이스는 빠른 템포에서 2, 4박 스네어 사이에 킥을 비켜 놓음.</li>
      <li><b>하이햇 밀도</b>: 8분음표(록), 16분음표(펑크), 뒷박 오픈 하이햇(디스코, 하우스)</li>
      <li><b>템포</b>: 레게 70대, 붐뱁 90대, 하우스 120대, 드럼 앤 베이스 170대 BPM</li>
      <li><b>스윙과 고스트 노트</b>: 붐뱁과 셔플은 스윙, 펑크는 작은 세기의 고스트 스네어로 틈을 메움</li>
    </ul>
    <p>여기 패턴은 각 장르를 대표하는 단순한 뼈대. 실제 곡은 필인, 변형, 세기 변화로 더 풍부함.</p>`,
  diagram: (L) => {
    const row = (y, p, cls) => [...p].map((c, i) => `<rect x="${100 + i * 26}" y="${y}" width="22" height="18" class="${c === 'x' ? cls : 'f-dim'}"/>`).join('');
    return `<svg viewBox="0 0 540 130" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="16" class="t-small t-dim">${L('백비트: 2, 4박 (5번, 13번 칸)의 스네어', 'Backbeat: snare on beats 2 and 4 (steps 5 and 13)')}</text>
    <text x="4" y="40">${L('킥', 'Kick')}</text>${row(26, 'x.......x.x.....', 'f-a')}
    <text x="4" y="66">${L('스네어', 'Snare')}</text>${row(52, '....x.......x...', 'f-b')}
    <text x="4" y="92">${L('하이햇', 'Hi-hat')}</text>${row(78, 'x.x.x.x.x.x.x.x.', 'f-accent')}
    <text x="100" y="120" class="t-small t-dim">1</text><text x="204" y="120" class="t-small t-dim">2</text><text x="308" y="120" class="t-small t-dim">3</text><text x="412" y="120" class="t-small t-dim">4</text>
  </svg>`;
  },
  look: [
    'A(록)는 스네어가 2, 4박에 고정. B(보사노바)는 림 클릭이 3-3-4-3-3처럼 엇갈리고 킥이 "쿵 쿠웅" 반복.',
    'B를 "레게 원 드롭"으로 바꾸면 1박이 비고 3박에 킥과 림이 함께 나옴',
    '"펑크"는 회색 작은 칸(고스트 노트)이 스네어 사이를 메움. 소리도 작게 남.',
    '"장르 템포 쓰기"를 끄고 두 뷰를 같은 템포로 두면 패턴만의 차이를 들을 수 있음',
  ],
  refs: [
    { type: 'book', title: 'Ted Reed, Progressive Steps to Syncopation for the Modern Drummer', year: 1958, note: '스네어 싱코페이션 연습의 표준 교재' },
    { type: 'book', title: 'David Garibaldi, Future Sounds: A Book of Contemporary Drumset Concepts', year: 1990, note: '펑크 드럼의 리니어 패턴과 고스트 노트' },
    { type: 'book', title: 'Duduka Da Fonseca, Bob Weiner, Brazilian Rhythms for Drumset', year: 1991, note: '보사노바, 삼바 드럼 패턴' },
    { type: 'book', title: 'Mark J. Butler, Unlocking the Groove: Rhythm, Meter, and Musical Design in Electronic Dance Music', year: 2006, note: '하우스, 테크노, 드럼 앤 베이스의 리듬 구조' },
  ],
  params: [
    { key: 'genre', label: '장르', type: 'select', options: [
      { value: 'rock', label: '록' }, { value: 'funk', label: '펑크' }, { value: 'disco', label: '디스코' }, { value: 'house', label: '하우스' },
      { value: 'boombap', label: '붐뱁 힙합' }, { value: 'bossa', label: '보사노바' }, { value: 'onedrop', label: '레게 원 드롭' },
      { value: 'trap', label: '트랩 (하프 타임)' }, { value: 'dnb', label: '드럼 앤 베이스' }, { value: 'shuffle', label: '블루스 셔플' }], a: 'rock', b: 'bossa', group: '패턴' },
    { key: 'useTempo', label: '장르 템포 쓰기', type: 'bool', default: true, shared: true },
    { key: 'bpm', label: '템포 (BPM)', type: 'int', min: 60, max: 180, default: 110, shared: true, when: (p) => !p.useTempo },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Drum Patterns by Genre',
    summary: 'A genre\'s feel comes mostly from where the kick and snare sit, how dense the hi-hats are, the tempo and the swing. Basic patterns for each genre sit on the same 16-step grid so you can compare two genres side by side.',
    views: { a: 'Rock', b: 'Bossa nova' },
    info: `
    <p>The drum pattern is the strongest clue for recognizing a genre. With the same few drums, changing these four things gives a totally different genre.</p>
    <ul>
      <li><b>Kick and snare positions</b>: rock and pop put the snare on beats 2 and 4 (backbeat). Reggae one drop hits kick and rim together on beat 3. Drum and bass keeps the 2 and 4 snare at a fast tempo and places kicks off the beat between them.</li>
      <li><b>Hi-hat density</b>: 8ths (rock), 16ths (funk), off-beat open hats (disco, house).</li>
      <li><b>Tempo</b>: reggae in the 70s, boom bap in the 90s, house in the 120s, drum and bass in the 170s BPM.</li>
      <li><b>Swing and ghost notes</b>: boom bap and shuffle swing. Funk fills gaps with quiet ghost snares.</li>
    </ul>
    <p>These patterns are simple skeletons of each genre. Real songs add fills, variations and dynamics.</p>`,
    look: [
      'A (rock) keeps the snare on beats 2 and 4. In B (bossa nova) the rim clicks go 3-3-4-3-3 and the kick repeats a "boom, ba-boom".',
      'Set B to "Reggae one drop". Beat 1 is empty and kick and rim land together on beat 3.',
      '"Funk" fills the gaps between snares with small gray cells (ghost notes). They also sound quiet.',
      'Turn off "Use genre tempo" and set both views to the same tempo. You hear only the pattern difference.',
    ],
    refs: ['The standard book for snare syncopation practice.', 'Linear funk patterns and ghost notes.', 'Bossa nova and samba drum patterns.', 'Rhythm structure in house, techno and drum and bass.'],
    params: {
      genre: { label: 'Genre', group: 'Pattern', options: { rock: 'Rock', funk: 'Funk', disco: 'Disco', house: 'House', boombap: 'Boom bap hip hop', bossa: 'Bossa nova', onedrop: 'Reggae one drop', trap: 'Trap (half time)', dnb: 'Drum and bass', shuffle: 'Blues shuffle' } },
      useTempo: 'Use genre tempo',
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
    // x = 강하게, o = 보통, g = 고스트(작게), . = 없음
    const G = {
      rock: { bpm: 112, swing: 50, kick: 'x.....o.x.o.....', snare: '....x.......x...', hat: 'x.o.x.o.x.o.x.o.' },
      funk: { bpm: 100, swing: 52, kick: 'x.o....o..x..o..', snare: '....x..g.g..x..g', hat: 'xoooxoooxoooxooo' },
      disco: { bpm: 120, swing: 50, kick: 'x...x...x...x...', snare: '....x.......x...', hat: 'g.g.g.g.g.g.g.g.', ohat: '..o...o...o...o.' },
      house: { bpm: 124, swing: 54, kick: 'x...x...x...x...', clap: '....x.......x...', hat: 'g.gog.gog.gog.go', ohat: '..o...o...o...o.' },
      boombap: { bpm: 90, swing: 60, kick: 'x......o.ox.....', snare: '....x.......x...', hat: 'x.o.x.o.x.o.x.o.' },
      bossa: { bpm: 132, swing: 50, kick: 'x..ox..ox..ox..o', rim: 'x..o..o...o..o..', hat: 'ogogogogogogogog' },
      onedrop: { bpm: 74, swing: 60, kick: '........x.......', rim: '........x.......', hat: 'o.g.o.g.o.g.o.g.' },
      trap: { bpm: 140, swing: 50, kick: 'x......o..x.....', clap: '........x.......', hat: 'oooooooooooooooo' },
      dnb: { bpm: 172, swing: 50, kick: 'x.........x.....', snare: '....x.......x...', hat: 'o.o.o.o.o.o.o.o.' },
      shuffle: { bpm: 96, swing: 66, kick: 'x.......x.......', snare: '....x.......x...', hat: 'x.o.x.o.x.o.x.o.' },
    };
    const LANES = [['kick', '킥', 'Kick'], ['snare', '스네어', 'Snare'], ['clap', '클랩', 'Clap'], ['rim', '림', 'Rim'], ['hat', '하이햇', 'Hi-hat'], ['ohat', '오픈 하이햇', 'Open hat']];
    const FEAT = {
      rock: ['2, 4박 백비트, 8분음표 하이햇', 'Backbeat on 2 and 4, 8th-note hi-hat'],
      funk: ['16분음표 하이햇, 고스트 스네어, 엇박 킥', '16th hi-hat, ghost snares, off-beat kicks'],
      disco: ['4박 모두 킥, 뒷박 오픈 하이햇', 'Kick on every beat, off-beat open hat'],
      house: ['포 온 더 플로어, 클랩, 약한 스윙', 'Four on the floor, clap, light swing'],
      boombap: ['느린 템포, 스윙, 엇박으로 밀린 킥', 'Slow tempo, swing, pushed kicks'],
      bossa: ['림 클릭 클라베, "쿵 쿠웅" 킥', 'Rim click clave, "boom ba-boom" kick'],
      onedrop: ['1박을 비우고 3박에 킥과 림', 'Beat 1 empty, kick and rim on beat 3'],
      trap: ['하프 타임 클랩 (3박), 촘촘한 하이햇', 'Half-time clap (beat 3), dense hi-hats'],
      dnb: ['170대 BPM, 2스텝 킥과 스네어', '170s BPM, two-step kick and snare'],
      shuffle: ['셋잇단 스윙 (66%), 백비트', 'Triplet swing (66%), backbeat'],
    };
    const cfg = () => G[P.genre];
    const tempo = () => (P.useTempo ? cfg().bpm : P.bpm);
    const sd = () => 60 / tempo() / 4;
    const swingDelay = (s) => (s % 2 === 1 ? (cfg().swing / 100 - 0.5) * 2 * sd() : 0);
    const VEL = { x: 1, o: 0.7, g: 0.28 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        runAudio(l, r, sr, n, (t0, t1, trig) => {
          const d = sd(), c = cfg();
          for (let idx = Math.max(0, Math.floor(t0 / d) - 2); idx * d < t1; idx++) {
            const s = idx % 16, t = idx * d + swingDelay(s);
            if (t < t0 || t >= t1) continue;
            for (const [k] of LANES) { const p = c[k]; if (p && p[s] !== '.') trig(k, t, { vel: VEL[p[s]] * (k === 'hat' ? 0.9 : 1) }); }
          }
        });
      },
    });

    const inst = {
      update(dt) { tick(dt); },
      render() { ctx.g.save(); ctx.g.translate(0, TOP); try { inst.drawView(); } finally { ctx.g.restore(); } },
      drawView() {
        const g = ctx.g, W = ctx.width, H = ctx.height - TOP, pad = 10, c = cfg(), d = sd();
        const step = Math.floor(clock.t / d) % 16;
        const lanes = LANES.filter(([k]) => c[k]);
        const gx = pad + 76, cw = (W - gx - pad) / 16, rh = Math.min(34, (H - 110) / lanes.length);
        D.text(g, L(FEAT[P.genre][0], FEAT[P.genre][1]), pad, pad, { size: 12, color: col });
        const gy = pad + 26;
        for (let s = 0; s < 16; s += 4) D.text(g, String(s / 4 + 1), gx + s * cw + 2, gy - 12, { size: 9, color: C.dim });
        lanes.forEach(([k, ko, en], li) => {
          const y = gy + li * rh, p = c[k];
          D.text(g, L(ko, en), pad, y + rh / 2 - 6, { size: 11 });
          for (let s = 0; s < 16; s++) {
            const v = p[s], x = gx + s * cw + (swingDelay(s) / d) * cw * 0.999;
            const bg = s % 4 === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)';
            D.rect(g, gx + s * cw + 1, y + 1, cw - 2, rh - 2, bg);
            if (v === '.') continue;
            const sz = v === 'g' ? 0.45 : v === 'o' ? 0.75 : 1;
            const hw = (cw - 4) * sz, hh = (rh - 4) * sz;
            D.rect(g, x + (cw - hw) / 2, y + (rh - hh) / 2, hw, hh, s === step ? '#fff' : v === 'g' ? C.dim : col);
          }
        });
        D.rect(g, gx + step * cw, gy, cw, rh * lanes.length, null, C.warn, 1.5);
        const ly = gy + rh * lanes.length + 12;
        D.text(g, L('큰 칸 = 강하게, 중간 = 보통, 회색 작은 칸 = 고스트 노트. 오른쪽으로 밀린 칸 = 스윙.', 'Big = accent, medium = normal, small gray = ghost note. Shifted right = swing.'), pad, ly, { size: 9, color: C.dim });
        let hits = 0; lanes.forEach(([k]) => { for (const ch of c[k]) if (ch !== '.') hits++; });
        ctx.stat(L('템포', 'Tempo'), tempo() + ' BPM');
        ctx.stat(L('스윙', 'Swing'), c.swing + '%');
        ctx.stat(L('마디당 타격 수', 'Hits per bar'), hits);
        ctx.stat(L('스네어 (클랩) 자리', 'Snare (clap) steps'), (c.snare || c.clap || c.rim).split('').map((ch, i) => (ch === 'x' || ch === 'o' ? i + 1 : 0)).filter(Boolean).join(', '));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
    return inst;
  },
});
