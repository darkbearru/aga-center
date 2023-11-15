import type { TCommonData } from '~/src/data/types/common.data';
import type { TUser, TUserResponse } from '~/src/users/types/users';
import type { TRegion, TRegionResponse } from '~/src/data/types/regions';
import type { TOwnership, TOwnershipResponse } from '~/src/data/types/ownership';
import type { TInitiativeTypes, TInitiativeTypesResponse } from '~/src/data/types/initiatives.types';
import type { TNews, TNewsResponse } from '~/src/data/types/news';
import type { TCompany, TCompanyResponse } from '~/src/data/types/company';
import type {
	TInitiative,
	TInitiativeDeleteResponse,
	TInitiativeResponse,
	TInitiativeWithID, TInitiativeWithOrders
} from '~/src/data/types/initiatives';
import type { TArticle, TArticleFormData, TArticleResponse } from '~/src/data/types/articles';
import type { TOrder } from '~/src/data/types/order';

export interface IAdminService {
	data(): Promise<TCommonData>;
	newsSave(news: TNews): Promise<TNewsResponse>;
	newsDelete(news: TNews): Promise<boolean>;
	articlesSave(news: TArticleFormData): Promise<TArticleResponse>;
	articlesDelete(news: TArticle): Promise<boolean>;
	userSave(user: TUser): Promise<TUserResponse>;
	userDelete(user: TUser): Promise<TUser | null>;
	regionSave(region: TRegion): Promise<TRegionResponse>;
	regionDelete(region: TRegion): Promise<boolean>;
	ownershipSave(ownership: TOwnership): Promise<TOwnershipResponse>;
	ownershipDelete(ownership: TOwnership): Promise<boolean>;
	initiativeTypesSave(type: TInitiativeTypes): Promise<TInitiativeTypesResponse>;
	initiativeTypesDelete(type: TInitiativeTypes): Promise<boolean>;
	companySave(company: TCompany): Promise<TCompanyResponse>;
	companyDelete(company: TCompany): Promise<boolean>;
	companyList(): Promise<TCompany[] | undefined>;
	initiativeList(): Promise<TInitiative[] | undefined>;
	initiativeSave(item: TInitiativeWithID): Promise<TInitiativeResponse>;
	initiativeDelete(item: TInitiative): Promise<TInitiativeDeleteResponse>;
	initiativeRemoveOld(): Promise<void>;
	moderationCompany(id: number, operation: string, reason?: string): Promise<TCompany[] | undefined>
	moderationInitiative(id: number, operation: string, reason?: string): Promise<TInitiative[] | undefined>
	moderationList(): Promise<TCommonData>
	companyAndInitiativesList(): Promise<TCommonData>
	ordersList(): Promise<TInitiativeWithOrders | null>
	orderByCode(code: string): Promise<TOrder | null>
}