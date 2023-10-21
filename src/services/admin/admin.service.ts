import { IAdminService } from '~/src/services/admin/admin.service.interface';
import { INewsRepository } from '~/src/data/news.repository.interface';
import { Articles, News, Users } from '.prisma/client';
import { TAdminMenu, TCommonData } from '~/src/data/types/common.data';
import { IUsersRepository } from '~/src/users/users.repository.interface';
import { TUser, TUserResponse } from '~/src/users/types/users';
import { emailValidate } from '~/src/services/validation/validation';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { IRegionsRepository } from '~/src/data/regions.repositiory.interface';
import { TRegion, TRegionResponse } from '~/src/data/types/regions';
import { TOwnership, TOwnershipResponse } from '~/src/data/types/ownership';
import { IOwnershipRepository } from '~/src/data/ownership.repository.interface';
import { IInitiativeTypesRepository } from '~/src/data/initiative.types.repository.inerface';
import { TInitiativeTypes, TInitiativeTypesResponse } from '~/src/data/types/initiatives.types';
import { TNews, TNewsResponse } from '~/src/data/types/news';
import { TCompany, TCompanyResponse, TContacts } from '~/src/data/types/company';
import { ICompanyRepository } from '~/src/data/company.repository.interface';
import { TInitiative, TInitiativeResponse } from '~/src/data/types/initiatives';
import { IInitiativeRepository } from '~/src/data/initiative.repository.interface';

export class AdminService implements IAdminService {
	constructor(
		private user: Users,
		private newsRepository: INewsRepository,
		private usersRepository: IUsersRepository,
		private regionsRepository: IRegionsRepository,
		private ownershipRepository: IOwnershipRepository,
		private initiativeTypesRepository: IInitiativeTypesRepository,
		private companyRepository: ICompanyRepository,
		private initiativeRepository: IInitiativeRepository,
	) {
	}


	async data(): Promise<TCommonData> {
		const menu: TAdminMenu = {};
		let news: News[] | undefined = undefined;
		let users: TUser[] | undefined = undefined;
		let regions: TRegion[] | undefined = undefined;
		let types: TInitiativeTypes[] | undefined = undefined;
		let companies: TCompany[] | undefined = undefined;
		let articles: Articles[] | undefined = undefined;
		let initiatives: TInitiative[] | undefined = undefined;
		const ownership: TOwnership[] | undefined = await this.ownershipRepository.list();
		if (this.user.isAdmin) {
			menu['/client'] = 'Новости';
			menu['/client/articles'] = 'Статьи';
			menu['/client/users'] = 'Пользователи';
			menu['/client/regions'] = 'Регионы';
			menu['/client/ownership'] = 'Типы собственности';
			menu['/client/types'] = 'Типы инициатив';
			news = await this.getNewsList();
			users = await this.getUsersList();
			regions = await this.regionsRepository.list();
			types = await this.initiativeTypesRepository.list();

		}
		if (this.user.isAdmin || this.user.isModerator) {
			menu['/client/moderation'] = 'Модерация';
		}
		if (!this.user.isAdmin && !this.user.isModerator) {
			menu['/client'] = 'Компания / Инициативы';
			menu['/client/orders'] = 'Заявки';
			companies = await this.companyRepository.list(this.user);
			initiatives = await this.initiativeRepository.list(this.user);
		}
		menu['/client/profile'] = 'Профиль';
		return {
			user: this.user,
			menu,
			news,
			users,
			articles,
			regions,
			ownership,
			types,
			companies,
			initiatives
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
		} catch (e) {
			response.errors = {
				other: 'Ошибка сохранения данных'
			};
			if (e instanceof PrismaClientKnownRequestError) {
				response.errors = { other: e?.message }
			}
		}
		return response;
	}

	async userDelete(user: TUser): Promise<TUser | null> {
		if (user?.id) return await this.usersRepository.delete(user?.id);
		return null;
	}

	private async getNewsList(page: number = 0): Promise<News[] | undefined> {
		const onPage: number = Number(process.env?.NEWS_ON_PAGE) || 20;
		const newsCount: number = await this.newsRepository.count();
		const skip: number = Math.floor(newsCount / onPage) + (newsCount > onPage ? newsCount % onPage : 0);

		return await this.newsRepository.list(skip, onPage);
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
		const check: boolean = await this.companyRepository.check(company);
		const response: TCompanyResponse = {
			errors: undefined,
			company
		}
		if (!check) {
			response.errors = {
				nameFull: `Компания «${company.nameFull}» уже существует`
			}
		}
		if (!company.nameFull.trim()) {
			response.errors = {...response.errors, nameFull: 'Не указано наименование компании'}
		}
		if (!company.nameShort?.trim()) {
			response.errors = {...response.errors, nameShort: 'Не указано краткое наименование компании'}
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

			if (await this.companyRepository.save(company)) {
				response.company = company
			} else {
				response.errors = {other: 'Ошибка сохранения данных'}
			}
		}
		return response;
	}

	async initiativeDelete(item: TInitiative): Promise<boolean> {
		return await this.initiativeRepository.delete(item, this.user);
	}

	async initiativeSave(item: TInitiative): Promise<TInitiativeResponse> {
		const check: boolean = await this.initiativeRepository.check(item);
		const response: TInitiativeResponse = {
			errors: undefined,
			initiative: item
		}
		if (!check) {
			response.errors = {
				name: `Инициатива «${item.name}» в регионе «${item.region.name}» уже существует`
			}
		}
		if (!item.name.trim()) {
			response.errors = {...response.errors, name: 'Не указано наименование инициативы'}
		}
		if (!item.text?.trim()) {
			response.errors = {...response.errors, text: 'Не указан текст описания инициативы'}
		}
		if(response.errors) return response;

		if (!item.id) {
			const res= await this.initiativeRepository.add(item);
			if (res) {
				response.initiative = res;
			} else {
				response.errors = {other: 'Ошибка сохранения данных'}
			}
		} else {
			if (await this.initiativeRepository.save(item, this.user)) {
				response.initiative = item
			} else {
				response.errors = {other: 'Ошибка сохранения данных'}
			}
		}
		return response;
	}
}