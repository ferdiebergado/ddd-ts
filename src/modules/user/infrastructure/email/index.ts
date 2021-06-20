import NodemailerEmailProvider from './nodemailer/nodemailer';
import config from '../../../../config';

export default () => new NodemailerEmailProvider(config.mail);
