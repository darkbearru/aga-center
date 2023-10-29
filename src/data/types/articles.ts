import type { TPhotos } from '~/src/data/types/photos';

export type TArticle = {
	id?: number;
	title: string,
	text: string,
	photos?: TPhotos
}

export type TArticles = TArticle[];