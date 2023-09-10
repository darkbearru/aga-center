import { NavigationFailure, RouteLocationNormalized, RouteLocationRaw } from 'vue-router';
import { UsersService } from '~/src/users/users.service';
import { EmailService } from '~/src/services/email/email.service';
import { UsersRepository } from '~/src/users/users.repository';
import { TokenService } from '~/src/services/jwt/token.service';
import { H3Event } from 'h3';

export type TAuthMiddleware = RouteLocationNormalized | Promise<void | false | NavigationFailure> | RouteLocationRaw | void | false;

export function authMiddleware(event: H3Event, to: string): TAuthMiddleware {
	const headers = getHeaders(event);
	const auth: string | undefined = headers['authorization']?.trim();
	if (!auth) return;
	const accessToken = auth.replace('Bearer ', '');
	const userService: UsersService = new UsersService(
		new EmailService(),
		new UsersRepository(),
		new TokenService(),
		event
	);
	const user = userService.check(accessToken);
	if (user) {
		event.context.user = user;
	} else {
		if (to !== '/') return navigateTo('/');
	}
	return to;
}