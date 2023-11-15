import type { TInitiative, TShortInitiative } from '~/src/data/types/initiatives';
import type { TUser } from '~/src/users/types/users';
import { Prisma } from '.prisma/client';

export enum OrderStatus {
	request = 1,
	canceled = 2,
	active = 3,
	tryComplete = 5,
	cancelComplete = 6,
	complete = 7,
	deleted = 8
}

export type TOrder = {
	id?: number,
	status: OrderStatus,
	messages?: TOrderMessages | Prisma.JsonValue,
	code?: string,
	initiative?: TShortInitiative | TInitiative | number,
	user?: TUser
	message?: string,
	author?: OrderAuthor,
	createdAt?: Date,
	changedAt?: Date,
	statusText?: string,
	statusColor?: string,
	created?: string,
	changed?: string,
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
	message: string,
	rating?: number,
}

export type TOrderMessages = TOrderMessage[];