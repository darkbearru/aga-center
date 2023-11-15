import type { TPhotos } from '~/src/data/types/photos';

export type TArticle = {
	id?: number;
	active?: boolean,
	title: string,
	text: string | null,
	slug: string,
	photos?: TPhotos
}

export type TArticleFormData = {
	id?: string;
	active?: string,
	title: string,
	text: string | null,
	slug: string,
	photos?: TPhotos
}

export type TArticles = TArticle[];

export type TArticleResponse = {
	errors?: {
		title?: string,
		slug?: string,
		text?: string,
		other?: string
	}
	article: TArticle | TArticleFormData,
}