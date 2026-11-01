// 카테고리 매니페스트. 샘플을 추가하면 samples 배열에 한 줄 추가.
// { id, level(1 입문, 2 초급, 3 중급, 4 고급), title, en, tags: [...], added: 'YYYY-MM-DD' }, 파일은 samples/digital-audio/<id>.js
GTL.category({
  id: 'digital-audio',
  title: '디지털 오디오',
  en: 'Digital Audio',
  icon: '💾',
  order: 3,
  samples: [
    { id: 'sampling-nyquist', level: 1, title: '샘플링과 나이퀴스트 주파수', en: 'Sampling and the Nyquist Frequency', tags: ['sampling', 'nyquist', 'aliasing', 'sample rate'], added: '2026-11-01' },
    { id: 'bit-depth-quantization', level: 1, title: '비트 깊이와 양자화 잡음', en: 'Bit Depth and Quantization Noise', tags: ['quantization', 'bit depth', 'snr', 'noise'], added: '2026-11-01' },
    { id: 'dither-noise-shaping', level: 3, title: '디더와 노이즈 셰이핑', en: 'Dither and Noise Shaping', tags: ['dither', 'tpdf', 'noise shaping', 'quantization', 'mastering'], added: '2026-11-01' },
    { id: 'interpolation-resampling', level: 3, title: '보간과 리샘플링', en: 'Interpolation and Resampling', tags: ['interpolation', 'resampling', 'sinc', 'sampler', 'pitch shift'], added: '2026-11-01' },
    { id: 'downsampling-antialias', level: 3, title: '다운샘플링과 안티에일리어싱 필터', en: 'Downsampling and the Anti-Aliasing Filter', tags: ['decimation', 'downsampling', 'anti-aliasing', 'fir', 'aliasing'], added: '2026-11-01' },
    { id: 'clipping-headroom', level: 3, title: '헤드룸과 인터샘플 피크 (트루 피크)', en: 'Headroom and Inter-Sample Peaks (True Peak)', tags: ['true peak', 'clipping', 'headroom', 'oversampling', 'metering'], added: '2026-11-01' },
    { id: 'dc-offset', level: 1, title: 'DC 오프셋과 DC 차단 필터', en: 'DC Offset and the DC Blocker', tags: ['dc offset', 'dc blocker', 'highpass', 'click', 'headroom'], added: '2026-11-01' },
    { id: 'zipper-noise', level: 2, title: '지퍼 노이즈와 파라미터 스무딩', en: 'Zipper Noise and Parameter Smoothing', tags: ['zipper noise', 'smoothing', 'automation', 'control rate', 'block processing'], added: '2026-11-01' },
    { id: 'buffer-latency', level: 2, title: '오디오 버퍼 크기와 지연, 언더런', en: 'Audio Buffer Size, Latency and Underruns', tags: ['latency', 'buffer size', 'underrun', 'real-time', 'callback'], added: '2026-11-01' },
    { id: 'integer-overflow', level: 2, title: '정수 오버플로: 랩어라운드 vs 포화', en: 'Integer Overflow: Wraparound vs Saturation', tags: ['fixed point', 'overflow', 'saturation', 'clipping', 'integer'], added: '2026-11-01' },
    { id: 'mu-law-companding', level: 2, title: 'μ-law 컴팬딩', en: 'μ-law Companding', tags: ['mu-law', 'companding', 'g.711', 'quantization', 'codec'], added: '2026-11-01' },
    { id: 'loop-crossfade', level: 2, title: '샘플 루프 지점과 크로스페이드', en: 'Sample Loop Points and Crossfade', tags: ['loop', 'crossfade', 'sampler', 'click', 'zero crossing'], added: '2026-11-01' },
    { id: 'perceptual-coding', level: 4, title: '지각 부호화: MDCT와 비트 배분', en: 'Perceptual Coding: MDCT and Bit Allocation', tags: ['mdct', 'perceptual coding', 'masking', 'bit allocation', 'codec', 'mp3'], added: '2026-11-01' },
  ],
});
