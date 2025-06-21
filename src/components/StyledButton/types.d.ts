import type { btnColors } from './const';

export type BtnColors = typeof btnColors[keyof typeof btnColors];

export interface StyledButtonProps {
  color?: BtnColors
  class?: string
  href?: string
  target?: string
  text?: boolean
  icon?: MdiSvgIcon
  iconRight?: boolean
  onlyIcon?: boolean
  block?: boolean
  loading?: boolean
  disabled?: boolean
  xSmall?: boolean
  small?: boolean
  large?: boolean
  outline?: boolean
  tag?: string
  dropMenuToggle?: boolean
}