import { d as defineNuxtRouteMiddleware, n as navigateTo } from '../server.mjs';
import { u as useRequestEvent } from './ssr-34c5ba80.mjs';
import 'vue';
import '../../nitro/node-server.mjs';
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
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import '@formkit/core';
import '@formkit/utils';
import '@formkit/inputs';
import '@formkit/rules';
import '@formkit/validation';
import '@formkit/i18n';
import '@formkit/themes';
import '@formkit/observer';
import '@formkit/dev';
import 'vue/server-renderer';

const auth = /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {
  const event = useRequestEvent();
  if (!event)
    return;
  if (to.path !== "/" && !event.context.user) {
    return navigateTo("/");
  }
});

export { auth as default };
