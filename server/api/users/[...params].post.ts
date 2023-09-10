import { H3Event } from 'h3';
import { UsersService } from '~/src/users/users.service';
import { EmailService } from '~/src/services/email/email.service';
import { UsersRepository } from '~/src/users/users.repository';
import { TokenService } from '~/src/services/jwt/token.service';

export default defineEventHandler(
	async (event: H3Event) => {
		if (!event.context.params?.params) return 'no params';
		const params: string[] = event.context.params?.params.split('/');
		const userService: UsersService = new UsersService(
			new EmailService(),
			new UsersRepository(),
			new TokenService(),
			event
		);
		return await userService.validate({
			email: params[0],
			confirmCode: params[1]
		});
	}
);