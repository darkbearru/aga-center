import { TInitiative } from '~/src/data/types/initiatives';
import { TUser } from '~/src/users/types/users';

export interface IInitiativeRepository {
	list(user: TUser): Promise<TInitiative[] | undefined>;
	add(item: TInitiative): Promise<TInitiative | undefined>;
	save(item: TInitiative, user: TUser): Promise<boolean>;
	delete(item: TInitiative, user: TUser): Promise<boolean>;
	check(item: TInitiative): Promise<boolean>;
	select(id: number): Promise<TInitiative>;
}