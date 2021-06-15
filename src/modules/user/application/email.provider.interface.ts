export interface Email {
  to: string
  from?: string
  subject: string
  text?: any
  html?: any
  attachment?: any
}

export interface IEmailProvider {
  send(email: Email): void
}
