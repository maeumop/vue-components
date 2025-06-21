import {
  mdiCheckboxBlank,
  mdiCheckboxBlankOutline,
  mdiCheckboxMarked,
  mdiCircle,
  mdiRadioboxBlank,
  mdiRadioboxMarked,
} from '@/assets/svg/iconPath';

import type { ListTableListCheckIconType } from './types';

/**
 * ListCheck.vue checkbox icon ConstEnum
 */
export const listTableCheckboxIcon: ListTableListCheckIconType = {
  disabled: mdiCheckboxBlank,
  checked: mdiCheckboxMarked,
  blank: mdiCheckboxBlankOutline,
} as const;

/**
 * ListCheck.vue radio icon ConstEnum
 */
export const listTableRadioIcon: ListTableListCheckIconType  = {
  disabled: mdiCircle,
  checked: mdiRadioboxMarked,
  blank: mdiRadioboxBlank,
} as const;