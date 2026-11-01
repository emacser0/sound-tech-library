// 카테고리 매니페스트. 샘플을 추가하면 samples 배열에 한 줄 추가.
// { id, level(1 입문, 2 초급, 3 중급, 4 고급), title, en, tags: [...], added: 'YYYY-MM-DD' }, 파일은 samples/spatial/<id>.js
GTL.category({
  id: 'spatial',
  title: '공간 음향',
  en: 'Spatial Audio',
  icon: '🎧',
  order: 8,
  samples: [
    { id: 'itd-ild', level: 2, title: '양이 시간차와 레벨차 (ITD, ILD)', en: 'Interaural Time and Level Difference (ITD, ILD)', tags: ['itd', 'ild', 'localization', 'binaural', 'duplex theory'], added: '2026-11-01' },
    { id: 'haas-precedence-effect', level: 2, title: '선행음 효과 (하스 효과)', en: 'Precedence Effect (Haas Effect)', tags: ['precedence effect', 'haas', 'localization', 'echo', 'delay'], added: '2026-11-01' },
    { id: 'binaural-hrtf', level: 4, title: '바이노럴 머리 모델 (구형 머리 HRTF)', en: 'Binaural Head Model (Spherical Head HRTF)', tags: ['hrtf', 'binaural', 'head shadow', 'itd', 'headphones'], added: '2026-11-01' },
    { id: 'distance-cues', level: 3, title: '거리감 단서 (레벨, 공기 흡수, 직접음 대 잔향)', en: 'Distance Cues (Level, Air Absorption, Direct-to-Reverb)', tags: ['distance', 'attenuation', 'air absorption', 'reverb', 'critical distance'], added: '2026-11-01' },
    { id: 'early-reflections-image-source', level: 3, title: '초기 반사음 (이미지 소스 방식)', en: 'Early Reflections (Image Source Method)', tags: ['early reflections', 'image source', 'room acoustics', 'echogram'], added: '2026-11-01' },
    { id: 'ambisonics-first-order', level: 3, title: '1차 앰비소닉스 (B-format 인코딩과 디코딩)', en: 'First Order Ambisonics (B-format Encode and Decode)', tags: ['ambisonics', 'b-format', 'decoder', 'max-re', 'rotation'], added: '2026-11-01' },
    { id: 'vbap', level: 3, title: '벡터 기반 진폭 패닝 (VBAP)', en: 'Vector Base Amplitude Panning (VBAP)', tags: ['vbap', 'panning', 'multichannel', 'surround', 'speaker layout'], added: '2026-11-01' },
    { id: 'stereo-width-decorrelation', level: 3, title: '스테레오 넓히기와 역상관', en: 'Stereo Widening and Decorrelation', tags: ['stereo width', 'decorrelation', 'allpass', 'mid side', 'mono compatibility'], added: '2026-11-01' },
    { id: 'mic-polar-patterns', level: 1, title: '마이크 지향성 패턴', en: 'Microphone Polar Patterns', tags: ['microphone', 'polar pattern', 'cardioid', 'directivity', 'recording'], added: '2026-11-01' },
    { id: 'stereo-mic-techniques', level: 2, title: '스테레오 마이킹 기법 (XY, AB, ORTF)', en: 'Stereo Microphone Techniques (XY, AB, ORTF)', tags: ['stereo', 'microphone', 'xy', 'ab', 'ortf', 'recording'], added: '2026-11-01' },
    { id: 'rt60-sabine', level: 2, title: '잔향 시간 계산 (Sabine, Eyring)', en: 'Reverberation Time (Sabine, Eyring)', tags: ['rt60', 'reverberation time', 'sabine', 'eyring', 'absorption', 'fdn'], added: '2026-11-01' },
    { id: 'doppler-moving-source', level: 3, title: '도플러 효과 (지나가는 음원)', en: 'Doppler Effect (Passing Source)', tags: ['doppler', 'delay line', 'moving source', 'pitch', 'propagation'], added: '2026-11-01' },
    { id: 'sound-cones-directivity', level: 2, title: '음원 지향성 (사운드 콘)', en: 'Source Directivity (Sound Cones)', tags: ['sound cone', 'directivity', 'game audio', 'panner', 'low-pass'], added: '2026-11-01' },
    { id: 'occlusion-obstruction', level: 2, title: '벽에 가린 소리 (오클루전, 옵스트럭션)', en: 'Sound Behind Walls (Occlusion, Obstruction)', tags: ['occlusion', 'obstruction', 'raycast', 'game audio', 'low-pass'], added: '2026-11-01' },
  ],
});
