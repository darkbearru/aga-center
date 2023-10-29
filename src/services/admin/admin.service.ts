import type { IAdminService } from '~/src/services/admin/admin.service.interface';
import type { INewsRepository } from '~/src/data/news.repository.interface';
import type { TAdminMenu, TCommonData } from '~/src/data/types/common.data';
import type { IUsersRepository } from '~/src/users/users.repository.interface';
import type { TUser, TUserResponse } from '~/src/users/types/users';
import { emailValidate } from '~/src/services/validation/validation';
import type { IRegionsRepository } from '~/src/data/regions.repositiory.interface';
import type { TRegion, TRegionResponse } from '~/src/data/types/regions';
import type { TOwnership, TOwnershipResponse } from '~/src/data/types/ownership';
import type { IOwnershipRepository } from '~/src/data/ownership.repository.interface';
import type { IInitiativeTypesRepository } from '~/src/data/initiative.types.repository.inerface';
import type { TInitiativeTypes, TInitiativeTypesResponse } from '~/src/data/types/initiatives.types';
import type { TNews, TNewsResponse } from '~/src/data/types/news';
import type { TCompany, TCompanyResponse, TContacts } from '~/src/data/types/company';
import type { ICompanyRepository } from '~/src/data/company.repository.interface';
import type { TInitiative, TInitiativeDeleteResponse, TInitiativeResponse, TInitiativeWithID } from '~/src/data/types/initiatives';
import type { IInitiativeRepository } from '~/src/data/initiative.repository.interface';
import type { TPhotoItem, TPhotos } from '~/src/data/types/photos';
import type { TArticles } from '~/src/data/types/articles';
import ms from 'ms';
import type { TUsersPayload } from '~/src/users/users.payload';
// import * as fs from 'fs';

export class AdminService implements IAdminService {
	constructor(
		private user: TUsersPayload,
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
		const regions: TRegion[] | undefined = await this.regionsRepository.list();
		const types: TInitiativeTypes[] | undefined = await this.initiativeTypesRepository.list();
		const ownership: TOwnership[] | undefined = await this.ownershipRepository.list();
		let news: TNews[] | undefined = undefined;
		let users: TUser[] | undefined = undefined;
		let companies: TCompany[] | undefined = undefined;
		let articles: TArticles | undefined = undefined;
		let initiatives: TInitiative[] | undefined = undefined;
		console.log('AdminService');
		console.log(this.user);
		let isAdmin: boolean = (this.user?.rights && ((this.user?.rights&2) > 0)) || false;
		let isModerator: boolean = (this.user?.rights && ((this.user?.rights&1) > 0)) || false;
		if (isAdmin) {
			menu['/client'] = 'Новости';
			menu['/client/articles'] = 'Статьи';
			menu['/client/users'] = 'Пользователи';
			menu['/client/regions'] = 'Регионы';
			menu['/client/ownership'] = 'Типы собственности';
			menu['/client/types'] = 'Типы инициатив';
			news = await this.getNewsList();
			users = await this.getUsersList();
		}
		if (isAdmin || isModerator) {
			menu['/client/moderation'] = 'Модерация';
			companies  = await this.companyRepository.moderationList();
			initiatives = await this.initiativeRepository.moderationList();
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

	private async getNewsList(page: number = 0): Promise<TNews[] | undefined> {
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
		if (!company.nameFull?.trim()) {
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

			if (await this.companyRepository.save(company)) {
				response.company = company
			} else {
				response.errors = {other: 'Ошибка сохранения данных'}
			}
		}
		return response;
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
		console.log(process?.env?.DELETED_RECORDS_STORE_TIME || '90 days');
		console.log(ms('-' + (process?.env?.DELETED_RECORDS_STORE_TIME || '90 days')));
		exp.setTime(Date.now() + ms('-' + (process?.env?.DELETED_RECORDS_STORE_TIME || '90 days')));
		const records: TInitiative[] | undefined = await this.initiativeRepository.selectDeleted(exp);
		console.log('Records', records);
		if (typeof records === 'undefined') return;
		if (records?.length === 0) return;

		console.log('initiativeRemoveOld');
		console.log(records);
		records.forEach((record: TInitiative) => {
			if (record.photos) record.photos?.forEach((photo: TPhotoItem) => {
				deletedPhotos.push(photo);
			});
		});
		// console.log('Deleted ID', records.map(item => item.id || 0));
		await this.initiativeRepository.deleteMany(records.map(item => item.id || 0));
		await this.deletePhotos(deletedPhotos);
	}

	async deletePhotos(photos: TPhotos): Promise<void> {
		console.log('Deleted Photos', photos);
		// Удаляем в базе
		return ;
/*
		await this.initiativeRepository.deletePhotos(photos);
		// Удаляем на диске
		const current = `${process.cwd()}/public`
		photos.forEach(file => {
			console.log(`Delete file ${file.path}`);
			fs.unlink(`${current}${file.path}`, err => {
				if (err) console.log('Error File delete', err);
			})
		});
*/
	}

	async companyModeration(id: number, operation: string, reason?: string): Promise<TCompany[] | undefined> {
		console.log(operation, reason);
		if (operation === 'approved') {
			await this.companyRepository.moderationApprove(id);
		} else {
			await this.companyRepository.moderationDecline(id, reason || 'Bad reason');
		}
		return await this.companyRepository.moderationList();
	}

	async initiativeModeration(id: number, operation: string, reason?: string): Promise<TInitiative[] | undefined> {
		if (operation === 'approved') {
			await this.initiativeRepository.moderationApprove(id);
		} else {
			await this.initiativeRepository.moderationDecline(id, reason || 'Bad reason');
		}
		return await this.initiativeRepository.moderationList();
	}
}