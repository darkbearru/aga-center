import { defineStore } from 'pinia';
import type { TNews } from '~/src/data/types/news';
import type { TInitiative } from '~/src/data/types/initiatives';
import type { TInitiativeTypes } from '~/src/data/types/initiatives.types';

export const useClientData = defineStore('client', {
	state: () => {
		const path: string = '/api/data';
		const news: globalThis.Ref<TNews[]> = ref<TNews[]>([]);
		const initiatives: globalThis.Ref<TInitiative[] | undefined> = ref<TInitiative[] | undefined>(undefined);
		const types: globalThis.Ref<TInitiativeTypes[] | undefined> = ref<TInitiativeTypes[] | undefined>(undefined);
		const direction: globalThis.Ref<number> = ref(0);
		return { path, news, initiatives, types, direction }
	},
	actions: {
		// Получение всех данных
		async all(): Promise<boolean> {
			await this.newsList();
			await this.initiativesList();
			return true;
		},
		// Получения списка новостей
		async newsList(page: number = 0): Promise<TNews[] | undefined> {
			const { data, error } =
				await useFetch(`${this.path}/news`, {
					method: 'get',
					body: { page }
				});
			if (error.value) return undefined;
			this.news = data.value as TNews[];
			return this.news;
		},

		// Получение текста новости
		async newsText(id: number): Promise<TNews | undefined> {
			const { data, error } =
				await useFetch(`${this.path}/news`, {
					method: 'get',
					body: { id }
				});
			if (error.value) return undefined;
			return data.value as TNews;
		},

		// Получение списка типов инициатив
		async typesList(): Promise<TInitiativeTypes[] | undefined> {
			const { data, error } =
				await useFetch(`${this.path}/types`, {
					method: 'get',
					body: {
						direction: this.direction
					}
				});
			if (error.value) return undefined;
			this.types = data.value as TInitiativeTypes[];
			return this.types;
		},

		// Получение списка инициатив
		async initiativesList(type?: TInitiativeTypes): Promise<TInitiative[] | undefined> {
			const { data, error } =
				await useFetch(`${this.path}/initiatives`, {
					method: 'get',
					body: {
						direction: this.direction,
						type
					}
				});
			if (error.value) return undefined;
			this.initiatives = data.value as TInitiative[];
			return this.initiatives;
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
