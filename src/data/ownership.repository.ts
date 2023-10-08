import { IOwnershipRepository } from '~/src/data/ownership.repository.interface';
import { TOwnership } from '~/src/data/types/ownership';
import { PrismaClient } from '@prisma/client';

const prisma: PrismaClient = new PrismaClient();

export class OwnershipRepository implements IOwnershipRepository {
	async add(ownership: TOwnership): Promise<TOwnership> {
		return prisma.typeOwnership.create({
			data: {
				nameShort: ownership.nameShort,
				nameFull: ownership.nameFull,
			}
		});
	}

	async check(ownership: TOwnership): Promise<boolean> {
		const idQuery = typeof ownership.id !== 'undefined' ? { id: { not: ownership.id } } : {};
		const res = await prisma.typeOwnership.findFirst({
			where: {
				AND: [
					{ nameShort: ownership.nameShort },
					idQuery,
				]
			}
		});
		return !res;
	}

	async delete(ownership: TOwnership): Promise<boolean> {
		try {
			await prisma.typeOwnership.delete({
				where: {
					id: ownership.id
				}
			});
			return true;
		} catch (e) {
			return false;
		}
	}

	async list(): Promise<TOwnership[] | undefined> {
		try {
			return await prisma.typeOwnership.findMany({
				orderBy: { nameShort: 'asc' },
			});
		} catch (e) {
			return undefined
		}
	}

	async save(ownership: TOwnership): Promise<boolean> {
		try {
			await prisma.typeOwnership.update({
				data: {
					nameShort: ownership.nameShort,
					nameFull: ownership.nameFull,
				},
				where: {
					id: ownership.id
				}
			});
			return true;
		} catch (e) {
			return false;
		}
	}
}