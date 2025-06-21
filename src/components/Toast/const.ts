import {
  mdiChatAlert,
  mdiCheckCircleOutline,
  mdiCloseOctagon,
  mdiInformationVariantCircleOutline,
} from '@/assets/svg/iconPath';

export const toastColorCase = {
  success: 'success',
  warning: 'warning',
  info: 'info',
  danger: 'danger',
} as const;

export const toastIconCase = {
  success: mdiCheckCircleOutline,
  warning: mdiChatAlert,
  info: mdiInformationVariantCircleOutline,
  danger: mdiCloseOctagon,
} as const;
