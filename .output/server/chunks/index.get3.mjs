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

const index_get = defineEventHandler(
  async (event) => {
    const userService = new UsersService(
      new UsersRepository(),
      new TokenService(),
      new EmailService(),
      event
    );
    userService.logout();
    if (!event.context.user)
      delete event.context.user;
    return "OK";
  }
);

export { index_get as default };
