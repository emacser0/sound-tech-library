// 카테고리 매니페스트. 샘플을 추가하면 samples 배열에 한 줄 추가.
// { id, level(1 입문, 2 초급, 3 중급, 4 고급), title, en, tags: [...], added: 'YYYY-MM-DD' }, 파일은 samples/theory/<id>.js
GTL.category({
  id: 'theory',
  title: '음악 이론',
  en: 'Music Theory',
  icon: '🎼',
  order: 10,
  samples: [
    { id: 'intervals', level: 1, title: '음정 (Interval)', en: 'Intervals', tags: ['interval', 'ratio', 'consonance', 'semitone'], added: '2026-11-01' },
    { id: 'scales-modes', level: 1, title: '음계와 선법 (Scales, Modes)', en: 'Scales and Modes', tags: ['scale', 'mode', 'dorian', 'pentatonic', 'minor'], added: '2026-11-01' },
    { id: 'tuning-systems', level: 2, title: '음률 (평균율, 순정률, 피타고라스, 가온음률)', en: 'Tuning Systems (Equal, Just, Pythagorean, Meantone)', tags: ['tuning', 'temperament', 'just-intonation', 'meantone', 'beats'], added: '2026-11-01' },
    { id: 'circle-of-fifths', level: 1, title: '5도권 (Circle of Fifths)', en: 'Circle of Fifths', tags: ['circle-of-fifths', 'key', 'key-signature', 'modulation'], added: '2026-11-01' },
    { id: 'chord-construction', level: 1, title: '화음 쌓기 (3화음, 7화음, 텐션, 자리바꿈)', en: 'Building Chords (Triads, Sevenths, Tensions, Inversions)', tags: ['chord', 'triad', 'seventh', 'inversion', 'tension'], added: '2026-11-01' },
    { id: 'diatonic-harmony', level: 2, title: '음계 안의 화음과 기능 (로마 숫자, T S D)', en: 'Diatonic Chords and Function (Roman Numerals, T S D)', tags: ['harmony', 'roman-numeral', 'function', 'diatonic', 'minor-key'], added: '2026-11-01' },
    { id: 'voice-leading', level: 3, title: '성부 진행 (덩어리 화음 vs 부드러운 연결)', en: 'Voice Leading (Block Chords vs Smooth Connection)', tags: ['voice-leading', 'parallel-fifths', 'voicing', 'dynamic-programming', 'harmony'], added: '2026-11-01' },
    { id: 'cadences', level: 1, title: '종지 (정격, 반, 변격, 거짓 종지)', en: 'Cadences (Authentic, Half, Plagal, Deceptive)', tags: ['cadence', 'harmony', 'phrase', 'dominant'], added: '2026-11-01' },
    { id: 'chord-progressions', level: 2, title: '자주 쓰는 화음 진행과 근음 이동', en: 'Common Chord Progressions and Root Motion', tags: ['progression', 'ii-v-i', 'blues', 'root-motion', 'harmony'], added: '2026-11-01' },
    { id: 'secondary-dominants', level: 2, title: '부속 딸림화음과 빌린 화음', en: 'Secondary Dominants and Borrowed Chords', tags: ['secondary-dominant', 'modal-mixture', 'chromatic', 'harmony'], added: '2026-11-01' },
    { id: 'modulation', level: 3, title: '조바꿈 (직접 전조 vs 축 화음 전조)', en: 'Modulation (Direct vs Pivot Chord)', tags: ['modulation', 'pivot-chord', 'key-finding', 'krumhansl', 'harmony'], added: '2026-11-01' },
    { id: 'counterpoint-first-species', level: 3, title: '대위법 1류 (규칙 검사기와 자동 작성)', en: 'First Species Counterpoint (Rule Checker and Generator)', tags: ['counterpoint', 'species', 'fux', 'backtracking', 'algorithmic-composition'], added: '2026-11-01' },
    { id: 'tonnetz-neo-riemannian', level: 3, title: '톤네츠와 신리만 변환 (P, L, R)', en: 'Tonnetz and Neo-Riemannian Transforms (P, L, R)', tags: ['tonnetz', 'neo-riemannian', 'transformation', 'triad', 'voice-leading'], added: '2026-11-01' },
    { id: 'pitch-class-sets', level: 3, title: '음 높이 집합 (이조, 자리바꿈, 프라임 형태)', en: 'Pitch-Class Sets (Transposition, Inversion, Prime Form)', tags: ['pitch-class-set', 'set-theory', 'prime-form', 'interval-vector', 'atonal'], added: '2026-11-01' },
    { id: 'low-interval-limits', level: 2, title: '낮은 음역의 화음 배치 (목안 기준과 거칠기)', en: 'Voicing in the Low Register (Low Interval Limits and Roughness)', tags: ['voicing', 'low-interval-limit', 'roughness', 'critical-band', 'arranging'], added: '2026-11-01' },
  ],
});
