import { TUser, TUserRegistration } from '~/src/users/types/users';
import { TUsersPayload } from '~/src/users/users.payload';

export interface IUsersService {
	create(body?: TUserRegistration): Promise<TUser | undefined>;
	login(email: string): Promise<string | undefined>;
	validate(user: TUser): Promise<TUsersPayload | undefined>;
	get(id: number): Promise<TUser | null>;
	delete(id: number): Promise<boolean>;
	totalCount(): Promise<number>;
	check(accessToken: string): Promise<TUser | null>;
	refresh(refreshToken: string): Promise<TUser | null>;
}
