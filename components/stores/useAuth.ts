import { defineStore } from 'pinia';
import { TUsersPayload } from '~/src/users/users.payload';

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
		async login (mail: string, code?: string): Promise<boolean> {
			if (!code) {
				const { data, error } = await useFetch(`${this.path}${mail}/`, { method: 'get' });
				return data.value === 'OK';
			}
			const { data, error } = await useFetch(`${this.path}${mail}/${code}/`, { method: 'post' });
			if (error.value) return false;
			const token = useCookie('ac_token');
			this.accessToken = token.value;
			this.user = data.value as TUsersPayload
			return true;
		},
		async check(): Promise<boolean> {
			const event = useRequestEvent();
			if (event && event.context?.user) {
				this.user = event.context?.user as TUsersPayload;
				return true;
			}
			const { data, error } =
				await useFetch(`${this.path}check/`, {
					method: 'get',
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				});
			if (error.value) return false;
			this.user = data.value as TUsersPayload;
			return true;
		}
	},
})