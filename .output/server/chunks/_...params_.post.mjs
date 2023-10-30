import { d as defineEventHandler, a as UsersService, U as UsersRepository, T as TokenService, E as EmailService } from './nitro/node-server.mjs';
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

const ____params__post = defineEventHandler(
  async (event) => {
    var _a, _b;
    if (!((_a = event.context.params) == null ? void 0 : _a.params))
      return "no params";
    const params = (_b = event.context.params) == null ? void 0 : _b.params.split("/");
    const userService = new UsersService(
      new UsersRepository(),
      new TokenService(),
      new EmailService(),
      event
    );
    return await userService.validate({
      email: params[0],
      confirmCode: params[1]
    });
  }
);

export { ____params__post as default };
