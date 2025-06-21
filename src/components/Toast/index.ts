import { h, render, isVNode } from 'vue';
import type { App, VNode } from 'vue';
import ToastComponent from './component.vue';
import type { ToastModel, ToastOptions, MessageOptions } from './types';
import { toastIconCase, toastColorCase } from './const';

export default {
  install: (app: App, options?: ToastOptions) => {
    let vNode: VNode | null = null;
    const body = document.querySelector('body') as HTMLBodyElement;
    const wrapper: HTMLDivElement = document.createElement('div');
    wrapper.id = 'toast';

    body.appendChild(wrapper);

    const props: ToastOptions = {
      maxShowMessage: 4,
      delay: 3000,
      destroy: (): void => {
        render(null, body);
        vNode = null;
      }
    };

    const init = () => {
      if (!isVNode(vNode)) {
        const toastBase = document.querySelector('#toast') as HTMLDivElement;

        vNode = h(ToastComponent, props);
        render(vNode, toastBase);
      }
    };

    if (options) {
      if ('maxShowMessage' in options) {
        props.maxShowMessage = options.maxShowMessage;
      }

      if ('delay' in options) {
        props.delay = options.delay;
      }
    }

    const setMessage = (opt: MessageOptions | string): void => {
      init();

      if (vNode) {
        if (vNode.component?.exposed) {
          const { exposed } = vNode.component;

          if (opt instanceof Object) {
            if ('message' in opt) {
              exposed.message.value = opt.message;
            } else {
              console.error('toast message is not set');
              return;
            }

            if (opt.color) {
              exposed.icon.value = toastIconCase[opt.color];
              exposed.color.value = opt.color;
            }
          } else if (typeof opt === 'string') {
            exposed.message.value = opt;
            exposed.color.value = toastColorCase.success;
            exposed.icon.value = toastIconCase.success;
          } else {
            console.error('toast message is not set');
            return;
          }

          exposed.show();
        }
      }
    };

    const objectToast: ToastModel = (params: MessageOptions | string): void => {
      setMessage(params);
    };

    // app.config.globalProperties.$toast = objectToast
    app.provide('Toast', objectToast);
  }
};