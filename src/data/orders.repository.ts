import type { IOrdersRepository } from '~/src/data/orders.repository.interface';
import type { TOrder, TOrderMessages, TOrderMessage } from '~/src/data/types/order';
import { OrderAuthor, OrderStatus } from '~/src/data/types/order';
import type { TInitiativeWithOrders } from '~/src/data/types/initiatives';
import type { TUser } from '~/src/users/types/users';
import { prismaClient } from '~/src/utils/prismaClient';
import { Prisma } from '.prisma/client';

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
				messages: order.messages as Prisma.InputJsonValue,
				code: order.code || '',
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

	async addMessage(code: string, status: OrderStatus, message: TOrderMessage): Promise<TOrder | null> {
		const order = await this.get(code);
		if (!order) return null;
		const messages: TOrderMessages = [...order.messages as TOrderMessages, message];
		order.messages = messages;
		order.status = status;
		order.changedAt = new Date();
		await prismaClient.order.update({
			where: { id: order.id },
			data: { status, messages, changedAt: order.changedAt }
		})
		return order;
	}



	async list(user: TUser): Promise<TInitiativeWithOrders | null> {
		return prismaClient.initiative.findMany({
			select: {
				id: true,
				name: true,
				Order: {
					select: {
						id: true,
						status: true,
						code: true,
						messages: true,
						Users: true,
						changedAt: true,
					},
					orderBy: [
						{ status: 'asc' },
						{ changedAt: 'desc' }
					]
				},
				_count: {
					select: {
						Order: true,
					}
				},
			},
			where: {
				isApproved: true,
				isDeleted: false,
				Company: {
					Users: {
						id: user.id
					}
				},
				/*
								Order: {
									every: {
										status: {
											in: [OrderStatus.request, OrderStatus.active]
										}
									}
								}
				*/
			},
			orderBy: {Order: {_count: 'desc'}}
		});
	}

	async get(code: string): Promise<TOrder | null> {
		code = code.trim();
		const result = await prismaClient.order.findFirst({
			where: { code },
			select: {
				id: true,
				status: true,
				messages: true,
				changedAt: true,
				createdAt: true,
				Initiative: {
					select: {
						id: true,
						name: true,
						text: true,
						Photos: {
							select: {
								id: true,
								path: true,
							}
						},
						Company: {
							select: {
								id: true,
								slug: true,
								nameShort: true,
								nameFull: true,
								typeOwnership: {
									select: {
										nameShort: true,
										nameFull: true
									}
								}
							}
						}
					}
				},
				Users: {
					select: {
						id: true,
						email: true,
						fio: true,
					}
				}
			}
		});
		if (!result || !result.Initiative || !result.Initiative.Company || !result.Users) return result;

		return {
			id: result.id,
			status: result.status,
			messages: result.messages,
			changedAt: result.changedAt,
			createdAt: result.createdAt,
			initiative: {
				id: result.Initiative?.id,
				name: result.Initiative?.name || '',
				text: result.Initiative?.text || '',
				photos: result.Initiative.Photos || [],
				company: {
					id: result.Initiative.Company.id,
					slug: result.Initiative.Company.slug,
					nameShort: result.Initiative.Company.nameShort,
					nameFull: result.Initiative.Company.nameFull,
					ownership: {
						nameShort: result.Initiative.Company.typeOwnership?.nameShort || '',
						nameFull: result.Initiative.Company.typeOwnership?.nameFull || ''
					}
				},
			},
			user: result.Users
		};
	}

	async saveCode(id: number, code:string) : Promise<void> {
		await prismaClient.order.update({
			data: { code },
			where: { id }
		});
	}

}