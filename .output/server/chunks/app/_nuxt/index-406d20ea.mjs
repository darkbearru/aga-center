import { useSSRContext, defineComponent, mergeProps, unref, ref, withCtx, createVNode, isRef } from 'vue';
import { u as useHead } from './index-6a088328.mjs';
import { ssrRenderComponent, ssrRenderAttrs, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { F as FormKitLazyProvider, f as formkitComponent } from '../server.mjs';
import { _ as _sfc_main$1$1, a as _sfc_main$4 } from './Popup-4c827385.mjs';
import IconUserPlus from './icon-user-plus-45aea0a3.mjs';
import { P as PopupContainer } from './PopupContainer-4e6a6b1d.mjs';
import { u as useData } from './useData-2a2ed08f.mjs';
import { setErrors } from '@formkit/core';
import IconEdit from './icon-edit-f7118c55.mjs';
import IconTrash from './icon-trash-be4099c2.mjs';
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
import './nuxt-link-17df5783.mjs';
import './icon-close-344453b8.mjs';
import './cookie-a95ecb9a.mjs';
import './ssr-34c5ba80.mjs';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "InitiativeTypesListItem",
  __ssrInlineRender: true,
  props: {
    item: Object
  },
  emits: ["click", "delete"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center px-4 py-3 bg-dark-light/10 odd:bg-white hover:bg-dark-light/20 cursor-pointer rounded" }, _attrs))}><div class="w-10/12">${ssrInterpolate(__props.item.name)}</div><div class="w-2/12 flex items-center justify-end"><a href="" class="block w-5 h-5 mx-1 text-dark-main hover:text-main">`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/admin/initiatives/InitiativeTypesListItem.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "InitiativeTypesList",
  __ssrInlineRender: true,
  emits: ["click", "delete"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const data = useData();
    const typesList = ref(data.types);
    const emit = __emit;
    const onClick = (item) => {
      emit("click", item);
    };
    const onDelete = (item) => {
      emit("delete", item);
    };
    const update = () => {
      typesList.value = data.types;
    };
    __expose({ update });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      ssrRenderList(unref(typesList), (item) => {
        _push(ssrRenderComponent(_sfc_main$3, {
          item,
          key: `types${item.id}`,
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/admin/initiatives/InitiativeTypesList.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "InitiativeTypes",
  __ssrInlineRender: true,
  setup(__props) {
    const titlePopup = ref("\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0442\u0438\u043F\u0430 \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B");
    const popup = ref();
    const inputName = ref("");
    const inputId = ref(void 0);
    const userData = useData();
    const typesList = ref();
    const popupOpen = (item) => {
      titlePopup.value = "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0442\u0438\u043F\u0430 \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B";
      if (item == null ? void 0 : item.id) {
        titlePopup.value = "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u044F \u0442\u0438\u043F\u0430";
        inputName.value = (item == null ? void 0 : item.name) || "";
        inputId.value = (item == null ? void 0 : item.id) || void 0;
      }
      popup.value.show();
    };
    const popupClose = () => {
      popup.value.hide();
      inputName.value = "";
      inputId.value = void 0;
    };
    const popupSubmit = async () => {
      userData.updateInitiativeTypes({
        id: inputId.value || void 0,
        name: inputName.value
      }).then((result) => {
        if (result) {
          if (result == null ? void 0 : result.errors)
            return setErrors("types_form", [], result.errors);
          typesList.value.update();
          popupClose();
        }
      }).catch((error) => {
        console.log(error);
      });
    };
    const deleteTypes = async (type) => {
      await userData.deleteInitiativeTypes(type).then(() => typesList.value.update());
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormKit = formkitComponent;
      _push(ssrRenderComponent(unref(FormKitLazyProvider), mergeProps({ "config-file": "true" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-7/12 min-w-[520px]"${_scopeId}><div class="w-full text-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$1$1, {
              class: "inline-flex items-center bg-main text-white hover:bg-main-light py-3 px-6 w-auto mx-auto mb-8",
              title: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0442\u0438\u043F \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B",
              onClick: popupOpen
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(IconUserPlus), {
                    class: "block text-white w-6 h-6 mr-2",
                    filled: ""
                  }, null, _parent3, _scopeId2));
                  _push3(`<span class="hidden md:inline"${_scopeId2}>\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0442\u0438\u043F\u0430 \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B</span>`);
                } else {
                  return [
                    createVNode(unref(IconUserPlus), {
                      class: "block text-white w-6 h-6 mr-2",
                      filled: ""
                    }),
                    createVNode("span", { class: "hidden md:inline" }, "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0442\u0438\u043F\u0430 \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              onClick: popupOpen,
              onDelete: deleteTypes,
              ref_key: "typesList",
              ref: typesList
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
                          id: "ownership_form",
                          type: "form",
                          "submit-label": unref(inputId) ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" : "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
                          config: { validationVisibility: "submit" },
                          onSubmit: popupSubmit
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_FormKit, {
                                type: "text",
                                name: "name_short",
                                id: "name_short",
                                label: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435",
                                placeholder: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0442\u0438\u043F\u0430",
                                modelValue: unref(inputName),
                                "onUpdate:modelValue": ($event) => isRef(inputName) ? inputName.value = $event : null,
                                validation: "required|length:5|ccontains_alpha_spaces",
                                "validation-visibility": "live",
                                "validation-messages": {
                                  length: "\u0414\u043B\u0438\u043D\u0430 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                  required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435",
                                  contains_alpha_spaces: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                                }
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_FormKit, {
                                  type: "text",
                                  name: "name_short",
                                  id: "name_short",
                                  label: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435",
                                  placeholder: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0442\u0438\u043F\u0430",
                                  modelValue: unref(inputName),
                                  "onUpdate:modelValue": ($event) => isRef(inputName) ? inputName.value = $event : null,
                                  validation: "required|length:5|ccontains_alpha_spaces",
                                  "validation-visibility": "live",
                                  "validation-messages": {
                                    length: "\u0414\u043B\u0438\u043D\u0430 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                    required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435",
                                    contains_alpha_spaces: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                                  }
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_FormKit, {
                            id: "ownership_form",
                            type: "form",
                            "submit-label": unref(inputId) ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" : "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
                            config: { validationVisibility: "submit" },
                            onSubmit: popupSubmit
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_FormKit, {
                                type: "text",
                                name: "name_short",
                                id: "name_short",
                                label: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435",
                                placeholder: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0442\u0438\u043F\u0430",
                                modelValue: unref(inputName),
                                "onUpdate:modelValue": ($event) => isRef(inputName) ? inputName.value = $event : null,
                                validation: "required|length:5|ccontains_alpha_spaces",
                                "validation-visibility": "live",
                                "validation-messages": {
                                  length: "\u0414\u043B\u0438\u043D\u0430 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                  required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435",
                                  contains_alpha_spaces: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                                }
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
                          id: "ownership_form",
                          type: "form",
                          "submit-label": unref(inputId) ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" : "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
                          config: { validationVisibility: "submit" },
                          onSubmit: popupSubmit
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_FormKit, {
                              type: "text",
                              name: "name_short",
                              id: "name_short",
                              label: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435",
                              placeholder: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0442\u0438\u043F\u0430",
                              modelValue: unref(inputName),
                              "onUpdate:modelValue": ($event) => isRef(inputName) ? inputName.value = $event : null,
                              validation: "required|length:5|ccontains_alpha_spaces",
                              "validation-visibility": "live",
                              "validation-messages": {
                                length: "\u0414\u043B\u0438\u043D\u0430 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435",
                                contains_alpha_spaces: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                              }
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
                    title: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0442\u0438\u043F \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B",
                    onClick: popupOpen
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(IconUserPlus), {
                        class: "block text-white w-6 h-6 mr-2",
                        filled: ""
                      }),
                      createVNode("span", { class: "hidden md:inline" }, "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0442\u0438\u043F\u0430 \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044B")
                    ]),
                    _: 1
                  })
                ]),
                createVNode(_sfc_main$2, {
                  onClick: popupOpen,
                  onDelete: deleteTypes,
                  ref_key: "typesList",
                  ref: typesList
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
                          id: "ownership_form",
                          type: "form",
                          "submit-label": unref(inputId) ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" : "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
                          config: { validationVisibility: "submit" },
                          onSubmit: popupSubmit
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_FormKit, {
                              type: "text",
                              name: "name_short",
                              id: "name_short",
                              label: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435",
                              placeholder: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0442\u0438\u043F\u0430",
                              modelValue: unref(inputName),
                              "onUpdate:modelValue": ($event) => isRef(inputName) ? inputName.value = $event : null,
                              validation: "required|length:5|ccontains_alpha_spaces",
                              "validation-visibility": "live",
                              "validation-messages": {
                                length: "\u0414\u043B\u0438\u043D\u0430 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
                                required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435",
                                contains_alpha_spaces: "\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 \u0431\u0443\u043A\u0432 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432"
                              }
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/admin/InitiativeTypes.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "\u0410\u0413\u0410. \u0421\u043F\u0438\u0441\u043E\u043A \u0442\u0438\u043F\u043E\u0432" });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/client/types/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
