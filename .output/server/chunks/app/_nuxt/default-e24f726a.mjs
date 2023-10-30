import { p as publicAssetsURL } from '../../handlers/renderer.mjs';
import { F as FormKitLazyProvider, _ as _export_sfc, m as __nuxt_component_0, u as useRouter, f as formkitComponent } from '../server.mjs';
import { useSSRContext, defineComponent, mergeProps, withCtx, createVNode, ref, unref, reactive, createTextVNode, withDirectives, vShow, openBlock, createBlock, createCommentVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _sfc_main$1$1, a as _sfc_main$d } from './Popup-4c827385.mjs';
import IconLogin from './icon-login-7cacbb33.mjs';
import { submitForm, setErrors } from '@formkit/core';
import { u as useAuth } from './useAuth-3eb17c57.mjs';
import { _ as _imports_0$1 } from './logo-white-8447be35.mjs';
import { u as useImage, _ as __nuxt_component_0$1 } from './nuxt-img-8eb61343.mjs';
import IconSearch from './icon-search-6c02bf6d.mjs';
import 'vue-bundle-renderer/runtime';
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
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import '@formkit/utils';
import '@formkit/inputs';
import '@formkit/rules';
import '@formkit/validation';
import '@formkit/i18n';
import '@formkit/themes';
import '@formkit/observer';
import '@formkit/dev';
import './nuxt-link-17df5783.mjs';
import './icon-close-344453b8.mjs';
import './cookie-a95ecb9a.mjs';
import './ssr-34c5ba80.mjs';
import './index-6a088328.mjs';

const _imports_0 = "" + publicAssetsURL("images/logo-color.svg");
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "LogoColor",
  __ssrInlineRender: true,
  props: {
    href: String
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "order-1 w-6/12 md:w-2/12 h-14 md:h-full md:max-w-[170px] md:ml-[17px]" }, _attrs))}><a${ssrRenderAttr("href", __props.href)}><img${ssrRenderAttr("src", _imports_0)} class="w-auto h-14 md:h-28" alt="\u0410\u0413\u0410. \u0422\u0443\u0440-\u0446\u0435\u043D\u0442\u0440. \u041B\u043E\u0433\u043E\u0442\u0438\u043F"></a></div>`);
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/LogoColor.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = {};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs) {
  _push(`<nav${ssrRenderAttrs(mergeProps({ class: "flex grow-1 items-center justify-center order-3 md:order-2 w-full" }, _attrs))} data-v-82518c23><ul class="flex justify-center w-full md:w-auto" data-v-82518c23><li data-v-82518c23>\u041D\u043E\u0432\u043E\u0441\u0442\u0438</li><li data-v-82518c23>\u041E\u0442\u0434\u044B\u0445</li><li data-v-82518c23>\u0420\u0430\u0431\u043E\u0442\u0430</li></ul></nav>`);
}
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Menu.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const Menu = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["ssrRender", _sfc_ssrRender$4], ["__scopeId", "data-v-82518c23"]]);
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "Login",
  __ssrInlineRender: true,
  props: {
    loggedUser: {
      type: Boolean,
      default: false
    }
  },
  emits: ["showPopup"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose({ hidePopup, update });
    const props = __props;
    const isLogged = ref(props.loggedUser);
    const emit = __emit;
    const isPopupShow = ref(false);
    function showPopup() {
      togglePopup();
      emit("showPopup");
    }
    function hidePopup() {
      togglePopup();
    }
    function togglePopup() {
      isPopupShow.value = !isPopupShow.value;
    }
    function update(logged) {
      isLogged.value = logged;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex order-2 md:order-3 items-center justify-end md:justify-end w-6/12 md:w-2/12 pr-8" }, _attrs))} data-v-58dbf842>`);
      if (!unref(isLogged)) {
        _push(`<div data-v-58dbf842>`);
        _push(ssrRenderComponent(_sfc_main$1$1, {
          class: ["btn-main", unref(isPopupShow) ? "hide" : ""],
          title: "\u0412\u043E\u0439\u0442\u0438",
          onClick: showPopup
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(IconLogin), { filled: "" }, null, _parent2, _scopeId));
              _push2(`<span class="hidden md:inline" data-v-58dbf842${_scopeId}>\u0412\u043E\u0439\u0442\u0438</span>`);
            } else {
              return [
                createVNode(unref(IconLogin), { filled: "" }),
                createVNode("span", { class: "hidden md:inline" }, "\u0412\u043E\u0439\u0442\u0438")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div data-v-58dbf842>`);
        _push(ssrRenderComponent(_sfc_main$1$1, {
          class: "btn-main",
          to: "/client",
          title: "\u041B\u0438\u0447\u043D\u044B\u0439 \u043A\u0430\u0431\u0438\u043D\u0435\u0442"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(IconLogin), { filled: "" }, null, _parent2, _scopeId));
              _push2(`<span class="hidden md:inline" data-v-58dbf842${_scopeId}>\u041B\u0438\u0447\u043D\u044B\u0439 \u043A\u0430\u0431\u0438\u043D\u0435\u0442</span>`);
            } else {
              return [
                createVNode(unref(IconLogin), { filled: "" }),
                createVNode("span", { class: "hidden md:inline" }, "\u041B\u0438\u0447\u043D\u044B\u0439 \u043A\u0430\u0431\u0438\u043D\u0435\u0442")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Login.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const Login = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-58dbf842"]]);
const _sfc_main$9 = {};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex justify-stretch gap-4 mt-4" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/ButtonRow.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const ButtonRow = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["ssrRender", _sfc_ssrRender$3]]);
const _sfc_main$8 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    class: "animate-spin h-5 w-5",
    viewBox: "0 0 24 24",
    fill: "white"
  }, _attrs))}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
}
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/SvgLoading.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const SvgLoading = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["ssrRender", _sfc_ssrRender$2]]);
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "LoadingBg",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "absolute flex items-center justify-center left-0 top-0 w-full h-full z-30 bg-white/60 backdrop-blur-[1px]" }, _attrs))}>`);
      _push(ssrRenderComponent(SvgLoading, { class: "w-8 h-8 block text-main" }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/LoadingBg.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "LoginPopup",
  __ssrInlineRender: true,
  emits: ["hide-popup"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const loginForm = reactive({
      email: "",
      code: "",
      isReg: false,
      regEmail: "",
      regCode: "",
      regFIO: "",
      mode: false,
      classList: "",
      show: false,
      loading: false
    });
    const authUser = useAuth();
    __expose({ show, hide });
    const emit = __emit;
    function show() {
      loginForm.show = true;
    }
    function hide() {
      loginForm.show = false;
      loginForm.isReg = false;
      loginForm.classList = "";
      loginForm.mode = false;
      emit("hide-popup");
    }
    const switchRegistration = () => {
      loginForm.isReg = !loginForm.isReg;
      loginForm.classList = loginForm.isReg ? "is-registration" : "";
      loginForm.mode = false;
    };
    const loginClick = () => {
      submitForm("login_form");
    };
    const registrationClick = () => {
      submitForm("registration_form");
    };
    const login = async () => {
      var _a, _b, _c, _d;
      if (!loginForm.mode) {
        loginForm.loading = true;
        const result2 = await authUser.login(loginForm.email);
        if (result2 == null ? void 0 : result2.errors) {
          console.log(result2.errors);
          setErrors("login_form", ((_a = result2.errors) == null ? void 0 : _a.other) ? [(_b = result2.errors) == null ? void 0 : _b.other] : [], result2.errors);
        }
        loginForm.loading = false;
        if (!(result2 == null ? void 0 : result2.errors) && (result2 == null ? void 0 : result2.user))
          loginForm.mode = true;
        return;
      }
      loginForm.loading = true;
      const result = await authUser.login(loginForm.email, loginForm.code);
      if (result == null ? void 0 : result.errors) {
        setErrors("login_form", ((_c = result.errors) == null ? void 0 : _c.other) ? [(_d = result.errors) == null ? void 0 : _d.other] : [], result.errors);
      }
      loginForm.loading = false;
      if (!(result == null ? void 0 : result.user))
        return;
      hide();
      await gotoClientArea();
    };
    const register = async (data) => {
      var _a, _b, _c, _d;
      if (!loginForm.mode) {
        loginForm.loading = true;
        const result2 = await authUser.register(loginForm.regEmail, loginForm.regFIO, loginForm.regCode);
        if (result2 == null ? void 0 : result2.errors) {
          console.log(result2.errors);
          setErrors("registration_form", ((_a = result2.errors) == null ? void 0 : _a.other) ? [(_b = result2.errors) == null ? void 0 : _b.other] : [], result2.errors);
        }
        loginForm.loading = false;
        if (!(result2 == null ? void 0 : result2.errors) && (result2 == null ? void 0 : result2.user))
          loginForm.mode = true;
        return;
      }
      loginForm.loading = true;
      const result = await authUser.register(loginForm.regEmail, loginForm.regFIO, loginForm.regCode);
      if (result == null ? void 0 : result.errors) {
        setErrors("registration_form", ((_c = result.errors) == null ? void 0 : _c.other) ? [(_d = result.errors) == null ? void 0 : _d.other] : [], result.errors);
      }
      loginForm.loading = false;
      if (!(result == null ? void 0 : result.user))
        return;
      hide();
      await gotoClientArea();
    };
    const gotoClientArea = async () => {
      const router = useRouter();
      await router.push({ path: "/client" });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormKit = formkitComponent;
      _push(ssrRenderComponent(unref(FormKitLazyProvider), mergeProps({ "config-file": "true" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="${ssrRenderClass([unref(loginForm).show ? "show " : "", "login-popup-container"])}" data-v-26558e11${_scopeId}><div class="${ssrRenderClass([unref(loginForm).classList, "login-popup"])}" data-v-26558e11${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$d, {
              title: "\u0410\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F",
              class: "w-full bg-gray-200/60 pb-6 shadow-md",
              onClose: hide
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_FormKit, {
                    id: "login_form",
                    type: "form",
                    "submit-label": "\u0412\u043E\u0439\u0442\u0438",
                    config: { validationVisibility: "submit" },
                    actions: false,
                    onSubmit: login
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_FormKit, {
                          type: "email",
                          id: "email",
                          name: "email",
                          label: "E-mail",
                          placeholder: "E-mail \u0430\u0434\u0440\u0435\u0441",
                          modelValue: unref(loginForm).email,
                          "onUpdate:modelValue": ($event) => unref(loginForm).email = $event,
                          validation: "required|email",
                          "validation-visibility": "submit",
                          "validation-messages": {
                            not_exists: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u0439 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
                            email: "\u0412\u0432\u0435\u0434\u0451\u043D\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442 \u043D\u0435 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0444\u043E\u0440\u043C\u0430\u0442\u0443 Email",
                            required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0430\u0448 email"
                          }
                        }, null, _parent4, _scopeId3));
                        if (unref(loginForm).mode) {
                          _push4(ssrRenderComponent(_component_FormKit, {
                            type: "text",
                            id: "confirm_code",
                            name: "confirm_code",
                            class: "confirm_code",
                            label: "\u041A\u043E\u0434",
                            placeholder: "\u041A\u043E\u0434 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F",
                            modelValue: unref(loginForm).code,
                            "onUpdate:modelValue": ($event) => unref(loginForm).code = $event,
                            validation: "required|length:8|contains_numeric",
                            "validation-visibility": "submit",
                            "validation-messages": {
                              code_not_exists: "\u0412\u0432\u0435\u0434\u0451\u043D \u043D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043A\u043E\u0434",
                              length: "\u0414\u043B\u0438\u043D\u0430 \u043A\u043E\u0434\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C 8 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                              required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0430\u0448 email",
                              contains_numeric: "\u041A\u043E\u0434 \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0446\u0438\u0444\u0440"
                            }
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(ssrRenderComponent(ButtonRow, { class: "h-12" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_sfc_main$1$1, {
                                class: "flex items-center justify-center grow bg-transparent border border-main text-main hover:text-white hover:bg-main hover:border-main group disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-main-light-2 disabled:hover:text-main-light-2",
                                title: "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F",
                                onClick: switchRegistration,
                                style: !unref(loginForm).mode ? null : { display: "none" }
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` \u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F `);
                                  } else {
                                    return [
                                      createTextVNode(" \u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_sfc_main$1$1, {
                                class: "flex items-center border border-second bg-second text-white hover:border-main hover:bg-main px-6",
                                title: "\u0412\u043E\u0439\u0442\u0438",
                                onClick: loginClick
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(IconLogin), {
                                      class: "w-6 h-6 block text-white pr-1",
                                      filled: ""
                                    }, null, _parent6, _scopeId5));
                                    _push6(` \u0412\u043E\u0439\u0442\u0438 `);
                                  } else {
                                    return [
                                      createVNode(unref(IconLogin), {
                                        class: "w-6 h-6 block text-white pr-1",
                                        filled: ""
                                      }),
                                      createTextVNode(" \u0412\u043E\u0439\u0442\u0438 ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                withDirectives(createVNode(_sfc_main$1$1, {
                                  class: "flex items-center justify-center grow bg-transparent border border-main text-main hover:text-white hover:bg-main hover:border-main group disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-main-light-2 disabled:hover:text-main-light-2",
                                  title: "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F",
                                  onClick: switchRegistration
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" \u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F ")
                                  ]),
                                  _: 1
                                }, 512), [
                                  [vShow, !unref(loginForm).mode]
                                ]),
                                createVNode(_sfc_main$1$1, {
                                  class: "flex items-center border border-second bg-second text-white hover:border-main hover:bg-main px-6",
                                  title: "\u0412\u043E\u0439\u0442\u0438",
                                  onClick: loginClick
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(IconLogin), {
                                      class: "w-6 h-6 block text-white pr-1",
                                      filled: ""
                                    }),
                                    createTextVNode(" \u0412\u043E\u0439\u0442\u0438 ")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_FormKit, {
                            type: "email",
                            id: "email",
                            name: "email",
                            label: "E-mail",
                            placeholder: "E-mail \u0430\u0434\u0440\u0435\u0441",
                            modelValue: unref(loginForm).email,
                            "onUpdate:modelValue": ($event) => unref(loginForm).email = $event,
                            validation: "required|email",
                            "validation-visibility": "submit",
                            "validation-messages": {
                              not_exists: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u0439 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
                              email: "\u0412\u0432\u0435\u0434\u0451\u043D\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442 \u043D\u0435 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0444\u043E\u0440\u043C\u0430\u0442\u0443 Email",
                              required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0430\u0448 email"
                            }
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          unref(loginForm).mode ? (openBlock(), createBlock(_component_FormKit, {
                            key: 0,
                            type: "text",
                            id: "confirm_code",
                            name: "confirm_code",
                            class: "confirm_code",
                            label: "\u041A\u043E\u0434",
                            placeholder: "\u041A\u043E\u0434 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F",
                            modelValue: unref(loginForm).code,
                            "onUpdate:modelValue": ($event) => unref(loginForm).code = $event,
                            validation: "required|length:8|contains_numeric",
                            "validation-visibility": "submit",
                            "validation-messages": {
                              code_not_exists: "\u0412\u0432\u0435\u0434\u0451\u043D \u043D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043A\u043E\u0434",
                              length: "\u0414\u043B\u0438\u043D\u0430 \u043A\u043E\u0434\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C 8 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                              required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0430\u0448 email",
                              contains_numeric: "\u041A\u043E\u0434 \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0446\u0438\u0444\u0440"
                            }
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                          createVNode(ButtonRow, { class: "h-12" }, {
                            default: withCtx(() => [
                              withDirectives(createVNode(_sfc_main$1$1, {
                                class: "flex items-center justify-center grow bg-transparent border border-main text-main hover:text-white hover:bg-main hover:border-main group disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-main-light-2 disabled:hover:text-main-light-2",
                                title: "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F",
                                onClick: switchRegistration
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" \u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F ")
                                ]),
                                _: 1
                              }, 512), [
                                [vShow, !unref(loginForm).mode]
                              ]),
                              createVNode(_sfc_main$1$1, {
                                class: "flex items-center border border-second bg-second text-white hover:border-main hover:bg-main px-6",
                                title: "\u0412\u043E\u0439\u0442\u0438",
                                onClick: loginClick
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(IconLogin), {
                                    class: "w-6 h-6 block text-white pr-1",
                                    filled: ""
                                  }),
                                  createTextVNode(" \u0412\u043E\u0439\u0442\u0438 ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$7, {
                    style: unref(loginForm).loading ? null : { display: "none" }
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_FormKit, {
                      id: "login_form",
                      type: "form",
                      "submit-label": "\u0412\u043E\u0439\u0442\u0438",
                      config: { validationVisibility: "submit" },
                      actions: false,
                      onSubmit: login
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_FormKit, {
                          type: "email",
                          id: "email",
                          name: "email",
                          label: "E-mail",
                          placeholder: "E-mail \u0430\u0434\u0440\u0435\u0441",
                          modelValue: unref(loginForm).email,
                          "onUpdate:modelValue": ($event) => unref(loginForm).email = $event,
                          validation: "required|email",
                          "validation-visibility": "submit",
                          "validation-messages": {
                            not_exists: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u0439 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
                            email: "\u0412\u0432\u0435\u0434\u0451\u043D\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442 \u043D\u0435 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0444\u043E\u0440\u043C\u0430\u0442\u0443 Email",
                            required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0430\u0448 email"
                          }
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        unref(loginForm).mode ? (openBlock(), createBlock(_component_FormKit, {
                          key: 0,
                          type: "text",
                          id: "confirm_code",
                          name: "confirm_code",
                          class: "confirm_code",
                          label: "\u041A\u043E\u0434",
                          placeholder: "\u041A\u043E\u0434 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F",
                          modelValue: unref(loginForm).code,
                          "onUpdate:modelValue": ($event) => unref(loginForm).code = $event,
                          validation: "required|length:8|contains_numeric",
                          "validation-visibility": "submit",
                          "validation-messages": {
                            code_not_exists: "\u0412\u0432\u0435\u0434\u0451\u043D \u043D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043A\u043E\u0434",
                            length: "\u0414\u043B\u0438\u043D\u0430 \u043A\u043E\u0434\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C 8 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                            required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0430\u0448 email",
                            contains_numeric: "\u041A\u043E\u0434 \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0446\u0438\u0444\u0440"
                          }
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                        createVNode(ButtonRow, { class: "h-12" }, {
                          default: withCtx(() => [
                            withDirectives(createVNode(_sfc_main$1$1, {
                              class: "flex items-center justify-center grow bg-transparent border border-main text-main hover:text-white hover:bg-main hover:border-main group disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-main-light-2 disabled:hover:text-main-light-2",
                              title: "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F",
                              onClick: switchRegistration
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" \u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F ")
                              ]),
                              _: 1
                            }, 512), [
                              [vShow, !unref(loginForm).mode]
                            ]),
                            createVNode(_sfc_main$1$1, {
                              class: "flex items-center border border-second bg-second text-white hover:border-main hover:bg-main px-6",
                              title: "\u0412\u043E\u0439\u0442\u0438",
                              onClick: loginClick
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(IconLogin), {
                                  class: "w-6 h-6 block text-white pr-1",
                                  filled: ""
                                }),
                                createTextVNode(" \u0412\u043E\u0439\u0442\u0438 ")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    withDirectives(createVNode(_sfc_main$7, null, null, 512), [
                      [vShow, unref(loginForm).loading]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$d, {
              title: "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F",
              class: "w-full bg-gray-200/60 pb-6 shadow-md",
              onClose: hide
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_FormKit, {
                    id: "registration_form",
                    type: "form",
                    "submit-label": "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F",
                    config: { validationVisibility: "submit" },
                    actions: false,
                    onSubmit: register
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_FormKit, {
                          type: "email",
                          name: "email",
                          id: "email",
                          label: "E-mail",
                          placeholder: "E-mail \u0430\u0434\u0440\u0435\u0441",
                          modelValue: unref(loginForm).regEmail,
                          "onUpdate:modelValue": ($event) => unref(loginForm).regEmail = $event,
                          validation: "required|email",
                          "validation-visibility": "submit",
                          "validation-messages": {
                            user_exists: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u0439 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
                            email: "\u0412\u0432\u0435\u0434\u0451\u043D\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442 \u043D\u0435 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0444\u043E\u0440\u043C\u0430\u0442\u0443 Email",
                            required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0430\u0448 email"
                          }
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_FormKit, {
                          type: "text",
                          name: "fio",
                          id: "fio",
                          label: "\u0424\u0418\u041E",
                          placeholder: "\u0424\u0418\u041E",
                          modelValue: unref(loginForm).regFIO,
                          "onUpdate:modelValue": ($event) => unref(loginForm).regFIO = $event,
                          validation: "required|length:5|contains_alpha_spaces",
                          "validation-visibility": "submit",
                          "validation-messages": {
                            length: "\u0414\u043B\u0438\u043D\u0430 \u0424\u0418\u041E \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                            required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0424\u0418\u041E",
                            contains_alpha_spaces: "\u0424\u0418\u041E \u043C\u043E\u0436\u0435\u0442 \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                          }
                        }, null, _parent4, _scopeId3));
                        if (unref(loginForm).mode) {
                          _push4(ssrRenderComponent(_component_FormKit, {
                            type: "text",
                            id: "code",
                            name: "confirm_code",
                            class: "confirm_code",
                            label: "\u041A\u043E\u0434",
                            placeholder: "\u041A\u043E\u0434 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F",
                            modelValue: unref(loginForm).regCode,
                            "onUpdate:modelValue": ($event) => unref(loginForm).regCode = $event,
                            validation: "required|length:8|contains_numeric",
                            "validation-visibility": "submit",
                            "validation-messages": {
                              code_not_exists: "\u0412\u0432\u0435\u0434\u0451\u043D \u043D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043A\u043E\u0434",
                              length: "\u0414\u043B\u0438\u043D\u0430 \u043A\u043E\u0434\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C 8 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                              required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0430\u0448 email",
                              contains_numeric: "\u041A\u043E\u0434 \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0446\u0438\u0444\u0440"
                            }
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(ssrRenderComponent(_component_FormKit, {
                          type: "checkbox",
                          name: "confirm",
                          id: "confirm",
                          checked: true,
                          label: "\u0421\u043E\u0433\u043B\u0430\u0441\u0435\u043D \u0441 \u043F\u0440\u0430\u0432\u0438\u043B\u0430\u043C\u0438 \u0441\u0430\u0439\u0442\u0430",
                          validation: "required",
                          "validation-messages": {
                            required: "\u0411\u0435\u0437 \u0441\u043E\u0433\u043B\u0430\u0441\u0438\u044F \u0441 \u043F\u0440\u0430\u0432\u0438\u043B\u0430\u043C\u0438 \u0441\u0430\u0439\u0442\u0430 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u0430"
                          }
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(ButtonRow, { class: "h-12" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_sfc_main$1$1, {
                                class: "flex items-center justify-center grow bg-transparent border border-main text-main hover:text-white hover:bg-main hover:border-main group",
                                title: "\u0412\u043E\u0439\u0442\u0438",
                                onClick: switchRegistration
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` \u0410\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F `);
                                  } else {
                                    return [
                                      createTextVNode(" \u0410\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_sfc_main$1$1, {
                                class: "flex items-center border border-second bg-second text-white hover:border-main hover:bg-main px-6",
                                title: "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F",
                                onClick: registrationClick
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` \u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F `);
                                  } else {
                                    return [
                                      createTextVNode(" \u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_sfc_main$1$1, {
                                  class: "flex items-center justify-center grow bg-transparent border border-main text-main hover:text-white hover:bg-main hover:border-main group",
                                  title: "\u0412\u043E\u0439\u0442\u0438",
                                  onClick: switchRegistration
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" \u0410\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_sfc_main$1$1, {
                                  class: "flex items-center border border-second bg-second text-white hover:border-main hover:bg-main px-6",
                                  title: "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F",
                                  onClick: registrationClick
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" \u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F ")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_FormKit, {
                            type: "email",
                            name: "email",
                            id: "email",
                            label: "E-mail",
                            placeholder: "E-mail \u0430\u0434\u0440\u0435\u0441",
                            modelValue: unref(loginForm).regEmail,
                            "onUpdate:modelValue": ($event) => unref(loginForm).regEmail = $event,
                            validation: "required|email",
                            "validation-visibility": "submit",
                            "validation-messages": {
                              user_exists: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u0439 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
                              email: "\u0412\u0432\u0435\u0434\u0451\u043D\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442 \u043D\u0435 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0444\u043E\u0440\u043C\u0430\u0442\u0443 Email",
                              required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0430\u0448 email"
                            }
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode(_component_FormKit, {
                            type: "text",
                            name: "fio",
                            id: "fio",
                            label: "\u0424\u0418\u041E",
                            placeholder: "\u0424\u0418\u041E",
                            modelValue: unref(loginForm).regFIO,
                            "onUpdate:modelValue": ($event) => unref(loginForm).regFIO = $event,
                            validation: "required|length:5|contains_alpha_spaces",
                            "validation-visibility": "submit",
                            "validation-messages": {
                              length: "\u0414\u043B\u0438\u043D\u0430 \u0424\u0418\u041E \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                              required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0424\u0418\u041E",
                              contains_alpha_spaces: "\u0424\u0418\u041E \u043C\u043E\u0436\u0435\u0442 \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                            }
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          unref(loginForm).mode ? (openBlock(), createBlock(_component_FormKit, {
                            key: 0,
                            type: "text",
                            id: "code",
                            name: "confirm_code",
                            class: "confirm_code",
                            label: "\u041A\u043E\u0434",
                            placeholder: "\u041A\u043E\u0434 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F",
                            modelValue: unref(loginForm).regCode,
                            "onUpdate:modelValue": ($event) => unref(loginForm).regCode = $event,
                            validation: "required|length:8|contains_numeric",
                            "validation-visibility": "submit",
                            "validation-messages": {
                              code_not_exists: "\u0412\u0432\u0435\u0434\u0451\u043D \u043D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043A\u043E\u0434",
                              length: "\u0414\u043B\u0438\u043D\u0430 \u043A\u043E\u0434\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C 8 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                              required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0430\u0448 email",
                              contains_numeric: "\u041A\u043E\u0434 \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0446\u0438\u0444\u0440"
                            }
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                          createVNode(_component_FormKit, {
                            type: "checkbox",
                            name: "confirm",
                            id: "confirm",
                            checked: true,
                            label: "\u0421\u043E\u0433\u043B\u0430\u0441\u0435\u043D \u0441 \u043F\u0440\u0430\u0432\u0438\u043B\u0430\u043C\u0438 \u0441\u0430\u0439\u0442\u0430",
                            validation: "required",
                            "validation-messages": {
                              required: "\u0411\u0435\u0437 \u0441\u043E\u0433\u043B\u0430\u0441\u0438\u044F \u0441 \u043F\u0440\u0430\u0432\u0438\u043B\u0430\u043C\u0438 \u0441\u0430\u0439\u0442\u0430 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u0430"
                            }
                          }),
                          createVNode(ButtonRow, { class: "h-12" }, {
                            default: withCtx(() => [
                              createVNode(_sfc_main$1$1, {
                                class: "flex items-center justify-center grow bg-transparent border border-main text-main hover:text-white hover:bg-main hover:border-main group",
                                title: "\u0412\u043E\u0439\u0442\u0438",
                                onClick: switchRegistration
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" \u0410\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F ")
                                ]),
                                _: 1
                              }),
                              createVNode(_sfc_main$1$1, {
                                class: "flex items-center border border-second bg-second text-white hover:border-main hover:bg-main px-6",
                                title: "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F",
                                onClick: registrationClick
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" \u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$7, {
                    style: unref(loginForm).loading ? null : { display: "none" }
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_FormKit, {
                      id: "registration_form",
                      type: "form",
                      "submit-label": "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F",
                      config: { validationVisibility: "submit" },
                      actions: false,
                      onSubmit: register
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_FormKit, {
                          type: "email",
                          name: "email",
                          id: "email",
                          label: "E-mail",
                          placeholder: "E-mail \u0430\u0434\u0440\u0435\u0441",
                          modelValue: unref(loginForm).regEmail,
                          "onUpdate:modelValue": ($event) => unref(loginForm).regEmail = $event,
                          validation: "required|email",
                          "validation-visibility": "submit",
                          "validation-messages": {
                            user_exists: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u0439 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
                            email: "\u0412\u0432\u0435\u0434\u0451\u043D\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442 \u043D\u0435 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0444\u043E\u0440\u043C\u0430\u0442\u0443 Email",
                            required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0430\u0448 email"
                          }
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode(_component_FormKit, {
                          type: "text",
                          name: "fio",
                          id: "fio",
                          label: "\u0424\u0418\u041E",
                          placeholder: "\u0424\u0418\u041E",
                          modelValue: unref(loginForm).regFIO,
                          "onUpdate:modelValue": ($event) => unref(loginForm).regFIO = $event,
                          validation: "required|length:5|contains_alpha_spaces",
                          "validation-visibility": "submit",
                          "validation-messages": {
                            length: "\u0414\u043B\u0438\u043D\u0430 \u0424\u0418\u041E \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                            required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0424\u0418\u041E",
                            contains_alpha_spaces: "\u0424\u0418\u041E \u043C\u043E\u0436\u0435\u0442 \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                          }
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        unref(loginForm).mode ? (openBlock(), createBlock(_component_FormKit, {
                          key: 0,
                          type: "text",
                          id: "code",
                          name: "confirm_code",
                          class: "confirm_code",
                          label: "\u041A\u043E\u0434",
                          placeholder: "\u041A\u043E\u0434 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F",
                          modelValue: unref(loginForm).regCode,
                          "onUpdate:modelValue": ($event) => unref(loginForm).regCode = $event,
                          validation: "required|length:8|contains_numeric",
                          "validation-visibility": "submit",
                          "validation-messages": {
                            code_not_exists: "\u0412\u0432\u0435\u0434\u0451\u043D \u043D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043A\u043E\u0434",
                            length: "\u0414\u043B\u0438\u043D\u0430 \u043A\u043E\u0434\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C 8 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                            required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0430\u0448 email",
                            contains_numeric: "\u041A\u043E\u0434 \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0446\u0438\u0444\u0440"
                          }
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                        createVNode(_component_FormKit, {
                          type: "checkbox",
                          name: "confirm",
                          id: "confirm",
                          checked: true,
                          label: "\u0421\u043E\u0433\u043B\u0430\u0441\u0435\u043D \u0441 \u043F\u0440\u0430\u0432\u0438\u043B\u0430\u043C\u0438 \u0441\u0430\u0439\u0442\u0430",
                          validation: "required",
                          "validation-messages": {
                            required: "\u0411\u0435\u0437 \u0441\u043E\u0433\u043B\u0430\u0441\u0438\u044F \u0441 \u043F\u0440\u0430\u0432\u0438\u043B\u0430\u043C\u0438 \u0441\u0430\u0439\u0442\u0430 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u0430"
                          }
                        }),
                        createVNode(ButtonRow, { class: "h-12" }, {
                          default: withCtx(() => [
                            createVNode(_sfc_main$1$1, {
                              class: "flex items-center justify-center grow bg-transparent border border-main text-main hover:text-white hover:bg-main hover:border-main group",
                              title: "\u0412\u043E\u0439\u0442\u0438",
                              onClick: switchRegistration
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" \u0410\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F ")
                              ]),
                              _: 1
                            }),
                            createVNode(_sfc_main$1$1, {
                              class: "flex items-center border border-second bg-second text-white hover:border-main hover:bg-main px-6",
                              title: "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F",
                              onClick: registrationClick
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" \u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F ")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    withDirectives(createVNode(_sfc_main$7, null, null, 512), [
                      [vShow, unref(loginForm).loading]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", {
                class: ["login-popup-container", unref(loginForm).show ? "show " : ""]
              }, [
                createVNode("div", {
                  class: ["login-popup", unref(loginForm).classList]
                }, [
                  createVNode(_sfc_main$d, {
                    title: "\u0410\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F",
                    class: "w-full bg-gray-200/60 pb-6 shadow-md",
                    onClose: hide
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_FormKit, {
                        id: "login_form",
                        type: "form",
                        "submit-label": "\u0412\u043E\u0439\u0442\u0438",
                        config: { validationVisibility: "submit" },
                        actions: false,
                        onSubmit: login
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_FormKit, {
                            type: "email",
                            id: "email",
                            name: "email",
                            label: "E-mail",
                            placeholder: "E-mail \u0430\u0434\u0440\u0435\u0441",
                            modelValue: unref(loginForm).email,
                            "onUpdate:modelValue": ($event) => unref(loginForm).email = $event,
                            validation: "required|email",
                            "validation-visibility": "submit",
                            "validation-messages": {
                              not_exists: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u0439 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
                              email: "\u0412\u0432\u0435\u0434\u0451\u043D\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442 \u043D\u0435 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0444\u043E\u0440\u043C\u0430\u0442\u0443 Email",
                              required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0430\u0448 email"
                            }
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          unref(loginForm).mode ? (openBlock(), createBlock(_component_FormKit, {
                            key: 0,
                            type: "text",
                            id: "confirm_code",
                            name: "confirm_code",
                            class: "confirm_code",
                            label: "\u041A\u043E\u0434",
                            placeholder: "\u041A\u043E\u0434 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F",
                            modelValue: unref(loginForm).code,
                            "onUpdate:modelValue": ($event) => unref(loginForm).code = $event,
                            validation: "required|length:8|contains_numeric",
                            "validation-visibility": "submit",
                            "validation-messages": {
                              code_not_exists: "\u0412\u0432\u0435\u0434\u0451\u043D \u043D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043A\u043E\u0434",
                              length: "\u0414\u043B\u0438\u043D\u0430 \u043A\u043E\u0434\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C 8 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                              required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0430\u0448 email",
                              contains_numeric: "\u041A\u043E\u0434 \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0446\u0438\u0444\u0440"
                            }
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                          createVNode(ButtonRow, { class: "h-12" }, {
                            default: withCtx(() => [
                              withDirectives(createVNode(_sfc_main$1$1, {
                                class: "flex items-center justify-center grow bg-transparent border border-main text-main hover:text-white hover:bg-main hover:border-main group disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-main-light-2 disabled:hover:text-main-light-2",
                                title: "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F",
                                onClick: switchRegistration
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" \u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F ")
                                ]),
                                _: 1
                              }, 512), [
                                [vShow, !unref(loginForm).mode]
                              ]),
                              createVNode(_sfc_main$1$1, {
                                class: "flex items-center border border-second bg-second text-white hover:border-main hover:bg-main px-6",
                                title: "\u0412\u043E\u0439\u0442\u0438",
                                onClick: loginClick
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(IconLogin), {
                                    class: "w-6 h-6 block text-white pr-1",
                                    filled: ""
                                  }),
                                  createTextVNode(" \u0412\u043E\u0439\u0442\u0438 ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      withDirectives(createVNode(_sfc_main$7, null, null, 512), [
                        [vShow, unref(loginForm).loading]
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(_sfc_main$d, {
                    title: "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F",
                    class: "w-full bg-gray-200/60 pb-6 shadow-md",
                    onClose: hide
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_FormKit, {
                        id: "registration_form",
                        type: "form",
                        "submit-label": "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F",
                        config: { validationVisibility: "submit" },
                        actions: false,
                        onSubmit: register
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_FormKit, {
                            type: "email",
                            name: "email",
                            id: "email",
                            label: "E-mail",
                            placeholder: "E-mail \u0430\u0434\u0440\u0435\u0441",
                            modelValue: unref(loginForm).regEmail,
                            "onUpdate:modelValue": ($event) => unref(loginForm).regEmail = $event,
                            validation: "required|email",
                            "validation-visibility": "submit",
                            "validation-messages": {
                              user_exists: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u0439 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
                              email: "\u0412\u0432\u0435\u0434\u0451\u043D\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442 \u043D\u0435 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0444\u043E\u0440\u043C\u0430\u0442\u0443 Email",
                              required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0430\u0448 email"
                            }
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode(_component_FormKit, {
                            type: "text",
                            name: "fio",
                            id: "fio",
                            label: "\u0424\u0418\u041E",
                            placeholder: "\u0424\u0418\u041E",
                            modelValue: unref(loginForm).regFIO,
                            "onUpdate:modelValue": ($event) => unref(loginForm).regFIO = $event,
                            validation: "required|length:5|contains_alpha_spaces",
                            "validation-visibility": "submit",
                            "validation-messages": {
                              length: "\u0414\u043B\u0438\u043D\u0430 \u0424\u0418\u041E \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                              required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0424\u0418\u041E",
                              contains_alpha_spaces: "\u0424\u0418\u041E \u043C\u043E\u0436\u0435\u0442 \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                            }
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          unref(loginForm).mode ? (openBlock(), createBlock(_component_FormKit, {
                            key: 0,
                            type: "text",
                            id: "code",
                            name: "confirm_code",
                            class: "confirm_code",
                            label: "\u041A\u043E\u0434",
                            placeholder: "\u041A\u043E\u0434 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F",
                            modelValue: unref(loginForm).regCode,
                            "onUpdate:modelValue": ($event) => unref(loginForm).regCode = $event,
                            validation: "required|length:8|contains_numeric",
                            "validation-visibility": "submit",
                            "validation-messages": {
                              code_not_exists: "\u0412\u0432\u0435\u0434\u0451\u043D \u043D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043A\u043E\u0434",
                              length: "\u0414\u043B\u0438\u043D\u0430 \u043A\u043E\u0434\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C 8 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                              required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0430\u0448 email",
                              contains_numeric: "\u041A\u043E\u0434 \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0446\u0438\u0444\u0440"
                            }
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                          createVNode(_component_FormKit, {
                            type: "checkbox",
                            name: "confirm",
                            id: "confirm",
                            checked: true,
                            label: "\u0421\u043E\u0433\u043B\u0430\u0441\u0435\u043D \u0441 \u043F\u0440\u0430\u0432\u0438\u043B\u0430\u043C\u0438 \u0441\u0430\u0439\u0442\u0430",
                            validation: "required",
                            "validation-messages": {
                              required: "\u0411\u0435\u0437 \u0441\u043E\u0433\u043B\u0430\u0441\u0438\u044F \u0441 \u043F\u0440\u0430\u0432\u0438\u043B\u0430\u043C\u0438 \u0441\u0430\u0439\u0442\u0430 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u0430"
                            }
                          }),
                          createVNode(ButtonRow, { class: "h-12" }, {
                            default: withCtx(() => [
                              createVNode(_sfc_main$1$1, {
                                class: "flex items-center justify-center grow bg-transparent border border-main text-main hover:text-white hover:bg-main hover:border-main group",
                                title: "\u0412\u043E\u0439\u0442\u0438",
                                onClick: switchRegistration
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" \u0410\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F ")
                                ]),
                                _: 1
                              }),
                              createVNode(_sfc_main$1$1, {
                                class: "flex items-center border border-second bg-second text-white hover:border-main hover:bg-main px-6",
                                title: "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F",
                                onClick: registrationClick
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" \u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      withDirectives(createVNode(_sfc_main$7, null, null, 512), [
                        [vShow, unref(loginForm).loading]
                      ])
                    ]),
                    _: 1
                  })
                ], 2)
              ], 2)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/LoginPopup.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const LoginPopup = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-26558e11"]]);
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "Header",
  __ssrInlineRender: true,
  setup(__props) {
    const loginPopup = ref();
    const loginBtn = ref();
    const loggedUser = ref(void 0);
    const showPopup = () => {
      loginPopup.value.show();
    };
    const hidePopup = () => {
      loginBtn.value.hidePopup();
    };
    useAuth();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><header class="flex flex-wrap md:flex-nowrap top-0 md:h-44 p-4 md:p-0 md:pt-[22px] bg-none md:bg-[url(&#39;/images/clouds.svg&#39;)] bg-repeat-x bg-left-top md:sticky z-30">`);
      _push(ssrRenderComponent(_sfc_main$c, {
        class: "md:h-20",
        href: "/"
      }, null, _parent));
      _push(ssrRenderComponent(Menu, { class: "md:h-20" }, null, _parent));
      _push(ssrRenderComponent(Login, {
        class: "md:h-20",
        onShowPopup: showPopup,
        ref_key: "loginBtn",
        ref: loginBtn,
        loggedUser: !!unref(loggedUser)
      }, null, _parent));
      _push(`</header>`);
      _push(ssrRenderComponent(LoginPopup, {
        onHidePopup: hidePopup,
        ref_key: "loginPopup",
        ref: loginPopup
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Header.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<footer${ssrRenderAttrs(mergeProps({ class: "bg-second" }, _attrs))} data-v-f2a8e041>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`<div class="relative" data-v-f2a8e041><div class="clouds" data-v-f2a8e041><div class="forest" data-v-f2a8e041></div></div></div><div class="footer" data-v-f2a8e041><div class="logo" data-v-f2a8e041><img${ssrRenderAttr("src", _imports_0$1)} alt="\u0410\u0413\u0410. \u0422\u0443\u0440-\u0446\u0435\u043D\u0442\u0440. \u041B\u043E\u0433\u043E\u0442\u0438\u043F" data-v-f2a8e041></div></div></footer>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Footer.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const Footer = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-f2a8e041"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "SearchBlock",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "search-block-container" }, _attrs))} data-v-06d05780><div class="search-block" data-v-06d05780><nav data-v-06d05780><a href="" class="selected" data-v-06d05780>\u041E\u0442\u0434\u044B\u0445</a><a href="" data-v-06d05780>\u0411\u0438\u0437\u043D\u0435\u0441</a></nav><div class="flex sm:gap-x-4 order-1 sm:order-2 w-full" data-v-06d05780><input type="text" data-v-06d05780>`);
      _push(ssrRenderComponent(_sfc_main$1$1, { class: "btn-main" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(IconSearch), { filled: "" }, null, _parent2, _scopeId));
            _push2(`<span data-v-06d05780${_scopeId}>\u041D\u0430\u0439\u0442\u0438</span>`);
          } else {
            return [
              createVNode(unref(IconSearch), { filled: "" }),
              createVNode("span", null, "\u041D\u0430\u0439\u0442\u0438")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/SearchBlock.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const SearchBlock = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-06d05780"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "TitlePicture",
  __ssrInlineRender: true,
  setup(__props) {
    const img = useImage();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative h-[200px] md:top-[-100px] md:h-[550px]" }, _attrs))} data-v-6c46818e><div class="relative h-[200px] md:h-[650px] overflow-x-hidden" data-v-6c46818e>`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        class: "relative h-[200px] lg:h-[630px] left-0 z-0 max-w-none",
        src: "/images/hills_and_sky.jpg",
        aspect: "42/9",
        format: "webp",
        quality: "85",
        sizes: "xs:1400 sm:2800 md:3733 lg:4667 xl:5880",
        loading: "lazy",
        placeholder: unref(img)(`/images/hills_and_sky.jpg`, { fit: "contain", format: "webp", height: 50, blur: 3, quality: 50 })
      }, null, _parent));
      _push(`<div class="title-footer" data-v-6c46818e></div>`);
      _push(ssrRenderComponent(SearchBlock, null, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/TitlePicture.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const TitlePicture = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-6c46818e"]]);
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "logos-list" }, _attrs))} data-v-cbd0a397></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/LogosList.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const LogosList = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-cbd0a397"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtPage = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$5, null, null, _parent));
      _push(ssrRenderComponent(TitlePicture, null, null, _parent));
      _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
      _push(ssrRenderComponent(Footer, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(LogosList, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(LogosList)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
