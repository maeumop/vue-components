# Badge component

# 항목

1. [사용방법](#1-사용방법)
2. [Props](#2-props)
3. [types](#3-types)
4. [기타](#4-기타)

---

# 1. 사용방법
* 컴포넌트는 다른 Element를 wrapping 하여 사용합니다.
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

## 1.3. 전역 선언
```typescript
import Badge from '@/components/Badge'

app.component('Badge', Badge)
```

## 1.4. 예제 코드
```vue
<template>
  <div class="row">
    <div class="col px-5 text-center">
      <Badge color="warning" position="left" text="5">
        <Button block outline>뱃지 좌측 상단</Button>
      </Badge>
    </div>
    <div class="col px-5 text-center">
      <Badge text="5">
        <Button block outline>뱃지 우측 상단(기본)</Button>
      </Badge>
    </div>
    <div class="col px-5 text-center">
      <Badge color="info" position="bottom-left" text="5">
        <Button block outline>뱃지 좌측 하단</Button>
      </Badge>
    </div>
    <div class="col px-5 text-center">
      <Badge color="primary" position="bottom-right" text="5">
        <Button block outline>뱃지 우측 하단</Button>
      </Badge>
    </div>
  </div>
  <div class="row mt-15">
    <div class="col px-5 text-center">
      <Badge large color="warning" position="left" text="5">
        <Button block outline>큰 뱃지 좌측 상단</Button>
      </Badge>
    </div>
    <div class="col px-5 text-center">
      <Badge large text="5">
        <Button block outline>큰 뱃지 우측 상단(기본)</Button>
      </Badge>
    </div>
    <div class="col px-5 text-center">
      <Badge large :icon="mdiBellAlertOutline" color="info" position="bottom-left">
        <Button block outline>큰 뱃지 아이콘 좌측 하단</Button>
      </Badge>
    </div>
    <div class="col px-5 text-center">
      <Badge large :icon="mdiBellAlertOutline" color="primary" position="bottom-right">
        <Button block outline>큰 뱃지 아이콘 우측 하단</Button>
      </Badge>
    </div>
  </div>
</template>
```

:arrow_up: [항목](#항목)

---

# 2. Props
| Name | Type | Default | Description |
|-------|---- |---------|-------------|
| text? | string | <code>none</code> | 뱃지 안쪽에 텍스트 표시 |
| color? | [BadgeColors](#31-badgecolors-with-enum) | <code>right</code> | 뱃지가 표시될 위치 |
| position? | [BadgePosition](#32-badgeposition-with-enum) | <code>right</code> | 뱃지가 표시될 위치 |
| large? | boolean | <code>false</code> | 큰 사이즈의 뱃지 표시 |
| icon? | SvgIcon(alias SVGElement) | <code>none</code> | 뱃지 안쪽에 아이콘 표시 |


---

# 3. Types
## 3.1. BadgeColors with Enum
```typescript
export const badgeColors = {
  primary: 'primary',
  success: 'success',
  info: 'info',
  warning: 'warning',
  danger: 'danger',
  secondary: 'secondary',
  dark: 'dark',
} as const

export type BadgeColors = typeof badgeColors[keyof typeof badgeColors]
```

## 3.2. BadgePosition with Enum
```typescript
export const badgePosition = {
  right: 'right',
  left: 'left',
  bottomLeft: 'bottom-left',
  bottomRight: 'bottom-right',
} as const

export type BadgePosition = typeof badgePosition[keyof typeof badgePosition]
```

:arrow_up: [항목](#항목)

---

# 4. 기타

## 4.1. SvgIcon Typescript 오류

* 해당 오류는 아래 코드를 *.d.ts(파일 생성) 또는 프로젝트 생성시 생기는 shims-vue.d.ts에 삽입하여 해결 가능합니다.

```typescript
declare let SvgIcon: import("vue").DefineComponent<{
  type: {
    type: StringConstructor
    default: string
  }
  path: {
    type: StringConstructor
    default: string
  }
  size: {
    type: NumberConstructor
    optional: boolean
  }
  viewbox: {
    type: StringConstructor
    optional: boolean
  }
  flip: {
    type: StringConstructor
    optional: boolean
  }
  rotate: {
    type: StringConstructor
    optional: boolean
  }
}>

declare module "@/components/Icon/SvgIcon.vue" {
  export default SvgIcon
}
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
