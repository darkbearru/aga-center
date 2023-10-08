import { H3Event } from 'h3';
import { EmailService } from '~/src/services/email/email.service';
import { UsersService } from '~/src/users/users.service';
import { UsersRepository } from '~/src/users/users.repository';
import { TokenService } from '~/src/services/jwt/token.service';

export default defineEventHandler(
	async (event: H3Event) => {
		const email = getRouterParam(event, 'email');
		if (!email) return {};
		const userService: UsersService = new UsersService(
			new UsersRepository(),
			new TokenService(),
			new EmailService(),
			event
		);
		return await userService.login(email);
	}
);
