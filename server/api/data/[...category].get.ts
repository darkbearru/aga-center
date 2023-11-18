import { H3Event } from 'h3';
import { extractParams, initDataService } from '~/server/utils/initDataService';
import type { TQueryParams } from '~/server/utils/initDataService';
import { DataService } from '~/src/services/data/data.service';


export default defineEventHandler(
	async (event: H3Event) => {
		const dataService:DataService = initDataService();
		const data: TQueryParams = extractParams(event.context.params?.category);

		switch (data.category) {
			case 'news': {
				return dataService.news(data.params?.page, data.params?.slug);
			}
			case 'initiative': {
				return dataService.initiatives(
					data.params?.type,
					data.params?.direction,
					data.params?.region,
					data.params?.text
				);
			}
			case 'companies': {
				return dataService.companies(data.params?.slug);
			}
			case 'promo': {
				return dataService.initiativesPromo();
			}
			case 'types': {
				return dataService.types(data.params?.direction, undefined, data.params?.text);
			}
			case 'search': {
				return dataService.search(data.params?.text, data.params?.direction);
			}
			default: {
				throw createError({
					statusCode: 404,
					message: 'Data not found',
				});
			}
		}
	}
);