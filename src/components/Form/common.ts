import { getCurrentInstance, onMounted } from 'vue';
import { ValidateFormModel } from './ValidateForm/types';

export const useAddFormValidate = () => {
  const instance = getCurrentInstance();

  const findValidateForm = () => {
    if (!instance) {
      console.warn('useAddFormValidate: No current instance found');
      return;
    }

    let parent: typeof instance | null = instance;

    while (parent) {
      if (parent.type.name === 'ValidateForm') {
        break;
      }
      parent = parent.parent;
    }

    if (parent?.exposed && instance.vnode) {
      const validateForm = parent.exposed as ValidateFormModel;

      if (typeof validateForm.addComponant === 'function') {
        validateForm.addComponant(instance.vnode);
      }
    }
  };

  onMounted(() => {
    findValidateForm();
  });
};
