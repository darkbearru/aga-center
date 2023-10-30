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

const _code__get = defineEventHandler(
  (event) => {
    console.log("Check", event.path);
    console.log(event.context.user);
    if (!event.context.user)
      return protectRoute(event);
    return event.context.user;
  }
);

export { _code__get as default };
