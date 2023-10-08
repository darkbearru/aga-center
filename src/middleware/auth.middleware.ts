import { UsersService } from '~/src/users/users.service';
import { H3Event } from 'h3';
import { UsersRepository } from '~/src/users/users.repository';
import { TokenService } from '~/src/services/jwt/token.service';
import { EmailService } from '~/src/services/email/email.service';
import { TUser } from '~/src/users/types/users';

export async function authMiddleware(accessToken: string, event: H3Event): Promise<TUser | null> {
	const userService: UsersService = new UsersService(
		new UsersRepository(),
		new TokenService(),
		new EmailService(),
		event
	);

	let user: TUser | null = await userService.check(accessToken);
	if (!user) {
		user = await userService.refresh();
	}

	return user;
}