import nodemailer from 'nodemailer';
import {
  Email,
  IEmailProvider,
} from '../../../application/email.provider.interface';

export default class NodemailerEmailProvider implements IEmailProvider {
  transportOptions;

  smtpTransport: nodemailer.Transporter;

  constructor(public readonly options: any) {
    this.transportOptions =
      process.env.NODE_ENV === 'production'
        ? this.options.production
        : this.options.development;
    this.smtpTransport = nodemailer.createTransport(this.transportOptions);
  }

  send(email: Email): void {
    if (!email.from) {
      // eslint-disable-next-line no-param-reassign
      email.from =
        process.env.NODE_ENV === 'production'
          ? this.options.production.auth.user
          : this.options.from;
    }
    console.log('Sending email...');
    this.smtpTransport.sendMail(email, (error) => {
      if (error) return console.error(error);
      // console.log(JSON.stringify(response))
      console.log('Email sent.');
      return this.smtpTransport.close();
    });
  }
}
