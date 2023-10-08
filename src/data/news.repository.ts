import { INewsRepository } from '~/src/data/news.repository.interface';
import { News, Prisma } from '.prisma/client';
import { PrismaClient } from '@prisma/client';
import { TPhotos } from '~/src/data/types/photos';
import PhotosWhereUniqueInput = Prisma.PhotosWhereUniqueInput;

type TPhotosLink = {create: {path: string, title: string}, where: PhotosWhereUniqueInput}[];

const prisma = new PrismaClient();

export class NewsRepository implements INewsRepository {
	async count(): Promise<number> {
		return prisma.news.count({});
	}

	async deleteItem(id: number): Promise<boolean> {
		let result = true;
		try {
			await prisma.news.delete({
				where: { id }
			});
		} catch (e) {
			result = false;
		}
		return result;
	}

	async list(skip: number = 0, take: number = 20): Promise<News[] | undefined> {
		try {
			return await prisma.news.findMany({
				where: { active: true },
				skip,
				take,
			});
		} catch (e) {
			return undefined
		}
	}

	async newItem(title: string, slug: string, text: string, photos: TPhotos): Promise<boolean> {
		const items: TPhotosLink = this.makePhotosLink(photos);
		try {
			await prisma.news.create({
				data: {
					title, slug, text,
					active: true,
					Photos: {
						connectOrCreate: items,
					}
				},
			});
		} catch (e) {
			return false;
		}
		return true;
	}

	async saveItem(title: string, slug: string, text: string, photos: TPhotos, id?: number): Promise<boolean> {
		const items: TPhotosLink = this.makePhotosLink(photos, id);
		try {
			await prisma.news.update({
				where: { id },
				data: {
					title, slug, text,
					active: true,
					Photos: {
						connectOrCreate: items,
					}
				},
			});
		} catch (e) {
			return false;
		}
		return true;
	}

	private makePhotosLink(photos: TPhotos, id?: number): TPhotosLink {
		const items: TPhotosLink = [];
		photos.forEach((item) => {
			items.push({
				create: {
					path: item.path,
					title: item.title,
				},
				where: { id },
			});
		});
		return items;
	}
}