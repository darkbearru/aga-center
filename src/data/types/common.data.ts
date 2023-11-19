import type { TUser } from '~/src/users/types/users';
import type { TRegion } from '~/src/data/types/regions';
import type { TOwnership } from '~/src/data/types/ownership';
import type { TInitiativeTypes } from '~/src/data/types/initiatives.types';
import type { TNews, TNewsList } from '~/src/data/types/news';
import type { TCompany } from '~/src/data/types/company';
import type { TInitiative } from '~/src/data/types/initiatives';
import type { TArticles } from '~/src/data/types/articles';

export type TAdminMenu = Record<string, string>;

export type TCommonData = {
	user?: TUser,
	menu?: TAdminMenu,
	news?: TNews[],
	users?: TUser[],
	articles?: TArticles,
	regions?: TRegion[],
	ownership?: TOwnership[],
	types?: TInitiativeTypes[],
	companies?: TCompany[],
	initiatives?: TInitiative[],
	promo?: TInitiative[],
}

export type TClientData = {
	news?: TNewsList,
	types?: TInitiativeTypes[],
	regions?: TRegion[],
	initiatives?: TInitiative[]
}

export type TClientDataError = {
	message: string;
}