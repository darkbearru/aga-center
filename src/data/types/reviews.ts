import type { TInitiative } from '~/src/data/types/initiatives';
import type { TUser } from '~/src/users/types/users';

export type TReviews = {
	id?: number,
	review: string,
	rate?: number,
	initiative?: TInitiative,
	user?: TUser
}

export type TReviewListItem = {
	id?: number,
	createdAt: Date,
	review: string | null,
	rate: number | null,
	Initiative: { name: string } | null,
	Users: TUser | null,
}
export type TReviewList = TReviewListItem[];
