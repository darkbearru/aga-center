import { defineStore } from 'pinia';
import { TAdminMenu, TCommonData } from '~/src/data/types/common.data';
import { TUser, TUserResponse } from '~/src/users/types/users';
import { Articles } from '.prisma/client';
import { TRegion, TRegionResponse } from '~/src/data/types/regions';
import { TOwnership, TOwnershipResponse } from '~/src/data/types/ownership';
import { TInitiativeTypes, TInitiativeTypesResponse } from '~/src/data/types/initiatives.types';
import { TNews, TNewsResponse } from '~/src/data/types/news';
//import { FetchError } from 'ofetch';

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
		const articles: globalThis.Ref<Articles[] | undefined> = ref(undefined);
		const accessToken = useCookie('ac_token');
		return { path, user, menu, news, users, regions, ownership, types, articles, accessToken }
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
			const userResponse: TUserResponse = unref(data.value) as TUserResponse;
			if (!userResponse.errors) {
				this.updateUsersData(userResponse.user);
			}
			return userResponse;
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
			const regionResponse: TRegionResponse = unref(data.value) as TRegionResponse;
			if (!regionResponse.errors) {
				this.updateRegionsData(regionResponse.region);
			}
			return regionResponse;
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
			const ownershipResponse: TOwnershipResponse = unref(data.value) as TOwnershipResponse;
			if (!ownershipResponse.errors) {
				this.updateOwnershipData(ownershipResponse.ownership);
			}
			return ownershipResponse;
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
			const typesResponse: TInitiativeTypesResponse = unref(data.value) as TInitiativeTypesResponse;
			if (!typesResponse.errors) {
				this.updateInitiativeTypesData(typesResponse.type);
			}
			return typesResponse;
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
			const newsResponse: TNewsResponse = unref(data.value) as TNewsResponse;
			if (!newsResponse.errors) {
				this.updateNewsData(newsResponse.news);
			}
			return newsResponse;
		},
		/**
		 * Обновление данных о регионе в массиве
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
	}
});
