import type { TOrder, TOrderMessage, TOrderResponse } from '~/src/data/types/order';
import type { TInitiativeWithOrders } from '~/src/data/types/initiatives';
import type { TUser } from '~/src/users/types/users';
import { OrderStatus } from '~/src/data/types/order';

export interface IOrdersRepository {
	create(order: TOrder): Promise<TOrder | undefined>
	list(user: TUser): Promise<TInitiativeWithOrders | null>
	get(code: string): Promise<TOrder | null>
	addMessage(code: string, status: OrderStatus, message: TOrderMessage): Promise<TOrder | null>
	saveCode(id: number, code: string): Promise<void>;
}
