import { useSSRContext, defineComponent, ref, withCtx, unref, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode } from 'vue';
import { u as useHead } from './index-6a088328.mjs';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { _ as __nuxt_component_0 } from './nuxt-link-17df5783.mjs';
import { u as useData } from './useData-2a2ed08f.mjs';
import { _ as _sfc_main$1$1, a as _sfc_main$2 } from './ModerationPopup-b363315e.mjs';
import { _ as _sfc_main$3 } from './PhotosList-fd705cb9.mjs';
import '../server.mjs';
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
import './cookie-a95ecb9a.mjs';
import './ssr-34c5ba80.mjs';
import './Popup-4c827385.mjs';
import './icon-close-344453b8.mjs';
import './PopupContainer-4e6a6b1d.mjs';
import './nuxt-img-8eb61343.mjs';
import './icon-trash-be4099c2.mjs';
import './icon-restore-25d99875.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ModerationInitiative",
  __ssrInlineRender: true,
  setup(__props) {
    const userData = useData();
    const companies = ref(userData.companies || []);
    const initiatives = ref(userData.initiatives || []);
    const popupText = ref("");
    const popupReason = ref("");
    const popup = ref();
    const photos = ref();
    let currentID;
    const selectInitiative = (id) => {
      if (!popup.value || typeof initiatives.value === "undefined")
        return;
      currentID = id;
      const initiative = initiatives.value.find((item) => item.id === id);
      if (initiative) {
        popupReason.value = initiative.declineReason ? initiative.declineReason : "";
        popupText.value = `${initiative.text}`;
        popup.value.popupOpen(`${initiative.name}`);
        if (photos.value)
          photos.value.update((initiative == null ? void 0 : initiative.photos) || []);
      }
    };
    const approveInitiative = async () => {
      if (!currentID)
        return;
      if (await userData.approveInitiative(currentID)) {
        currentID = 0;
        initiatives.value = userData.initiatives;
      }
    };
    const declineInitiative = async () => {
      if (!currentID)
        return;
      const reason = (popup == null ? void 0 : popup.value.getReason()) || "";
      if (await userData.declineInitiative(currentID, reason)) {
        currentID = 0;
        initiatives.value = userData.initiatives;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<!--[--><div class="border-b-[3px] mb-4"><div class="flex w-full border-b border-b-main">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        href: "/client/moderation",
        class: "py-3 px-6 rounded-tl rounded-tr text-main hover:bg-main/10"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u041A\u043E\u043C\u043F\u0430\u043D\u0438\u0438 <span class="inline-block bg-second text-white text-xs rounded-lg px-2"${_scopeId}>${ssrInterpolate(unref(companies).length)}</span>`);
          } else {
            return [
              createTextVNode(" \u041A\u043E\u043C\u043F\u0430\u043D\u0438\u0438 "),
              createVNode("span", { class: "inline-block bg-second text-white text-xs rounded-lg px-2" }, toDisplayString(unref(companies).length), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, { class: "py-3 px-6 rounded-tl rounded-tr bg-main text-white" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u0418\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B <span class="inline-block bg-second text-white text-xs rounded-lg px-2"${_scopeId}>${ssrInterpolate(unref(initiatives).length)}</span>`);
          } else {
            return [
              createTextVNode(" \u0418\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B "),
              createVNode("span", { class: "inline-block bg-second text-white text-xs rounded-lg px-2" }, toDisplayString(unref(initiatives).length), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (unref(initiatives).length) {
        _push(`<div class="my-4"><!--[-->`);
        ssrRenderList(unref(initiatives), (item) => {
          _push(ssrRenderComponent(_sfc_main$1$1, {
            key: item.id,
            id: item.id,
            title: `${item.name}`,
            text: `${item.text.substring(0, 50)}...`,
            onClick: selectInitiative
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div><h3 class="text-2xl">\u041D\u0435\u0442, \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432 \u0432 \u043E\u0447\u0435\u0440\u0435\u0434\u0438 \u0434\u043B\u044F \u043C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u0438</h3></div>`);
      }
      _push(ssrRenderComponent(_sfc_main$2, {
        ref_key: "popup",
        ref: popup,
        onApprove: approveInitiative,
        onDecline: declineInitiative
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mb-4"${_scopeId}><div class="text-lg text-gray-700 mb-2"${_scopeId}>${unref(popupText).split("\n").join("<br />")}</div><div class="text-gray-500 mb-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              photos: [],
              ref_key: "photos",
              ref: photos,
              moderation: false
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            if (unref(popupReason)) {
              _push2(`<div class="bg-red-600 text-white text-sm px-4 rounded"${_scopeId}>${ssrInterpolate(unref(popupReason))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "mb-4" }, [
                createVNode("div", {
                  class: "text-lg text-gray-700 mb-2",
                  innerHTML: unref(popupText).split("\n").join("<br />")
                }, null, 8, ["innerHTML"]),
                createVNode("div", { class: "text-gray-500 mb-2" }, [
                  createVNode(_sfc_main$3, {
                    photos: [],
                    ref_key: "photos",
                    ref: photos,
                    moderation: false
                  }, null, 512)
                ]),
                unref(popupReason) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "bg-red-600 text-white text-sm px-4 rounded"
                }, toDisplayString(unref(popupReason)), 1)) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/admin/ModerationInitiative.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "\u0410\u0413\u0410. \u041C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u044F \u0441\u043F\u0438\u0441\u043A\u0430 \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432" });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/client/moderation/initiatives/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
