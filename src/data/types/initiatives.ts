import { TCompany } from '~/src/data/types/company';
import { TPhotos } from '~/src/data/types/photos';
import { TReviews } from '~/src/data/types/reviews';
import { TInitiativeTypes } from '~/src/data/types/initiatives.types';
import { TRegion } from '~/src/data/types/regions';

export type TInitiative = {
	id?: number,
	status: boolean,
	direction: number,
	name: string,
	text: string,
	isApproved: boolean,
	company: TCompany,
	region: TRegion
	type: TInitiativeTypes,
	photos?: TPhotos,
	reviews?: TReviews,
}


export type TInitiativeResponse = {
	errors?: {
		name?: string,
		text?: string,
		other?: string,
	}
	initiative: TInitiative,
}