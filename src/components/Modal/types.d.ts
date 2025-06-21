import type { modalPosition, modalTransition } from './const';

export type ModalPosition = (typeof modalPosition)[keyof typeof modalPosition];

export type ModalTransition = (typeof modalTransition)[keyof typeof modalTransition];

export interface ModalModel {
  close(callback?: () => void): void;
}
export interface ModalProps {
  modelValue: boolean;
  title: string;
  escClose?: boolean;
  width?: string;
  position?: ModalPosition;
  screenCover?: boolean;
  accessBack?: boolean;
  hideClose?: boolean;
}
