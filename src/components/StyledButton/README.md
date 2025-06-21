# StyltedButton component

# 항목

1. [사용방법](#1-사용방법)
2. [Props](#2-props)
3. [그 외](#3-그-외)

---

# 1. 사용방법
* 해당 컴포넌트를 사용하기 위해서는 Material Design Icons이 필요합니다. [링크](https://pictogrammers.com/library/mdi/)

## 1.1. MDI 설치
```
npm install @/assets/svg/iconPath @/components/Icon/SvgIcon.vue
```

## 1.2. MDI를 전역 설정
```typescript
import SvgIcon from '@/components/Icon/SvgIcon.vue'
```

## 1.3. Icon SVG는 필요 할때 마다 import
```vue
<script setup lang="ts">
import { mdiAccount } from '@/assets/svg/iconPath'
</script>

<template>
  <SvgIcon size="15" type="mdi" :path="mdiACcount" />
</template>
```

## 1.4. 전역 선언
```typescript
import StyledButton from '@/components/StyledButton'

app.component('StyledButton', StyledButtonStyledButton)
```

## 1.5. 예제 코드
```vue
<template>
  <div class="wrap">
    <div class="row">
      <div class="col">
        <StyledButton block color="primary">color: primary</StyledButton>
      </div>
      <div class="col">
        <StyledButton block color="success">color: success</StyledButton>
      </div>
      <div class="col">
        <StyledButton block color="info">color: info</StyledButton>
      </div>
      <div class="col">
        <StyledButton block color="warning">color: warning</StyledButton>
      </div>
      <div class="col">
        <StyledButton block color="danger">color: danger</StyledButton>
      </div>
      <div class="col">
        <StyledButton block color="dark">color: dark</StyledButton>
      </div>
      <div class="col">
        <StyledButton block color="secondary">color: secondary</StyledButton>
      </div>
      <div class="col">
        <StyledButton block color="light">color: light</StyledButton>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col">
        <StyledButton block color="primary" icon="file_download">with icon (left)</StyledButton>
      </div>
      <div class="col">
        <StyledButton block icon-right color="success" icon="reply">with icon (right)</StyledButton>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col flex-row justify-around">
        <StyledButton only-icon color="primary" icon="file_download"></StyledButton>
        <StyledButton only-icon color="success" icon="reply"></StyledButton>
        <StyledButton only-icon color="info" icon="east"></StyledButton>
        <StyledButton only-icon color="warning" icon="restart_alt"></StyledButton>
        <StyledButton only-icon color="danger" icon="open_in_new"></StyledButton>
        <StyledButton only-icon color="dark" icon="ios_share"></StyledButton>
        <StyledButton only-icon color="secondary" icon="save_alt"></StyledButton>
      </div>
    </div>
  </div>
</template>
```

:arrow_up: [항목](#항목)

---

# 2. Props
| Name | Type | Default | Description |
|-------|---- |---------|-------------|
| color | [BtnColors](#31-BtnColors) | <code>none</code> | 툴팁 메시지, 배열입력시 리스트 형태로 출력 |
| class? | string | <code>none</code> | 추가되는 style sheet class |
| href? | string | <code>#</code> | 연결 링크 |
| target? | string | <code>_blank</code> | 링크 오픈 방식 (a tag target과 같음) |
| icon? | SvgIcon | <code>none</code> | 아이콘으로 사용될 MDI(Material Design Icons) |
| text? | boolean | <code>false</code> | 텍스트로만 보이는 버튼 (margin, padding 등 기본 css 적용 안됨) |
| iconRight? | boolean | <code>false</code> | 상입된 아이콘의 위치가 오른쪽일때 설정 |
| iconOnly? | boolean | <code>false</code> | 아이콘으로만 이루어진 버튼을 사용 |
| block? | boolean | <code>false</code> | 버튼을 전체 라인으로 지정 |
| disabled? | boolean | <code>false</code> | 버튼 사용 불가 처리 |
| large? | boolean | <code>false</code> | 버튼 최대 크기 |
| small? | boolean | <code>false</code> | 버튼 최소 크기 block 옵션 무시 |
| xSmall? | boolean | <code>false</code> | 버튼 최소 크기 block 옵션 무시 |
| loading? | boolean | <code>false</code> | 버튼에 스피너를 표시하고 사용 불가 상태로 변경 |
| outline? | boolean | <code>false</code> | 배경색을 제거하고 외곽선을 표시 (gray only) |
| tag? | string | <code>a</code> | 버튼 태그 설정 |
| dropMenuToggle? | boolean | <code>false</code> | 드롭메뉴에서 전달된 toggle 상태를 기반으로 icon의 transition 활성화 |

---

# 3. Types
## 3.1. BtnColors
```javascript
export const btnColors = {
  primary: 'primary',
  success: 'success',
  info: 'info',
  warning: 'warning',
  danger: 'danger',
  secondary: 'secondary',
  dark: 'dark',
} as const

export type BtnColors = typeof btnColors[keyof typeof btnColors]
```

:arrow_up: [항목](#항목)

---

:arrow_left: [컴포넌트 목록으로이동](https://github.com/dream-insight/ts-vue3/components)

--

### UPDATE HISTORY

* 최초 작성: 2023.04.20 김종윤 수석매니저
* disabled props 추가: 2023.04.25 김종윤 수석매니저
* outline type 추가: 2023.04.28 김종윤 수석매니저
* outline type 디자인 적용 방식 변경 및 light color type 제거, text 옵션에 대한 구현 방식 변경: 2023.05.11 김종윤 수석매니저
* x-small, large props 추가: 2023.05.22 김종윤 수석매니저
