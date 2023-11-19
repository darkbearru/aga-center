import { NewsRepository } from '~/src/data/news.repository';
import { RegionsRepository } from '~/src/data/regions.repository';
import { InitiativeTypesRepository } from '~/src/data/initiative.types.repository';
import { InitiativeRepository } from '~/src/data/initiative.repository';
import { DataService } from '~/src/services/data/data.service';
import { UsersRepository } from '~/src/users/users.repository';
import { EmailService } from '~/src/services/email/email.service';
import { OrdersRepository } from '~/src/data/orders.repository';
import { CompanyRepository } from '~/src/data/company.repository';
import { ReviewsRepository } from '~/src/data/reviews.repository';
import { ArticlesRepository } from '~/src/data/articles.repository';

export type TQueryParams = {
	category: string;
	params?: Record<string, any>
}

export function initDataService(): DataService {
	return new DataService(
		new NewsRepository(),
		new ArticlesRepository(),
		new RegionsRepository(),
		new InitiativeTypesRepository(),
		new InitiativeRepository(),
		new CompanyRepository(),
		new UsersRepository(),
		new OrdersRepository(),
		new ReviewsRepository(),
		new EmailService(),
	);
}

export function extractParams(url: string | undefined): TQueryParams {
	if (typeof url === 'undefined') return { category: ''};
	let urlParts = url.split('/');
	const category: string = urlParts.length > 0 ? urlParts[0] : '';
	const params: Record<string, any> = {}
	urlParts = urlParts.slice(1);
	for(let i: number = 0, len: number = urlParts.length; i < len; i++) {
		params[urlParts[i]] = typeof urlParts[i + 1] !== 'undefined' ? decodeURIComponent(urlParts[i + 1]) : undefined;
		i++;
	}
	return { category, params }
}