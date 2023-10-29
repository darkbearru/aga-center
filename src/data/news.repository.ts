import { INewsRepository } from '~/src/data/news.repository.interface';
import { TPhotoItem, TPhotos } from '~/src/data/types/photos';
import { TNews } from './types/news';
import { prismaClient } from '~/src/utils/prismaClient';

type TPhotosLink = { create: { path: string, title: string }, where: any }[];


export class NewsRepository implements INewsRepository {
    async check(news: TNews): Promise<boolean> {
		const idQuery = typeof news.id !== 'undefined' ? { id: { not: news.id } } : {};
		const res = await prismaClient.news.findFirst({
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
		return prismaClient.news.count({});
	}

	async delete(news: TNews): Promise<boolean> {
		let result = true;
		try {
			await prismaClient.news.delete({
				where: { id: news.id }
			});
		} catch (e) {
			result = false;
		}
		return result;
	}

	async list(skip: number = 0, take: number = 20): Promise<TNews[] | undefined> {
		try {
			return await prismaClient.news.findMany({
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
			return await prismaClient.news.create({
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
			await prismaClient.news.update({
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
						title: item.title || '',
					},
					where: { id },
				});
			});
		}
		return items;
	}
}