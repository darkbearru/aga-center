import { Articles, News } from '.prisma/client';
import { TUser } from '~/src/users/types/users';
import { TRegion } from '~/src/users/types/regions';

export type TAdminMenu = Record<string, string>;

export type TCommonData = {
	user?: TUser,
	menu?: TAdminMenu,
	news?: News[],
	users?: TUser[],
	articles?: Articles[],
	regions?: TRegion[],
}