import type { TInitiative, TInitiativeList, TInitiativeWithID } from '~/src/data/types/initiatives';
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
	deletePhotos(photos: TPhotos): Promise<void>;
	selectDeleted(time: Date): Promise<TInitiative[] | undefined>;
	deleteMany(id: number[]): Promise<void>;
	listByType(typeId: number): Promise<TInitiativeList | TClientDataError>;
	listByText(text: string, direction: number): Promise<TInitiativeList | TClientDataError>;
	moderationList(): Promise<TInitiative[] | undefined>;
	moderationApprove(id: number): Promise<boolean>;
	moderationDecline(id: number, reason: string): Promise<boolean>;
}