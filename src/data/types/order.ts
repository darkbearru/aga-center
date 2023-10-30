import type { TInitiative } from '~/src/data/types/initiatives';
import type { TUser } from '~/src/users/types/users';

export enum OrderStatus {
	request = 1,
	active = 2,
	complete = 3,
	deleted = 4
}

export type TOrder = {
	id?: number,
	status: OrderStatus,
	messages?: TOrderMessages,
	initiative?: TInitiative | number,
	user?: TUser
	message?: string,
}
export type TOrders = TOrder[];

export type TOrderResponse = {
	errors?: {
		email?: string,
		fio?: string,
		other?: string,
		message?: string,
		confirm?: string,
		email_exists?: string,
	}
	order?: TOrder
}
export enum OrderAuthor {
	client = 0,
	company = 1,
}
export type TOrderMessage = {
	author: OrderAuthor,
	message: string
}

export type TOrderMessages = TOrderMessage[];