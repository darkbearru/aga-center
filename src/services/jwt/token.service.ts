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
		this.accessSecret = process?.env?.JWT_ACCESS_SECRET || 'SECRET';
		this.accessLifetime = process?.env?.JWT_ACCESS_LIFETIME || '30m';
		this.refreshSecret = process?.env?.JWT_REFRESH_SECRET || 'REFRESH_SECRET';
		this.refreshLifetime = process?.env?.JWT_REFRESH_LIFETIME || '30d';
	}

	/**
	 * Проверяем соответствие токена
	 * @param token
	 * @param secret
	 */
	private check(token: string, secret: string): JwtPayload | string | false {
		try {
			return jwt.verify(token, secret);
		} catch (e) {
			return false;
		}
	}

	public checkAccess(token: string): JwtPayload | string | false {
		return this.check(token, this.accessSecret);
	}

	public checkRefresh(event: H3Event): JwtPayload | string | false {
		const token = getCookie(event, 'rf_token');
		if (!token) return false;
		return this.refresh(token, event);
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
	 * СОхранение Access и Refresh токенов в куки
	 * @param tokens
	 * @param event
	 */
	save(tokens: TTokensList, event?: H3Event): void {
		if (!event) return;
		this.saveAccess(tokens.access, event);
		this.saveRefresh(tokens.refresh, event);
	}

	private saveAccess(token: string, event: H3Event): void {
		const exp: Date = new Date();
		exp.setTime(Date.now() + ms(this.accessLifetime));
		this.saveTokenCookie('ac_token', token, event, exp, false);
	}

	private saveRefresh(token: string, event: H3Event): void {
		if (!event) return;
		const exp: Date = new Date();
		exp.setTime(Date.now() + ms(this.refreshLifetime));
		this.saveTokenCookie('rf_token', token, event, exp, true);
	}

	private saveTokenCookie(tokenName: string, tokenValue: string, event: H3Event, expires: Date, httpOnly: boolean = true): void {
		setCookie(event, tokenName, tokenValue, {
			httpOnly,
			expires,
		});
	}

	/**
	 * Обновление токенов
	 * @param event
	 * @param token
	 */
	async refresh(token: string, event?: H3Event): Promise<TTokensResponse | null> {
		if (!event) return null;
		const data = this.check(token, this.refreshSecret);
		if (typeof data !== 'string' && data !== false) {
			const { exp, iat, ...userData } = data;
			const payload: TUsersPayload = userData as TUsersPayload;
			const jwt: TTokensList = await this.generate(payload);
			this.saveAccess(jwt.access, event);
			this.saveRefresh(jwt.refresh, event);
			return { ...payload, accessToken: jwt.access };
		}
		return null;
	}
}
