export interface Result<T = undefined> {
  success: boolean
  message: string
  data?: T
}
