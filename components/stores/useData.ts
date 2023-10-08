import { defineStore } from 'pinia';
import { TAdminMenu, TCommonData } from '~/src/data/types/common.data';
import { TUser, TUserResponse } from '~/src/users/types/users';
import { Articles, News } from '.prisma/client';
//import { FetchError } from 'ofetch';

export const useData = defineStore('data', {
	state: () => {
		const path: string = '/api/admin/data';
		const user: globalThis.Ref<TUser | undefined> = ref(undefined);
		const menu: globalThis.Ref<TAdminMenu | undefined> = ref(undefined);
		const news: globalThis.Ref<News[] | undefined> = ref(undefined);
		const users: globalThis.Ref<TUser[] | undefined> = ref(undefined);
		const articles: globalThis.Ref<Articles[] | undefined> = ref(undefined);
		const accessToken = useCookie('ac_token');
		return { path, user, menu, news, users, articles, accessToken }
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
		}
	}
});
