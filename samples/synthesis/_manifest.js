// 카테고리 매니페스트. 샘플을 추가하면 samples 배열에 한 줄 추가.
// { id, level(1 입문, 2 초급, 3 중급, 4 고급), title, en, tags: [...], added: 'YYYY-MM-DD' }, 파일은 samples/synthesis/<id>.js
GTL.category({
  id: 'synthesis',
  title: '신시사이저 & 합성',
  en: 'Synthesis',
  icon: '🎛',
  order: 4,
  samples: [
    { id: 'polyblep-oscillator', level: 3, title: '대역 제한 오실레이터 (PolyBLEP)', en: 'Band-Limited Oscillator (PolyBLEP)', tags: ['oscillator', 'aliasing', 'polyblep', 'band-limited', 'saw'], added: '2026-11-01' },
    { id: 'adsr-envelope', level: 2, title: 'ADSR 엔벨로프 (직선 vs 지수 곡선)', en: 'ADSR Envelope (Linear vs Exponential)', tags: ['envelope', 'adsr', 'exponential', 'amplitude'], added: '2026-11-01' },
    { id: 'subtractive-synth', level: 3, title: '감산 합성 보이스 (필터 엔벨로프)', en: 'Subtractive Synth Voice (Filter Envelope)', tags: ['subtractive', 'filter', 'envelope', 'svf', 'virtual-analog'], added: '2026-11-01' },
    { id: 'fm-synthesis', level: 3, title: 'FM 합성 (비율과 인덱스)', en: 'FM Synthesis (Ratio and Index)', tags: ['fm', 'phase-modulation', 'sidebands', 'bessel', 'dx7'], added: '2026-11-01' },
    { id: 'additive-synthesis', level: 2, title: '가산 합성 (부분음별 엔벨로프)', en: 'Additive Synthesis (Per-Partial Envelopes)', tags: ['additive', 'partials', 'fourier', 'inharmonicity'], added: '2026-11-01' },
    { id: 'am-ring-modulation', level: 2, title: 'AM과 링 모듈레이션', en: 'AM and Ring Modulation', tags: ['am', 'ring-modulation', 'sidebands', 'modulation'], added: '2026-11-01' },
    { id: 'wavetable-synthesis', level: 3, title: '웨이브테이블 합성 (보간과 밉맵)', en: 'Wavetable Synthesis (Interpolation and Mipmaps)', tags: ['wavetable', 'interpolation', 'mipmap', 'aliasing', 'morphing'], added: '2026-11-01' },
    { id: 'granular-synthesis', level: 3, title: '그래뉼러 합성 (그레인 크기, 밀도, 지터)', en: 'Granular Synthesis (Grain Size, Density, Jitter)', tags: ['granular', 'grains', 'time-stretch', 'texture'], added: '2026-11-01' },
    { id: 'karplus-strong', level: 2, title: '카플러스-스트롱 현 합성', en: 'Karplus-Strong Plucked String', tags: ['physical-modeling', 'karplus-strong', 'delay-line', 'allpass', 'string'], added: '2026-11-01' },
    { id: 'pulse-width-modulation', level: 2, title: '펄스 폭 변조 (PWM)', en: 'Pulse Width Modulation (PWM)', tags: ['pwm', 'pulse', 'oscillator', 'lfo'], added: '2026-11-01' },
    { id: 'supersaw-unison', level: 3, title: '슈퍼소와 유니즌 (디튠, 스테레오 퍼짐)', en: 'Supersaw and Unison (Detune, Stereo Spread)', tags: ['supersaw', 'unison', 'detune', 'stereo'], added: '2026-11-01' },
    { id: 'modal-synthesis', level: 3, title: '모달 합성 (배음 vs 비배음 모드)', en: 'Modal Synthesis (Harmonic vs Inharmonic Modes)', tags: ['modal', 'physical-modeling', 'resonator', 'inharmonic', 'percussion'], added: '2026-11-01' },
    { id: 'formant-vowels', level: 3, title: '포먼트 모음 합성 (소스-필터)', en: 'Formant Vowel Synthesis (Source-Filter)', tags: ['formant', 'vowel', 'source-filter', 'voice', 'klatt'], added: '2026-11-01' },
    { id: 'drum-synthesis', level: 2, title: '드럼 합성 (킥, 스네어, 하이햇)', en: 'Drum Synthesis (Kick, Snare, Hi-Hat)', tags: ['drums', 'kick', 'snare', 'hi-hat', 'tr-808'], added: '2026-11-01' },
    { id: 'lfo-modulation', level: 2, title: 'LFO 모양과 목적지', en: 'LFO Shapes and Destinations', tags: ['lfo', 'modulation', 'vibrato', 'tremolo', 'sample-and-hold'], added: '2026-11-01' },
    { id: 'portamento-legato', level: 2, title: '포르타멘토와 레가토 (모노 보이스)', en: 'Portamento and Legato (Mono Voice)', tags: ['portamento', 'glide', 'legato', 'mono', 'envelope'], added: '2026-11-01' },
  ],
});
