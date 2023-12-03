import type { IInitiativeRepository } from '~/src/data/initiative.repository.interface';
import type {
	TInitiative,
	TInitiativeList,
	TInitiativeResult,
	TInitiativeWithID,
	TShortInitiative
} from '~/src/data/types/initiatives';
import type { TUser } from '~/src/users/types/users';
import type { TPhotos } from '~/src/data/types/photos';
import type { TClientDataError } from '~/src/data/types/common.data';
import { OrderStatus } from '~/src/data/types/order';
import { prismaClient } from '~/src/utils/prismaClient';
import { Prisma } from '.prisma/client';
import ms from 'ms';
import type { TManageInitiatives } from './types/manage.initiatives';

const selectFields = {
	id: true,
	status: true,
	direction: true,
	name: true,
	text: true,
	isApproved: true,
	isDeclined: true,
	declineReason: true,
	promo: true,
	InitiativeTypes: {
		select: {
			id: true,
			name: true,
		}
	},
	Regions: {
		select: {
			id: true,
			name: true,
			slug: true,
			isActive: true,
		}
	},
	Company: {
		select: {
			id: true,
			slug: true,
			nameShort: true,
			nameFull: true,
		}
	},
	Photos: {
		select: {
			id: true,
			path: true,
		}
	},
	_count: {
		select: {
			Order: true,
		}
	},
};

const clientInitiativeFields = {
	id: true,
	name: true,
	text: true,
	direction: true,
	rating: true,
	Photos: {
		select: {
			id: true,
			path: true,
		}
	},
	/*
		Reviews: {
			select: {
				id: true,
				title: true,
				review: true,
				rate: true,
				createdAt: true,
			}
		},
	*/
	Company: {
		select: {
			id: true,
			nameShort: true,
			nameFull: true,
			slug: true,
			typeOwnership: true
		}
	}
};

export class InitiativeRepository implements IInitiativeRepository {
	async add(item: TInitiativeWithID): Promise<TInitiative | undefined> {
		const photos = this.photosConnectOrCreate(item?.photos);

		const created = await prismaClient.initiative.create({
			data: {
				status: true,
				direction: Number(item.direction),
				name: item.name,
				text: item.text,
				isApproved: false,
				isDeleted: false,
				isDeclined: false,
				declineReason: '',
				InitiativeTypes: {
					connect: {
						id: Number(item.type)
					}
				},
				Company: {
					connect: {
						id: Number(item.company),
					}
				},
				Regions: {
					connect: {
						id: Number(item.region)
					}
				},
				Photos: {
					connectOrCreate: photos
				}
			}
		});
		return await this.select(created.id);
	}

	private photosConnectOrCreate(photos?: TPhotos): any[] {
		const result: any[] = [];
		photos?.forEach(item => {
			result.push({
				where: { id: item.id || 0},
				create: {
					path: item.path,
					title: item.title || ''
				}
			})
		})
		return result;
	}


	async select(id: number): Promise<TInitiative> {
		const result = await prismaClient.initiative.findFirst({
			where: { id },
			select: selectFields,
		});
		return this.formatResult(result as TInitiativeResult)
	}

	async check(item: TInitiativeWithID): Promise<TInitiative | undefined> {
		const idQuery = typeof item.id !== 'undefined' ? { id: { not: Number(item.id) } } : {};
		const res = await prismaClient.initiative.findFirst({
			where: {
				AND: [
					{ name: item.name },
					{ isDeleted: Boolean(false) },
					{ regionsId: Number(item.region) || 0 },
					idQuery,
				]
			},
			select: selectFields,
		});
		return res ? this.formatResult(res as TInitiativeResult) : undefined;
	}

	async delete(item: TInitiative, user: TUser): Promise<boolean | number> {
		try {
			const activeCount: number = await prismaClient.order.count({
				where: {
					initiativeId: item.id,
					status: OrderStatus.active
				},
			});
			if (activeCount > 0) return activeCount;
			await prismaClient.initiative.update({
				data: {
					isDeleted: true,
				},
				where: {
					id: item.id,
					Company: {
						usersId: user.id
					}
				}
			});
			return true;
		} catch (e) {
			return false
		}
	}

	async list(user: TUser): Promise<TInitiative[] | undefined> {
		try {
			const result = await prismaClient.initiative.findMany({
				where: {
					isDeleted: false,
					Company: {
						usersId: user.id
					}
				},
				select: selectFields,
			});
			return result.map(item => this.formatResult(item as TInitiativeResult));
		} catch (e) {
			return []
		}
	}

	async listAll(): Promise<TInitiative[] | undefined> {
		try {
			const result = await prismaClient.initiative.findMany({
				where: {
					isApproved: true,
					isDeleted: false,
				},
				select: selectFields,
				orderBy: {
					changedAt: 'desc'
				}
			});
			return result.map(item => this.formatResult(item as TInitiativeResult));
		} catch (e) {
			return []
		}
	}

	formatResult(item: TInitiativeResult): TInitiative {
		return {
			id: item?.id || 0,
			status: item?.status || false,
			direction: item.direction,
			isApproved: item.isApproved,
			isDeclined: item.isDeclined || false,
			declineReason: item.declineReason || '',
			name: item.name || '',
			text: item.text || '',
			promo: item.promo || undefined,
			type: {
				id: item.InitiativeTypes?.id || 0,
				name: item.InitiativeTypes?.name || '',
			},
			region: {
				id: item.Regions?.id,
				name: item.Regions?.name || '',
				slug: item.Regions?.slug || '',
				isActive: item.Regions?.isActive || false,
			},
			company: {
				id: item.Company?.id || 0,
				nameShort: item.Company?.nameShort || '',
				nameFull: item.Company?.nameFull || '',
				slug: item.Company?.slug || '',
			},
			photos: item.Photos || [],
			ordersCount: item._count?.Order || 0
		}
	}

	async save(item: TInitiativeWithID, user: TUser): Promise<boolean> {
		try {
			const photos = this.photosConnectOrCreate(item?.photos);
			await prismaClient.initiative.update({
				data: {
					status: item.status === 'true',
					direction: Number(item.direction),
					isApproved: false,
					isDeclined: false,
					name: item.name,
					text: item.text,
					changedAt: new Date(),
					initiativeTypesId: Number(item.type),
					companyId: Number(item.company),
					regionsId: Number(item.region),
					Photos: {
						connectOrCreate: photos
					}
				},
				where: {
					id: Number(item.id),
					Company: {
						Users: {
							id: user.id
						}
					}
				}
			});
			return true;
		} catch (e) {
			return false;
		}
	}

	async selectDeleted(time: Date): Promise<TInitiative[] | undefined> {
		try {
			const result = await prismaClient.initiative.findMany({
				where: {
					isDeleted: true,
					changedAt: {
						lte: time
					}
				},
				select: {
					id: true,
					Photos: {
						select: {
							id: true,
							path: true,
						}
					},
				}
			});
			return result.map(item => this.formatResult(item as TInitiativeResult));
		} catch (e) {
			return []
		}
	}

	async deleteMany(idList: number[]): Promise<void> {
		try {
			await prismaClient.initiative.deleteMany({
				where: { id: { in: idList }}
			});
		} catch (e) {
		}
	}

	async listByText(text: string, direction: number = 0): Promise<TInitiativeList | TClientDataError> {
		try {
			return await prismaClient.initiative.findMany({
				select: clientInitiativeFields,
				where: {
					status: true,
					isApproved: true,
					isDeleted: false,
					direction: direction,
					OR: [
						{
							name: {
								contains: text
							}
						},
						{
							text: {
								contains: text
							}
						},
					]
				},
				orderBy: { createdAt: 'desc' },
			});
		} catch (e) {
			return Promise.resolve( {
				message: 'Ошибка получения списка по тексту названия'
			});
		}
	}

	async listByType(typeId: number, direction?: number, regionId?: number, fnd?: string): Promise<TInitiativeList | TClientDataError> {
		try {
			const where: Prisma.InitiativeWhereInput = {
				status: true,
				isApproved: true,
				isDeleted: false,
				initiativeTypesId: Number(typeId),
			}
			if (direction) where.direction = Number(direction);
			if (regionId) where.regionsId = Number(regionId);
			if (fnd) {
				where.OR = [
					{ name: { contains: fnd } },
					{ text: { contains: fnd } },
				];
			}
			return await prismaClient.initiative.findMany({
				select: clientInitiativeFields,
				where: where,
				orderBy: { createdAt: 'desc' },
			});
		} catch (e) {
			console.log(e);
			return Promise.resolve( {
				message: 'Ошибка получения списка инициатив по типу'
			});
		}
	}
	async listByCompany(company: number): Promise<TInitiativeList | undefined> {
		try {
			return await prismaClient.initiative.findMany({
				select: clientInitiativeFields,
				where: {
					companyId: company,
					isApproved: true,
					isDeleted: false,
				},
				orderBy: { createdAt: 'desc' },
			});

		} catch (e) {
			return undefined
		}
	}

	async listPromo(): Promise<TInitiativeList | TClientDataError> {
		try {
			const current: Date = new Date();
			// Для начала отключаем все промо, где дата меньше текущей
			await prismaClient.initiative.updateMany({
				data: { promo: null },
				where: { promo: { lte: current }}
			});
			//  А потом, получаем список где дата промо больше текущей
			return await prismaClient.initiative.findMany({
				select: clientInitiativeFields,
				where: {
					promo: { gt: current },
					isApproved: true,
					isDeleted: false,
				},
				orderBy: { createdAt: 'desc' },
			});
		} catch (e) {
			return {
				message: 'Ошибка получения списка промо инициатив'
			}
		}
	}

	async moderationList(): Promise<TInitiative[] | undefined> {
		const result = await prismaClient.initiative.findMany({
			where: {
				isApproved: false,
				isDeleted: false,
				isDeclined: false,
			},
			select: selectFields,
		});
		return result.map(item => this.formatResult(item as TInitiativeResult));
	}

	async moderationApprove(id: number): Promise<boolean> {
		try {
			await prismaClient.initiative.update({
				where: { id },
				data: {
					isApproved: true,
					isDeclined: false,
					declineReason: ''
				}
			});
			return true;
		} catch (e) {
			return false;
		}
	}

	async moderationDecline(id: number, reason: string): Promise<boolean> {
		try {
			await prismaClient.initiative.update({
				where: { id },
				data: {
					isApproved: false,
					isDeclined: true,
					declineReason: reason
				}
			});
			return true;
		} catch (e) {
			return false;
		}
	}

	async get(id: number): Promise<TShortInitiative | undefined> {
		try {
			const result = await prismaClient.initiative.findFirst({
				select: {
					id: true,
					name: true
				},
				where: { id }
			});
			return result as TShortInitiative;
		} catch (e) {
			return undefined
		}
	}

	async calcRating(id: number): Promise<void>{
		try {
			const result = await prismaClient.reviews.groupBy({
				by: [ 'usersId' ],
				_avg: { rate: true },
				where: { initiativeId: id },
			});
			const sumRating = result.reduce((acc, current) => acc + (current._avg.rate || 0), 0)
			const averageRating = sumRating / result.length;
			await prismaClient.initiative.update({
				data: { rating: averageRating }, where: { id }
			})
		} catch (e) {

		}
	}

	async setPromo(id: number, isActivate: boolean = false): Promise<Date | null> {
		let promo: Date | null;
		try {
			if (isActivate) {
				promo = new Date();
				promo.setTime(Date.now() + ms('14d'));
			} else {
				promo = null
			}
			await prismaClient.initiative.update({
				data: { promo },
				where: { id },
			})
		} catch (e) {
			promo = null
		}
		return promo;
	}

	async saveInitiative(data: TManageInitiatives, companyId: number): Promise<boolean> {
		const found = await prismaClient.initiative.findFirst({
			select: { id: true },
			where: { name: data.name }
		});
		try {
			await prismaClient.initiative.upsert({
				where: { id: found?.id || 0 },
				create: {
					status: true,
					name: data.name,
					text: data.text,
					direction: data.direction,
					regionsId: data.regionId,
					initiativeTypesId: data.initiativeTypesId,
					isApproved: true,
					companyId,
				},
				update: {
					name: data.name,
					text: data.text,
					direction: data.direction,
					regionsId: data.regionId,
					initiativeTypesId: data.initiativeTypesId,
				},
			});
			return true;
		} catch(e) {
			return false;
		}
	}

}