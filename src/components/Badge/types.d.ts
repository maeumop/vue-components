import { type ColorType, type PositionType } from '../constants';
import type { BADGE_CONFIG } from './const';

export type BadgeColors = ColorType;
export type BadgePosition = PositionType;
export type BadgeSize = typeof BADGE_CONFIG.defaultSize | typeof BADGE_CONFIG.largeSize;

export interface BadgeProps {
  /** 뱃지에 표시할 텍스트 */
  text?: string;
  /** 뱃지 색상 */
  color?: BadgeColors;
  /** 뱃지 크기 */
  size?: BadgeSize;
  /** 큰 사이즈 사용 여부 (deprecated: size prop 사용 권장) */
  large?: boolean;
  /** 뱃지 위치 */
  position?: BadgePosition;
  /** 뱃지에 표시할 아이콘 (Iconify 아이콘명) */
  icon?: string;
  /** 뱃지가 표시될 요소의 클래스명 */
  wrapperClass?: string;
  /** 뱃지 자체의 클래스명 */
  badgeClass?: string;
}
