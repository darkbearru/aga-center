import type { IReviewsRepository } from '~/src/data/reviews.repository.interface';
import type { TReviewList, TReviews } from '~/src/data/types/reviews';
import { prismaClient } from '~/src/utils/prismaClient';

export class ReviewsRepository implements IReviewsRepository {
	async add(item: TReviews): Promise<boolean> {
		await prismaClient.reviews.create({
			data: {
				review: item.review,
				rate: item.rate,
				initiativeId: item.initiative?.id,
				usersId: item.user?.id
			}
		});
		return Promise.resolve(false);
	}

	async list(): Promise<TReviewList | null> {
		return prismaClient.reviews.findMany({
			select: {
				review: true,
				rate: true,
				createdAt: true,
				Users: {
					select: {
						email: true,
						fio: true
					}
				},
				Initiative: {
					select: {
						name: true,
					}
				}
			},
			where: {
				Users: {
					isClient: true
				}
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: 12
		});
	}

	async listByCompany(companyId: number): Promise<TReviewList | null> {
		return Promise.resolve(null);
	}

	async listByInitiative(initiativeId: number): Promise<TReviewList | null> {
		return Promise.resolve(null);
	}


}