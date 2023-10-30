import ms from 'ms';
import { N as NewsRepository, R as RegionsRepository, I as InitiativeTypesRepository, a as InitiativeRepository } from './initiative.repository.mjs';
import { p as prismaClient, U as UsersRepository } from './nitro/node-server.mjs';

function emailValidate(email) {
  return !!email.match(/^(([-\w_]+\.?)+)@(([-\w_]+\.)+)(com|ru|net|\w+)$/im);
}

class AdminService {
  constructor(user, newsRepository, usersRepository, regionsRepository, ownershipRepository, initiativeTypesRepository, companyRepository, initiativeRepository) {
    this.user = user;
    this.newsRepository = newsRepository;
    this.usersRepository = usersRepository;
    this.regionsRepository = regionsRepository;
    this.ownershipRepository = ownershipRepository;
    this.initiativeTypesRepository = initiativeTypesRepository;
    this.companyRepository = companyRepository;
    this.initiativeRepository = initiativeRepository;
  }
  async data() {
    const menu = {};
    const regions = await this.regionsRepository.list();
    const types = await this.initiativeTypesRepository.list();
    const ownership = await this.ownershipRepository.list();
    let news = void 0;
    let users = void 0;
    let companies = void 0;
    let articles = void 0;
    let initiatives = void 0;
    if (this.user.isAdmin) {
      menu["/client"] = "\u041D\u043E\u0432\u043E\u0441\u0442\u0438";
      menu["/client/articles"] = "\u0421\u0442\u0430\u0442\u044C\u0438";
      menu["/client/users"] = "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438";
      menu["/client/regions"] = "\u0420\u0435\u0433\u0438\u043E\u043D\u044B";
      menu["/client/ownership"] = "\u0422\u0438\u043F\u044B \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0441\u0442\u0438";
      menu["/client/types"] = "\u0422\u0438\u043F\u044B \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432";
      news = await this.getNewsList();
      users = await this.getUsersList();
    }
    if (this.user.isAdmin || this.user.isModerator) {
      menu["/client/moderation"] = "\u041C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u044F";
      companies = await this.companyRepository.moderationList();
      initiatives = await this.initiativeRepository.moderationList();
    }
    if (!this.user.isAdmin && !this.user.isModerator) {
      menu["/client"] = "\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F / \u0418\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B";
      menu["/client/orders"] = "\u0417\u0430\u044F\u0432\u043A\u0438";
      companies = await this.companyRepository.list(this.user);
      initiatives = await this.initiativeRepository.list(this.user);
    }
    menu["/client/profile"] = "\u041F\u0440\u043E\u0444\u0438\u043B\u044C";
    menu["/client/logout"] = "\u0412\u044B\u0439\u0442\u0438";
    return {
      user: this.user,
      menu,
      news,
      users,
      articles,
      regions,
      ownership,
      types,
      companies,
      initiatives
    };
  }
  async newsSave(news) {
    var _a;
    const check = await this.newsRepository.check(news);
    const response = {
      errors: void 0,
      news
    };
    if (!check) {
      response.errors = {
        title: `\u041D\u043E\u0432\u043E\u0441\u0442\u044C \u0441 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u043E\u043C \xAB${news.title}\xBB \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442`
      };
    }
    if (!news.title.trim()) {
      response.errors = { ...response.errors, title: "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043D\u043E\u0432\u043E\u0441\u0442\u0438" };
    }
    if (!news.slug.trim()) {
      response.errors = { ...response.errors, slug: "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D \u0438\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440 \u043D\u043E\u0432\u043E\u0441\u0442\u0438" };
    }
    if (!((_a = news == null ? void 0 : news.text) == null ? void 0 : _a.trim())) {
      response.errors = { ...response.errors, text: "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D \u0442\u0435\u043A\u0441\u0442 \u043D\u043E\u0432\u043E\u0441\u0442\u0438" };
    }
    if (response.errors)
      return response;
    if (!news.id) {
      const result = await this.newsRepository.add(news);
      if (typeof result !== "boolean") {
        response.news = result;
      } else {
        response.errors = { other: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u0434\u0430\u043D\u043D\u044B\u0445" };
      }
    } else {
      if (await this.newsRepository.save(news)) {
        response.news = news;
      } else {
        response.errors = { other: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0434\u0430\u043D\u043D\u044B\u0445" };
      }
    }
    return response;
  }
  async newsDelete(news) {
    return await this.newsRepository.delete(news);
  }
  async userSave(user) {
    const response = {
      errors: void 0,
      user
    };
    if (!(user == null ? void 0 : user.email.trim()) || !emailValidate(user == null ? void 0 : user.email)) {
      response.errors = {
        email: "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D \u0438\u043B\u0438 \u0443\u043A\u0430\u0437\u0430\u043D \u043D\u0435\u0432\u0435\u0440\u043D\u043E email"
      };
    }
    if (!(user == null ? void 0 : user.fio) || !(user == null ? void 0 : user.fio.trim())) {
      response.errors = { ...response.errors, fio: "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u044B \u0438\u043B\u0438 \u0443\u043A\u0430\u0437\u0430\u043D\u044B \u043D\u0435\u0432\u0435\u0440\u043D\u043E \u0434\u0430\u043D\u043D\u044B\u0435 \u0424\u0418\u041E" };
    }
    if (response.errors)
      return response;
    const res = await this.usersRepository.checkEmail(user == null ? void 0 : user.email, user == null ? void 0 : user.id);
    if (res) {
      response.errors = {
        email: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0441 \u0434\u0430\u043D\u043D\u044B\u043C email \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442"
      };
      return response;
    }
    try {
      response.user = await this.usersRepository.save(user);
    } catch (e) {
      response.errors = {
        other: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0434\u0430\u043D\u043D\u044B\u0445"
      };
      if (e) {
        response.errors = { other: e == null ? void 0 : e.message };
      }
    }
    return response;
  }
  async userDelete(user) {
    if (user == null ? void 0 : user.id)
      return await this.usersRepository.delete(user == null ? void 0 : user.id);
    return null;
  }
  async getNewsList(page = 0) {
    var _a;
    const onPage = Number((_a = process.env) == null ? void 0 : _a.NEWS_ON_PAGE) || 20;
    const newsCount = await this.newsRepository.count();
    const skip = Math.floor(newsCount / onPage) + (newsCount > onPage ? newsCount % onPage : 0);
    return await this.newsRepository.list(skip, onPage);
  }
  async getUsersList(page = 0) {
    var _a;
    const onPage = Number((_a = process.env) == null ? void 0 : _a.USERS_ON_PAGE) || 20;
    const newsCount = await this.usersRepository.count();
    const skip = Math.floor(newsCount / onPage) + (newsCount > onPage ? newsCount % onPage : 0);
    return await this.usersRepository.list(skip, onPage);
  }
  async regionSave(region) {
    const check = await this.regionsRepository.checkSlug(region);
    const response = {
      errors: void 0,
      region
    };
    if (!check) {
      response.errors = {
        slug: `\u0420\u0435\u0433\u0438\u043E\u043D c \u0438\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440\u043E\u043C \xAB${region.slug}\xBB \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442`
      };
    }
    if (!region.slug.trim()) {
      response.errors = { ...response.errors, slug: "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D \u0438\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440 \u0440\u0435\u0433\u0438\u043E\u043D\u0430" };
    }
    if (!region.name.trim()) {
      response.errors = { ...response.errors, name: "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u043E \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0440\u0435\u0433\u0438\u043E\u043D\u0430" };
    }
    if (response.errors)
      return response;
    if (!region.id) {
      response.region = await this.regionsRepository.add(region);
    } else {
      if (await this.regionsRepository.save(region)) {
        response.region = region;
      } else {
        response.errors = { other: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0434\u0430\u043D\u043D\u044B\u0445" };
      }
    }
    return response;
  }
  async regionDelete(region) {
    return await this.regionsRepository.delete(region);
  }
  async ownershipSave(ownership) {
    const check = await this.ownershipRepository.check(ownership);
    const response = {
      errors: void 0,
      ownership
    };
    if (!check) {
      response.errors = {
        nameShort: `\u0424\u043E\u0440\u043C\u0430 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0441\u0442\u0438 \xAB${ownership.nameShort}\xBB \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442`
      };
    }
    if (!ownership.nameShort.trim()) {
      response.errors = { ...response.errors, nameShort: "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u043E \u0441\u043E\u043A\u0440\u0430\u0449\u0435\u043D\u043D\u043E\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0444\u043E\u0440\u043C\u044B \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0441\u0442\u0438" };
    }
    if (!ownership.nameFull.trim()) {
      response.errors = { ...response.errors, nameFull: "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u043E \u043F\u043E\u043B\u043D\u043E\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0444\u043E\u0440\u043C\u044B \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0441\u0442\u0438" };
    }
    if (response.errors)
      return response;
    if (!ownership.id) {
      response.ownership = await this.ownershipRepository.add(ownership);
    } else {
      if (await this.ownershipRepository.save(ownership)) {
        response.ownership = ownership;
      } else {
        response.errors = { other: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0434\u0430\u043D\u043D\u044B\u0445" };
      }
    }
    return response;
  }
  async ownershipDelete(ownership) {
    return await this.ownershipRepository.delete(ownership);
  }
  async initiativeTypesSave(type) {
    const check = await this.initiativeTypesRepository.check(type);
    const response = {
      errors: void 0,
      type
    };
    if (!check) {
      response.errors = {
        name: `\u0422\u0438\u043F \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B \xAB${type.name}\xBB \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442`
      };
    }
    if (!type.name.trim()) {
      response.errors = { ...response.errors, name: "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u043E \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0442\u0438\u043F\u0430 \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B" };
    }
    if (response.errors)
      return response;
    if (!type.id) {
      response.type = await this.initiativeTypesRepository.add(type);
    } else {
      if (await this.initiativeTypesRepository.save(type)) {
        response.type = type;
      } else {
        response.errors = { other: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0434\u0430\u043D\u043D\u044B\u0445" };
      }
    }
    return response;
  }
  async initiativeTypesDelete(type) {
    return await this.initiativeTypesRepository.delete(type);
  }
  async companyDelete(company) {
    return await this.companyRepository.delete(company);
  }
  async companySave(company) {
    var _a, _b, _c, _d, _e, _f;
    const check = await this.companyRepository.check(company);
    const response = {
      errors: void 0,
      company
    };
    if (!check) {
      response.errors = {
        nameFull: `\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F \xAB${company.nameFull}\xBB \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442`
      };
    }
    if (!((_a = company.nameFull) == null ? void 0 : _a.trim())) {
      response.errors = { ...response.errors, nameFull: "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u043E \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438" };
    }
    if (!((_b = company.nameShort) == null ? void 0 : _b.trim())) {
      response.errors = { ...response.errors, nameShort: "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u043E \u043A\u0440\u0430\u0442\u043A\u043E\u0435 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438" };
    }
    if (!((_c = company.requsites) == null ? void 0 : _c.trim())) {
      response.errors = { ...response.errors, requsites: "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u044B \u0440\u0435\u043A\u0432\u0438\u0437\u0438\u0442\u044B \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438" };
    }
    if (!company.contacts) {
      response.errors = { ...response.errors, contacts: "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u0430 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u0430\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F" };
    }
    if (response.errors)
      return response;
    company.user = {
      id: this.user.id,
      email: this.user.email,
      fio: this.user.fio
    };
    console.log(company);
    if (!company.id) {
      company.contacts = (_d = company.contacts) == null ? void 0 : _d.filter((item) => !item.isDeleted);
      const res = await this.companyRepository.add(company);
      if (res) {
        response.company = res;
      } else {
        response.errors = { other: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0434\u0430\u043D\u043D\u044B\u0445" };
      }
    } else {
      const deletedContacts = (_e = company.contacts) == null ? void 0 : _e.filter((item) => item.isDeleted);
      company.contacts = (_f = company.contacts) == null ? void 0 : _f.filter((item) => !item.isDeleted);
      if (deletedContacts) {
        await this.companyRepository.deleteContacts(deletedContacts);
      }
      if (await this.companyRepository.save(company)) {
        response.company = company;
      } else {
        response.errors = { other: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0434\u0430\u043D\u043D\u044B\u0445" };
      }
    }
    return response;
  }
  async initiativeDelete(item) {
    const response = {
      status: true
    };
    const result = await this.initiativeRepository.delete(item, this.user);
    if (typeof result === "number") {
      response.errors = `\u0423\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u043D\u0435 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E, \u0443 \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B ${result} \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0445 \u0437\u0430\u044F\u0432\u043E\u043A`;
      response.status = false;
    } else {
      response.status = result;
    }
    await this.initiativeRemoveOld();
    return response;
  }
  async initiativeSave(data) {
    var _a, _b, _c;
    const item = await this.initiativeRepository.check(data);
    const response = {
      errors: void 0,
      initiative: item
    };
    if (item) {
      response.errors = {
        name: `\u0418\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u0430 \xAB${item.name}\xBB \u0432 \u0440\u0435\u0433\u0438\u043E\u043D\u0435 \xAB${item.region.name}\xBB \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442`
      };
    }
    if (!data.name.trim()) {
      response.errors = { ...response.errors, name: "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u043E \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B" };
    }
    if (!((_a = data.text) == null ? void 0 : _a.trim())) {
      response.errors = { ...response.errors, text: "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D \u0442\u0435\u043A\u0441\u0442 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u044F \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B" };
    }
    if (response.errors)
      return response;
    if (typeof (data == null ? void 0 : data.id) === "undefined" || (data == null ? void 0 : data.id) === "0") {
      const res = await this.initiativeRepository.add(data);
      if (res) {
        response.initiative = res;
      } else {
        response.errors = { other: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0434\u0430\u043D\u043D\u044B\u0445" };
      }
    } else {
      const deletedPhotos = (_b = data.photos) == null ? void 0 : _b.filter((item2) => item2.isDeleted);
      data.photos = (_c = data.photos) == null ? void 0 : _c.filter((item2) => !item2.isDeleted);
      if (deletedPhotos)
        await this.deletePhotos(deletedPhotos);
      const result = await this.initiativeRepository.save(data, this.user);
      if (result) {
        response.initiative = await this.initiativeRepository.select(Number(data.id));
      } else {
        response.errors = { other: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0434\u0430\u043D\u043D\u044B\u0445" };
      }
    }
    await this.initiativeRemoveOld();
    return response;
  }
  /**
   * Удаляем давно удалённые инициативы и их фото
   */
  async initiativeRemoveOld() {
    var _a, _b, _c;
    const exp = /* @__PURE__ */ new Date();
    const deletedPhotos = [];
    console.log(((_a = process == null ? void 0 : process.env) == null ? void 0 : _a.DELETED_RECORDS_STORE_TIME) || "90 days");
    console.log(ms("-" + (((_b = process == null ? void 0 : process.env) == null ? void 0 : _b.DELETED_RECORDS_STORE_TIME) || "90 days")));
    exp.setTime(Date.now() + ms("-" + (((_c = process == null ? void 0 : process.env) == null ? void 0 : _c.DELETED_RECORDS_STORE_TIME) || "90 days")));
    const records = await this.initiativeRepository.selectDeleted(exp);
    console.log("Records", records);
    if (typeof records === "undefined")
      return;
    if ((records == null ? void 0 : records.length) === 0)
      return;
    console.log("initiativeRemoveOld");
    console.log(records);
    records.forEach((record) => {
      var _a2;
      if (record.photos)
        (_a2 = record.photos) == null ? void 0 : _a2.forEach((photo) => {
          deletedPhotos.push(photo);
        });
    });
    await this.initiativeRepository.deleteMany(records.map((item) => item.id || 0));
    await this.deletePhotos(deletedPhotos);
  }
  async deletePhotos(photos) {
    console.log("Deleted Photos", photos);
    return;
  }
  async companyModeration(id, operation, reason) {
    console.log(operation, reason);
    if (operation === "approved") {
      await this.companyRepository.moderationApprove(id);
    } else {
      await this.companyRepository.moderationDecline(id, reason || "Bad reason");
    }
    return await this.companyRepository.moderationList();
  }
  async initiativeModeration(id, operation, reason) {
    if (operation === "approved") {
      await this.initiativeRepository.moderationApprove(id);
    } else {
      await this.initiativeRepository.moderationDecline(id, reason || "Bad reason");
    }
    return await this.initiativeRepository.moderationList();
  }
}

class OwnershipRepository {
  async add(ownership) {
    return prismaClient.typeOwnership.create({
      data: {
        nameShort: ownership.nameShort,
        nameFull: ownership.nameFull
      }
    });
  }
  async check(ownership) {
    const idQuery = typeof ownership.id !== "undefined" ? { id: { not: ownership.id } } : {};
    const res = await prismaClient.typeOwnership.findFirst({
      where: {
        AND: [
          { nameShort: ownership.nameShort },
          idQuery
        ]
      }
    });
    return !res;
  }
  async delete(ownership) {
    try {
      await prismaClient.typeOwnership.delete({
        where: {
          id: ownership.id
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }
  async list() {
    try {
      return await prismaClient.typeOwnership.findMany({
        orderBy: { nameShort: "asc" }
      });
    } catch (e) {
      return void 0;
    }
  }
  async save(ownership) {
    try {
      await prismaClient.typeOwnership.update({
        data: {
          nameShort: ownership.nameShort,
          nameFull: ownership.nameFull
        },
        where: {
          id: ownership.id
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }
}

class CompanyRepository {
  async add(company) {
    var _a, _b;
    try {
      const contacts = this.contactsConnectOrCreate(company == null ? void 0 : company.contacts);
      const created = await prismaClient.company.create({
        data: {
          nameFull: company.nameFull,
          nameShort: company.nameShort,
          requsites: company.requsites || "",
          isApproved: false,
          isDeclined: false,
          declineReason: "",
          contacts: {
            connectOrCreate: contacts
          },
          typeOwnership: {
            connect: { id: (_a = company.ownership) == null ? void 0 : _a.id }
          },
          Users: {
            connect: { id: (_b = company.user) == null ? void 0 : _b.id }
          }
        }
      });
      return await this.select(created.id);
    } catch (e) {
      console.log(e);
      return void 0;
    }
  }
  contactsConnectOrCreate(contacts) {
    const result = [];
    contacts == null ? void 0 : contacts.forEach((item) => {
      result.push({
        where: { id: item.id || 0 },
        create: {
          type: item.type,
          value: item.value
        }
      });
    });
    return result;
  }
  async select(id) {
    var _a, _b, _c, _d, _e, _f;
    const result = await prismaClient.company.findFirst({
      where: { id },
      select: {
        nameFull: true,
        nameShort: true,
        requsites: true,
        isDeclined: true,
        declineReason: true,
        contacts: {
          select: {
            id: true,
            type: true,
            value: true
          }
        },
        typeOwnership: {
          select: {
            id: true,
            nameShort: true,
            nameFull: true
          }
        },
        Users: {
          select: {
            id: true,
            fio: true,
            email: true
          }
        }
      }
    });
    return {
      id,
      nameShort: (result == null ? void 0 : result.nameShort) || "",
      nameFull: (result == null ? void 0 : result.nameFull) || "",
      requsites: (result == null ? void 0 : result.requsites) || "",
      contacts: result == null ? void 0 : result.contacts,
      isApproved: false,
      isDeclined: (result == null ? void 0 : result.isDeclined) || false,
      declineReason: (result == null ? void 0 : result.declineReason) || "",
      ownership: {
        id: ((_a = result == null ? void 0 : result.typeOwnership) == null ? void 0 : _a.id) || 0,
        nameShort: ((_b = result == null ? void 0 : result.typeOwnership) == null ? void 0 : _b.nameShort) || "",
        nameFull: ((_c = result == null ? void 0 : result.typeOwnership) == null ? void 0 : _c.nameFull) || ""
      },
      user: {
        id: ((_d = result == null ? void 0 : result.Users) == null ? void 0 : _d.id) || 0,
        fio: ((_e = result == null ? void 0 : result.Users) == null ? void 0 : _e.fio) || "",
        email: ((_f = result == null ? void 0 : result.Users) == null ? void 0 : _f.email) || ""
      }
    };
  }
  async check(company) {
    const idQuery = typeof company.id !== "undefined" ? { id: { not: company.id } } : {};
    const res = await prismaClient.company.findFirst({
      where: {
        AND: [
          { nameFull: company.nameFull },
          idQuery
        ]
      }
    });
    return !res;
  }
  async delete(company) {
    var _a;
    try {
      await prismaClient.company.delete({
        where: {
          id: company.id,
          usersId: (_a = company.user) == null ? void 0 : _a.id
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }
  async list(user) {
    const result = await prismaClient.company.findMany({
      select: {
        id: true,
        nameFull: true,
        nameShort: true,
        requsites: true,
        isDeclined: true,
        declineReason: true,
        contacts: {
          select: {
            id: true,
            type: true,
            value: true
          }
        },
        typeOwnership: {
          select: {
            id: true,
            nameShort: true,
            nameFull: true
          }
        },
        Users: {
          select: {
            id: true,
            fio: true,
            email: true
          }
        }
      },
      where: {
        Users: {
          id: user.id
        }
      }
    });
    if (result) {
      return result.map((company) => {
        return {
          id: company.id,
          nameFull: company.nameFull,
          nameShort: company.nameShort,
          requsites: company.requsites,
          isDeclined: company.isDeclined,
          declineReason: company.declineReason,
          contacts: company.contacts,
          ownership: company.typeOwnership,
          user: company.Users
        };
      });
    }
    return void 0;
  }
  async save(company) {
    var _a, _b;
    try {
      const contacts = this.contactsConnectOrCreate(company == null ? void 0 : company.contacts);
      await prismaClient.company.update({
        where: {
          id: company == null ? void 0 : company.id
        },
        data: {
          nameFull: company.nameFull,
          nameShort: company.nameShort,
          requsites: company.requsites || "",
          isApproved: false,
          isDeclined: false,
          contacts: {
            connectOrCreate: contacts
          },
          typeOwnership: {
            connect: { id: (_a = company.ownership) == null ? void 0 : _a.id }
          },
          Users: {
            connect: { id: (_b = company.user) == null ? void 0 : _b.id }
          }
        }
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  async deleteContacts(contacts) {
    const idList = [];
    contacts.forEach((item) => {
      if (item.id)
        idList.push(item.id);
    });
    if (idList.length === 0)
      return;
    const AND = idList.map((id) => {
      return { id };
    });
    try {
      await prismaClient.contacts.deleteMany({
        where: { AND }
      });
    } catch (e) {
    }
  }
  async moderationList() {
    const result = await prismaClient.company.findMany({
      where: {
        isApproved: false,
        isDeclined: false
      },
      select: {
        id: true,
        nameFull: true,
        nameShort: true,
        requsites: true,
        declineReason: true,
        contacts: {
          select: {
            id: true,
            type: true,
            value: true
          }
        },
        typeOwnership: {
          select: {
            id: true,
            nameShort: true,
            nameFull: true
          }
        },
        Users: {
          select: {
            id: true,
            fio: true,
            email: true
          }
        }
      }
    });
    if (result) {
      return result.map((company) => {
        return {
          id: company.id,
          nameFull: company.nameFull,
          nameShort: company.nameShort,
          declineReason: company.declineReason,
          requsites: company.requsites,
          contacts: company.contacts,
          ownership: company.typeOwnership,
          user: company.Users
        };
      });
    }
  }
  async moderationApprove(id) {
    try {
      await prismaClient.company.update({
        where: { id },
        data: {
          isApproved: true,
          isDeclined: false,
          declineReason: ""
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }
  async moderationDecline(id, reason) {
    try {
      await prismaClient.company.update({
        where: { id },
        data: {
          isApproved: false,
          isDeclined: true,
          declineReason: reason
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }
}

function initAdminService(event) {
  return new AdminService(
    event.context.user,
    new NewsRepository(),
    new UsersRepository(),
    new RegionsRepository(),
    new OwnershipRepository(),
    new InitiativeTypesRepository(),
    new CompanyRepository(),
    new InitiativeRepository()
  );
}

export { initAdminService as i };
