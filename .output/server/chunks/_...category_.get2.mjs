import { d as defineEventHandler, c as createError } from './nitro/node-server.mjs';
import { i as initDataService, e as extractParams } from './initDataService.mjs';
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
import './initiative.repository.mjs';
import 'moment';

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
