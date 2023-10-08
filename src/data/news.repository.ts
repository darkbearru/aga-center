import { INewsRepository } from '~/src/data/news.repository.interface';
import { News, Prisma } from '.prisma/client';
import { PrismaClient } from '@prisma/client';
import { TPhotoItem, TPhotos } from '~/src/data/types/photos';
import PhotosWhereUniqueInput = Prisma.PhotosWhereUniqueInput;
import { TNews } from './types/news';

type TPhotosLink = { create: { path: string, title: string }, where: PhotosWhereUniqueInput }[];

const prisma = new PrismaClient();

export class NewsRepository implements INewsRepository {
    async check(news: TNews): Promise<boolean> {
		const idQuery = typeof news.id !== 'undefined' ? { id: { not: news.id } } : {};
		const res = await prisma.news.findFirst({
			where: {
				AND: [
					{ title: news.title },
					idQuery,
				]
			}
		});
		return !res;
    }

	async count(): Promise<number> {
		return prisma.news.count({});
	}

	async delete(news: TNews): Promise<boolean> {
		let result = true;
		try {
			await prisma.news.delete({
				where: { id: news.id }
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
				orderBy: {
					createdAt: 'desc'
				}
			});
		} catch (e) {
			return undefined
		}
	}

	async add(news: TNews): Promise<TNews | boolean> {
		const items: TPhotosLink = this.makePhotosLink(news.photos);
		try {
			return await prisma.news.create({
				data: {
					title: news.title,
					slug: news.slug,
					text: news.text,
					active: news.active,
					Photos: {
						connectOrCreate: items,
					}
				},
			});
		} catch (e) {
			return false;
		}
	}

	async save(news: TNews): Promise<boolean> {
		const items: TPhotosLink = this.makePhotosLink(news.photos, news.id);
		try {
			await prisma.news.update({
				where: { id: news.id },
				data: {
					title: news.title,
					slug: news.slug,
					text: news.text,
					active: news.active,
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

	private makePhotosLink(photos?: TPhotos, id?: number): TPhotosLink {
		const items: TPhotosLink = [];
		if (photos) {
			photos.forEach((item: TPhotoItem) => {
				items.push({
					create: {
						path: item.path,
						title: item.title,
					},
					where: { id },
				});
			});
		}
		return items;
	}
}