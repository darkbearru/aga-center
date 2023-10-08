import { IRegionsRepository } from '~/src/data/regions.repositiory.interface';
import { PrismaClient } from '@prisma/client';
import { TRegion } from '~/src/data/types/regions';

const prisma: PrismaClient = new PrismaClient();

export class RegionsRepository implements IRegionsRepository {
	async add(region: TRegion): Promise<TRegion> {
		return prisma.regions.create({
			data: {
				name: region.name,
				slug: region.slug,
				isActive: region.isActive,
			}
		});
	}

	async delete(region: TRegion): Promise<boolean> {
		try {
			await prisma.regions.delete({
				where: {
					id: region.id
				}
			});
			return true;
		} catch (e) {
			return false;
		}
	}

	async list(): Promise<TRegion[] | undefined> {
		try {
			return await prisma.regions.findMany({
				orderBy: [
					{ isActive: 'desc' },
					{ name: 'asc' },
				]
			});
		} catch (e) {
			return undefined
		}
	}

	async save(region: TRegion): Promise<boolean> {
		try {
			await prisma.regions.update({
				data: {
					name: region.name,
					slug: region.slug,
					isActive: region.isActive,
				},
				where: {
					id: region.id
				}
			});
			return true;
		} catch (e) {
			return false;
		}
	}

	async checkSlug(region: TRegion): Promise<boolean> {
		const idQuery = typeof region.id !== 'undefined' ? { id: { not: region.id } } : {};
		const res = await prisma.regions.findFirst({
			where: {
				AND: [
					{ slug: region.slug },
					idQuery,
				]
			}
		});
		return !res;
	}


}