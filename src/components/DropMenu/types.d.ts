import type { dropMenuColors, dropMenuPosition, dropMenuTransition } from './const';

export interface DropMenuItem {
  text: string;
  action: () => void;
  icon?: string;
}

export type DropMenuPosition = (typeof dropMenuPosition)[keyof typeof dropMenuPosition];

export type DropMenuTransition = (typeof dropMenuTransition)[keyof typeof dropMenuTransition];

export type DropMenuColors = (typeof dropMenuColors)[keyof typeof dropMenuColors];

export interface DropMenuProps {
  items: DropMenuItem[];
  position?: DropMenuPosition;
  transition?: DropMenuTransition;
  width?: number;
  color?: DropMenuColors;
}
