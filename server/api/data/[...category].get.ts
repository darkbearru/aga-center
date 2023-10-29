import { H3Event } from 'h3';
import { extractParams, initDataService, TQueryParams } from '~/server/utils/initDataService';
import { DataService } from '~/src/services/data/data.service';
import { TInitiativeTypes } from '~/src/data/types/initiatives.types';


export default defineEventHandler(
	async (event: H3Event) => {
		const dataService:DataService = initDataService();
		const data: TQueryParams = extractParams(event.context.params?.category);

		switch (data.category) {
			case 'news': {
				return dataService.news(data.params?.page, data.params?.id);
			}
			case 'initiative': {
				return dataService.initiatives(data.params?.type);
			}
			case 'types': {
				return dataService.types(data.params?.direction);
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