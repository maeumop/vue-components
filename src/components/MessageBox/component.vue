<script setup lang="ts">
  /* eslint-disable vue/no-v-html */
  import { mdiGoogleCirclesExtended } from '@/assets/svg/iconPath';
  import SvgIcon from '@/components/Icon/SvgIcon.vue';
  import { onUnmounted, ref, shallowRef } from 'vue';
  import type { MessageBoxExpose, MessageBoxOptions } from './types';

  const props = withDefaults(defineProps<MessageBoxOptions>(), {
    width: '320px',
    btnOkayText: '확인',
    btnCancelText: '취소',
    escCancel: true,
    enterOkay: true,
  });

  let isShow = ref<boolean>(true);
  let msgBoxBg = shallowRef<HTMLDivElement>();
  let spinnerShow = ref<boolean>(false);

  const keyupEvent = (evt: KeyboardEvent): void => {
    // Enter 키를 눌렀을 때 okay 실행
    if (evt.key === 'Enter') {
      if (props.enterOkay) {
        typeof props.asyncOkay === 'function' ? asyncClickOkay() : clickOkay();
      }
    }

    // ESC 키를 눌렀을때 창을 닫아 줌(cancel과 동일)
    if (evt.key === 'Escape') {
      if (props.escCancel) {
        clickCancel();
      }
    }
  };

  const hide = (): void => {
    let box: NodeList = document.body.querySelectorAll('.msg-box-bg');

    if (box.length === 1) {
      document.body.classList.remove('hide-scroll');
    }

    isShow.value = false;
  };

  /**
   * 이벤트 주입
   */
  const setEvents = (): void => {
    document.body.classList.add('hide-scroll');
    document.addEventListener('keyup', keyupEvent);
    msgBoxBg.value?.focus();
  };

  const close = async () => {
    if (props.destroy instanceof Function) {
      document.removeEventListener('keyup', keyupEvent);
      await props.destroy();
    }
  };

  const clickOkay = (): void => {
    if (props.okay instanceof Function) {
      props.okay();
    }

    hide();
  };

  const asyncClickOkay = async (): Promise<void> => {
    if (spinnerShow.value) {
      return;
    }

    spinnerShow.value = true;

    if (props.asyncOkay instanceof Function) {
      await props.asyncOkay();
    }

    hide();
  };

  const clickCancel = (): void => {
    if (!spinnerShow.value) {
      if (props.cancel instanceof Function) {
        props.cancel();
      }

      hide();
    }
  };

  onUnmounted(() => {
    // 언제나 정상 종료가 되는 것은 아니기에
    // 컴포넌트 unmount 시에도 이벤트 정리 해주세요!
    document.removeEventListener('keyup', keyupEvent);
  });

  defineExpose<MessageBoxExpose>({
    hide,
  });
</script>

<template>
  <Transition name="msg-box-fade">
    <div ref="msgBoxBg" class="msg-box-bg" tabindex="0" v-show="isShow">
      <Transition appear name="msg-box-scale" @after-enter="setEvents" @after-leave="close">
        <div class="msg-box" :style="{ width: props.width }" v-show="isShow">
          <h5 class="title">
            {{ title }}
          </h5>
          <div class="contents" v-html="message"></div>
          <div class="actions">
            <a
              href="#"
              class="btn-okay"
              @click.prevent="
                typeof props.asyncOkay === 'function' ? asyncClickOkay() : clickOkay()
              "
            >
              <template v-if="spinnerShow">
                <SvgIcon class="loading" type="mdi" :path="mdiGoogleCirclesExtended" />
              </template>
              <template v-else>
                {{ btnOkayText }}
              </template>
            </a>
            <a href="#" class="btn-cancel" @click.prevent="clickCancel" v-if="type === 'confirm'">
              {{ btnCancelText }}
            </a>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
  @import './style';
</style>
<style lang="scss">
  body.hide-scroll {
    overflow: hidden;
  }
</style>
<script lang="ts">
  export default { name: 'MessageBox' };
</script>
