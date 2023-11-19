import type { IArticlesRepository } from '~/src/data/articles.repository.interface';
import type { TArticle, TArticleFormData, TArticles } from '~/src/data/types/articles';
import { prismaClient } from '~/src/utils/prismaClient';
import type { TPhotoItem, TPhotos } from '~/src/data/types/photos';

type TPhotosLink = { create: { path: string, title: string }, where: any }[];

export class ArticlesRepository implements IArticlesRepository {
	async add(article: TArticle | TArticleFormData): Promise<TArticle | boolean> {
		const items: TPhotosLink = this.makePhotosLink(article.photos);
		try {
			return await prismaClient.articles.create({
				data: {
					title: article.title,
					slug: article.slug,
					text: article.text,
					active: article.active === true,
					Photos: {
						connectOrCreate: items,
					}
				},
			});
		} catch (e) {
			console.log(e);
			return false;
		}
	}

	async check(article: TArticle | TArticleFormData): Promise<boolean> {
		const idQuery = typeof article.id !== 'undefined' ? { id: { not: Number(article.id) } } : {};
		const res = await prismaClient.articles.findFirst({
			where: {
				AND: [
					{
						OR: [
							{ title: article.title },
							{ slug: article.slug },
						]
					},
					idQuery,
				]
			}
		});
		return !res;
	}

	async count(): Promise<number> {
		return prismaClient.articles.count({});
	}

	async delete(article: TArticle): Promise<boolean> {
		let result = true;
		try {
			await prismaClient.articles.delete({
				where: { id: article.id }
			});
		} catch (e) {
			result = false;
		}
		return result;
	}

	async list(skip: number, take: number, client: boolean = false): Promise<TArticles | undefined> {
		try {
			const result = await prismaClient.articles.findMany({
				select: {
					id: true,
					slug: true,
					title: true,
					active: true,
					text: !client,
					Photos: {
						select: {
							id: true,
							path: true,
						}
					}
				},
				skip,
				take,
				orderBy: {
					createdAt: 'desc'
				}
			});
			return result.map(item => {
				return {
					id: item.id,
					slug : item.slug,
					title: item.title,
					active: item.active,
					text: item.text || '',
					photos: item.Photos || []
				}
			})
		} catch (e) {
			return undefined
		}
	}

	async save(article: TArticle | TArticleFormData): Promise<boolean> {
		const items: TPhotosLink = this.makePhotosLink(article.photos);
		try {
			await prismaClient.articles.update({
				where: { id: Number(article.id) },
				data: {
					title: article.title,
					slug: article.slug,
					text: article.text,
					active: article.active === true,
					Photos: {
						connectOrCreate: items,
					}
				},
			});
		} catch (e) {
			console.log(e);
			return false;
		}
		return true;
	}

	async text(slug: string): Promise<TArticle | undefined> {
		try {
			const item = await prismaClient.articles.findFirst({
				where: { slug, active: true },
				select: {
					slug: true,
					title: true,
					text: true,
					Photos: {
						select: {
							id: true,
							path: true
						}
					}
				}
			}) || undefined;
			if (!item) return item;
			return {
				slug: item.slug,
				title: item.title,
				text: item.text,
				photos: item.Photos || []
			}
		} catch (e) {
			return undefined
		}
	}

	private makePhotosLink(photos?: TPhotos): TPhotosLink {
		const items: TPhotosLink = [];
		if (photos) {
			photos.forEach((item: TPhotoItem) => {
				items.push({
					where: { id: item.id || 0},
					create: {
						path: item.path,
						title: item.title || '',
					},
				});
			});
		}
		return items;
	}

}