<script setup lang="ts">
  import { Icon } from '@iconify/vue';
  import { computed, onBeforeUnmount, ref, watch } from 'vue';
  import { SPINNER_THEME_CLASSES } from './const';
  import type { SpinnerColors, SpinnerExpose, SpinnerProps, SpinnerTheme } from './types';

  const props = withDefaults(defineProps<SpinnerProps>(), {
    limitTime: 10,
    theme: 'default',
    colors: () => ({
      icon: 'var(--spinner-icon-color)',
      text: 'var(--spinner-text-color)',
      background: 'var(--spinner-background-color)',
      backdrop: 'var(--spinner-backdrop-color)',
    }),
  });

  // 반응형 상태 관리
  const timeout = ref<number>(0);
  const delay = ref<number>(0.5);
  const progress = ref<number>(0);
  const isShow = ref<boolean>(false);
  const message = ref<string>('Loading...');
  const currentTheme = ref<SpinnerTheme>(props.theme);
  const currentColors = ref<SpinnerColors>(props.colors);

  // 현재 테마 클래스 계산
  const themeClass = computed(() => {
    return SPINNER_THEME_CLASSES[currentTheme.value];
  });

  // 커스텀 색상이 있는 경우 인라인 스타일 계산
  const customStyle = computed(() => {
    // 기본 테마가 아닌 경우에만 커스텀 색상 적용
    if (
      currentColors.value.icon !== 'var(--spinner-icon-color)' ||
      currentColors.value.text !== 'var(--spinner-text-color)' ||
      currentColors.value.background !== 'var(--spinner-background-color)' ||
      currentColors.value.backdrop !== 'var(--spinner-backdrop-color)'
    ) {
      return {
        '--spinner-icon-color': currentColors.value.icon,
        '--spinner-text-color': currentColors.value.text,
        '--spinner-background-color': currentColors.value.background,
        '--spinner-backdrop-color': currentColors.value.backdrop,
      };
    }
    return {};
  });

  // 컴포넌트 정리
  const destroy = (): void => {
    props.destroy();
  };

  // 지연 함수
  const waiting = (): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, delay.value * 1000);
    });
  };

  // 진행 상태 관리
  const setProgress = async (flag: 'increment' | 'decrement'): Promise<void> => {
    if (flag === 'increment') {
      progress.value++;
    } else {
      progress.value--;
    }

    await waiting();

    if (progress.value > 0) {
      isShow.value = true;

      // 기존 타임아웃 정리
      clearTimeout(timeout.value);

      // 새로운 타임아웃 설정
      timeout.value = setTimeout(() => {
        progress.value = 0;
        isShow.value = false;
      }, props.limitTime * 1000);
    } else {
      progress.value = 0;
      isShow.value = false;
    }
  };

  // 스피너 표시
  const show = (msg: string = ''): void => {
    if (msg) {
      message.value = msg;
    }

    setProgress('increment');
  };

  // 스피너 숨김
  const hide = (): void => {
    setProgress('decrement');
  };

  // 스피너 즉시 닫기
  const close = (): void => {
    clearTimeout(timeout.value);
    progress.value = 0;
    isShow.value = false;
  };

  // 테마 설정
  const setTheme = (theme: SpinnerTheme): void => {
    currentTheme.value = theme;
    // 테마 변경 시 기본 CSS 변수로 리셋
    currentColors.value = {
      icon: 'var(--spinner-icon-color)',
      text: 'var(--spinner-text-color)',
      background: 'var(--spinner-background-color)',
      backdrop: 'var(--spinner-backdrop-color)',
    };
  };

  // 색상 커스터마이징
  const setColors = (colors: SpinnerColors): void => {
    currentColors.value = { ...currentColors.value, ...colors };
  };

  // props 변경 감지
  watch(
    () => props.theme,
    newTheme => {
      if (newTheme) {
        setTheme(newTheme);
      }
    },
  );

  watch(
    () => props.colors,
    newColors => {
      if (newColors) {
        setColors(newColors);
      }
    },
  );

  // 컴포넌트 언마운트 시 정리
  onBeforeUnmount(() => {
    clearTimeout(timeout.value);
  });

  // 외부 노출 메서드
  defineExpose<SpinnerExpose>({
    show,
    hide,
    close,
    delay,
    setTheme,
    setColors,
  });
</script>

<template>
  <Teleport to="body">
    <Transition appear name="fade" @after-leave="destroy">
      <div class="spinner-overlay" :class="themeClass" v-show="isShow" :style="customStyle">
        <Transition appear name="scale">
          <div class="spinner-container" v-show="isShow">
            <Icon icon="svg-spinners:ring-resize" class="spinner-icon" width="100" height="100" />
            <p class="spinner-text">{{ message }}</p>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
  @use './style';
</style>
