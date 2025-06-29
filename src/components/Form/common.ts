import { getCurrentInstance, onMounted } from 'vue';

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

      // if (parent && instance.vnode) {
      //   (parent.exposed as ValidateFormModel).addComponant(instance.vnode);
      // }
    }
  };

  onMounted(() => {
    findValidateForm();
  });
};
