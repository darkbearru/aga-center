import { defineStore } from 'pinia';
import type { TNews, TNewsList, TNewsTime } from '~/src/data/types/news';
import type { TInitiative } from '~/src/data/types/initiatives';
import type { TInitiativeTypes } from '~/src/data/types/initiatives.types';
import type { TClientData, TClientDataError } from '~/src/data/types/common.data';
import type { TRegion } from '~/src/data/types/regions';
import type { TInitiativeList } from '~/src/data/types/initiatives';
import type { TOrder, TOrderResponse, TOrders } from '~/src/data/types/order';
import type { TCompany, TCompanyWithInitiatives } from '~/src/data/types/company';
import type { TReviewList } from '~/src/data/types/reviews';

export const useClientData = defineStore('client', {
	state: () => {
		const currentRegion: number = 1;
		const path: string = '/api/data';
		const news: globalThis.Ref<TNewsList> = ref<TNewsList>([]);
		const initiatives: globalThis.Ref<TInitiative[] | undefined> = ref<TInitiative[] | undefined>(undefined);
		const types: globalThis.Ref<TInitiativeTypes[] | undefined> = ref<TInitiativeTypes[] | undefined>(undefined);
		const regions: globalThis.Ref<TRegion[] | undefined> = ref<TRegion[] | undefined>(undefined);
		const direction: globalThis.Ref<number> = ref(0);
		const searchText: globalThis.Ref<string> = ref('');
		const orders: globalThis.Ref<TOrders | undefined> = ref<TOrders | undefined>(undefined);
		return { path, news, initiatives, types, direction, regions, currentRegion, searchText, orders }
	},
	actions: {
		// Получение всех данных
		async all(): Promise<boolean> {
			await $fetch(`${this.path}`, {
				method: 'get',
			}).then((data) => {
				this.news = (data as TClientData).news || [];
				this.initiatives = (data as TClientData).initiatives || [];
				this.types = (data as TClientData).types || [];
				this.regions = (data as TClientData).regions || [];
			});
			return true;
		},
		// Получения списка новостей
		async newsList(page: number = 0): Promise<TNewsList | undefined> {
			return new Promise(async (resolve, reject) => {
				await $fetch(`${this.path}/news${page? '/page/' + page : ''}`, {
					method: 'get',
				}).then((data) => {
					this.news = data as TNewsList || [];
					resolve(this.news);
				}).catch(() => {
					reject();
				});
			});
		},

		// Получение текста новости
		async newsText(slug: string): Promise<TNews & TNewsTime | undefined> {
			return new Promise(async (resolve, reject) => {
				await $fetch(`${this.path}/news/slug/${slug}`, {
					method: 'get',
				}).then((data) => {
					resolve(data as TNews & TNewsTime);
				}).catch(() => {
					reject(undefined);
				});
			});
		},

		// Получение списка типов инициатив
		async typesList(): Promise<TInitiativeTypes[] | undefined> {
			return new Promise(async (resolve, reject) => {
				await $fetch(`${this.path}/types/direction/${this.direction}${this.searchText ? '/text/' + encodeURIComponent(this.searchText) : ''}`, {
					method: 'get',
				}).then((data) => {
					this.types = data as TInitiativeTypes[] || [];
					resolve(this.types);
				}).catch(() => {
					reject();
				});
			});
		},

		// Получение списка инициатив
		async initiativesList(type?: TInitiativeTypes): Promise<TInitiativeList | undefined> {
			return new Promise(async (resolve, reject) => {
				await $fetch(`${this.path}/initiative/type/${type?.id}/direction/${this.direction}/region/${this.currentRegion}${this.searchText ? '/text/' + encodeURIComponent(this.searchText) : ''}`, {
					method: 'get',
				}).then((data) => {
					resolve(data as TInitiativeList);
				}).catch(() => {
					reject();
				});
			});
		},

		// Получение списка инициатив
		async companiesList(): Promise<TCompany[] | undefined> {
			return new Promise(async (resolve, reject) => {
				await $fetch(`${this.path}/companies`, {
					method: 'get',
				}).then((data) => {
					resolve(data as TCompany[]);
				}).catch(() => {
					reject();
				});
			});
		},

		// Получение списка инициатив
		async companyFullInfo(slug: string): Promise<TCompanyWithInitiatives> {
			return new Promise(async (resolve, reject) => {
				await $fetch(`${this.path}/companies/slug/${slug}`, {
					method: 'get',
				}).then((data) => {
					resolve(data as TCompanyWithInitiatives);
				}).catch(() => {
					reject();
				});
			});
		},

		async makeOrder(order: TOrder): Promise<TOrderResponse> {
			return new Promise(async (resolve, reject) => {
				await $fetch(`${this.path}/order`, {
					method: 'post',
					body: order
				}).then((data) => {
					resolve(data as TOrderResponse);
				}).catch(() => {
					reject();
				});
			});
		},

		// Поиск по инициативам
		async search(text: string): Promise<TInitiative[] | undefined> {
			const { data, error } =
				await useFetch(`${this.path}/search`, {
					method: 'post',
					body: {
						direction: this.direction,
						text,
					}
				});
			if (error.value) return undefined;
			return data.value as TInitiative[];
		},

		// Получение списка инициатив
		async initiativePromo(): Promise<TInitiativeList | string> {
			return new Promise(async (resolve, reject) => {
				await $fetch(`${this.path}/promo`, {
					method: 'get',
				}).then((data) => {
					if ((data as TClientDataError).message) reject((data as TClientDataError).message);
					resolve(data as TInitiativeList);
				}).catch(() => {
					reject();
				});
			});
		},

		// Получение списка отзывов
		async reviewsList(): Promise<TReviewList | string> {
			return new Promise(async (resolve, reject) => {
				await $fetch(`${this.path}/reviews`, {
					method: 'get',
				}).then((data) => {
					if ((data as TClientDataError).message) reject((data as TClientDataError).message);
					resolve(data as TReviewList);
				}).catch(() => {
					reject();
				});
			});
		}

	}
});
