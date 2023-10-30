import { ref, unref } from 'vue';
import { u as useCookie, a as useFetch } from './cookie-a95ecb9a.mjs';
import { b as defineStore } from '../server.mjs';

const useData = defineStore("data", {
  state: () => {
    const path = "/api/admin/data";
    const user = ref(void 0);
    const menu = ref(void 0);
    const news = ref(void 0);
    const users = ref(void 0);
    const regions = ref(void 0);
    const ownership = ref(void 0);
    const types = ref(void 0);
    const companies = ref(void 0);
    const initiatives = ref(void 0);
    const articles = ref(void 0);
    const accessToken = useCookie("ac_token");
    return {
      path,
      user,
      menu,
      news,
      users,
      regions,
      ownership,
      types,
      companies,
      articles,
      initiatives,
      accessToken
    };
  },
  actions: {
    async get() {
      const { data, error } = await useFetch(`${this.path}`, {
        method: "get",
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      }, "$5mpOZ1BxYP");
      if (error.value)
        return false;
      const list = data.value;
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
    async updateUser(user) {
      const { data, error } = await useFetch(`${this.path}/user`, {
        method: "post",
        body: user,
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      }, "$zyv9jhBSUR");
      if (error.value)
        return false;
      const response = unref(data.value);
      if (!response.errors) {
        this.updateUsersData(response.user);
      }
      return response;
    },
    /**
     * Обновление данных о пользователя в массиве
     * @param user
     */
    updateUsersData(user) {
      if (typeof this.users === "undefined") {
        this.users = [];
      }
      if (user) {
        const index = this.users.findIndex((item) => item.id === user.id);
        if (index >= 0) {
          this.users[index] = { ...user };
        } else {
          this.users.push({ ...user });
        }
      }
      this.users = this.users.sort((a, b) => {
        const aFio = a.fio && b.fio ? a.fio < b.fio ? 1 : 0 : 0;
        const bFio = a.fio && b.fio ? b.fio < a.fio ? 1 : 0 : 0;
        const aIdx = (a.isAdmin ? 100 : 0) + (a.isModerator ? 10 : 0) + aFio;
        const bIdx = (b.isAdmin ? 100 : 0) + (b.isModerator ? 10 : 0) + bFio;
        if (aIdx > bIdx)
          return -1;
        if (bIdx > aIdx)
          return 1;
        return 0;
      });
    },
    /**
     * Удаление пользователя
     * @param user
     */
    async deleteUser(user) {
      var _a;
      if (user.id === ((_a = this.user) == null ? void 0 : _a.id)) {
        alert("\u041D\u0435\u043B\u044C\u0437\u044F \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0433\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F");
        return false;
      }
      const { data, error } = await useFetch(`${this.path}/user`, {
        method: "delete",
        body: user,
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      }, "$ZILO77ut3w");
      if (error.value)
        return false;
      const deletedUser = unref(data.value);
      if (deletedUser && this.users) {
        this.users = this.users.filter((item) => item.id !== deletedUser.id);
        alert(`\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \xAB${deletedUser.fio}\xBB \u0443\u0434\u0430\u043B\u0451\u043D`);
      }
      return true;
    },
    /**
     * Сохранение, добавление региона
     */
    async updateRegion(region) {
      const { data, error } = await useFetch(`${this.path}/region`, {
        method: "post",
        body: region,
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      }, "$2Crft2HsoT");
      if (error.value)
        return false;
      const response = unref(data.value);
      if (!response.errors) {
        this.updateRegionsData(response.region);
      }
      return response;
    },
    /**
     * Обновление данных о регионе в массиве
     * @param region
     */
    updateRegionsData(region) {
      if (typeof this.regions === "undefined") {
        this.regions = [];
      }
      if (region) {
        const index = this.regions.findIndex((item) => item.id === region.id);
        if (index >= 0) {
          this.regions[index] = { ...region };
        } else {
          this.regions.push({ ...region });
        }
      }
      this.regions = this.regions.sort((a, b) => {
        const aName = a.name < b.name ? 1 : 0;
        const bName = b.name < a.name ? 1 : 0;
        const aIdx = (a.isActive ? 10 : 0) + aName;
        const bIdx = (b.isActive ? 10 : 0) + bName;
        if (aIdx > bIdx)
          return -1;
        if (bIdx > aIdx)
          return 1;
        return 0;
      });
    },
    /**
     * Удаление региона
     * @param region
     */
    async deleteRegion(region) {
      var _a;
      if (((_a = this.regions) == null ? void 0 : _a.length) === 1) {
        alert("\u041D\u0435\u043B\u044C\u0437\u044F \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u0435\u0434\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u0440\u0435\u0433\u0438\u043E\u043D");
        return false;
      }
      const { data, error } = await useFetch(`${this.path}/region`, {
        method: "delete",
        body: region,
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      }, "$xr3tVbS5Gh");
      if (error.value)
        return false;
      const deleted = unref(data.value);
      if (deleted && this.regions) {
        this.regions = this.regions.filter((item) => item.id !== region.id);
        alert(`\u0420\u0435\u0433\u0438\u043E\u043D \xAB${region.name}\xBB \u0443\u0434\u0430\u043B\u0451\u043D`);
      }
      return true;
    },
    /**
     * Сохранение, добавление региона
     */
    async updateOwnership(ownership) {
      const { data, error } = await useFetch(`${this.path}/ownership`, {
        method: "post",
        body: ownership,
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      }, "$LShci28Qsp");
      if (error.value)
        return false;
      const response = unref(data.value);
      if (!response.errors) {
        this.updateOwnershipData(response.ownership);
      }
      return response;
    },
    /**
     * Обновление данных о регионе в массиве
     * @param ownership
     */
    updateOwnershipData(ownership) {
      if (typeof this.ownership === "undefined") {
        this.ownership = [];
      }
      if (ownership) {
        const index = this.ownership.findIndex((item) => item.id === ownership.id);
        if (index >= 0) {
          this.ownership[index] = { ...ownership };
        } else {
          this.ownership.push({ ...ownership });
        }
      }
      this.ownership = this.ownership.sort((a, b) => {
        if (a.nameShort > b.nameShort)
          return 1;
        if (a.nameShort < b.nameShort)
          return -1;
        return 0;
      });
    },
    /**
     * Удаление региона
     * @param ownership
     */
    async deleteOwnership(ownership) {
      const { data, error } = await useFetch(`${this.path}/ownership`, {
        method: "delete",
        body: ownership,
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      }, "$TvYigkPI4Y");
      if (error.value)
        return false;
      const deleted = unref(data.value);
      if (deleted && this.ownership) {
        this.ownership = this.ownership.filter((item) => item.id !== ownership.id);
        alert(`\u0424\u043E\u0440\u043C\u0430 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0441\u0442\u0438 \xAB${ownership.nameFull}\xBB \u0443\u0434\u0430\u043B\u0435\u043D\u0430`);
      }
      return true;
    },
    getOwnershipById(id) {
      if (!this.ownership)
        return void 0;
      const idx = this.ownership.findIndex((value) => value.id === id);
      if (idx >= 0)
        return this.ownership[idx];
      return void 0;
    },
    /**
     * Сохранение, добавление типа инициативы
     */
    async updateInitiativeTypes(type) {
      const { data, error } = await useFetch(`${this.path}/types`, {
        method: "post",
        body: type,
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      }, "$BcKvYSPrCv");
      if (error.value)
        return false;
      const response = unref(data.value);
      if (!response.errors) {
        this.updateInitiativeTypesData(response.type);
      }
      return response;
    },
    /**
     * Обновление данных о типе инициативы в массиве
     * @param type
     */
    updateInitiativeTypesData(type) {
      if (typeof this.types === "undefined") {
        this.types = [];
      }
      if (type) {
        const index = this.types.findIndex((item) => item.id === type.id);
        if (index >= 0) {
          this.types[index] = { ...type };
        } else {
          this.types.push({ ...type });
        }
      }
      this.types = this.types.sort((a, b) => {
        if (a.name > b.name)
          return 1;
        if (a.name < b.name)
          return -1;
        return 0;
      });
    },
    /**
     * Удаление Типа инициативы
     * @param type
     */
    async deleteInitiativeTypes(type) {
      const { data, error } = await useFetch(`${this.path}/types`, {
        method: "delete",
        body: type,
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      }, "$xVPw3baxqU");
      if (error.value)
        return false;
      const deleted = unref(data.value);
      if (deleted && this.types) {
        this.types = this.types.filter((item) => item.id !== type.id);
        alert(`\u0422\u0438\u043F \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B \xAB${type.name}\xBB \u0443\u0434\u0430\u043B\u0451\u043D`);
      }
      return true;
    },
    /**
     * Сохранение, добавление новости
     */
    async updateNews(news) {
      const { data, error } = await useFetch(`${this.path}/news`, {
        method: "post",
        body: news,
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      }, "$BExUDNZ67R");
      if (error.value)
        return false;
      const response = unref(data.value);
      if (!response.errors) {
        this.updateNewsData(response.news);
      }
      return response;
    },
    /**
     * Обновление данных о регионе в массиве
     * @param news
     */
    updateNewsData(news) {
      if (typeof this.news === "undefined") {
        this.news = [];
      }
      if (news) {
        const index = this.news.findIndex((item) => item.id === news.id);
        if (index >= 0) {
          this.news[index] = { ...news };
        } else {
          this.news = [{ ...news }, ...this.news];
        }
      }
      this.news = this.news.sort((a, b) => {
        if (a.date > b.date)
          return 1;
        if (b.date > a.date)
          return -1;
        return 0;
      });
    },
    /**
     * Удаление новости
     * @param news
     */
    async deleteNews(news) {
      const { data, error } = await useFetch(`${this.path}/news`, {
        method: "delete",
        body: news,
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      }, "$sKAuPDwUny");
      if (error.value)
        return false;
      const deleted = unref(data.value);
      if (deleted && this.news) {
        this.news = this.news.filter((item) => item.id !== news.id);
        alert(`\u041D\u043E\u0432\u043E\u0441\u0442\u044C \xAB${news.title}\xBB \u0443\u0434\u0430\u043B\u0435\u043D\u0430`);
      }
      return true;
    },
    /**
     * Сохранение, добавление компании
     */
    async updateCompany(company) {
      const { data, error } = await useFetch(`${this.path}/company`, {
        method: "post",
        body: company,
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      }, "$dr7DH2zXrh");
      if (error.value)
        return false;
      const response = unref(data.value);
      if (!response.errors) {
        this.updateCompanyData(response.company);
      }
      return response;
    },
    /**
     * Обновление данных о компании в массиве
     * @param company
     */
    updateCompanyData(company) {
      if (typeof this.companies === "undefined") {
        this.companies = [];
      }
      if (company) {
        const index = this.companies.findIndex((item) => item.id === company.id);
        if (index >= 0) {
          this.companies[index] = { ...company };
        } else {
          this.companies = [{ ...company }, ...this.companies];
        }
      }
      this.companies = this.companies.sort((a, b) => {
        if (a.nameShort > b.nameShort)
          return 1;
        if (b.nameShort > a.nameShort)
          return -1;
        return 0;
      });
    },
    /**
     * Удаление компании
     * @param company
     */
    async deleteCompany(company) {
      var _a;
      if (((_a = this.companies) == null ? void 0 : _a.length) === 1) {
        alert("\u041D\u0435\u043B\u044C\u0437\u044F \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u0435\u0434\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u0443\u044E \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044E");
        return false;
      }
      const { data, error } = await useFetch(`${this.path}/company`, {
        method: "delete",
        body: company,
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      }, "$UWig66ZbKh");
      if (error.value)
        return false;
      const deleted = unref(data.value);
      if (deleted && this.companies) {
        this.companies = this.companies.filter((item) => item.id !== company.id);
        alert(`\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F \xAB${company.nameFull}\xBB \u0443\u0434\u0430\u043B\u0435\u043D\u0430`);
      }
      return true;
    },
    /**
     * Сохранение, добавление Инициативы
     */
    async updateInitiative(item) {
      const headers = {
        Authorization: `Bearer ${this.accessToken}`
      };
      const { data, error } = await useFetch(`${this.path}/initiative`, {
        method: "post",
        body: item,
        headers
      }, "$ZHAKbtQBCe");
      if (error.value)
        return false;
      const response = unref(data.value);
      if (!response.errors) {
        this.updateInitiativeData(response.initiative);
      }
      return response;
    },
    /**
     * Обновление данных о регионе в массиве
     * @param initiative
     */
    updateInitiativeData(initiative) {
      if (typeof this.initiatives === "undefined") {
        this.initiatives = [];
      }
      if (initiative) {
        const index = this.initiatives.findIndex((item) => item.id === initiative.id);
        if (index >= 0) {
          this.initiatives[index] = { ...initiative };
        } else {
          this.initiatives = [{ ...initiative }, ...this.initiatives];
        }
      }
      this.initiatives = this.initiatives.sort((a, b) => {
        if (a.name > b.name)
          return 1;
        if (b.name > a.name)
          return -1;
        return 0;
      });
    },
    /**
     * Удаление инициативы
     * @param initiative
     */
    async deleteInitiative(initiative) {
      const { data, error } = await useFetch(`${this.path}/initiative`, {
        method: "delete",
        body: initiative,
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      }, "$pSMQqOn2So");
      if (error.value)
        return false;
      const deleted = unref(data.value);
      if (deleted.status && this.initiatives) {
        this.initiatives = this.initiatives.filter((item) => item.id !== initiative.id);
        alert(`\u0418\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u0430 \xAB${initiative.name}\xBB \u0443\u0434\u0430\u043B\u0435\u043D\u0430`);
      } else {
        if (deleted.errors) {
          alert(deleted.errors);
        } else {
          if (!deleted.status)
            alert("\u041E\u0448\u0438\u0431\u043A\u0430 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u044F \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B");
        }
      }
      return true;
    },
    async approveCompany(id) {
      const { data, error } = await useFetch(`${this.path}/moderate_company`, {
        method: "post",
        body: {
          id,
          approved: true
        },
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      }, "$cfzNxVHeZh");
      if (error.value)
        return false;
      this.companies = data.value;
      return true;
    },
    async declineCompany(id, reason) {
      const { data, error } = await useFetch(`${this.path}/moderate_company`, {
        method: "post",
        body: {
          id,
          declined: true,
          reason
        },
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      }, "$TjVltlOet8");
      if (error.value)
        return false;
      this.companies = data.value;
      return true;
    },
    async approveInitiative(id) {
      const { data, error } = await useFetch(`${this.path}/moderate_initiative`, {
        method: "post",
        body: {
          id,
          approved: true
        },
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      }, "$unFB6uBPNQ");
      if (error.value)
        return false;
      this.initiatives = data.value;
      return true;
    },
    async declineInitiative(id, reason) {
      const { data, error } = await useFetch(`${this.path}/moderate_initiative`, {
        method: "post",
        body: {
          id,
          declined: true,
          reason
        },
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      }, "$UzvxcuEng1");
      if (error.value)
        return false;
      this.initiatives = data.value;
      return true;
    }
  }
});

export { useData as u };
