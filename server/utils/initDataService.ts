import { NewsRepository } from '~/src/data/news.repository';
import { RegionsRepository } from '~/src/data/regions.repository';
import { InitiativeTypesRepository } from '~/src/data/initiative.types.repository';
import { InitiativeRepository } from '~/src/data/initiative.repository';
import { DataService } from '~/src/services/data/data.service';

export type TQueryParams = {
	category: string;
	params?: Record<string, any>
}

export function initDataService(): DataService {
	return new DataService(
		new NewsRepository(),
		new RegionsRepository(),
		new InitiativeTypesRepository(),
		new InitiativeRepository(),
	);
}

export function extractParams(url: string | undefined): TQueryParams {
	if (typeof url === 'undefined') return { category: ''};
	let urlParts = url.split('/');
	const category: string = urlParts.length > 0 ? urlParts[0] : '';
	const params: Record<string, any> = {}
	urlParts = urlParts.slice(1);
	for(let i: number = 0, len: number = urlParts.length; i < len; i++) {
		params[urlParts[i]] = typeof urlParts[i + 1] !== 'undefined' ? urlParts[i + 1] : undefined;
		i++;
	}
	return { category, params }
}