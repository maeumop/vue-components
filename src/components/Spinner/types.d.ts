export interface SpinnerModel {
  timeout: (limit: number) => this
  show: (msg?: string) => void
  delay: (sec: number) => this
  hide: () => void
  close: () => void
}


export interface SpinnerProps {
  limitTime?: number
  destroy: () => void
}