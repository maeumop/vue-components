# ValidateForm

Vue 3 + TypeScript로 개발된 폼 유효성 검사 컨테이너 컴포넌트입니다. 하위 컴포넌트들의 유효성 검사를 중앙에서 관리하고, 전체 폼의 검증 상태를 제어할 수 있습니다.

## 주요 기능

- **중앙 집중식 관리**: 모든 하위 컴포넌트의 유효성 검사를 한 번에 처리
- **자동 컴포넌트 등록**: `useAddFormValidate()` 헬퍼를 통한 자동 등록
- **스마트 스크롤**: 검증 실패 시 첫 번째 에러 요소로 자동 스크롤
- **폼 보호 기능**: 중복 제출 방지 및 시각적 피드백 제공
- **TypeScript 지원**: 완전한 타입 안전성 보장

## 기본 사용법

```vue
<template>
  <ValidateForm ref="validateFormRef">
    <TextField v-model="email" :validate="[requiredRule, emailRule]" label="이메일" required />
    <TextField
      v-model="password"
      type="password"
      :validate="[requiredRule, minLengthRule(8)]"
      label="비밀번호"
      required
    />
  </ValidateForm>

  <button @click="validateForm">검증</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ValidateForm from './index.vue';
import TextField from '../TextField/index.vue';
import type { RuleFunc } from '../../types';

const email = ref('');
const password = ref('');
const validateFormRef = ref();

const requiredRule: RuleFunc = (value: unknown): boolean | string => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return '필수 입력 항목입니다.';
  }
  return true;
};

const emailRule: RuleFunc = (value: unknown): boolean | string => {
  if (typeof value === 'string' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return '올바른 이메일 형식이 아닙니다.';
    }
  }
  return true;
};

const minLengthRule = (min: number): RuleFunc => {
  return (value: unknown): boolean | string => {
    if (typeof value === 'string' && value.length < min) {
      return `최소 ${min}자 이상 입력해주세요.`;
    }
    return true;
  };
};

const validateForm = (): void => {
  const isValid = validateFormRef.value?.validate();

  if (isValid) {
    console.log('검증 성공!');
  } else {
    console.log('검증 실패!');
  }
};
</script>
```

## Props

ValidateForm은 현재 Props를 받지 않습니다. 모든 설정은 메서드를 통해 제어됩니다.

## Events

ValidateForm은 현재 Events를 발생시키지 않습니다. 상태 관리는 ref를 통한 메서드 호출로 처리됩니다.

## Slots

### default

폼 내부에 배치할 컴포넌트들을 포함합니다.

```vue
<ValidateForm>
  <!-- 폼 컴포넌트들 -->
  <TextField v-model="email" label="이메일" />
  <SelectBox v-model="department" :options="options" label="부서" />
</ValidateForm>
```

## 메서드

### validate(): boolean

전체 폼의 유효성을 검사합니다.

**반환값:**

- `true`: 모든 검증을 통과한 경우
- `false`: 하나라도 검증에 실패한 경우

**동작:**

1. 등록된 모든 컴포넌트의 유효성 검사 실행
2. 첫 번째 에러가 발생한 요소로 자동 스크롤
3. 검증 결과 반환

```typescript
const isValid = validateFormRef.value?.validate();
```

### resetForm(): void

폼의 모든 데이터와 검증 상태를 초기화합니다.

```typescript
validateFormRef.value?.resetForm();
```

### resetValidate(): void

검증 상태만 초기화하고 데이터는 유지합니다.

```typescript
validateFormRef.value?.resetValidate();
```

### formProtection(protected: boolean): void

폼 보호 기능을 활성화/비활성화합니다.

**매개변수:**

- `protected`: 보호 상태 (true: 보호 활성화, false: 보호 비활성화)

**동작:**

- 보호 활성화 시: 모든 입력 필드 비활성화, 시각적 피드백 제공
- 보호 비활성화 시: 모든 입력 필드 활성화

```typescript
// 폼 보호 활성화
validateFormRef.value?.formProtection(true);

// 폼 보호 비활성화
validateFormRef.value?.formProtection(false);
```

## 하위 컴포넌트 등록

ValidateForm은 `useAddFormValidate()` 헬퍼를 통해 하위 컴포넌트가 자동으로 등록됩니다. 하위 컴포넌트에서는 다음과 같이 사용합니다:

```vue
<script setup lang="ts">
import { useAddFormValidate } from '@/components/Form/common';

// setup 최상단에서 호출
useAddFormValidate();
</script>
```

## 지원하는 컴포넌트

ValidateForm은 다음 Form 컴포넌트들과 호환됩니다:

- **TextField**: 텍스트 입력 필드
- **SelectBox**: 선택 박스
- **NumberFormat**: 숫자 포맷팅 입력 필드
- **SwitchButton**: 스위치 버튼
- **DatePicker**: 날짜 선택기
- **ValidateWrap**: 커스텀 검증 래퍼

## 고급 사용 예제

### 커스텀 검증 규칙

```typescript
// 비밀번호 확인 검증
const confirmPasswordRule: RuleFunc = (value: unknown): boolean | string => {
  if (typeof value === 'string' && value !== password.value) {
    return '비밀번호가 일치하지 않습니다.';
  }
  return true;
};

// 숫자 범위 검증
const numberRangeRule = (min: number, max: number): RuleFunc => {
  return (value: unknown): boolean | string => {
    if (typeof value === 'string' && value) {
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < min || numValue > max) {
        return `${min}-${max} 사이의 숫자를 입력해주세요.`;
      }
    }
    return true;
  };
};
```

### 폼 보호 기능 활용

```vue
<template>
  <ValidateForm ref="validateFormRef">
    <!-- 폼 컴포넌트들 -->
  </ValidateForm>

  <button @click="submitForm" :disabled="isSubmitting">
    {{ isSubmitting ? '제출 중...' : '제출' }}
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isSubmitting = ref(false);
const validateFormRef = ref();

const submitForm = async (): Promise<void> => {
  const isValid = validateFormRef.value?.validate();

  if (!isValid) {
    return;
  }

  isSubmitting.value = true;
  validateFormRef.value?.formProtection(true);

  try {
    // API 호출
    await submitData();
    alert('제출 성공!');
  } catch (error) {
    console.error('제출 실패:', error);
  } finally {
    isSubmitting.value = false;
    validateFormRef.value?.formProtection(false);
  }
};
</script>
```

### ValidateWrap과 함께 사용

```vue
<template>
  <ValidateForm ref="validateFormRef">
    <ValidateWrap :check-value="customValue" :error-message="customError" label="커스텀 검증">
      <template #default="{ onBlur }">
        <input v-model="customValue" type="text" @blur="onBlur" />
      </template>
    </ValidateWrap>
  </ValidateForm>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const customValue = ref('');
const customError = ref('');

// 커스텀 에러 설정
const setCustomError = (): void => {
  customError.value = '사용자 정의 에러 메시지입니다.';
};
</script>
```

## 주의사항

1. **하위 컴포넌트 등록**: 모든 하위 컴포넌트는 `useAddFormValidate()`를 setup 최상단에서 호출해야 합니다.

2. **ref 사용**: ValidateForm의 메서드를 호출하려면 ref를 통해 접근해야 합니다.

3. **검증 규칙**: 검증 규칙은 `RuleFunc` 타입을 따라야 하며, `true` 또는 에러 메시지 문자열을 반환해야 합니다.

4. **폼 보호**: 폼 보호 기능 사용 시 모든 입력 필드가 비활성화되므로, 적절한 시점에 해제해야 합니다.

## 타입 정의

```typescript
// ValidateForm 인스턴스 타입
interface ValidateFormInstance {
  validate(): boolean;
  resetForm(): void;
  resetValidate(): void;
  formProtection(protected: boolean): void;
}

// 검증 규칙 함수 타입
type RuleFunc = (value: unknown) => boolean | string;
```

## 브라우저 지원

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 라이센스

MIT License
