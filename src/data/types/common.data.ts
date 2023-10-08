import { Articles } from '.prisma/client';
import { TUser } from '~/src/users/types/users';
import { TRegion } from '~/src/data/types/regions';
import { TOwnership } from '~/src/data/types/ownership';
import { TInitiativeTypes } from '~/src/data/types/initiatives.types';
import { TNews } from '~/src/data/types/news';

export type TAdminMenu = Record<string, string>;

export type TCommonData = {
	user?: TUser,
	menu?: TAdminMenu,
	news?: TNews[],
	users?: TUser[],
	articles?: Articles[],
	regions?: TRegion[],
	ownership?: TOwnership[],
	types?: TInitiativeTypes[],
}