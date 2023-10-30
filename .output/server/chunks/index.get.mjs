import { d as defineEventHandler } from './nitro/node-server.mjs';
import { p as protectRoute } from './protectRoute.mjs';
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
import './initiative.repository.mjs';

const index_get = defineEventHandler(
  async (event) => {
    if (!event.context.user)
      return protectRoute(event);
    const adminService = initAdminService(event);
    return await adminService.data();
  }
);

export { index_get as default };
