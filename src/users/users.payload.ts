export type TUsersPayload = {
	id?: number;
	email: string;
	fio?: string | null;
	rights?: number;
};

export type TUsersPayloadJWT = TUsersPayload & { accessToken: string };
