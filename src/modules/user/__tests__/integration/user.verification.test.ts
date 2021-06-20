import { testApp, mailer } from '../../../../shared/__tests__/__setup__/setup';
import {
  userVerificationEndpoint,
  registerUser,
  dropTestUserStorage,
} from '../__setup__/user.setup';
import user from '../__fixtures__/user.fixtures';
import { parseLink, randomString } from '../../../../shared/utils/helpers';
import { jwtProvider } from '../../../../shared/security';
import { IServerResponsePayload } from '../../../../shared/web/http';
import userRepository from '../../infrastructure/persistence';

describe('User Verification #api #hot', () => {
  describe(`GET ${userVerificationEndpoint}`, () => {
    const newUser = user();
    let userId: string;

    // assert user was not verified in the database
    const assertUserWasNotVerified = async () => {
      const repo = userRepository();
      const registered = await repo.findUserByEmail(newUser.email);
      expect(registered?.emailVerifiedAt).toBeFalsy();
    };

    beforeAll(async () => {
      const response = await registerUser(newUser);
      // eslint-disable-next-line no-underscore-dangle
      userId = response.body.data._id;
    });

    afterAll(async () => {
      await dropTestUserStorage();
    });

    afterEach(async () => {
      const result = await mailer.latestTo(newUser.email);
      await mailer.deleteMessage(result.ID);
    });

    it('should verify the user', async () => {
      // await registerUser(user)
      await new Promise<void>((resolve) => {
        setTimeout(async () => {
          const { html } = await mailer.latestTo(newUser.email);
          const matches = parseLink(html);

          // expect(matches).toHaveLength(2)

          if (matches) {
            const response = await testApp.get(matches[1]);
            // eslint-disable-next-line jest/no-conditional-expect
            expect(response.statusCode).toEqual(200);

            // assert emailverifiedat is updated
            const repo = userRepository();
            const registered = await repo.findUserByEmail(newUser.email);
            // eslint-disable-next-line jest/no-conditional-expect
            expect(registered?.emailVerifiedAt).toEqual(expect.any(String));
          }
        }, 1000);
        resolve();
      });
    });

    it('should return an error when link is expired', async () => {
      expect.assertions(3);

      await new Promise<void>((resolve) => {
        setTimeout(async () => {
          const jwt = jwtProvider();

          const token = jwt.sign({
            sub: userId,
            iat: Math.floor(Date.now() / 1000) - 3000000,
          });
          const link = `${userVerificationEndpoint}/${token}`;
          const response = await testApp.get(link);
          expect(response.statusCode).toEqual(404);
          expect(response.body).toEqual<IServerResponsePayload<void>>({
            status: 'failed',
            message: 'jwt expired',
          });
          const repo = userRepository();
          const registered = await repo.findUserByEmail(newUser.email);
          expect(registered?.emailVerifiedAt).toBeFalsy();
          resolve();
        }, 100);
      });
      // assertUserWasNotVerified()
    });

    it('should return an error when link is invalid', async () => {
      const token = randomString(150);
      const link = `${userVerificationEndpoint}/${token}`;
      const response = await testApp.get(link);
      expect(response.statusCode).toEqual(404);
      expect(response.body).toEqual<IServerResponsePayload<void>>({
        status: 'failed',
        message: 'jwt malformed',
      });
      // const registered = await userRepository.findUserByEmail(user.email)
      // expect(registered?.emailVerifiedAt).toBeFalsy()
      await assertUserWasNotVerified();
    });
  });
});
