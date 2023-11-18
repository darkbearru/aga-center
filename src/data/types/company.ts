import type { TOwnership } from '~/src/data/types/ownership';
import type { TUser } from '~/src/users/types/users';
import type { TInitiativeList } from '~/src/data/types/initiatives';

export enum ContactsType {
	"phone" = "phone",
	"email" = "email",
	"vk" = "vk",
	"instagram" = "instagram",
	"ok" = "ok",
}
export type TContactsType = keyof typeof ContactsType;

export type TContact = {
	id?: number,
	type: ContactsType,
	value: string,
	isDeleted?: boolean,
}
export type TContacts = TContact[];


export type TContactsTypeName = Record<TContactsType, string>
export const ContactsTypeNames: TContactsTypeName = {
	[ContactsType.phone]: "Телефон",
	[ContactsType.email]: "Email",
	[ContactsType.vk]: "Вконтакте",
	[ContactsType.instagram]: "Инстаграмм",
	[ContactsType.ok]: "Одноклассники",
}


export type TCompany = {
	id?: number,
	nameFull: string,
	nameShort: string | null,
	slug: string,
	rating?: number,
	requsites?: string,
	isApproved?: boolean,
	isDeclined?: boolean,
	declineReason?: string,
	contacts?: TContacts,
	ownership?: TOwnership,
	user?: TUser,
}

export type TCompanyWithInitiatives = {
	company: TCompany,
	initiatives?: TInitiativeList
}

export type TCompanyItem = {
	id?: number,
	nameFull: string,
	nameShort: string | null,
	slug: string,
	typeOwnership?: TOwnership | null,
}

export type TCompanyResponse = {
	errors?: {
		nameFull?: string,
		nameShort?: string,
		requsites?: string
		contacts?: string
		slug?: string,
		other?: string
	},
	company: TCompany
}

export type TFormkitOption = {
	label: string,
	value: number,
	status?: number,
	attr?: {
		default?: boolean,
		disabled?: boolean
	}
}


export type TFormkitContactOption = {
	label: string,
	value: TContactsType,
	attr: {
		default?: boolean,
		disabled?: boolean
	}
}
