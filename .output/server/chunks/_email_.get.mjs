import { d as defineEventHandler, b as getRouterParam, a as UsersService, U as UsersRepository, T as TokenService, E as EmailService } from './nitro/node-server.mjs';
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

const _email__get = defineEventHandler(
  async (event) => {
    const email = getRouterParam(event, "email");
    if (!email)
      return {};
    const userService = new UsersService(
      new UsersRepository(),
      new TokenService(),
      new EmailService(),
      event
    );
    return await userService.login(email);
  }
);

export { _email__get as default };
