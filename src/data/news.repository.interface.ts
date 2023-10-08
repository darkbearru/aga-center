import { News } from '.prisma/client';
import { TNews } from '~/src/data/types/news';

export interface INewsRepository {
	list(skip: number, take: number): Promise<News[] | undefined>;
	count(): Promise<number>;
	save(news: TNews): Promise<boolean>;
	add(news: TNews): Promise<TNews | boolean>;
	delete(news: TNews): Promise<boolean>;
	check(news: TNews): Promise<boolean>;
}