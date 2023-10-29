import { H3Event } from 'h3';

export default defineEventHandler(
	(event: H3Event) => {
		console.log('Check', event.path);
		console.log(event.context.user);
		if (!event.context.user) return protectRoute(event);
		return event.context.user;
	}
);