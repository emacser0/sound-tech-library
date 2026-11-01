// 카테고리 매니페스트. 샘플을 추가하면 samples 배열에 한 줄 추가.
// { id, level(1 입문, 2 초급, 3 중급, 4 고급), title, en, tags: [...], added: 'YYYY-MM-DD' }, 파일은 samples/psychoacoustics/<id>.js
GTL.category({
  id: 'psychoacoustics',
  title: '청각과 지각',
  en: 'Hearing & Perception',
  icon: '👂',
  order: 2,
  samples: [
    { id: 'equal-loudness-contours', level: 3, title: '등청감 곡선과 라우드니스 보정', en: 'Equal-Loudness Contours & Loudness Compensation', tags: ['iso 226', 'phon', 'loudness', 'eq', 'fletcher-munson'], added: '2026-11-01' },
    { id: 'frequency-masking', level: 3, title: '주파수 마스킹과 확산 함수', en: 'Frequency Masking & Spreading Function', tags: ['masking', 'bark', 'spreading function', 'perceptual coding', 'threshold'], added: '2026-11-01' },
    { id: 'temporal-masking', level: 3, title: '시간 마스킹 (사전, 사후)', en: 'Temporal Masking (Pre & Post)', tags: ['masking', 'forward masking', 'backward masking', 'pre-echo'], added: '2026-11-01' },
    { id: 'critical-bands', level: 2, title: '임계 대역 (Bark, ERB)', en: 'Critical Bands (Bark, ERB)', tags: ['critical band', 'bark', 'erb', 'auditory filter', 'beats'], added: '2026-11-01' },
    { id: 'missing-fundamental', level: 2, title: '사라진 기음 (가상 음고)', en: 'Missing Fundamental (Virtual Pitch)', tags: ['pitch', 'virtual pitch', 'harmonics', 'autocorrelation'], added: '2026-11-01' },
    { id: 'shepard-tone', level: 3, title: '셰퍼드 톤 (끝없는 상승)', en: 'Shepard Tone (Endless Rise)', tags: ['shepard', 'risset', 'illusion', 'additive', 'pitch'], added: '2026-11-01' },
    { id: 'roughness-dissonance', level: 3, title: '거칠기와 불협화 곡선 (Plomp-Levelt)', en: 'Roughness & Dissonance Curve (Plomp-Levelt)', tags: ['roughness', 'dissonance', 'consonance', 'plomp-levelt', 'sethares', 'timbre'], added: '2026-11-01' },
    { id: 'jnd-pitch-loudness', level: 2, title: '최소 식별 차이 (음 높이, 크기)', en: 'Just Noticeable Difference (Pitch, Loudness)', tags: ['jnd', 'difference limen', 'staircase', 'listening test', 'weber'], added: '2026-11-01' },
    { id: 'mel-scale', level: 1, title: '음 높이 척도 (Hz, 멜, 반음)', en: 'Pitch Scales (Hz, Mel, Semitones)', tags: ['mel', 'pitch scale', 'mfcc', 'log frequency'], added: '2026-11-01' },
    { id: 'auditory-streaming', level: 2, title: '청각 흐름 분리 (ABA 갤럽)', en: 'Auditory Streaming (ABA Gallop)', tags: ['streaming', 'auditory scene analysis', 'van noorden', 'bregman'], added: '2026-11-01' },
    { id: 'binaural-beats', level: 2, title: '모노 맥놀이와 바이노럴 비트', en: 'Monaural Beats vs Binaural Beats', tags: ['beats', 'binaural', 'headphones', 'interaural phase'], added: '2026-11-01' },
    { id: 'loudness-sone-phon', level: 3, title: '라우드니스 (sone, phon)와 대역폭', en: 'Loudness (Sone, Phon) & Bandwidth', tags: ['loudness', 'sone', 'phon', 'zwicker', 'critical band'], added: '2026-11-01' },
  ],
});
