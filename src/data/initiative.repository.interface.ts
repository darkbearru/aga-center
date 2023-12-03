import type { TInitiative, TInitiativeList, TInitiativeWithID, TShortInitiative } from '~/src/data/types/initiatives';
import type { TUser } from '~/src/users/types/users';
import type { TClientDataError } from '~/src/data/types/common.data';
import type { TManageInitiatives } from '~/src/data/types/manage.initiatives';

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
	listByCompany(company: number): Promise<TInitiativeList | undefined>;
	listPromo(): Promise<TInitiativeList | TClientDataError>;
	listAll(): Promise<TInitiative[] | undefined>;
	moderationList(): Promise<TInitiative[] | undefined>;
	moderationApprove(id: number): Promise<boolean>;
	moderationDecline(id: number, reason: string): Promise<boolean>;
	get(id: number): Promise<TShortInitiative | undefined>;
	calcRating(id: number): Promise<void>;
	setPromo(id: number, isActivate?: boolean): Promise<Date | null>;
	saveInitiative(data: TManageInitiatives, companyId: number): Promise<boolean>;
}