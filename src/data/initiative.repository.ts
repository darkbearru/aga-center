import { IInitiativeRepository } from '~/src/data/initiative.repository.interface';
import { TInitiative } from '~/src/data/types/initiatives';
import { Prisma, PrismaClient } from '@prisma/client';
// import InitiativeWhereInput = Prisma.InitiativeWhereInput;
import { TUser } from '~/src/users/types/users';

const prisma: PrismaClient = new PrismaClient({ log: ['query'] });

export class InitiativeRepository implements IInitiativeRepository {
	async add(item: TInitiative): Promise<TInitiative | undefined> {
		const created = await prisma.initiative.create({
			data: {
				status: item.status,
				direction: item.direction,
				name: item.name,
				text: item.text,
				isApproved: false,
				InitiativeTypes: {
					connect: {
						id: item.type.id
					}
				},
				Company: {
					connect: {
						id: item.company.id,
					}
				},
				Regions: {
					connect: {
						id: item.region.id
					}
				}
			}
		});
		return await this.select(created.id);
	}

	async select(id: number): Promise<TInitiative> {
		const result = await prisma.initiative.findFirst({
			where: { id },
			select: {
				status: true,
				direction: true,
				name: true,
				text: true,
				isApproved: true,
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
				}
			}
		});
		return {
			id,
			status: result?.status || true,
			direction: result?.direction || 0,
			name: result?.name || '',
			text: result?.text || '',
			isApproved: result?.isApproved || false,
			type: {
				id: result?.InitiativeTypes?.id || 0,
				name: result?.InitiativeTypes?.name || '',
			},
			region: {
				id: result?.Regions?.id || 0,
				name: result?.Regions?.name || '',
				slug: result?.Regions?.slug || '',
				isActive: result?.Regions?.isActive || false
			},
			company: {
				id: result?.Company?.id || 0,
				nameShort: result?.Company?.nameShort || '',
				nameFull: result?.Company?.nameFull || '',
			}
		}
	}


	async check(item: TInitiative): Promise<boolean> {
		const idQuery = typeof item.id !== 'undefined' ? { id: { not: item.id } } : {};
		const res = await prisma.initiative.findFirst({
			where: {
				AND: [
					{ name: item.name },
					{ regionsId: item.region.id || 0 },
					idQuery,
				]
			}
		});
		return !res;
	}

	async delete(item: TInitiative, user: TUser): Promise<boolean> {
		try {
			await  prisma.initiative.delete({
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
		const result = await prisma.initiative.findMany({
			select: {
				id: true,
				status: true,
				direction: true,
				name: true,
				text: true,
				isApproved: true,
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
			},
			where: {
				Company: {
					usersId: user.id
				}
			}
		});
		return result.map(item => {
			return {
				id: item.id,
				status: item.status,
				direction: item.direction,
				isApproved: item.isApproved,
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
			}
		});
	}

	async save(item: TInitiative, user: TUser): Promise<boolean> {
		try {
			await prisma.initiative.update({
				data: {
					status: item.status,
					direction: item.direction,
					name: item.name,
					text: item.text,
					initiativeTypesId: item.type.id,
					companyId: item.company.id,
					regionsId: item.region.id
				},
				where: {
					id: item.id,
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

}