<script setup lang="ts">
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const components = [
    {
      name: 'Badge',
      path: '/components/badge',
      description: '알림, 상태, 카운터를 표시하는 뱃지 컴포넌트',
      color: 'primary',
      icon: 'mdi:badge-account',
    },
    {
      name: 'DropMenu',
      path: '/components/dropmenu',
      description: '드롭다운 메뉴 컴포넌트',
      color: 'secondary',
      icon: 'mdi:menu-down',
    },
    {
      name: 'Form Components',
      path: '/components/form',
      description: '폼 관련 컴포넌트들',
      color: 'info',
      icon: 'mdi:form-select',
    },
    {
      name: 'Icon',
      path: '/components/icon',
      description: '아이콘 컴포넌트',
      color: 'success',
      icon: 'mdi:emoticon',
    },
    {
      name: 'ListTable',
      path: '/components/listtable',
      description: '리스트 테이블 컴포넌트',
      color: 'warning',
      icon: 'mdi:table',
    },
    {
      name: 'MessageBox',
      path: '/components/messagebox',
      description: '메시지 박스 컴포넌트',
      color: 'danger',
      icon: 'mdi:message-text',
    },
    {
      name: 'Modal',
      path: '/components/modal',
      description: '모달 다이얼로그 컴포넌트',
      color: 'primary',
      icon: 'mdi:window-maximize',
    },
    {
      name: 'Pagination',
      path: '/components/pagination',
      description: '페이지네이션 컴포넌트',
      color: 'secondary',
      icon: 'mdi:page-layout-body',
    },
    {
      name: 'Spinner',
      path: '/components/spinner',
      description: '로딩 스피너 컴포넌트',
      color: 'info',
      icon: 'mdi:loading',
    },
    {
      name: 'StatusSelector',
      path: '/components/statusselector',
      description: '상태 선택 컴포넌트',
      color: 'success',
      icon: 'mdi:checkbox-multiple-marked',
    },
    {
      name: 'buttons',
      path: '/components/buttons',
      description: '스타일된 버튼 컴포넌트',
      color: 'warning',
      icon: 'mdi:button-cursor',
    },
    {
      name: 'Tabs',
      path: '/components/tabs',
      description: '탭 컴포넌트',
      color: 'danger',
      icon: 'mdi:tab',
    },
    {
      name: 'Toast',
      path: '/components/toast',
      description: '토스트 알림 컴포넌트',
      color: 'primary',
      icon: 'mdi:toast',
    },
    {
      name: 'Tooltip',
      path: '/components/tooltip',
      description: '툴팁 컴포넌트',
      color: 'secondary',
      icon: 'mdi:tooltip-text',
    },
  ];

  const formComponents = [
    {
      name: 'CheckButton',
      path: '/components/form/checkbutton',
      description: '체크 버튼 컴포넌트',
      color: 'info',
      icon: 'mdi:checkbox-marked',
    },
    {
      name: 'DatePicker',
      path: '/components/form/datepicker',
      description: '날짜 선택 컴포넌트',
      color: 'success',
      icon: 'mdi:calendar',
    },
    {
      name: 'NumberFormat',
      path: '/components/form/numberformat',
      description: '숫자 포맷 컴포넌트',
      color: 'warning',
      icon: 'mdi:format-list-numbered',
    },
    {
      name: 'SelectBox',
      path: '/components/form/selectbox',
      description: '선택 박스 컴포넌트',
      color: 'danger',
      icon: 'mdi:format-list-bulleted',
    },
    {
      name: 'SwitchButton',
      path: '/components/form/switchbutton',
      description: '스위치 버튼 컴포넌트',
      color: 'primary',
      icon: 'mdi:toggle-switch',
    },
    {
      name: 'TextField',
      path: '/components/form/textfield',
      description: '텍스트 필드 컴포넌트',
      color: 'secondary',
      icon: 'mdi:text-box',
    },
    {
      name: 'ValidateForm',
      path: '/components/form/validateform',
      description: '폼 검증 컴포넌트',
      color: 'info',
      icon: 'mdi:form-validation',
    },
    {
      name: 'ValidateWrap',
      path: '/components/form/validatewrap',
      description: '검증 래퍼 컴포넌트',
      color: 'success',
      icon: 'mdi:shield-check',
    },
  ];

  const navigateTo = (path: string) => {
    router.push(path);
  };
</script>

<template>
  <div class="components-page">
    <header class="page-header">
      <div class="container">
        <h1>Vue Components Library</h1>
        <p>사용 가능한 모든 컴포넌트들을 확인하고 테스트해보세요</p>
      </div>
    </header>

    <main class="page-content">
      <div class="container">
        <!-- 기본 컴포넌트 섹션 -->
        <section class="components-section">
          <h2>기본 컴포넌트</h2>
          <div class="components-grid">
            <div
              v-for="component in components"
              :key="component.name"
              class="component-card"
              @click="navigateTo(component.path)"
            >
              <div class="component-icon">
                <Icon :icon="component.icon" width="32" height="32" />
              </div>
              <div class="component-info">
                <h3>{{ component.name }}</h3>
                <p>{{ component.description }}</p>
              </div>
              <StyledButton
                :color="component.color"
                :href="component.path"
                small
                outline
                class="navigate-btn"
              >
                보기
              </StyledButton>
            </div>
          </div>
        </section>

        <!-- 폼 컴포넌트 섹션 -->
        <section class="components-section">
          <h2>폼 컴포넌트</h2>
          <div class="components-grid">
            <div
              v-for="component in formComponents"
              :key="component.name"
              class="component-card"
              @click="navigateTo(component.path)"
            >
              <div class="component-icon">
                <Icon :icon="component.icon" width="32" height="32" />
              </div>
              <div class="component-info">
                <h3>{{ component.name }}</h3>
                <p>{{ component.description }}</p>
              </div>
              <StyledButton
                :color="component.color"
                :href="component.path"
                small
                outline
                class="navigate-btn"
              >
                보기
              </StyledButton>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
  .components-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .page-header {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 3rem 0;
    text-align: center;
    color: white;

    h1 {
      margin: 0 0 1rem 0;
      font-size: 3rem;
      font-weight: 700;
    }

    p {
      margin: 0;
      font-size: 1.2rem;
      opacity: 0.9;
    }
  }

  .page-content {
    padding: 3rem 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .components-section {
    margin-bottom: 4rem;

    h2 {
      color: white;
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 2rem;
      text-align: center;
    }
  }

  .components-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .component-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 1rem;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    .component-icon {
      flex-shrink: 0;
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .component-info {
      flex: 1;

      h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.2rem;
        font-weight: 600;
        color: #333;
      }

      p {
        margin: 0;
        font-size: 0.9rem;
        color: #666;
        line-height: 1.4;
      }
    }

    .navigate-btn {
      flex-shrink: 0;
    }
  }

  @media (max-width: 768px) {
    .components-grid {
      grid-template-columns: 1fr;
    }

    .component-card {
      flex-direction: column;
      text-align: center;

      .component-icon {
        margin-bottom: 1rem;
      }
    }

    .page-header h1 {
      font-size: 2rem;
    }
  }
</style>
