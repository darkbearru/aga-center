import { d as defineEventHandler } from './nitro/node-server.mjs';
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

const _id__get = defineEventHandler(
  async (event) => {
    if (!event.context.user)
      return protectRoute(event);
  }
);

export { _id__get as default };
