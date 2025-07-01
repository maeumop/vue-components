<script setup lang="ts">
import type { ValidateExplorKeys } from '@/components/Form/ValidateForm/types';
import type { ComponentInternalInstance, ComputedRef, VNode } from 'vue';
import { Fragment, computed, h, ref, useSlots } from 'vue';

const slots = useSlots();

const frm = ref<HTMLFormElement>();

const isCover = ref<boolean>(false);
const formValidItems = ref<VNode[]>([]);

let checkState: boolean;

const RenderSlotItems: ComputedRef = computed(() =>
  h(Fragment, slots.default ? slots.default() : []),
);

const validate = (silence: boolean = false): boolean => {
  checkState = true;

  const firstElArr: Node[] = [];
  const list: typeof formValidItems.value = [...formValidItems.value];

  for (let index = 0; index < list.length; index++) {
    const instance = list[index].component;

    if (!instance || instance.isUnmounted) {
      // Unmounted 된거 삭제
      formValidItems.value.splice(index, 1);
      continue;
    }

    const check = instance.exposed?.check;

    if (check && typeof check === 'function') {
      const result = check(silence);
      if (!result) {
        instance.vnode.el && firstElArr.push(instance.vnode.el as Node);
        checkState && (checkState = false);
      }
    }
  }

  if (!checkState) {
    targetFirstEl(firstElArr);
  }

  return checkState;
};

const targetFirstEl = (elList: Node[] = []): void => {
  let result: HTMLElement | null = null;
  if (frm.value) {
    const treeWalker = document.createTreeWalker(frm.value, NodeFilter.SHOW_ELEMENT, {
      acceptNode: function (node: Node) {
        return elList.includes(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      },
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
  const { resetForm, resetValidate } = instance.exposed ?? {};

  switch (flag) {
    case 'resetForm':
      {
        if (typeof resetForm === 'function') {
          console.log('validateCheck :>> ', flag, instance);
          resetForm();
          resetValidate();
        }
      }
      return;

    case 'resetValidate':
      {
        if (typeof resetValidate === 'function') {
          resetValidate();
        }
      }
      return;
  }
};

const explore = (flag: ValidateExplorKeys): void => {
  const list: typeof formValidItems.value = [...formValidItems.value];
  for (let index = 0; index < list.length; index++) {
    const instance = list[index].component;

    if (!instance || instance.isUnmounted) {
      // Unmounted 된거 삭제
      formValidItems.value.splice(index, 1);
      continue;
    }
    validateCheck(instance, flag);
  }
};

const addComponant = (node: VNode): void => {
  if (frm.value && node.component?.isMounted) {
    formValidItems.value.push(node);
  }
};

const formProtection = (protect: boolean = true): void => {
  isCover.value = protect;
};

defineExpose({
  formProtection,
  resetValidate,
  resetForm,
  validate,

  addComponant,
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
