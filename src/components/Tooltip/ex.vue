<script setup lang="ts">
import FloatingBackButton from '@/views/FloatingBackButton/index.vue';
import { ref } from 'vue';
import { tooltipColor, tooltipPosition } from './const';
import Tooltip from './index.vue';
import type { TooltipColor, TooltipPosition } from './types';

// 예제 데이터
const messageList = ref<string[]>([
  '첫 번째 도움말 메시지',
  '두 번째 도움말 메시지',
  '세 번째 도움말 메시지',
]);

// 상태 관리
const currentPosition = ref<TooltipPosition>(tooltipPosition.bottom);
const currentColor = ref<TooltipColor>(tooltipColor.default);
const isHovering = ref(true);
const isDark = ref(false);

// 위치 변경
const changePosition = (position: TooltipPosition) => {
  currentPosition.value = position;
};

// 색상 변경
const changeColor = (color: TooltipColor) => {
  currentColor.value = color;
};
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1>Tooltip Component Examples</h1>
        <p>Vue 3 + TypeScript로 개발된 유연하고 접근성 있는 툴팁 컴포넌트</p>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- 기본 사용법 -->
        <section class="example-section">
          <h2>기본 사용법</h2>
          <div class="example-grid">
            <div class="example-item">
              <Tooltip message="기본 툴팁 메시지입니다.">
                <button class="btn-primary">기본 버튼</button>
              </Tooltip>
              <span class="example-label">기본 툴팁</span>
            </div>
            <div class="example-item">
              <Tooltip message="제목이 있는 툴팁" title="도움말">
                <span class="text-link">도움말 링크</span>
              </Tooltip>
              <span class="example-label">제목 포함</span>
            </div>
            <div class="example-item">
              <Tooltip :message="messageList" title="목록 툴팁" :width="230">
                <div class="info-badge">목록 정보</div>
              </Tooltip>
              <span class="example-label">목록 형태</span>
            </div>
          </div>
        </section>

        <!-- 위치별 툴팁 -->
        <section class="example-section">
          <h2>위치별 툴팁</h2>
          <div class="example-grid">
            <div class="example-item">
              <Tooltip position="top" message="위쪽에 표시되는 툴팁">
                <button class="btn-secondary">Top 툴팁</button>
              </Tooltip>
              <span class="example-label">Top</span>
            </div>
            <div class="example-item">
              <Tooltip position="bottom" message="아래쪽에 표시되는 툴팁">
                <button class="btn-secondary">Bottom 툴팁</button>
              </Tooltip>
              <span class="example-label">Bottom</span>
            </div>
            <div class="example-item">
              <Tooltip position="left" message="왼쪽에 표시되는 툴팁">
                <button class="btn-secondary">Left 툴팁</button>
              </Tooltip>
              <span class="example-label">Left</span>
            </div>
            <div class="example-item">
              <Tooltip position="right" message="오른쪽에 표시되는 툴팁">
                <button class="btn-secondary">Right 툴팁</button>
              </Tooltip>
              <span class="example-label">Right</span>
            </div>
          </div>
        </section>

        <!-- 색상 테마 -->
        <section class="example-section">
          <h2>색상 테마</h2>
          <div class="example-grid">
            <div class="example-item">
              <Tooltip :color="tooltipColor.default" message="기본 테마">
                <div class="color-badge default">Default</div>
              </Tooltip>
              <span class="example-label">Default</span>
            </div>
            <div class="example-item">
              <Tooltip :color="tooltipColor.primary" message="주요 액션">
                <div class="color-badge primary">Primary</div>
              </Tooltip>
              <span class="example-label">Primary</span>
            </div>
            <div class="example-item">
              <Tooltip :color="tooltipColor.secondary" message="보조 액션">
                <div class="color-badge secondary">Secondary</div>
              </Tooltip>
              <span class="example-label">Secondary</span>
            </div>
            <div class="example-item">
              <Tooltip :color="tooltipColor.success" message="성공 메시지">
                <div class="color-badge success">Success</div>
              </Tooltip>
              <span class="example-label">Success</span>
            </div>
            <div class="example-item">
              <Tooltip :color="tooltipColor.warning" message="경고 메시지">
                <div class="color-badge warning">Warning</div>
              </Tooltip>
              <span class="example-label">Warning</span>
            </div>
            <div class="example-item">
              <Tooltip :color="tooltipColor.error" message="오류 메시지">
                <div class="color-badge error">Error</div>
              </Tooltip>
              <span class="example-label">Error</span>
            </div>
            <div class="example-item">
              <Tooltip :color="tooltipColor.info" message="정보 메시지">
                <div class="color-badge info">Info</div>
              </Tooltip>
              <span class="example-label">Info</span>
            </div>
          </div>
        </section>

        <!-- 고급 기능 -->
        <section class="example-section">
          <h2>고급 기능</h2>
          <div class="example-grid">
            <div class="example-item">
              <Tooltip
                message="호버링으로 표시되는 툴팁"
                :hovering="true"
                :color="tooltipColor.success"
              >
                <div class="hover-element">호버 요소</div>
              </Tooltip>
              <span class="example-label">호버링 모드</span>
            </div>
            <div class="example-item">
              <Tooltip message="다크 테마 툴팁" :dark="true">
                <div class="dark-element">다크 테마</div>
              </Tooltip>
              <span class="example-label">다크 테마</span>
            </div>
            <div class="example-item">
              <Tooltip :color="tooltipColor.secondary" :hovering="true" :width="350">
                <template #content>
                  <div class="custom-tooltip">
                    <h4>커스텀 내용</h4>
                    <p>커스텀 slot으로 만든 툴팁입니다.</p>
                    <p>커스텀 컨텐츠는 필히 width 속성을 조절 해주세요.</p>
                  </div>
                </template>
                <div class="custom-element">커스텀 내용</div>
              </Tooltip>
              <span class="example-label">커스텀 내용</span>
            </div>
          </div>
        </section>

        <!-- 호버 vs 클릭 비교 -->
        <section class="example-section">
          <h2>호버 vs 클릭 비교</h2>
          <p class="comparison-description">호버 모드와 클릭 모드의 차이점을 비교해보세요.</p>
          <div class="comparison-grid">
            <div class="comparison-item">
              <h3>호버 모드 (hovering: true)</h3>
              <div class="comparison-examples">
                <div class="comparison-example">
                  <Tooltip
                    message="마우스를 올리면 즉시 나타나고, 벗어나면 사라집니다."
                    :color="tooltipColor.success"
                    :width="350"
                  >
                    <div class="hover-target">
                      <span>호버하여 표시</span>
                    </div>
                  </Tooltip>
                  <p class="comparison-text">마우스 호버 시 자동 표시/숨김</p>
                </div>
              </div>
            </div>
            <div class="comparison-item">
              <h3>클릭 모드 (hovering: false)</h3>
              <div class="comparison-examples">
                <div class="comparison-example">
                  <Tooltip
                    message="클릭하면 나타나고, 다시 클릭하거나 다른 곳을 클릭하면 사라집니다."
                    :hovering="false"
                    :color="tooltipColor.primary"
                  >
                    <div class="click-target">
                      <span>클릭하여 표시</span>
                    </div>
                  </Tooltip>
                  <p class="comparison-text">클릭 시 수동 표시/숨김</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 상호작용 예제 -->
        <section class="example-section">
          <h2>상호작용 예제</h2>
          <div class="interactive-examples">
            <div class="control-panel">
              <h3>설정 패널</h3>
              <div class="control-group">
                <label>위치:</label>
                <select v-model="currentPosition" @change="changePosition(currentPosition)">
                  <option :value="tooltipPosition.top">Top</option>
                  <option :value="tooltipPosition.bottom">Bottom</option>
                  <option :value="tooltipPosition.left">Left</option>
                  <option :value="tooltipPosition.right">Right</option>
                </select>
              </div>
              <div class="control-group">
                <label>색상:</label>
                <select v-model="currentColor" @change="changeColor(currentColor)">
                  <option :value="tooltipColor.default">Default</option>
                  <option :value="tooltipColor.primary">Primary</option>
                  <option :value="tooltipColor.secondary">Secondary</option>
                  <option :value="tooltipColor.success">Success</option>
                  <option :value="tooltipColor.warning">Warning</option>
                  <option :value="tooltipColor.error">Error</option>
                  <option :value="tooltipColor.info">Info</option>
                </select>
              </div>
              <div class="control-group">
                <label>
                  <input type="checkbox" v-model="isHovering" />
                  호버링 모드
                </label>
              </div>
              <div class="control-group">
                <label>
                  <input type="checkbox" v-model="isDark" />
                  다크 테마
                </label>
              </div>
            </div>
            <div class="preview-area">
              <h3>미리보기</h3>
              <div class="preview-tooltip">
                <Tooltip
                  message="동적으로 변경되는 툴팁입니다. 설정 패널에서 옵션을 변경해보세요!"
                  title="동적 툴팁"
                  :position="currentPosition"
                  :color="currentColor"
                  :hovering="isHovering"
                  :dark="isDark"
                >
                  <template #default v-if="!isHovering">
                    <button class="preview-btn">동적 툴팁</button>
                  </template>
                  <template #default v-else>
                    <button class="preview-btn">동적 툴팁</button>
                  </template>
                </Tooltip>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <FloatingBackButton />
  </div>
</template>

<style lang="scss" scoped>
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2.5rem;
    font-weight: 700;
  }

  p {
    margin: 0;
    font-size: 1.1rem;
    opacity: 0.9;
  }
}

.main-content {
  padding: 3rem 0;
  background-color: #f8f9fa;
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.example-section {
  margin-bottom: 4rem;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  h2 {
    margin: 0 0 2rem 0;
    color: #333;
    font-size: 1.5rem;
    font-weight: 600;
    border-bottom: 2px solid #667eea;
    padding-bottom: 0.5rem;
  }
}

.example-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.example-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
}

.example-label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
  text-align: center;
}

// 커스텀 툴팁 스타일
.custom-tooltip {
  padding: 1rem;
  min-width: 200px;

  h4 {
    margin: 0 0 0.5rem 0;
    color: #9eb3d8;
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    margin: 0 0 1rem 0;
    color: #fff;
    font-size: 0.875rem;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .action-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: #007bff;
    color: white;
    font-size: 0.875rem;
    transition: background-color 0.2s ease;

    &:hover {
      background: #0056b3;
    }
  }
}

.form-tooltip {
  padding: 1rem;
  min-width: 250px;

  h4 {
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1rem;
    font-weight: 600;
  }

  .form-group {
    margin-bottom: 0.75rem;

    label {
      display: block;
      margin-bottom: 0.25rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #333;
    }

    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.875rem;

      &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
      }
    }
  }

  .form-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .btn-primary,
  .btn-secondary {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.2s ease;
  }

  .btn-primary {
    background: #007bff;
    color: white;

    &:hover {
      background: #0056b3;
    }
  }

  .btn-secondary {
    background: #6c757d;
    color: white;

    &:hover {
      background: #545b62;
    }
  }
}

// 상호작용 예제 스타일
.interactive-examples {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.control-panel {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;

  h3 {
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .control-group {
    margin-bottom: 1rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #333;
    }

    select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.875rem;
      background: white;

      &:focus {
        outline: none;
        border-color: #007bff;
      }
    }

    input[type='checkbox'] {
      margin-right: 0.5rem;
    }
  }
}

.preview-area {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  text-align: center;

  h3 {
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .preview-tooltip {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100px;
  }
}

// 실제 사용 예제 스타일
.form-field {
  .input-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.875rem;
    }
  }
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;

  .status-text {
    font-size: 0.875rem;
    color: #856404;
  }
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .btn-error {
    padding: 0.5rem 1rem;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;

    &:hover {
      background: #c82333;
    }
  }
}

@media (max-width: 768px) {
  .example-grid {
    grid-template-columns: 1fr;
  }

  .app-header h1 {
    font-size: 2rem;
  }

  .interactive-examples {
    grid-template-columns: 1fr;
  }
}

// 스크롤 테스트 스타일
.test-description {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  border-radius: 4px;
  color: #1565c0;
  font-size: 0.9rem;
}

.scroll-test-container {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
  overflow: hidden;
}

.scroll-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
  background: white;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;

    &:hover {
      background: #a8a8a8;
    }
  }
}

.test-item {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f8f9fa;
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }

  h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: 1.1rem;
    font-weight: 600;
  }

  p {
    margin: 0 0 1rem 0;
    color: #666;
    font-size: 0.9rem;
  }

  .tooltip-wrap {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
}

.custom-test-tooltip {
  padding: 1rem;
  min-width: 200px;

  h4 {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    margin: 0 0 1rem 0;
    color: #666;
    font-size: 0.875rem;
  }

  .test-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: #4caf50;
    color: white;
    font-size: 0.875rem;
    transition: background-color 0.2s ease;

    &:hover {
      background: #388e3c;
    }
  }
}

// 호버 기능 예제 스타일
.hover-description {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  border-radius: 4px;
  color: #1565c0;
  font-size: 0.9rem;
}

.hover-example {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .hover-target {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #f8f9fa;
      border-color: #adb5bd;
    }

    span {
      font-size: 0.9rem;
      color: #495057;
      font-weight: 500;
    }
  }
}

// 호버 vs 클릭 비교 스타일
.comparison-description {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  border-radius: 4px;
  color: #1565c0;
  font-size: 0.9rem;
}

.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.comparison-item {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;

  h3 {
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1.1rem;
    font-weight: 600;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e9ecef;
  }
}

.comparison-examples {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comparison-example {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  background: #f8f9fa;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .hover-target,
  .click-target {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #f8f9fa;
      border-color: #adb5bd;
    }

    span {
      font-size: 0.9rem;
      color: #495057;
      font-weight: 500;
    }
  }
}

.comparison-text {
  font-size: 0.875rem;
  color: #6c757d;
  text-align: center;
  font-style: italic;
}

// 새로운 요소 스타일
.btn-primary {
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;

  &:hover {
    background: #0056b3;
  }
}

.btn-secondary {
  padding: 0.5rem 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;

  &:hover {
    background: #545b62;
  }
}

.text-link {
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    color: #0056b3;
  }
}

.info-badge {
  padding: 0.25rem 0.5rem;
  background: #17a2b8;
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
  cursor: pointer;
}

.color-badge {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  min-width: 80px;

  &.default {
    background: #6c757d;
  }

  &.primary {
    background: #007bff;
  }

  &.secondary {
    background: #6c757d;
  }

  &.success {
    background: #28a745;
  }

  &.warning {
    background: #ffc107;
    color: #212529;
  }

  &.error {
    background: #dc3545;
  }

  &.info {
    background: #17a2b8;
  }
}

.hover-element {
  padding: 0.5rem 1rem;
  background: #28a745;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;

  &:hover {
    background: #218838;
  }
}

.dark-element {
  padding: 0.5rem 1rem;
  background: #343a40;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;

  &:hover {
    background: #23272b;
  }
}

.click-element {
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;

  &:hover {
    background: #0056b3;
  }
}

.custom-element {
  padding: 0.5rem 1rem;
  background: #6c757d;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;

  &:hover {
    background: #545b62;
  }
}

.preview-btn {
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;

  &:hover {
    background: #0056b3;
  }
}
</style>
