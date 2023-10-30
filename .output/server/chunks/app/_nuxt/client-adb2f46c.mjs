import { l as useRoute, m as __nuxt_component_0 } from '../server.mjs';
import { useSSRContext, defineComponent, withAsyncContext, mergeProps, unref, withCtx, createTextVNode, toDisplayString } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { _ as _imports_0 } from './logo-white-8447be35.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-17df5783.mjs';
import { u as useAuth } from './useAuth-3eb17c57.mjs';
import { u as useData } from './useData-2a2ed08f.mjs';
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
import '../../handlers/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import './cookie-a95ecb9a.mjs';
import './ssr-34c5ba80.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Menu",
  __ssrInlineRender: true,
  props: {
    menu: Object
  },
  setup(__props) {
    const route = useRoute();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-wrap my-8" }, _attrs))}><!--[-->`);
      ssrRenderList(__props.menu, (title, url) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: url,
          to: url,
          class: ["w-full py-2 px-4 text-white hover:text-second rounded", unref(route).path.substring(0, url.toString().length) === url && url !== "/client" || unref(route).path === url ? " bg-second hover:text-white" : ""]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(title)}`);
            } else {
              return [
                createTextVNode(toDisplayString(title), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/admin/Menu.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "client",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const authUser = useAuth();
    [__temp, __restore] = withAsyncContext(() => authUser.check().then(() => {
    })), await __temp, __restore();
    const data = useData();
    [__temp, __restore] = withAsyncContext(() => data.get().then(() => {
    })), await __temp, __restore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtPage = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex bg-white h-full" }, _attrs))}><aside class="w-[320px] p-8 bg-main"><div class=""><img${ssrRenderAttr("src", _imports_0)} alt="\u0410\u0413\u0410. \u0422\u0443\u0440-\u0446\u0435\u043D\u0442\u0440. \u041B\u043E\u0433\u043E\u0442\u0438\u043F"></div>`);
      if (unref(data).menu) {
        _push(`<div>`);
        _push(ssrRenderComponent(_sfc_main$1, {
          menu: unref(data).menu
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</aside><main class="grow p-8">`);
      _push(ssrRenderComponent(_component_NuxtPage, { data: unref(data) }, null, _parent));
      _push(`</main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/client.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
