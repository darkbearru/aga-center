import { authMiddleware } from '~/src/middleware/auth.middleware';
import { H3Event } from 'h3';

export default defineEventHandler((event: H3Event) => {
	const to = getRequestURL(event);
	console.log('server middleware call');
	return authMiddleware(event, to.pathname);
})