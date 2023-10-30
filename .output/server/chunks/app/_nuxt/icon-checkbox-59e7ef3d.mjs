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
const _hoisted_3 = /* @__PURE__ */ createElementVNode("path", { d: "m9 11 3 3 8-8" }, null, -1);
const _hoisted_4 = /* @__PURE__ */ createElementVNode("path", { d: "M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" }, null, -1);
const _hoisted_5 = [
  _hoisted_2,
  _hoisted_3,
  _hoisted_4
];
function render(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1, [..._hoisted_5]);
}
const IconActive = { render };

export { IconActive as default, render };
