import { type TUsersPayload } from '~/src/users/users.payload';
import { type TTokensResponse, type TTokensList } from '~/src/services/jwt/token.types';
import { type TUser } from '~/src/users/types/users';
import { type JwtPayload } from 'jsonwebtoken';
import { H3Event } from 'h3';

export interface ITokenService {
	make(payload: TUsersPayload, secret: string, expiresIn: string): Promise<string>;
	generate(user: TUser): Promise<TTokensList>;
	checkAccess(token: string): Promise<JwtPayload | string | boolean | null>;
	checkRefresh(event: H3Event): Promise<JwtPayload | string | boolean | null>;
	save(tokens: TTokensList, event?: H3Event): void;
	refresh(token: string, event?: H3Event): Promise<TTokensResponse | null>;
	logout(event: H3Event): void;
}
