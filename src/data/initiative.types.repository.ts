import { IInitiativeTypesRepository } from '~/src/data/initiative.types.repository.inerface';
import { TInitiativeTypes } from '~/src/data/types/initiatives.types';
import { PrismaClient } from '@prisma/client';

const prisma: PrismaClient = new PrismaClient();

export class InitiativeTypesRepository implements IInitiativeTypesRepository {
	async add(type: TInitiativeTypes): Promise<TInitiativeTypes> {
		return prisma.initiativeTypes.create({
			data: {
				name: type.name,
			}
		});
	}

	async check(type: TInitiativeTypes): Promise<boolean> {
		const idQuery = typeof type.id !== 'undefined' ? { id: { not: type.id } } : {};
		const res = await prisma.initiativeTypes.findFirst({
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
			await prisma.initiativeTypes.delete({
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
			return await prisma.initiativeTypes.findMany({
				orderBy: { name: 'asc' },
			});
		} catch (e) {
			return undefined
		}
	}

	async save(type: TInitiativeTypes): Promise<boolean> {
		try {
			await prisma.initiativeTypes.update({
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