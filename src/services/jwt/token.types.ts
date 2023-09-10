import { TUsersPayload } from '~/src/users/users.payload';

export type TTokensList = {
	access: string;
	refresh: string;
};

export type TTokensResponse = TUsersPayload & {
	accessToken: string;
};
