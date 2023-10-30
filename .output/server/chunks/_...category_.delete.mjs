import { d as defineEventHandler, r as readBody } from './nitro/node-server.mjs';
import { c as checkRoute } from './checkRoute.mjs';
import { i as initAdminService } from './initAdminService.mjs';
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
import './protectRoute.mjs';
import './initiative.repository.mjs';

const ____category__delete = defineEventHandler(
  async (event) => {
    var _a;
    checkRoute(event);
    const adminService = initAdminService(event);
    switch ((_a = event.context.params) == null ? void 0 : _a.category) {
      case "user": {
        const user = await readBody(event);
        const result = await adminService.userDelete(user);
        if (result)
          return result;
        break;
      }
      case "region": {
        const region = await readBody(event);
        return await adminService.regionDelete(region);
      }
      case "ownership": {
        const ownership = await readBody(event);
        return await adminService.ownershipDelete(ownership);
      }
      case "types": {
        const type = await readBody(event);
        return await adminService.initiativeTypesDelete(type);
      }
      case "news": {
        const news = await readBody(event);
        return await adminService.newsDelete(news);
      }
      case "company": {
        const company = await readBody(event);
        return await adminService.companyDelete(company);
      }
      case "initiative": {
        const item = await readBody(event);
        return await adminService.initiativeDelete(item);
      }
    }
    return "";
  }
);

export { ____category__delete as default };
