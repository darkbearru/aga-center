import { H3Event, NodeEventContext } from 'h3';
import { DataService } from '~/src/services/data/data.service';
import { initDataService } from '~/server/utils/initDataService';
import type { TOrder } from '~/src/data/types/order';


export default defineEventHandler(
	async (event: H3Event) => {
		if (!event.context.params?.category) return;
		const body = await readBody(event);
		const dataService:DataService = initDataService();

		switch (event.context.params?.category) {
			case 'order': {
				return await dataService.makeOrder(body as TOrder)
			}
			case 'search': {
				break;
			}
		}
	}
);