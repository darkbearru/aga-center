import { News } from '.prisma/client';
import { TPhotos } from '~/src/data/types/photos';

export interface INewsRepository {
	list(skip: number, take: number): Promise<News[] | undefined>;
	count(): Promise<number>;
	saveItem(title: string, slug: string, text: string, photos: TPhotos, id?: number): Promise<boolean>;
	newItem(title: string, slug: string, text: string, photos: TPhotos): Promise<boolean>;
	deleteItem(id: number): Promise<boolean>;
}