import { IDataService } from '~/src/services/data/data.service.interface';
import { TClientData, TClientDataError } from '~/src/data/types/common.data';
import { TInitiativeTypes } from '~/src/data/types/initiatives.types';
import { TInitiative, TInitiativeList } from '~/src/data/types/initiatives';
import { TNews } from '~/src/data/types/news';
import { Users } from '.prisma/client';
import { INewsRepository } from '~/src/data/news.repository.interface';
import { IUsersRepository } from '~/src/users/users.repository.interface';
import { IRegionsRepository } from '~/src/data/regions.repositiory.interface';
import { IOwnershipRepository } from '~/src/data/ownership.repository.interface';
import { IInitiativeTypesRepository } from '~/src/data/initiative.types.repository.inerface';
import { ICompanyRepository } from '~/src/data/company.repository.interface';
import { IInitiativeRepository } from '~/src/data/initiative.repository.interface';

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