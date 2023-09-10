import { TUser, TUserRegistration } from '~/src/users/types/users';

export interface IUsersRepository {
	saveCode(email: string, code: string): Promise<void>;
	createUser(email: string, code: string): Promise<TUser | undefined>;
	registration(body?: TUserRegistration): Promise<TUser | undefined>;
	authorize(email: string, code: string): Promise<TUser | null>;
}