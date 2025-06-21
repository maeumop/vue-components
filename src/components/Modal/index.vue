<script setup lang="ts">
  import { mdiWindowClose } from '@/assets/svg/iconPath';
  import { computed, onBeforeUnmount, ref, useSlots, watchEffect } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import { modalPosition, modalTransition } from './const';
  import type { ModalProps, ModalTransition } from './types';

  const slots = useSlots();

  const props = withDefaults(defineProps<ModalProps>(), {
    modelValue: false,
    escClose: false,
    position: modalPosition.popup,
    screenCover: false,
    width: '320px',
  });

  const emit = defineEmits<{
    (event: 'update:modelValue', value: boolean): void;
  }>();

  let isShow = ref<boolean>(false);
  let keyEventStyle = ref<string>('');

  // 창이 닫히기 전에 다른 팝업 창이 있는지 검수
  let modalBg: NodeListOf<HTMLDivElement>;

  const modal = ref<HTMLDivElement>();

  const transitionName = computed<ModalTransition>(() => modalTransition[props.position]);
  const boxStyle = computed<string[]>(() => {
    let cover: string = '';

    if (props.position !== 'popup' && props.screenCover) {
      cover = 'screen-cover';
    }

    return ['modal-box', keyEventStyle.value, props.position, cover];
  });

  /**
   * 모달 창 닫기
   */
  const close = (callback: (() => void) | null = null): void => {
    if (callback instanceof Function) {
      callback();
    }

    // 창이 제거되기 전이기 때문에 팝업의 수는 기본 1
    if (modalBg.length === 1) {
      document.body.classList.remove('no-scroll');
    }

    isShow.value = false;
  };

  const dispose = (): void => {
    modal.value?.removeEventListener('keydown', keyDownEvent);
    modal.value?.removeEventListener('keyup', keyUpEvent);

    emit('update:modelValue', false);
  };

  /**
   * ESC 키로 닫기 처리
   * @param event
   */
  const keyDownEvent = (event: KeyboardEvent): void => {
    if (event.key.toLowerCase() === 'escape') {
      if (props.escClose) {
        // close();
      } else {
        keyEventStyle.value = 'big';
      }
    }
  };

  const keyUpEvent = (event: KeyboardEvent): void => {
    if (event.key.toLowerCase() === 'escape') {
      if (!props.escClose) {
        keyEventStyle.value = '';
      }
    }
  };

  /**
   * 이벤트 주입
   */
  const setEvents = (): void => {
    modalBg = document.body.querySelectorAll<HTMLDivElement>('.modal-bg:not(.hide)');

    modal.value?.addEventListener('keydown', keyDownEvent);
    modal.value?.addEventListener('keyup', keyUpEvent);
    modal.value?.focus();
  };

  if (props.accessBack) {
    onBeforeRouteLeave(() => {
      if (isShow.value) {
        return false;
      }

      return true;
    });
  }

  watchEffect(() => {
    if (props.modelValue) {
      // modal open
      isShow.value = props.modelValue;
    }
  });

  watchEffect(
    () => {
      if (props.modelValue) {
        // modal open
        document.body.classList.add('no-scroll');
      } else {
        // modal close
        modalBg && close();
      }
    },
    { flush: 'post' },
  );

  onBeforeUnmount(() => {
    modal.value?.removeEventListener('keydown', keyDownEvent);
    modal.value?.removeEventListener('keyup', keyUpEvent);
  });

  defineExpose({
    close,
  });
</script>

<template>
  <Teleport to="body">
    <Transition appear name="modal-fade" @after-leave="dispose" @after-enter="setEvents">
      <div
        ref="modal"
        tabindex="0"
        :class="['modal-bg', !isShow && 'hide']"
        v-bind="$attrs"
        v-show="isShow"
      >
        <Transition appear :name="transitionName">
          <div
            :style="{ width: props.width, maxWidth: props.width }"
            :class="boxStyle"
            v-if="isShow"
          >
            <div :class="[!slots.header && 'modal-header']">
              <template v-if="slots.header">
                <slot name="header" :close="close"></slot>
              </template>
              <template v-else>
                <div class="title-text">
                  <span class="text">{{ props.title }}</span>
                  <slot name="title"></slot>
                </div>

                <SvgIcon
                  type="mdi"
                  size="22"
                  class="close"
                  :path="mdiWindowClose"
                  @click.prevent="close()"
                  v-if="!props.hideClose"
                />
              </template>
            </div>
            <div class="modal-body">
              <slot name="body" :close="close"></slot>
            </div>
            <div class="modal-action" v-if="slots.action">
              <slot name="action" :close="close"></slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
  @import './style';
</style>
<style lang="scss">
  .no-scroll {
    overflow: hidden;

    /// @deprecated @/views/editor/index.vue 해당 페이지가 없으므로 삭제 예정.
    .scroll {
      /* @/views/editor/index.vue 에서 'scroll' 핸들링을 하고 있습니다. */
      overflow: hidden !important;
    }
  }
</style>
<script lang="ts">
  export default { name: 'Modal' };
</script>
