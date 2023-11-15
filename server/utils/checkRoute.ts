import { H3Event } from 'h3';

export function checkRoute(event: H3Event): void {
	if (event.context.code && (event.context.params?.category === 'orders')) return;
	protectRoute(event);
	if (typeof event.context.params?.category === 'undefined') {
		throw createError({
			statusCode: 400,
			message: 'Bad Request',
		});
	}
}