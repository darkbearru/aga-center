import { d as defineEventHandler } from './nitro/node-server.mjs';
import { i as initDataService } from './initDataService.mjs';
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

const index_get = defineEventHandler(
  async () => {
    const dataService = initDataService();
    return await dataService.data();
  }
);

export { index_get as default };
