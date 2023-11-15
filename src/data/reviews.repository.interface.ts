import type { TReviewList, TReviews } from '~/src/data/types/reviews';

export interface IReviewsRepository {
	list(): Promise<TReviewList | null>;
	listByInitiative(initiativeId: number): Promise<TReviewList | null>;
	listByCompany(companyId: number): Promise<TReviewList | null>;
	add(review: TReviews): Promise<boolean>;
}