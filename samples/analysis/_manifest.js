// 카테고리 매니페스트. 샘플을 추가하면 samples 배열에 한 줄 추가.
// { id, level(1 입문, 2 초급, 3 중급, 4 고급), title, en, tags: [...], added: 'YYYY-MM-DD' }, 파일은 samples/analysis/<id>.js
GTL.category({
  id: 'analysis',
  title: '분석 & 음악 정보 검색',
  en: 'Analysis & MIR',
  icon: '🔬',
  order: 9,
  samples: [
    { id: 'fft-window-leakage', level: 2, title: 'FFT 창 함수와 스펙트럼 누설', en: 'FFT Windows and Spectral Leakage', tags: ['fft', 'window', 'leakage', 'spectrum'], added: '2026-11-01' },
    { id: 'stft-resolution', level: 2, title: 'STFT 창 크기와 시간-주파수 해상도', en: 'STFT Window Size and Time-Frequency Resolution', tags: ['stft', 'spectrogram', 'resolution', 'window'], added: '2026-11-01' },
    { id: 'spectrogram-scales', level: 2, title: '스펙트로그램 주파수 축 (선형, 멜, 로그)', en: 'Spectrogram Frequency Axes (Linear, Mel, Log)', tags: ['spectrogram', 'mel', 'log-frequency', 'visualization'], added: '2026-11-01' },
    { id: 'zero-padding', level: 2, title: '제로 패딩은 해상도를 늘리지 않음', en: 'Zero Padding Does Not Add Resolution', tags: ['fft', 'zero-padding', 'resolution', 'interpolation'], added: '2026-11-01' },
    { id: 'pitch-detection', level: 3, title: '피치 검출 (영교차, 자기상관, YIN)', en: 'Pitch Detection (Zero Crossing, Autocorrelation, YIN)', tags: ['pitch', 'f0', 'yin', 'autocorrelation', 'zcr'], added: '2026-11-01' },
    { id: 'onset-detection', level: 3, title: '온셋 검출 (에너지 vs 스펙트럼 플럭스)', en: 'Onset Detection (Energy vs Spectral Flux)', tags: ['onset', 'spectral-flux', 'novelty', 'peak-picking'], added: '2026-11-01' },
    { id: 'tempo-estimation', level: 3, title: '템포 추정 (온셋 자기상관)', en: 'Tempo Estimation (Onset Autocorrelation)', tags: ['tempo', 'bpm', 'autocorrelation', 'rhythm'], added: '2026-11-01' },
    { id: 'chromagram-chords', level: 3, title: '크로마그램과 코드 인식', en: 'Chromagram and Chord Recognition', tags: ['chroma', 'chord', 'hmm', 'viterbi', 'template'], added: '2026-11-01' },
    { id: 'key-detection', level: 2, title: '조성 검출 (Krumhansl-Schmuckler)', en: 'Key Detection (Krumhansl-Schmuckler)', tags: ['key', 'tonality', 'pitch-class', 'profile', 'correlation'], added: '2026-11-01' },
    { id: 'mfcc', level: 3, title: 'MFCC (멜 주파수 켑스트럼 계수)', en: 'MFCC (Mel-Frequency Cepstral Coefficients)', tags: ['mfcc', 'mel', 'dct', 'timbre', 'features'], added: '2026-11-01' },
    { id: 'spectral-features', level: 2, title: '스펙트럼 특징 (중심, 롤오프, 평탄도)', en: 'Spectral Features (Centroid, Rolloff, Flatness)', tags: ['centroid', 'rolloff', 'flatness', 'zcr', 'timbre', 'features'], added: '2026-11-01' },
    { id: 'cepstrum', level: 3, title: '켑스트럼 피치 검출', en: 'Cepstrum Pitch Detection', tags: ['cepstrum', 'pitch', 'hps', 'missing-fundamental', 'formant'], added: '2026-11-01' },
    { id: 'goertzel-dtmf', level: 2, title: '괴르첼 알고리즘과 DTMF 검출', en: 'Goertzel Algorithm and DTMF Detection', tags: ['goertzel', 'dtmf', 'fft', 'tone-detection'], added: '2026-11-01' },
    { id: 'envelope-detection', level: 3, title: '엔벨로프 검출 (정류 + 로우패스 vs 힐버트)', en: 'Envelope Detection (Rectify + Lowpass vs Hilbert)', tags: ['envelope', 'hilbert', 'analytic-signal', 'envelope-follower'], added: '2026-11-01' },
    { id: 'hpss', level: 3, title: '화성음, 타악음 분리 (HPSS 중앙값 필터)', en: 'Harmonic-Percussive Separation (HPSS Median Filter)', tags: ['hpss', 'source-separation', 'median-filter', 'stft', 'mask'], added: '2026-11-01' },
  ],
});
