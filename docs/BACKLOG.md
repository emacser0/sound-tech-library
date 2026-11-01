# 백로그

다음에 추가할 샘플 후보. `/update-library`가 조사 결과를 여기에 쌓고, 상위 항목부터 구현.

우선순위:
- **P1**: 널리 쓰이고 보고 듣는 차이가 분명함
- **P2**: 유용하지만 단순화 필요
- **P3**: 참고용이거나 난이도가 높음

| 제목 | 카테고리 | 출처 | A/B 비교 아이디어 | 우선 | 상태 |
|---|---|---|---|---|---|
| 위상 보코더 (Phase Vocoder) | effects | Flanagan & Golden 1966; Laroche & Dolson 1999 | 위상 고정 없음 vs 위상 고정(phase locking): 타임 스트레치 음색 번짐 | P2 | todo |
| 가상 아날로그 다이오드 클리퍼 (WDF) | effects | Fettweis 1986; Werner 2016 박사논문 | tanh 근사 vs 웨이브 디지털 필터 모델 | P3 | todo |
| 음원 분리 (NMF) | analysis | Lee & Seung 1999; Smaragdis 2003 | 혼합음 vs NMF 성분 분리 | P3 | todo |
| AudioWorklet vs ScriptProcessor | digital-audio | W3C Web Audio API | 메인 스레드 부하에 따른 끊김 비교 | P2 | todo |
| MIDI 2.0 고해상도 컨트롤 | composition | MIDI Association, MIDI 2.0 사양 | 7비트 CC vs 32비트 컨트롤 계단 | P2 | todo |
| 신경망 오디오 합성 (DDSP) | synthesis | Engel et al., "DDSP", ICLR 2020 | 순수 가산 합성 vs 하모닉 + 노이즈 모델 | P3 | todo |
