export const modalPosition = {
  popup: 'popup',
  center: 'center',
  top: 'top',
  right: 'right',
  left: 'left',
  bottom: 'bottom',
} as const;

export const modalTransition = {
  popup: 'modal-scale',
  center: 'modal-fade',
  top: 'modal-slide-down',
  right: 'modal-slide-in-right',
  left: 'modal-slide-in-left',
  bottom: 'modal-slide-in-bottom',
} as const;
