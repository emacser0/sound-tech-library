// 카테고리 매니페스트. 샘플을 추가하면 samples 배열에 한 줄 추가.
// { id, level(1 입문, 2 초급, 3 중급, 4 고급), title, en, tags: [...], added: 'YYYY-MM-DD' }, 파일은 samples/interactive/<id>.js
GTL.category({
  id: 'interactive',
  title: '인터랙티브 & 게임 음악',
  en: 'Interactive & Game Music',
  icon: '🎮',
  order: 12,
  samples: [
    { id: 'vertical-layering', level: 2, title: '수직 레이어링 (Vertical Layering)', en: 'Vertical Layering', tags: ['adaptive music', 'stems', 'layering', 'intensity', 'game audio'], added: '2026-11-01' },
    { id: 'horizontal-resequencing', level: 3, title: '수평 재배열 (Horizontal Re-sequencing)', en: 'Horizontal Re-sequencing', tags: ['adaptive music', 'transition', 'quantize', 'segments', 'game audio'], added: '2026-11-01' },
    { id: 'beat-quantized-stingers', level: 2, title: '박자에 맞춘 스팅어 (Stinger)', en: 'Beat-Quantized Stingers', tags: ['stinger', 'quantize', 'beat grid', 'adaptive music', 'game audio'], added: '2026-11-01' },
    { id: 'music-crossfade-sync', level: 3, title: '박자 맞춘 음악 크로스페이드', en: 'Beat-Synced Music Crossfade', tags: ['crossfade', 'beat sync', 'equal power', 'adaptive music', 'game audio'], added: '2026-11-01' },
    { id: 'adaptive-tempo', level: 3, title: '게임 속도를 따라가는 템포', en: 'Adaptive Tempo', tags: ['tempo', 'bpm', 'varispeed', 'phase', 'adaptive music'], added: '2026-11-01' },
    { id: 'rtpc-curves', level: 2, title: 'RTPC 매핑 곡선', en: 'RTPC Mapping Curves', tags: ['rtpc', 'parameter mapping', 'curve', 'lowpass', 'game audio'], added: '2026-11-01' },
    { id: 'intro-loop-structure', level: 2, title: '인트로, 루프, 아웃트로 구조', en: 'Intro, Loop and Outro Structure', tags: ['loop', 'loop points', 'post-exit', 'seamless', 'game audio'], added: '2026-11-01' },
    { id: 'rhythm-game-judgement', level: 2, title: '리듬 게임 판정과 지연 보정', en: 'Rhythm Game Judgement & Calibration', tags: ['rhythm game', 'timing window', 'latency', 'calibration', 'input'], added: '2026-11-01' },
    { id: 'audio-latency-compensation', level: 2, title: '소리와 화면의 지연 보정', en: 'Audio-Video Latency Compensation', tags: ['latency', 'av sync', 'output latency', 'scheduling', 'game audio'], added: '2026-11-01' },
    { id: 'engine-sound-rpm', level: 3, title: '엔진 소리 RPM 레이어', en: 'Engine Sound RPM Layers', tags: ['engine', 'rpm', 'crossfade', 'resampling', 'formant', 'game audio'], added: '2026-11-01' },
    { id: 'music-state-machine', level: 3, title: '음악 상태 기계와 히스테리시스', en: 'Music State Machine & Hysteresis', tags: ['state machine', 'hysteresis', 'transition rules', 'adaptive music', 'game audio'], added: '2026-11-01' },
    { id: 'generative-ambient', level: 3, title: '게임 상태로 바뀌는 생성 앰비언트', en: 'Generative Ambient Music', tags: ['generative', 'procedural', 'markov', 'ambient', 'adaptive music'], added: '2026-11-01' },
  ],
});
