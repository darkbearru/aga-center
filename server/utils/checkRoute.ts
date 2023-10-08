import { H3Event } from 'h3';

export function checkRoute(event: H3Event): void {
	protectRoute(event);
	if (typeof event.context.params?.category === 'undefined') {
		throw createError({
			statusCode: 400,
			message: 'Bad Request',
		});
	}
}