import { getCurrentInstance, onMounted } from 'vue';
import { ValidateFormModel } from './ValidateForm/types';
import { ComponentWithName, ExtendedComponentInstance } from './types';

// 컴포넌트 타입 가드 함수
const isComponentWithName = (type: unknown): type is ComponentWithName => {
  return typeof type === 'object' && type !== null;
};

// 컴포넌트 이름을 안전하게 가져오는 함수
const getComponentName = (instance: ExtendedComponentInstance | null): string | undefined => {
  if (!instance?.vnode?.type) {
    return undefined;
  }

  const { type } = instance.vnode;

  // 문자열인 경우 (예: 'div', 'span' 등)
  if (typeof type === 'string') {
    return type;
  }

  // 컴포넌트 객체인 경우
  if (isComponentWithName(type)) {
    return type.name;
  }

  return undefined;
};

export const useAddFormValidate = () => {
  const instance = getCurrentInstance() as ExtendedComponentInstance | null;
  let validateForm: ValidateFormModel | null = null;

  // 컴포넌트 이름 안전하게 가져오기
  const componentName = getComponentName(instance);

  if (instance && componentName === 'ValidateForm') {
    validateForm = instance.exposed as ValidateFormModel;
  }

  const findValidateForm = () => {
    if (!instance) {
      console.warn('useAddFormValidate: No current instance found');
      return;
    }

    if (validateForm && instance.vnode) {
      console.log('instance.vnode', validateForm);
      if (typeof validateForm.addComponant === 'function') {
        validateForm.addComponant(instance.vnode);
      }
    }
  };

  onMounted(() => {
    findValidateForm();
  });
};
