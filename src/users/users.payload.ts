export type TUsersPayload = {
	id?: number;
	email: string;
	fio?: string | null;
};

export type TUsersPayloadJWT = TUsersPayload & { accessToken: string };
