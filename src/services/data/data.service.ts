import type { IDataService } from '~/src/services/data/data.service.interface';
import type { TClientData, TClientDataError } from '~/src/data/types/common.data';
import type { TInitiativeTypes } from '~/src/data/types/initiatives.types';
import type { TInitiativeList, TShortInitiative } from '~/src/data/types/initiatives';
import type { TNews, TNewsList, TNewsTime } from '~/src/data/types/news';
import type { INewsRepository } from '~/src/data/news.repository.interface';
import type { IRegionsRepository } from '~/src/data/regions.repositiory.interface';
import type { IInitiativeTypesRepository } from '~/src/data/initiative.types.repository.inerface';
import type { IInitiativeRepository } from '~/src/data/initiative.repository.interface';
import type { IUsersRepository } from '~/src/users/users.repository.interface';
import type { TOrder, TOrderResponse } from '~/src/data/types/order';
import type { TUser, TUserRegistration } from '~/src/users/types/users';
import type { TEmailResponse } from '~/src/services/email/email.types';
import type { IEmailService } from '~/src/services/email/email.service.interface';
import type { IOrdersRepository } from '~/src/data/orders.repository.interface';
import type { TCompany, TCompanyWithInitiatives } from '~/src/data/types/company';
import type { ICompanyRepository } from '~/src/data/company.repository.interface';
import { makeConfirmCode } from '~/src/utils/makeConfirmCode';
import { sha256 } from 'ohash';
import moment from 'moment/moment.js';
import type { TReviewList } from '~/src/data/types/reviews';
import type { IReviewsRepository } from '~/src/data/reviews.repository.interface';

export class DataService implements IDataService {
	private onPage: number = 20;
	private currentRegion: number = 1;
	constructor(
		private newsRepository: INewsRepository,
		private regionsRepository: IRegionsRepository,
		private initiativeTypesRepository: IInitiativeTypesRepository,
		private initiativeRepository: IInitiativeRepository,
		private companyRepository: ICompanyRepository,
		private usersRepository: IUsersRepository,
		private ordersRepository: IOrdersRepository,
		private reviewsRepository: IReviewsRepository,
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

	async initiatives(typeId: number, direction?: number, regionId?: number, fnd?: string): Promise<TInitiativeList | TClientDataError> {
		return await this.initiativeRepository.listByType(typeId, direction, regionId, fnd);
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


	async types(direction: number, regionId?: number, fnd?: string): Promise<TInitiativeTypes[] | undefined> {
		return await this.initiativeTypesRepository.listGroup(direction, regionId || this.currentRegion, fnd);
	}

	async makeOrder(order: TOrder): Promise<TOrderResponse> {
		console.log('makeOrder', order);
		const result: TOrderResponse = {
			errors: undefined,
			order: undefined,
		}

		if (!order?.user) {
			result.errors = { other: 'Необходимо указать ваш Email и данные ФИО, необходимо для регистрации в системе и дальнейшего взаимодействия с исполнителем' }
			return result;
		}
		if (!order?.user.email.trim()) {
			result.errors = { email: 'Не указан email' }
			return result;
		}
		if (!order?.user?.fio?.trim()) {
			result.errors = { fio: 'Не указан ФИО пользователя' }
			return result;
		}
		// Если не указан код, то генерим его и проверяем пользователя в базе и если нет, то создаём
		if (!order?.user?.confirmCode) {
			const code = makeConfirmCode();
			await this.usersRepository.userOrder(order?.user.email, code);
			try {
				const send = await this.sendEmail(order?.user.email, code);
				if (!send) {
					result.errors = { other: 'Ошибка отправки Email, проверьте правильность написания или попробуйте повторить позже' }
				}
			}catch (e) {
				result.errors = { other: 'Ошибка отправки Email, проверьте правильность написания или попробуйте повторить позже' }
				return result;
			}
			result.order = order;
			return result;
		}
		const registrationData: TUserRegistration = {
			email: order?.user.email,
			fio: order?.user.fio,
			code: order?.user.confirmCode
		};
		const logged: TUser | undefined = await this.usersRepository.registration(registrationData);
		if (!logged) {
			result.errors = { confirm: 'Указан неверный код' }
			return result;
		}
		// Код принят формируем заявку
		return this.completeCreateOrder(order, logged);
	}

	private async completeCreateOrder(order: TOrder, logged: TUser): Promise<TOrderResponse> {
		const result: TOrderResponse = {
			errors: undefined,
			order: undefined,
		}
		let hashCode: string;
		order.user = logged;
		let created: TOrder | undefined = undefined;
		try {
			created = await this.ordersRepository.create(order);
			if (!created) {
				result.errors = { other: 'Ошибка создания заявки' }
			}else {
				hashCode = sha256(`i:${created.id}:${typeof order.initiative === 'number' ? order.initiative : order.initiative?.id},u:${logged.email}`)
				await this.ordersRepository.saveCode(created.id || 0, hashCode);
				order.code = hashCode;
				created.code = hashCode;
				if (typeof order.initiative === 'number') {
					order.initiative = await this.initiativeRepository.get(order.initiative);
				}
				if (!await this.sendOrderLink(order?.user.email, order, created?.id || 0)) {
					result.errors = { other: 'Ошибка отправки ссылки на заказ на email' }
				}
			}
		} catch (e) {
			result.errors = { other: 'Ошибка создания заявки и отправки ссылки на заказ на email' }
		}
		result.order = created;
		// Так же формируем код доступа к заказу
		console.log('makeOrder. Last', result);
		return result;
	}

	private async sendEmail(email: string, code: string): Promise<boolean> {
		const result: TEmailResponse = await this.emailService.send({
			to: email,
			from: process.env.MAIL_FROM || '',
			subject: 'Код подтверждения',
			text: `Код подтверждения: ${code}`,
			html: `<html lang="ru"><head></head><body><h1>Код подтверждения: ${code}</h1></body></html>`
		});
		console.log('sendEmail', result);
		return !result.error;

	}

	/**
	 * Отправка ссылки на заказ
	 * @param email
	 * @param order
	 * @param orderNum
	 * @private
	 */
	private async sendOrderLink(email: string, order: TOrder, orderNum: number): Promise<boolean> {

		const initiative = order.initiative as TShortInitiative;
		const result: TEmailResponse = await this.emailService.send({
			to: email,
			from: process.env.MAIL_FROM || '',
			subject: `Заказ №${orderNum} на «${initiative.name}»`,
			text: `Вами была сформирована заявка №${orderNum} на «${initiative.name}», для дальнейшего взаимодействия с исполнителем перейдите по ссылке: http://localhost:3000/orders/${order.code}`,
			html: `<html lang="ru">
				<head></head>
				<body>
				<h1>Заявка №${orderNum}</h1>
				<h2>Вами была сформирована на услугу «${initiative.name}»</h2>
				<h3>Для дальнейшего взаимодействия с исполнителем <a href="http://localhost:3000/orders/${order.code}">перейдите по ссылке</a> </h3>
				</body></html>`
		})
		return !result.error;
	}

	async companies(slug?: string): Promise<TCompany[] | TCompanyWithInitiatives | TClientDataError> {
		const error = { message: 'Ошибка получения списка компаний' };
		try {
			let result;
			if (slug) {
				const company = await this.companyRepository.getBySlug(slug);
				const initiatives = await this.initiativeRepository.listByCompany(company?.id || 0);
				if (!company) return error;
				return { company, initiatives }
			} else {
				result = await this.companyRepository.listAll();
			}
			return result || error;
		}catch (e) {
			return error;
		}
	}

	async initiativesPromo(): Promise<TInitiativeList | TClientDataError> {
		return await this.initiativeRepository.listPromo();
	}

	async reviews(): Promise<TReviewList | TClientDataError> {
		try {
			const reviews = await this.reviewsRepository.list();
			if (reviews) return reviews;
		} catch (e: any) {
			return {
				message: e?.message || 'Ошибка получения списка отзывов'
			}
		}
		return {
			message: 'Ошибка получения списка отзывов'
		}
	}

}