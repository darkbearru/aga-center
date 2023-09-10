import { IUsersService } from '~/src/users/users.service.interface';
import { TUser, TUserRegistration } from '~/src/users/types/users';
import { TUsersPayload, TUsersPayloadJWT } from '~/src/users/users.payload';
import { IEmailService } from '~/src/services/email/email.service.interface';
import { IUsersRepository } from '~/src/users/users.repository.interface';
import { ITokenService } from '~/src/services/jwt/token.service.interface';
import { TTokensList } from '~/src/services/jwt/token.types';
import { H3Event } from 'h3';

export class UsersService implements IUsersService {
	private readonly event: H3Event;
	constructor(
		private emailService: IEmailService,
		private usersRepository: IUsersRepository,
		private tokenService: ITokenService,
		event?: H3Event,
	) {
		this.event = event || useRequestEvent();
	}

	async create(body?: TUserRegistration): Promise<TUser | TUsersPayloadJWT | undefined> {
		if (!body || !body.email) {
			throw createError({
				statusCode: 400,
				message: 'Bad Request',
			});
		}
		const code: string = this.makeCode();
		if (!body.code || !body?.fio) {
			const user: TUser | undefined = await this.usersRepository.createUser(body.email, code);
			if (!user) {
				await this.usersRepository.saveCode(body.email, code);
			}
			await this.sendEmail(body.email, code);

			if (body.code) return undefined;
			return {id: 0, email: body.email, fio: ''};
		}
		const logged: TUser | undefined = await this.usersRepository.registration(body);
		if (!logged) {
			throw createError({
				statusCode: 400,
				message: 'Bad Request',
			});
		}
		const payload: TUsersPayload = {id: logged.id, email: logged.email, fio: logged.fio};
		const tokens: TTokensList = await this.tokenService.generate(payload);
		this.tokenService.save(this.event, tokens.refresh);
		return {
			...payload,
			accessToken: tokens.access
		}

	}

	delete(id: number): Promise<boolean> {
		return Promise.resolve(false);
	}

	get(id: number): Promise<TUser | undefined> {
		return Promise.resolve(undefined);
	}

	async login(email: string): Promise<string | undefined> {
		const code = this.makeCode();
		await this.usersRepository.saveCode(email, code);
		await this.sendEmail(email, code);
		return 'OK';
	}

	async validate(user: TUser): Promise<TUsersPayloadJWT | undefined> {
		const founded: TUser | null = await this.usersRepository.authorize(user.email, user.confirmCode || '0');
		if (!founded) {
			throw createError({
				statusCode: 400,
				message: 'Неверный код подтверждения'
			});
		}
		const payload: TUsersPayload = {id: founded.id, email: founded.email, fio: founded.fio};
		const tokens: TTokensList = await this.tokenService.generate(payload);
		this.tokenService.save(this.event, tokens.refresh);
		return {
			...payload,
			accessToken: tokens.access
		}
	}

	totalCount(): Promise<number> {
		return Promise.resolve(0);
	}

	private makeCode(min: number = 10000000, max: number = 99999999): string {
		return String(Math.floor(Math.random() * (max - min) + min));
	}

	private async sendEmail(email: string, code: string): Promise<TUser> {
		const result = await this.emailService.send({
			to: email,
			from: process.env.MAIL_FROM || '',
			subject: 'Код подтверждения',
			text: `Код подтверждения: ${code}`,
			html: `<html lang="ru"><head></head><body><h1>Код подтверждения: ${code}</h1></body></html>`
		})
		if (!result.error) return { email }
		throw createError({
			statusCode: 500,
			message: result.error?.message,
		});
	}

	check(accessToken: string): TUsersPayload | undefined {
		const payload = this.tokenService.check(accessToken, process.env.JWT_ACCESS_SECRET || '');
		if (!payload) throw createError({
			statusCode: 401,
			message: "Unauthorized",
		});
		console.log(payload);
		if (typeof payload !== "string") {
			return payload as TUsersPayload;
		}
	}

}