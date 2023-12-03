import type { IInitiativeTypesRepository } from '~/src/data/initiative.types.repository.inerface';
import type { TInitiativeTypes } from '~/src/data/types/initiatives.types';
import { prismaClient } from '~/src/utils/prismaClient';
import { numberSuffix } from '~/src/utils/numberSuffix';
import { Prisma } from '.prisma/client';

export class InitiativeTypesRepository implements IInitiativeTypesRepository {
    async listGroup(direction: number = 0, region: number = 1, fnd?: string): Promise<TInitiativeTypes[] | undefined> {
		try {
			const typeWhere: Prisma.InitiativeTypesWhereInput = {}
			const where: Prisma.InitiativeWhereInput = {
				direction: Number(direction),
				// regionsId: region,
				isApproved: true,
				isDeleted: false,
			};
			if (fnd) {
				// typeWhere.name = { contains: fnd }
				where.OR = [
					{ name: { contains: fnd } },
					{ text: { contains: fnd } },
				];
			}
			const result = await prismaClient.initiativeTypes.findMany({
				select: {
					id: true,
					name: true,
					Initiative: {
						select: {
							id: true
						},
						where
					},
					_count: {
						select: {
							Initiative: { where }
						}
					},
				},
				where: typeWhere,
				orderBy: { name: 'asc' },
			});
			return result.map((item) => {
				return {
					id: item.id,
					name: item.name,
					count: item._count.Initiative,
					countStr: numberSuffix(item._count.Initiative, 'инициатив', 'а', 'ы', '')
				}
			}).filter(item => item.count > 0);
		} catch (e) {
			console.log(e);
			return undefined
		}
    }

	async add(type: TInitiativeTypes): Promise<TInitiativeTypes> {
		return prismaClient.initiativeTypes.create({
			data: {
				name: type.name,
			}
		});
	}

	async check(type: TInitiativeTypes): Promise<boolean> {
		const idQuery = typeof type.id !== 'undefined' ? { id: { not: type.id } } : {};
		const res = await prismaClient.initiativeTypes.findFirst({
			where: {
				AND: [
					{ name: type.name },
					idQuery,
				]
			}
		});
		return !res;
	}

	async delete(type: TInitiativeTypes): Promise<boolean> {
		try {
			await prismaClient.initiativeTypes.delete({
				where: {
					id: type.id
				}
			});
			return true;
		} catch (e) {
			return false;
		}
	}

	async list(): Promise<TInitiativeTypes[] | undefined> {
		try {
			return await prismaClient.initiativeTypes.findMany({
				orderBy: { name: 'asc' },
			});
		} catch (e) {
			return undefined
		}
	}

	async save(type: TInitiativeTypes): Promise<boolean> {
		try {
			await prismaClient.initiativeTypes.update({
				data: {
					name: type.name,
				},
				where: {
					id: type.id
				}
			});
			return true;
		} catch (e) {
			return false;
		}
	}

}