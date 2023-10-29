import { defineStore } from 'pinia';
import { TUsersPayload } from '~/src/users/users.payload';
import { H3Event } from 'h3';
import { TUserResponse } from '~/src/users/types/users';

export const useAuth = defineStore('user', {
	state: () => {
		const user: globalThis.Ref<TUsersPayload | undefined> = ref(undefined);
		const path: string = '/api/users/';
		const accessToken = useCookie('ac_token');
		return { user, path, accessToken }
	},
	getters: {

	},
	// could also be defined as
	// state: () => ({ count: 0 })
	actions: {
		async login (mail: string, code?: string): Promise<TUserResponse | undefined> {
			if (!code) {
				const { data, error } = await useFetch(`${this.path}${mail}/`, { method: 'get' });
				return data.value as TUserResponse;
			}
			const { data, error } = await useFetch(`${this.path}${mail}/${code}/`, { method: 'post' });
			if (error.value) return undefined;
			const token = useCookie('ac_token');
			this.accessToken = token.value;
			this.user = data.value as TUsersPayload
			return data.value as TUserResponse;
		},
		async check(): Promise<boolean> {
			if (process.server) {
				const event = useRequestEvent();
				if (event && event.context?.user) {
					console.log('Check found', event.context?.user);
					this.user = event.context?.user as TUsersPayload;
					return true;
				}
				return false;
			}

			await $fetch(`${this.path}check/`, {
				method: 'get',
				headers: {
					Authorization: `Bearer ${this.accessToken}`,
				}
			}).then((data) => {
				this.user = data as TUsersPayload;
			}).catch(error => {
				if (error && (error.statusCode === 401)) {
					console.log(error.value);
					this.clearCookies();
				}
			});

			return true;
		},

		async register (mail: string, fio: string, code?: string): Promise<TUserResponse | undefined> {
			const { data, error } =
				await useFetch(`${this.path}registration/`,
					{
						method: 'post',
						body: {
							email: mail,
							fio,
							code
						}
					});
			if (error.value) return undefined;
			return data.value as TUserResponse;
		},

		async logout(): Promise<boolean> {
			const event = useRequestEvent();
			const { data, error } = await useFetch('/api/users/logout');
			if (data.value === 'OK') {
				await this.clearUserAndRedirect(event);
			}
			this.clearCookies(event);
			return true;
		},
		async clearUserAndRedirect(event: H3Event) {
			this.clearCookies();
			window.location.href = '/';
		},

		clearCookies(event?: H3Event): void {
			if (event && event.context.user) {
				deleteCookie(event, 'ac_token');
				if (event.context.user) delete event.context.user;
			} else {
				const authCookie = useCookie('ac_token');
				authCookie.value = null;
			}
			this.user = undefined;
			this.accessToken = undefined;
		}
	},
})