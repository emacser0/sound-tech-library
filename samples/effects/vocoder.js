// 채널 보코더: 모듈레이터(목소리)의 대역별 음량으로 캐리어(신스)의 대역을 조절. 대역 4개 vs 16개
GTL.register({
  id: 'vocoder',
  title: '채널 보코더 (대역 수와 명료도)',
  summary: '보코더는 목소리를 여러 주파수 대역으로 나눠 대역마다 음량 변화를 재고, 그 음량으로 신스 소리의 같은 대역을 조절함. 대역이 많을수록 목소리의 포먼트(모음 모양)가 잘 살아나 말소리가 알아듣기 쉬워짐.',
  views: { a: '대역 4개', b: '대역 16개' },
  controls: '파라미터 표에서 대역 수, 캐리어, 엔벨로프 속도를 바꿈. "소리 켜기"를 누르면 소리 내는 뷰가 들림.',
  info: `
    <p><b>채널 보코더(Channel vocoder)</b>는 Homer Dudley가 1930년대 벨 연구소에서 전화 음성 압축용으로 만든 장치. 음악에서는 "로봇 목소리" 이펙트로 유명함.</p>
    <ul>
      <li><b>분석</b>: 모듈레이터(목소리)를 밴드패스 필터 N개로 나누고, 대역마다 엔벨로프 팔로워(정류 + 로우패스)로 음량을 잼</li>
      <li><b>합성</b>: 캐리어(톱니 화음, 노이즈처럼 배음이 많은 소리)를 같은 필터 N개로 나누고, 각 대역에 측정한 음량을 곱해 더함</li>
      <li>결과: 캐리어의 음 높이와 목소리의 스펙트럼 모양(포먼트)이 합쳐짐</li>
    </ul>
    <p>모음은 포먼트(공명 봉우리) 2~3개의 위치로 구분됨. 대역이 4개면 봉우리 위치가 뭉개져 모음이 구분되지 않음. 16~32개면 대부분 알아들을 수 있음. 엔벨로프가 너무 느리면 자음이 뭉개지고, 너무 빠르면 캐리어에 잡음 같은 변조가 생김. 이 샘플의 목소리는 포먼트 필터로 합성한 모음(아, 에, 이, 오, 우)과 "스" 소리.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="6" y="30" class="t-small">${L('모듈레이터 (목소리)', 'Modulator (voice)')}</text>
    <rect x="120" y="14" width="60" height="16" class="f-dim"/><rect x="120" y="34" width="60" height="16" class="f-dim"/><rect x="120" y="54" width="60" height="16" class="f-dim"/>
    <text x="150" y="26" text-anchor="middle" class="t-small">BP 1</text><text x="150" y="46" text-anchor="middle" class="t-small">BP 2</text><text x="150" y="66" text-anchor="middle" class="t-small">BP N</text>
    <rect x="200" y="14" width="76" height="16" class="f-dim"/><rect x="200" y="34" width="76" height="16" class="f-dim"/><rect x="200" y="54" width="76" height="16" class="f-dim"/>
    <text x="238" y="26" text-anchor="middle" class="t-small">${L('엔벨로프', 'Envelope')}</text><text x="238" y="46" text-anchor="middle" class="t-small">${L('엔벨로프', 'Envelope')}</text><text x="238" y="66" text-anchor="middle" class="t-small">${L('엔벨로프', 'Envelope')}</text>
    <text x="6" y="140" class="t-small">${L('캐리어 (신스)', 'Carrier (synth)')}</text>
    <rect x="120" y="114" width="60" height="16" class="f-dim"/><rect x="120" y="134" width="60" height="16" class="f-dim"/><rect x="120" y="154" width="60" height="16" class="f-dim"/>
    <text x="150" y="126" text-anchor="middle" class="t-small">BP 1</text><text x="150" y="146" text-anchor="middle" class="t-small">BP 2</text><text x="150" y="166" text-anchor="middle" class="t-small">BP N</text>
    <circle cx="330" cy="122" r="9" class="d-line"/><circle cx="330" cy="142" r="9" class="d-line"/><circle cx="330" cy="162" r="9" class="d-line"/>
    <text x="330" y="126" text-anchor="middle" class="t-small">×</text><text x="330" y="146" text-anchor="middle" class="t-small">×</text><text x="330" y="166" text-anchor="middle" class="t-small">×</text>
    <line x1="180" y1="122" x2="319" y2="122" class="d-dim"/><line x1="180" y1="142" x2="319" y2="142" class="d-dim"/><line x1="180" y1="162" x2="319" y2="162" class="d-dim"/>
    <path d="M276,22 L300,22 L300,100 L330,100 L330,111" class="d-b" marker-end="url(#arr)"/>
    <path d="M276,42 L306,42 L306,96 L344,96 L344,136 L341,140" class="d-b"/>
    <text x="360" y="60" class="t-small t-b">${L('대역별 음량으로 조절', 'Scale each band by its level')}</text>
    <path d="M339,142 L420,142" class="d-line" marker-end="url(#arr)"/><line x1="339" y1="122" x2="400" y2="122" class="d-line"/><line x1="339" y1="162" x2="400" y2="162" class="d-line"/>
    <line x1="400" y1="122" x2="400" y2="162" class="d-line"/>
    <text x="426" y="146" class="t-small">${L('합 = 출력', 'Sum = output')}</text>
  </svg>`,
  look: [
    '대역 음량 지도를 비교하면 A는 굵은 칸 4줄이라 모음이 바뀌어도 모양 차이가 작고, B는 포먼트 봉우리가 모음마다 다른 높이로 움직임',
    '"소리 켜기"로 들으면 A는 "웅웅" 하는 음량 변화만 들리고 B는 "아, 에, 이, 오, 우"가 구분됨',
    '엔벨로프 시간을 100ms로 늘리면 "스" 소리와 모음 경계가 뭉개짐',
    '캐리어를 노이즈로 바꾸면 음 높이가 사라지고 속삭이는 목소리가 됨',
  ],
  refs: [
    { type: 'paper', title: 'Homer Dudley, "Remaking Speech", Journal of the Acoustical Society of America 11(2)', year: 1939, note: '채널 보코더의 원형' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed., Wiley', year: 2011, note: '소스 필터 처리와 보코더' },
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial, MIT Press', year: 1996, note: '보코더와 분석 재합성' },
    { type: 'paper', title: 'Gordon E. Peterson, Harold L. Barney, "Control Methods Used in a Study of the Vowels", Journal of the Acoustical Society of America 24(2)', year: 1952, note: '모음별 포먼트 주파수' },
  ],
  params: [
    { key: 'bands', label: '대역 수', type: 'int', min: 2, max: 32, a: 4, b: 16, group: '보코더' },
    { key: 'env', label: '엔벨로프 시간 (ms)', type: 'range', min: 2, max: 100, step: 1, default: 12, shared: true },
    { key: 'carrier', label: '캐리어', type: 'select', options: [{ value: 'saw', label: '톱니 화음' }, { value: 'noise', label: '노이즈' }], default: 'saw', shared: true },
    { key: 'monitor', label: '모듈레이터 원음 듣기', type: 'bool', default: false, shared: true, help: '보코더 대신 목소리 원음을 들음' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Channel Vocoder (Band Count and Clarity)',
    summary: 'A vocoder splits a voice into frequency bands, measures how loud each band is over time, and uses those levels to shape the same bands of a synth. More bands keep the formants (vowel shapes) of the voice, so the words are easier to understand.',
    views: { a: '4 bands', b: '16 bands' },
    controls: 'Change band count, carrier and envelope speed in the parameter table. Press "Sound on" to hear the view that plays sound.',
    info: `
    <p>Homer Dudley built the <b>channel vocoder</b> at Bell Labs in the 1930s to compress telephone speech. In music it is famous as the "robot voice" effect.</p>
    <ul>
      <li><b>Analysis</b>: split the modulator (voice) with N bandpass filters and measure each band's level with an envelope follower (rectifier + lowpass).</li>
      <li><b>Synthesis</b>: split the carrier (a sound rich in harmonics, like a saw chord or noise) with the same N filters, multiply each band by its measured level, and add them up.</li>
      <li>Result: the carrier's pitch combined with the voice's spectral shape (formants).</li>
    </ul>
    <p>Vowels are told apart by the positions of 2 or 3 formants (resonance peaks). With 4 bands the peaks blur and vowels sound the same. With 16 to 32 bands most words come through. Too slow an envelope smears consonants. Too fast adds noisy modulation to the carrier. The voice in this sample is synthesized with formant filters: the vowels a, e, i, o, u and an "s" sound.</p>`,
    look: [
      'Compare the band level maps. A has 4 thick rows, so the shape barely changes between vowels. In B the formant peaks move to a different height for each vowel.',
      'Press "Sound on". A only "wows" up and down in level. In B you can tell "a, e, i, o, u" apart.',
      'Raise the envelope time to 100 ms. The "s" sound and the vowel borders smear.',
      'Switch the carrier to noise. The pitch disappears and the voice whispers.',
    ],
    refs: ['The original channel vocoder.', 'Source-filter processing and vocoders.', 'Vocoders and analysis-resynthesis.', 'Formant frequencies of vowels.'],
    params: {
      bands: { label: 'Band count', group: 'Vocoder' },
      env: 'Envelope time (ms)',
      carrier: { label: 'Carrier', options: { saw: 'Saw chord', noise: 'Noise' } },
      monitor: { label: 'Hear the modulator', help: 'Hear the dry voice instead of the vocoder' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b, TAU = Math.PI * 2;
    const SRV = 16000, FMIN = 100, FMAX = 6000, LOOP = 2.4;
    // 모음 포먼트 (Peterson & Barney 근사, 남성)
    const VOW = { a: [730, 1090, 2440], e: [530, 1840, 2480], i: [270, 2290, 3010], o: [570, 840, 2410], u: [300, 870, 2240] };
    const SEQ = ['a', 'e', 'i', 's', 'o', 'u', 'a', 's'];

    // 합성 목소리: 성대 펄스(톱니) → 포먼트 밴드패스 3개, 마찰음 "스"는 고역 노이즈
    function makeVoice(sr) {
      const noise = A.noiseBuffer(sr, 8), slot = LOOP / SEQ.length;
      const fm = [0, 1, 2].map(() => A.biquad('bandpass', 500, 8, 0, sr)), hp = A.biquad('highpass', 4000, 0.7, 0, sr);
      let n = 0, ph = 0, cur = VOW.a.slice();
      return () => {
        const t = (n % Math.round(LOOP * sr)) / sr, k = Math.floor(t / slot), tt = t - k * slot, s = SEQ[k];
        n++;
        if (s === 's') return hp.process(noise[n % sr]) * 0.3 * Math.sin(Math.PI * tt / slot);
        const tgt = VOW[s];
        if (n % 32 === 0) {
          for (let j = 0; j < 3; j++) { // 계수만 바꾸고 필터 상태는 유지
            cur[j] += (tgt[j] - cur[j]) * 0.25;
            const q = A.biquad('bandpass', cur[j], 6 + j * 2, 0, sr);
            fm[j].b0 = q.b0; fm[j].b1 = q.b1; fm[j].b2 = q.b2; fm[j].a1 = q.a1; fm[j].a2 = q.a2;
          }
        }
        const f0 = 115 + 20 * Math.sin(TAU * t / LOOP) - 10 * tt / slot;
        ph = (ph + f0 / sr) % 1;
        const glot = A.wave.saw(ph);
        let v = 0;
        for (let j = 0; j < 3; j++) v += fm[j].process(glot) * [1, 0.7, 0.4][j];
        return v * 1.2 * Math.min(1, tt * 40) * Math.min(1, (slot - tt) * 30);
      };
    }
    function makeCarrier(sr) {
      const noise = A.noiseBuffer(sr * 2, 12), ph = [0, 0, 0, 0], notes = [48, 55, 60, 63];
      let n = 0;
      return () => {
        n++;
        if (P.carrier === 'noise') return noise[n % noise.length] * 0.5;
        let v = 0;
        for (let i = 0; i < 4; i++) { ph[i] = (ph[i] + A.mtof(notes[i]) / sr) % 1; v += A.wave.saw(ph[i]); }
        return v * 0.25;
      };
    }
    // 대역 중심 주파수와 Q (로그 등간격)
    function bandsFor(nb) {
      const oct = Math.log2(FMAX / FMIN) / nb, out = [];
      for (let b = 0; b < nb; b++) {
        const fc = FMIN * Math.pow(2, oct * (b + 0.5));
        out.push({ fc, Q: 1 / (Math.pow(2, oct / 2) - Math.pow(2, -oct / 2)) });
      }
      return out;
    }
    function makeVocoder(sr) {
      const nb = P.bands, bs = bandsFor(nb);
      const mk = () => bs.map((b) => [A.biquad('bandpass', b.fc, b.Q, 0, sr), A.biquad('bandpass', b.fc, b.Q, 0, sr)]);
      const mf = mk(), cf = mk(), env = new Float64Array(nb);
      const o = { nb, env, bs };
      o.step = (m, c) => {
        const a = 1 - Math.exp(-1 / (P.env / 1000 * sr));
        let y = 0;
        for (let b = 0; b < nb; b++) {
          const mv = mf[b][1].process(mf[b][0].process(m));
          env[b] += a * (Math.abs(mv) - env[b]);
          y += cf[b][1].process(cf[b][0].process(c)) * env[b];
        }
        return y * 6;
      };
      return o;
    }

    let live = null;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (!live || live.sr !== sr) live = { sr, v: makeVoice(sr), c: makeCarrier(sr), fx: null };
        if (!live.fx || live.fx.nb !== P.bands) live.fx = makeVocoder(sr);
        for (let i = 0; i < n; i++) {
          const m = live.v(), c = live.c(), y = live.fx.step(m, c);
          const v = P.monitor ? m * 0.8 : y;
          l[i] = v; r[i] = v;
        }
      },
    });

    // 대역 음량 지도 (bands × 프레임), 파라미터가 바뀔 때만
    let key = '', map = null, frames = 0, mapMax = 1, img = null, resp = null;
    function analyze() {
      const k = [P.bands, P.env, P.carrier].join();
      if (k === key) return;
      key = k;
      const v = makeVoice(SRV), c = makeCarrier(SRV), fx = makeVocoder(SRV), n = Math.round(LOOP * SRV), hop = 160;
      frames = Math.floor(n / hop);
      map = new Float32Array(frames * P.bands);
      mapMax = 1e-9;
      for (let i = 0; i < n; i++) {
        fx.step(v(), c());
        if (i % hop === 0) { const f = i / hop; for (let b = 0; b < P.bands; b++) { map[f * P.bands + b] = fx.env[b]; mapMax = Math.max(mapMax, fx.env[b]); } }
      }
      // 지도를 1칸 = 1픽셀인 오프스크린 캔버스에 그려 둠
      const nb = P.bands;
      img = ctx.createCanvas(frames, nb);
      const ig = img.getContext('2d');
      ig.fillStyle = '#000'; ig.fillRect(0, 0, frames, nb);
      for (let f = 0; f < frames; f++) {
        for (let b = 0; b < nb; b++) {
          const db = U.clamp((A.linToDb(map[f * nb + b] / mapMax) + 40) / 40, 0, 1);
          if (db < 0.05) continue;
          ig.fillStyle = U.hsl(ctx.side === 'a' ? 28 : 200, 0.85, 0.12 + 0.55 * db);
          ig.fillRect(f, nb - 1 - b, 1, 1);
        }
      }
      // 필터 뱅크 응답 (로그 주파수 256점)
      const coefs = bandsFor(nb).map((b) => A.biquad('bandpass', b.fc, b.Q, 0, SRV));
      resp = new Float32Array(257);
      for (let i = 0; i <= 256; i++) { const f = 50 * Math.pow(8000 / 50, i / 256); let m = -200; for (const c of coefs) m = Math.max(m, 2 * A.biquadResponse(c, f, SRV).db); resp[i] = m; }
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2;
        const rh = Math.max(50, H * 0.3);
        // 필터 뱅크 응답
        A.drawResponse(g, (f) => resp[U.clamp(Math.round(256 * Math.log(f / 50) / Math.log(8000 / 50)), 0, 256)], pad, pad, w, rh, { fmin: 50, fmax: 8000, color: col, minDb: -40, maxDb: 6, dbStep: 12, label: GTL.L('필터 뱅크 (대역별 4차 밴드패스)', 'Filter bank (4th-order bandpass per band)') });
        // 대역 음량 지도
        const my = pad * 2 + rh, mh = H - my - pad - 14, nb = P.bands;
        g.imageSmoothingEnabled = false;
        g.drawImage(img, pad, my, w, mh);
        g.imageSmoothingEnabled = true;
        const slot = w / SEQ.length;
        SEQ.forEach((s, i) => { D.line(g, pad + i * slot, my, pad + i * slot, my + mh, 'rgba(255,255,255,0.15)', 1); D.text(g, s, pad + i * slot + slot / 2, my + mh + 2, { size: 10, align: 'center', color: C.dim }); });
        D.text(g, GTL.L('대역별 음량 (세로 = 대역 100Hz~6kHz, 가로 = 시간, 밝을수록 큼)', 'Band levels (y = band 100 Hz to 6 kHz, x = time, brighter = louder)'), pad + 4, my + 3, { size: 10, color: C.dim });
        const oct = Math.log2(FMAX / FMIN) / nb;
        ctx.stat(GTL.L('대역 폭', 'Band width'), oct.toFixed(2) + GTL.L(' 옥타브', ' octaves'));
        ctx.stat(GTL.L('샘플당 바이쿼드 수', 'Biquads per sample'), nb * 4);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
