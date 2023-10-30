import { defineComponent, mergeProps, useSSRContext, ref, unref, withCtx, isRef, createTextVNode, createVNode, renderSlot } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { F as FormKitLazyProvider, f as formkitComponent } from '../server.mjs';
import { submitForm } from '@formkit/core';
import { a as _sfc_main$2, _ as _sfc_main$1$1 } from './Popup-4c827385.mjs';
import { P as PopupContainer } from './PopupContainer-4e6a6b1d.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ListItem",
  __ssrInlineRender: true,
  props: {
    id: Number,
    title: String,
    text: String
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center px-4 py-3 bg-dark-light/10 odd:bg-white hover:bg-dark-light/20 cursor-pointer round" }, _attrs))}><div class="w-5/12">${ssrInterpolate(props.title)}</div><div class="w-7/12">${ssrInterpolate(props.text)}</div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/admin/moderation/ListItem.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ModerationPopup",
  __ssrInlineRender: true,
  emits: ["approve", "decline"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const popup = ref();
    const titlePopup = ref("");
    const reasonText = ref("");
    const emit = __emit;
    const popupOpen = (title) => {
      titlePopup.value = title;
      reasonText.value = "";
      if (popup.value)
        popup.value.show();
    };
    const popupClose = () => {
      if (popup.value)
        popup.value.hide();
    };
    const approve = () => {
      emit("approve");
      popupClose();
    };
    const declineCheck = () => submitForm("reason_form");
    const getReason = () => reasonText.value;
    const decline = () => {
      emit("decline", unref(reasonText));
      popupClose();
    };
    __expose({ popupOpen, getReason });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormKit = formkitComponent;
      _push(ssrRenderComponent(unref(FormKitLazyProvider), mergeProps({ "config-file": "true" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(PopupContainer, {
              ref_key: "popup",
              ref: popup,
              onClose: popupClose
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$2, {
                    class: "bg-gray-light/60 w-full max-h-full min-w-[300px] max-w-[600px] pb-0",
                    title: unref(titlePopup),
                    onClose: popupClose
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push4, _parent4, _scopeId3);
                        _push4(`<div class="max-w-[600px] formkit-w-full"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_FormKit, {
                          id: "reason_form",
                          type: "form",
                          "submit-label": "\u0412\u043E\u0439\u0442\u0438",
                          config: { validationVisibility: "submit" },
                          actions: false,
                          onSubmit: decline
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_FormKit, {
                                id: "reason",
                                type: "textarea",
                                label: "\u041F\u0440\u0438\u0447\u0438\u043D\u0430 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u044F",
                                placeholder: "\u0412 \u0441\u043B\u0443\u0447\u0430\u0435 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u044F \u0443\u043A\u0430\u0436\u0438\u0442\u0435 \u043F\u0440\u0438\u0447\u0438\u043D\u0443",
                                modelValue: unref(reasonText),
                                "onUpdate:modelValue": ($event) => isRef(reasonText) ? reasonText.value = $event : null,
                                validation: "required",
                                "validation-messages": {
                                  required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u043F\u0440\u0438\u0447\u0438\u043D\u0443 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u044F"
                                }
                              }, null, _parent5, _scopeId4));
                              _push5(`<div class="flex gap-4 mt-4 justify-center"${_scopeId4}>`);
                              _push5(ssrRenderComponent(_sfc_main$1$1, {
                                class: "bg-main hover:bg-second text-white px-10 py-3",
                                onClick: approve
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`\u041F\u0440\u0438\u043D\u044F\u0442\u044C`);
                                  } else {
                                    return [
                                      createTextVNode("\u041F\u0440\u0438\u043D\u044F\u0442\u044C")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_sfc_main$1$1, {
                                class: "bg-red-600 hover:bg-red-800 text-white px-6 py-3",
                                onClick: declineCheck
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`\u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C`);
                                  } else {
                                    return [
                                      createTextVNode("\u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div>`);
                            } else {
                              return [
                                createVNode(_component_FormKit, {
                                  id: "reason",
                                  type: "textarea",
                                  label: "\u041F\u0440\u0438\u0447\u0438\u043D\u0430 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u044F",
                                  placeholder: "\u0412 \u0441\u043B\u0443\u0447\u0430\u0435 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u044F \u0443\u043A\u0430\u0436\u0438\u0442\u0435 \u043F\u0440\u0438\u0447\u0438\u043D\u0443",
                                  modelValue: unref(reasonText),
                                  "onUpdate:modelValue": ($event) => isRef(reasonText) ? reasonText.value = $event : null,
                                  validation: "required",
                                  "validation-messages": {
                                    required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u043F\u0440\u0438\u0447\u0438\u043D\u0443 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u044F"
                                  }
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode("div", { class: "flex gap-4 mt-4 justify-center" }, [
                                  createVNode(_sfc_main$1$1, {
                                    class: "bg-main hover:bg-second text-white px-10 py-3",
                                    onClick: approve
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("\u041F\u0440\u0438\u043D\u044F\u0442\u044C")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_sfc_main$1$1, {
                                    class: "bg-red-600 hover:bg-red-800 text-white px-6 py-3",
                                    onClick: declineCheck
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("\u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C")
                                    ]),
                                    _: 1
                                  })
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          renderSlot(_ctx.$slots, "default"),
                          createVNode("div", { class: "max-w-[600px] formkit-w-full" }, [
                            createVNode(_component_FormKit, {
                              id: "reason_form",
                              type: "form",
                              "submit-label": "\u0412\u043E\u0439\u0442\u0438",
                              config: { validationVisibility: "submit" },
                              actions: false,
                              onSubmit: decline
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_FormKit, {
                                  id: "reason",
                                  type: "textarea",
                                  label: "\u041F\u0440\u0438\u0447\u0438\u043D\u0430 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u044F",
                                  placeholder: "\u0412 \u0441\u043B\u0443\u0447\u0430\u0435 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u044F \u0443\u043A\u0430\u0436\u0438\u0442\u0435 \u043F\u0440\u0438\u0447\u0438\u043D\u0443",
                                  modelValue: unref(reasonText),
                                  "onUpdate:modelValue": ($event) => isRef(reasonText) ? reasonText.value = $event : null,
                                  validation: "required",
                                  "validation-messages": {
                                    required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u043F\u0440\u0438\u0447\u0438\u043D\u0443 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u044F"
                                  }
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode("div", { class: "flex gap-4 mt-4 justify-center" }, [
                                  createVNode(_sfc_main$1$1, {
                                    class: "bg-main hover:bg-second text-white px-10 py-3",
                                    onClick: approve
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("\u041F\u0440\u0438\u043D\u044F\u0442\u044C")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_sfc_main$1$1, {
                                    class: "bg-red-600 hover:bg-red-800 text-white px-6 py-3",
                                    onClick: declineCheck
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("\u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C")
                                    ]),
                                    _: 1
                                  })
                                ])
                              ]),
                              _: 1
                            })
                          ])
                        ];
                      }
                    }),
                    _: 3
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$2, {
                      class: "bg-gray-light/60 w-full max-h-full min-w-[300px] max-w-[600px] pb-0",
                      title: unref(titlePopup),
                      onClose: popupClose
                    }, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "default"),
                        createVNode("div", { class: "max-w-[600px] formkit-w-full" }, [
                          createVNode(_component_FormKit, {
                            id: "reason_form",
                            type: "form",
                            "submit-label": "\u0412\u043E\u0439\u0442\u0438",
                            config: { validationVisibility: "submit" },
                            actions: false,
                            onSubmit: decline
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_FormKit, {
                                id: "reason",
                                type: "textarea",
                                label: "\u041F\u0440\u0438\u0447\u0438\u043D\u0430 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u044F",
                                placeholder: "\u0412 \u0441\u043B\u0443\u0447\u0430\u0435 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u044F \u0443\u043A\u0430\u0436\u0438\u0442\u0435 \u043F\u0440\u0438\u0447\u0438\u043D\u0443",
                                modelValue: unref(reasonText),
                                "onUpdate:modelValue": ($event) => isRef(reasonText) ? reasonText.value = $event : null,
                                validation: "required",
                                "validation-messages": {
                                  required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u043F\u0440\u0438\u0447\u0438\u043D\u0443 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u044F"
                                }
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode("div", { class: "flex gap-4 mt-4 justify-center" }, [
                                createVNode(_sfc_main$1$1, {
                                  class: "bg-main hover:bg-second text-white px-10 py-3",
                                  onClick: approve
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("\u041F\u0440\u0438\u043D\u044F\u0442\u044C")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_sfc_main$1$1, {
                                  class: "bg-red-600 hover:bg-red-800 text-white px-6 py-3",
                                  onClick: declineCheck
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("\u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C")
                                  ]),
                                  _: 1
                                })
                              ])
                            ]),
                            _: 1
                          })
                        ])
                      ]),
                      _: 3
                    }, 8, ["title"])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(PopupContainer, {
                ref_key: "popup",
                ref: popup,
                onClose: popupClose
              }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$2, {
                    class: "bg-gray-light/60 w-full max-h-full min-w-[300px] max-w-[600px] pb-0",
                    title: unref(titlePopup),
                    onClose: popupClose
                  }, {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "default"),
                      createVNode("div", { class: "max-w-[600px] formkit-w-full" }, [
                        createVNode(_component_FormKit, {
                          id: "reason_form",
                          type: "form",
                          "submit-label": "\u0412\u043E\u0439\u0442\u0438",
                          config: { validationVisibility: "submit" },
                          actions: false,
                          onSubmit: decline
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_FormKit, {
                              id: "reason",
                              type: "textarea",
                              label: "\u041F\u0440\u0438\u0447\u0438\u043D\u0430 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u044F",
                              placeholder: "\u0412 \u0441\u043B\u0443\u0447\u0430\u0435 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u044F \u0443\u043A\u0430\u0436\u0438\u0442\u0435 \u043F\u0440\u0438\u0447\u0438\u043D\u0443",
                              modelValue: unref(reasonText),
                              "onUpdate:modelValue": ($event) => isRef(reasonText) ? reasonText.value = $event : null,
                              validation: "required",
                              "validation-messages": {
                                required: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u043F\u0440\u0438\u0447\u0438\u043D\u0443 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u044F"
                              }
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode("div", { class: "flex gap-4 mt-4 justify-center" }, [
                              createVNode(_sfc_main$1$1, {
                                class: "bg-main hover:bg-second text-white px-10 py-3",
                                onClick: approve
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("\u041F\u0440\u0438\u043D\u044F\u0442\u044C")
                                ]),
                                _: 1
                              }),
                              createVNode(_sfc_main$1$1, {
                                class: "bg-red-600 hover:bg-red-800 text-white px-6 py-3",
                                onClick: declineCheck
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("\u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C")
                                ]),
                                _: 1
                              })
                            ])
                          ]),
                          _: 1
                        })
                      ])
                    ]),
                    _: 3
                  }, 8, ["title"])
                ]),
                _: 3
              }, 512)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/admin/moderation/ModerationPopup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main$1 as _, _sfc_main as a };
