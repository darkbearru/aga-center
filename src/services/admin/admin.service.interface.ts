import { TCommonData } from '~/src/data/types/common.data';
import { TUser, TUserResponse } from '~/src/users/types/users';
import { TRegion, TRegionResponse } from '~/src/users/types/regions';

export interface IAdminService {
	data(): Promise<TCommonData>;
	userSave(user: TUser): Promise<TUserResponse>;
	userDelete(user: TUser): Promise<TUser | null>;
	regionSave(region: TRegion): Promise<TRegionResponse>;
	regionDelete(region: TRegion): Promise<boolean>;
}