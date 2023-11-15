import { AdminService } from '~/src/services/admin/admin.service';
import { NewsRepository } from '~/src/data/news.repository';
import { UsersRepository } from '~/src/users/users.repository';
import { RegionsRepository } from '~/src/data/regions.repository';
import { H3Event } from 'h3';
import { OwnershipRepository } from '~/src/data/ownership.repository';
import { InitiativeTypesRepository } from '~/src/data/initiative.types.repository';
import { CompanyRepository } from '~/src/data/company.repository';
import { InitiativeRepository } from '~/src/data/initiative.repository';
import { ArticlesRepository } from '~/src/data/articles.repository';
import { PhotosRepository } from '~/src/data/photos.repository';
import { OrdersRepository } from '~/src/data/orders.repository';
import { ReviewsRepository } from '~/src/data/reviews.repository';

export function initAdminService(event: H3Event): AdminService {
	return new AdminService(
		event.context.user,
		new NewsRepository(),
		new ArticlesRepository(),
		new UsersRepository(),
		new RegionsRepository(),
		new OwnershipRepository(),
		new InitiativeTypesRepository(),
		new CompanyRepository(),
		new InitiativeRepository(),
		new PhotosRepository(),
		new OrdersRepository(),
		new ReviewsRepository(),
	);
}