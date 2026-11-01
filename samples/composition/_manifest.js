// 카테고리 매니페스트. 샘플을 추가하면 samples 배열에 한 줄 추가.
// { id, level(1 입문, 2 초급, 3 중급, 4 고급), title, en, tags: [...], added: 'YYYY-MM-DD' }, 파일은 samples/composition/<id>.js
GTL.category({
  id: 'composition',
  title: '작곡, 리듬, 시퀀싱',
  en: 'Composition & Sequencing',
  icon: '🥁',
  order: 11,
  samples: [
    { id: 'step-sequencer', level: 1, title: '스텝 시퀀서와 정확한 타이밍', en: 'Step Sequencer & Accurate Timing', tags: ['sequencer', 'drums', 'timing', 'jitter', 'scheduling'], added: '2026-11-01' },
    { id: 'euclidean-rhythms', level: 2, title: '유클리드 리듬 (Bjorklund)', en: 'Euclidean Rhythms (Bjorklund)', tags: ['rhythm', 'euclidean', 'bjorklund', 'algorithmic'], added: '2026-11-01' },
    { id: 'swing-groove', level: 1, title: '스윙 그루브 (스윙 비율)', en: 'Swing Groove (Swing Ratio)', tags: ['swing', 'groove', 'shuffle', 'mpc', 'timing'], added: '2026-11-01' },
    { id: 'quantize-humanize', level: 2, title: '퀀타이즈와 휴머나이즈', en: 'Quantize & Humanize', tags: ['quantize', 'humanize', 'midi', 'timing', 'velocity'], added: '2026-11-01' },
    { id: 'polyrhythm', level: 1, title: '폴리리듬 (3:2, 4:3)', en: 'Polyrhythm (3:2, 4:3)', tags: ['polyrhythm', 'rhythm', 'hemiola', 'lcm'], added: '2026-11-01' },
    { id: 'polymeter', level: 1, title: '폴리미터 (트랙별 반복 길이)', en: 'Polymeter (Per-Track Loop Length)', tags: ['polymeter', 'sequencer', 'loop', 'lcm'], added: '2026-11-01' },
    { id: 'arpeggiator', level: 2, title: '아르페지에이터', en: 'Arpeggiator', tags: ['arpeggiator', 'chords', 'sequencer', 'midi'], added: '2026-11-01' },
    { id: 'markov-melody', level: 2, title: '마르코프 체인 멜로디', en: 'Markov Chain Melody', tags: ['markov', 'melody', 'generative', 'algorithmic', 'probability'], added: '2026-11-01' },
    { id: 'pink-noise-melody', level: 2, title: '1/f 잡음 멜로디 (Voss 알고리즘)', en: '1/f Noise Melody (Voss Algorithm)', tags: ['pink-noise', 'voss', 'generative', 'melody', 'fractal'], added: '2026-11-01' },
    { id: 'cellular-automata-rhythm', level: 2, title: '셀룰러 오토마타 리듬', en: 'Cellular Automata Rhythm', tags: ['cellular-automata', 'rhythm', 'generative', 'wolfram'], added: '2026-11-01' },
    { id: 'motif-development', level: 1, title: '동기 발전 (전위, 역행, 확대)', en: 'Motif Development (Inversion, Retrograde, Augmentation)', tags: ['motif', 'inversion', 'retrograde', 'melody', 'counterpoint'], added: '2026-11-01' },
    { id: 'walking-bassline', level: 2, title: '워킹 베이스라인 생성', en: 'Walking Bass Line Generation', tags: ['bass', 'jazz', 'walking', 'generative', 'harmony'], added: '2026-11-01' },
    { id: 'syncopation-measure', level: 2, title: '싱코페이션 측정 (Longuet-Higgins & Lee)', en: 'Syncopation Measure (Longuet-Higgins & Lee)', tags: ['syncopation', 'rhythm', 'meter', 'analysis', 'clave'], added: '2026-11-01' },
    { id: 'tempo-note-durations', level: 1, title: '템포와 음표 길이 (딜레이 싱크)', en: 'Tempo & Note Durations (Delay Sync)', tags: ['tempo', 'bpm', 'delay', 'sync', 'note-values'], added: '2026-11-01' },
    { id: 'midi-messages', level: 1, title: 'MIDI 메시지와 러닝 스테이터스', en: 'MIDI Messages & Running Status', tags: ['midi', 'running-status', 'protocol', 'velocity', 'cc'], added: '2026-11-01' },
    { id: 'drum-pattern-genres', level: 1, title: '장르별 드럼 패턴', en: 'Drum Patterns by Genre', tags: ['drums', 'genre', 'groove', 'backbeat', 'patterns'], added: '2026-11-01' },
  ],
});
