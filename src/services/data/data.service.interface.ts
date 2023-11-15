import type { TClientData, TClientDataError } from '~/src/data/types/common.data';
import type { TNews, TNewsList } from '~/src/data/types/news';
import type { TInitiativeTypes } from '~/src/data/types/initiatives.types';
import type { TInitiativeList } from '~/src/data/types/initiatives';
import type { TOrder, TOrderResponse } from '~/src/data/types/order';

export interface IDataService {
	data(): Promise<TClientData>;
	news(page?: number, slug?: string): Promise<TNews| TNewsList | undefined>;
	types(direction: number): Promise<TInitiativeTypes[] | undefined>;
	initiatives(typeId: number): Promise<TInitiativeList | TClientDataError>;
	search(text: string, direction: number): Promise<TInitiativeList | TClientDataError>;
	makeOrder(order: TOrder): Promise<TOrderResponse>;

}