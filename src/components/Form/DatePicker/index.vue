<script setup lang="ts">
  import { mdiCalendarMonth } from '@/assets/svg/iconPath';
  import { computed, nextTick, onBeforeMount, onMounted, provide, ref, watch } from 'vue';
  import type { RuleFunc } from '../../types';
  import { useAddFormValidate } from '../common';
  import CalendarPart from './Calendar/index.vue';
  import DateController from './DateController/index.vue';
  import { useDatePickerHelper } from './helper';
  import { useDatePickerStore } from './store';
  import type { Calendar, DatePickerEmits, DatePickerProps, ToggleButtonType } from './types';

  const datePickerStore = useDatePickerStore();
  provide('datePickerStore', datePickerStore);

  const { startDate, endDate, setStartDate, setEndDate, setDateState, setSelected, init } =
    datePickerStore;

  const helper = useDatePickerHelper();

  useAddFormValidate();

  const emit = defineEmits<DatePickerEmits>();

  const props = withDefaults(defineProps<DatePickerProps>(), {
    validate: (): RuleFunc[] => [],
    range: false,
    label: '',
    placeholder: '',
    separator: '-',
    minYear: 1900,
    maxYear: Number(new Date().getFullYear()) + 10,
    block: false,
    required: false,
    hideMessage: false,
    maxRange: 0,
    readonly: false,
    disabled: false,
    blurValidate: true,
    defaultDate: false,
  });

  const el = ref<HTMLElement>();
  const inputArea = ref<HTMLDivElement>();

  let isShow = ref<boolean>(false);
  let picker = ref<HTMLElement>();
  let holderText = ref<string[]>(['', '']);
  let toggleDateButton = ref<ToggleButtonType[]>([
    { text: '오늘', checked: false },
    { text: '어제', checked: false },
    { text: '최근 7일(오늘 포함)', checked: false },
    { text: '최근 7일(오늘 제외)', checked: false },
    { text: '이번 달', checked: false },
    { text: '지난 달', checked: false },
  ]);

  let selectedError = ref<string>('');
  let message = ref<string | boolean>('');
  let onError = ref<boolean>(false);
  let errorTransition = ref<boolean>(false);
  let isValidate = ref<boolean>(true);
  let _modelValue = ref<string | string[]>(props.modelValue);

  const startCalendar = ref<Calendar>();
  const endCalendar = ref<Calendar>();

  watch(
    () => [startDate.value, endDate.value],
    () => {
      resetError();
    },
  );

  watch(
    () => props.modelValue,
    (v, before) => {
      dateUpdate(v);

      // datePicker 디폴트값으로 변경시 달력도 초기화 될 수 있도록 처리
      if (props.range && (before[0] !== v[0] || before[1] !== v[1])) {
        if (v[0] && v[1]) {
          setDateCalender();

          // toggleDateButton 버튼을 클릭했을때 구분하여 버튼 checked 처리
          if (clickToggleDateButton) {
            clickToggleDateButton = false;
          } else {
            toggleDateButton.value.forEach(item => (item.checked = false));
          }
        }
      }
    },
  );

  watch(
    () => props.validate,
    () => {
      resetValidate();
    },
  );

  watch(
    () => props.disabled,
    v => v && resetValidate(),
  );

  // update
  const dateUpdate = (v: string | string[]): void => {
    if (props.range && Array.isArray(v)) {
      setStartDate(v[0]);
      setEndDate(v[1]);
      setSelected('start', v[0]);
      setSelected('end', v[1]);

      if (v[0] && v[1]) {
        v.forEach((item, index) => {
          const _date = item.split('-').map(_item => Number(_item));
          setDateState(index ? 'end' : 'start', 'year', _date[0]);
          setDateState(index ? 'end' : 'start', 'month', _date[1]);
        });
      }
    } else if (typeof v === 'string') {
      if (v !== '') {
        setStartDate(v);
        setSelected('start', v);
      }
    }
  };

  // 선택된 날짜 기간을 보여준다.
  const selectedDateView = computed<string>(() => {
    let v: string = '';

    if (props.range) {
      if (selectedError.value !== '') {
        // 날짜 선택을 잘못한 경우 오류 메시지 표시
        v = selectedError.value;
      } else if (startDate.value !== '' && endDate.value !== '') {
        v = `${startDate.value} ~ ${endDate.value}`;
      }
    }

    return v;
  });

  /**
   * 배치된 위치에 따라 달력이 보여지는 위치와 방향을 변경
   */
  const toggleCalendar = (): void => {
    if (!isShow.value) {
      const { top, bottom, left, right, transformOrigin } = helper.getLayerPosition(
        inputArea.value!,
        props.range,
      );

      picker.value!.style.top = top;
      picker.value!.style.bottom = bottom;
      picker.value!.style.left = left;
      picker.value!.style.right = right;
      picker.value!.style.transformOrigin = transformOrigin;
    }

    if (!props.readonly && !props.disabled) {
      isShow.value = !isShow.value;
    }
  };

  const setDateCalender = (): void => {
    // 해당 달력으로 변환
    const s = props.separator;
    let start: string[] = startDate.value.split(s);
    let end: string[] = endDate.value.split(s);

    // 선택되는 날짜에 대한 처리는 Calendar 컴포넌트 내부에서 실행됨
    setDateState('start', 'year', Number(start[0]));
    setDateState('start', 'month', Number(start[1]));
    setDateState('end', 'year', Number(end[0]));
    setDateState('end', 'month', Number(end[1]));

    nextTick(() => {
      startCalendar.value!.makeCalendar();

      if (props.range) {
        endCalendar.value!.makeCalendar();
      }
    });

    updateValue();
  };

  let clickToggleDateButton = false;
  /**
   * props.range === true 일때 버튼을 클릭하여 case에 맞춰서 날짜 지정
   * @param flag
   */
  const pickCaseDate = (index: number): void => {
    clickToggleDateButton = true;
    toggleDateButton.value.forEach((item, i) => {
      item.checked = false;

      if (index === i) {
        item.checked = true;
      }
    });

    let date: Date = new Date();

    if (index === 4) {
      date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    } else if (index === 5) {
      date = new Date(date.getFullYear(), date.getMonth(), 0);
    }

    let year: string = date.getFullYear().toString();
    let month: string = (date.getMonth() + 1).toString();
    let day: string = date.getDate().toString();

    month = month.length === 1 ? `0${month}` : month;
    day = day.length === 1 ? `0${day}` : day;

    const s = props.separator;
    let format = `Y${s}m${s}d`;

    switch (index) {
      case 0:
        setStartDate(helper.getDateFormat(date, format, 0));
        setEndDate(helper.getDateFormat(date, format, 0));
        break;
      case 1:
        setStartDate(helper.getDateFormat(date, format, -1));
        setEndDate(helper.getDateFormat(date, format, -1));
        break;
      case 2:
        setStartDate(helper.getDateFormat(date, format, -6));
        setEndDate(helper.getDateFormat(date, format, 0));
        break;
      case 3:
        setStartDate(helper.getDateFormat(date, format, -7));
        setEndDate(helper.getDateFormat(date, format, -1));
        break;
      case 4:
      case 5:
        setStartDate(`${year}${s}${month}${s}01`);
        setEndDate(`${year}${s}${month}${s}${day}`);
        break;
    }

    setDateCalender();
  };

  /**
   * 에러 메시지를 표시한 후 3초 후 제거
   * @param msg 에러 메시지 내용
   */
  const setErrorMsg = (msg: string = '날짜를 선택해주세요.'): void => {
    selectedError.value = msg;

    setTimeout(() => {
      selectedError.value = '';
    }, 3000);
  };

  /**
   * 취소 버튼 클릭
   * defaultDate === true 이고, 초기 값이 있을때 초기값 반영
   */
  const cancel = (): void => {
    if (props.range) {
      if (props.defaultDate && props.modelValue[0] && props.modelValue[1]) {
        toggleDateButton.value.map(item => (item.checked = false));
        dateUpdate(_modelValue.value);
        setDateCalender();
        emit('update:modelValue', [_modelValue.value[0], _modelValue.value[1]]);
      } else {
        resetForm();
      }
    }

    isShow.value = false;
  };

  /**
   * 적용 버튼 클릭
   */
  const accept = (): void => {
    if (props.range && (!startDate.value || !endDate.value)) {
      setErrorMsg();
      return;
    }

    updateValue();
    emit('update:set', [startDate.value, endDate.value]);
    _modelValue.value = [startDate.value, endDate.value];
    isShow.value = false;
  };

  /**
   * model update
   */
  const updateValue = (): void => {
    // 종료 날짜가 시작 날짜보다 작지 않을 경우 데이터 적용
    if (props.range) {
      if (startDate.value && endDate.value) {
        emit('update:modelValue', [startDate.value, endDate.value]);
      } else {
        setStartDate('');
        setEndDate('');
        emit('update:modelValue', ['', '']);
      }
    } else {
      emit('update:modelValue', startDate.value);
    }
  };

  /**
   * 폼 초기화 처리
   */
  const resetForm = (): void => {
    init();

    toggleDateButton.value.forEach(item => (item.checked = false));
    startCalendar.value!.resetSelected();
    startCalendar.value!.makeCalendar();

    if (props.range) {
      endCalendar.value!.resetSelected();
      endCalendar.value!.makeCalendar();
      emit('update:modelValue', ['', '']);
    } else {
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
   * 유효성 에러 처리 초기화
   */
  const resetError = (): void => {
    message.value = '';
    onError.value = false;
    errorTransition.value = false;
    isValidate.value = true;
  };

  /**
   * FormValidate 컴포넌트롤 통한 validation check
   */
  const check = (silence: boolean = false): boolean => {
    // 데이터 검증
    if (props.validate.length && !props.disabled) {
      for (let i = 0; i < props.validate.length; i++) {
        let result1: string | boolean = true;
        let result2: string | boolean = true;

        if (props.range) {
          result1 = props.validate[i](startDate.value);
          result2 = props.validate[i](endDate.value);
        } else {
          result1 = props.validate[i](startDate.value);
        }

        if (result1 !== true || result2 !== true) {
          if (!silence) {
            if (props.range) {
              message.value = (result1 && !result2) || result2;
            } else {
              message.value = result1;
            }
            onError.value = true;
            errorTransition.value = true;
            isValidate.value = false;
          }

          return false;
        } else {
          message.value = '';
        }
      }
    }

    return true;
  };

  /**
   * 달력 컴포넌트 외의 구역을 클릭할 경우 팝업 닫힘
   * @param evt
   */
  const outsideClickEvent = (evt: Event): void => {
    if (el.value && isShow.value) {
      const target = evt.target as HTMLElement;
      const classList = target.classList.value;
      const indexOf1 = classList.indexOf('current');
      const indexOf2 = classList.indexOf('today');
      const indexOf3 = classList.indexOf('date-range');

      if (indexOf1 === -1 && indexOf2 === -1 && indexOf3 === -1) {
        if (!el.value.contains(target)) {
          check();
          isShow.value = false;
        }
      }
    }
  };

  let eventParentElement: HTMLElement;

  /**
   * 달력 팝업이 표시되어 있는 상태에서 스크롤 이벤트 발생시 팝업 닫음
   */
  const parentScrollEvent = (): void => {
    isShow.value = false;
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

  /**
   * 달력에서 전달된 날짜의 기간을 검수 하여 maxRange를 초과 한경우 컴포넌트 업데이트 안함
   * @param flag start | end
   */
  const dateTermCheck = (isEnd: boolean): void => {
    toggleDateButton.value.forEach(item => (item.checked = false));

    nextTick(() => {
      if (props.range && props.maxRange && startDate.value && endDate.value) {
        const startTime: number = new Date(startDate.value).getTime();
        const endTime: number = new Date(endDate.value).getTime();

        // 선택 최대 기간이 설정된 경우 날짜를 계산하여 선택이 안되도록 처리
        const term: number = (endTime - startTime) / (86400 * 1000) + 1;

        // 만약 기간이 초과 한다면 변수를 초기화 하고, 다시 랜더링 하지 않는다.
        if (props.maxRange < term) {
          if (!isEnd) {
            setStartDate('');
          } else {
            setEndDate('');
          }

          setErrorMsg(`최대 선택기간 ${props.maxRange}일을 초과 하였습니다.`);
          return;
        }
      }

      // 달력을 다시 그려준다.
      startCalendar.value!.makeCalendar();

      if (props.range) {
        endCalendar.value!.makeCalendar();
      }

      if (!props.range) {
        updateValue();
        isShow.value = false;
      }
    });
  };

  init();

  dateUpdate(props.modelValue);

  if (props.placeholder) {
    if (Array.isArray(props.placeholder)) {
      holderText.value = props.placeholder;
    } else if (typeof props.placeholder === 'string') {
      holderText.value[0] = props.placeholder;
    }
  }

  if (props.modelValue) {
    if (props.range) {
      setStartDate(props.modelValue[0]);
      setEndDate(props.modelValue[1]);
    } else if (typeof props.modelValue === 'string') {
      setStartDate(props.modelValue);
    }

    if (props.defaultDate) {
      if (props.range) {
        _modelValue.value = [...props.modelValue];
      } else if (typeof props.modelValue === 'string') {
        _modelValue.value = props.modelValue;
      }
      _modelValue.value = props.modelValue;
    }
  }

  onMounted(() => {
    // 달력 외의 영역 클릭시 달력 닫기
    document.addEventListener('click', outsideClickEvent);

    // 스크롤 시 달력 닫기
    setScrollEvent(el.value!);
  });

  onBeforeMount(() => {
    if (eventParentElement) {
      eventParentElement.removeEventListener('scroll', parentScrollEvent);
    }

    document.removeEventListener('click', outsideClickEvent);
  });

  defineExpose({
    check,
    resetForm,
    resetValidate,
  });
</script>

<template>
  <div ref="el" :class="['date-picker', { block }]">
    <div class="wrap" @click="toggleCalendar">
      <div class="options-wrap" v-if="props.label">
        <label class="input-label">
          {{ props.label }}
          <span class="required" v-if="props.required">*</span>
        </label>
      </div>

      <div
        ref="inputArea"
        :class="[
          'picker-date-text',
          { error: message, disabled: props.disabled, readonly: props.readonly, active: isShow },
        ]"
      >
        <input
          readonly
          type="text"
          :placeholder="holderText[0]"
          :value="props.disabled ? '' : startDate"
        />
        <template v-if="props.range">
          <span class="input-group-text">~</span>
          <input
            readonly
            type="text"
            :placeholder="holderText[1]"
            :value="props.disabled ? '' : endDate"
          />
        </template>

        <SvgIcon type="mdi" size="22" :path="mdiCalendarMonth" />
      </div>

      <div
        :class="['feedback', { error: errorTransition }]"
        @animationend="errorTransition = false"
        v-show="message && !props.hideMessage"
      >
        {{ message }}
      </div>
    </div>

    <!-- 달력 표시 -->
    <Transition name="picker-scale" @leave="[emit('blur'), props.blurValidate && check()]">
      <div ref="picker" class="picker-popup" v-show="isShow">
        <template v-if="props.range">
          <div class="search-date">
            <a
              :key="v.text"
              href="#"
              :class="[v.checked && 'active']"
              @click.prevent="pickCaseDate(i)"
              v-for="(v, i) in toggleDateButton"
            >
              {{ v.text }}
            </a>
          </div>

          <ul class="pick-name-text">
            <li>시작일</li>
            <li>종료일</li>
          </ul>
        </template>

        <div class="picker-wrap">
          <div class="calendar">
            <DateController :max-year="maxYear" :min-year="minYear" />

            <CalendarPart
              ref="startCalendar"
              :separator="props.separator"
              :range="props.range"
              :max-range="props.maxRange"
              @update:date="dateTermCheck"
            />
          </div>

          <template v-if="props.range">
            <div class="calendar">
              <DateController end :max-year="maxYear" :min-year="minYear" />

              <CalendarPart
                end
                ref="endCalendar"
                :separator="props.separator"
                :range="props.range"
                :max-range="props.maxRange"
                @update:date="dateTermCheck"
              />
            </div>

            <div class="btn-area">
              <div :class="['select-date', { 'selected-error': selectedError }]">
                {{ selectedDateView }}
              </div>
              <div>
                <a href="#" class="cancel" @click.prevent="cancel">취소</a>
                <a href="#" class="okay" @click.prevent="accept">적용</a>
              </div>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
  @import './style';
</style>
<script lang="ts">
  export default { name: 'DatePicker' };
</script>
