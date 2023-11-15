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
					active: article.active === 'true',
					Photos: {
						connectOrCreate: items,
					}
				},
			});
		} catch (e) {
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
			return await prismaClient.articles.findMany({
				select: {
					id: true,
					slug: true,
					title: true,
					active: true,
					text: !client,
				},
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

	async save(article: TArticle | TArticleFormData): Promise<boolean> {
		const items: TPhotosLink = this.makePhotosLink(article.photos, Number(article.id));
		try {
			await prismaClient.articles.update({
				where: { id: Number(article.id) },
				data: {
					title: article.title,
					slug: article.slug,
					text: article.text,
					active: article.active === 'true',
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

	async text(slug: string): Promise<TArticle | undefined> {
		try {
			return await prismaClient.articles.findFirst({
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
		} catch (e) {
			return undefined
		}
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