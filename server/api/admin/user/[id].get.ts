import { H3Event } from 'h3';

export default defineEventHandler(
	async (event: H3Event) => {
		if (!event.context.user) return protectRoute(event);

	}
);