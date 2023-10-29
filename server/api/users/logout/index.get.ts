import { H3Event } from 'h3';
import { UsersService } from '~/src/users/users.service';
import { UsersRepository } from '~/src/users/users.repository';
import { TokenService } from '~/src/services/jwt/token.service';
import { EmailService } from '~/src/services/email/email.service';

export default defineEventHandler(
	async (event: H3Event) => {
		const userService: UsersService = new UsersService(
			new UsersRepository(),
			new TokenService(),
			new EmailService(),
			event
		);
		userService.logout();
		if (!event.context.user) delete event.context.user;
		return 'OK';
	}
);