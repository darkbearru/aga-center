import { TOwnership } from '~/src/data/types/ownership';

export interface IOwnershipRepository {
	list(): Promise<TOwnership[] | undefined>;
	add(ownership: TOwnership): Promise<TOwnership>;
	save(ownership: TOwnership): Promise<boolean>;
	delete(ownership: TOwnership): Promise<boolean>;
	check(ownership: TOwnership): Promise<boolean>;
}