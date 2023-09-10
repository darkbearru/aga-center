import { TUser, TUserRegistration } from '~/src/users/types/users';
import { TUsersPayload, TUsersPayloadJWT } from '~/src/users/users.payload';

export interface IUsersService {
	create(body?: TUserRegistration): Promise<TUser | TUsersPayloadJWT | undefined>;
	login(email: string): Promise<string | undefined>;
	validate(user: TUser): Promise<TUsersPayloadJWT | undefined>;
	get(id: number): Promise<TUser | undefined>;
	delete(id: number): Promise<boolean>;
	totalCount(): Promise<number>;
	check(accessToken: string): TUsersPayload | undefined;
}
