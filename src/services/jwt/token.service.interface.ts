import { TUsersPayload } from '~/src/users/users.payload';
import { TTokensResponse, TTokensList } from '~/src/services/jwt/token.types';
import { TUser } from '~/src/users/types/users';
import { JwtPayload } from 'jsonwebtoken';
import { H3Event } from 'h3';

export interface ITokenService {
	make(payload: TUsersPayload, secret: string, expiresIn: string): Promise<string>;

	generate(user: TUser): Promise<TTokensList>;

	check(token: string, secret: string): JwtPayload | string | false;

	save(event: H3Event, token: string): void;

	refresh(event: H3Event, token: string): Promise<TTokensResponse | null>;
}
