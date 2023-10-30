import type { IOrdersRepository } from '~/src/data/orders.repository.interface';
import type { TOrder, TOrderResponse } from '~/src/data/types/order';
import { prismaClient } from '~/src/utils/prismaClient';
import { OrderAuthor } from '~/src/data/types/order';

export class OrdersRepository implements IOrdersRepository {
	async create(order: TOrder): Promise<TOrder | undefined> {
		if (order?.message) {
			order.messages = [
				{
					author: OrderAuthor.client,
					message: order.message
				}
			];
			delete order.message;
		}
		const created = await prismaClient.order.create({
			data: {
				status: order.status,
				messages: order.messages,
				initiativeId: typeof order.initiative === 'number' ? order.initiative : order.initiative?.id,
				usersId: order.user?.id
			}
		});
		if (!created) return undefined;
		return {
			id: created.id,
			status: created.status,
		}

	}

}