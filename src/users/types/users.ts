import { TCompany } from '~/src/data/types/company';

export type TUser = {
	id?: number,
	email: string,
	fio?: string | null,
	isAdmin?: boolean,
	isModerator?: boolean,
	confirmCode?: string | null,
	companies?: TCompany[],
	createdAt?: Date,
	changedAt?: Date,
}

export type TUserResponse = {
	errors?: {
		email?: string,
		fio?: string,
		other?: string
	}
	user: TUser,
}

export type TUserRegistration = {
	email: string,
	fio?: string,
	code?: string
}