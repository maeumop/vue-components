import type { messageBoxType } from './const';

export interface MessageBoxOptions {
  type?: MessageBoxType
  message: string
  title?: string
  width?: string
  btnOkayText?: string
  btnCancelText?: string
  okay?: () => void
  cancel?: () => void
  asyncOkay?: () => void
  destroy?: () => void
  escCancel?: boolean
  enterOkay?: boolean
}

export interface MessageBoxExpose {
  hide(): void
}


export interface MessageBoxModel {
  alert(params: MessageBoxOptions | string): void
  confirm(params: MessageBoxOptions | string): void
  destroy(): void
}

export type MessageBoxType = typeof messageBoxType[keyof typeof messageBoxType];
