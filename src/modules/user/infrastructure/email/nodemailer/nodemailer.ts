import nodemailer from 'nodemailer'
import config from '../../../../../config'
import {
  Email,
  IEmailProvider,
} from '../../../application/email.provider.interface'

const { mail } = config
const transportOptions =
  process.env.NODE_ENV === 'production' ? mail.production : mail.development
const smtpTransport = nodemailer.createTransport(transportOptions)

export class NodemailerEmailProvider implements IEmailProvider {
  send(email: Email): void {
    if (!email.from) {
      email.from =
        process.env.NODE_ENV === 'production'
          ? mail.production.auth.user
          : mail.from
    }
    console.log('Sending email...')
    smtpTransport.sendMail(email, (error) => {
      if (error) return console.error(error)
      // console.log(JSON.stringify(response))
      smtpTransport.close()
    })
  }
}
