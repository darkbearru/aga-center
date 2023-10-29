import { IInitiativeRepository } from '~/src/data/initiative.repository.interface';
import { TInitiative, TInitiativeList, TInitiativeResult, TInitiativeWithID } from '~/src/data/types/initiatives';
import { Prisma, PrismaClient } from '@prisma/client';
import { TUser } from '~/src/users/types/users';
import { TPhotoItem, TPhotos } from '~/src/data/types/photos';
import { OrderStatus } from '~/src/data/types/order';
import { TClientDataError } from '~/src/data/types/common.data';

const prisma: PrismaClient = new PrismaClient();
// const prisma: PrismaClient = new PrismaClient({ log: ['query'] });

const selectFields = {
	id: true,
	status: true,
	direction: true,
	name: true,
	text: true,
	isApproved: true,
	isDeclined: true,
	declineReason: true,
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
	Photos: {
		select: {
			id: true,
			path: true,
		}
	},
	Reviews: {
		select: {
			id: true,
			title: true,
			review: true,
			rate: true,
			createdAt: true,
		}
	},
	Company: {
		select: {
			id: true,
			nameShort: true,
			nameFull: true,
			typeOwnership: true
		}
	}
};

export class InitiativeRepository implements IInitiativeRepository {
	async add(item: TInitiativeWithID): Promise<TInitiative | undefined> {
		const photos: Prisma.PhotosCreateOrConnectWithoutInitiativeInput[] = this.photosConnectOrCreate(item?.photos);

		const created = await prisma.initiative.create({
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

	private photosConnectOrCreate(photos?: TPhotos): Prisma.PhotosCreateOrConnectWithoutInitiativeInput[] {
		const result: Prisma.PhotosCreateOrConnectWithoutInitiativeInput[] = [];
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
		const result = await prisma.initiative.findFirst({
			where: { id },
			select: selectFields,
		});
		return this.formatResult(result as TInitiativeResult)
	}

	async check(item: TInitiativeWithID): Promise<TInitiative | undefined> {
		const idQuery = typeof item.id !== 'undefined' ? { id: { not: Number(item.id) } } : {};
		const res = await prisma.initiative.findFirst({
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
			const activeCount: number = await prisma.order.count({
				where: {
					initiativeId: item.id,
					status: OrderStatus.active
				},
			});
			if (activeCount > 0) return activeCount;
			await  prisma.initiative.update({
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
			const result = await prisma.initiative.findMany({
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
				nameFull: item.Company?.nameFull || ''
			},
			photos: item.Photos || [],
			ordersCount: item._count?.Order || 0
		}
	}

	async save(item: TInitiativeWithID, user: TUser): Promise<boolean> {
		try {
			const photos: Prisma.PhotosCreateOrConnectWithoutInitiativeInput[] = this.photosConnectOrCreate(item?.photos);
			await prisma.initiative.update({
				data: {
					status: item.status === 'true',
					direction: Number(item.direction),
					isApproved: false,
					isDeclined: false,
					declineReason: '',
					name: item.name,
					text: item.text,
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

	async deletePhotos(photos: TPhotos): Promise<void> {
		if (!photos.length) return;

		const idList: number[] = [];
		let where: Prisma.PhotosWhereInput;
		if (photos.length > 1) {
			photos.forEach((item: TPhotoItem) => {
				if (item.id) idList.push(item.id);
			});
			if (idList.length === 0) return;
			const OR: Prisma.PhotosWhereInput[] = idList.map(id => { return { id } });
			where = { OR };
			console.log('deletePhotos', OR);
		} else {
			where = { id: photos[0].id }
		}
		console.log('deletePhotos', where);

		try {
			const result = await prisma.photos.deleteMany({ where });
		} catch (e) {
			console.log(e);
		}
	}

	async selectDeleted(time: Date): Promise<TInitiative[] | undefined> {
		console.log({
			where: {
				isDeleted: true,
				changedAt: {
					gte: time
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
		try {
			const result = await prisma.initiative.findMany({
				where: {
					isDeleted: true,
					changedAt: {
						gte: time
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
		let where: Prisma.InitiativeWhereInput;
		if (idList.length > 1) {
			const OR: Prisma.InitiativeWhereInput[] = idList.map(id => { return { id } });
			where = { OR };
			console.log('deleteMany 1', OR);
		} else {
			where = { id: idList[0] }
		}
		console.log('deleteMany 2');
		console.log({ where });
		return ;
		try {
			await prisma.initiative.deleteMany({ where });
		} catch (e) {
		}
	}

	async listByText(text: string, direction: number = 0): Promise<TInitiativeList | TClientDataError> {
		try {
			return await prisma.initiative.findMany({
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

	async listByType(typeId: number): Promise<TInitiativeList | TClientDataError> {
		try {
			return await prisma.initiative.findMany({
				select: clientInitiativeFields,
				where: {
					status: true,
					isApproved: true,
					isDeleted: false,
					initiativeTypesId: Number(typeId)
				},
				orderBy: { createdAt: 'desc' },
			});
		} catch (e) {
			console.log(e);
			return Promise.resolve( {
				message: 'Ошибка получения списка инициатив по типу'
			});
		}
	}

	async moderationList(): Promise<TInitiative[] | undefined> {
		const result = await prisma.initiative.findMany({
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
			await prisma.initiative.update({
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
			await prisma.initiative.update({
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


}