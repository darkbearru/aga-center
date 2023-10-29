import { type IDataService } from '~/src/services/data/data.service.interface';
import { type TClientData, type TClientDataError } from '~/src/data/types/common.data';
import { type TInitiativeTypes } from '~/src/data/types/initiatives.types';
import { type TInitiativeList } from '~/src/data/types/initiatives';
import { type TNews } from '~/src/data/types/news';
import { type INewsRepository } from '~/src/data/news.repository.interface';
import { type IRegionsRepository } from '~/src/data/regions.repositiory.interface';
import { type IInitiativeTypesRepository } from '~/src/data/initiative.types.repository.inerface';
import {type  IInitiativeRepository } from '~/src/data/initiative.repository.interface';

export class DataService implements IDataService {
	private onPage: number = 20;
	constructor(
		private newsRepository: INewsRepository,
		private regionsRepository: IRegionsRepository,
		private initiativeTypesRepository: IInitiativeTypesRepository,
		private initiativeRepository: IInitiativeRepository,
	) {
	}

	async data(): Promise<TClientData> {
		return {
			news: await this.newsRepository.list(0, this.onPage),
			regions: await this.regionsRepository.list(),
			types: await this.initiativeTypesRepository.list(),
		}
	}

	async initiatives(typeId: number): Promise<TInitiativeList | TClientDataError> {
		return await this.initiativeRepository.listByType(typeId);
	}

	async search(text: string, direction: number = 0): Promise<TInitiativeList | TClientDataError> {
		return await this.initiativeRepository.listByText(text, direction)
	}

	async news(page?: number, id?: number): Promise<TNews[] | undefined> {
		page = page || 1;
		return await this.newsRepository.list((page - 1) * this.onPage, this.onPage)
	}


	async types(direction: number): Promise<TInitiativeTypes[] | undefined> {
		return Promise.resolve([]);
	}

}