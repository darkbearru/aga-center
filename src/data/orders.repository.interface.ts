import type { TOrder, TOrderResponse } from '~/src/data/types/order';

export interface IOrdersRepository {
	create(order: TOrder): Promise<TOrder | undefined>
}
