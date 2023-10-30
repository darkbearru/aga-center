import { d as defineEventHandler, r as readBody } from './nitro/node-server.mjs';
import { p as protectRoute } from './protectRoute.mjs';
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

const _id__post = defineEventHandler(
  async (event) => {
    var _a;
    if (!((_a = event.context) == null ? void 0 : _a.user))
      protectRoute(event);
    const body = await readBody(event);
    return body;
  }
);

export { _id__post as default };
