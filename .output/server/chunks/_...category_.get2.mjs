import { d as defineEventHandler, c as createError } from './nitro/node-server.mjs';
import { N as NewsRepository, R as RegionsRepository, I as InitiativeTypesRepository, a as InitiativeRepository } from './initiative.repository.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import '@prisma/client';
import 'jsonwebtoken';
import 'ms';
import 'nodemailer';
import 'ipx';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class DataService {
  constructor(newsRepository, regionsRepository, initiativeTypesRepository, initiativeRepository) {
    this.newsRepository = newsRepository;
    this.regionsRepository = regionsRepository;
    this.initiativeTypesRepository = initiativeTypesRepository;
    this.initiativeRepository = initiativeRepository;
    __publicField(this, "onPage", 20);
  }
  async data() {
    return {
      news: await this.newsRepository.list(0, this.onPage),
      regions: await this.regionsRepository.list(),
      types: await this.initiativeTypesRepository.list()
    };
  }
  async initiatives(typeId) {
    return await this.initiativeRepository.listByType(typeId);
  }
  async search(text, direction = 0) {
    return await this.initiativeRepository.listByText(text, direction);
  }
  async news(page, id) {
    page = page || 1;
    return await this.newsRepository.list((page - 1) * this.onPage, this.onPage);
  }
  async types(direction) {
    return Promise.resolve([]);
  }
}

function initDataService() {
  return new DataService(
    new NewsRepository(),
    new RegionsRepository(),
    new InitiativeTypesRepository(),
    new InitiativeRepository()
  );
}
function extractParams(url) {
  if (typeof url === "undefined")
    return { category: "" };
  let urlParts = url.split("/");
  const category = urlParts.length > 0 ? urlParts[0] : "";
  const params = {};
  urlParts = urlParts.slice(1);
  for (let i = 0, len = urlParts.length; i < len; i++) {
    params[urlParts[i]] = typeof urlParts[i + 1] !== "undefined" ? urlParts[i + 1] : void 0;
    i++;
  }
  return { category, params };
}

const ____category__get = defineEventHandler(
  async (event) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const dataService = initDataService();
    const data = extractParams((_a = event.context.params) == null ? void 0 : _a.category);
    switch (data.category) {
      case "news": {
        return dataService.news((_b = data.params) == null ? void 0 : _b.page, (_c = data.params) == null ? void 0 : _c.id);
      }
      case "initiative": {
        return dataService.initiatives((_d = data.params) == null ? void 0 : _d.type);
      }
      case "types": {
        return dataService.types((_e = data.params) == null ? void 0 : _e.direction);
      }
      case "search": {
        return dataService.search((_f = data.params) == null ? void 0 : _f.text, (_g = data.params) == null ? void 0 : _g.direction);
      }
      default: {
        throw createError({
          statusCode: 404,
          message: "Data not found"
        });
      }
    }
  }
);

export { ____category__get as default };
