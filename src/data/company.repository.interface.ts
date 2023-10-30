import type { TCompany, TContacts } from '~/src/data/types/company';
import type { TUser } from '~/src/users/types/users';

export interface ICompanyRepository {
	list(user: TUser): Promise<TCompany[] | undefined>;
	add(company: TCompany): Promise<TCompany | undefined>;
	save(company: TCompany): Promise<boolean>;
	delete(company: TCompany): Promise<boolean>;
	check(company: TCompany): Promise<boolean>;
	select(id: number): Promise<TCompany>;
	deleteContacts(contacts: TContacts): Promise<void>;
	moderationList(): Promise<TCompany[] | undefined>;
	moderationApprove(id: number): Promise<boolean>;
	moderationDecline(id: number, reason: string): Promise<boolean>;
}