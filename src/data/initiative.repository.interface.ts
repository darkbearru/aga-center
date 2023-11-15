import type { TInitiative, TInitiativeList, TInitiativeWithID, TShortInitiative } from '~/src/data/types/initiatives';
import type { TUser } from '~/src/users/types/users';
import type { TPhotos } from '~/src/data/types/photos';
import type { TClientDataError } from '~/src/data/types/common.data';

export interface IInitiativeRepository {
	list(user: TUser): Promise<TInitiative[] | undefined>;
	add(item: TInitiativeWithID): Promise<TInitiative | undefined>;
	save(item: TInitiativeWithID, user: TUser): Promise<boolean>;
	delete(item: TInitiative, user: TUser): Promise<boolean | number>;
	check(item: TInitiativeWithID): Promise<TInitiative | undefined>;
	select(id: number): Promise<TInitiative>;
	selectDeleted(time: Date): Promise<TInitiative[] | undefined>;
	deleteMany(id: number[]): Promise<void>;
	listByType(typeId: number, direction?: number, regionId?: number, fnd?: string): Promise<TInitiativeList | TClientDataError>;
	listByText(text: string, direction: number): Promise<TInitiativeList | TClientDataError>;
	moderationList(): Promise<TInitiative[] | undefined>;
	moderationApprove(id: number): Promise<boolean>;
	moderationDecline(id: number, reason: string): Promise<boolean>;
	get(id: number): Promise<TShortInitiative | undefined>;
	calcRating(id: number): Promise<void>;
}