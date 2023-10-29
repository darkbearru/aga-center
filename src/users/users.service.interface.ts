import { TUser, TUserRegistration, TUserResponse } from '~/src/users/types/users';
import { TUsersPayload } from '~/src/users/users.payload';

export interface IUsersService {
	create(body?: TUserRegistration): Promise<TUserResponse | undefined>;
	login(email: string): Promise<TUserResponse | undefined>;
	validate(user: TUser): Promise<TUserResponse | undefined>;
	get(id: number): Promise<TUser | null>;
	delete(id: number): Promise<boolean>;
	totalCount(): Promise<number>;
	check(accessToken: string): Promise<TUser | null>;
	refresh(refreshToken: string): Promise<TUser | null>;
	logout(): void;
}
