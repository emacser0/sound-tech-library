// 카테고리 매니페스트. 샘플을 추가하면 samples 배열에 한 줄 추가.
// { id, level(1 입문, 2 초급, 3 중급, 4 고급), title, en, tags: [...], added: 'YYYY-MM-DD' }, 파일은 samples/acoustics/<id>.js
GTL.category({
  id: 'acoustics',
  title: '음향 기초',
  en: 'Sound Fundamentals',
  icon: '🌊',
  order: 1,
  samples: [
    { id: 'sine-wave-basics', level: 1, title: '사인파의 세 요소 (주파수, 진폭, 위상)', en: 'Three Parts of a Sine Wave (Frequency, Amplitude, Phase)', tags: ['sine', 'frequency', 'amplitude', 'phase', 'phasor'], added: '2026-11-01' },
    { id: 'harmonic-series', level: 1, title: '배음렬과 음색', en: 'Harmonic Series and Timbre', tags: ['harmonics', 'timbre', 'overtone', 'additive', 'spectrum'], added: '2026-11-01' },
    { id: 'fourier-series', level: 2, title: '푸리에 급수와 깁스 현상', en: 'Fourier Series and the Gibbs Phenomenon', tags: ['fourier', 'gibbs', 'square', 'saw', 'additive', 'lanczos'], added: '2026-11-01' },
    { id: 'beats-interference', level: 1, title: '맥놀이 (두 주파수의 간섭)', en: 'Beats (Interference of Two Frequencies)', tags: ['beats', 'interference', 'tuning', 'detune', 'roughness'], added: '2026-11-01' },
    { id: 'phase-cancellation', level: 1, title: '위상 상쇄와 극성', en: 'Phase Cancellation and Polarity', tags: ['phase', 'polarity', 'cancellation', 'delay', 'mono'], added: '2026-11-01' },
    { id: 'reflection-comb-filter', level: 2, title: '바닥 반사와 콤 필터 (마이크 높이)', en: 'Floor Reflection and Comb Filtering (Mic Height)', tags: ['comb-filter', 'reflection', 'microphone', 'boundary', 'pzm', 'delay'], added: '2026-11-01' },
    { id: 'standing-waves', level: 2, title: '정상파와 관의 공명 (열린 관 vs 닫힌 관)', en: 'Standing Waves and Pipe Resonance (Open vs Closed Pipe)', tags: ['standing-wave', 'resonance', 'pipe', 'modes', 'node'], added: '2026-11-01' },
    { id: 'room-modes', level: 3, title: '룸 모드와 듣는 위치', en: 'Room Modes and Listening Position', tags: ['room-modes', 'room-acoustics', 'bass', 'standing-wave', 'schroeder'], added: '2026-11-01' },
    { id: 'inverse-square-law', level: 1, title: '거리에 따른 감쇠 (점 음원 vs 선 음원)', en: 'Distance Attenuation (Point Source vs Line Source)', tags: ['inverse-square', 'distance', 'attenuation', 'line-array', 'spl'], added: '2026-11-01' },
    { id: 'driven-resonance', level: 2, title: '강제 진동과 공진 (질량-스프링)', en: 'Driven Oscillation and Resonance (Mass and Spring)', tags: ['resonance', 'q-factor', 'oscillator', 'damping', 'mass-spring'], added: '2026-11-01' },
    { id: 'pluck-position', level: 2, title: '현을 퉁기는 위치와 배음', en: 'Pluck Position and Harmonics', tags: ['string', 'pluck', 'harmonics', 'modal-synthesis', 'guitar'], added: '2026-11-01' },
    { id: 'decibel-addition', level: 1, title: '데시벨 더하기 (+6dB vs +3dB)', en: 'Adding Decibels (+6 dB vs +3 dB)', tags: ['decibel', 'correlation', 'level', 'summing', 'pan-law'], added: '2026-11-01' },
    { id: 'speed-of-sound-wavelength', level: 1, title: '음속과 파장', en: 'Speed of Sound and Wavelength', tags: ['wavelength', 'speed-of-sound', 'diffraction', 'temperature', 'propagation'], added: '2026-11-01' },
  ],
});
