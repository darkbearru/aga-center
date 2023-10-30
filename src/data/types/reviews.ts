import type { TInitiative } from '~/src/data/types/initiatives';

export type TReviews = {
	id?: number,
	title: string,
	review: string,
	rate?: number,
	initiative?: TInitiative,
}

export type TReviewListItem = {
	id: number,
	createdAt: Date,
	title: string | null,
	review: string | null,
	rate: number | null
}
export type TReviewList = TReviewListItem[];
