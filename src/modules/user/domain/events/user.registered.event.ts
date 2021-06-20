import Messages from '../../../../messages';
import eventEmitter from '../../../../shared/events/emitter';
import mailer from '../../infrastructure/email';
import { jwtProvider } from '../../../../shared/security';
import { User } from '../entities/user.entity';
import config from '../../../../config';

export default (): void => {
  eventEmitter.on('user:registered', (user: User) => {
    const { host, baseUrl } = config.web.http;
    const uri = '/v1/auth/verify';
    const jwt = jwtProvider();
    // eslint-disable-next-line no-underscore-dangle
    const token = jwt.sign({ sub: user._id });
    const verificationLink = `${host}${baseUrl}${uri}/${token}`;
    const email = {
      to: user.email,
      subject: Messages.USER_VERIFICATION,
      html: `<p>Please verify your account by clicking <a href="${verificationLink}">here</a>.<p>`,
    };
    mailer().send(email);
  });
};
