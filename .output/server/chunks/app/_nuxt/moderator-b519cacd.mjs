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

const moderator = /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {
  var _a;
  const event = useRequestEvent();
  if (!event)
    return;
  let accessGranted = false;
  if (event.context.user) {
    if (((_a = event.context.user) == null ? void 0 : _a.rights) & 1) {
      accessGranted = true;
    }
  }
  if (to.path !== "/" && !accessGranted) {
    return navigateTo("/");
  }
});

export { moderator as default };
