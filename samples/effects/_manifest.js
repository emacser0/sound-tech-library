// 카테고리 매니페스트. 샘플을 추가하면 samples 배열에 한 줄 추가.
// { id, level(1 입문, 2 초급, 3 중급, 4 고급), title, en, tags: [...], added: 'YYYY-MM-DD' }, 파일은 samples/effects/<id>.js
GTL.category({
  id: 'effects',
  title: '이펙트',
  en: 'Effects',
  icon: '✨',
  order: 6,
  samples: [
    { id: 'delay-feedback', level: 2, title: '딜레이와 피드백 (핑퐁, 템포 동기)', en: 'Delay and Feedback (Ping-Pong, Tempo Sync)', tags: ['delay', 'feedback', 'ping-pong', 'tempo-sync', 'ring-buffer'], added: '2026-11-01' },
    { id: 'chorus', level: 2, title: '코러스 (LFO 변조 딜레이, 보이스 수)', en: 'Chorus (LFO-Modulated Delay, Voice Count)', tags: ['chorus', 'modulation', 'lfo', 'delay', 'stereo'], added: '2026-11-01' },
    { id: 'flanger', level: 3, title: '플랜저 (콤 필터 스윕, 피드백, through-zero)', en: 'Flanger (Comb Sweep, Feedback, Through-Zero)', tags: ['flanger', 'comb-filter', 'modulation', 'feedback', 'through-zero'], added: '2026-11-01' },
    { id: 'phaser', level: 3, title: '페이저 (올패스 단 수와 골)', en: 'Phaser (Allpass Stages and Notches)', tags: ['phaser', 'allpass', 'modulation', 'notch'], added: '2026-11-01' },
    { id: 'tremolo-vibrato', level: 2, title: '트레몰로와 비브라토 (크기 변조 vs 높이 변조)', en: 'Tremolo and Vibrato (Level vs Pitch Modulation)', tags: ['tremolo', 'vibrato', 'lfo', 'am', 'fm', 'sidebands'], added: '2026-11-01' },
    { id: 'waveshaping-distortion', level: 2, title: '웨이브셰이핑 디스토션 (전달 곡선과 배음)', en: 'Waveshaping Distortion (Transfer Curve and Harmonics)', tags: ['distortion', 'waveshaping', 'saturation', 'harmonics', 'clipping'], added: '2026-11-01' },
    { id: 'oversampled-distortion', level: 3, title: '오버샘플링 디스토션 (에일리어싱 줄이기)', en: 'Oversampled Distortion (Reducing Aliasing)', tags: ['oversampling', 'aliasing', 'distortion', 'polyphase', 'fir'], added: '2026-11-01' },
    { id: 'bitcrusher', level: 1, title: '비트크러셔 (비트 깊이 vs 샘플레이트 줄이기)', en: 'Bitcrusher (Bit Depth vs Sample Rate Reduction)', tags: ['bitcrusher', 'quantization', 'sample-rate', 'dither', 'lo-fi'], added: '2026-11-01' },
    { id: 'schroeder-reverb', level: 3, title: '알고리즘 리버브 (Schroeder, Freeverb, FDN)', en: 'Algorithmic Reverb (Schroeder, Freeverb, FDN)', tags: ['reverb', 'schroeder', 'freeverb', 'fdn', 'echo-density', 'rt60'], added: '2026-11-01' },
    { id: 'convolution-reverb', level: 3, title: '컨볼루션 리버브 (직접 계산 vs 분할 FFT)', en: 'Convolution Reverb (Direct vs Partitioned FFT)', tags: ['reverb', 'convolution', 'fft', 'partitioned-convolution', 'impulse-response'], added: '2026-11-01' },
    { id: 'pitch-shift', level: 3, title: '피치 시프트 (지연선 탭과 그레인)', en: 'Pitch Shift (Delay Line Taps and Grains)', tags: ['pitch-shift', 'delay-line', 'granular', 'doppler', 'harmonizer'], added: '2026-11-01' },
    { id: 'time-stretch', level: 4, title: '타임 스트레치 (OLA vs WSOLA)', en: 'Time Stretch (OLA vs WSOLA)', tags: ['time-stretch', 'ola', 'wsola', 'cross-correlation', 'time-scale-modification'], added: '2026-11-01' },
    { id: 'vocoder', level: 3, title: '채널 보코더 (대역 수와 명료도)', en: 'Channel Vocoder (Band Count and Clarity)', tags: ['vocoder', 'filter-bank', 'envelope-follower', 'formant', 'bandpass'], added: '2026-11-01' },
    { id: 'envelope-follower-autowah', level: 2, title: '엔벨로프 팔로워와 오토와', en: 'Envelope Follower and Auto-Wah', tags: ['auto-wah', 'envelope-follower', 'filter', 'dynamics', 'funk'], added: '2026-11-01' },
    { id: 'tape-wow-flutter', level: 3, title: '테이프 와우, 플러터, 포화', en: 'Tape Wow, Flutter and Saturation', tags: ['tape', 'wow', 'flutter', 'saturation', 'hiss', 'lo-fi'], added: '2026-11-01' },
    { id: 'fractional-delay', level: 3, title: '소수 지연 보간 (변조 지연선의 기초)', en: 'Fractional Delay Interpolation (Basis of Modulated Delays)', tags: ['fractional-delay', 'interpolation', 'allpass', 'thiran', 'hermite', 'modulation'], added: '2026-11-01' },
  ],
});
