import type { badgeColors, badgePosition } from './const';

export type BadgeColors = typeof badgeColors[keyof typeof badgeColors];
export type BadgePosition = typeof badgePosition[keyof typeof badgePosition];

export interface BadgeProps {
  text?: string
  color?: BadgeColors
  large?: boolean
  position?: BadgePosition
  icon?: string
}