import { H3Event } from 'h3';
import { TUserRegistration } from '~/src/users/types/users';
import { UsersService } from '~/src/users/users.service';
import { EmailService } from '~/src/services/email/email.service';
import { UsersRepository } from '~/src/users/users.repository';
import { TokenService } from '~/src/services/jwt/token.service';

export default defineEventHandler(
	async (event: H3Event) => {
		const body: TUserRegistration = await readBody(event);
		const userService: UsersService = new UsersService(
			new UsersRepository(),
			new TokenService(),
			new EmailService(),
			event
		);
		return await userService.create(body);
	}
);
