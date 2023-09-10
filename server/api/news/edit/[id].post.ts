import { H3Event } from 'h3';
import protectRoute from '~/server/utils/protectRoute';

export default defineEventHandler(
	async (event: H3Event): Promise<H3Event> => {
		if (!event.context?.user) protectRoute(event);
		const body: H3Event = await readBody(event);
		return body;
	}
)