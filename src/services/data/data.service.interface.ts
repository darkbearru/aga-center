import { type TClientData, type TClientDataError } from '~/src/data/types/common.data';
import { type TNews } from '~/src/data/types/news';
import { type TInitiativeTypes } from '~/src/data/types/initiatives.types';
import { type TInitiativeList } from '~/src/data/types/initiatives';

export interface IDataService {
	data(): Promise<TClientData>;
	news(page?: number, id?: number): Promise<TNews[] | undefined>;
	types(direction: number): Promise<TInitiativeTypes[] | undefined>;
	initiatives(typeId: number): Promise<TInitiativeList | TClientDataError>;
	search(text: string, direction: number): Promise<TInitiativeList | TClientDataError>;
}