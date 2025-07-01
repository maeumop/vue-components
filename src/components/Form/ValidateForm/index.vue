<script setup lang="ts">
import type { ComponentInternalInstance, ComputedRef, VNode } from 'vue';
import { Fragment, computed, h, ref, useSlots } from 'vue';
import { useAddFormValidate } from '../common';
import type { ValidatableComponent, ValidateExplorKeys } from './types';

const slots = useSlots();
const frm = ref<HTMLFormElement>();
const isCover = ref<boolean>(false);
const formValidItems = ref<VNode[]>([]);

// 유효성 검사 가능한 컴포넌트 타입

const RenderSlotItems: ComputedRef = computed(() =>
  h(Fragment, slots.default ? slots.default() : []),
);

const validate = (silence: boolean = false): boolean => {
  let isValid = true;
  const nodes: Node[] = [];
  console.log('formValidItems.value.length', formValidItems.value.length);
  // 역순 순회로 안전하게 제거
  for (let i = formValidItems.value.length - 1; i >= 0; i--) {
    const node = formValidItems.value[i];
    const instance = node.component as ComponentInternalInstance & {
      exposed?: ValidatableComponent;
    };

    if (!instance || instance.isUnmounted) {
      formValidItems.value.splice(i, 1);
      continue;
    }

    const check = instance.exposed?.check;
    if (typeof check === 'function') {
      const result = check(silence);

      if (!result) {
        if (instance.vnode.el) {
          nodes.push(instance.vnode.el as Node);
        }

        isValid = false;
      }
    }
  }

  if (!isValid) {
    targetFirstEl(nodes);
  }

  return isValid;
};

// 첫 번째 에러 요소로 스크롤
const targetFirstEl = (nodes: Node[] = []): void => {
  let result: HTMLElement | null = null;
  if (frm.value) {
    const treeWalker = document.createTreeWalker(frm.value, NodeFilter.SHOW_ELEMENT, {
      acceptNode: node =>
        nodes.includes(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP,
    });

    result = treeWalker.nextNode() as HTMLElement | null;
    result?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

const resetForm = (): void => {
  if (frm.value) {
    explore('resetForm');
  }
};

const resetValidate = (): void => {
  if (frm.value) {
    explore('resetValidate');
  }
};

const validateCheck = (instance: ComponentInternalInstance, flag: ValidateExplorKeys): void => {
  const { resetForm, resetValidate } = (instance.exposed as ValidatableComponent) ?? {};

  switch (flag) {
    case 'resetForm':
      if (typeof resetForm === 'function') {
        resetForm();

        if (typeof resetValidate === 'function') {
          resetValidate();
        }
      }

      break;
    case 'resetValidate':
      if (typeof resetValidate === 'function') {
        resetValidate();
      }
  }
};

const explore = (flag: ValidateExplorKeys): void => {
  for (let i = formValidItems.value.length - 1; i >= 0; i--) {
    const node = formValidItems.value[i];
    const instance = node.component;

    if (!instance || instance.isUnmounted) {
      formValidItems.value.splice(i, 1);
      continue;
    }
    validateCheck(instance, flag);
  }
};

const addComponent = (node: VNode): void => {
  console.log('addComponent', node);
  if (frm.value && node.component?.isMounted) {
    formValidItems.value.push(node);
  }
};

const formProtection = (protect: boolean = true): void => {
  isCover.value = protect;
};

useAddFormValidate();

defineExpose({
  formProtection,
  resetValidate,
  resetForm,
  validate,
  addComponent,
});
</script>

<template>
  <form ref="frm" :class="isCover ? 'validate-form' : ''" @submit.prevent>
    <RenderSlotItems />

    <div class="form-cover" v-if="isCover"></div>
  </form>
</template>

<script lang="ts">
export default { name: 'ValidateForm' };
</script>

<style scoped lang="scss">
.validate-form {
  position: relative;

  .form-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    background-color: rgba(#fff, 0.3);
  }
}
</style>
