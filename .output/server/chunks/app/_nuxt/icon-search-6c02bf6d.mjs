import { openBlock, createElementBlock, createElementVNode } from 'vue';

const _hoisted_1 = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  viewBox: "0 0 24 24"
};
const _hoisted_2 = /* @__PURE__ */ createElementVNode("path", {
  stroke: "none",
  d: "M0 0h24v24H0z"
}, null, -1);
const _hoisted_3 = /* @__PURE__ */ createElementVNode("path", { d: "M3 10a7 7 0 1 0 14 0 7 7 0 1 0-14 0M21 21l-6-6" }, null, -1);
const _hoisted_4 = [
  _hoisted_2,
  _hoisted_3
];
function render(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1, [..._hoisted_4]);
}
const IconSearch = { render };

export { IconSearch as default, render };
