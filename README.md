# Vue Components Project

Vue 3 + TypeScript + SCSS + ESLint + Prettier + Pinia로 구성된 컴포넌트 라이브러리 프로젝트입니다.

## 🚀 기술 스택

- **Vue 3** - 최신 Vue.js 프레임워크
- **TypeScript** - 타입 안전성
- **SCSS** - 고급 CSS 전처리기
- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **Pinia** - 상태 관리
- **Vue Router** - 라우팅
- **Vite** - 빌드 도구

## 📦 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 미리보기
npm run preview
```

## 🛠️ 개발 도구

```bash
# 린트 검사 및 수정
npm run lint

# 린트 검사만 (수정하지 않음)
npm run lint:check

# 코드 포맷팅
npm run format

# 포맷팅 검사만 (수정하지 않음)
npm run format:check

# 린트 + 포맷팅 한번에 실행
npm run fix

# 타입 체크
npm run type-check
```

## 📁 프로젝트 구조

```
vue-components/
├── src/
│   ├── assets/
│   │   └── styles/
│   │       ├── variables.scss    # SCSS 전역 변수
│   │       └── main.scss         # 메인 스타일
│   │   ├── components/               # 재사용 가능한 컴포넌트
│   │   ├── views/                    # 페이지 컴포넌트
│   │   ├── stores/                   # Pinia 스토어
│   │   ├── router/                   # 라우터 설정
│   │   └── main.ts                   # 앱 진입점
│   ├── .vscode/                      # VS Code 설정
│   ├── eslint.config.ts              # ESLint 설정
│   ├── .prettierrc.json              # Prettier 설정
│   └── vite.config.ts                # Vite 설정
```

## 🎨 SCSS 변수

프로젝트에서 사용할 수 있는 SCSS 변수들이 `src/assets/styles/variables.scss`에 정의되어 있습니다:

- **색상**: `$primary-color`, `$secondary-color`, `$success-color` 등
- **간격**: `$spacing-xs`, `$spacing-sm`, `$spacing-md` 등
- **폰트**: `$font-family-base`, `$font-size-base` 등
- **브레이크포인트**: `$breakpoint-sm`, `$breakpoint-md` 등

## 🔧 VS Code 설정

프로젝트에는 VS Code 설정이 포함되어 있어 다음 기능들이 자동으로 작동합니다:

- **파일 저장 시 자동 포맷팅** (Prettier)
- **파일 저장 시 자동 린트 수정** (ESLint)
- **Vue 3 + TypeScript 지원**
- **SCSS 문법 하이라이팅 및 검증**

## 📝 코딩 컨벤션

### Vue 컴포넌트
- Composition API 사용
- TypeScript 타입 정의 필수
- 컴포넌트명은 PascalCase
- Props와 Emits 타입 정의

### 스타일링
- SCSS 사용
- BEM 방법론 권장
- 전역 변수 활용
- 반응형 디자인 고려

### TypeScript
- 명시적 타입 정의
- `any` 타입 사용 지양
- 인터페이스 우선 사용

## 🚀 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## �� 라이선스

MIT License
