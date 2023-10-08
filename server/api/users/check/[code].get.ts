import { H3Event } from 'h3';

export default defineEventHandler(
	(event: H3Event) => {
		if (!event.context.user) return protectRoute(event);
		return event.context.user;
	}
);