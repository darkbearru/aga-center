import { type TUser, type TUserRegistration } from '~/src/users/types/users';

export interface IUsersRepository {
	saveCode(email: string, code: string): Promise<void>;
	createUser(email: string, code: string): Promise<TUser | undefined>;
	saveUser(email: string, fio: string): Promise<TUser | null>
	registration(body?: TUserRegistration): Promise<TUser | undefined>;
	authorize(email: string, code: string): Promise<TUser | null>;
	info(id: number): Promise<TUser | null>;
	list(skip: number, take: number): Promise<TUser[] | undefined>;
	count(): Promise<number>;
	save(user: TUser): Promise<TUser>;
	delete(id: number): Promise<TUser>;
	checkEmail(email: string, id?: number): Promise<TUser | null>;
	userOrder(email: string, code: string): Promise<TUser | undefined>;
}