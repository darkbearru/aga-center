import type { IAdminService } from '~/src/services/admin/admin.service.interface';
import type { INewsRepository } from '~/src/data/news.repository.interface';
import type { TAdminMenu, TCommonData } from '~/src/data/types/common.data';
import type { IUsersRepository } from '~/src/users/users.repository.interface';
import type { TUser, TUserResponse } from '~/src/users/types/users';
import type { IRegionsRepository } from '~/src/data/regions.repositiory.interface';
import type { TRegion, TRegionResponse } from '~/src/data/types/regions';
import type { TOwnership, TOwnershipResponse } from '~/src/data/types/ownership';
import type { IOwnershipRepository } from '~/src/data/ownership.repository.interface';
import type { IInitiativeTypesRepository } from '~/src/data/initiative.types.repository.inerface';
import type { TInitiativeTypes, TInitiativeTypesResponse } from '~/src/data/types/initiatives.types';
import type { TNews, TNewsResponse } from '~/src/data/types/news';
import type { TCompany, TCompanyResponse, TContacts } from '~/src/data/types/company';
import type { ICompanyRepository } from '~/src/data/company.repository.interface';
import type {
	TInitiative,
	TInitiativeDeleteResponse,
	TInitiativeResponse,
	TInitiativeWithID,
	TInitiativeWithOrders
} from '~/src/data/types/initiatives';
import type { IInitiativeRepository } from '~/src/data/initiative.repository.interface';
import type { TPhotoItem, TPhotos } from '~/src/data/types/photos';
import type { TArticle, TArticleFormData, TArticleResponse, TArticles } from '~/src/data/types/articles';
import type { TUsersPayload } from '~/src/users/users.payload';
import type { IArticlesRepository } from '~/src/data/articles.repository.interface';
import type { IPhotosRepository } from '~/src/data/photos.repository.interface';
import type { IOrdersRepository } from '~/src/data/orders.repository.interface';
import type { TOrder, TOrderMessage } from '~/src/data/types/order';
import { OrderStatus } from '~/src/data/types/order';
import { emailValidate } from '~/src/services/validation/validation';
import ms from 'ms';
import * as fs from 'fs';
import moment from 'moment/moment.js';
import type { IReviewsRepository } from '~/src/data/reviews.repository.interface';

export class AdminService implements IAdminService {
	constructor(
		private user: TUsersPayload,
		private newsRepository: INewsRepository,
		private articlesRepository: IArticlesRepository,
		private usersRepository: IUsersRepository,
		private regionsRepository: IRegionsRepository,
		private ownershipRepository: IOwnershipRepository,
		private initiativeTypesRepository: IInitiativeTypesRepository,
		private companyRepository: ICompanyRepository,
		private initiativeRepository: IInitiativeRepository,
		private photosRepository: IPhotosRepository,
		private ordersRepository: IOrdersRepository,
		private reviewsRepository: IReviewsRepository,
	) {
	}


	async data(): Promise<TCommonData> {
		const menu: TAdminMenu = {};
		const regions: TRegion[] | undefined = await this.regionsRepository.list();
		const types: TInitiativeTypes[] | undefined = await this.initiativeTypesRepository.list();
		const ownership: TOwnership[] | undefined = await this.ownershipRepository.list();
		let news: TNews[] | undefined = undefined;
		let users: TUser[] | undefined = undefined;
		let companies: TCompany[] | undefined = undefined;
		let articles: TArticles | undefined = undefined;
		let initiatives: TInitiative[] | undefined = undefined;
		let isAdmin: boolean = (this.user?.rights && ((this.user?.rights&2) > 0)) || false;
		let isModerator: boolean = (this.user?.rights && ((this.user?.rights&1) > 0)) || false;
		let promo: TInitiative[] | undefined = undefined;
		if (isAdmin) {
			menu['/client/users'] = 'Пользователи';
			menu['/client/regions'] = 'Регионы';
			users = await this.getUsersList();
		}
		if (isAdmin || isModerator) {
			menu['/client'] = 'Новости';
			menu['/client/articles'] = 'Статьи';
			menu['/client/ownership'] = 'Типы собственности';
			menu['/client/types'] = 'Типы инициатив';
			menu['/client/moderation'] = 'Модерация';
			menu['/client/promo'] = 'Промо-блок';
			news = await this.getNewsList();
			articles = await this.getArticlesList();
			companies  = await this.companyRepository.moderationList();
			initiatives = await this.initiativeRepository.moderationList();
			promo = await this.getAllInitiatives();
		}
		if (!isAdmin && !isModerator) {
			menu['/client'] = 'Компания / Инициативы';
			menu['/client/orders'] = 'Заявки';
			companies = await this.companyRepository.list(this.user);
			initiatives = await this.initiativeRepository.list(this.user);
		}
		menu['/client/profile'] = 'Профиль';
		menu['/client/logout'] = 'Выйти';
		return {
			user: this.user,
			menu,
			news,
			articles,
			users,
			regions,
			ownership,
			types,
			companies,
			initiatives,
			promo
		}
	}

	async newsSave(news: TNews): Promise<TNewsResponse> {
		const check: boolean = await this.newsRepository.check(news);
		const response: TNewsResponse = {
			errors: undefined,
			news
		}
		if (!check) {
			response.errors = {
				title: `Новость с заголовком «${news.title}» уже существует`
			}
		}
		if (!news.title.trim()) {
			response.errors = {...response.errors, title: 'Не указан заголовок новости'}
		}
		if (!news.slug.trim()) {
			response.errors = {...response.errors, slug: 'Не указан идентификатор новости'}
		}
		if (!news?.text?.trim()) {
			response.errors = {...response.errors, text: 'Не указан текст новости'}
		}
		if(response.errors) return response;

		if (!news.id) {
			const result = await this.newsRepository.add(news);
			if (typeof result !== 'boolean') {
				response.news = result;
			} else {
				response.errors = {other: 'Ошибка добавления данных'}
			}
		} else {
			if (await this.newsRepository.save(news)) {
				response.news = news
			} else {
				response.errors = {other: 'Ошибка сохранения данных'}
			}
		}
		return response;
	}

	async newsDelete(news: TNews): Promise<boolean> {
		return await this.newsRepository.delete(news);
	}

	private async getNewsList(page: number = 0): Promise<TNews[] | undefined> {
		const onPage: number = Number(process.env?.NEWS_ON_PAGE) || 20;
		const newsCount: number = await this.newsRepository.count();
		const skip: number = Math.floor(newsCount / onPage) + (newsCount > onPage ? newsCount % onPage : 0);

		return await this.newsRepository.list(skip, onPage);
	}

	async articlesSave(article: TArticleFormData): Promise<TArticleResponse> {
		article.id = Number(article.id);
		article.active = Boolean(article.active);

		const check: boolean = await this.articlesRepository.check(article);
		const response: TArticleResponse = {
			errors: undefined,
			article
		}
		if (!check) {
			response.errors = {
				title: `Статья с заголовком «${article.title}» уже существует`
			}
		}

		if (!article.title.trim()) {
			response.errors = {...response.errors, title: 'Не указан заголовок новости'}
		}
		if (!article.slug.trim()) {
			response.errors = {...response.errors, slug: 'Не указан идентификатор новости'}
		}
		if (!article?.text?.trim()) {
			response.errors = {...response.errors, text: 'Не указан текст новости'}
		}
		if(response.errors) return response;

		if (!article.id) {
			const result = await this.articlesRepository.add(article);
			if (typeof result !== 'boolean') {
				response.article = result;
			} else {
				response.errors = {other: 'Ошибка добавления данных'}
			}
		} else {
			const deletedPhotos: TPhotos | undefined = article.photos?.filter(item => item.isDeleted);
			article.photos = article.photos?.filter(item => !item.isDeleted);

			if (deletedPhotos) await this.deletePhotos(deletedPhotos);

			if (await this.articlesRepository.save(article)) {
				response.article = {...article}
			} else {
				response.errors = {other: 'Ошибка сохранения данных'}
			}
		}
		return response;
	}

	async articlesDelete(article: TArticle): Promise<boolean> {
		return await this.articlesRepository.delete(article);
	}

	private async getArticlesList(page: number = 0): Promise<TArticles | undefined> {
		const onPage: number = Number(process.env?.NEWS_ON_PAGE) || 20;
		const articlesCount: number = await this.articlesRepository.count();
		const skip: number = Math.floor(articlesCount / onPage) + (articlesCount > onPage ? articlesCount % onPage : 0);

		return await this.articlesRepository.list(skip, onPage);
	}


	async userSave(user: TUser): Promise<TUserResponse> {
		const response: TUserResponse = {
			errors: undefined,
			user: user
		}
		if (!user?.email.trim() || !emailValidate(user?.email)) {
			response.errors = {
				email: 'Не указан или указан неверно email'
			};
		}
		if (!user?.fio || !user?.fio.trim()) {
			response.errors = {...response.errors, fio: 'Не указаны или указаны неверно данные ФИО'};
		}
		if (response.errors) return response;

		const res = await this.usersRepository.checkEmail(user?.email, user?.id);
		if (res) {
			response.errors = {
				email: 'Пользователь с данным email уже существует'
			};
			return response;
		}

		try {
			response.user = await this.usersRepository.save(user);
		} catch (e: any) {
			response.errors = {
				other: 'Ошибка сохранения данных'
			};
			if (e) {
				response.errors = { other: e?.message }
			}
		}
		return response;
	}

	async userDelete(user: TUser): Promise<TUser | null> {
		if (user?.id) return await this.usersRepository.delete(user?.id);
		return null;
	}

	private async getUsersList(page: number = 0): Promise<TUser[] | undefined> {
		const onPage: number = Number(process.env?.USERS_ON_PAGE) || 20;
		const newsCount: number = await this.usersRepository.count();
		const skip: number = Math.floor(newsCount / onPage) + (newsCount > onPage ? newsCount % onPage : 0);

		return await this.usersRepository.list(skip, onPage);
	}

	async regionSave(region: TRegion): Promise<TRegionResponse> {
		const check: boolean = await this.regionsRepository.checkSlug(region);
		const response: TRegionResponse = {
			errors: undefined,
			region
		}
		if (!check) {
			response.errors = {
				slug: `Регион c идентификатором «${region.slug}» уже существует`
			}
		}
		if (!region.slug.trim()) {
			response.errors = {...response.errors, slug: 'Не указан идентификатор региона'}
		}
		if (!region.name.trim()) {
			response.errors = {...response.errors, name: 'Не указано название региона'}
		}
		if(response.errors) return response;

		if (!region.id) {
			response.region = await this.regionsRepository.add(region);
		} else {
			if (await this.regionsRepository.save(region)) {
				response.region = region
			} else {
				response.errors = {other: 'Ошибка сохранения данных'}
			}
		}
		return response;
	}
	async regionDelete(region: TRegion): Promise<boolean> {
		return await this.regionsRepository.delete(region);
	}

	async ownershipSave(ownership: TOwnership): Promise<TOwnershipResponse> {
		const check: boolean = await this.ownershipRepository.check(ownership);
		const response: TOwnershipResponse = {
			errors: undefined,
			ownership
		}
		if (!check) {
			response.errors = {
				nameShort: `Форма собственности «${ownership.nameShort}» уже существует`
			}
		}
		if (!ownership.nameShort.trim()) {
			response.errors = {...response.errors, nameShort: 'Не указано сокращенное название формы собственности'}
		}
		if (!ownership.nameFull.trim()) {
			response.errors = {...response.errors, nameFull: 'Не указано полное название формы собственности'}
		}
		if(response.errors) return response;

		if (!ownership.id) {
			response.ownership = await this.ownershipRepository.add(ownership);
		} else {
			if (await this.ownershipRepository.save(ownership)) {
				response.ownership = ownership
			} else {
				response.errors = {other: 'Ошибка сохранения данных'}
			}
		}
		return response;
	}
	async ownershipDelete(ownership: TOwnership): Promise<boolean> {
		return await this.ownershipRepository.delete(ownership);
	}

	async initiativeTypesSave(type: TInitiativeTypes): Promise<TInitiativeTypesResponse> {
		const check: boolean = await this.initiativeTypesRepository.check(type);
		const response: TInitiativeTypesResponse = {
			errors: undefined,
			type
		}
		if (!check) {
			response.errors = {
				name: `Тип инициативы «${type.name}» уже существует`
			}
		}
		if (!type.name.trim()) {
			response.errors = {...response.errors, name: 'Не указано название типа инициативы'}
		}
		if(response.errors) return response;

		if (!type.id) {
			response.type = await this.initiativeTypesRepository.add(type);
		} else {
			if (await this.initiativeTypesRepository.save(type)) {
				response.type = type
			} else {
				response.errors = {other: 'Ошибка сохранения данных'}
			}
		}
		return response;
	}
	async initiativeTypesDelete(type: TInitiativeTypes): Promise<boolean> {
		return await this.initiativeTypesRepository.delete(type);
	}

	async companyDelete(company: TCompany): Promise<boolean> {
		return await this.companyRepository.delete(company);
	}

	async companySave(company: TCompany): Promise<TCompanyResponse> {
		const check: boolean | TCompany = await this.companyRepository.check(company);
		const response: TCompanyResponse = {
			errors: undefined,
			company
		}
		if (check && typeof check === 'object') {
			if ((check as TCompany)?.nameShort === company?.nameShort) {
				response.errors = {
					...response.errors,
					nameShort: `Компания c кратким названием «${company.nameShort}» уже существует`
				}
			}
			if ((check as TCompany)?.slug === company?.slug) {
				response.errors = {
					...response.errors,
					slug: `Компания c идентификатором «${company.slug}» уже существует`
				}

			}
			if ((check as TCompany)?.nameFull === company?.nameFull) {
				response.errors = {
					...response.errors,
					nameFull: `Компания «${company.nameFull}» уже существует`
				}
			}
		}
		if (!company.nameFull?.trim()) {
			response.errors = {...response.errors, nameFull: 'Не указано наименование компании'}
		}
		if (!company.nameShort?.trim()) {
			response.errors = {...response.errors, nameShort: 'Не указано краткое наименование компании'}
		}
		if (!company.slug?.trim()) {
			response.errors = {...response.errors, slug: 'Не указан идентификатор для формирования ссылки на страницу компании'}
		}
		if (!company.requsites?.trim()) {
			response.errors = {...response.errors, requsites: 'Не указаны реквизиты компании'}
		}
		if (!company.contacts) {
			response.errors = {...response.errors, contacts: 'Не указана контактная информация'}
		}
		if(response.errors) return response;

		company.user = {
			id: this.user.id,
			email: this.user.email,
			fio: this.user.fio
		};
		console.log(company);

		if (!company.id) {
			company.contacts = company.contacts?.filter(item => !item.isDeleted);
			const res= await this.companyRepository.add(company);
			if (res) {
				response.company = res;
			} else {
				response.errors = {other: 'Ошибка сохранения данных'}
			}
		} else {
			const deletedContacts: TContacts | undefined = company.contacts?.filter(item => item.isDeleted);
			company.contacts = company.contacts?.filter(item => !item.isDeleted);
			if (deletedContacts) {
				await this.companyRepository.deleteContacts(deletedContacts);
			}

			const res = await this.companyRepository.save(company);
			if (res) {
				response.company = res
			} else {
				response.errors = {other: 'Ошибка сохранения данных'}
			}
		}
		return response;
	}

	async companyList(): Promise<TCompany[] | undefined> {
		return await this.companyRepository.list(this.user);
	}

	async initiativeList(): Promise<TInitiative[] | undefined> {
		return await this.initiativeRepository.list(this.user);
	}

	async initiativeDelete(item: TInitiative): Promise<TInitiativeDeleteResponse> {
		const response : TInitiativeDeleteResponse = {
			status: true,
		}
		const result = await this.initiativeRepository.delete(item, this.user);
		if (typeof result === 'number') {
			response.errors = `Удаление не возможно, у инициативы ${result} активных заявок`;
			response.status = false;
		} else {
			response.status = result;
		}
		await this.initiativeRemoveOld();
		return response;
	}


	async initiativeSave(data: TInitiativeWithID): Promise<TInitiativeResponse> {
		// const item: TInitiative = await this.savePhotos<TInitiative>(event);
		const item: TInitiative | undefined = await this.initiativeRepository.check(data);
		const response: TInitiativeResponse = {
			errors: undefined,
			initiative: item
		}
		if (item) {
			response.errors = {
				name: `Инициатива «${item.name}» в регионе «${item.region.name}» уже существует`
			}
		}
		if (!data.name.trim()) {
			response.errors = {...response.errors, name: 'Не указано наименование инициативы'}
		}
		if (!data.text?.trim()) {
			response.errors = {...response.errors, text: 'Не указан текст описания инициативы'}
		}
		if(response.errors) return response;

		if ((typeof data?.id === 'undefined') || (data?.id === '0')) {
			const res= await this.initiativeRepository.add(data);
			if (res) {
				response.initiative = res;
			} else {
				response.errors = {other: 'Ошибка сохранения данных'}
			}
		} else {
			const deletedPhotos: TPhotos | undefined = data.photos?.filter(item => item.isDeleted);
			data.photos = data.photos?.filter(item => !item.isDeleted);

			if (deletedPhotos) await this.deletePhotos(deletedPhotos);

			const result = await this.initiativeRepository.save(data, this.user);
			if (result) {
				response.initiative = await this.initiativeRepository.select(Number(data.id));
			} else {
				response.errors = {other: 'Ошибка сохранения данных'}
			}
		}
		await this.initiativeRemoveOld();
		return response;
	}

	/**
	 * Удаляем давно удалённые инициативы и их фото
	 */
	async initiativeRemoveOld(): Promise<void> {
		const exp: Date = new Date();
		const deletedPhotos: TPhotos = [];
		exp.setTime(Date.now() + ms('-' + (process?.env?.DELETED_RECORDS_STORE_TIME || '90 days')));
		console.log('initiativeRemoveOld', exp);
		const records: TInitiative[] | undefined = await this.initiativeRepository.selectDeleted(exp);
		console.log('Records', records);
		if (typeof records === 'undefined') return;
		if (records?.length === 0) return;

		records.forEach((record: TInitiative) => {
			if (record.photos) record.photos?.forEach((photo: TPhotoItem) => {
				deletedPhotos.push(photo);
			});
		});
		console.log('Deleted ID', records.map(item => item.id || 0));
		await this.initiativeRepository.deleteMany(records.map(item => item.id || 0));
		await this.deletePhotos(deletedPhotos);
	}


	async moderationCompany(id: number, operation: string, reason?: string): Promise<TCompany[] | undefined> {
		console.log(operation, reason);
		if (operation === 'approved') {
			await this.companyRepository.moderationApprove(id);
		} else {
			await this.companyRepository.moderationDecline(id, reason || 'Bad reason');
		}
		return await this.companyRepository.moderationList();
	}

	async moderationInitiative(id: number, operation: string, reason?: string): Promise<TInitiative[] | undefined> {
		if (operation === 'approved') {
			await this.initiativeRepository.moderationApprove(id);
		} else {
			await this.initiativeRepository.moderationDecline(id, reason || 'Bad reason');
		}
		return await this.initiativeRepository.moderationList();
	}

	async moderationList(): Promise<TCommonData> {
		const companies: TCompany[] | undefined  = await this.companyRepository.moderationList();
		const initiatives: TInitiative[] | undefined = await this.initiativeRepository.moderationList();
		return {
			companies,
			initiatives
		}
	}

	async companyAndInitiativesList(): Promise<TCommonData> {
		const companies: TCompany[] | undefined = await this.companyRepository.list(this.user);
		const initiatives: TInitiative[] | undefined = await this.initiativeRepository.list(this.user);
		return {
			companies,
			initiatives
		}
	}


	async deletePhotos(photos: TPhotos): Promise<void> {
		console.log('Deleted Photos', photos);
		// Удаляем в базе
		await this.photosRepository.deletePhotos(photos);
		// Удаляем на диске
		const current = `${process.cwd()}/public`
		photos.forEach(file => {
			console.log(`Delete file ${file.path}`);
			fs.unlink(`${current}${file.path}`, err => {
				if (err) console.log('Error File delete', err);
			})
		});
	}


	async ordersList(): Promise<TInitiativeWithOrders | null> {
		let list: TInitiativeWithOrders | null = await this.ordersRepository.list(this.user);
		moment.locale('ru');
		if (list) {
			list = list?.map(item => {
				item.orders = item.Order?.map(order => this.updateOrderData(order));
				delete item.Order;
				return item;
			})

		}
		return list;
	}

	async orderByCode(code: string): Promise<TOrder | null> {
		let order: TOrder | null = await this.ordersRepository.get(code);
		moment.locale('ru');
		if (order) order = this.updateOrderData(order);
		return order;
	}

	async orderAddMessage(code: string, status: OrderStatus, message: TOrderMessage): Promise<TOrder | null> {
		let order: TOrder | null = null;
		try {
			order = await this.ordersRepository.addMessage(code, status, message);
			if (status === OrderStatus.complete && order) {
				// Если завершение работы, то последнее сообщение это ещё и отзыв
				await this.reviewsRepository.add({
					review: message.message,
					rate:  message.rating,
					initiative: order.initiative as TInitiative,
					user: order.user
				});
				// Получаем полные данные по заказу, чтобы потом сделать все расчёты
				await this.initiativeRepository.calcRating((order.initiative as TInitiative).id || 0);
				await this.companyRepository.calcRating((order.initiative as TInitiative).company.id || 0);
			}
		} catch (e) {
		}
		if (!order) return null;
		return this.updateOrderData(order);
	}

	private updateOrderData(order: TOrder ): TOrder {
		const changedDate = moment(order.changedAt, 'YYYY-MM-DD HH:II:SS');
		order.changed = changedDate.format('LLLL');
		const createdDate = moment(order.createdAt, 'YYYY-MM-DD HH:II:SS');
		order.created = createdDate.format('LLLL');
		return order;
	}

	async setPromo(id: number, isActivate: boolean = false): Promise<string> {
		const result = await this.initiativeRepository.setPromo(id, isActivate);
		if (!result) return '';
		moment.locale('ru');
		const momentDate = moment(result, 'YYYY-MM-DD HH:II:SS');
		return  momentDate.format('LLLL');
	}

	async getAllInitiatives(): Promise<TInitiative[] | undefined> {
		moment.locale('ru');
		const data = await this.initiativeRepository.listAll();
		data?.map((item: TInitiative) => {
			if (item.promo) {
				const momentDate = moment(item.promo, 'YYYY-MM-DD HH:II:SS');
				item.promoStr = momentDate.format('LLLL');
			}
		});
		return data;
	}

}