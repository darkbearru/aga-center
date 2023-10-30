import type { TPhotos } from '~/src/data/types/photos';

export type TNews = {
	id?: number,
	active: boolean,
	title: string,
	slug: string,
	text: string | null,
	date: Date,
	photos?: TPhotos,
};

export type TNewsResponse = {
	errors?: {
		title?: string,
		slug?: string,
		text?: string,
		other?: string
	}
	news: TNews,
}

export type TNewsTime = {
	timeInfo?: string,
	timeShort?: string
}

export type TNewsList = (TNews & TNewsTime)[];
