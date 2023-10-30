import { useSSRContext, defineComponent, mergeProps, unref, ref, withCtx, createVNode, isRef } from 'vue';
import { u as useHead } from './index-6a088328.mjs';
import { ssrRenderComponent, ssrRenderAttrs, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { F as FormKitLazyProvider, f as formkitComponent } from '../server.mjs';
import { u as useData } from './useData-2a2ed08f.mjs';
import IconEdit from './icon-edit-f7118c55.mjs';
import IconTrash from './icon-trash-be4099c2.mjs';
import IconAdmin from './icon-user-cog-c56db86a.mjs';
import IconModerator from './icon-user-check-2a55e216.mjs';
import { _ as _sfc_main$1$1, a as _sfc_main$4 } from './Popup-4c827385.mjs';
import IconUserPlus from './icon-user-plus-45aea0a3.mjs';
import { P as PopupContainer } from './PopupContainer-4e6a6b1d.mjs';
import { setErrors } from '@formkit/core';
import '@unhead/shared';
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
import 'vue-router';
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
import './nuxt-link-17df5783.mjs';
import './icon-close-344453b8.mjs';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "UsersListItem",
  __ssrInlineRender: true,
  props: {
    item: Object
  },
  emits: ["click", "delete"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center px-4 py-3 bg-dark-light/10 odd:bg-white hover:bg-dark-light/20 cursor-pointer rounded" }, _attrs))}><div class="flex items-center w-6/12">${ssrInterpolate((_a = __props.item) == null ? void 0 : _a.fio)} `);
      if ((_b = __props.item) == null ? void 0 : _b.isAdmin) {
        _push(ssrRenderComponent(unref(IconAdmin), {
          class: "w-5 h-5 ml-1 text-second",
          filled: ""
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if ((_c = __props.item) == null ? void 0 : _c.isModerator) {
        _push(ssrRenderComponent(unref(IconModerator), {
          class: "w-5 h-5 ml-1 text-second",
          filled: ""
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="w-4/12">${ssrInterpolate((_d = __props.item) == null ? void 0 : _d.email)}</div><div class="w-2/12 flex items-center justify-end"><a href="" class="block w-5 h-5 mx-1 text-dark-main hover:text-main">`);
      _push(ssrRenderComponent(unref(IconEdit), { filled: "" }, null, _parent));
      _push(`</a><a href="" class="block w-5 h-5 mx-1 text-dark-main hover:text-main">`);
      _push(ssrRenderComponent(unref(IconTrash), { filled: "" }, null, _parent));
      _push(`</a></div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/admin/users/UsersListItem.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "UsersList",
  __ssrInlineRender: true,
  emits: ["click", "delete"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const data = useData();
    const usersList = ref(data.users);
    const emit = __emit;
    const onClick = (item) => {
      emit("click", item);
    };
    const onDelete = (item) => {
      emit("delete", item);
    };
    const update = () => {
      usersList.value = data.users;
    };
    __expose({ update });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      ssrRenderList(unref(usersList), (item) => {
        _push(ssrRenderComponent(_sfc_main$3, {
          item,
          key: item.id,
          onClick,
          onDelete
        }, null, _parent));
      });
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/admin/users/UsersList.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Users",
  __ssrInlineRender: true,
  setup(__props) {
    const titlePopup = ref("\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F");
    const popup = ref();
    const inputEmail = ref("");
    const inputFio = ref("");
    const inputIsAdmin = ref(false);
    const inputIsModerator = ref(false);
    const inputId = ref(void 0);
    const userData = useData();
    const usersList = ref();
    const popupOpen = (item) => {
      titlePopup.value = "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F";
      if (item == null ? void 0 : item.id) {
        titlePopup.value = "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0434\u0430\u043D\u043D\u044B\u0445 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F";
        inputEmail.value = (item == null ? void 0 : item.email) || "";
        inputFio.value = (item == null ? void 0 : item.fio) || "";
        inputIsAdmin.value = (item == null ? void 0 : item.isAdmin) || false;
        inputIsModerator.value = (item == null ? void 0 : item.isModerator) || false;
        inputId.value = (item == null ? void 0 : item.id) || void 0;
      }
      popup.value.show();
    };
    const popupClose = () => {
      popup.value.hide();
      inputEmail.value = "";
      inputFio.value = "";
      inputIsAdmin.value = false;
      inputIsModerator.value = false;
      inputId.value = void 0;
    };
    const popupSubmit = async () => {
      userData.updateUser({
        id: inputId.value || void 0,
        email: inputEmail.value,
        fio: inputFio.value,
        isModerator: inputIsModerator.value,
        isAdmin: inputIsAdmin.value
      }).then((result) => {
        if (result) {
          if (result == null ? void 0 : result.errors)
            return setErrors("users_form", [], result.errors);
          usersList.value.update();
          popupClose();
        }
      }).catch((error) => {
        console.log(error);
      });
    };
    const deleteUser = async (user) => {
      await userData.deleteUser(user).then(() => usersList.value.update());
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormKit = formkitComponent;
      _push(ssrRenderComponent(unref(FormKitLazyProvider), mergeProps({ "config-file": "true" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-7/12 min-w-[520px]"${_scopeId}><div class="w-full text-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$1$1, {
              class: "inline-flex items-center bg-main text-white hover:bg-main-light py-3 px-6 w-auto mx-auto mb-8",
              title: "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F",
              onClick: popupOpen
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(IconUserPlus), {
                    class: "block text-white w-6 h-6 mr-2",
                    filled: ""
                  }, null, _parent3, _scopeId2));
                  _push3(`<span class="hidden md:inline"${_scopeId2}>\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F</span>`);
                } else {
                  return [
                    createVNode(unref(IconUserPlus), {
                      class: "block text-white w-6 h-6 mr-2",
                      filled: ""
                    }),
                    createVNode("span", { class: "hidden md:inline" }, "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              onClick: popupOpen,
              onDelete: deleteUser,
              ref_key: "usersList",
              ref: usersList
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(PopupContainer, {
              ref_key: "popup",
              ref: popup,
              onClose: popupClose
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$4, {
                    class: "bg-gray-light/60 w-full min-w-[300px] max-w-[500px] max-h-full pb-0",
                    title: unref(titlePopup),
                    onClose: popupClose
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_FormKit, {
                          id: "users_form",
                          type: "form",
                          "submit-label": unref(inputId) ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" : "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
                          config: { validationVisibility: "submit" },
                          onSubmit: popupSubmit
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_FormKit, {
                                type: "email",
                                name: "email",
                                id: "email",
                                label: "E-mail",
                                placeholder: "your@email.com",
                                modelValue: unref(inputEmail),
                                "onUpdate:modelValue": ($event) => isRef(inputEmail) ? inputEmail.value = $event : null,
                                validation: "required|length:5|email",
                                "validation-visibility": "live",
                                "validation-messages": {
                                  email_exists: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u0439 email \u0443\u0436\u0435 \u0437\u0430\u043D\u044F\u0442, \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0434\u0440\u0443\u0433\u043E\u0439",
                                  length: "\u0414\u043B\u0438\u043D\u0430 Email \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                  required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C Email",
                                  email: "Email \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u0444\u043E\u0440\u043C\u0430\u0442\u0443 \xABaaa@domain.name\xBB"
                                }
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_FormKit, {
                                type: "text",
                                name: "fio",
                                id: "fio",
                                label: "\u0424\u0418\u041E",
                                placeholder: "\u0424\u0418\u041E",
                                modelValue: unref(inputFio),
                                "onUpdate:modelValue": ($event) => isRef(inputFio) ? inputFio.value = $event : null,
                                validation: "required|length:5|contains_alpha_spaces",
                                "validation-visibility": "live",
                                "validation-messages": {
                                  length: "\u0414\u043B\u0438\u043D\u0430 \u0424\u0418\u041E \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                  required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0424\u0418\u041E",
                                  contains_alpha_spaces: "\u0424\u0418\u041E \u043C\u043E\u0436\u0435\u0442 \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                                }
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_FormKit, {
                                type: "checkbox",
                                name: "isAdmin",
                                id: "isAdmin",
                                label: "\u041F\u0440\u0430\u0432\u0430 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430",
                                modelValue: unref(inputIsAdmin),
                                "onUpdate:modelValue": ($event) => isRef(inputIsAdmin) ? inputIsAdmin.value = $event : null
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_FormKit, {
                                type: "checkbox",
                                name: "isModerator",
                                id: "isModerator",
                                label: "\u041F\u0440\u0430\u0432\u0430 \u043C\u043E\u0434\u0435\u0440\u0430\u0442\u043E\u0440\u0430",
                                modelValue: unref(inputIsModerator),
                                "onUpdate:modelValue": ($event) => isRef(inputIsModerator) ? inputIsModerator.value = $event : null
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_FormKit, {
                                  type: "email",
                                  name: "email",
                                  id: "email",
                                  label: "E-mail",
                                  placeholder: "your@email.com",
                                  modelValue: unref(inputEmail),
                                  "onUpdate:modelValue": ($event) => isRef(inputEmail) ? inputEmail.value = $event : null,
                                  validation: "required|length:5|email",
                                  "validation-visibility": "live",
                                  "validation-messages": {
                                    email_exists: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u0439 email \u0443\u0436\u0435 \u0437\u0430\u043D\u044F\u0442, \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0434\u0440\u0443\u0433\u043E\u0439",
                                    length: "\u0414\u043B\u0438\u043D\u0430 Email \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                    required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C Email",
                                    email: "Email \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u0444\u043E\u0440\u043C\u0430\u0442\u0443 \xABaaa@domain.name\xBB"
                                  }
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "validation-messages"]),
                                createVNode(_component_FormKit, {
                                  type: "text",
                                  name: "fio",
                                  id: "fio",
                                  label: "\u0424\u0418\u041E",
                                  placeholder: "\u0424\u0418\u041E",
                                  modelValue: unref(inputFio),
                                  "onUpdate:modelValue": ($event) => isRef(inputFio) ? inputFio.value = $event : null,
                                  validation: "required|length:5|contains_alpha_spaces",
                                  "validation-visibility": "live",
                                  "validation-messages": {
                                    length: "\u0414\u043B\u0438\u043D\u0430 \u0424\u0418\u041E \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                    required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0424\u0418\u041E",
                                    contains_alpha_spaces: "\u0424\u0418\u041E \u043C\u043E\u0436\u0435\u0442 \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                                  }
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode(_component_FormKit, {
                                  type: "checkbox",
                                  name: "isAdmin",
                                  id: "isAdmin",
                                  label: "\u041F\u0440\u0430\u0432\u0430 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430",
                                  modelValue: unref(inputIsAdmin),
                                  "onUpdate:modelValue": ($event) => isRef(inputIsAdmin) ? inputIsAdmin.value = $event : null
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode(_component_FormKit, {
                                  type: "checkbox",
                                  name: "isModerator",
                                  id: "isModerator",
                                  label: "\u041F\u0440\u0430\u0432\u0430 \u043C\u043E\u0434\u0435\u0440\u0430\u0442\u043E\u0440\u0430",
                                  modelValue: unref(inputIsModerator),
                                  "onUpdate:modelValue": ($event) => isRef(inputIsModerator) ? inputIsModerator.value = $event : null
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_FormKit, {
                            id: "users_form",
                            type: "form",
                            "submit-label": unref(inputId) ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" : "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
                            config: { validationVisibility: "submit" },
                            onSubmit: popupSubmit
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_FormKit, {
                                type: "email",
                                name: "email",
                                id: "email",
                                label: "E-mail",
                                placeholder: "your@email.com",
                                modelValue: unref(inputEmail),
                                "onUpdate:modelValue": ($event) => isRef(inputEmail) ? inputEmail.value = $event : null,
                                validation: "required|length:5|email",
                                "validation-visibility": "live",
                                "validation-messages": {
                                  email_exists: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u0439 email \u0443\u0436\u0435 \u0437\u0430\u043D\u044F\u0442, \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0434\u0440\u0443\u0433\u043E\u0439",
                                  length: "\u0414\u043B\u0438\u043D\u0430 Email \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                  required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C Email",
                                  email: "Email \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u0444\u043E\u0440\u043C\u0430\u0442\u0443 \xABaaa@domain.name\xBB"
                                }
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "validation-messages"]),
                              createVNode(_component_FormKit, {
                                type: "text",
                                name: "fio",
                                id: "fio",
                                label: "\u0424\u0418\u041E",
                                placeholder: "\u0424\u0418\u041E",
                                modelValue: unref(inputFio),
                                "onUpdate:modelValue": ($event) => isRef(inputFio) ? inputFio.value = $event : null,
                                validation: "required|length:5|contains_alpha_spaces",
                                "validation-visibility": "live",
                                "validation-messages": {
                                  length: "\u0414\u043B\u0438\u043D\u0430 \u0424\u0418\u041E \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                  required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0424\u0418\u041E",
                                  contains_alpha_spaces: "\u0424\u0418\u041E \u043C\u043E\u0436\u0435\u0442 \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                                }
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode(_component_FormKit, {
                                type: "checkbox",
                                name: "isAdmin",
                                id: "isAdmin",
                                label: "\u041F\u0440\u0430\u0432\u0430 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430",
                                modelValue: unref(inputIsAdmin),
                                "onUpdate:modelValue": ($event) => isRef(inputIsAdmin) ? inputIsAdmin.value = $event : null
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode(_component_FormKit, {
                                type: "checkbox",
                                name: "isModerator",
                                id: "isModerator",
                                label: "\u041F\u0440\u0430\u0432\u0430 \u043C\u043E\u0434\u0435\u0440\u0430\u0442\u043E\u0440\u0430",
                                modelValue: unref(inputIsModerator),
                                "onUpdate:modelValue": ($event) => isRef(inputIsModerator) ? inputIsModerator.value = $event : null
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }, 8, ["submit-label"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$4, {
                      class: "bg-gray-light/60 w-full min-w-[300px] max-w-[500px] max-h-full pb-0",
                      title: unref(titlePopup),
                      onClose: popupClose
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_FormKit, {
                          id: "users_form",
                          type: "form",
                          "submit-label": unref(inputId) ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" : "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
                          config: { validationVisibility: "submit" },
                          onSubmit: popupSubmit
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_FormKit, {
                              type: "email",
                              name: "email",
                              id: "email",
                              label: "E-mail",
                              placeholder: "your@email.com",
                              modelValue: unref(inputEmail),
                              "onUpdate:modelValue": ($event) => isRef(inputEmail) ? inputEmail.value = $event : null,
                              validation: "required|length:5|email",
                              "validation-visibility": "live",
                              "validation-messages": {
                                email_exists: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u0439 email \u0443\u0436\u0435 \u0437\u0430\u043D\u044F\u0442, \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0434\u0440\u0443\u0433\u043E\u0439",
                                length: "\u0414\u043B\u0438\u043D\u0430 Email \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C Email",
                                email: "Email \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u0444\u043E\u0440\u043C\u0430\u0442\u0443 \xABaaa@domain.name\xBB"
                              }
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "validation-messages"]),
                            createVNode(_component_FormKit, {
                              type: "text",
                              name: "fio",
                              id: "fio",
                              label: "\u0424\u0418\u041E",
                              placeholder: "\u0424\u0418\u041E",
                              modelValue: unref(inputFio),
                              "onUpdate:modelValue": ($event) => isRef(inputFio) ? inputFio.value = $event : null,
                              validation: "required|length:5|contains_alpha_spaces",
                              "validation-visibility": "live",
                              "validation-messages": {
                                length: "\u0414\u043B\u0438\u043D\u0430 \u0424\u0418\u041E \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0424\u0418\u041E",
                                contains_alpha_spaces: "\u0424\u0418\u041E \u043C\u043E\u0436\u0435\u0442 \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                              }
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode(_component_FormKit, {
                              type: "checkbox",
                              name: "isAdmin",
                              id: "isAdmin",
                              label: "\u041F\u0440\u0430\u0432\u0430 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430",
                              modelValue: unref(inputIsAdmin),
                              "onUpdate:modelValue": ($event) => isRef(inputIsAdmin) ? inputIsAdmin.value = $event : null
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode(_component_FormKit, {
                              type: "checkbox",
                              name: "isModerator",
                              id: "isModerator",
                              label: "\u041F\u0440\u0430\u0432\u0430 \u043C\u043E\u0434\u0435\u0440\u0430\u0442\u043E\u0440\u0430",
                              modelValue: unref(inputIsModerator),
                              "onUpdate:modelValue": ($event) => isRef(inputIsModerator) ? inputIsModerator.value = $event : null
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }, 8, ["submit-label"])
                      ]),
                      _: 1
                    }, 8, ["title"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "w-7/12 min-w-[520px]" }, [
                createVNode("div", { class: "w-full text-center" }, [
                  createVNode(_sfc_main$1$1, {
                    class: "inline-flex items-center bg-main text-white hover:bg-main-light py-3 px-6 w-auto mx-auto mb-8",
                    title: "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F",
                    onClick: popupOpen
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(IconUserPlus), {
                        class: "block text-white w-6 h-6 mr-2",
                        filled: ""
                      }),
                      createVNode("span", { class: "hidden md:inline" }, "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F")
                    ]),
                    _: 1
                  })
                ]),
                createVNode(_sfc_main$2, {
                  onClick: popupOpen,
                  onDelete: deleteUser,
                  ref_key: "usersList",
                  ref: usersList
                }, null, 512),
                createVNode(PopupContainer, {
                  ref_key: "popup",
                  ref: popup,
                  onClose: popupClose
                }, {
                  default: withCtx(() => [
                    createVNode(_sfc_main$4, {
                      class: "bg-gray-light/60 w-full min-w-[300px] max-w-[500px] max-h-full pb-0",
                      title: unref(titlePopup),
                      onClose: popupClose
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_FormKit, {
                          id: "users_form",
                          type: "form",
                          "submit-label": unref(inputId) ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" : "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
                          config: { validationVisibility: "submit" },
                          onSubmit: popupSubmit
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_FormKit, {
                              type: "email",
                              name: "email",
                              id: "email",
                              label: "E-mail",
                              placeholder: "your@email.com",
                              modelValue: unref(inputEmail),
                              "onUpdate:modelValue": ($event) => isRef(inputEmail) ? inputEmail.value = $event : null,
                              validation: "required|length:5|email",
                              "validation-visibility": "live",
                              "validation-messages": {
                                email_exists: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u0439 email \u0443\u0436\u0435 \u0437\u0430\u043D\u044F\u0442, \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0434\u0440\u0443\u0433\u043E\u0439",
                                length: "\u0414\u043B\u0438\u043D\u0430 Email \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C Email",
                                email: "Email \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u0444\u043E\u0440\u043C\u0430\u0442\u0443 \xABaaa@domain.name\xBB"
                              }
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "validation-messages"]),
                            createVNode(_component_FormKit, {
                              type: "text",
                              name: "fio",
                              id: "fio",
                              label: "\u0424\u0418\u041E",
                              placeholder: "\u0424\u0418\u041E",
                              modelValue: unref(inputFio),
                              "onUpdate:modelValue": ($event) => isRef(inputFio) ? inputFio.value = $event : null,
                              validation: "required|length:5|contains_alpha_spaces",
                              "validation-visibility": "live",
                              "validation-messages": {
                                length: "\u0414\u043B\u0438\u043D\u0430 \u0424\u0418\u041E \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0424\u0418\u041E",
                                contains_alpha_spaces: "\u0424\u0418\u041E \u043C\u043E\u0436\u0435\u0442 \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                              }
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode(_component_FormKit, {
                              type: "checkbox",
                              name: "isAdmin",
                              id: "isAdmin",
                              label: "\u041F\u0440\u0430\u0432\u0430 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430",
                              modelValue: unref(inputIsAdmin),
                              "onUpdate:modelValue": ($event) => isRef(inputIsAdmin) ? inputIsAdmin.value = $event : null
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode(_component_FormKit, {
                              type: "checkbox",
                              name: "isModerator",
                              id: "isModerator",
                              label: "\u041F\u0440\u0430\u0432\u0430 \u043C\u043E\u0434\u0435\u0440\u0430\u0442\u043E\u0440\u0430",
                              modelValue: unref(inputIsModerator),
                              "onUpdate:modelValue": ($event) => isRef(inputIsModerator) ? inputIsModerator.value = $event : null
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }, 8, ["submit-label"])
                      ]),
                      _: 1
                    }, 8, ["title"])
                  ]),
                  _: 1
                }, 512)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/admin/Users.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "\u0410\u0413\u0410. \u0421\u043F\u0438\u0441\u043E\u043A \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439" });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/client/users/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
