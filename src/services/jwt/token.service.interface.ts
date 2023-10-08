import { TUsersPayload } from '~/src/users/users.payload';
import { TTokensResponse, TTokensList } from '~/src/services/jwt/token.types';
import { TUser } from '~/src/users/types/users';
import { JwtPayload } from 'jsonwebtoken';
import { H3Event } from 'h3';

export interface ITokenService {
	make(payload: TUsersPayload, secret: string, expiresIn: string): Promise<string>;
	generate(user: TUser): Promise<TTokensList>;
	checkAccess(token: string): JwtPayload | string | false;
	checkRefresh(event: H3Event): JwtPayload | string | false;
	save(tokens: TTokensList, event?: H3Event): void;
	refresh(token: string, event?: H3Event): Promise<TTokensResponse | null>;
}
