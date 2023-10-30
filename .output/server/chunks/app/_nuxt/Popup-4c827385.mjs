import { _ as __nuxt_component_0 } from './nuxt-link-17df5783.mjs';
import { defineComponent, mergeProps, withCtx, renderSlot, useSSRContext, unref } from 'vue';
import { ssrRenderComponent, ssrRenderSlot, ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import IconClose from './icon-close-344453b8.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Button",
  __ssrInlineRender: true,
  props: {
    to: String
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        class: "rounded px-4 py-1 whitespace-nowrap cursor-pointer",
        to: __props.to
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/Button.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Popup",
  __ssrInlineRender: true,
  props: {
    title: String
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative z-50 pt-4 pb-3 backdrop-blur-md rounded overflow-y-scroll" }, _attrs))}><div class="flex items-center relative h-10 px-6 pt-1 pb-4 mb-4 border-b-[1px] border-b-dark-light">`);
      if (__props.title) {
        _push(`<h3 class="flex-grow font-semibold uppercase text-inherit m-0">${ssrInterpolate(__props.title)}</h3>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="w-5 h-5 text-inherit">`);
      _push(ssrRenderComponent(unref(IconClose), { filled: "" }, null, _parent));
      _push(`</button></div><div class="px-6">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/Popup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main$1 as _, _sfc_main as a };
