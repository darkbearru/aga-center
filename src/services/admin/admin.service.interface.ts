import { TCommonData } from '~/src/data/types/common.data';
import { TUser, TUserResponse } from '~/src/users/types/users';
import { TRegion, TRegionResponse } from '~/src/data/types/regions';
import { TOwnership, TOwnershipResponse } from '~/src/data/types/ownership';
import { TInitiativeTypes, TInitiativeTypesResponse } from '~/src/data/types/initiatives.types';
import { TNews, TNewsResponse } from '~/src/data/types/news';

export interface IAdminService {
	data(): Promise<TCommonData>;
	newsSave(news: TNews): Promise<TNewsResponse>;
	newsDelete(news: TNews): Promise<boolean>;
	userSave(user: TUser): Promise<TUserResponse>;
	userDelete(user: TUser): Promise<TUser | null>;
	regionSave(region: TRegion): Promise<TRegionResponse>;
	regionDelete(region: TRegion): Promise<boolean>;
	ownershipSave(ownership: TOwnership): Promise<TOwnershipResponse>;
	ownershipDelete(ownership: TOwnership): Promise<boolean>;
	initiativeTypesSave(type: TInitiativeTypes): Promise<TInitiativeTypesResponse>;
	initiativeTypesDelete(type: TInitiativeTypes): Promise<boolean>;
}