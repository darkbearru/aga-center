import { TRegion } from '~/src/users/types/regions';

export interface IRegionsRepository {
	list(): Promise<TRegion[] | undefined>;
	add(region: TRegion): Promise<TRegion>;
	save(region: TRegion): Promise<boolean>;
	delete(region: TRegion): Promise<boolean>;
	checkSlug(region: TRegion): Promise<boolean>;
}