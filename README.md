# AI 헤어 스타일링 서비스 🎨

## 프로젝트 소개
이 프로젝트는 AI를 활용하여 사용자의 얼굴 사진에서 자연스러운 헤어 스타일링을 제공하는 웹 서비스입니다. 포토샵이나 유료 애플리케이션 없이도 고품질의 헤어 스타일 변경 서비스를 무료로 이용할 수 있습니다.
팀원의 향후 사업 프로젝트 제안을 고려하여, 제가 작업한 파일 중 Figma 디자인과 React 스킬을 보여줄 수 있는 일부만 선별하여 push했습니다.

## 주요 기능
- 사용자 인증 시스템
- 이미지 업로드 및 분석
- AI 기반 헤어 스타일링
- 실시간 미리보기
- 결과 이미지 저장 및 공유

## 기여 내용
- UI/UX: Figma를 활용한 대시보드 및 인증 UI 디자인
- 프론트엔드: React 컴포넌트 구현, 반응형 디자인, 다국어 지원
- 기타: 프로젝트 문서화, 코드 리뷰

## 기술 스택

### 프론트엔드
- React.js
- Material UI
- Emotion

## 프로젝트 특징

### 1. 반응형 디자인
모바일과 데스크톱 환경 모두에서 최적화된 사용자 경험을 제공하기 위해 반응형 디자인을 구현했습니다. 디바이스의 화면 크기에 따라 자동으로 레이아웃이 조정되어 사용자 친화적인 인터페이스를 제공합니다.

<div style="display: flex; justify-content: space-between; margin: 20px 0;">
  <img src="/public/README/images/mobile1.jpg" alt="모바일 뷰 1" width="23%">
  <img src="/public/README/images/mobile2.jpg" alt="모바일 뷰 2" width="23%">
  <img src="/public/README/images/mobile3.jpg" alt="모바일 뷰 3" width="23%">
  <img src="/public/README/images/mobile5.jpg" alt="모바일 뷰 5" width="23%">
</div>

### 2. 테마 & 다국어 지원

#### 다크/라이트 모드
사용자의 선호도에 맞춰 다크 모드와 라이트 모드를 지원합니다. 사용자 설정에 따라 테마가 전환됩니다.

<div style="display: flex; justify-content: space-between; margin: 20px 0;">
  <img src="/public/README/images/bright.png" alt="라이트 모드" width="48%">
  <img src="/public/README/images/dark.png" alt="다크 모드" width="48%">
</div>

#### 다국어 지원 (i18n)
React-i18next를 활용하여 다국어 지원 시스템을 구축했습니다. 현재 영어, 스페인어, 한국어를 지원하며, 사용자의 브라우저 설정에 따라 자동으로 언어가 선택됩니다.

<div style="display: flex; justify-content: space-between; margin: 20px 0;">
  <img src="/public/README/images/english.png" alt="영어 버전" width="48%">
  <img src="/public/README/images/spanish.png" alt="스페인어 버전" width="48%">
</div>

### 3. Figma 디자인 구현
Figma에서 디자인한 UI를 React 컴포넌트로 완벽하게 구현했습니다. 대시보드 페이지는 사용자 경험을 최우선으로 고려하여 직관적이고 세련된 디자인을 적용했습니다. react-youtube를 사용하여 유튜브의 영상을 불러오는 기능도 추가했습니다. 

![대시보드 데모](/public/README/gifs/dashboard.gif)

### 4. 사용자 인증 시스템
사용자의 인증을 관리하는 auth ui를 figma를 사용하여 디자인한 후 React코드로 변경했습니다.

![인증 시스템 데모](/public/README/gifs/login.gif)

## 프로젝트 구조
```
KTC3th-ReactApp/
├── docs/
│   ├── key_components.md
│   └── project_structure.md
├── Server-lambda/
│├── lambda/
│   └── websocket_lambda.py
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── CustomAuthenticator.js
│   │   ├── common/
│   │   │   ├── Button.js
│   │   │   ├── ContentBlock.js
│   │   │   ├── CustomButton.js
│   │   │   ├── CustomCarousel.js
│   │   │   ├── CustomDropZone.js
│   │   │   ├── CustomFooter.js
│   │   │   ├── CustomImageBar.js
│   │   │   ├── CustomSlider.js
│   │   │   ├── CustomTextField.js
│   │   │   └── MaskEditor.js
│   │   ├── layout/
│   │   │   ├── Footer.js
│   │   │   ├── Header.js
│   │   │   ├── Sidebar.js
│   │   │   └── TopBarCustom.js
│   │   └── pages/
│   │       ├── LandingPage/
│   │       │   ├── CarouselBlock.css
│   │       │   ├── CarouselBlock.js
│   │       │   ├── carouselItems.json
│   │       │   ├── HeaderBlock.css
│   │       │   └── HeaderBlock.js
│   │       ├── Dashboard.js
│   │       ├── DesignPage.js
│   │       ├── GenerationPage.js
│   │       ├── LandingPage.js
│   │       ├── MyPage.js
│   │       └── TestPage.js
│   ├── contexts/
│   │   ├── LanguageContext.js
│   │   ├── ThemeContext.js
│   │   └── UserContext.js
│   ├── graphql/
│   │   ├── mutations.js
│   │   ├── queries.js
│   │   ├── schema.json
│   │   └── subscriptions.js
│   ├── hooks/
│   │   ├── useLanguage.js
│   │   ├── useTheme.js
│   │   └── useWebSocket.js
│   ├── locales/
│   │   ├── en.json
│   │   ├── es.json
│   │   └── ko.json
│   ├── my-components/
│   │   └── WebSocketService.js
│   ├── services/
│   │   ├── api.js
│   │   └── auth.js
│   ├── styles/
│   │   ├── App.css
│   │   ├── Auth.css
│   │   ├── CustomAuthenticator.css
│   │   ├── CustomButton.css
│   │   ├── CustomCarousel.css
│   │   ├── CustomDropZone.css
│   │   ├── CustomFooter.css
│   │   ├── CustomImageBar.css
│   │   ├── CustomSlider.css
│   │   ├── CustomTextField.css
│   │   ├── DesignPage.css
│   │   ├── globalStyles.js
│   │   ├── LandingPage.css
│   │   ├── MaskEditor.css
│   │   ├── MyPage.css
│   │   ├── Sidebar.css
│   │   ├── TestPage.css
│   │   ├── theme.js
│   │   └── TopBarCustom.css
│   ├── ui-components/
│   │   ├── index.js
│   │   ├── studioTheme.js
│   │   ├── studioTheme.js.d.ts
│   │   ├── TopBar.d.ts
│   │   ├── TopBar.jsx
│   │   ├── UserCreateForm.d.ts
│   │   ├── UserCreateForm.jsx
│   │   ├── UserUpdateForm.d.ts
│   │   ├── UserUpdateForm.jsx
│   │   └── utils.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── fileUpload.js
│   │   └── helpers.js
│   ├── App.js
│   ├── aws-exports.js
│   ├── i18n.js
│   ├── index.css
│   └── index.js
├── .eslintignore
├── .gitignore
├── package.json
└── README.md
```

## 기여자
- UI/UX 디자인
- 프론트엔드 개발
- 백엔드 로직 구현

