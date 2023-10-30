import { defineStore } from 'pinia';
import type { TNews, TNewsList, TNewsTime } from '~/src/data/types/news';
import type { TInitiative } from '~/src/data/types/initiatives';
import type { TInitiativeTypes } from '~/src/data/types/initiatives.types';
import type { TClientData } from '~/src/data/types/common.data';
import type { TRegion } from '~/src/data/types/regions';
import type { TInitiativeList } from '~/src/data/types/initiatives';
import type { TOrder, TOrderResponse } from '~/src/data/types/order';

export const useClientData = defineStore('client', {
	state: () => {
		const currentRegion: number = 1;
		const path: string = '/api/data';
		const news: globalThis.Ref<TNewsList> = ref<TNewsList>([]);
		const initiatives: globalThis.Ref<TInitiative[] | undefined> = ref<TInitiative[] | undefined>(undefined);
		const types: globalThis.Ref<TInitiativeTypes[] | undefined> = ref<TInitiativeTypes[] | undefined>(undefined);
		const regions: globalThis.Ref<TRegion[] | undefined> = ref<TRegion[] | undefined>(undefined);
		const direction: globalThis.Ref<number> = ref(0);
		return { path, news, initiatives, types, direction, regions, currentRegion }
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
				await $fetch(`${this.path}/types/`, {
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
		async initiativesList(type?: TInitiativeTypes, direction?: number): Promise<TInitiativeList | undefined> {
			return new Promise(async (resolve, reject) => {
				await $fetch(`${this.path}/initiative/type/${type?.id}/direction/${direction}/region/${this.currentRegion}`, {
					method: 'get',
				}).then((data) => {
					resolve(data as TInitiativeList);
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
					}
				});
			if (error.value) return undefined;
			return undefined;
		}
	}
});
