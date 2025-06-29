import { getCurrentInstance, onMounted } from 'vue';

import type { ValidateFormModel } from './ValidateForm/types';

export const useAddFormValidate = () => {
  const instance = getCurrentInstance();

  const findValidateForm = () => {
    if (instance) {
      let parent: typeof instance | null = instance;

      while (parent) {
        if (parent.type.name === 'ValidateForm') {
          break;
        }
        parent = parent.parent;
      }

      console.log('parent :>> ', parent);

      if (parent && instance.vnode) {
        (parent.exposed as ValidateFormModel).addComponant(instance.vnode);
      }
    }
  };

  onMounted(() => {
    findValidateForm();
  });
};
