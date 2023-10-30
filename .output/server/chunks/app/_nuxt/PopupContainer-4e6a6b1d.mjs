import { useSSRContext, defineComponent, ref, mergeProps, unref } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from '../server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PopupContainer",
  __ssrInlineRender: true,
  emits: ["close"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose({ show, hide });
    const isPopupVisible = ref(false);
    function show() {
      isPopupVisible.value = true;
    }
    function hide() {
      isPopupVisible.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["popup-container", unref(isPopupVisible) ? "show" : ""]
      }, _attrs))} data-v-6467fe4b>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/PopupContainer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PopupContainer = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6467fe4b"]]);

export { PopupContainer as P };
