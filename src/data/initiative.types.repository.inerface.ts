import type { TInitiativeTypes } from '~/src/data/types/initiatives.types';

export interface IInitiativeTypesRepository {
	list(): Promise<TInitiativeTypes[] | undefined>;
	add(type: TInitiativeTypes): Promise<TInitiativeTypes>;
	save(type: TInitiativeTypes): Promise<boolean>;
	delete(type: TInitiativeTypes): Promise<boolean>;
	check(type: TInitiativeTypes): Promise<boolean>;
	listGroup(direction: number, region: number, fnd?: string): Promise<TInitiativeTypes[] | undefined>;
}