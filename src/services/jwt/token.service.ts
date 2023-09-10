import { ITokenService } from './token.service.interface';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { TTokensList, TTokensResponse } from './token.types';
import { TUsersPayload } from '~/src/users/users.payload';
import ms from 'ms';
import { H3Event } from 'h3';

export class TokenService implements ITokenService {
	private readonly refreshSecret: string;
	private readonly refreshLifetime: string;
	private readonly accessSecret: string;
	private readonly accessLifetime: string;

	constructor() {
		this.accessSecret = process.env.JWT_ACCESS_SECRET || 'SECRET';
		this.accessLifetime = process.env.JWT_ACCESS_LIFETIME || '30m';
		this.refreshSecret = process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET';
		this.refreshLifetime = process.env.JWT_REFRESH_LIFETIME || '30d';
	}

	/**
	 * Проверяем соответствие токена
	 * @param token
	 * @param secret
	 */
	check(token: string, secret: string): JwtPayload | string | false {
		try {
			return jwt.verify(token, secret);
		} catch (e) {
			return false;
		}
	}

	/**
	 * Формирование JWT токенов
	 * @param payload
	 * @param secret
	 * @param expiresIn
	 */
	make(payload: TUsersPayload, secret: string, expiresIn: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			jwt.sign(
				payload,
				secret,
				{
					algorithm: 'HS256',
					expiresIn,
				},
				(err, token) => {
					if (err) reject(err);
					resolve(token as string);
				},
			);
		});
	}

	/**
	 * Генерация Access и Refresh токенов
	 * @param payload
	 */
	async generate(payload: TUsersPayload): Promise<TTokensList> {
		return {
			access: await this.make(payload, this.accessSecret, this.accessLifetime),
			refresh: await this.make(payload, this.refreshSecret, this.refreshLifetime),
		};
	}

	/**
	 * СОхранение Refresh токена в куки
	 * @param event
	 * @param token
	 */
	save(event: H3Event, token: string): void {
		setCookie(event, 'rf_token', token, {
			httpOnly: true,
			maxAge: ms(this.refreshLifetime),
		});
		// console.log(useCookies);
		// console.log(cookies);
/*
		const cookie = useCookies(
			'rf_token',
			{
				httpOnly: true,
				maxAge: ms(this.refreshLifetime)
			}
		);
		cookie.value = token;
*/
	}

	/**
	 * Обновление токенов
	 * @param event
	 * @param token
	 */
	async refresh(event: H3Event, token: string): Promise<TTokensResponse | null> {
		const data = this.check(token, process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET');
		if (typeof data !== 'string' && data !== false) {
			const { exp, iat, ...userData } = data;
			const payload: TUsersPayload = userData as TUsersPayload;
			const jwt: TTokensList = await this.generate(payload);
			this.save(event, jwt.refresh);
			return { ...payload, accessToken: jwt.access };
		}
		return null;
	}
}
