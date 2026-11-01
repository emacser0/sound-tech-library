// 카테고리 매니페스트. 샘플을 추가하면 samples 배열에 한 줄 추가.
// { id, level(1 입문, 2 초급, 3 중급, 4 고급), title, en, tags: [...], added: 'YYYY-MM-DD' }, 파일은 samples/filters/<id>.js
GTL.category({
  id: 'filters',
  title: '필터 & EQ',
  en: 'Filters & EQ',
  icon: '🎚',
  order: 5,
  samples: [
    { id: 'biquad-types', level: 3, title: '바이쿼드 필터 종류', en: 'Biquad Filter Types', tags: ['biquad', 'eq', 'lowpass', 'highpass', 'rbj'], added: '2026-11-01' },
    { id: 'resonance-q', level: 2, title: '공진과 Q', en: 'Resonance and Q', tags: ['resonance', 'q', 'lowpass', 'poles', 'ringing'], added: '2026-11-01' },
    { id: 'filter-slopes', level: 2, title: '필터 기울기 (6~48dB/oct)', en: 'Filter Slopes (6 to 48 dB/oct)', tags: ['slope', 'butterworth', 'cascade', 'order'], added: '2026-11-01' },
    { id: 'parametric-eq', level: 3, title: '파라메트릭 EQ', en: 'Parametric EQ', tags: ['eq', 'peaking', 'proportional-q', 'mixing'], added: '2026-11-01' },
    { id: 'shelving-tilt-eq', level: 2, title: '셸빙 EQ와 틸트 EQ', en: 'Shelving EQ and Tilt EQ', tags: ['eq', 'shelf', 'tilt', 'loudness'], added: '2026-11-01' },
    { id: 'one-pole-smoothing', level: 1, title: '원폴 필터와 이동 평균', en: 'One-Pole Filter and Moving Average', tags: ['one-pole', 'moving-average', 'smoothing', 'zipper'], added: '2026-11-01' },
    { id: 'fir-vs-iir', level: 3, title: 'FIR 필터와 IIR 필터', en: 'FIR and IIR Filters', tags: ['fir', 'iir', 'group-delay', 'linear-phase', 'windowed-sinc'], added: '2026-11-01' },
    { id: 'linear-phase-pre-ringing', level: 4, title: '선형 위상 EQ의 프리링잉', en: 'Pre-Ringing of Linear Phase EQ', tags: ['linear-phase', 'minimum-phase', 'pre-ringing', 'cepstrum', 'fir'], added: '2026-11-01' },
    { id: 'state-variable-filter', level: 3, title: '컷오프 변조와 상태 변수 필터 (SVF)', en: 'Cutoff Modulation and the State Variable Filter (SVF)', tags: ['svf', 'tpt', 'biquad', 'modulation', 'direct-form'], added: '2026-11-01' },
    { id: 'ladder-filter', level: 4, title: '무그 래더 필터', en: 'Moog Ladder Filter', tags: ['ladder', 'moog', 'nonlinear', 'self-oscillation', 'virtual-analog'], added: '2026-11-01' },
    { id: 'allpass-phase', level: 2, title: '올패스 필터와 위상', en: 'Allpass Filters and Phase', tags: ['allpass', 'phase', 'phaser', 'crest-factor'], added: '2026-11-01' },
    { id: 'crossover-linkwitz-riley', level: 3, title: '크로스오버 (버터워스 vs 링크위츠-라일리)', en: 'Crossover (Butterworth vs Linkwitz-Riley)', tags: ['crossover', 'linkwitz-riley', 'butterworth', 'multiband'], added: '2026-11-01' },
    { id: 'comb-filters', level: 2, title: '피드포워드 콤 필터와 피드백 콤 필터', en: 'Feedforward and Feedback Comb Filters', tags: ['comb', 'delay', 'feedback', 'karplus-strong'], added: '2026-11-01' },
    { id: 'filter-keytracking', level: 2, title: '필터 키트래킹', en: 'Filter Key Tracking', tags: ['keytracking', 'synth', 'cutoff', 'svf'], added: '2026-11-01' },
    { id: 'formant-filter', level: 3, title: '포먼트 필터 (모음 만들기)', en: 'Formant Filter (Making Vowels)', tags: ['formant', 'vowel', 'bandpass', 'voice'], added: '2026-11-01' },
  ],
});
