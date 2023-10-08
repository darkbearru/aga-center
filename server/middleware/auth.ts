import { authMiddleware } from '~/src/middleware/auth.middleware';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	if (process.client) return;
	// console.log('Server middleware', 'Start')
	const access = getCookie(event, 'ac_token');
	const headers = getHeaders(event);
	const accessToken = headers['authorization']?.replace('Bearer ', '').trim() || access;
	const refreshToken = getCookie(event, 'rf_token');
	// console.log('Server middleware', accessToken);
	if (!accessToken && !refreshToken) {
		// console.log('Server middleware', 'no tokens')
		return;
	}
	if (!accessToken) return;

	const user = await authMiddleware(accessToken, event);
	if (user) {
		// console.log('User', user);
		event.context.user = user;
	}

})