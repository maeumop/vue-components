<script setup lang="ts">
  import { useRoute } from 'vue-router';

  const route = useRoute();
</script>

<template>
  <RouterView :key="route.fullPath" v-slot="{ Component }">
    <Transition appear name="page-fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style lang="scss">
  // 페이지 페이드 트랜지션
  .page-fade-enter-active,
  .page-fade-leave-active {
    transition: all 0.3s ease;
  }

  .page-fade-enter-from {
    opacity: 0;
    transform: translateY(20px);
  }

  .page-fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }

  .page-fade-enter-to,
  .page-fade-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
</style>
