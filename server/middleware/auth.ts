import { authMiddleware } from '~/src/middleware/auth.middleware';
import { H3Event } from 'h3';
import { OrdersRepository } from '~/src/data/orders.repository';

export default defineEventHandler(async (event: H3Event) => {
	if (process.client) return;
	if (!event?.path.match(/^\/(client|api)\/?/im) || event?.path.match(/^\/api\/users\/logout/im)) return;

	console.log('middleware.auth', event?.path);

	const query = getQuery(event);
	const code = query.code as string;
	const access = getCookie(event, 'ac_token');
	const headers = getHeaders(event);
	const accessToken = headers['authorization']?.replace('Bearer ', '').trim() || access;
	const refreshToken = getCookie(event, 'rf_token');

	if (!code && !event?.path.match(/^\/orders\/?/im)) {
		if (!accessToken && !refreshToken) {
			console.log('Server middleware', 'no tokens')
			return;
		}
		if (!accessToken) return;

		const user = await authMiddleware(accessToken, event);
		if (user) {
			// console.log('User', user);
			event.context.user = user;
		}
	} else {
		event.context.code = code;
	}
})