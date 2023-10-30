import type { TNews } from '~/src/data/types/news';

export interface INewsRepository {
	list(skip: number, take: number): Promise<TNews[] | undefined>;
	count(): Promise<number>;
	save(news: TNews): Promise<boolean>;
	add(news: TNews): Promise<TNews | boolean>;
	delete(news: TNews): Promise<boolean>;
	check(news: TNews): Promise<boolean>;
}