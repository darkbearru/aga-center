import { useSSRContext, defineComponent, mergeProps, unref, ref, withCtx, createVNode, isRef, openBlock, createBlock, createCommentVNode, withModifiers, computed, createTextVNode, watch } from 'vue';
import { u as useHead } from './index-6a088328.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { F as FormKitLazyProvider, f as formkitComponent } from '../server.mjs';
import { u as useData } from './useData-2a2ed08f.mjs';
import IconEdit from './icon-edit-f7118c55.mjs';
import IconTrash from './icon-trash-be4099c2.mjs';
import IconActive from './icon-checkbox-59e7ef3d.mjs';
import IconNotActive from './icon-square-c2373fe7.mjs';
import { _ as _sfc_main$1$1, a as _sfc_main$c } from './Popup-4c827385.mjs';
import IconUserPlus from './icon-user-plus-45aea0a3.mjs';
import { P as PopupContainer } from './PopupContainer-4e6a6b1d.mjs';
import { setErrors } from '@formkit/core';
import { s as slugify } from './slugify-8c64b03f.mjs';
import { C as ContactsType, a as ContactsTypeNames } from './company-75c1faec.mjs';
import IconPlus from './icon-plus-7cf58b44.mjs';
import { u as useAuth } from './useAuth-3eb17c57.mjs';
import { _ as _sfc_main$d } from './PhotosList-fd705cb9.mjs';
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
import 'speakingurl';
import './nuxt-img-8eb61343.mjs';
import './icon-restore-25d99875.mjs';

const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "NewsListItem",
  __ssrInlineRender: true,
  props: {
    item: Object
  },
  emits: ["click", "delete"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center px-4 py-3 bg-dark-light/10 odd:bg-white hover:bg-dark-light/20 cursor-pointer rounded" }, _attrs))}><div class="flex items-center w-6/12">`);
      if (__props.item.active) {
        _push(ssrRenderComponent(unref(IconActive), {
          class: "w-5 h-5 mr-1",
          filled: ""
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(IconNotActive), {
          class: "w-5 h-5 mr-1",
          filled: ""
        }, null, _parent));
      }
      _push(` ${ssrInterpolate(__props.item.title)}</div><div class="w-4/12">/news/${ssrInterpolate(__props.item.slug)}</div><div class="w-2/12 flex items-center justify-end"><a href="" class="block w-5 h-5 mx-1 text-dark-main hover:text-main">`);
      _push(ssrRenderComponent(unref(IconEdit), { filled: "" }, null, _parent));
      _push(`</a><a href="" class="block w-5 h-5 mx-1 text-dark-main hover:text-main">`);
      _push(ssrRenderComponent(unref(IconTrash), { filled: "" }, null, _parent));
      _push(`</a></div></div>`);
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/admin/news/NewsListItem.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "NewsList",
  __ssrInlineRender: true,
  emits: ["click", "delete"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const data = useData();
    const newsList = ref(data.news);
    const emit = __emit;
    const onClick = (item) => {
      emit("click", item);
    };
    const onDelete = (item) => {
      emit("delete", item);
    };
    const update = () => {
      newsList.value = data.news;
    };
    __expose({ update });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      ssrRenderList(unref(newsList), (item) => {
        _push(ssrRenderComponent(_sfc_main$b, {
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
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/admin/news/NewsList.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "News",
  __ssrInlineRender: true,
  setup(__props) {
    const titlePopup = ref("\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043D\u043E\u0432\u043E\u0441\u0442\u044C");
    const popup = ref();
    const inputTitle = ref("");
    const inputSlug = ref("");
    const inputText = ref("");
    const inputDate = ref("");
    const inputActive = ref(false);
    const inputId = ref(void 0);
    const userData = useData();
    const newsList = ref();
    const popupOpen = (item) => {
      titlePopup.value = "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043D\u043E\u0432\u043E\u0441\u0442\u044C";
      if (item == null ? void 0 : item.id) {
        titlePopup.value = "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u043D\u043E\u0432\u043E\u0441\u0442\u0438";
        inputTitle.value = (item == null ? void 0 : item.title) || "";
        inputSlug.value = (item == null ? void 0 : item.slug) || "";
        inputText.value = (item == null ? void 0 : item.text) || "";
        inputDate.value = (item == null ? void 0 : item.date.toString()) || "";
        inputActive.value = (item == null ? void 0 : item.active) || false;
        inputId.value = (item == null ? void 0 : item.id) || void 0;
      }
      popup.value.show();
    };
    const popupClose = () => {
      popup.value.hide();
      inputTitle.value = "";
      inputSlug.value = "";
      inputText.value = "";
      inputDate.value = "";
      inputActive.value = false;
      inputId.value = void 0;
    };
    const popupSubmit = async () => {
      userData.updateNews({
        id: inputId.value || void 0,
        title: inputTitle.value,
        slug: inputSlug.value,
        active: inputActive.value,
        text: inputText.value || null,
        date: new Date(inputDate.value)
      }).then((result) => {
        if (result) {
          if (result == null ? void 0 : result.errors)
            return setErrors("news_form", [], result.errors);
          newsList.value.update();
          popupClose();
        }
      }).catch((error) => {
        console.log(error);
      });
    };
    const deleteNews = async (news) => {
      await userData.deleteNews(news).then(() => newsList.value.update());
    };
    const createSlug = () => {
      inputSlug.value = slugify(inputTitle.value, 50);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormKit = formkitComponent;
      _push(ssrRenderComponent(unref(FormKitLazyProvider), mergeProps({ "config-file": "true" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-12/12 min-w-[300px]"${_scopeId}><div class="w-full text-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$1$1, {
              class: "inline-flex items-center bg-main text-white hover:bg-main-light py-3 px-6 w-auto mx-auto mb-8",
              title: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043D\u043E\u0432\u043E\u0441\u0442\u044C",
              onClick: popupOpen
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(IconUserPlus), {
                    class: "block text-white w-6 h-6 mr-2",
                    filled: ""
                  }, null, _parent3, _scopeId2));
                  _push3(`<span class="hidden md:inline"${_scopeId2}>\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043D\u043E\u0432\u043E\u0441\u0442\u0438</span>`);
                } else {
                  return [
                    createVNode(unref(IconUserPlus), {
                      class: "block text-white w-6 h-6 mr-2",
                      filled: ""
                    }),
                    createVNode("span", { class: "hidden md:inline" }, "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043D\u043E\u0432\u043E\u0441\u0442\u0438")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_sfc_main$a, {
              onClick: popupOpen,
              onDelete: deleteNews,
              ref_key: "newsList",
              ref: newsList
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(PopupContainer, {
              ref_key: "popup",
              ref: popup,
              onClose: popupClose
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$c, {
                    class: "bg-gray-light/60 w-full min-w-[300px] max-w-[800px] max-h-full pb-0",
                    title: unref(titlePopup),
                    onClose: popupClose
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_FormKit, {
                          id: "news_form",
                          type: "form",
                          "submit-label": unref(inputId) ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" : "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
                          config: { validationVisibility: "submit" },
                          onSubmit: popupSubmit
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_FormKit, {
                                type: "text",
                                name: "name",
                                id: "name",
                                label: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A",
                                placeholder: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043D\u043E\u0432\u043E\u0441\u0442\u0438",
                                modelValue: unref(inputTitle),
                                "onUpdate:modelValue": ($event) => isRef(inputTitle) ? inputTitle.value = $event : null,
                                onKeyup: createSlug,
                                validation: "required|length:8",
                                "validation-visibility": "live",
                                "validation-messages": {
                                  news_exists: "\u041D\u043E\u0432\u043E\u0441\u0442\u044C \u0441 \u0434\u0430\u043D\u043D\u044B\u043C \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u043E\u043C \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
                                  length: "\u0414\u043B\u0438\u043D\u0430 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 8 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                  required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043D\u043E\u0432\u043E\u0441\u0442\u0438",
                                  name: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                                }
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_FormKit, {
                                type: "text",
                                name: "slug",
                                id: "slug",
                                label: "\u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440",
                                placeholder: "name_url_slug",
                                modelValue: unref(inputSlug),
                                "onUpdate:modelValue": ($event) => isRef(inputSlug) ? inputSlug.value = $event : null,
                                validation: "required|length:3|matches:/[0-9a-z_]/",
                                "validation-visibility": "live",
                                "validation-messages": {
                                  length: "\u0414\u043B\u0438\u043D\u0430 \u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                  required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440",
                                  matches: "\u0412 \u043D\u0430\u043F\u0438\u0441\u0430\u043D\u0438\u0438 \u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440\u0430 \u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0435 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432 \u0430\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u043E\u0433\u043E \u0430\u043B\u0444\u0430\u0432\u0438\u0442\u0430 \u0438 \u043D\u0438\u0436\u043D\u0435\u0433\u043E \u043F\u043E\u0434\u0447\u0435\u0440\u043A\u0438\u0432\u0430\u043D\u0438\u044F"
                                }
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_FormKit, {
                                type: "textarea",
                                name: "text",
                                id: "text",
                                label: "\u0422\u0435\u043A\u0441\u0442",
                                placeholder: "\u0422\u0435\u043A\u0441\u0442 \u043D\u043E\u0432\u043E\u0441\u0442\u0438",
                                modelValue: unref(inputText),
                                "onUpdate:modelValue": ($event) => isRef(inputText) ? inputText.value = $event : null,
                                validation: "required|length:15",
                                "validation-visibility": "live",
                                "validation-messages": {
                                  length: "\u0414\u043B\u0438\u043D\u0430 \u0442\u0435\u043A\u0441\u0442\u0430 \u043D\u043E\u0432\u043E\u0441\u0442\u0438 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 15 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                  required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0442\u0435\u043A\u0441\u0442 \u043D\u043E\u0432\u043E\u0441\u0442\u0438"
                                }
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_FormKit, {
                                type: "date",
                                label: "\u0414\u0430\u0442\u0430",
                                modelValue: unref(inputDate),
                                "onUpdate:modelValue": ($event) => isRef(inputDate) ? inputDate.value = $event : null,
                                validation: "required|date_after:2023-10-01",
                                "validation-visibility": "live",
                                "validation-messages": {
                                  required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0434\u0430\u0442\u0443 \u0432\u044B\u0445\u043E\u0434\u0430 \u043D\u043E\u0432\u043E\u0441\u0442\u0438",
                                  date_after: "\u0414\u0430\u0442\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u0440\u0430\u043D\u044C\u0448\u0435 01 \u043E\u043A\u0442\u044F\u0431\u0440\u044F 2023"
                                }
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_FormKit, {
                                type: "checkbox",
                                name: "isActive",
                                id: "isActive",
                                label: "\u041E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043D\u043E\u0432\u043E\u0441\u0442\u0438 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435",
                                modelValue: unref(inputActive),
                                "onUpdate:modelValue": ($event) => isRef(inputActive) ? inputActive.value = $event : null
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_FormKit, {
                                  type: "text",
                                  name: "name",
                                  id: "name",
                                  label: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A",
                                  placeholder: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043D\u043E\u0432\u043E\u0441\u0442\u0438",
                                  modelValue: unref(inputTitle),
                                  "onUpdate:modelValue": ($event) => isRef(inputTitle) ? inputTitle.value = $event : null,
                                  onKeyup: createSlug,
                                  validation: "required|length:8",
                                  "validation-visibility": "live",
                                  "validation-messages": {
                                    news_exists: "\u041D\u043E\u0432\u043E\u0441\u0442\u044C \u0441 \u0434\u0430\u043D\u043D\u044B\u043C \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u043E\u043C \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
                                    length: "\u0414\u043B\u0438\u043D\u0430 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 8 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                    required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043D\u043E\u0432\u043E\u0441\u0442\u0438",
                                    name: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                                  }
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode(_component_FormKit, {
                                  type: "text",
                                  name: "slug",
                                  id: "slug",
                                  label: "\u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440",
                                  placeholder: "name_url_slug",
                                  modelValue: unref(inputSlug),
                                  "onUpdate:modelValue": ($event) => isRef(inputSlug) ? inputSlug.value = $event : null,
                                  validation: "required|length:3|matches:/[0-9a-z_]/",
                                  "validation-visibility": "live",
                                  "validation-messages": {
                                    length: "\u0414\u043B\u0438\u043D\u0430 \u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                    required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440",
                                    matches: "\u0412 \u043D\u0430\u043F\u0438\u0441\u0430\u043D\u0438\u0438 \u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440\u0430 \u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0435 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432 \u0430\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u043E\u0433\u043E \u0430\u043B\u0444\u0430\u0432\u0438\u0442\u0430 \u0438 \u043D\u0438\u0436\u043D\u0435\u0433\u043E \u043F\u043E\u0434\u0447\u0435\u0440\u043A\u0438\u0432\u0430\u043D\u0438\u044F"
                                  }
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode(_component_FormKit, {
                                  type: "textarea",
                                  name: "text",
                                  id: "text",
                                  label: "\u0422\u0435\u043A\u0441\u0442",
                                  placeholder: "\u0422\u0435\u043A\u0441\u0442 \u043D\u043E\u0432\u043E\u0441\u0442\u0438",
                                  modelValue: unref(inputText),
                                  "onUpdate:modelValue": ($event) => isRef(inputText) ? inputText.value = $event : null,
                                  validation: "required|length:15",
                                  "validation-visibility": "live",
                                  "validation-messages": {
                                    length: "\u0414\u043B\u0438\u043D\u0430 \u0442\u0435\u043A\u0441\u0442\u0430 \u043D\u043E\u0432\u043E\u0441\u0442\u0438 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 15 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                    required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0442\u0435\u043A\u0441\u0442 \u043D\u043E\u0432\u043E\u0441\u0442\u0438"
                                  }
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode(_component_FormKit, {
                                  type: "date",
                                  label: "\u0414\u0430\u0442\u0430",
                                  modelValue: unref(inputDate),
                                  "onUpdate:modelValue": ($event) => isRef(inputDate) ? inputDate.value = $event : null,
                                  validation: "required|date_after:2023-10-01",
                                  "validation-visibility": "live",
                                  "validation-messages": {
                                    required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0434\u0430\u0442\u0443 \u0432\u044B\u0445\u043E\u0434\u0430 \u043D\u043E\u0432\u043E\u0441\u0442\u0438",
                                    date_after: "\u0414\u0430\u0442\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u0440\u0430\u043D\u044C\u0448\u0435 01 \u043E\u043A\u0442\u044F\u0431\u0440\u044F 2023"
                                  }
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode(_component_FormKit, {
                                  type: "checkbox",
                                  name: "isActive",
                                  id: "isActive",
                                  label: "\u041E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043D\u043E\u0432\u043E\u0441\u0442\u0438 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435",
                                  modelValue: unref(inputActive),
                                  "onUpdate:modelValue": ($event) => isRef(inputActive) ? inputActive.value = $event : null
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_FormKit, {
                            id: "news_form",
                            type: "form",
                            "submit-label": unref(inputId) ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" : "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
                            config: { validationVisibility: "submit" },
                            onSubmit: popupSubmit
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_FormKit, {
                                type: "text",
                                name: "name",
                                id: "name",
                                label: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A",
                                placeholder: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043D\u043E\u0432\u043E\u0441\u0442\u0438",
                                modelValue: unref(inputTitle),
                                "onUpdate:modelValue": ($event) => isRef(inputTitle) ? inputTitle.value = $event : null,
                                onKeyup: createSlug,
                                validation: "required|length:8",
                                "validation-visibility": "live",
                                "validation-messages": {
                                  news_exists: "\u041D\u043E\u0432\u043E\u0441\u0442\u044C \u0441 \u0434\u0430\u043D\u043D\u044B\u043C \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u043E\u043C \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
                                  length: "\u0414\u043B\u0438\u043D\u0430 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 8 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                  required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043D\u043E\u0432\u043E\u0441\u0442\u0438",
                                  name: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                                }
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode(_component_FormKit, {
                                type: "text",
                                name: "slug",
                                id: "slug",
                                label: "\u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440",
                                placeholder: "name_url_slug",
                                modelValue: unref(inputSlug),
                                "onUpdate:modelValue": ($event) => isRef(inputSlug) ? inputSlug.value = $event : null,
                                validation: "required|length:3|matches:/[0-9a-z_]/",
                                "validation-visibility": "live",
                                "validation-messages": {
                                  length: "\u0414\u043B\u0438\u043D\u0430 \u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                  required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440",
                                  matches: "\u0412 \u043D\u0430\u043F\u0438\u0441\u0430\u043D\u0438\u0438 \u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440\u0430 \u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0435 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432 \u0430\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u043E\u0433\u043E \u0430\u043B\u0444\u0430\u0432\u0438\u0442\u0430 \u0438 \u043D\u0438\u0436\u043D\u0435\u0433\u043E \u043F\u043E\u0434\u0447\u0435\u0440\u043A\u0438\u0432\u0430\u043D\u0438\u044F"
                                }
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode(_component_FormKit, {
                                type: "textarea",
                                name: "text",
                                id: "text",
                                label: "\u0422\u0435\u043A\u0441\u0442",
                                placeholder: "\u0422\u0435\u043A\u0441\u0442 \u043D\u043E\u0432\u043E\u0441\u0442\u0438",
                                modelValue: unref(inputText),
                                "onUpdate:modelValue": ($event) => isRef(inputText) ? inputText.value = $event : null,
                                validation: "required|length:15",
                                "validation-visibility": "live",
                                "validation-messages": {
                                  length: "\u0414\u043B\u0438\u043D\u0430 \u0442\u0435\u043A\u0441\u0442\u0430 \u043D\u043E\u0432\u043E\u0441\u0442\u0438 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 15 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                  required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0442\u0435\u043A\u0441\u0442 \u043D\u043E\u0432\u043E\u0441\u0442\u0438"
                                }
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode(_component_FormKit, {
                                type: "date",
                                label: "\u0414\u0430\u0442\u0430",
                                modelValue: unref(inputDate),
                                "onUpdate:modelValue": ($event) => isRef(inputDate) ? inputDate.value = $event : null,
                                validation: "required|date_after:2023-10-01",
                                "validation-visibility": "live",
                                "validation-messages": {
                                  required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0434\u0430\u0442\u0443 \u0432\u044B\u0445\u043E\u0434\u0430 \u043D\u043E\u0432\u043E\u0441\u0442\u0438",
                                  date_after: "\u0414\u0430\u0442\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u0440\u0430\u043D\u044C\u0448\u0435 01 \u043E\u043A\u0442\u044F\u0431\u0440\u044F 2023"
                                }
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode(_component_FormKit, {
                                type: "checkbox",
                                name: "isActive",
                                id: "isActive",
                                label: "\u041E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043D\u043E\u0432\u043E\u0441\u0442\u0438 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435",
                                modelValue: unref(inputActive),
                                "onUpdate:modelValue": ($event) => isRef(inputActive) ? inputActive.value = $event : null
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
                    createVNode(_sfc_main$c, {
                      class: "bg-gray-light/60 w-full min-w-[300px] max-w-[800px] max-h-full pb-0",
                      title: unref(titlePopup),
                      onClose: popupClose
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_FormKit, {
                          id: "news_form",
                          type: "form",
                          "submit-label": unref(inputId) ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" : "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
                          config: { validationVisibility: "submit" },
                          onSubmit: popupSubmit
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_FormKit, {
                              type: "text",
                              name: "name",
                              id: "name",
                              label: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A",
                              placeholder: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043D\u043E\u0432\u043E\u0441\u0442\u0438",
                              modelValue: unref(inputTitle),
                              "onUpdate:modelValue": ($event) => isRef(inputTitle) ? inputTitle.value = $event : null,
                              onKeyup: createSlug,
                              validation: "required|length:8",
                              "validation-visibility": "live",
                              "validation-messages": {
                                news_exists: "\u041D\u043E\u0432\u043E\u0441\u0442\u044C \u0441 \u0434\u0430\u043D\u043D\u044B\u043C \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u043E\u043C \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
                                length: "\u0414\u043B\u0438\u043D\u0430 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 8 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043D\u043E\u0432\u043E\u0441\u0442\u0438",
                                name: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                              }
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode(_component_FormKit, {
                              type: "text",
                              name: "slug",
                              id: "slug",
                              label: "\u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440",
                              placeholder: "name_url_slug",
                              modelValue: unref(inputSlug),
                              "onUpdate:modelValue": ($event) => isRef(inputSlug) ? inputSlug.value = $event : null,
                              validation: "required|length:3|matches:/[0-9a-z_]/",
                              "validation-visibility": "live",
                              "validation-messages": {
                                length: "\u0414\u043B\u0438\u043D\u0430 \u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440",
                                matches: "\u0412 \u043D\u0430\u043F\u0438\u0441\u0430\u043D\u0438\u0438 \u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440\u0430 \u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0435 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432 \u0430\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u043E\u0433\u043E \u0430\u043B\u0444\u0430\u0432\u0438\u0442\u0430 \u0438 \u043D\u0438\u0436\u043D\u0435\u0433\u043E \u043F\u043E\u0434\u0447\u0435\u0440\u043A\u0438\u0432\u0430\u043D\u0438\u044F"
                              }
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode(_component_FormKit, {
                              type: "textarea",
                              name: "text",
                              id: "text",
                              label: "\u0422\u0435\u043A\u0441\u0442",
                              placeholder: "\u0422\u0435\u043A\u0441\u0442 \u043D\u043E\u0432\u043E\u0441\u0442\u0438",
                              modelValue: unref(inputText),
                              "onUpdate:modelValue": ($event) => isRef(inputText) ? inputText.value = $event : null,
                              validation: "required|length:15",
                              "validation-visibility": "live",
                              "validation-messages": {
                                length: "\u0414\u043B\u0438\u043D\u0430 \u0442\u0435\u043A\u0441\u0442\u0430 \u043D\u043E\u0432\u043E\u0441\u0442\u0438 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 15 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0442\u0435\u043A\u0441\u0442 \u043D\u043E\u0432\u043E\u0441\u0442\u0438"
                              }
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode(_component_FormKit, {
                              type: "date",
                              label: "\u0414\u0430\u0442\u0430",
                              modelValue: unref(inputDate),
                              "onUpdate:modelValue": ($event) => isRef(inputDate) ? inputDate.value = $event : null,
                              validation: "required|date_after:2023-10-01",
                              "validation-visibility": "live",
                              "validation-messages": {
                                required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0434\u0430\u0442\u0443 \u0432\u044B\u0445\u043E\u0434\u0430 \u043D\u043E\u0432\u043E\u0441\u0442\u0438",
                                date_after: "\u0414\u0430\u0442\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u0440\u0430\u043D\u044C\u0448\u0435 01 \u043E\u043A\u0442\u044F\u0431\u0440\u044F 2023"
                              }
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode(_component_FormKit, {
                              type: "checkbox",
                              name: "isActive",
                              id: "isActive",
                              label: "\u041E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043D\u043E\u0432\u043E\u0441\u0442\u0438 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435",
                              modelValue: unref(inputActive),
                              "onUpdate:modelValue": ($event) => isRef(inputActive) ? inputActive.value = $event : null
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
              createVNode("div", { class: "w-12/12 min-w-[300px]" }, [
                createVNode("div", { class: "w-full text-center" }, [
                  createVNode(_sfc_main$1$1, {
                    class: "inline-flex items-center bg-main text-white hover:bg-main-light py-3 px-6 w-auto mx-auto mb-8",
                    title: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043D\u043E\u0432\u043E\u0441\u0442\u044C",
                    onClick: popupOpen
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(IconUserPlus), {
                        class: "block text-white w-6 h-6 mr-2",
                        filled: ""
                      }),
                      createVNode("span", { class: "hidden md:inline" }, "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043D\u043E\u0432\u043E\u0441\u0442\u0438")
                    ]),
                    _: 1
                  })
                ]),
                createVNode(_sfc_main$a, {
                  onClick: popupOpen,
                  onDelete: deleteNews,
                  ref_key: "newsList",
                  ref: newsList
                }, null, 512),
                createVNode(PopupContainer, {
                  ref_key: "popup",
                  ref: popup,
                  onClose: popupClose
                }, {
                  default: withCtx(() => [
                    createVNode(_sfc_main$c, {
                      class: "bg-gray-light/60 w-full min-w-[300px] max-w-[800px] max-h-full pb-0",
                      title: unref(titlePopup),
                      onClose: popupClose
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_FormKit, {
                          id: "news_form",
                          type: "form",
                          "submit-label": unref(inputId) ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" : "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
                          config: { validationVisibility: "submit" },
                          onSubmit: popupSubmit
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_FormKit, {
                              type: "text",
                              name: "name",
                              id: "name",
                              label: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A",
                              placeholder: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043D\u043E\u0432\u043E\u0441\u0442\u0438",
                              modelValue: unref(inputTitle),
                              "onUpdate:modelValue": ($event) => isRef(inputTitle) ? inputTitle.value = $event : null,
                              onKeyup: createSlug,
                              validation: "required|length:8",
                              "validation-visibility": "live",
                              "validation-messages": {
                                news_exists: "\u041D\u043E\u0432\u043E\u0441\u0442\u044C \u0441 \u0434\u0430\u043D\u043D\u044B\u043C \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u043E\u043C \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
                                length: "\u0414\u043B\u0438\u043D\u0430 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 8 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043D\u043E\u0432\u043E\u0441\u0442\u0438",
                                name: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                              }
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode(_component_FormKit, {
                              type: "text",
                              name: "slug",
                              id: "slug",
                              label: "\u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440",
                              placeholder: "name_url_slug",
                              modelValue: unref(inputSlug),
                              "onUpdate:modelValue": ($event) => isRef(inputSlug) ? inputSlug.value = $event : null,
                              validation: "required|length:3|matches:/[0-9a-z_]/",
                              "validation-visibility": "live",
                              "validation-messages": {
                                length: "\u0414\u043B\u0438\u043D\u0430 \u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440",
                                matches: "\u0412 \u043D\u0430\u043F\u0438\u0441\u0430\u043D\u0438\u0438 \u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440\u0430 \u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0435 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432 \u0430\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u043E\u0433\u043E \u0430\u043B\u0444\u0430\u0432\u0438\u0442\u0430 \u0438 \u043D\u0438\u0436\u043D\u0435\u0433\u043E \u043F\u043E\u0434\u0447\u0435\u0440\u043A\u0438\u0432\u0430\u043D\u0438\u044F"
                              }
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode(_component_FormKit, {
                              type: "textarea",
                              name: "text",
                              id: "text",
                              label: "\u0422\u0435\u043A\u0441\u0442",
                              placeholder: "\u0422\u0435\u043A\u0441\u0442 \u043D\u043E\u0432\u043E\u0441\u0442\u0438",
                              modelValue: unref(inputText),
                              "onUpdate:modelValue": ($event) => isRef(inputText) ? inputText.value = $event : null,
                              validation: "required|length:15",
                              "validation-visibility": "live",
                              "validation-messages": {
                                length: "\u0414\u043B\u0438\u043D\u0430 \u0442\u0435\u043A\u0441\u0442\u0430 \u043D\u043E\u0432\u043E\u0441\u0442\u0438 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 15 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0442\u0435\u043A\u0441\u0442 \u043D\u043E\u0432\u043E\u0441\u0442\u0438"
                              }
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode(_component_FormKit, {
                              type: "date",
                              label: "\u0414\u0430\u0442\u0430",
                              modelValue: unref(inputDate),
                              "onUpdate:modelValue": ($event) => isRef(inputDate) ? inputDate.value = $event : null,
                              validation: "required|date_after:2023-10-01",
                              "validation-visibility": "live",
                              "validation-messages": {
                                required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0434\u0430\u0442\u0443 \u0432\u044B\u0445\u043E\u0434\u0430 \u043D\u043E\u0432\u043E\u0441\u0442\u0438",
                                date_after: "\u0414\u0430\u0442\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u0440\u0430\u043D\u044C\u0448\u0435 01 \u043E\u043A\u0442\u044F\u0431\u0440\u044F 2023"
                              }
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode(_component_FormKit, {
                              type: "checkbox",
                              name: "isActive",
                              id: "isActive",
                              label: "\u041E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043D\u043E\u0432\u043E\u0441\u0442\u0438 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435",
                              modelValue: unref(inputActive),
                              "onUpdate:modelValue": ($event) => isRef(inputActive) ? inputActive.value = $event : null
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
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/admin/News.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "ContactsListItem",
  __ssrInlineRender: true,
  props: {
    item: Object,
    options: Array,
    index: Number,
    indexLast: Boolean
  },
  emits: ["add", "delete", "update"],
  setup(__props, { emit: __emit }) {
    var _a;
    const props = __props;
    const emit = __emit;
    const item = props.item;
    const type = ref(item.type);
    const typeIndex = ref(ContactsType[item.type]);
    const itemValue = ref(item.value);
    (_a = props.options) == null ? void 0 : _a.forEach((item2) => {
      if (type.value === item2.value) {
        item2.attr.default = true;
      }
    });
    function checkType() {
      const result = getContactsIndex(type.value);
      if (result)
        typeIndex.value = result;
      itemValue.value = "";
      update();
    }
    function getContactsIndex(value) {
      return Object.keys(ContactsTypeNames).find((key) => key === value);
    }
    function addItem() {
      emit("add", props.item);
    }
    function deleteItem() {
      emit("delete", props.index);
    }
    function update() {
      let val = unref(itemValue);
      if (!val)
        return;
      const item2 = {
        type: type.value,
        value: val
      };
      emit("update", item2, props.index);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormKit = formkitComponent;
      _push(ssrRenderComponent(unref(FormKitLazyProvider), mergeProps({ "config-file": "true" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex gap-2"${_scopeId}><div${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormKit, {
              type: "select",
              options: __props.options,
              modelValue: unref(type),
              "onUpdate:modelValue": ($event) => isRef(type) ? type.value = $event : null,
              default: unref(type),
              onChange: checkType
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="grow"${_scopeId}>`);
            if (unref(typeIndex) === "phone") {
              _push2(ssrRenderComponent(_component_FormKit, {
                type: "mask",
                name: "phone",
                mask: "+7 (###) ###-##-##",
                modelValue: unref(itemValue),
                "onUpdate:modelValue": ($event) => isRef(itemValue) ? itemValue.value = $event : null,
                autocomplete: "off",
                onKeyup: update
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(typeIndex) === "email") {
              _push2(ssrRenderComponent(_component_FormKit, {
                type: "email",
                name: "email",
                placeholder: "your@email.ru",
                modelValue: unref(itemValue),
                "onUpdate:modelValue": ($event) => isRef(itemValue) ? itemValue.value = $event : null,
                autocomplete: "off",
                onKeyup: update
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(typeIndex) === "vk") {
              _push2(ssrRenderComponent(_component_FormKit, {
                type: "mask",
                name: "vk",
                mask: "vk.com/##########",
                modelValue: unref(itemValue),
                "onUpdate:modelValue": ($event) => isRef(itemValue) ? itemValue.value = $event : null,
                autocomplete: "off",
                onKeyup: update
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(typeIndex) === "instagram") {
              _push2(ssrRenderComponent(_component_FormKit, {
                type: "mask",
                name: "instagram",
                mask: "instagram.com/##########",
                modelValue: unref(itemValue),
                "onUpdate:modelValue": ($event) => isRef(itemValue) ? itemValue.value = $event : null,
                autocomplete: "off",
                onKeyup: update
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(typeIndex) === "ok") {
              _push2(ssrRenderComponent(_component_FormKit, {
                type: "mask",
                name: "ok",
                mask: "ok.ru/##########",
                modelValue: unref(itemValue),
                "onUpdate:modelValue": ($event) => isRef(itemValue) ? itemValue.value = $event : null,
                autocomplete: "off",
                onKeyup: update
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex items-stretch"${_scopeId}>`);
            if (__props.indexLast) {
              _push2(ssrRenderComponent(_sfc_main$1$1, {
                class: "inline-flex items-center bg-second text-white hover:bg-main-light py-2 px-6",
                onClick: addItem
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(IconPlus), {
                      filled: "",
                      class: "w-5 h-5"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(IconPlus), {
                        filled: "",
                        class: "w-5 h-5"
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(_sfc_main$1$1, {
                class: "inline-flex items-center bg-gray-light text-white hover:bg-red-600 py-2 px-6",
                onClick: deleteItem
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(IconTrash), {
                      filled: "",
                      class: "w-5 h-5"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(IconTrash), {
                        filled: "",
                        class: "w-5 h-5"
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex gap-2" }, [
                createVNode("div", null, [
                  createVNode(_component_FormKit, {
                    type: "select",
                    options: __props.options,
                    modelValue: unref(type),
                    "onUpdate:modelValue": ($event) => isRef(type) ? type.value = $event : null,
                    default: unref(type),
                    onChange: checkType
                  }, null, 8, ["options", "modelValue", "onUpdate:modelValue", "default"])
                ]),
                createVNode("div", { class: "grow" }, [
                  unref(typeIndex) === "phone" ? (openBlock(), createBlock(_component_FormKit, {
                    key: 0,
                    type: "mask",
                    name: "phone",
                    mask: "+7 (###) ###-##-##",
                    modelValue: unref(itemValue),
                    "onUpdate:modelValue": ($event) => isRef(itemValue) ? itemValue.value = $event : null,
                    autocomplete: "off",
                    onKeyup: update
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                  unref(typeIndex) === "email" ? (openBlock(), createBlock(_component_FormKit, {
                    key: 1,
                    type: "email",
                    name: "email",
                    placeholder: "your@email.ru",
                    modelValue: unref(itemValue),
                    "onUpdate:modelValue": ($event) => isRef(itemValue) ? itemValue.value = $event : null,
                    autocomplete: "off",
                    onKeyup: update
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                  unref(typeIndex) === "vk" ? (openBlock(), createBlock(_component_FormKit, {
                    key: 2,
                    type: "mask",
                    name: "vk",
                    mask: "vk.com/##########",
                    modelValue: unref(itemValue),
                    "onUpdate:modelValue": ($event) => isRef(itemValue) ? itemValue.value = $event : null,
                    autocomplete: "off",
                    onKeyup: update
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                  unref(typeIndex) === "instagram" ? (openBlock(), createBlock(_component_FormKit, {
                    key: 3,
                    type: "mask",
                    name: "instagram",
                    mask: "instagram.com/##########",
                    modelValue: unref(itemValue),
                    "onUpdate:modelValue": ($event) => isRef(itemValue) ? itemValue.value = $event : null,
                    autocomplete: "off",
                    onKeyup: update
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                  unref(typeIndex) === "ok" ? (openBlock(), createBlock(_component_FormKit, {
                    key: 4,
                    type: "mask",
                    name: "ok",
                    mask: "ok.ru/##########",
                    modelValue: unref(itemValue),
                    "onUpdate:modelValue": ($event) => isRef(itemValue) ? itemValue.value = $event : null,
                    autocomplete: "off",
                    onKeyup: update
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "flex items-stretch" }, [
                  __props.indexLast ? (openBlock(), createBlock(_sfc_main$1$1, {
                    key: 0,
                    class: "inline-flex items-center bg-second text-white hover:bg-main-light py-2 px-6",
                    onClick: withModifiers(addItem, ["prevent"])
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(IconPlus), {
                        filled: "",
                        class: "w-5 h-5"
                      })
                    ]),
                    _: 1
                  }, 8, ["onClick"])) : (openBlock(), createBlock(_sfc_main$1$1, {
                    key: 1,
                    class: "inline-flex items-center bg-gray-light text-white hover:bg-red-600 py-2 px-6",
                    onClick: withModifiers(deleteItem, ["prevent"])
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(IconTrash), {
                        filled: "",
                        class: "w-5 h-5"
                      })
                    ]),
                    _: 1
                  }, 8, ["onClick"]))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/admin/companies/ContactsListItem.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "ContactsList",
  __ssrInlineRender: true,
  props: {
    contacts: Object
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    __expose({ getContacts, update });
    const contactsList = ref([]);
    if (typeof props.contacts !== "undefined") {
      update(props.contacts);
    }
    const contactsListLength = computed(() => contactsList.value.length - 1);
    const contacts = Object(ContactsTypeNames);
    const contactsOptions = ref([]);
    for (const key in contacts) {
      contactsOptions.value.push({
        label: contacts[key],
        value: key,
        attr: {
          default: false
        }
      });
    }
    function addItem() {
      contactsList.value.push({
        id: 0,
        type: ContactsType.phone,
        value: ""
      });
    }
    function deleteItem(index) {
      contactsList.value[index].isDeleted = true;
    }
    function updateItem(item, index) {
      contactsList.value[index] = item;
    }
    function getContacts() {
      return contactsList.value.filter((item) => item.value.trim() !== "");
    }
    function update(contacts2) {
      contactsList.value = [];
      if (!contacts2) {
        addItem();
        return;
      }
      contacts2.forEach((item) => {
        contactsList.value.push({
          id: item.id,
          type: item.type,
          value: item.value,
          isDeleted: item.isDeleted
        });
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      ssrRenderList(unref(contactsList), (item, index) => {
        _push(`<div class="formkit-no-limits">`);
        if (!item.isDeleted) {
          _push(ssrRenderComponent(_sfc_main$8, {
            item,
            index,
            indexLast: index === unref(contactsListLength),
            options: unref(contactsOptions),
            onAdd: addItem,
            onDelete: deleteItem,
            onUpdate: updateItem
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/admin/companies/ContactsList.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "CompaniesForm",
  __ssrInlineRender: true,
  props: {
    data: {
      type: Object,
      default: void 0
    }
  },
  emits: ["save", "delete"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    __expose({ setup });
    let company = props.data;
    const userData = useData();
    const auth = useAuth();
    const companyContacts = ref();
    const ownerships = ref([]);
    if (userData.ownership) {
      userData.ownership.forEach((item) => {
        ownerships.value.push(`${item.nameShort} (${item.nameFull})`);
      });
    }
    const inputID = ref((company == null ? void 0 : company.id) || 0);
    const inputNameShort = ref((company == null ? void 0 : company.nameShort) || "");
    const inputNameFull = ref((company == null ? void 0 : company.nameFull) || "");
    const inputRequisites = ref((company == null ? void 0 : company.requsites) || "");
    const inputOwnership = ref((company == null ? void 0 : company.ownership) ? `${company.ownership.nameShort} (${company.ownership.nameFull})` : "");
    const contacts = ref();
    let isShortName = false;
    function setup(item) {
      if (item)
        company = item;
      inputNameShort.value = (item == null ? void 0 : item.nameShort) || "";
      inputNameFull.value = (item == null ? void 0 : item.nameFull) || "";
      inputRequisites.value = (item == null ? void 0 : item.requsites) || "";
      inputOwnership.value = (item == null ? void 0 : item.ownership) ? `${item.ownership.nameShort} (${item.ownership.nameFull})` : "";
      inputID.value = (item == null ? void 0 : item.id) || 0;
      isShortName = !!(item == null ? void 0 : item.nameShort);
      companyContacts.value = item == null ? void 0 : item.contacts;
      contacts.value.update(item == null ? void 0 : item.contacts);
    }
    const submit = () => {
      var _a, _b, _c;
      console.log("submit");
      const contactsList = contacts.value.getContacts();
      if (typeof company === "undefined") {
        company = {
          nameFull: "",
          nameShort: "",
          user: {
            id: (_a = auth.user) == null ? void 0 : _a.id,
            email: ((_b = auth.user) == null ? void 0 : _b.email) || "",
            fio: (_c = auth.user) == null ? void 0 : _c.fio
          }
        };
      }
      company.id = inputID.value;
      company.nameFull = inputNameFull.value;
      company.nameShort = inputNameShort.value;
      company.requsites = inputRequisites.value;
      if (userData.ownership) {
        inputOwnership.value = inputOwnership.value || userData.ownership[0];
        const idx = userData.ownership.findIndex((item) => `${item.nameShort} (${item.nameFull})` === inputOwnership.value);
        company.ownership = userData.ownership[idx >= 0 ? idx : 0];
      }
      company.contacts = contactsList;
      userData.updateCompany(company).then((result) => {
        var _a2, _b2;
        if (result) {
          if (result == null ? void 0 : result.errors)
            return setErrors("companies_form", ((_a2 = result.errors) == null ? void 0 : _a2.other) ? [(_b2 = result.errors) == null ? void 0 : _b2.other] : [], result.errors);
          emit("save");
        }
      }).catch((error) => {
        console.log(error);
      });
    };
    const cloneName = () => {
      if (isShortName)
        return;
      inputNameShort.value = inputNameFull.value.trim();
    };
    const shortNameModify = () => {
      isShortName = inputNameFull.value.trim() !== inputNameShort.value.trim();
    };
    const deleteCompany = () => {
      if (confirm(`\u0412\u044B \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044E \xAB${inputNameFull.value}\xBB`)) {
        emit("delete", company);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormKit = formkitComponent;
      _push(ssrRenderComponent(unref(FormKitLazyProvider), mergeProps({ "config-file": "true" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-[600px] formkit-w-full"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormKit, {
              id: "companies_form",
              type: "form",
              "submit-label": unref(inputID) ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" : "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
              config: { validationVisibility: "submit" },
              onSubmit: submit
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_FormKit, {
                    type: "select",
                    label: "\u0424\u043E\u0440\u043C\u0430 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0441\u0442\u0438",
                    name: "ownership",
                    options: unref(ownerships),
                    modelValue: unref(inputOwnership),
                    "onUpdate:modelValue": ($event) => isRef(inputOwnership) ? inputOwnership.value = $event : null
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_FormKit, {
                    type: "text",
                    name: "nameFull",
                    id: "name_full",
                    label: "\u041F\u043E\u043B\u043D\u043E\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435",
                    placeholder: "\u042E\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438",
                    modelValue: unref(inputNameFull),
                    "onUpdate:modelValue": ($event) => isRef(inputNameFull) ? inputNameFull.value = $event : null,
                    onKeyup: cloneName,
                    validation: "required|length:3|contains_alpha_spaces",
                    "validation-messages": {
                      company_exists: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u0430\u044F \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044F \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
                      length: "\u0414\u043B\u0438\u043D\u0430 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 3 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                      required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u044E\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438",
                      name: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                    }
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_FormKit, {
                    type: "text",
                    name: "nameShort",
                    id: "name_short",
                    label: "\xAB\u041F\u0443\u0431\u043B\u0438\u0447\u043D\u043E\u0435\xBB \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435",
                    placeholder: "\xAB\u041F\u0443\u0431\u043B\u0438\u0447\u043D\u043E\u0435\xBB \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438",
                    modelValue: unref(inputNameShort),
                    "onUpdate:modelValue": ($event) => isRef(inputNameShort) ? inputNameShort.value = $event : null,
                    onKeyup: shortNameModify,
                    validation: "required|length:3|contains_alpha_spaces",
                    "validation-messages": {
                      company_exists: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u0430\u044F \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044F \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
                      length: "\u0414\u043B\u0438\u043D\u0430 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 3 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                      required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \xAB\u043F\u0443\u0431\u043B\u0438\u0447\u043D\u043E\u0435\xBB \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438",
                      name: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                    }
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_FormKit, {
                    type: "textarea",
                    name: "requisite",
                    id: "requisite",
                    label: "\u0420\u0435\u043A\u0432\u0438\u0437\u0438\u0442\u044B",
                    placeholder: "\u0411\u0430\u043D\u043A\u043E\u0432\u0441\u043A\u0438\u0435 \u0440\u0435\u043A\u0432\u0438\u0437\u0438\u0442\u044B",
                    modelValue: unref(inputRequisites),
                    "onUpdate:modelValue": ($event) => isRef(inputRequisites) ? inputRequisites.value = $event : null
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$7, {
                    contacts: unref(companyContacts),
                    ref_key: "contacts",
                    ref: contacts
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_FormKit, {
                      type: "select",
                      label: "\u0424\u043E\u0440\u043C\u0430 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0441\u0442\u0438",
                      name: "ownership",
                      options: unref(ownerships),
                      modelValue: unref(inputOwnership),
                      "onUpdate:modelValue": ($event) => isRef(inputOwnership) ? inputOwnership.value = $event : null
                    }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_FormKit, {
                      type: "text",
                      name: "nameFull",
                      id: "name_full",
                      label: "\u041F\u043E\u043B\u043D\u043E\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435",
                      placeholder: "\u042E\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438",
                      modelValue: unref(inputNameFull),
                      "onUpdate:modelValue": ($event) => isRef(inputNameFull) ? inputNameFull.value = $event : null,
                      onKeyup: cloneName,
                      validation: "required|length:3|contains_alpha_spaces",
                      "validation-messages": {
                        company_exists: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u0430\u044F \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044F \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
                        length: "\u0414\u043B\u0438\u043D\u0430 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 3 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                        required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u044E\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438",
                        name: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                      }
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_FormKit, {
                      type: "text",
                      name: "nameShort",
                      id: "name_short",
                      label: "\xAB\u041F\u0443\u0431\u043B\u0438\u0447\u043D\u043E\u0435\xBB \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435",
                      placeholder: "\xAB\u041F\u0443\u0431\u043B\u0438\u0447\u043D\u043E\u0435\xBB \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438",
                      modelValue: unref(inputNameShort),
                      "onUpdate:modelValue": ($event) => isRef(inputNameShort) ? inputNameShort.value = $event : null,
                      onKeyup: shortNameModify,
                      validation: "required|length:3|contains_alpha_spaces",
                      "validation-messages": {
                        company_exists: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u0430\u044F \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044F \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
                        length: "\u0414\u043B\u0438\u043D\u0430 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 3 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                        required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \xAB\u043F\u0443\u0431\u043B\u0438\u0447\u043D\u043E\u0435\xBB \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438",
                        name: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                      }
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_FormKit, {
                      type: "textarea",
                      name: "requisite",
                      id: "requisite",
                      label: "\u0420\u0435\u043A\u0432\u0438\u0437\u0438\u0442\u044B",
                      placeholder: "\u0411\u0430\u043D\u043A\u043E\u0432\u0441\u043A\u0438\u0435 \u0440\u0435\u043A\u0432\u0438\u0437\u0438\u0442\u044B",
                      modelValue: unref(inputRequisites),
                      "onUpdate:modelValue": ($event) => isRef(inputRequisites) ? inputRequisites.value = $event : null
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_sfc_main$7, {
                      contacts: unref(companyContacts),
                      ref_key: "contacts",
                      ref: contacts
                    }, null, 8, ["contacts"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (unref(userData).companies.length > 1 && unref(inputID)) {
              _push2(ssrRenderComponent(_sfc_main$1$1, {
                class: "flex items-center justify-center bg-gray-light text-white hover:bg-red-600 py-3 px-6 mt-6 text-center",
                onClick: deleteCompany
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(IconTrash), {
                      filled: "",
                      class: "w-5 h-5"
                    }, null, _parent3, _scopeId2));
                    _push3(` \u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044E `);
                  } else {
                    return [
                      createVNode(unref(IconTrash), {
                        filled: "",
                        class: "w-5 h-5"
                      }),
                      createTextVNode(" \u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044E ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "max-w-[600px] formkit-w-full" }, [
                createVNode(_component_FormKit, {
                  id: "companies_form",
                  type: "form",
                  "submit-label": unref(inputID) ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" : "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
                  config: { validationVisibility: "submit" },
                  onSubmit: submit
                }, {
                  default: withCtx(() => [
                    createVNode(_component_FormKit, {
                      type: "select",
                      label: "\u0424\u043E\u0440\u043C\u0430 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0441\u0442\u0438",
                      name: "ownership",
                      options: unref(ownerships),
                      modelValue: unref(inputOwnership),
                      "onUpdate:modelValue": ($event) => isRef(inputOwnership) ? inputOwnership.value = $event : null
                    }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_FormKit, {
                      type: "text",
                      name: "nameFull",
                      id: "name_full",
                      label: "\u041F\u043E\u043B\u043D\u043E\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435",
                      placeholder: "\u042E\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438",
                      modelValue: unref(inputNameFull),
                      "onUpdate:modelValue": ($event) => isRef(inputNameFull) ? inputNameFull.value = $event : null,
                      onKeyup: cloneName,
                      validation: "required|length:3|contains_alpha_spaces",
                      "validation-messages": {
                        company_exists: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u0430\u044F \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044F \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
                        length: "\u0414\u043B\u0438\u043D\u0430 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 3 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                        required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u044E\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438",
                        name: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                      }
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_FormKit, {
                      type: "text",
                      name: "nameShort",
                      id: "name_short",
                      label: "\xAB\u041F\u0443\u0431\u043B\u0438\u0447\u043D\u043E\u0435\xBB \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435",
                      placeholder: "\xAB\u041F\u0443\u0431\u043B\u0438\u0447\u043D\u043E\u0435\xBB \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438",
                      modelValue: unref(inputNameShort),
                      "onUpdate:modelValue": ($event) => isRef(inputNameShort) ? inputNameShort.value = $event : null,
                      onKeyup: shortNameModify,
                      validation: "required|length:3|contains_alpha_spaces",
                      "validation-messages": {
                        company_exists: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u0430\u044F \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044F \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
                        length: "\u0414\u043B\u0438\u043D\u0430 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 3 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                        required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \xAB\u043F\u0443\u0431\u043B\u0438\u0447\u043D\u043E\u0435\xBB \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438",
                        name: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                      }
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_FormKit, {
                      type: "textarea",
                      name: "requisite",
                      id: "requisite",
                      label: "\u0420\u0435\u043A\u0432\u0438\u0437\u0438\u0442\u044B",
                      placeholder: "\u0411\u0430\u043D\u043A\u043E\u0432\u0441\u043A\u0438\u0435 \u0440\u0435\u043A\u0432\u0438\u0437\u0438\u0442\u044B",
                      modelValue: unref(inputRequisites),
                      "onUpdate:modelValue": ($event) => isRef(inputRequisites) ? inputRequisites.value = $event : null
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_sfc_main$7, {
                      contacts: unref(companyContacts),
                      ref_key: "contacts",
                      ref: contacts
                    }, null, 8, ["contacts"])
                  ]),
                  _: 1
                }, 8, ["submit-label"]),
                unref(userData).companies.length > 1 && unref(inputID) ? (openBlock(), createBlock(_sfc_main$1$1, {
                  key: 0,
                  class: "flex items-center justify-center bg-gray-light text-white hover:bg-red-600 py-3 px-6 mt-6 text-center",
                  onClick: withModifiers(deleteCompany, ["prevent"])
                }, {
                  default: withCtx(() => [
                    createVNode(unref(IconTrash), {
                      filled: "",
                      class: "w-5 h-5"
                    }),
                    createTextVNode(" \u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044E ")
                  ]),
                  _: 1
                }, 8, ["onClick"])) : createCommentVNode("", true)
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/admin/companies/CompaniesForm.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "InitiativeListItem",
  __ssrInlineRender: true,
  props: {
    item: Object,
    index: Number
  },
  emits: ["onClick", "onDelete"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    props.item;
    const directions = ref(["\u041E\u0442\u0434\u044B\u0445", "\u0411\u0438\u0437\u043D\u0435\u0441"]);
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center px-4 py-3 bg-dark-light/10 odd:bg-white hover:bg-dark-light/20 cursor-pointer round" }, _attrs))}><div class="w-1/12">`);
      if ((_a = props.item) == null ? void 0 : _a.status) {
        _push(ssrRenderComponent(unref(IconActive), {
          class: "w-5 h-5 mr-1",
          filled: ""
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(IconNotActive), {
          class: "w-\u0445\u044A h-5 mr-1",
          filled: ""
        }, null, _parent));
      }
      _push(`</div><div class="w-6/12">${ssrInterpolate(props.item.name)}</div><div class="w-2/12">${ssrInterpolate(unref(directions)[props.item.direction])}</div><div class="w-2/12">${ssrInterpolate(props.item.region.name)}</div><div class="flex w-1/12 justify-end"><a href="" class="block w-5 h-5 mx-1 text-dark-main hover:text-main">`);
      _push(ssrRenderComponent(unref(IconTrash), { filled: "" }, null, _parent));
      _push(`</a></div></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/admin/initiatives/InitiativeListItem.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "InitiativeList",
  __ssrInlineRender: true,
  emits: ["onClick", "onDelete"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const userData = useData();
    const initiatives = ref(userData.initiatives);
    __expose({ refresh, update });
    const emit = __emit;
    function refresh() {
      initiatives.value = userData.initiatives;
    }
    function update(item, index) {
      if (initiatives.value[index])
        initiatives.value[index] = item;
    }
    function onClick(item, index) {
      refresh();
      emit("onClick", initiatives.value[index], index);
    }
    function onDelete(item, index) {
      emit("onDelete", item, index);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "my-4" }, _attrs))}><!--[-->`);
      ssrRenderList(unref(initiatives), (item, index) => {
        _push(ssrRenderComponent(_sfc_main$5, {
          key: `init${item.id}`,
          item,
          index,
          onOnClick: onClick,
          onOnDelete: onDelete
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/admin/initiatives/InitiativeList.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "InitiativeForm",
  __ssrInlineRender: true,
  props: {
    company: Object
  },
  emits: ["save"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const userData = useData();
    useAuth();
    const props = __props;
    __expose({ setup });
    const emit = __emit;
    const inputID = ref(0);
    const inputName = ref("");
    const inputText = ref("");
    const inputPhoto = ref("");
    const inputStatus = ref(false);
    const inputPhotos = ref([]);
    const directionList = ref([]);
    const regionList = ref([]);
    const typesList = ref([]);
    const currentDirection = ref(0);
    const currentRegion = ref(0);
    const currentType = ref(0);
    const photosList = ref();
    const regions = userData.regions;
    const types = userData.types;
    const directions = [
      {
        label: "\u041E\u0442\u0434\u044B\u0445",
        value: 0
      },
      {
        label: "\u0411\u0438\u0437\u043D\u0435\u0441",
        value: 1
      }
    ];
    setup();
    function setup(initiative) {
      inputID.value = (initiative == null ? void 0 : initiative.id) || 0;
      inputName.value = (initiative == null ? void 0 : initiative.name) || "";
      inputText.value = (initiative == null ? void 0 : initiative.text) || "";
      inputPhotos.value = (initiative == null ? void 0 : initiative.photos) || [];
      inputStatus.value = (initiative == null ? void 0 : initiative.status) || false;
      inputPhoto.value = "";
      if (regions) {
        regionList.value = [];
        regions.forEach((item) => {
          const region = {
            label: item.name,
            value: item.id || 0
          };
          if (initiative && (initiative == null ? void 0 : initiative.region.id) === item.id) {
            currentRegion.value = item.id || 0;
            region.attr = { default: true };
          }
          regionList.value.push(region);
        });
        if (!currentRegion.value)
          currentRegion.value = regions[0].id || 0;
      }
      if (types) {
        typesList.value = [];
        types.forEach((item) => {
          const type = {
            label: item.name,
            value: item.id || 0
          };
          if (initiative && (initiative == null ? void 0 : initiative.type.id) === item.id) {
            currentType.value = item.id || 0;
            type.attr = { default: true };
          }
          typesList.value.push(type);
        });
        if (!currentType.value)
          currentType.value = types[0].id || 0;
      }
      directionList.value = [];
      directions.forEach((item) => {
        const direction = {
          label: item.label,
          value: item.value
        };
        if (initiative && (initiative == null ? void 0 : initiative.direction) === item.value) {
          direction.attr = { default: true };
          currentDirection.value = item.value || 0;
        }
        directionList.value.push(direction);
      });
      if (photosList.value)
        photosList.value.update((initiative == null ? void 0 : initiative.photos) || []);
    }
    const onSubmit = (data) => {
      var _a;
      const region = regionList.value.find((item) => item.value.toString() === (currentRegion.value || data.region));
      const types2 = typesList.value.find((item) => item.value.toString() === (currentType.value || data.type));
      const company = props.company;
      let body;
      if (data.photos.length) {
        body = new FormData();
        for (const key in data) {
          if (key === "photos") {
            if (data[key].length) {
              (_a = data[key]) == null ? void 0 : _a.forEach((fileItem) => {
                body.append("photos", fileItem.file);
              });
            }
          } else {
            switch (key) {
              case "region": {
                body.append(key, (currentRegion.value || (region == null ? void 0 : region.value) || data[key]).toString());
                break;
              }
              case "type": {
                body.append(key, ((types2 == null ? void 0 : types2.value) || data[key]).toString());
                break;
              }
              default: {
                body.append(key, data[key]);
              }
            }
          }
        }
        body.append("company", ((company == null ? void 0 : company.id) || 0).toString());
        body.append("id", inputID.value.toString());
        body.append("photosList", inputPhotos.value.length ? JSON.stringify(inputPhotos.value) : "");
      } else {
        body = {
          id: inputID.value.toString(),
          status: data.status.toString(),
          direction: data.direction.toString(),
          region: ((region == null ? void 0 : region.value) || data.region).toString(),
          type: ((types2 == null ? void 0 : types2.value) || data.type).toString(),
          company: ((company == null ? void 0 : company.id) || 0).toString(),
          photos: unref(inputPhotos),
          name: data.name.toString(),
          text: data.text.toString()
        };
      }
      userData.updateInitiative(body).then((result) => {
        var _a2, _b;
        if (result) {
          if (result == null ? void 0 : result.errors)
            return setErrors("initiative_form", ((_a2 = result.errors) == null ? void 0 : _a2.other) ? [(_b = result.errors) == null ? void 0 : _b.other] : [], result.errors);
          emit("save");
        }
      }).catch((e) => {
        console.log(e);
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormKit = formkitComponent;
      _push(ssrRenderComponent(unref(FormKitLazyProvider), mergeProps({ "config-file": "true" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-[600px] formkit-w-full"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormKit, {
              id: "initiative_form",
              type: "form",
              "submit-label": unref(inputID) ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" : "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
              config: { validationVisibility: "submit" },
              onSubmit
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_FormKit, {
                    type: "checkbox",
                    name: "status",
                    id: "status",
                    label: "\u041E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435",
                    modelValue: unref(inputStatus),
                    "onUpdate:modelValue": ($event) => isRef(inputStatus) ? inputStatus.value = $event : null
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_FormKit, {
                    type: "select",
                    name: "direction",
                    id: "direction",
                    label: "\u041D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435",
                    modelValue: unref(currentDirection),
                    "onUpdate:modelValue": ($event) => isRef(currentDirection) ? currentDirection.value = $event : null,
                    options: unref(directionList)
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_FormKit, {
                    type: "select",
                    name: "type",
                    id: "type",
                    label: "\u0422\u0438\u043F \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B",
                    modelValue: unref(currentType),
                    "onUpdate:modelValue": ($event) => isRef(currentType) ? currentType.value = $event : null,
                    options: unref(typesList)
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_FormKit, {
                    type: "select",
                    name: "region",
                    id: "region",
                    label: "\u0420\u0435\u0433\u0438\u043E\u043D",
                    modelValue: unref(currentRegion),
                    "onUpdate:modelValue": ($event) => isRef(currentRegion) ? currentRegion.value = $event : null,
                    options: unref(regionList)
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_FormKit, {
                    type: "text",
                    name: "name",
                    id: "name",
                    label: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435",
                    placeholder: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B",
                    modelValue: unref(inputName),
                    "onUpdate:modelValue": ($event) => isRef(inputName) ? inputName.value = $event : null,
                    validation: "required|length:3|contains_alpha_spaces",
                    "validation-messages": {
                      initiative_exists: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u0430\u044F \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044F \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
                      length: "\u0414\u043B\u0438\u043D\u0430 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 3 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                      required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u044E\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438",
                      name: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                    }
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_FormKit, {
                    type: "textarea",
                    name: "text",
                    id: "text",
                    label: "\u0422\u0435\u043A\u0441\u0442",
                    placeholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0442\u0435\u043A\u0441\u0442 \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B",
                    modelValue: unref(inputText),
                    "onUpdate:modelValue": ($event) => isRef(inputText) ? inputText.value = $event : null
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_FormKit, {
                    type: "file",
                    name: "photos",
                    label: "\u0424\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0438",
                    accept: ".jpg,.gif,.png,.jpeg,.webp,.svg",
                    multiple: "true",
                    modelValue: unref(inputPhoto),
                    "onUpdate:modelValue": ($event) => isRef(inputPhoto) ? inputPhoto.value = $event : null
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$d, {
                    photos: unref(inputPhotos),
                    ref_key: "photosList",
                    ref: photosList
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_FormKit, {
                      type: "checkbox",
                      name: "status",
                      id: "status",
                      label: "\u041E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435",
                      modelValue: unref(inputStatus),
                      "onUpdate:modelValue": ($event) => isRef(inputStatus) ? inputStatus.value = $event : null
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_FormKit, {
                      type: "select",
                      name: "direction",
                      id: "direction",
                      label: "\u041D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435",
                      modelValue: unref(currentDirection),
                      "onUpdate:modelValue": ($event) => isRef(currentDirection) ? currentDirection.value = $event : null,
                      options: unref(directionList)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                    createVNode(_component_FormKit, {
                      type: "select",
                      name: "type",
                      id: "type",
                      label: "\u0422\u0438\u043F \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B",
                      modelValue: unref(currentType),
                      "onUpdate:modelValue": ($event) => isRef(currentType) ? currentType.value = $event : null,
                      options: unref(typesList)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                    createVNode(_component_FormKit, {
                      type: "select",
                      name: "region",
                      id: "region",
                      label: "\u0420\u0435\u0433\u0438\u043E\u043D",
                      modelValue: unref(currentRegion),
                      "onUpdate:modelValue": ($event) => isRef(currentRegion) ? currentRegion.value = $event : null,
                      options: unref(regionList)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                    createVNode(_component_FormKit, {
                      type: "text",
                      name: "name",
                      id: "name",
                      label: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435",
                      placeholder: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B",
                      modelValue: unref(inputName),
                      "onUpdate:modelValue": ($event) => isRef(inputName) ? inputName.value = $event : null,
                      validation: "required|length:3|contains_alpha_spaces",
                      "validation-messages": {
                        initiative_exists: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u0430\u044F \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044F \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
                        length: "\u0414\u043B\u0438\u043D\u0430 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 3 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                        required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u044E\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438",
                        name: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                      }
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_FormKit, {
                      type: "textarea",
                      name: "text",
                      id: "text",
                      label: "\u0422\u0435\u043A\u0441\u0442",
                      placeholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0442\u0435\u043A\u0441\u0442 \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B",
                      modelValue: unref(inputText),
                      "onUpdate:modelValue": ($event) => isRef(inputText) ? inputText.value = $event : null
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_FormKit, {
                      type: "file",
                      name: "photos",
                      label: "\u0424\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0438",
                      accept: ".jpg,.gif,.png,.jpeg,.webp,.svg",
                      multiple: "true",
                      modelValue: unref(inputPhoto),
                      "onUpdate:modelValue": ($event) => isRef(inputPhoto) ? inputPhoto.value = $event : null
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_sfc_main$d, {
                      photos: unref(inputPhotos),
                      ref_key: "photosList",
                      ref: photosList
                    }, null, 8, ["photos"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", {
                class: "max-w-[600px] formkit-w-full",
                onClick: withModifiers(() => {
                }, ["stop"])
              }, [
                createVNode(_component_FormKit, {
                  id: "initiative_form",
                  type: "form",
                  "submit-label": unref(inputID) ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" : "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
                  config: { validationVisibility: "submit" },
                  onSubmit
                }, {
                  default: withCtx(() => [
                    createVNode(_component_FormKit, {
                      type: "checkbox",
                      name: "status",
                      id: "status",
                      label: "\u041E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435",
                      modelValue: unref(inputStatus),
                      "onUpdate:modelValue": ($event) => isRef(inputStatus) ? inputStatus.value = $event : null
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_FormKit, {
                      type: "select",
                      name: "direction",
                      id: "direction",
                      label: "\u041D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435",
                      modelValue: unref(currentDirection),
                      "onUpdate:modelValue": ($event) => isRef(currentDirection) ? currentDirection.value = $event : null,
                      options: unref(directionList)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                    createVNode(_component_FormKit, {
                      type: "select",
                      name: "type",
                      id: "type",
                      label: "\u0422\u0438\u043F \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B",
                      modelValue: unref(currentType),
                      "onUpdate:modelValue": ($event) => isRef(currentType) ? currentType.value = $event : null,
                      options: unref(typesList)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                    createVNode(_component_FormKit, {
                      type: "select",
                      name: "region",
                      id: "region",
                      label: "\u0420\u0435\u0433\u0438\u043E\u043D",
                      modelValue: unref(currentRegion),
                      "onUpdate:modelValue": ($event) => isRef(currentRegion) ? currentRegion.value = $event : null,
                      options: unref(regionList)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                    createVNode(_component_FormKit, {
                      type: "text",
                      name: "name",
                      id: "name",
                      label: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435",
                      placeholder: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B",
                      modelValue: unref(inputName),
                      "onUpdate:modelValue": ($event) => isRef(inputName) ? inputName.value = $event : null,
                      validation: "required|length:3|contains_alpha_spaces",
                      "validation-messages": {
                        initiative_exists: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u0430\u044F \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044F \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
                        length: "\u0414\u043B\u0438\u043D\u0430 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 3 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                        required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u044E\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438",
                        name: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                      }
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_FormKit, {
                      type: "textarea",
                      name: "text",
                      id: "text",
                      label: "\u0422\u0435\u043A\u0441\u0442",
                      placeholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0442\u0435\u043A\u0441\u0442 \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B",
                      modelValue: unref(inputText),
                      "onUpdate:modelValue": ($event) => isRef(inputText) ? inputText.value = $event : null
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_FormKit, {
                      type: "file",
                      name: "photos",
                      label: "\u0424\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0438",
                      accept: ".jpg,.gif,.png,.jpeg,.webp,.svg",
                      multiple: "true",
                      modelValue: unref(inputPhoto),
                      "onUpdate:modelValue": ($event) => isRef(inputPhoto) ? inputPhoto.value = $event : null
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_sfc_main$d, {
                      photos: unref(inputPhotos),
                      ref_key: "photosList",
                      ref: photosList
                    }, null, 8, ["photos"])
                  ]),
                  _: 1
                }, 8, ["submit-label"])
              ], 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/admin/initiatives/InitiativeForm.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Initiatives",
  __ssrInlineRender: true,
  props: {
    company: Object
  },
  setup(__props) {
    const userData = useData();
    const initiatives = ref(userData.initiatives);
    const titlePopup = ref("\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u0443");
    const popup = ref();
    const initiativeForm = ref();
    const initiativeList = ref();
    const popupOpen = (item) => {
      titlePopup.value = "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u0443";
      popup.value.show();
      if (!(item instanceof Event)) {
        if (item == null ? void 0 : item.id) {
          titlePopup.value = "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u0443";
        }
        initiativeForm.value.setup(item);
      } else {
        initiativeForm.value.setup();
      }
    };
    const popupClose = () => {
      if (popup.value)
        popup.value.hide();
      titlePopup.value = "";
      initiatives.value = (userData == null ? void 0 : userData.initiatives) || [];
    };
    watch(initiatives, (newList) => {
      if (newList.length > 0) {
        if (initiativeList.value)
          initiativeList.value.refresh();
      }
    });
    const onDelete = (initiative, index) => {
      userData.deleteInitiative(initiative).then(() => {
        initiatives.value = (userData == null ? void 0 : userData.initiatives) || [];
      }).catch((e) => {
        console.log(e);
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><h2 class="mt-8 mb-4 text-xl">\u0418\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B</h2>`);
      if (!unref(initiatives).length) {
        _push(ssrRenderComponent(_sfc_main$3, {
          company: __props.company,
          ref_key: "initiativeForm",
          ref: initiativeForm,
          onSave: popupClose
        }, null, _parent));
      } else {
        _push(`<div>`);
        _push(ssrRenderComponent(_sfc_main$1$1, {
          class: "inline-flex items-center bg-second text-white hover:bg-main-light py-2 px-6",
          title: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u0443",
          onClick: popupOpen
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(IconPlus), {
                filled: "",
                class: "w-6 h-6"
              }, null, _parent2, _scopeId));
              _push2(` \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u0443 `);
            } else {
              return [
                createVNode(unref(IconPlus), {
                  filled: "",
                  class: "w-6 h-6"
                }),
                createTextVNode(" \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u0443 ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_sfc_main$4, {
          ref_key: "initiativeList",
          ref: initiativeList,
          onOnClick: popupOpen,
          onOnDelete: onDelete
        }, null, _parent));
        _push(ssrRenderComponent(PopupContainer, {
          ref_key: "popup",
          ref: popup,
          onClose: popupClose
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_sfc_main$c, {
                class: "bg-gray-light/60 w-full max-h-full min-w-[300px] max-w-[600px] pb-0",
                title: unref(titlePopup),
                onClose: popupClose
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_sfc_main$3, {
                      company: __props.company,
                      ref_key: "initiativeForm",
                      ref: initiativeForm,
                      onSave: popupClose
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_sfc_main$3, {
                        company: __props.company,
                        ref_key: "initiativeForm",
                        ref: initiativeForm,
                        onSave: popupClose
                      }, null, 8, ["company"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_sfc_main$c, {
                  class: "bg-gray-light/60 w-full max-h-full min-w-[300px] max-w-[600px] pb-0",
                  title: unref(titlePopup),
                  onClose: popupClose
                }, {
                  default: withCtx(() => [
                    createVNode(_sfc_main$3, {
                      company: __props.company,
                      ref_key: "initiativeForm",
                      ref: initiativeForm,
                      onSave: popupClose
                    }, null, 8, ["company"])
                  ]),
                  _: 1
                }, 8, ["title"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/admin/Initiatives.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Companies",
  __ssrInlineRender: true,
  setup(__props) {
    var _a;
    const titlePopup = ref("\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044E");
    const popup = ref();
    const userData = useData();
    const companies = ref(userData.companies || []);
    const companiesList = ref([]);
    const companyCurrentID = ref(userData.companies ? (_a = userData.companies[0]) == null ? void 0 : _a.id : 0);
    const companyCurrent = ref(userData.companies ? userData.companies[0] : void 0);
    const companyForm = ref();
    const companyFormStart = ref();
    const refreshCompanies = () => {
      var _a2, _b;
      if ((_a2 = userData == null ? void 0 : userData.companies) == null ? void 0 : _a2.length) {
        companiesList.value = [];
        userData == null ? void 0 : userData.companies.forEach((item) => {
          companiesList.value.push({
            label: item.nameShort !== item.nameFull ? `${item.nameShort} (${item.nameFull})` : item.nameFull,
            value: item.id || 0
          });
        });
        companies.value = userData == null ? void 0 : userData.companies;
      } else {
        (_b = companyFormStart.value) == null ? void 0 : _b.setup();
      }
    };
    const popupEdit = () => {
      if (!(userData == null ? void 0 : userData.companies))
        return;
      const id = companyCurrentID.value || 0;
      const company = userData == null ? void 0 : userData.companies.find((item) => item.id === id);
      if (!company)
        return;
      popupOpen(company);
    };
    const popupOpen = (item) => {
      titlePopup.value = "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044E";
      companyCurrent.value = void 0;
      if (item == null ? void 0 : item.id) {
        titlePopup.value = "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438";
        companyCurrent.value = item;
      }
      companyForm.value.setup(item);
      popup.value.show();
    };
    const popupClose = () => {
      popup.value.hide();
      titlePopup.value = "";
      if (userData == null ? void 0 : userData.companies)
        refreshCompanies();
    };
    const deleteCompany = async (company) => {
      await userData.deleteCompany(company).then(() => {
        popupClose();
        refreshCompanies();
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormKit = formkitComponent;
      _push(ssrRenderComponent(unref(FormKitLazyProvider), mergeProps({ "config-file": "true" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!unref(companies).length) {
              _push2(ssrRenderComponent(_sfc_main$6, {
                ref_key: "companyFormStart",
                ref: companyFormStart,
                onSave: refreshCompanies
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<div${_scopeId}><div class="formkit-no-limits flex gap-2 items-end max-w-[600px]"${_scopeId}><div class="grow"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_FormKit, {
                type: "select",
                name: "companies",
                modelValue: unref(companyCurrentID),
                "onUpdate:modelValue": ($event) => isRef(companyCurrentID) ? companyCurrentID.value = $event : null,
                label: unref(companies).length === 1 ? "\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F" : "\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u0438",
                options: unref(companiesList)
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(ssrRenderComponent(_sfc_main$1$1, {
                class: "inline-flex items-center bg-main text-white hover:bg-main-light py-2 px-6",
                title: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C",
                onClick: popupEdit
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(IconEdit), {
                      filled: "",
                      class: "w-6 h-6"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(IconEdit), {
                        filled: "",
                        class: "w-6 h-6"
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_sfc_main$1$1, {
                class: "inline-flex items-center bg-second text-white hover:bg-main-light py-2 px-6",
                title: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044E",
                onClick: popupOpen
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(IconPlus), {
                      filled: "",
                      class: "w-6 h-6"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(IconPlus), {
                        filled: "",
                        class: "w-6 h-6"
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(ssrRenderComponent(_sfc_main$2, { company: unref(companyCurrent) }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(PopupContainer, {
                ref_key: "popup",
                ref: popup,
                onOnClose: popupClose
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_sfc_main$c, {
                      class: "bg-gray-light/60 w-full max-h-full min-w-[300px] max-w-[600px] pb-0",
                      title: unref(titlePopup),
                      onClose: popupClose
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_sfc_main$6, {
                            ref_key: "companyForm",
                            ref: companyForm,
                            onSave: popupClose,
                            onDelete: deleteCompany
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_sfc_main$6, {
                              ref_key: "companyForm",
                              ref: companyForm,
                              onSave: popupClose,
                              onDelete: deleteCompany
                            }, null, 512)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_sfc_main$c, {
                        class: "bg-gray-light/60 w-full max-h-full min-w-[300px] max-w-[600px] pb-0",
                        title: unref(titlePopup),
                        onClose: popupClose
                      }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$6, {
                            ref_key: "companyForm",
                            ref: companyForm,
                            onSave: popupClose,
                            onDelete: deleteCompany
                          }, null, 512)
                        ]),
                        _: 1
                      }, 8, ["title"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            }
          } else {
            return [
              !unref(companies).length ? (openBlock(), createBlock(_sfc_main$6, {
                key: 0,
                ref_key: "companyFormStart",
                ref: companyFormStart,
                onSave: refreshCompanies
              }, null, 512)) : (openBlock(), createBlock("div", { key: 1 }, [
                createVNode("div", { class: "formkit-no-limits flex gap-2 items-end max-w-[600px]" }, [
                  createVNode("div", { class: "grow" }, [
                    createVNode(_component_FormKit, {
                      type: "select",
                      name: "companies",
                      modelValue: unref(companyCurrentID),
                      "onUpdate:modelValue": ($event) => isRef(companyCurrentID) ? companyCurrentID.value = $event : null,
                      label: unref(companies).length === 1 ? "\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F" : "\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u0438",
                      options: unref(companiesList)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "options"])
                  ]),
                  createVNode(_sfc_main$1$1, {
                    class: "inline-flex items-center bg-main text-white hover:bg-main-light py-2 px-6",
                    title: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C",
                    onClick: popupEdit
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(IconEdit), {
                        filled: "",
                        class: "w-6 h-6"
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(_sfc_main$1$1, {
                    class: "inline-flex items-center bg-second text-white hover:bg-main-light py-2 px-6",
                    title: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044E",
                    onClick: popupOpen
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(IconPlus), {
                        filled: "",
                        class: "w-6 h-6"
                      })
                    ]),
                    _: 1
                  })
                ]),
                createVNode(_sfc_main$2, { company: unref(companyCurrent) }, null, 8, ["company"]),
                createVNode(PopupContainer, {
                  ref_key: "popup",
                  ref: popup,
                  onOnClose: popupClose
                }, {
                  default: withCtx(() => [
                    createVNode(_sfc_main$c, {
                      class: "bg-gray-light/60 w-full max-h-full min-w-[300px] max-w-[600px] pb-0",
                      title: unref(titlePopup),
                      onClose: popupClose
                    }, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$6, {
                          ref_key: "companyForm",
                          ref: companyForm,
                          onSave: popupClose,
                          onDelete: deleteCompany
                        }, null, 512)
                      ]),
                      _: 1
                    }, 8, ["title"])
                  ]),
                  _: 1
                }, 512)
              ]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/admin/Companies.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  props: {
    data: Object
  },
  setup(__props) {
    var _a;
    const props = __props;
    useHead({
      title: ((_a = props.data) == null ? void 0 : _a.news) ? "\u0410\u0413\u0410. \u0421\u043F\u0438\u0441\u043E\u043A \u043D\u043E\u0432\u043E\u0441\u0442\u0435\u0439" : "\u0421\u043F\u0438\u0441\u043E\u043A \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0439 / \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432"
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a2;
      if ((_a2 = __props.data) == null ? void 0 : _a2.news) {
        _push(`<div${ssrRenderAttrs(_attrs)}>`);
        _push(ssrRenderComponent(_sfc_main$9, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(_attrs)}>`);
        _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
        _push(`</div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/client/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
