import type { MdiSvgIcon } from '../types';

export interface TooltipModel {
  close(): void;
}

export interface TooltipProps {
  title?: string;
  message?: string | string[];
  left?: boolean;
  right?: boolean;
  top?: boolean;
  bottom?: boolean;
  width?: number;
  hovering?: boolean;
  btnClose?: boolean;
  icon?: MdiSvgIcon;
  iconSize?: string;
  dark?: boolean;
  padding?: string;
  name?: string;
  block?: boolean;
}
