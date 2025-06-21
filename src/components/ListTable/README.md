# ListTable component

## 항목

1. [사용방법](#1-사용방법)
2. [Props](#2-prop)
3. [Event](#3-event)
4. [Slots](#4-slots)
5. [Types](#5-types)

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
// main.js
import ListTable from '@/components/ListTable'

Vue.component('ListTable', ListTable)
```

## 1.5. 예제 코드
```vue
<script setup lang="ts">
import type { ListTableHeader } from '@/components/ListTable/types'

interface ListTableItem {
  no: number
  name: string
  tel: string
  date: string
}

const list: ListTableItem[] = [
  { no: 1, name: '홍길동', tel: '01022223333', date: '2022-11-11' },
  { no: 2, name: '심청이', tel: '01022223333', date: '2022-11-11' },
  { no: 3, name: '임꺽정', tel: '01022223333', date: '2022-11-11' },
  { no: 4, name: '이순신', tel: '01022223333', date: '2022-11-11' },
]

const tableHeader: ListTableHeader[] = [
  { text: 'No.', width: '80' },
  { text: '이름', width: '' },
  { text: '전화번호', width: '' },
  { text: '등록일', width: '' },
]
</script>

<template>
  <div class="wrap">
    <TableList :header="tableHeader" :items="list">
      <template v-slot:items="{ props, index }">
        <tr>
          <td>{{ props.no }}</td>
          <td>{{ props.name }}</td>
          <td>{{ props.tel }}</td>
          <td>{{ props.date }}</td>
        </tr>
      </template>
    </TableList>
  </div>
</template>
```

:arrow_up: [항목](#항목)

---

# 2. Prop
| Name | Type | Default | Description |
|-------|---- |---------|-------------|
| items | [(T = ListTableItem)[]](#67-listtableitem) | <code>[]</code> | 출력할 목록 배열 |
| header | [ListTableHeader[]](#65-listtableheader) | <code>[]</code> | 테이블 최상단 컬럼 제목, 2차원배열로 지정할 경우 컬럼 제목을 2줄로 표시 |
| footer? | [ListTableFooter[]](#66-listtablefooter) | <code>[]</code> | 출력할 목록 배열 |
| emptyText? | string | <code>'데이터가 없습니다.'</code> | 목록이 없을 경우 표시되는 텍스트 |
| checkMode? | [ListTableListCheckType](#63-listtablelistchecktype) | <code>undefined</code> | 체크 버튼 사용 여부와 동시에 타입 설정 |
| width? | string | <code>undefined</code> | 테이블의 넓이를 고정하여 가로 스크롤이 생성 |
| height? | string | <code>undefined</code> | 테이블의 높이를 지정하면 목록의 수량이 해당 높이를 초과 할때 새로 스크롤 생성 |
| observer? | boolean | <code>false</code> | 테이블 스크롤 감지를 통하여 스크롤 끝 부분 전에 <code>observe</code> 이벤트 발생 (height 옵션이 설정 되어 있는 경우만) |
| loading? | boolean | <code>false</code> | spinner를 표시 해준다. |
| disableFilter? | (item:T, index: number) => boolean | <code>undefined</code> | items의 disabled 여부 filter 함수 |
:arrow_up: [항목](#항목)

---

# 3. Event

## 3.1. Boolean checked
* checkAll 옵션이 있는 경우 테이블 컬럼 제목의 <code>checkbox</code>를 클릭하면 발생하는 이벤트
```vue
<script stup lang="ts">
const listCheck = (evt: boolean): void => {
  // todo
}
</script>

<template>
  <TableList check-all :header="tableHeader" :items="list" @checked="listCheck($event)">
    <template v-slot:items="{ props, index }">
      <tr>
        <td>
          <label class="checkbox-wrap">
            <input type="checkbox" name="checklist" :value="props.name" v-model="checkList" />
            <span class="material-icons"></span>
          </label>
        </td>
        <td>{{ props.name }}</td>
        <td>{{ props.genre }}</td>
        <td>{{ props.developer }}</td>
        <td class="right">{{ props.release_date }}</td>
     </tr>
    </template>
  </TableList>
</template>
```
> check-all 옵션 설정시 테이블 첫번째 컬럼에 체크 박스가 필요 합니다.<br>
위와 같이 디자인이 변경된 형태를 사용하지 않고 <code>\<input type="checkbox" /></code> 그대로 사용하여도 무방합니다.

## 3.2. [SortingChangeData](#44-sortingchangedata) sort-change
> table head 부분에 생성된 정렬 버튼을 클릭시 발생하는 이벤트

## 3.3. void observe
> 테이블 목록의 스크롤이 하단에 다다를때 쯤 발생하는 이벤트, 스크롤 감지 이벤트에서 사용

:arrow_up: [항목](#항목)

---

# 4. Slots

## 4.1. header

* thead 사이의 컬럼을 표시 합니다.

> 해당 슬롯을 사용할 경우 props.header는 무시됩니다. (header 옵션 전체 사용 불가)

## 4.2. items

* tbody 사이의 목록을 표시 합니다.

### 4.2.1. Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| props | [ListTableItem](#67-listtableitem) | <code>[]</code> | props.items 항목을 loop하며 표시되는 배열 항목 |
| index | number | <code></code> | props.items 항목 index |

## 4.3. empty

* tbody 사이의 목록이 없을 경우 표시 합니다.

## 4.4. footer

* tfoot 사이의 컴럼을 표시 합니다.


:arrow_up: [항목](#항목)

---

# 5. Methods

## 5.1. observerStart(): void
* 테이블 스크롤 이벤트를 감지하여 이벤트를 발생 시킨다 [observer](#33-void-observe)

## 5.2. observerStop(): void
* 테이블 스크롤 이벤트 감지 중단

## 5.3. checkedToggle(bool: boolean = false): void
* TableHeader checkbox의 checked 여부 결정 (checked event 발생)

:arrow_up: [항목](#항목)

---

# 6. Types

## 6.1. ListTableCellAlign
```ts
export type ListTableCellAlign = 'left' | 'center' | 'right';
```
## 6.2. ListTableFooterItemTag
```ts
export type ListTableFooterItemTag = 'td' | 'th';
```

## 6.3. ListTableListCheckType
```ts
export type ListTableListCheckType = 'checkbox' | 'radio';
```

## 6.4. ListTableListCheckIconKeys
```ts
export type ListTableListCheckIconKeys = 'disabled' | 'checked' | 'blank';
```

## 6.5. ListTableHeader
```typescript
export interface ListTableHeader {
  text: string
  width?: string
  align?: ListTableCellAlign
  colspan?: number
}
```
> header sorting 기능은 랜더링 문제로 인하여, 개선 완료 전까지 사용을 중지합니다.

## 6.6. ListTableFooter
```typescript
export interface ListTableFooter {
  colspan?: number
  align?: ListTableCellAlign

  tag?: ListTableFooterItemTag
  text: any
}
```

## 6.7. ListTableItem
```typescript
export interface ListTableItem<T = any> {
  [index: string]: T
}
```

## 6.8. ListTableModel (for Ref)
```typescript
export interface ListTableModel {
  observerStart: () => void
  observerStop: () => void
  
  checkedToggle: (bool?: boolean) => void
}
```

:arrow_up: [항목](#항목)

---

:arrow_left: [컴포넌트 목록으로이동](https://github.com/dream-insight/ts-vue3/components)

---

### UPDATE HISTORY

* empty slot 추가 및 gray-bg props 추가: 2023.05.19 김종윤 수석매니저
* multiHeader 옵션 제거, header slot 추가: 2023.05.23 김종윤 수석매니저
* ListTable 전용 checkbox component 추가, ListTableItemSlot type 추가: 2023.05.31 김종윤 수석매니저
* ListTable checkedToggle 메서드 추가: 2023.06.07 김종윤 수석매니저