import { A as deleteCookie } from '../../nitro/node-server.mjs';
import { ref } from 'vue';
import { u as useCookie, a as useFetch } from './cookie-a95ecb9a.mjs';
import { u as useRequestEvent } from './ssr-34c5ba80.mjs';
import { b as defineStore } from '../server.mjs';

const useAuth = defineStore("user", {
  state: () => {
    const user = ref(void 0);
    const path = "/api/users/";
    const accessToken = useCookie("ac_token");
    return { user, path, accessToken };
  },
  getters: {},
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    async login(mail, code) {
      if (!code) {
        const { data: data2, error: error2 } = await useFetch(`${this.path}${mail}/`, { method: "get" }, "$HARvoBElv5");
        return data2.value;
      }
      const { data, error } = await useFetch(`${this.path}${mail}/${code}/`, { method: "post" }, "$yNZiGrleRA");
      if (error.value)
        return void 0;
      const token = useCookie("ac_token");
      this.accessToken = token.value;
      this.user = data.value;
      return data.value;
    },
    async check() {
      var _a, _b, _c;
      {
        const event = useRequestEvent();
        if (event && ((_a = event.context) == null ? void 0 : _a.user)) {
          console.log("Check found", (_b = event.context) == null ? void 0 : _b.user);
          this.user = (_c = event.context) == null ? void 0 : _c.user;
          return true;
        }
        return false;
      }
    },
    async register(mail, fio, code) {
      const { data, error } = await useFetch(
        `${this.path}registration/`,
        {
          method: "post",
          body: {
            email: mail,
            fio,
            code
          }
        },
        "$fHRf6DnaXs"
      );
      if (error.value)
        return void 0;
      return data.value;
    },
    async logout() {
      const event = useRequestEvent();
      const { data, error } = await useFetch("/api/users/logout", "$46vmQb5TGa");
      if (data.value === "OK") {
        await this.clearUserAndRedirect(event);
      }
      this.clearCookies(event);
      return true;
    },
    async clearUserAndRedirect(event) {
      this.clearCookies();
      window.location.href = "/";
    },
    clearCookies(event) {
      if (event && event.context.user) {
        deleteCookie(event, "ac_token");
        if (event.context.user)
          delete event.context.user;
      } else {
        const authCookie = useCookie("ac_token");
        authCookie.value = null;
      }
      this.user = void 0;
      this.accessToken = void 0;
    }
  }
});

export { useAuth as u };
