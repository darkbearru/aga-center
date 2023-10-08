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

export class AdminService implements IAdminService {
	constructor(
		private user: Users,
		private newsRepository: INewsRepository,
		private usersRepository: IUsersRepository,
		private regionsRepository: IRegionsRepository,
		private ownershipRepository: IOwnershipRepository,
		private initiativeTypesRepository: IInitiativeTypesRepository,
	) {
	}


	async data(): Promise<TCommonData> {
		const menu: TAdminMenu = {};
		let news: News[] | undefined = undefined;
		let users: TUser[] | undefined = undefined;
		let regions: TRegion[] | undefined = undefined;
		let ownership: TOwnership[] | undefined = undefined;
		let types: TInitiativeTypes[] | undefined = undefined;
		let articles: Articles[] | undefined = undefined;
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
			ownership = await this.ownershipRepository.list();
			types = await this.initiativeTypesRepository.list();

		}
		if (this.user.isAdmin || this.user.isModerator) {
			menu['/client/moderation'] = 'Модерация';
		}
		if (!this.user.isAdmin && !this.user.isModerator) {
			menu['/client/company'] = 'Компания';
			menu['/client/initiatives'] = 'Инициативы';
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
			types
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
			response.news = await this.newsRepository.add(news);
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

}