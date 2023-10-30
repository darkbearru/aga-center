import { useSSRContext, defineComponent, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc } from '../server.mjs';
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

const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "ContentAndHeader",
  __ssrInlineRender: true,
  props: {
    title: String
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full md:w-auto" }, _attrs))} data-v-555e6557><h2 data-v-555e6557>${ssrInterpolate(__props.title)}</h2>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/ContentAndHeader.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const ContentAndHeader = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-555e6557"]]);
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "NewsItem",
  __ssrInlineRender: true,
  props: {
    timeShort: String,
    timeInfo: String,
    link: String
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<a${ssrRenderAttrs(mergeProps({
        href: "{{ link }}",
        class: "block px-8 md:px-0 text-dark-light no-underline leading-5 hyphens-auto hover:underline hover:decoration-main hover:text-main",
        lang: "ru"
      }, _attrs))}><time class="text-main pr-2" datetime="{{ timeInfo }}">${ssrInterpolate(__props.timeShort)}</time>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</a>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/content/NewsItem.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "LastNews",
  __ssrInlineRender: true,
  setup(__props) {
    const lastNews = [
      {
        timeShort: "21/06",
        timeInfo: "06-21",
        link: "/news/01",
        title: "\u0417\u0430\u0431\u0430\u0439\u043A\u0430\u043B\u044C\u0435 \u0433\u043E\u0442\u043E\u0432\u043E \u0444\u0438\u043D\u0430\u043D\u0441\u043E\u0432\u043E \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0442\u044C \u043F\u0440\u0435\u0434\u043F\u0440\u0438\u044F\u0442\u0438\u044F, \u0443\u0447\u0430\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0435 \u0432 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0435 \u043F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u043E\u0433\u043E \u0442\u0443\u0440\u0438\u0437\u043C\u0430"
      },
      {
        timeShort: "17/06",
        timeInfo: "06-17",
        link: "/news/02",
        title: "\xABBaikal Travel Mart\xBB: \u043A\u0430\u043A\u0438\u0435 \u0431\u0440\u0435\u043D\u0434\u044B \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u0438\u043B\u0430 \u0411\u0443\u0440\u044F\u0442\u0438\u044F \u043D\u0430 \u0442\u0443\u0440\u0438\u0441\u0442\u0441\u043A\u043E\u0439 \u0432\u044B\u0441\u0442\u0430\u0432\u043A\u0435"
      },
      {
        timeShort: "15/06",
        timeInfo: "06-15",
        link: "/news/03",
        title: "\u041C\u043E\u0436\u0435\u0442 \u043B\u0438 \u0430\u044D\u0440\u043E\u043F\u043E\u0440\u0442 \xAB\u0411\u0430\u0439\u043A\u0430\u043B\xBB \u0441\u0442\u0430\u0442\u044C \u0446\u0435\u043D\u0442\u0440\u043E\u043C \u043F\u0435\u0440\u0435\u0432\u043E\u0437\u043E\u043A \u0420\u043E\u0441\u0441\u0438\u0438 \u0438 \u0430\u0437\u0438\u0430\u0442\u0441\u043A\u0438\u0445 \u0441\u0442\u0440\u0430\u043D?"
      },
      {
        timeShort: "14/06",
        timeInfo: "06-14",
        link: "/news/04",
        title: "\u0417\u0430\u0431\u0430\u0439\u043A\u0430\u043B\u044C\u0435 \u0433\u043E\u0442\u043E\u0432\u043E \u0444\u0438\u043D\u0430\u043D\u0441\u043E\u0432\u043E \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0442\u044C \u043F\u0440\u0435\u0434\u043F\u0440\u0438\u044F\u0442\u0438\u044F, \u0443\u0447\u0430\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0435 \u0432 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0435 \u043F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u043E\u0433\u043E \u0442\u0443\u0440\u0438\u0437\u043C\u0430"
      },
      {
        timeShort: "10/06",
        timeInfo: "06-10",
        link: "/news/05",
        title: "\xABBaikal Travel Mart\xBB: \u043A\u0430\u043A\u0438\u0435 \u0431\u0440\u0435\u043D\u0434\u044B \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u0438\u043B\u0430 \u0411\u0443\u0440\u044F\u0442\u0438\u044F \u043D\u0430 \u0442\u0443\u0440\u0438\u0441\u0442\u0441\u043A\u043E\u0439 \u0432\u044B\u0441\u0442\u0430\u0432\u043A\u0435"
      },
      {
        timeShort: "09/06",
        timeInfo: "06-09",
        link: "/news/06",
        title: "\u041C\u043E\u0436\u0435\u0442 \u043B\u0438 \u0430\u044D\u0440\u043E\u043F\u043E\u0440\u0442 \xAB\u0411\u0430\u0439\u043A\u0430\u043B\xBB \u0441\u0442\u0430\u0442\u044C \u0446\u0435\u043D\u0442\u0440\u043E\u043C \u043F\u0435\u0440\u0435\u0432\u043E\u0437\u043E\u043A \u0420\u043E\u0441\u0441\u0438\u0438 \u0438 \u0430\u0437\u0438\u0430\u0442\u0441\u043A\u0438\u0445 \u0441\u0442\u0440\u0430\u043D?"
      },
      {
        timeShort: "06/06",
        timeInfo: "06-06",
        link: "/news/07",
        title: "\u0417\u0430\u0431\u0430\u0439\u043A\u0430\u043B\u044C\u0435 \u0433\u043E\u0442\u043E\u0432\u043E \u0444\u0438\u043D\u0430\u043D\u0441\u043E\u0432\u043E \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0442\u044C \u043F\u0440\u0435\u0434\u043F\u0440\u0438\u044F\u0442\u0438\u044F, \u0443\u0447\u0430\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0435 \u0432 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0435 \u043F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u043E\u0433\u043E \u0442\u0443\u0440\u0438\u0437\u043C\u0430"
      },
      {
        timeShort: "05/06",
        timeInfo: "06-05",
        link: "/news/08",
        title: "\xABBaikal Travel Mart\xBB: \u043A\u0430\u043A\u0438\u0435 \u0431\u0440\u0435\u043D\u0434\u044B \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u0438\u043B\u0430 \u0411\u0443\u0440\u044F\u0442\u0438\u044F \u043D\u0430 \u0442\u0443\u0440\u0438\u0441\u0442\u0441\u043A\u043E\u0439 \u0432\u044B\u0441\u0442\u0430\u0432\u043A\u0435"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4 mb-4" }, _attrs))}><!--[-->`);
      ssrRenderList(lastNews, (item) => {
        _push(`<div>`);
        _push(ssrRenderComponent(_sfc_main$4, {
          link: item.link,
          "time-info": item.timeInfo,
          "time-short": item.timeShort
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.title)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item.title), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/content/LastNews.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ReviewItem",
  __ssrInlineRender: true,
  props: {
    name: String
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "relative border border-gray-200 p-4 md:p-8 mx-8 mb-6 md:m-0 hyphens-auto text-dark-light",
        lang: "ru"
      }, _attrs))}><h3 class="absolute left-[50%] bottom-[-11px] translate-x-[-50%] text-center bg-white px-2">${ssrInterpolate(__props.name)}</h3>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/content/ReviewItem.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ReviewsList",
  __ssrInlineRender: true,
  setup(__props) {
    const reviews = [
      {
        name: "\u0418\u0433\u043E\u0440\u044C \u0418\u0432\u0430\u043D\u043E\u0432",
        anons: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis."
      },
      {
        name: "\u0418\u0433\u043E\u0440\u044C \u0418\u0432\u0430\u043D\u043E\u0432",
        anons: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis."
      },
      {
        name: "\u0418\u0433\u043E\u0440\u044C \u0418\u0432\u0430\u043D\u043E\u0432",
        anons: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis."
      },
      {
        name: "\u0418\u0433\u043E\u0440\u044C \u0418\u0432\u0430\u043D\u043E\u0432",
        anons: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis."
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-wrap md:flex-nowrap content-stretch justify-start md:gap-8 mb-4" }, _attrs))}><!--[-->`);
      ssrRenderList(reviews, (review) => {
        _push(`<div>`);
        _push(ssrRenderComponent(_sfc_main$2, {
          name: review.name
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(review.anons)}`);
            } else {
              return [
                createTextVNode(toDisplayString(review.anons), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/content/ReviewsList.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-12 md:gap-8 mt-4 md:mt-0 w-full max-w-screen-xl mx-auto my-0" }, _attrs))}>`);
      _push(ssrRenderComponent(ContentAndHeader, {
        class: "order-2 md:order-1 col-span-12 md:col-span-3",
        title: "\u041D\u043E\u0432\u043E\u0441\u0442\u0438 \u043F\u0440\u043E\u0435\u043A\u0442\u0430"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$3, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$3)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(ContentAndHeader, {
        class: "order-1 md:order-2 col-span-12 md:col-span-9",
        title: "\u0421\u043F\u0438\u0441\u043E\u043A \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432"
      }, null, _parent));
      _push(ssrRenderComponent(ContentAndHeader, {
        class: "order-3 md:order-3 col-span-12",
        title: "\u041E\u0442\u0437\u044B\u0432\u044B"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$1, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
