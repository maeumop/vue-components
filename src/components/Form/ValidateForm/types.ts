import type { VNode } from 'vue';

export interface ValidateFormModel {
  formProtection(protect?: boolean): void
  resetForm(): void,
  validate(silence?: boolean): boolean
  resetValidate(): void

  addComponant(vNode: VNode): void
}

export type ValidateExplorKeys = Extract<keyof ValidateFormModel, 'resetForm'|'resetValidate'| 'validate'>;