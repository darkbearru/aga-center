import type { IDataService } from '~/src/services/data/data.service.interface';
import type { TClientData, TClientDataError } from '~/src/data/types/common.data';
import type { TInitiativeTypes } from '~/src/data/types/initiatives.types';
import type { TInitiativeList } from '~/src/data/types/initiatives';
import type { TNews, TNewsList, TNewsTime } from '~/src/data/types/news';
import type { INewsRepository } from '~/src/data/news.repository.interface';
import type { IRegionsRepository } from '~/src/data/regions.repositiory.interface';
import type { IInitiativeTypesRepository } from '~/src/data/initiative.types.repository.inerface';
import type { IInitiativeRepository } from '~/src/data/initiative.repository.interface';
import type { IUsersRepository } from '~/src/users/users.repository.interface';
import type { TOrder, TOrderResponse } from '~/src/data/types/order';
import type { TUser } from '~/src/users/types/users';
import type { TEmailResponse } from '~/src/services/email/email.types';
import type { IEmailService } from '~/src/services/email/email.service.interface';
import type { IOrdersRepository } from '~/src/data/orders.repository.interface';
import { makeConfirmCode } from '~/src/utils/makeConfirmCode';
import moment from 'moment';

export class DataService implements IDataService {
	private onPage: number = 20;
	private currentRegion: number = 1;
	constructor(
		private newsRepository: INewsRepository,
		private regionsRepository: IRegionsRepository,
		private initiativeTypesRepository: IInitiativeTypesRepository,
		private initiativeRepository: IInitiativeRepository,
		private usersRepository: IUsersRepository,
		private ordersRepository: IOrdersRepository,
		private emailService: IEmailService,
	) {
	}

	async data(): Promise<TClientData> {
		return {
			news: this.formatDate(await this.newsRepository.list(0, this.onPage) || []),
			regions: await this.regionsRepository.list(),
			types: await this.initiativeTypesRepository.listGroup(0, this.currentRegion),
		}
	}

	formatDate(news: TNews[]): TNewsList {
		return news.map((item: TNews & TNewsTime) => {
			const momentDate = moment(item.date, 'YYYY-MM-DD');
			item.timeShort = momentDate.format('DD/MM');
			item.timeInfo = momentDate.format('DD-MM-YYYY');
			return item;
		});
	}

	async initiatives(typeId: number): Promise<TInitiativeList | TClientDataError> {
		return await this.initiativeRepository.listByType(typeId);
	}

	async search(text: string, direction: number = 0): Promise<TInitiativeList | TClientDataError> {
		return await this.initiativeRepository.listByText(text, direction)
	}

	async news(page?: number, slug?: string): Promise<TNews & TNewsTime | TNewsList | undefined> {
		if (slug) {
			const newsText = await this.newsRepository.text(slug);
			if (!newsText) return newsText;
			moment.locale('ru');
			const momentDate = moment(newsText.date, 'YYYY-MM-DD');
			return {...newsText, ...{timeInfo:  momentDate.format('LLLL')}}
		}
		page = page || 1;
		const news = await this.newsRepository.list((page - 1) * this.onPage, this.onPage);
		if (news) {
			return news.map((item: TNews & TNewsTime) => {
				const momentDate = moment(item.date, 'YYYY-MM-DD');
				item.timeShort = momentDate.format('DD/MM');
				item.timeInfo = momentDate.format('DD-MM-YYYY');
				return item;
			});
		}
		return undefined;
	}


	async types(direction: number, regionId?: number): Promise<TInitiativeTypes[] | undefined> {
		return await this.initiativeTypesRepository.listGroup(direction, regionId || this.currentRegion);
	}

	async makeOrder(order: TOrder): Promise<TOrderResponse> {
		console.log('makeOrder', order);
		const result: TOrderResponse = {
			errors: undefined,
			order: undefined,
		}
		const code = makeConfirmCode();

		if (!order?.user) {
			result.errors = { other: 'Необходимо указать ваш Email и данные ФИО, необходимо для регистрации в системе и дальнейшего взаимодействия с исполнителем' }
			return result;
		}
		if (!order?.user.email.trim()) {
			result.errors = { email: 'Не указан email' }
			return result;
		}
		if (!order?.user.id) {
/*
			const user: TUser | null = await this.usersRepository.checkEmail(order?.user.email);
			if (user) {
				result.errors = { email: 'Пользователь с указанным email уже существует' }
				return result;
			}
*/
		}
		if (!order?.user?.fio?.trim()) {
			result.errors = { fio: 'Не указан ФИО пользователя' }
			return result;
		}

		if (!order?.user?.confirmCode) {
			await this.usersRepository.saveCode(order?.user.email, code);
			try {
				await this.sendEmail(order?.user.email, code);
			}catch (e) {
				result.errors = { other: 'Ошибка отправки Email, проверьте правильность написания или попробуйте повторить позже' }
				return result;
			}
			result.order = order;
			return result;
		}
		const logged: TUser | undefined = await this.usersRepository.registration({
			email: order?.user.email,
			fio: order?.user.fio,
			code: order?.user.confirmCode
		});
		if (!logged) {
			result.errors = { confirm: 'Указан неверный код' }
			return result;
		}
		// Код принят формируем заявку
		const created = await this.ordersRepository.create(order);
		if (!created) {
			result.errors = { other: 'Ошибка создания заявки' }
		}
		result.order = created;
		console.log('makeOrder. Last', result);
		return result;
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

}