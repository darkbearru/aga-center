import { type TCompany } from '~/src/data/types/company';
import { type TUsersPayload } from '~/src/users/users.payload';

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
		other?: string,
		confirm_code?: string,
	}
	user?: TUser | TUsersPayload,
}

export type TUserRegistration = {
	email: string,
	fio?: string,
	code?: string
}