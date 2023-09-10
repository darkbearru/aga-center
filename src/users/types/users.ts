
export type TCompany = {
	id?: number,
	status: boolean,
	nameFull: string,
	nameShort: string
	requsites: string,
}

export type TCompanies = TCompany[];

export type TUser = {
	id?: number,
	email: string,
	fio?: string | null,
	isAdmin?: boolean,
	isModerator?: boolean,
	confirmCode?: string | null,
	companies?: TCompanies,
	createdAt?: Date,
	changedAt?: Date,
}

export type TUserRegistration = {
	email: string,
	fio?: string,
	code?: string
}