import { d as defineEventHandler, r as readBody, a as UsersService, U as UsersRepository, T as TokenService, E as EmailService } from './nitro/node-server.mjs';
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

const registration_post = defineEventHandler(
  async (event) => {
    const body = await readBody(event);
    const userService = new UsersService(
      new UsersRepository(),
      new TokenService(),
      new EmailService(),
      event
    );
    return await userService.create(body);
  }
);

export { registration_post as default };
