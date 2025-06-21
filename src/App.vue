<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router'
  import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <div class="header-content">
          <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

          <div class="wrapper">
            <HelloWorld msg="Vue Components Project!" />

            <nav class="main-nav">
              <RouterLink to="/" class="nav-link">Home</RouterLink>
              <RouterLink to="/about" class="nav-link">About</RouterLink>
            </nav>
          </div>
        </div>
      </div>
    </header>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style lang="scss" scoped>
  .app-header {
    background: linear-gradient(135deg, $primary-color 0%, darken($primary-color, 15%) 100%);
    color: $white;
    padding: $spacing-lg 0;
    box-shadow: $shadow-md;

    .header-content {
      display: flex;
      align-items: center;
      gap: $spacing-xl;

      @media (max-width: $breakpoint-md) {
        flex-direction: column;
        text-align: center;
      }
    }

    .logo {
      display: block;
      transition: transform $transition-base;

      &:hover {
        transform: scale(1.05);
      }

      @media (max-width: $breakpoint-md) {
        margin-bottom: $spacing-md;
      }
    }

    .wrapper {
      flex: 1;

      @media (min-width: $breakpoint-lg) {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
      }
    }

    .main-nav {
      display: flex;
      gap: $spacing-md;
      margin-top: $spacing-md;

      @media (min-width: $breakpoint-lg) {
        margin-top: 0;
      }

      .nav-link {
        color: $white;
        text-decoration: none;
        padding: $spacing-sm $spacing-md;
        border-radius: $border-radius-base;
        transition: all $transition-fast;
        font-weight: 500;

        &:hover {
          background-color: rgba($white, 0.1);
          transform: translateY(-1px);
        }

        &.router-link-active {
          background-color: rgba($white, 0.2);
          font-weight: 600;
        }
      }
    }
  }

  .main-content {
    min-height: calc(100vh - 200px);
    padding: $spacing-xl 0;
  }
</style>
