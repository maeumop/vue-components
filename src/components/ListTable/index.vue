<script setup lang="ts" generic="T extends ListTableItem = ListTableItem">
  /**
   * 해당 컴포넌트는 정렬기능을 활성화 시킨 상태에서
   * 라인당 추가되는 하위 데이터에 대한 변화를 감지 하지 못합니다.
   */
  import type { StyleValue } from 'vue';
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watchEffect } from 'vue';
  import type {
    ListTableEmits,
    ListTableExpose,
    ListTableFooter,
    ListTableHeader,
    ListTableItem,
    ListTableProps,
  } from './types';

  import { shallowRef } from 'vue';
  import TableSpinner from './TableSpinner.vue';
  import ListTableCheck from './listCheck.vue';

  const props = withDefaults(defineProps<ListTableProps<T>>(), {
    items: (): T[] => [],
    header: (): ListTableHeader[] => [],
    footer: (): ListTableFooter[] => [],
    emptyText: '데이터가 없습니다.',
    loading: false,
    observer: false,
  });

  const emit = defineEmits<ListTableEmits<T>>();

  const slots = useSlots();

  const colspan = ref<number>(0);
  const tableHeader = ref<ListTableHeader[]>([]);
  /**
   * 컴포넌트 내에서 dataList를 조작할 일은 없고,
   * ListTableItem 통일함
   */
  const dataList = ref<ListTableItem[]>([]);

  const tableWidth = computed<StyleValue>(() => {
    return { width: props.width };
  });

  const tableHeight = computed<StyleValue>(() => {
    return { height: props.height };
  });

  const setHeader = (): void => {
    if (props.header.length) {
      // 정렬이 지정되어 있는 경우 해당 컬럼을 정렬해준다.
      tableHeader.value = props.header.map(item => {
        return {
          text: item.text,
          width: item.width,
          colspan: item.colspan ? item.colspan : 0,
          align: !item.align ? 'left' : item.align,
        };
      });
    }
  };

  // ==================================== STR checkMode ====================================
  // 헤더의 전체 체크 박스
  const checkedAll = ref<boolean>(false);
  // 바디의 [체크박스|라디오] 선택한 index 값
  const checkedIndexList = ref<number[]>([]);

  // 체크 모드 여부
  const isCheckMode = computed<boolean>(() =>
    props.checkMode ? ['checkbox', 'radio'].includes(props.checkMode) : false,
  );

  /**
   * checked 여부 ( default: false )
   *
   * @param index dataList index 값
   */
  const checkedFilter = (index: number): boolean => checkedIndexList.value.includes(index);

  /**
   * disabled 여부 ( default: false )
   *
   * @param index dataList index 값
   */
  const disabledFilter = (index: number): boolean => {
    const item = index >= 0 && index < dataList.value.length ? dataList.value[index] : null;
    const filter = typeof props.disableFilter === 'function' ? props.disableFilter : null;

    if (item && filter) {
      return filter(item as T, index);
    }

    return false;
  };

  /**
   * 체크 박스 전체 (선택|해제)
   * checkMode = 'radio'일 경우, 해제만 가능.
   *
   * @param bool 선택|해제
   */
  const checkedAllToggle = (bool: boolean = false): void => {
    if (props.checkMode === 'checkbox') {
      checkedIndexList.value = dataList.value.reduce<number[]>((prev, current, index) => {
        let checked: boolean = bool;

        if (checked === true && disabledFilter(index)) {
          checked = false;
        }

        checked && prev.push(index);
        return prev ? [] : prev;
      }, []);

      checkedAll.value = bool;
      // [slot.checkAll|slot.checkItems] 정의되어 있으면, 내부 핸들러를 이용하지 않으므로 발생하지 않습니다.
      (!slots['checkAll'] || !slots['checkItems']) && emit('checkedAll', checkedAll.value);

      return;
    }

    if (bool === false) {
      // radio 또는 일반 모드로 props 변경시 해제
      checkedIndexList.value = [];
      checkedAll.value = false;

      // checkedAll 이벤트는 [checkbox|radio] 일때만 발생
      props.checkMode === 'radio' && emit('checkedAll', checkedAll.value);
    }
  };

  /**
   * [체크박스|라디오] 단일 체크 (선택|해제)
   * checkMode = 'checkbox'일 경우, 토글 기능 추가
   *
   * @param index dataList index 값
   * @param bool 선택|해제
   */
  const checkedItemToggle = (index: number, bool: boolean = false): void => {
    if (index > -1 && index < dataList.value.length) {
      // disabled 결정.
      const disabled = disabledFilter(index);

      const _checked = bool && disabled ? false : bool;

      if (props.checkMode === 'radio') {
        // 라디오는 토글 기능 불가능.

        if (disabled) {
          //  변경 사항이 없으므로 마무리.
          return;
        }

        _checked && (checkedIndexList.value = [index]);

        if (!slots['checkItems']) {
          // slot.checkItems 정의되어 있으면, 내부 핸들러를 이용하지 않으므로 발생하지 않습니다.
          emit('checked', _checked, index, _checked ? [props.items[index]] : []);
        }

        //  무조건 라디오는 전체 선택 값은 false이다.
        checkedAll.value = false;
        return;
      }

      // 체크 박스는 토글 기능 가능.
      const indexSet = new Set([...checkedIndexList.value]);

      if (!disabled && _checked) {
        // 선택 가능
        indexSet.add(index);
      }

      // 선택 해제 => disabled 상관 없이 해제
      !_checked && indexSet.delete(index);

      checkedIndexList.value = Array.from(indexSet.values());

      const checkedArr: T[] = props.items.reduce<T[]>((prev, current, index) => {
        if (checkedIndexList.value.includes(index)) {
          prev.push(current);
        }

        return prev;
      }, []);

      if (!slots['checkItems']) {
        // slot.checkItems 정의되어 있으면, 내부 핸들러를 이용하지 않으므로 발생하지 않습니다.
        emit('checked', _checked, index, checkedArr);
      }

      if (!checkedArr.length) {
        // 선택지가 모두 clear 되었을 경우.
        checkedAll.value = false;
        return;
      }

      if (props.items.length && checkedArr.length) {
        // 선택지가 모두 선택 되었을 경우.
        let maxSelectLength = 0;

        if (props.disableFilter) {
          maxSelectLength = dataList.value.reduce((prev, current, index) => {
            return prev + (disabledFilter(index) ? 0 : 1);
          }, 0);
        }

        checkedAll.value = maxSelectLength === checkedArr.length;
      }
    }
  };
  // ==================================== checkMode END ====================================

  // ==================================== Scroll observer ====================================
  const listTableWrap = shallowRef<HTMLDivElement>();
  const listTable = shallowRef<HTMLTableElement>();

  const options: IntersectionObserverInit = {
    root: listTableWrap.value!,
    rootMargin: '20px 0px 0px 0px',
  };

  const observerStart = (): void => {
    if (dataList.value.length && props.observer) {
      const trList = listTable.value!.querySelectorAll<HTMLTableRowElement>('tbody tr');

      // 테이블 스크롤이 마지막행
      const trTarget = trList[trList.length - 1];

      if (trTarget !== undefined) {
        IObserver.observe(trTarget);
      }
    }
  };

  const observerStop = (): void => {
    IObserver.disconnect();
  };

  const callback: IntersectionObserverCallback = entries => {
    if (entries[0].isIntersecting) {
      observerStop();
      emit('observe');
    }
  };

  const IObserver = new IntersectionObserver(callback, options);
  // ==================================== Scroll observer ====================================

  const isScroll = ref<boolean>(false);

  const tableScrollEvent = (event: Event): void => {
    const target = event.target as HTMLElement;
    isScroll.value = target.scrollTop > 0;
  };

  onMounted(() => {
    if (props.observer && props.height && dataList.value.length) {
      observerStart();
    }

    listTableWrap.value?.addEventListener('scroll', tableScrollEvent);
  });

  onBeforeUnmount(() => {
    listTableWrap.value?.removeEventListener('scroll', tableScrollEvent);
  });

  watchEffect(() => setHeader());

  watchEffect(() => {
    if (props.items.length) {
      dataList.value = [...props.items];

      // 너무 빠르게 실행 되면 발생 하는 오류 방지
      nextTick(() => {
        if (props.observer) {
          observerStart();
        }
      });
    } else {
      dataList.value = [];

      nextTick(() => {
        if (props.observer) {
          observerStop();
        }
      });
    }
  });

  /**
   * colspan 값 계산기
   * slots.header 사용하지 않는다면, (props.header 길이 + (checkMode && +1))를 계산.
   */
  watchEffect(() => {
    if (!slots.header) {
      let headerLength: number = props.header.length;
      isCheckMode.value && (headerLength += 1);
      colspan.value = headerLength;
    }
  });

  /**
   * colspan 값 계산기
   * slots.header 사용하는다면, thead tr 아래의 th 개수의 최대값을 찾아서 자동 계산.
   */
  watchEffect(
    () => {
      if (slots.header && listTable.value) {
        const tHead: Element[] = Array.from(listTable.value.tHead?.children || []);

        const result: number = tHead.reduce((prev, current) => {
          let thCount: number = 0;

          if (current.tagName.toLowerCase() === 'tr') {
            thCount = Array.from(current.children).reduce((pre, el) => {
              let count: number = 0;
              if (['th', 'td'].includes(el.tagName.toLowerCase())) {
                count = (el as HTMLTableCellElement).colSpan * 1;
              }

              return pre + count;
            }, 0);

            if (thCount > prev) {
              prev = thCount;
            }
          }

          return prev;
        }, 0);

        colspan.value = !tHead.length ? 0 : result;
      }
    },
    { flush: 'post' },
  );

  defineExpose<ListTableExpose>({
    observerStart,
    observerStop,

    checkedToggle: checkedAllToggle,
  });
</script>

<template>
  <div ref="listTableWrap" class="list-table" :style="tableHeight">
    <table ref="listTable" :style="tableWidth">
      <thead :class="isScroll && 'is-scroll'" v-if="slots.header">
        <slot name="header"></slot>
      </thead>
      <thead :class="isScroll && 'is-scroll'" v-else>
        <tr>
          <th width="50" v-if="isCheckMode">
            <slot name="checkAll" v-if="props.checkMode === 'checkbox'">
              <ListTableCheck
                type="checkbox"
                :model-value="checkedAll"
                :disabled="props.loading"
                @update:model-value="checkedAllToggle"
                v-if="!slots['checkItems']"
              />
            </slot>
          </th>
          <th
            :key="`head${item.text}`"
            :width="item.width"
            :class="item.align"
            v-for="item in tableHeader"
          >
            <span>{{ item.text }}</span>
          </th>
        </tr>
      </thead>

      <tbody v-if="dataList.length > 0">
        <template v-if="isCheckMode">
          <!-- CheckMode -->
          <tr :key="index" v-for="(item, index) in dataList">
            <td width="50">
              <slot
                name="checkItems"
                :index="index"
                :disabled="disabledFilter(index)"
                :props="item"
                v-if="slots.checkItems"
              >
              </slot>
              <ListTableCheck
                :type="props.checkMode"
                :disabled="disabledFilter(index)"
                :model-value="checkedFilter(index)"
                @update:model-value="v => checkedItemToggle(index, v)"
                v-else
              />
            </td>
            <slot name="items" :props="item as T" :disabled="disabledFilter(index)" :index="index">
            </slot>
          </tr>

          <tr v-if="props.loading">
            <!-- loading spinner -->
            <td :colspan="colspan">
              <TableSpinner />
            </td>
          </tr>
        </template>
        <template v-else>
          <!-- default -->
          <slot
            name="items"
            :props="item as T"
            :index="index"
            :disabled="disabledFilter(index)"
            v-for="(item, index) in dataList"
          >
          </slot>

          <tr v-if="props.loading">
            <!-- loading spinner -->
            <td :colspan="colspan">
              <TableSpinner />
            </td>
          </tr>
        </template>
      </tbody>
      <tbody v-else>
        <!-- empty -->
        <tr>
          <td class="no-data" :colspan="colspan" v-if="!props.loading">
            <template v-if="slots.empty">
              <slot name="empty"></slot>
            </template>
            <template v-else>
              {{ emptyText }}
            </template>
          </td>
        </tr>

        <tr v-if="props.loading">
          <!-- loading spinner -->
          <td :colspan="colspan">
            <TableSpinner />
          </td>
        </tr>
      </tbody>

      <tfoot v-if="Object.keys(props.footer).length">
        <tr>
          <template v-for="(item, i) in footer">
            <th
              :key="`foot-${i}`"
              :colspan="item.colspan"
              :class="item.align"
              v-if="item.tag === 'th'"
            >
              {{ item.text }}
            </th>
            <td :key="`foot${i}`" :colspan="item.colspan" :class="item.align" v-else>
              <b>{{ item.text }}</b>
            </td>
          </template>
        </tr>
      </tfoot>
      <tfoot v-else-if="slots.footer">
        <slot name="footer"></slot>
      </tfoot>
    </table>
  </div>
</template>
<script lang="ts">
  export default { name: 'ListTable' };
</script>
<style scoped lang="scss">
  @use './_style.scss';
</style>
