import type { TCompany, TContacts } from '~/src/data/types/company';
import type { TUser } from '~/src/users/types/users';
import type { TManageInitiatives } from '~/src/data/types/manage.initiatives';

export interface ICompanyRepository {
	list(user: TUser): Promise<TCompany[] | undefined>;
	listAll(): Promise<TCompany[] | undefined>;
	add(company: TCompany): Promise<TCompany | undefined>;
	save(company: TCompany): Promise<TCompany | undefined>;
	saveCompany(data: TManageInitiatives, userId: number): Promise<{id: number} | null>;
	delete(company: TCompany): Promise<boolean>;
	check(company: TCompany): Promise<TCompany | boolean>;
	select(id: number): Promise<TCompany>;
	getBySlug(slug: string): Promise<TCompany | undefined>
	deleteContacts(contacts: TContacts): Promise<void>;
	moderationList(): Promise<TCompany[] | undefined>;
	moderationApprove(id: number): Promise<boolean>;
	moderationDecline(id: number, reason: string): Promise<boolean>;
	calcRating(id: number): Promise<void>;
}