# seon.uk — 개인 홈페이지

## 목적

인터넷에 내 정보를 최대한 노출시키기 위한 개인 홈페이지.  
검색엔진(구글 등)에서 "김선욱", "Seonuk Kim"으로 검색했을 때 잘 노출되도록 SEO를 강하게 의식해 만들어짐.

---

## 호스팅 & 배포

| 항목 | 내용 |
|------|------|
| 도메인 | `seon.uk` |
| 저장소 | `github.com/snkii/snkii.github.io` |
| 배포 | main 브랜치 push → GitHub Actions → NAS SSH git pull |
| NAS 경로 | `/volume1/web/snkii.github.io` (포트 7777) |

---

## 기술 스택

- **순수 HTML / CSS / JS** — 프레임워크 없음, 빌드 과정 없음
- 폰트: Google Fonts — DM Sans 500
- 아이콘: Font Awesome 6.5
- SPA 라우팅: `history.pushState` 기반 (섹션 전환 시 URL 변경)

---

## 로컬 개발

```bash
npm run dev        # http://localhost:3000
```

---

## 디자인 컨셉

- **테마: Gruvbox Dark**

  | CSS 변수 | 값 | 용도 |
  |----------|----|------|
  | `--bg` | `#282828` | 배경 |
  | `--fg` | `#ebdbb2` | 텍스트 |
  | `--accent` | `#fabd2f` | 링크·강조 |
  | `--hover` | `#fe8019` | 호버 |

- **홈 화면 배경** → 로딩마다 Gruvbox 색상, 시작 위치, 속도, 형태가 자유롭게 선택되는 mesh/blob gradient가 자동으로 천천히 전환
- 모바일에서는 렉을 줄이기 위해 blurred div animation 대신 radial-gradient 레이어 crossfade 사용
- 미니멀리즘 — 전체화면 고정 레이아웃, opacity transition으로 섹션 전환
- Co-designed with ChatGPT

---

## 섹션 구조

4개 `<div>` 가 `position: fixed`로 겹쳐있고, `.active` 클래스로 전환. 모두 `index.html` 인라인.

| 섹션 | URL | 주요 내용 |
|------|-----|-----------|
| **Home** | `/` | 이메일, 소셜 링크, 자동 mesh gradient 배경, 네비게이션 버튼 |
| **About** | `/about/` | 학력, 연구 분야, 연락처. TMI 토글(숨김 학력) 있음 |
| **Gallery** | `/gallery/` | GR3x + iPhone 사진 5장, 우클릭 방지 |
| **This & That** | `/thisthat/` | 관심사 태그 floating bubble 애니메이션 |

---

## SEO 구성

- `<meta>` description / keywords — 한/영 모두 풍부하게 작성
- OG(Open Graph) + Twitter Card 메타태그
- JSON-LD 구조화 데이터: `Person` + `WebSite` schema
- `sitemap.xml`, `robots.txt`
- `<noscript>` 폴백 — JS 없는 크롤러용 전체 정보 포함
- CSP, X-Frame-Options, X-Content-Type-Options 보안 헤더

---

## 파일 구조

```
snkii.github.io/
├── index.html              # SPA 전체 (4개 섹션 + 스타일 + JS 인라인)
├── about/index.html        # /about/ 직접 접근 지원
├── gallery/
│   ├── index.html
│   └── images/             # photo1~5
├── thisthat/
│   └── index.html          # /thisthat/ 직접 접근 지원
├── sitemap.xml
├── robots.txt
├── humans.txt
├── CNAME                   # seon.uk
├── site.webmanifest
├── package.json            # npm run dev (로컬 서버)
├── favicon.*               # 여러 형식
└── .github/workflows/deploy.yml
```

---

## 나에 대해

- **이름:** 김선욱 (Seonuk Kim) · snkii / snkiilog
- **소속:** 서울대학교 ECE 휴먼인터페이스연구실(HIL) 석박통합과정 (2024–)
- **학부:** SNU ECE B.S. (2018–2024)
- **연구:** Voice-based HCI · AI 음성처리 · Spoken Dialogue Systems
- **이메일:** hello@seonuk.kim · sukim@hi.snu.ac.kr
- **소셜:** Instagram @snkiilog · GitHub snkii · LinkedIn · until.blog @seonuk
- **관심사:** GR3x 카메라 · 아쿠아스케이핑 · 이끼정원 · 인테리어 · 커스텀 키보드 · NAS · ZSH · 기독교
