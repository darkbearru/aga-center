import { IUsersService } from '~/src/users/users.service.interface';
import { TUser, TUserRegistration, TUserResponse } from '~/src/users/types/users';
import { TUsersPayload } from '~/src/users/users.payload';
import { TTokensList } from '~/src/services/jwt/token.types';
import { H3Event } from 'h3';
import { TEmailResponse } from '~/src/services/email/email.types';
import { IUsersRepository } from '~/src/users/users.repository.interface';
import { ITokenService } from '~/src/services/jwt/token.service.interface';
import { IEmailService } from '~/src/services/email/email.service.interface';

export class UsersService implements IUsersService {
	private readonly event?: H3Event;
	constructor(
		private usersRepository: IUsersRepository,
		private tokenService: ITokenService,
		private emailService: IEmailService,
		event?: H3Event,
	) {
		this.event = event || useRequestEvent();
	}

	async create(body?: TUserRegistration): Promise<TUserResponse | undefined> {
		const response: TUserResponse = {
			errors: undefined,
			user: undefined
		}
		if (!body) {
			response.errors = { other: 'Не указаны все необходимые данные' }
			return response;
		}
		if (!body.email.trim()) {
			response.errors = { email: 'Не указан email' }
			return response;
		}
		const user: TUser | null = await this.usersRepository.checkEmail(body.email);
		if (user) {
			response.errors = {email: 'Пользователь с указанным email уже существует'}
			return response;
		}
		if (!body?.fio?.trim()) {
			response.errors = { fio: 'Не указан ФИО пользователя' }
			return response;
		}

		const code: string = this.makeCode();
		if (!body?.code) {
			const user: TUser | undefined = await this.usersRepository.createUser(body.email, code);
			if (!user) {
				await this.usersRepository.saveCode(body.email, code);
			}
			await this.sendEmail(body.email, code);
			response.user = user;
			return response;
		}
		const logged: TUser | undefined = await this.usersRepository.registration(body);
		if (!logged) {
			response.errors = { confirm_code: 'Указан неверный код' }
			return response;
		}
		const payload: TUsersPayload = this.makePayload(logged);
		const tokens: TTokensList = await this.tokenService.generate(payload);

		if (this.event) this.tokenService.save(tokens, this.event);

		response.user = payload;
		return response;
	}

	delete(id: number): Promise<boolean> {
		return Promise.resolve(false);
	}

	async get(id: number): Promise<TUsersPayload | null> {
		return await this.usersRepository.info(id);
	}

	async login(email: string): Promise<TUserResponse | undefined> {
		const user = await this.usersRepository.checkEmail(email);
		const response: TUserResponse = {
			errors: undefined,
			user: user !== null ? user : undefined
		}
		if (user === null) {
			response.errors = {
				email: `Пользователя с email «${email}» не существует`
			}
			return response;
		}
		const code = this.makeCode();
		try {
			await this.usersRepository.saveCode(email, code);
			await this.sendEmail(email, code);
		} catch (e) {
			response.errors = {
				other: 'Ошибка отправки email, попробуйте позже'
			}
		}
		return response;
	}

	async validate(user: TUser): Promise<TUserResponse | undefined> {
		const founded: TUser | null = await this.usersRepository.authorize(user.email, user.confirmCode || '0');
		const response: TUserResponse = {
			errors: undefined,
			user: undefined
		}
		if (!founded) {
			response.errors = {
				confirm_code: 'Неверный код подтверждения'
			}
			return response;
		}
		const payload: TUsersPayload = this.makePayload(founded);
		const tokens: TTokensList = await this.tokenService.generate(payload);
		if (this.event) {
			this.tokenService.save(tokens, this.event);
		}
		response.user = payload;
		return response;
	}

	totalCount(): Promise<number> {
		return Promise.resolve(0);
	}

	private makeCode(min: number = 10000000, max: number = 99999999): string {
		return String(Math.floor(Math.random() * (max - min) + min));
	}

	private async sendEmail(email: string, code: string): Promise<TUser> {

		const result: TEmailResponse = await this.emailService.send({
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

	async check(accessToken: string): Promise<TUsersPayload | null> {
		const payload = await this.tokenService.checkAccess(accessToken);
		if (payload && (typeof payload !== "string") && (typeof payload !== 'boolean')) {
			const user: TUsersPayload | null = await this.get(payload.id);
			if (user) return this.makePayload(user);
			return null;
		}
		return null;
	}

	async refresh(): Promise<TUsersPayload | null> {
		if (!this.event) return null;
		const payload = await this.tokenService.checkRefresh(this.event);
		if (payload && (typeof payload !== "string") && (typeof payload !== 'boolean')) {
			const user: TUsersPayload | null = await this.get(payload.id);
			if (user) return this.makePayload(user);
		}
		return null;
	}

	logout(): void {
		if (this.event) {
			this.tokenService.logout(this.event);
		}
	}

	makePayload(user: TUser): TUsersPayload {
		return  {
			id: user?.id,
			email: user.email,
			fio: user?.fio,
			rights: (user?.isAdmin ? 2 : 0) + (user?.isModerator ? 1 : 0)
		};
	}

}