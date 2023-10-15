import { TCompany, TContacts } from '~/src/data/types/company';
import { TUser } from '~/src/users/types/users';

export interface ICompanyRepository {
	list(user: TUser): Promise<TCompany[] | undefined>;
	add(company: TCompany): Promise<TCompany | undefined>;
	save(company: TCompany): Promise<boolean>;
	delete(company: TCompany): Promise<boolean>;
	check(company: TCompany): Promise<boolean>;
	select(id: number): Promise<TCompany>;
	deleteContacts(contacts: TContacts): Promise<void>;
}