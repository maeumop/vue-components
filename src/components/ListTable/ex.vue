<script setup lang="ts">
import { ref } from 'vue';
import type { ListTableHeader } from './types';

// 사용자 데이터 인터페이스
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

// 샘플 데이터
const users = ref<User[]>([
  {
    id: 1,
    name: '홍길동',
    email: 'hong@example.com',
    role: '관리자',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: '김철수',
    email: 'kim@example.com',
    role: '사용자',
    status: 'active',
    createdAt: '2024-01-16',
  },
  {
    id: 3,
    name: '이영희',
    email: 'lee@example.com',
    role: '사용자',
    status: 'inactive',
    createdAt: '2024-01-17',
  },
  {
    id: 4,
    name: '박민수',
    email: 'park@example.com',
    role: '관리자',
    status: 'pending',
    createdAt: '2024-01-18',
  },
  {
    id: 5,
    name: '정수진',
    email: 'jung@example.com',
    role: '사용자',
    status: 'active',
    createdAt: '2024-01-19',
  },
]);

// 테이블 헤더
const headers: ListTableHeader[] = [
  { text: 'ID', width: '80px', align: 'center' },
  { text: '이름', width: '120px' },
  { text: '이메일', width: '200px' },
  { text: '역할', width: '100px', align: 'center' },
  { text: '상태', width: '100px', align: 'center' },
  { text: '등록일', width: '120px', align: 'center' },
  { text: '액션', width: '120px', align: 'center' },
];

// 테이블 푸터 (사용하지 않으므로 주석 처리)
// const footer: ListTableFooter[] = [
//   { text: '총 사용자', colspan: 6, align: 'right' },
//   { text: users.value.length + '명', align: 'center' },
// ];

// 상태별 색상
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'color: #10b981;';
    case 'inactive':
      return 'color: #ef4444;';
    case 'pending':
      return 'color: #f59e0b;';
    default:
      return 'color: #6b7280;';
  }
};

// 상태별 텍스트
const getStatusText = (status: string): string => {
  switch (status) {
    case 'active':
      return '활성';
    case 'inactive':
      return '비활성';
    case 'pending':
      return '대기';
    default:
      return '알 수 없음';
  }
};

// 체크 관련 상태
const selectedUsers = ref<User[]>([]);
const selectedUser = ref<User | null>(null);

// 체크박스 이벤트 핸들러
const handleCheck = (_checked: boolean, _index: number, items: User[]): void => {
  selectedUsers.value = items;
  console.log('선택된 사용자들:', items);
};

const handleCheckAll = (checked: boolean): void => {
  console.log('전체 선택:', checked);
};

// 라디오 이벤트 핸들러
const handleRadioCheck = (_checked: boolean, _index: number, items: User[]): void => {
  selectedUser.value = items[0] || null;
  console.log('선택된 사용자:', selectedUser.value);
};

// 무한 스크롤 이벤트
const handleObserve = (): void => {
  console.log('더 많은 데이터 로드...');
  // 실제로는 API 호출하여 데이터 추가
};

// 비활성화 필터 (관리자는 선택 불가)
const disableFilter = (user: User, _index: number): boolean => {
  return user.role === '관리자';
};

// 사용자 삭제
const deleteUser = (user: User): void => {
  const index = users.value.findIndex(u => u.id === user.id);
  if (index > -1) {
    users.value.splice(index, 1);
  }
};

// 사용자 수정
const editUser = (user: User): void => {
  console.log('사용자 수정:', user);
};

// 로딩 상태
const isLoading = ref<boolean>(false);

// 로딩 토글
const toggleLoading = (): void => {
  isLoading.value = !isLoading.value;
};
</script>

<template>
  <div class="list-table-example">
    <h1>ListTable 컴포넌트 예제</h1>

    <!-- 기본 테이블 -->
    <section class="example-section">
      <h2>1. 기본 테이블</h2>
      <ListTable :header="headers" :items="users">
        <template #items="{ props }">
          <tr>
            <td>{{ props.id }}</td>
            <td>{{ props.name }}</td>
            <td>{{ props.email }}</td>
            <td>{{ props.role }}</td>
            <td :style="getStatusColor(props.status)">
              {{ getStatusText(props.status) }}
            </td>
            <td>{{ props.createdAt }}</td>
            <td>
              <button @click="editUser(props)" class="btn-edit">수정</button>
              <button @click="deleteUser(props)" class="btn-delete">삭제</button>
            </td>
          </tr>
        </template>
      </ListTable>
    </section>

    <!-- 체크박스 모드 -->
    <section class="example-section">
      <h2>2. 체크박스 모드</h2>
      <div class="info">
        <p>선택된 사용자: {{ selectedUsers.length }}명</p>
        <button @click="toggleLoading" class="btn-toggle">로딩 토글</button>
      </div>
      <ListTable
        :header="headers"
        :items="users"
        check-mode="checkbox"
        :loading="isLoading"
        :disable-filter="disableFilter"
        @checked="handleCheck"
        @checked-all="handleCheckAll"
      >
        <template #items="{ props, disabled }">
          <tr :class="{ disabled }">
            <td>{{ props.id }}</td>
            <td>{{ props.name }}</td>
            <td>{{ props.email }}</td>
            <td>{{ props.role }}</td>
            <td :style="getStatusColor(props.status)">
              {{ getStatusText(props.status) }}
            </td>
            <td>{{ props.createdAt }}</td>
            <td>
              <button @click="editUser(props)" :disabled="disabled" class="btn-edit">수정</button>
              <button @click="deleteUser(props)" :disabled="disabled" class="btn-delete">
                삭제
              </button>
            </td>
          </tr>
        </template>
      </ListTable>
    </section>

    <!-- 라디오 모드 -->
    <section class="example-section">
      <h2>3. 라디오 모드</h2>
      <div class="info">
        <p>선택된 사용자: {{ selectedUser?.name || '없음' }}</p>
      </div>
      <ListTable :header="headers" :items="users" check-mode="radio" @checked="handleRadioCheck">
        <template #items="{ props }">
          <tr>
            <td>{{ props.id }}</td>
            <td>{{ props.name }}</td>
            <td>{{ props.email }}</td>
            <td>{{ props.role }}</td>
            <td :style="getStatusColor(props.status)">
              {{ getStatusText(props.status) }}
            </td>
            <td>{{ props.createdAt }}</td>
            <td>
              <button @click="editUser(props)" class="btn-edit">수정</button>
              <button @click="deleteUser(props)" class="btn-delete">삭제</button>
            </td>
          </tr>
        </template>
      </ListTable>
    </section>

    <!-- 무한 스크롤 -->
    <section class="example-section">
      <h2>4. 무한 스크롤</h2>
      <ListTable
        :header="headers"
        :items="users"
        :observer="true"
        height="300px"
        @observe="handleObserve"
      >
        <template #items="{ props }">
          <tr>
            <td>{{ props.id }}</td>
            <td>{{ props.name }}</td>
            <td>{{ props.email }}</td>
            <td>{{ props.role }}</td>
            <td :style="getStatusColor(props.status)">
              {{ getStatusText(props.status) }}
            </td>
            <td>{{ props.createdAt }}</td>
            <td>
              <button @click="editUser(props)" class="btn-edit">수정</button>
              <button @click="deleteUser(props)" class="btn-delete">삭제</button>
            </td>
          </tr>
        </template>
      </ListTable>
    </section>

    <!-- 커스텀 헤더/푸터 -->
    <section class="example-section">
      <h2>5. 커스텀 헤더/푸터</h2>
      <ListTable :items="users">
        <template #header>
          <tr>
            <th colspan="7" style="text-align: center; background-color: #f3f4f6">
              사용자 관리 테이블
            </th>
          </tr>
          <tr>
            <th
              v-for="header in headers"
              :key="header.text"
              :width="header.width"
              :class="header.align"
            >
              {{ header.text }}
            </th>
          </tr>
        </template>
        <template #items="{ props }">
          <tr>
            <td>{{ props.id }}</td>
            <td>{{ props.name }}</td>
            <td>{{ props.email }}</td>
            <td>{{ props.role }}</td>
            <td :style="getStatusColor(props.status)">
              {{ getStatusText(props.status) }}
            </td>
            <td>{{ props.createdAt }}</td>
            <td>
              <button @click="editUser(props)" class="btn-edit">수정</button>
              <button @click="deleteUser(props)" class="btn-delete">삭제</button>
            </td>
          </tr>
        </template>
        <template #footer>
          <tr>
            <td colspan="6" style="text-align: right; font-weight: bold">총 사용자</td>
            <td style="text-align: center; font-weight: bold">{{ users.length }}명</td>
          </tr>
        </template>
      </ListTable>
    </section>

    <!-- 빈 데이터 상태 -->
    <section class="example-section">
      <h2>6. 빈 데이터 상태</h2>
      <ListTable :header="headers" :items="[]" empty-text="사용자 데이터가 없습니다.">
        <template #items="{ props }">
          <tr>
            <td>{{ props.id }}</td>
            <td>{{ props.name }}</td>
            <td>{{ props.email }}</td>
            <td>{{ props.role }}</td>
            <td>{{ props.status }}</td>
            <td>{{ props.createdAt }}</td>
            <td>
              <button class="btn-edit">수정</button>
              <button class="btn-delete">삭제</button>
            </td>
          </tr>
        </template>
      </ListTable>
    </section>
  </div>
</template>

<style scoped lang="scss">
.list-table-example {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    color: #1f2937;
    margin-bottom: 2rem;
    font-size: 2.4rem;
    font-weight: 600;
  }

  .example-section {
    margin-bottom: 4rem;
    padding: 2rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    background-color: white;

    h2 {
      color: #374151;
      margin-bottom: 1.5rem;
      font-size: 1.8rem;
      font-weight: 500;
    }

    .info {
      margin-bottom: 1rem;
      padding: 1rem;
      background-color: #f9fafb;
      border-radius: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      p {
        margin: 0;
        color: #6b7280;
        font-weight: 500;
      }
    }

    .btn-toggle {
      padding: 0.5rem 1rem;
      background-color: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 1.4rem;

      &:hover {
        background-color: #2563eb;
      }
    }

    .btn-edit {
      padding: 0.4rem 0.8rem;
      background-color: #10b981;
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 1.2rem;
      margin-right: 0.5rem;

      &:hover {
        background-color: #059669;
      }

      &:disabled {
        background-color: #9ca3af;
        cursor: not-allowed;
      }
    }

    .btn-delete {
      padding: 0.4rem 0.8rem;
      background-color: #ef4444;
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 1.2rem;

      &:hover {
        background-color: #dc2626;
      }

      &:disabled {
        background-color: #9ca3af;
        cursor: not-allowed;
      }
    }

    .disabled {
      opacity: 0.5;
      background-color: #f9fafb;
    }
  }
}

// 반응형 디자인
@media (max-width: 768px) {
  .list-table-example {
    padding: 1rem;

    .example-section {
      padding: 1rem;

      .info {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
  }
}
</style>

<script lang="ts">
export default { name: 'ListTableExample' };
</script>
