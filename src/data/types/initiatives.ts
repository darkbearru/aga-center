import type { TCompany, TCompanyItem } from '~/src/data/types/company';
import type { TPhotos } from '~/src/data/types/photos';
import type { TReviewList, TReviews } from '~/src/data/types/reviews';
import type { TInitiativeTypes } from '~/src/data/types/initiatives.types';
import type { TRegion } from '~/src/data/types/regions';
import type { TOrders } from '~/src/data/types/order';


export type TShortInitiative = {
	id: number,
	name: string,
}
export type TInitiative = {
	id?: number,
	status: boolean,
	direction: number,
	name: string,
	text: string,
	isApproved: boolean,
	isDeclined?: boolean,
	declineReason?: string,
	company: TCompany,
	region: TRegion
	type: TInitiativeTypes,
	photos?: TPhotos,
	reviews?: TReviews,
	ordersCount?: number,
	ordersActive?: number,
}

export type TInitiativeResult = {
	id?: number,
	status: boolean,
	direction: number,
	name: string,
	text: string,
	isApproved: boolean,
	isDeclined?: boolean,
	declineReason?: string,
	Company: TCompany,
	Regions: TRegion
	InitiativeTypes: TInitiativeTypes,
	Photos?: TPhotos,
	reviews?: TReviews,
	_count?: {
		Order?: number,
	}
}

export type TInitiativeWithID = {
	id?: string,
	status?: string,
	direction: string,
	name: string,
	text: string,
	company: string,
	region: string
	type: string,
	photos?: TPhotos,
}

export type TInitiativeResponse = {
	errors?: {
		name?: string,
		text?: string,
		other?: string,
	}
	initiative?: TInitiative,
}

export type TInitiativeDeleteResponse = {
	errors?: string,
	status: boolean
}

export type TInitiativeList = TInitiativeListItem[];

export type TInitiativeListItem = {
	id: number,
	name: string | null,
	text: string | null,
	rating?: number | null,
	url?: string,
	Photos: TPhotos | null,
	Reviews?: TReviewList | null,
	Company: TCompanyItem | null,
}

export type TInitiativeWithOrders = TInitiativeWithOrder[];

export type TInitiativeWithOrder = {
	id: number,
	name: string | null,
	orders?: TOrders;
	Order?: TOrders | null;
}
