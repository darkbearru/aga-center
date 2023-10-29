import { IOwnershipRepository } from '~/src/data/ownership.repository.interface';
import { TOwnership } from '~/src/data/types/ownership';
import { prismaClient } from '~/src/utils/prismaClient';


export class OwnershipRepository implements IOwnershipRepository {
	async add(ownership: TOwnership): Promise<TOwnership> {
		return prismaClient.typeOwnership.create({
			data: {
				nameShort: ownership.nameShort,
				nameFull: ownership.nameFull,
			}
		});
	}

	async check(ownership: TOwnership): Promise<boolean> {
		const idQuery = typeof ownership.id !== 'undefined' ? { id: { not: ownership.id } } : {};
		const res = await prismaClient.typeOwnership.findFirst({
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
			await prismaClient.typeOwnership.delete({
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
			return await prismaClient.typeOwnership.findMany({
				orderBy: { nameShort: 'asc' },
			});
		} catch (e) {
			return undefined
		}
	}

	async save(ownership: TOwnership): Promise<boolean> {
		try {
			await prismaClient.typeOwnership.update({
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