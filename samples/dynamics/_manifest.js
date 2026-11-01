// 카테고리 매니페스트. 샘플을 추가하면 samples 배열에 한 줄 추가.
// { id, level(1 입문, 2 초급, 3 중급, 4 고급), title, en, tags: [...], added: 'YYYY-MM-DD' }, 파일은 samples/dynamics/<id>.js
GTL.category({
  id: 'dynamics',
  title: '다이내믹스 & 믹싱',
  en: 'Dynamics & Mixing',
  icon: '📊',
  order: 7,
  samples: [
    { id: 'compressor-basics', level: 3, title: '컴프레서 기초 (스레숄드, 레이쇼, 니)', en: 'Compressor Basics (Threshold, Ratio, Knee)', tags: ['compressor', 'threshold', 'ratio', 'knee', 'gain-reduction'], added: '2026-11-01' },
    { id: 'attack-release', level: 3, title: '어택과 릴리스 (트랜지언트와 펌핑)', en: 'Attack and Release (Transients and Pumping)', tags: ['compressor', 'attack', 'release', 'transient', 'pumping'], added: '2026-11-01' },
    { id: 'peak-vs-rms-detection', level: 3, title: '피크 검출 vs RMS 검출', en: 'Peak vs RMS Detection', tags: ['compressor', 'detector', 'peak', 'rms', 'envelope'], added: '2026-11-01' },
    { id: 'lookahead-limiter', level: 3, title: '룩어헤드 리미터 (오버슈트 없는 브릭월)', en: 'Lookahead Limiter (Brickwall Without Overshoot)', tags: ['limiter', 'lookahead', 'brickwall', 'overshoot', 'latency'], added: '2026-11-01' },
    { id: 'noise-gate', level: 2, title: '노이즈 게이트 (히스테리시스와 홀드)', en: 'Noise Gate (Hysteresis and Hold)', tags: ['gate', 'hysteresis', 'hold', 'chattering', 'noise'], added: '2026-11-01' },
    { id: 'expander-downward', level: 3, title: '다운워드 익스팬더 vs 게이트', en: 'Downward Expander vs Gate', tags: ['expander', 'gate', 'noise', 'ratio', 'dynamic-range'], added: '2026-11-01' },
    { id: 'sidechain-pumping', level: 2, title: '사이드체인 펌핑 (킥 덕킹)', en: 'Sidechain Pumping (Kick Ducking)', tags: ['sidechain', 'compressor', 'ducking', 'pumping', 'edm'], added: '2026-11-01' },
    { id: 'multiband-compression', level: 3, title: '멀티밴드 컴프레션 (싱글 vs 3밴드)', en: 'Multiband Compression (Single vs 3 Band)', tags: ['multiband', 'compressor', 'crossover', 'linkwitz-riley', 'mastering'], added: '2026-11-01' },
    { id: 'parallel-compression', level: 2, title: '병렬 컴프레션 (뉴욕 컴프레션)', en: 'Parallel Compression (New York Compression)', tags: ['compressor', 'parallel', 'new-york', 'upward', 'drums'], added: '2026-11-01' },
    { id: 'transient-shaper', level: 3, title: '트랜지언트 셰이퍼 (어택과 서스테인)', en: 'Transient Shaper (Attack and Sustain)', tags: ['transient', 'envelope', 'attack', 'sustain', 'drums'], added: '2026-11-01' },
    { id: 'de-esser', level: 3, title: '디에서 (치찰음 줄이기)', en: 'De-esser (Taming Sibilance)', tags: ['de-esser', 'sibilance', 'sidechain', 'vocal', 'split-band'], added: '2026-11-01' },
    { id: 'gain-staging', level: 1, title: '게인 스테이징 (체인 중간의 클리핑)', en: 'Gain Staging (Clipping Inside the Chain)', tags: ['gain-staging', 'headroom', 'clipping', 'saturation', 'thd'], added: '2026-11-01' },
    { id: 'panning-laws', level: 1, title: '팬 법칙 (선형 vs 등전력 -3 dB)', en: 'Panning Laws (Linear vs Constant Power -3 dB)', tags: ['pan', 'pan-law', 'constant-power', 'stereo', 'mixing'], added: '2026-11-01' },
    { id: 'mid-side', level: 2, title: '미드/사이드 처리 (스테레오 폭)', en: 'Mid/Side Processing (Stereo Width)', tags: ['mid-side', 'stereo', 'width', 'correlation', 'goniometer'], added: '2026-11-01' },
    { id: 'loudness-lufs', level: 3, title: '라우드니스 정규화 (LUFS, ITU-R BS.1770)', en: 'Loudness Normalization (LUFS, ITU-R BS.1770)', tags: ['loudness', 'lufs', 'bs1770', 'k-weighting', 'normalization'], added: '2026-11-01' },
    { id: 'crest-factor-dynamic-range', level: 2, title: '크레스트 팩터와 다이내믹 레인지', en: 'Crest Factor and Dynamic Range', tags: ['crest-factor', 'rms', 'peak', 'loudness-war', 'limiter'], added: '2026-11-01' },
    { id: 'automation-curves', level: 1, title: '크로스페이드 곡선 (등게인 vs 등전력)', en: 'Crossfade Curves (Equal Gain vs Equal Power)', tags: ['crossfade', 'fade', 'automation', 'equal-power', 'transition'], added: '2026-11-01' },
  ],
});
