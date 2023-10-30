import { useSSRContext, defineComponent, ref, unref, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { _ as __nuxt_component_0 } from './nuxt-img-8eb61343.mjs';
import IconTrash from './icon-trash-be4099c2.mjs';
import IconRestore from './icon-restore-25d99875.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "PhotosListItem",
  __ssrInlineRender: true,
  props: {
    item: Object,
    moderation: {
      type: Boolean,
      default: true
    }
  },
  emits: ["deleted"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const deleted = ref(props.item.isDeleted || false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative w-[150px] h-[112px]" }, _attrs))}>`);
      if (__props.moderation) {
        _push(`<div>`);
        if (unref(deleted)) {
          _push(`<div class="absolute z-20 right-0 top-0 w-6 h-6 p-1 bg-main hover:bg-second text-white cursor-pointer rounded-tr rounded-bl">`);
          _push(ssrRenderComponent(unref(IconRestore), { filled: "" }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<div class="absolute z-20 right-0 top-0 w-6 h-6 p-1 bg-dark-light hover:bg-red-600 text-white cursor-pointer rounded-tr rounded-bl">`);
          _push(ssrRenderComponent(unref(IconTrash), { filled: "" }, null, _parent));
          _push(`</div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: __props.item.path,
        format: "webp",
        quality: "85",
        aspect: "4/3",
        class: "w-full h-full rounded object-cover"
      }, null, _parent));
      if (__props.moderation) {
        _push(`<div>`);
        if (unref(deleted)) {
          _push(`<div class="absolute z-10 top-0 left-0 right-0 bottom-0 backdrop-blur-md bg-dark-light/60 flex items-center justify-center text-white rounded">DELETED</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/admin/photos/PhotosListItem.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PhotosList",
  __ssrInlineRender: true,
  props: {
    photos: Object,
    moderation: {
      type: Boolean,
      default: true
    }
  },
  emits: ["updated"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const photosList = ref(props.photos || []);
    const emit = __emit;
    __expose({ update });
    const onDelete = (status, id) => {
      const photos = props.photos;
      const changed = photos.find((item) => (item == null ? void 0 : item.id) === id);
      if (changed) {
        changed.isDeleted = status;
      }
      emit("updated");
    };
    function update(photos) {
      photosList.value = photos;
    }
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(photosList).length) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex gap-2 mb-4" }, _attrs))}><!--[-->`);
        ssrRenderList(unref(photosList), (item) => {
          _push(ssrRenderComponent(_sfc_main$1, {
            item,
            key: `photo_${item.id}`,
            moderation: props.moderation,
            onDeleted: onDelete
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/admin/photos/PhotosList.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
