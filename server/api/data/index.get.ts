import { DataService } from '~/src/services/data/data.service';
import { initDataService } from '~/server/utils/initDataService';
import type { TClientData } from '~/src/data/types/common.data';

export default defineEventHandler(
	async (): Promise<TClientData> => {
		const dataService:DataService = initDataService();
		return await dataService.data();
	}
);