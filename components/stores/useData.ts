import { defineStore } from 'pinia';
import type { TAdminMenu, TCommonData } from '~/src/data/types/common.data';
import type { TUser, TUserResponse } from '~/src/users/types/users';
import type { TRegion, TRegionResponse } from '~/src/data/types/regions';
import type { TOwnership, TOwnershipResponse } from '~/src/data/types/ownership';
import type { TInitiativeTypes, TInitiativeTypesResponse } from '~/src/data/types/initiatives.types';
import type { TNews, TNewsResponse } from '~/src/data/types/news';
import type { TCompany, TCompanyResponse } from '~/src/data/types/company';
import type {
	TInitiative,
	TInitiativeDeleteResponse,
	TInitiativeList,
	TInitiativeResponse,
	TInitiativeWithID,
	TInitiativeWithOrders
} from '~/src/data/types/initiatives';
import type { TArticle, TArticleFormData, TArticleResponse, TArticles } from '~/src/data/types/articles';
import type { TOrder, TOrderMessage } from '~/src/data/types/order';
import { OrderAuthor, OrderStatus } from '~/src/data/types/order';

export const useData = defineStore('data', {
	state: () => {
		const path: string = '/api/admin/data';
		const user: globalThis.Ref<TUser | undefined> = ref(undefined);
		const menu: globalThis.Ref<TAdminMenu | undefined> = ref(undefined);
		const news: globalThis.Ref<TNews[] | undefined> = ref(undefined);
		const users: globalThis.Ref<TUser[] | undefined> = ref(undefined);
		const regions: globalThis.Ref<TRegion[] | undefined> = ref(undefined);
		const ownership: globalThis.Ref<TOwnership[] | undefined> = ref(undefined);
		const types: globalThis.Ref<TInitiativeTypes[] | undefined> = ref(undefined);
		const companies: globalThis.Ref<TCompany[] | undefined> = ref(undefined);
		const initiatives: globalThis.Ref<TInitiative[] | undefined> = ref(undefined);
		const articles: globalThis.Ref<TArticles | undefined> = ref(undefined);
		const accessToken = useCookie('ac_token');
		const timer = ref();
		return {
			path, user, menu, news, users,
			regions, ownership, types,
			companies, articles, initiatives,
			accessToken, timer
		}
	},
	actions: {
		async get(): Promise<boolean> {
			const { data, error } =
				await useFetch(`${this.path}`, {
					method: 'get',
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				});
			if (error.value) return false;
			const list: TCommonData = (data.value as TCommonData);
			this.menu = list.menu;
			this.user = list.user;
			this.news = list.news;
			this.users = list.users;
			this.regions = list.regions;
			this.ownership = list.ownership;
			this.types = list.types;
			this.articles = list.articles;
			this.companies = list.companies;
			this.initiatives = list.initiatives;
			return true;
		},
		/**
		 * Создание или изменение данных пользователя
		 * @param user
		 */
		async updateUser(user?: TUser): Promise<TUserResponse | false> {
			const { data, error } =
				await useFetch(`${this.path}/user`, {
					method: 'post',
					body: user,
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				});
			if (error.value) return false;
			const response: TUserResponse = unref(data.value) as TUserResponse;
			if (!response.errors) {
				this.updateUsersData(response.user);
			}
			return response;
		},
		/**
		 * Обновление данных о пользователя в массиве
		 * @param user
		 */
		updateUsersData(user?: TUser): void {
			if (typeof this.users === 'undefined') {
				this.users = [];
			}
			if (user) {
				const index: number = this.users.findIndex((item: TUser): boolean => item.id === user.id);
				if (index >= 0) {
					this.users[index] = {...user};
				} else {
					this.users.push({...user});
				}
			}
			this.users = this.users.sort((a: TUser, b: TUser): number => {
				const aFio: number = (a.fio && b.fio ? (a.fio < b.fio ? 1 : 0) : 0);
				const bFio: number = (a.fio && b.fio ? (b.fio < a.fio ? 1 : 0) : 0);
				const aIdx: number = (a.isAdmin ? 100 : 0) + (a.isModerator ? 10 : 0) + aFio;
				const bIdx: number = (b.isAdmin ? 100 : 0) + (b.isModerator ? 10 : 0) + bFio;
				if (aIdx > bIdx) return -1;
				if (bIdx > aIdx) return 1;
				return 0;
			})
		},
		/**
		 * Удаление пользователя
		 * @param user
		 */
		async deleteUser(user: TUser): Promise<boolean> {
			if (user.id === this.user?.id) {
				alert('Нельзя удалить активного пользователя');
				return false;
			}
			const { data, error } =
				await useFetch(`${this.path}/user`, {
					method: 'delete',
					body: user,
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				});
			if (error.value) return false;
			const deletedUser: TUser = unref(data.value) as TUser;
			if (deletedUser && this.users) {
				this.users = this.users.filter((item: TUser): boolean => item.id !== deletedUser.id);
				alert(`Пользователь «${deletedUser.fio}» удалён`);
			}
			return true;
		},

		/**
		 * Сохранение, добавление региона
		 */
		async updateRegion(region: TRegion): Promise<TRegionResponse | false> {
			const { data, error } =
				await useFetch(`${this.path}/region`, {
					method: 'post',
					body: region,
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				});
			if (error.value) return false;
			const response: TRegionResponse = unref(data.value) as TRegionResponse;
			if (!response.errors) {
				this.updateRegionsData(response.region);
			}
			return response;
		},
		/**
		 * Обновление данных о регионе в массиве
		 * @param region
		 */
		updateRegionsData(region?: TRegion): void {
			if (typeof this.regions === 'undefined') {
				this.regions = [];
			}
			if (region) {
				const index: number = this.regions.findIndex((item: TRegion): boolean => item.id === region.id);
				if (index >= 0) {
					this.regions[index] = {...region};
				} else {
					this.regions.push({...region});
				}
			}
			this.regions = this.regions.sort((a: TRegion, b: TRegion): number => {
				const aName: number = (a.name < b.name ? 1 : 0);
				const bName: number = (b.name < a.name ? 1 : 0);
				const aIdx: number = (a.isActive ? 10 : 0) + aName;
				const bIdx: number = (b.isActive ? 10 : 0) + bName;
				if (aIdx > bIdx) return -1;
				if (bIdx > aIdx) return 1;
				return 0;
			})
		},
		/**
		 * Удаление региона
		 * @param region
		 */
		async deleteRegion(region: TRegion): Promise<boolean> {
			if (this.regions?.length === 1) {
				alert('Нельзя удалить единственный регион');
				return false;
			}
			const { data, error } =
				await useFetch(`${this.path}/region`, {
					method: 'delete',
					body: region,
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				});
			if (error.value) return false;
			const deleted: boolean = unref(data.value) as boolean;
			if (deleted && this.regions) {
				this.regions = this.regions.filter((item: TRegion): boolean => item.id !== region.id);
				alert(`Регион «${region.name}» удалён`);
			}
			return true;
		},

		/**
		 * Сохранение, добавление региона
		 */
		async updateOwnership(ownership: TOwnership): Promise<TOwnershipResponse | false> {
			const { data, error } =
				await useFetch(`${this.path}/ownership`, {
					method: 'post',
					body: ownership,
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				});
			if (error.value) return false;
			const response: TOwnershipResponse = unref(data.value) as TOwnershipResponse;
			if (!response.errors) {
				this.updateOwnershipData(response.ownership);
			}
			return response;
		},
		/**
		 * Обновление данных о регионе в массиве
		 * @param ownership
		 */
		updateOwnershipData(ownership?: TOwnership): void {
			if (typeof this.ownership === 'undefined') {
				this.ownership = [];
			}
			if (ownership) {
				const index: number = this.ownership.findIndex((item: TOwnership): boolean => item.id === ownership.id);
				if (index >= 0) {
					this.ownership[index] = {...ownership};
				} else {
					this.ownership.push({...ownership});
				}
			}
			this.ownership = this.ownership.sort((a: TOwnership, b: TOwnership): number => {
				if (a.nameShort > b.nameShort) return 1;
				if (a.nameShort < b.nameShort) return -1;
				return 0;
			})
		},
		/**
		 * Удаление региона
		 * @param ownership
		 */
		async deleteOwnership(ownership: TOwnership): Promise<boolean> {
			const { data, error } =
				await useFetch(`${this.path}/ownership`, {
					method: 'delete',
					body: ownership,
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				});
			if (error.value) return false;
			const deleted: boolean = unref(data.value) as boolean;
			if (deleted && this.ownership) {
				this.ownership = this.ownership.filter((item: TOwnership): boolean => item.id !== ownership.id);
				alert(`Форма собственности «${ownership.nameFull}» удалена`);
			}
			return true;
		},

		getOwnershipById(id: Number): TOwnership | undefined {
			if (!this.ownership) return undefined;
			const idx: number = this.ownership.findIndex((value: TOwnership): boolean => value.id === id);
			if (idx >= 0) return this.ownership[idx];
			return undefined;
		},

		/**
		 * Сохранение, добавление типа инициативы
		 */
		async updateInitiativeTypes(type: TInitiativeTypes): Promise<TInitiativeTypesResponse | false> {
			const { data, error } =
				await useFetch(`${this.path}/types`, {
					method: 'post',
					body: type,
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				});
			if (error.value) return false;
			const response: TInitiativeTypesResponse = unref(data.value) as TInitiativeTypesResponse;
			if (!response.errors) {
				this.updateInitiativeTypesData(response.type);
			}
			return response;
		},
		/**
		 * Обновление данных о типе инициативы в массиве
		 * @param type
		 */
		updateInitiativeTypesData(type?: TInitiativeTypes): void {
			if (typeof this.types === 'undefined') {
				this.types = [];
			}
			if (type) {
				const index: number = this.types.findIndex((item: TInitiativeTypes): boolean => item.id === type.id);
				if (index >= 0) {
					this.types[index] = {...type};
				} else {
					this.types.push({...type});
				}
			}
			this.types = this.types.sort((a: TInitiativeTypes, b: TInitiativeTypes): number => {
				if (a.name > b.name) return 1;
				if (a.name < b.name) return -1;
				return 0;
			})
		},
		/**
		 * Удаление Типа инициативы
		 * @param type
		 */
		async deleteInitiativeTypes(type: TInitiativeTypes): Promise<boolean> {
			const { data, error } =
				await useFetch(`${this.path}/types`, {
					method: 'delete',
					body: type,
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				});
			if (error.value) return false;
			const deleted: boolean = unref(data.value) as boolean;
			if (deleted && this.types) {
				this.types = this.types.filter((item: TInitiativeTypes): boolean => item.id !== type.id);
				alert(`Тип инициативы «${type.name}» удалён`);
			}
			return true;
		},

		/**
		 * Сохранение, добавление новости
		 */
		async updateNews(news: TNews): Promise<TNewsResponse | false> {
			const { data, error } =
				await useFetch(`${this.path}/news`, {
					method: 'post',
					body: news,
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				});
			if (error.value) return false;
			const response: TNewsResponse = unref(data.value) as TNewsResponse;
			if (!response.errors) {
				this.updateNewsData(response.news);
			}
			return response;
		},
		/**
		 * Обновление данных о новости в массиве
		 * @param news
		 */
		updateNewsData(news?: TNews): void {
			if (typeof this.news === 'undefined') {
				this.news = [];
			}
			if (news) {
				const index: number = this.news.findIndex((item: TNews): boolean => item.id === news.id);
				if (index >= 0) {
					this.news[index] = {...news};
				} else {
					this.news = [{...news}, ...this.news];
				}
			}
			this.news = this.news.sort((a: TNews, b: TNews): number => {
				if (a.date > b.date) return 1;
				if (b.date > a.date) return -1;
				return 0;
			})
		},
		/**
		 * Удаление новости
		 * @param news
		 */
		async deleteNews(news: TNews): Promise<boolean> {
			const { data, error } =
				await useFetch(`${this.path}/news`, {
					method: 'delete',
					body: news,
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				});
			if (error.value) return false;
			const deleted: boolean = unref(data.value) as boolean;
			if (deleted && this.news) {
				this.news = this.news.filter((item: TNews): boolean => item.id !== news.id);
				alert(`Новость «${news.title}» удалена`);
			}
			return true;
		},

		/**
		 * Сохранение, добавление статьи
		 */
		async updateArticle(article: FormData | TArticleFormData): Promise<TArticleResponse | false> {
			const { data, error } =
				await useFetch(`${this.path}/articles`, {
					method: 'post',
					body: article,
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				});
			if (error.value) return false;
			const response: TArticleResponse = unref(data.value) as TArticleResponse;
			if (!response.errors) {
				this.updateArticleData(response.article as TArticle);
			}
			return response;
		},
		/**
		 * Обновление данных о статье в массиве
		 * @param article
		 */
		updateArticleData(article?: TArticle): void {
			if (typeof this.articles === 'undefined') {
				this.articles = [];
			}
			if (article) {
				const index: number = this.articles.findIndex((item: TArticle): boolean => item.id === article.id);
				if (index >= 0) {
					this.articles[index] = {...article};
				} else {
					this.articles = [{...article}, ...this.articles];
				}
			}
		},
		/**
		 * Удаление статьи
		 * @param article
		 */
		async deleteArticle(article: TArticle): Promise<boolean> {
			const { data, error } =
				await useFetch(`${this.path}/articles`, {
					method: 'delete',
					body: article,
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				});
			if (error.value) return false;
			const deleted: boolean = unref(data.value) as boolean;
			if (deleted && this.articles) {
				this.articles = this.articles.filter((item: TArticle): boolean => item.id !== article.id);
				alert(`Статья «${article.title}» удалена`);
			}
			return true;
		},

		/**
		 * Сохранение, добавление компании
		 */
		async updateCompany(company: TCompany): Promise<TCompanyResponse | false> {
			const { data, error } =
				await useFetch(`${this.path}/company`, {
					method: 'post',
					body: company,
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				});
			if (error.value) return false;
			const response: TCompanyResponse = unref(data.value) as TCompanyResponse;
			if (!response.errors) {
				this.updateCompanyData(response.company);
			}
			return response;
		},
		/**
		 * Обновление данных о компании в массиве
		 * @param company
		 */
		updateCompanyData(company?: TCompany): void {
			if (typeof this.companies === 'undefined') {
				this.companies = [];
			}
			if (company) {
				const index: number = this.companies.findIndex((item: TCompany): boolean => item.id === company.id);
				if (index >= 0) {
					this.companies[index] = {...company};
				} else {
					this.companies = [...this.companies, {...company}];
				}
			}
			this.companies = this.companies.sort((a: TCompany, b: TCompany): number => {
				if (!a.nameShort || !b.nameShort) return 0;
				if (a.nameShort > b.nameShort) return 1;
				if (b.nameShort > a.nameShort) return -1;
				return 0;
			})
		},
		/**
		 * Удаление компании
		 * @param company
		 */
		async deleteCompany(company: TCompany): Promise<boolean> {
			if (this.companies?.length === 1) {
				alert('Нельзя удалить единственную компанию');
				return false;
			}
			const { data, error } =
				await useFetch(`${this.path}/company`, {
					method: 'delete',
					body: company,
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				});
			if (error.value) return false;
			const deleted: boolean = unref(data.value) as boolean;
			if (deleted && this.companies) {
				this.companies = this.companies.filter((item: TCompany): boolean => item.id !== company.id);
				alert(`Компания «${company.nameFull}» удалена`);
			}
			return true;
		},

		/**
		 * Сохранение, добавление Инициативы
		 */
		async updateInitiative(item: FormData | TInitiativeWithID): Promise<TInitiativeResponse | false> {
			const headers: Record<string, string> = {
				Authorization: `Bearer ${this.accessToken}`,
			}
			const { data, error } =
				await useFetch(`${this.path}/initiative`, {
					method: 'post',
					body: item,
					headers,
				});
			if (error.value) return false;
			const response: TInitiativeResponse = unref(data.value) as TInitiativeResponse;
			if (!response.errors) {
				this.updateInitiativeData(response.initiative);
			}
			return response;
		},
		/**
		 * Обновление данных о регионе в массиве
		 * @param initiative
		 */
		updateInitiativeData(initiative?: TInitiative): void {
			if (typeof this.initiatives === 'undefined') {
				this.initiatives = [];
			}
			if (initiative) {
				const index: number = this.initiatives.findIndex((item: TInitiative): boolean => item.id === initiative.id);
				if (index >= 0) {
					this.initiatives[index] = {...initiative};
				} else {
					this.initiatives = [{...initiative}, ...this.initiatives];
				}
			}
			this.initiatives = this.initiatives.sort((a: TInitiative, b: TInitiative): number => {
				if (a.name > b.name) return 1;
				if (b.name > a.name) return -1;
				return 0;
			})
		},
		/**
		 * Удаление инициативы
		 * @param initiative
		 */
		async deleteInitiative(initiative: TInitiative): Promise<boolean> {
			const { data, error } =
				await useFetch(`${this.path}/initiative`, {
					method: 'delete',
					body: initiative,
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				});
			if (error.value) return false;
			const deleted: TInitiativeDeleteResponse = unref(data.value) as TInitiativeDeleteResponse;
			if (deleted.status && this.initiatives) {
				this.initiatives = this.initiatives.filter((item: TInitiative): boolean => item.id !== initiative.id);
				alert(`Инициатива «${initiative.name}» удалена`);
			} else {
				if (deleted.errors) {
					alert(deleted.errors);
				} else {
					if (!deleted.status) alert('Ошибка удаления инициативы');
				}
			}
			return true;
		},

		async approveCompany(id: number): Promise<boolean> {
			const { data, error } =
				await useFetch(`${this.path}/moderate_company`, {
					method: 'post',
					body: {
						id,
						approved: true
					},
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				});
			if (error.value) return false;
			this.companies = data.value as TCompany[];
			return true;
		},

		async declineCompany(id: number, reason: string): Promise<boolean> {
			const { data, error } =
				await useFetch(`${this.path}/moderate_company`, {
					method: 'post',
					body: {
						id,
						declined: true,
						reason
					},
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				});
			if (error.value) return false;
			this.companies = data.value as TCompany[];
			return true;
		},

		async approveInitiative(id: number): Promise<boolean> {
			const { data, error } =
				await useFetch(`${this.path}/moderate_initiative`, {
					method: 'post',
					body: {
						id,
						approved: true
					},
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				});
			if (error.value) return false;
			this.initiatives = data.value as TInitiative[];
			return true;
		},

		async declineInitiative(id: number, reason: string): Promise<boolean> {
			const { data, error } =
				await useFetch(`${this.path}/moderate_initiative`, {
					method: 'post',
					body: {
						id,
						declined: true,
						reason
					},
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				});
			if (error.value) return false;
			this.initiatives = data.value as TInitiative[];
			return true;
		},

		refreshCompaniesAndInitiatives(callback?: Function): void {
			this.timer = setTimeout(() => {
				this.loadCompaniesAndInitiatives(callback).then();
			}, 180000);
		},

		async loadCompaniesAndInitiatives(callback?: Function): Promise<void> {
			clearTimeout(this.timer);
			const { data, error } =
				await useFetch(`${this.path}/common`, {
					method: 'get',
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				});
			if (error.value) {
				console.log(error.value);
			}
			if (data.value) {
				this.companies = (data.value as TCommonData).companies;
				this.initiatives = (data.value as TCommonData).initiatives;
				if (callback) callback();
			}
			this.refreshCompaniesAndInitiatives(callback);
		},

		refreshModeration(callback?: Function): void {
			this.timer = setTimeout(() => {
				this.loadModerationList(callback).then();
			}, 60000);
		},

		async loadModerationList(callback?: Function): Promise<void> {
			clearTimeout(this.timer);
			const { data, error } =
				await useFetch(`${this.path}/moderation`, {
					method: 'get',
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				});
			if (error.value) {
				console.log(error.value);
			}
			if (data.value) {
				this.companies = (data.value as TCommonData).companies;
				this.initiatives = (data.value as TCommonData).initiatives;
				if (callback) callback();
			}
			this.refreshModeration(callback);
		},

		async ordersList(): Promise<TInitiativeWithOrders> {
			return new Promise(async (resolve, reject) => {
				await $fetch(`${this.path}/orders`, {
					method: 'get',
				}).then((data) => {
					resolve(data as TInitiativeList);
				}).catch(() => {
					reject();
				});
			});
		},

		async getOrder(code: string): Promise<TOrder> {
			return new Promise(async (resolve, reject) => {
				await $fetch(`${this.path}/orders`, {
					method: 'get',
					query: { code }
				}).then((data) => {
					resolve(data as TOrder);
				}).catch(() => {
					reject();
				});
			});
		},

		async orderAddMessage(code: string, status: OrderStatus, message: string, author: OrderAuthor, rating?: number): Promise<TOrder> {
			const msg: TOrderMessage = { author, message }
			if (rating) msg.rating = rating;
			return new Promise(async (resolve, reject) => {
				await $fetch(`${this.path}/orders`, {
					method: 'post',
					query: { code },
					body: {
						status,
						code,
						message: msg
					}
				}).then((data) => {
					resolve(data as TOrder);
				}).catch(() => {
					reject();
				});
			});
		},

	}
});
