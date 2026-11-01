# Sound Tech Library

음향, 음악 지식과 오디오 기법을 **A, B 두 뷰에서 동시에 실행해 보고 들으며** 비교하는 인터랙티브 샘플 모음.
[Game Tech Library](https://github.com/emacser0/game-tech-library)와 같은 프레임워크를 씀.

- 다루는 범위: 음향 기초, 청각과 지각, 디지털 오디오, 합성, 필터와 EQ, 이펙트, 다이내믹스와 믹싱, 공간 음향, 분석과 음악 정보 검색, 음악 이론, 작곡과 시퀀싱, 인터랙티브 게임 음악
- 두 뷰는 같은 시드와 같은 입력을 받음. 기본값은 A가 기법 미사용(또는 단순한 방식), B가 기법 사용.
- 파라미터 표에서 A 열과 B 열을 따로 바꿀 수 있음
- **소리**: "소리 켜기" 버튼을 누르면 "소리 내는 뷰"로 고른 뷰의 소리가 들림. 음원 파일 없이 모든 소리를 코드로 합성.
- 소리를 켜지 않아도 파형, 스펙트럼, 응답 곡선, 건반, 타임라인으로 차이가 보임
- 샘플마다 설명, 동작 원리 도식, 관찰 포인트, 참고자료(논문, 서적, 표준, 제품 문서)가 있음
- 비교 대상이 없는 기법은 뷰 하나로 보여줌
- 샘플마다 구현 난이도(입문, 초급, 중급, 고급)가 있음. 사이드바에서 "주제별"과 "난이도별" 묶음을 바꿀 수 있음.
- 한국어와 영어 지원. 사이드바 위의 "한국어 / English" 버튼으로 바꿈.

## 실행

빌드 과정 없음. 브라우저로 `index.html`을 열면 됨.

로컬 서버로 열면 더 안정적임:

```bash
python -m http.server 8766
# http://127.0.0.1:8766/
```

헤드폰 사용을 권장. 공간 음향(바이노럴, ITD) 샘플은 헤드폰이 필요함.

단축키:
- `P`: 일시정지
- `.`: 한 프레임 진행
- `R`: 리셋
- `/`: 검색

## 구조

```
index.html              앱 화면 (카테고리 매니페스트를 불러옴)
core/util.js            공용 헬퍼 (수학, 난수, 노이즈, 2D 그리기, WebGL)
core/audio.js           소리 헬퍼 (소리 켜기, 실시간 합성, 바이쿼드, FFT, 파형, 스펙트럼, 건반 그리기)
core/runtime.js         샘플 등록과 로딩, 파라미터, View(A/B 인스턴스 실행기)
core/ui.js              사이드바, 파라미터 표, 설명 패널, 메인 루프, 셀프테스트
samples/<카테고리>/     _manifest.js와 샘플 파일 (샘플 1개 = 파일 1개)
tools/smoke.js          Node 스모크 테스트 (모의 Canvas, 모의 WebGL, 모의 WebAudio)
tools/lint-text.js      문구 규칙 검사
docs/AUTHORING.md       샘플 작성 규격과 문구 규칙. 샘플을 추가하기 전에 읽을 것
docs/BACKLOG.md         추가할 기법 목록
docs/SOURCES.md         지속 업데이트를 위해 주기적으로 확인하는 소스
docs/RESEARCH_LOG.md    조사 기록
docs/CHANGELOG.md       변경 기록
.claude/skills/update-library/  최신 연구, 제품 업데이트를 반영하는 Claude Code 스킬
```

## 검증

```bash
node tools/smoke.js              # 전체
node tools/smoke.js synthesis    # 카테고리 하나
node tools/smoke.js --en         # 영어 모드. 영어 문구 누락과 화면에 남은 한글 검사
node tools/lint-text.js          # 문구 규칙 검사
```

스모크 테스트는 "소리 켜기"를 눌러 실시간 합성 함수를 몇 블록 실행하고 NaN을 검사함. 실제 소리는 브라우저에서 확인.
브라우저에서 `index.html#selftest`를 열면 모든 샘플을 기본값과 무작위 파라미터로 실행하고 결과를 보여줌.

## 지속 업데이트

Claude Code에서 `/update-library`를 실행하면 조사, 백로그 정리, 구현, 검증, 기록 순서로 진행됨.

- `/update-library synthesis`: 합성 분야만 조사
- `/update-library research-only`: 조사만 하고 구현하지 않음
- `/update-library implement 3`: 백로그에서 3개 구현

새 샘플에는 30일 동안 사이드바에 `NEW` 배지가 붙음. 갱신된 샘플에는 `UPD` 배지가 붙음.
