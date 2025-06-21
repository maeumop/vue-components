<script setup lang="ts">
import {
  mdiCheckboxBlankOutline,
  mdiCheckboxMarked,
  mdiChevronDown,
  mdiCloseCircle,
  mdiGoogleCirclesExtended,
  mdiMagnify,
  mdiWindowClose,
} from '@/assets/svg/iconPath';
import type { CSSProperties, StyleValue } from 'vue';
import { computed, nextTick, onBeforeMount, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import type { RuleFunc } from '../../types';
import { useAddFormValidate } from '../common';
import type { SelectBoxEmits, SelectBoxItem, SelectBoxProps } from './types';

const emit = defineEmits<SelectBoxEmits>();

const props = withDefaults(defineProps<SelectBoxProps>(), {
  block: false,
  label: '',
  inLabel: false,
  placeholder: '',
  errorMessage: '',
  items: (): SelectBoxItem[] => [],
  validate: (): RuleFunc[] => [],
  multiple: false,
  readonly: false,
  disabled: false,
  required: false,
  isShort: false,
  btnAccept: false,
  labelText: false,
  maxLength: 0,
  searchable: false,
  hideMessage: false,
  blurValidate: true,
  isLoading: false,
});

useAddFormValidate();

let isValidate = ref<boolean>(true);
let message = ref<string>('');
let errorTransition = ref<boolean>(false);
let isShowOption = ref<boolean>(false);
let showBottom = ref<boolean>(false);
// 검색어 입력중인지 체크 변수
let isSearchFilter = ref<boolean>(false);

let selectedText = ref<any>(props.multiple ? [] : '');
let selectedValue = ref<any>(props.multiple ? [] : '');

const optionList = ref<SelectBoxItem[]>([]);

const SelectBox = ref<HTMLSelectElement>();
const searchInput = ref<HTMLInputElement>();
const ul = ref<HTMLUListElement>();

const layerPositionStyle = reactive<CSSProperties>({
  top: '',
  left: '',
  bottom: '',
  width: '',
});

let selectedKeyIndex = ref<number>(0);

watch(() => props.errorMessage, v => {
  if (v) {
    isValidate.value = false;
    message.value = props.errorMessage;
  }
});

watch(() => props.validate, () => {
  resetValidate();
});

watch(() => props.modelValue, () => {
  setDefaultModelValue();
});

watch(() => props.options, () => {
  optionList.value = [...props.options];
  setDefaultModelValue();
}, { deep: true });

watch(() => props.disabled, v => v && resetValidate());

const isSelectAll = computed<boolean>(() => {
  if (props.multiple) {
    return optionList.value.length > 0 ?
      optionList.value.every(item => (selectedValue.value as string[]).includes(item.value))
      : false;
  }

  return false;
});


const wrapperStyle = computed<StyleValue>(() => {
  return {
    // error: !isValidate.value,
    block: props.block
  };
});

const getShowText = computed<string[]>(() => {
  if (props.btnAccept) {
    return Array.isArray(selectedText.value) ? selectedText.value : [ selectedText.value ];
  }
  let values: string[] = Array.isArray(props.modelValue) ? props.modelValue : [ props.modelValue ];
  return props.options.filter(option => values.includes(option.value)).map(({ text }) => text);
});

/**
 * 초기 modelValue 바로 대입할시 selectedValue의 값이 modelValue 메모리를 참조
 * 다중선택(btnAccept) 적용 버튼을 만족 시키기 위해 구조분해 할당 적용
 */
const setDefaultModelValue = () => {
  if (Array.isArray(props.modelValue)) {
    selectedValue.value = [...props.modelValue];
  }

  if (props.multiple) {
    selectedText.value = [];
  } else {
    selectedText.value = '';
    selectedValue.value = '';
  }

  props.options.forEach(item => {
    if (props.multiple && Array.isArray(props.modelValue)) {
      if (props.modelValue.includes(item.value as never)) {
        selectedText.value.push(item.text);
        return;
      }
    } else {
      if (props.modelValue === item.value) {
        selectedText.value = item.text;
        selectedValue.value = item.value;
        return;
      }
    }
  });
};

const updateValue = (v: string | string[], index: number = -1): void => {
  emit('update:modelValue', v);
  emit('update:selectedIndex', index);
  check();
};

/**
 * 유효성 검사
 */
const check = (silence: boolean = false): boolean => {
  if (!props.disabled) {
    // 폼을 검수하여 값을 반환, 임의로 지정된 에러가 없는 경우
    // validate check
    if (!props.errorMessage && props.validate.length) {
      for (let i: number = 0; i < props.validate.length; i++) {
        let result: string | boolean = props.validate[i](selectedValue.value);

        if (typeof result === 'string') {
          if (!silence) {
            message.value = result;
            isValidate.value = false;
            errorTransition.value = true;
          }

          return false;
        }
      }
    }

    message.value = '';
    isValidate.value = true;
  }

  return true;
};

/**
 * 폼 value 초기화
 */
const resetForm = (): void => {
  if (props.multiple) {
    selectedText.value = [];
    selectedValue.value = [];

    emit('update:modelValue', []);
  } else {
    selectedText.value = '';
    selectedValue.value = '';

    emit('update:modelValue', '');
  }
};

/**
 * 유효성 검사 초기화
 */
const resetValidate = (): void => {
  message.value = '';
  isValidate.value = true;
  errorTransition.value = false;
};

/**
 * options 항목 선택 이벤트
 *
 * @param index
 */
const selectOption = (v: any): void => {
  let index = -1;

  const [{ text }] = optionList.value.filter((item, i) => {
    if (item.value === v) {
      index = i;
      return true;
    }
  });

  if (props.multiple) {
    const indexOf: number = selectedValue.value.indexOf(v);

    if (indexOf > -1) {
      // 이미 선택된 값이라면 값 제거
      selectedValue.value.splice(indexOf, 1);
      selectedText.value.splice(indexOf, 1);
    } else {
      selectedValue.value.push(v);
      selectedText.value.push(text);
    }
  } else {
    selectedValue.value = v;
    selectedText.value = text;
  }

  if (!props.btnAccept) {
    updateValue(selectedValue.value, index);
  }

  if (!props.multiple) {
    toggleOption();
  }
};

/**
 * 이미 선택된 옵션인지 판별
 *
 * @param index
 */
const isOptionSelected = (v: any): boolean => {
  if (props.multiple) {
    return selectedValue.value.includes(v);
  }

  return props.modelValue === v;
};

const removeSelected = (index: number): void => {
  if (props.multiple) {
    selectedText.value.splice(index, 1);
    selectedValue.value.splice(index, 1);
  }

  if (!props.btnAccept) {
    updateValue(selectedValue.value);
  }
};

/**
 * 검색 유무에 따른 옵션 focus인지 판별
 * @param i
 */
const isOptionFocused = (i: number): boolean => {
  let index: number = i;

  if (props.multiple) {
    index = (!isSearchFilter.value ? i + 1 : i);
  }

  return selectedKeyIndex.value === index;
};

/**
 * 전체 선택
 */
const selectAll = (): void => {
  if (props.multiple) {
    const value: boolean = isSelectAll.value;

    selectedText.value = [];
    selectedValue.value = [];

    if (!value) {
      optionList.value.forEach(({ text, value }) => {
        selectedText.value.push(text);
        selectedValue.value.push(value);
      });
    }

    if (!props.btnAccept) {
      updateValue([...selectedValue.value]);
    }
  }
};

let transitionStatus = ref<boolean>(false);

/**
 * 옵션 목록 표시
 */
const toggleOption = (event?: FocusEvent): void => {
  if (!props.disabled && !props.readonly && !transitionStatus.value) {
    if (!isShowOption.value) {
      const windowHeight: number = window.innerHeight;
      const rect: DOMRect = SelectBox.value!.getBoundingClientRect();

      if (windowHeight / 2 < rect.top) {
        showBottom.value = true;
      } else {
        showBottom.value = false;
      }

      layerPositionStyle.top =  '';
      layerPositionStyle.bottom =  '';

      layerPositionStyle.left = `${rect.left}px`;
      layerPositionStyle.width = `${rect.width}px`;
      layerPositionStyle.bottom = showBottom.value ? `${(windowHeight - rect.top) + 3}px` : '';
      layerPositionStyle.top = !showBottom.value ? `${rect.top + 43}px` : '';
    }

    isShowOption.value = !isShowOption.value;
    if (isShowOption.value) {
      if (props.searchable) {
        searchInput.value!.value = '';
        isSearchFilter.value = false;
      }

      selectedKeyIndex.value = 0;
      optionList.value = [...props.options];

      nextTick(() => {
        const selected = ul.value?.querySelector('.selected');
        selected?.scrollIntoView();
      });
    }
  }
};

let timeout: number = 0;

// props.searchable 적용시
const searchText = (evt: KeyboardEvent): void => {
  const key = evt.key.toLowerCase();

  clearTimeout(timeout);

  if (!['arrowup', 'arrowdown', 'enter'].includes(key)) {
    selectedKeyIndex.value = 0;
    timeout = setTimeout(() => {
      const { value } = evt.target as HTMLInputElement;
      isSearchFilter.value = value ? true : false;
      if (value) {
        optionList.value = props.options.filter(({ text }) => text.toLowerCase().indexOf(value) > -1);
      } else {
        optionList.value = [...props.options];
      }

      nextTick(() => {
        const li = ul.value?.querySelector<HTMLLIElement>('.option-item');
        li?.scrollIntoView({ block: 'center' });
      });
    }, 300);
  }
};

// props.isAccept 적용시
const accept = (): void => {
  isShowOption.value = false;
  updateValue(selectedValue.value);
};

/**
 * 적용 버튼 활성화시 적용 버튼을 클릭하지 않고 창을 닫을 경우
 * 값을 전으로 돌려 준다.
 */
const noneAccept = (): void => {
  if (props.btnAccept) {
    selectedText.value = [];
    selectedValue.value = [];

    selectedValue.value = [...props.modelValue];
    for (let index = 0; index < props.options.length; index++) {
      const option = props.options[index];
      if (selectedValue.value.includes(option.value)) {
        selectedText.value.push(option.text);
      }
      if (selectedText.value.length === selectedValue.value.length) {
        break;
      }
    }

    updateValue([...selectedValue.value]);
  }
};

/**
 * 본 객체 외의 부분을 클릭할 경우 옵션 목록 숨김
 *
 * @param evt
 */
const outSideClickEvent = (evt: MouseEvent): void => {
  const target = evt.target as HTMLBodyElement;

  if (isShowOption.value) {
    if (!SelectBox.value!.contains(target)) {
      noneAccept();
      toggleOption();
    }
  }
};

optionList.value = [...props.options];

const main = ref<HTMLDivElement>();

let eventParentElement: HTMLElement;

const parentScrollEvent = (evt: Event): void => {
  isShowOption.value = false;
};

const preventDefaultScrollEvent = (evt: KeyboardEvent) => {
  if (isShowOption.value) {
    const code = evt.code.toLowerCase();
    if (['arrowdown', 'arrowup'].includes(code)) {
      evt.preventDefault();
    } 
  }      
};

/**
 * 컴포넌트 상위 element를 탐색(재귀)하며 scroll이 있는 Element에
 * scroll event를 추가 하여 scorll 발생시 layer 창을 닫아 준다.
 * @param el
 */
const setScrollEvent = (el: HTMLElement): void => {
  const parent = el.parentElement as HTMLElement;

  if (parent) {
    if (parent.tagName.toLowerCase() === 'html') {
      return;
    }

    if (parent.scrollHeight > parent.clientHeight) {
      eventParentElement = parent;
      eventParentElement.addEventListener('scroll', parentScrollEvent);
      return;
    }
    setScrollEvent(parent);
  }
};

const clearButtonShow = computed<boolean>(() => {
  if (props.modelValue) {
    return props.clearable && !props.disabled && !props.readonly && props.modelValue.length > 0;
  } else {
    return false;
  }
});

const clearValue = (): void => {
  updateValue(props.multiple ? [] : '');
};

const onBlur = (): void => {
  nextTick(() => {
    emit('blur', selectedValue.value);
  });
};

const onKeyDownHandler = (event: KeyboardEvent): void => {
  if (isShowOption.value) {
    const li = ul.value?.querySelectorAll<HTMLLIElement>('.option-item');

    if (li) {
      const len = li.length;
      const code = event.code.toLowerCase();

      if (code === 'arrowdown' && selectedKeyIndex.value < len) {
        selectedKeyIndex.value++;

        if (selectedKeyIndex.value >= len) {
          selectedKeyIndex.value = 0;
        }

        len && li[selectedKeyIndex.value].scrollIntoView({ block: 'center' });

      } else if (code === 'arrowup' && selectedKeyIndex.value >= -1) {
        selectedKeyIndex.value--;

        if (selectedKeyIndex.value === -1) {
          selectedKeyIndex.value = len - 1;
        }

        len && li[selectedKeyIndex.value].scrollIntoView({ block: 'center' });

      } else if (['numpadenter', 'enter'].includes(code)) {
        if (props.multiple && !isSearchFilter.value && selectedKeyIndex.value === 0) {
          selectAll();
        } else {
          const index = props.multiple && !isSearchFilter.value ? selectedKeyIndex.value - 1 : selectedKeyIndex.value;
          if (index > -1 && index < optionList.value.length) {
            const value = optionList.value[index].value;
            selectOption(value);
          }
        }
      } 
    }
  }
};

const onKeyUpHandler = (event: KeyboardEvent): void => {
  const code = event.code.toLowerCase();
  if (code === 'tab' && document.activeElement instanceof HTMLElement) {
    const parentElement = SelectBox.value?.parentElement || undefined;
    const isFocused: boolean = parentElement ? document.activeElement.contains(parentElement) : false;

    // 해당 SelectBox 포커스영역에서 포커스 이동시, 옵션 영역 활성화 해제 진행.
    if (!isFocused) {
      noneAccept();
      toggleOption();
    }

  }
};


const onEscapeKeyHandler = (event: KeyboardEvent): void => {
  const code = event.code.toLowerCase();
  if (isShowOption.value && code === 'escape') {
    isShowOption.value = false;
    noneAccept();

    // eventPhase : 0 = none / 1 = capture / 2 = target / 3 = bubbling
    // 모달 내부의 SelectBox 키 이벤트와 동시에 Modal도 같이 이벤트 수행이 되기 때문에
    // SelectBox 이벤트만 수행 후, 이벤트 전파 중지.
    const eventPhase: number = event.eventPhase;
    (eventPhase === 1 || eventPhase === 2) && event.stopPropagation();
  }
};

watch(isShowOption, (v) => {
  if (v) {
    document.addEventListener('keydown', onKeyDownHandler);
    document.addEventListener('keyup', onKeyUpHandler);
  } else {
    document.removeEventListener('keydown', onKeyDownHandler);
    document.removeEventListener('keyup', onKeyUpHandler);
  }
});

onMounted(() => {
  setDefaultModelValue();

  setScrollEvent(main.value!);
  document.addEventListener('click', outSideClickEvent);
  document.addEventListener('keydown', preventDefaultScrollEvent, { capture: true });
});

onBeforeMount(() => {
  if (eventParentElement) {
    eventParentElement.removeEventListener('scroll', parentScrollEvent);
  }
});

onUnmounted(() => {
  document.removeEventListener('click', outSideClickEvent);
  document.removeEventListener('keydown', onKeyDownHandler);
  document.removeEventListener('keyup', onKeyUpHandler);
  document.removeEventListener('keydown', preventDefaultScrollEvent, { capture: true });
});

defineExpose({
  check,
  resetForm,
  resetValidate,
});
</script>

<template>
  <div
    ref="main"
    tabindex="0"
    :style="{ width: props.width }"
    :class="['select-box', wrapperStyle]"
    @focus="!isShowOption && toggleOption($event)"
    @keydown.escape.capture="onEscapeKeyHandler"
  >
    <div
      class="options-wrap"
      v-if="!props.inLabel && props.label"
    >
      <label
        class="input-label"
        v-if="props.label"
      >
        {{ props.label }}
        <span class="required" v-if="props.required">*</span>
      </label>
    </div>

    <div
      ref="SelectBox"
      :class="['control-wrap', { disabled: props.disabled, readonly: props.readonly, error: message, active: isShowOption }]"
      @click="toggleOption"
    >
      <template v-if="props.multiple">
        <div
          class="text"
          v-if="getShowText.length"
        >
          <template v-if="props.labelText">
            <template v-if="!props.isShort">
              <span
                :key="`selectedItem${i}`"
                class="item"
                v-for="(txt, i) in getShowText"
              >
                {{ txt }}
                <SvgIcon
                  type="mdi"
                  class="remove-icon"
                  size="13"
                  :path="mdiWindowClose"
                  @click.stop="removeSelected(i)"
                />
              </span>
            </template>
            <template v-else>
              <span>{{ getShowText[0] }}</span>

              <template v-if="getShowText.length > 1"> &nbsp; + {{ getShowText.length - 1 }} </template>
            </template>
          </template>
          <template v-else>
            <template v-if="!props.isShort">
              <span
                class="label"
                v-if="props.inLabel"
              >
                {{ props.label }}:
              </span>

              {{ getShowText.join(', ') }}
            </template>
            <template v-else>
              <span
                class="label"
                v-if="props.inLabel"
              >
                {{ props.label }}:
              </span>

              {{ getShowText[0] }}
              <template v-if="getShowText.length > 1"> + {{ getShowText.length - 1 }} </template>
            </template>
          </template>
        </div>
        <div class="text ph" v-else>
          <span class="label" v-if="props.inLabel">
            {{ props.label }}:
          </span>

          {{ props.placeholder }}
        </div>
      </template>
      <template v-else>
        <div
          class="text"
          v-if="getShowText.length > 0"
        >
          <span
            class="label"
            v-if="props.inLabel"
          >
            {{ props.label }}:
          </span>

          {{ getShowText[0] }}
        </div>
        <div
          class="text ph"
          v-else
        >
          <span
            class="label"
            v-if="props.inLabel"
          >
            {{ props.label }}:
          </span>

          {{ props.placeholder }}
        </div>
      </template>

      <a
        href="#"
        class="btn-clear"
        @click.stop.prevent="clearValue"
        v-if="clearButtonShow"
      >
        <SvgIcon type="mdi" size="20" :path="mdiCloseCircle" />
      </a>

      <div :class="['arrow', { rotate: isShowOption }]">
        <SvgIcon type="mdi" size="16" :path="mdiChevronDown" />
      </div>

      <Transition
        :name="showBottom ? 'options-view-bottom' : 'options-view'"
        @leave="[onBlur(), props.blurValidate && check()]"
        @enter="transitionStatus = true"
        @after-enter="transitionStatus = false"
      >
        <div
          :style="layerPositionStyle"
          :class="['option-list', showBottom ? 'show-bottom' : 'show-top']"
          v-show="isShowOption"
        >
          <div
            class="search"
            @click.stop
            v-if="props.searchable"
          >
            <div class="search-wrap">
              <input
                ref="searchInput"
                placeholder="검색어 입력"
                type="text"
                @keydown.up.prevent="onKeyDownHandler"
                @keydown.down.prevent="onKeyDownHandler"
                @keydown.enter.prevent="onKeyDownHandler"
                @keydown.stop="searchText"
              />
              <SvgIcon
                type="mdi"
                :path="mdiMagnify"
              />
            </div>
          </div>
          <ul ref="ul" class="scrollbar">
            <li
              :class="['option-item', selectedKeyIndex === 0 && !isSearchFilter && 'key-selected']"
              @click.stop="selectAll"
              v-if="props.multiple && !props.maxLength && !isSearchFilter"
            >
              <SvgIcon
                type="mdi"
                :class="['checkbox', isSelectAll && 'checked']"
                :path="isSelectAll ? mdiCheckboxMarked : mdiCheckboxBlankOutline"
              />
              {{ isSelectAll ? '전체 해제' : '전체 선택' }}
            </li>
            <template v-if="optionList.length">
              <li
                :key="`select-${item.value}`"
                :class="['option-item', { selected: isOptionSelected(item.value), 'key-selected': isOptionFocused(i) }]"
                @click.stop="selectOption(item.value)"
                v-for="(item, i) in optionList"
              >
                <template v-if="props.multiple">
                  <SvgIcon
                    type="mdi"
                    class="checkbox"
                    :path="isOptionSelected(item.value) ? mdiCheckboxMarked : mdiCheckboxBlankOutline"
                  />
                </template>
                {{ item.text }}
              </li>
            </template>
            <template v-else>
              <li @click.stop>검색된 내용이 없습니다.</li>
            </template>
            <li class="items-loading" v-if="props.isLoading">
              <SvgIcon
                type="mdi"
                size="24"
                :path="mdiGoogleCirclesExtended"
              />
            </li>
          </ul>
          <a
            href="#"
            class="btn-accept"
            @click.stop.prevent="accept"
            v-if="props.btnAccept"
          >
            적용 + {{ selectedValue.length }}
          </a>
        </div>
      </Transition>
    </div>

    <div
      :class="['feedback', { error: errorTransition }]"
      @animationend="errorTransition = false"
      v-show="message && !props.hideMessage"
    >
      {{ message }}
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'SelectBox' };
</script>
<style scoped lang="scss">
@import './style';
</style>
