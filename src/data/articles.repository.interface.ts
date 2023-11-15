import type { TArticle, TArticles, TArticleFormData } from '~/src/data/types/articles';

export interface IArticlesRepository {
	list(skip: number, take: number): Promise<TArticles | undefined>;
	count(): Promise<number>;
	save(article: TArticle | TArticleFormData): Promise<boolean>;
	add(article: TArticle | TArticleFormData): Promise<TArticle | boolean>;
	delete(article: TArticle): Promise<boolean>;
	check(article: TArticle | TArticleFormData): Promise<boolean>;
	text(slug: string): Promise<TArticle | undefined>
}