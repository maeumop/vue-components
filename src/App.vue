<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 라우터 전환 방향을 추적
const transitionName = ref('page-fade-forward');
const routeHistory = ref<string[]>([]);

// 라우트 변경 감지 및 transition 적용
watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    if (oldPath) {
      // 현재 경로가 히스토리에 있는지 확인하여 방향 결정
      const isBackward = routeHistory.value.includes(newPath);

      if (isBackward) {
        // 뒤로 가기: 히스토리에서 해당 경로 제거
        transitionName.value = 'page-fade-backward';
        routeHistory.value = routeHistory.value.filter(path => path !== newPath);
      } else {
        // 앞으로 가기: 히스토리에 이전 경로 추가
        transitionName.value = 'page-fade-forward';
        routeHistory.value.push(oldPath);
      }
    }
  },
  { immediate: true },
);

// 브라우저 뒤로가기/앞으로가기 버튼 감지
router.beforeEach((_, __, next) => {
  // popstate 이벤트가 발생했는지 확인
  const isPopState = window.history.length < routeHistory.value.length + 1;

  if (isPopState) {
    // 뒤로 가기 시 히스토리에서 마지막 경로 제거
    routeHistory.value.pop();
  }

  next();
});

// popstate 이벤트 감지 (브라우저 뒤로가기/앞으로가기 버튼)
window.addEventListener('popstate', () => {
  // popstate 이벤트 발생 시 히스토리에서 마지막 경로 제거
  if (routeHistory.value.length > 0) {
    routeHistory.value.pop();
  }
});
</script>

<template>
  <RouterView :key="route.fullPath" v-slot="{ Component }">
    <Transition appear :name="transitionName" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>
