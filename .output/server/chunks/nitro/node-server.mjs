globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import http, { Server as Server$1 } from 'node:http';
import https, { Server } from 'node:https';
import { promises, existsSync } from 'fs';
import { dirname as dirname$1, resolve as resolve$1, join } from 'path';
import { promises as promises$1 } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import * as nodemailer from 'nodemailer';
import { ipxFSStorage, ipxHttpStorage, createIPX, createIPXH3Handler } from 'ipx';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  const _value = value.trim();
  if (
    // eslint-disable-next-line unicorn/prefer-at
    value[0] === '"' && value.at(-1) === '"' && !value.includes("\\")
  ) {
    return _value.slice(1, -1);
  }
  if (_value.length <= 9) {
    const _lval = _value.toLowerCase();
    if (_lval === "true") {
      return true;
    }
    if (_lval === "false") {
      return false;
    }
    if (_lval === "undefined") {
      return void 0;
    }
    if (_lval === "null") {
      return null;
    }
    if (_lval === "nan") {
      return Number.NaN;
    }
    if (_lval === "infinity") {
      return Number.POSITIVE_INFINITY;
    }
    if (_lval === "-infinity") {
      return Number.NEGATIVE_INFINITY;
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
const ENC_ENC_SLASH_RE = /%252f/gi;
function encode$1(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode$1(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return encode$1(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F").replace(ENC_ENC_SLASH_RE, "%2F").replace(AMPERSAND_RE, "%26").replace(PLUS_RE, "%2B");
}
function encodeParam(text) {
  return encodePath(text).replace(SLASH_RE, "%2F");
}
function decode$1(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode$1(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = {};
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map((_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}
const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
const PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
function isScriptProtocol(protocol) {
  return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
const TRAILING_SLASH_RE = /\/$|\/\?/;
function hasTrailingSlash(input = "", queryParameters = false) {
  if (!queryParameters) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", queryParameters = false) {
  if (!queryParameters) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  const [s0, ...s] = input.split("?");
  return (s0.slice(0, -1) || "/") + (s.length > 0 ? `?${s.join("?")}` : "");
}
function withTrailingSlash(input = "", queryParameters = false) {
  if (!queryParameters) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  const [s0, ...s] = input.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "");
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery$1(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}

function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto,
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return defaultProto ? parseURL(defaultProto + input) : parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  const [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  const { pathname, search, hash } = parsePath(
    path.replace(/\/(?=[A-Za-z]:)/, "")
  );
  return {
    protocol,
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol ? parsed.protocol + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = options || {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function serialize(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encode;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low":
        str += "; Priority=Low";
        break;
      case "medium":
        str += "; Priority=Medium";
        break;
      case "high":
        str += "; Priority=High";
        break;
      default:
        throw new TypeError("option priority is invalid");
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true:
        str += "; SameSite=Strict";
        break;
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function encode(val) {
  return encodeURIComponent(val);
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    // @ts-ignore
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode !== void 0) {
      node = nextNode;
    } else {
      node = node.placeholderChildNode;
      if (node !== null) {
        params[node.paramName] = section;
        paramsFound = true;
      } else {
        break;
      }
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildNode = childNode;
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      node = childNode;
    }
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections[sections.length - 1];
    node.data = null;
    if (Object.keys(node.children).length === 0) {
      const parentNode = node.parent;
      parentNode.children.delete(lastSection);
      parentNode.wildcardChildNode = null;
      parentNode.placeholderChildNode = null;
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildNode: null
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table);
}
function _createMatcher(table) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table) {
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path.startsWith(key)) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        table.static.set(path, node.data);
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!_isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (_isPlainObject(value) && _isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function _isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function rawHeaders(headers) {
  const rawHeaders2 = [];
  for (const key in headers) {
    if (Array.isArray(headers[key])) {
      for (const h of headers[key]) {
        rawHeaders2.push(key, h);
      }
    } else {
      rawHeaders2.push(key, headers[key]);
    }
  }
  return rawHeaders2;
}
function mergeFns(...functions) {
  return function(...args) {
    for (const fn of functions) {
      fn(...args);
    }
  };
}
function createNotImplementedError(name) {
  throw new Error(`[unenv] ${name} is not implemented yet!`);
}

let defaultMaxListeners = 10;
let EventEmitter$1 = class EventEmitter {
  __unenv__ = true;
  _events = /* @__PURE__ */ Object.create(null);
  _maxListeners;
  static get defaultMaxListeners() {
    return defaultMaxListeners;
  }
  static set defaultMaxListeners(arg) {
    if (typeof arg !== "number" || arg < 0 || Number.isNaN(arg)) {
      throw new RangeError(
        'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + "."
      );
    }
    defaultMaxListeners = arg;
  }
  setMaxListeners(n) {
    if (typeof n !== "number" || n < 0 || Number.isNaN(n)) {
      throw new RangeError(
        'The value of "n" is out of range. It must be a non-negative number. Received ' + n + "."
      );
    }
    this._maxListeners = n;
    return this;
  }
  getMaxListeners() {
    return _getMaxListeners(this);
  }
  emit(type, ...args) {
    if (!this._events[type] || this._events[type].length === 0) {
      return false;
    }
    if (type === "error") {
      let er;
      if (args.length > 0) {
        er = args[0];
      }
      if (er instanceof Error) {
        throw er;
      }
      const err = new Error(
        "Unhandled error." + (er ? " (" + er.message + ")" : "")
      );
      err.context = er;
      throw err;
    }
    for (const _listener of this._events[type]) {
      (_listener.listener || _listener).apply(this, args);
    }
    return true;
  }
  addListener(type, listener) {
    return _addListener(this, type, listener, false);
  }
  on(type, listener) {
    return _addListener(this, type, listener, false);
  }
  prependListener(type, listener) {
    return _addListener(this, type, listener, true);
  }
  once(type, listener) {
    return this.on(type, _wrapOnce(this, type, listener));
  }
  prependOnceListener(type, listener) {
    return this.prependListener(type, _wrapOnce(this, type, listener));
  }
  removeListener(type, listener) {
    return _removeListener(this, type, listener);
  }
  off(type, listener) {
    return this.removeListener(type, listener);
  }
  removeAllListeners(type) {
    return _removeAllListeners(this, type);
  }
  listeners(type) {
    return _listeners(this, type, true);
  }
  rawListeners(type) {
    return _listeners(this, type, false);
  }
  listenerCount(type) {
    return this.rawListeners(type).length;
  }
  eventNames() {
    return Object.keys(this._events);
  }
};
function _addListener(target, type, listener, prepend) {
  _checkListener(listener);
  if (target._events.newListener !== void 0) {
    target.emit("newListener", type, listener.listener || listener);
  }
  if (!target._events[type]) {
    target._events[type] = [];
  }
  if (prepend) {
    target._events[type].unshift(listener);
  } else {
    target._events[type].push(listener);
  }
  const maxListeners = _getMaxListeners(target);
  if (maxListeners > 0 && target._events[type].length > maxListeners && !target._events[type].warned) {
    target._events[type].warned = true;
    const warning = new Error(
      `[unenv] Possible EventEmitter memory leak detected. ${target._events[type].length} ${type} listeners added. Use emitter.setMaxListeners() to increase limit`
    );
    warning.name = "MaxListenersExceededWarning";
    warning.emitter = target;
    warning.type = type;
    warning.count = target._events[type]?.length;
    console.warn(warning);
  }
  return target;
}
function _removeListener(target, type, listener) {
  _checkListener(listener);
  if (!target._events[type] || target._events[type].length === 0) {
    return target;
  }
  const lenBeforeFilter = target._events[type].length;
  target._events[type] = target._events[type].filter((fn) => fn !== listener);
  if (lenBeforeFilter === target._events[type].length) {
    return target;
  }
  if (target._events.removeListener) {
    target.emit("removeListener", type, listener.listener || listener);
  }
  if (target._events[type].length === 0) {
    delete target._events[type];
  }
  return target;
}
function _removeAllListeners(target, type) {
  if (!target._events[type] || target._events[type].length === 0) {
    return target;
  }
  if (target._events.removeListener) {
    for (const _listener of target._events[type]) {
      target.emit("removeListener", type, _listener.listener || _listener);
    }
  }
  delete target._events[type];
  return target;
}
function _wrapOnce(target, type, listener) {
  let fired = false;
  const wrapper = (...args) => {
    if (fired) {
      return;
    }
    target.removeListener(type, wrapper);
    fired = true;
    return args.length === 0 ? listener.call(target) : listener.apply(target, args);
  };
  wrapper.listener = listener;
  return wrapper;
}
function _getMaxListeners(target) {
  return target._maxListeners ?? EventEmitter$1.defaultMaxListeners;
}
function _listeners(target, type, unwrap) {
  let listeners = target._events[type];
  if (typeof listeners === "function") {
    listeners = [listeners];
  }
  return unwrap ? listeners.map((l) => l.listener || l) : listeners;
}
function _checkListener(listener) {
  if (typeof listener !== "function") {
    throw new TypeError(
      'The "listener" argument must be of type Function. Received type ' + typeof listener
    );
  }
}

const EventEmitter = globalThis.EventEmitter || EventEmitter$1;

class _Readable extends EventEmitter {
  __unenv__ = true;
  readableEncoding = null;
  readableEnded = true;
  readableFlowing = false;
  readableHighWaterMark = 0;
  readableLength = 0;
  readableObjectMode = false;
  readableAborted = false;
  readableDidRead = false;
  closed = false;
  errored = null;
  readable = false;
  destroyed = false;
  static from(_iterable, options) {
    return new _Readable(options);
  }
  constructor(_opts) {
    super();
  }
  _read(_size) {
  }
  read(_size) {
  }
  setEncoding(_encoding) {
    return this;
  }
  pause() {
    return this;
  }
  resume() {
    return this;
  }
  isPaused() {
    return true;
  }
  unpipe(_destination) {
    return this;
  }
  unshift(_chunk, _encoding) {
  }
  wrap(_oldStream) {
    return this;
  }
  push(_chunk, _encoding) {
    return false;
  }
  _destroy(_error, _callback) {
    this.removeAllListeners();
  }
  destroy(error) {
    this.destroyed = true;
    this._destroy(error);
    return this;
  }
  pipe(_destenition, _options) {
    return {};
  }
  compose(stream, options) {
    throw new Error("[unenv] Method not implemented.");
  }
  [Symbol.asyncDispose]() {
    this.destroy();
    return Promise.resolve();
  }
  async *[Symbol.asyncIterator]() {
    throw createNotImplementedError("Readable.asyncIterator");
  }
  iterator(options) {
    throw createNotImplementedError("Readable.iterator");
  }
  map(fn, options) {
    throw createNotImplementedError("Readable.map");
  }
  filter(fn, options) {
    throw createNotImplementedError("Readable.filter");
  }
  forEach(fn, options) {
    throw createNotImplementedError("Readable.forEach");
  }
  reduce(fn, initialValue, options) {
    throw createNotImplementedError("Readable.reduce");
  }
  find(fn, options) {
    throw createNotImplementedError("Readable.find");
  }
  findIndex(fn, options) {
    throw createNotImplementedError("Readable.findIndex");
  }
  some(fn, options) {
    throw createNotImplementedError("Readable.some");
  }
  toArray(options) {
    throw createNotImplementedError("Readable.toArray");
  }
  every(fn, options) {
    throw createNotImplementedError("Readable.every");
  }
  flatMap(fn, options) {
    throw createNotImplementedError("Readable.flatMap");
  }
  drop(limit, options) {
    throw createNotImplementedError("Readable.drop");
  }
  take(limit, options) {
    throw createNotImplementedError("Readable.take");
  }
  asIndexedPairs(options) {
    throw createNotImplementedError("Readable.asIndexedPairs");
  }
}
const Readable = globalThis.Readable || _Readable;

class _Writable extends EventEmitter {
  __unenv__ = true;
  writable = true;
  writableEnded = false;
  writableFinished = false;
  writableHighWaterMark = 0;
  writableLength = 0;
  writableObjectMode = false;
  writableCorked = 0;
  closed = false;
  errored = null;
  writableNeedDrain = false;
  destroyed = false;
  _data;
  _encoding = "utf-8";
  constructor(_opts) {
    super();
  }
  pipe(_destenition, _options) {
    return {};
  }
  _write(chunk, encoding, callback) {
    if (this.writableEnded) {
      if (callback) {
        callback();
      }
      return;
    }
    if (this._data === void 0) {
      this._data = chunk;
    } else {
      const a = typeof this._data === "string" ? Buffer.from(this._data, this._encoding || encoding || "utf8") : this._data;
      const b = typeof chunk === "string" ? Buffer.from(chunk, encoding || this._encoding || "utf8") : chunk;
      this._data = Buffer.concat([a, b]);
    }
    this._encoding = encoding;
    if (callback) {
      callback();
    }
  }
  _writev(_chunks, _callback) {
  }
  _destroy(_error, _callback) {
  }
  _final(_callback) {
  }
  write(chunk, arg2, arg3) {
    const encoding = typeof arg2 === "string" ? this._encoding : "utf-8";
    const cb = typeof arg2 === "function" ? arg2 : typeof arg3 === "function" ? arg3 : void 0;
    this._write(chunk, encoding, cb);
    return true;
  }
  setDefaultEncoding(_encoding) {
    return this;
  }
  end(arg1, arg2, arg3) {
    const callback = typeof arg1 === "function" ? arg1 : typeof arg2 === "function" ? arg2 : typeof arg3 === "function" ? arg3 : void 0;
    if (this.writableEnded) {
      if (callback) {
        callback();
      }
      return this;
    }
    const data = arg1 === callback ? void 0 : arg1;
    if (data) {
      const encoding = arg2 === callback ? void 0 : arg2;
      this.write(data, encoding, callback);
    }
    this.writableEnded = true;
    this.writableFinished = true;
    this.emit("close");
    this.emit("finish");
    return this;
  }
  cork() {
  }
  uncork() {
  }
  destroy(_error) {
    this.destroyed = true;
    delete this._data;
    this.removeAllListeners();
    return this;
  }
  compose(stream, options) {
    throw new Error("[h3] Method not implemented.");
  }
}
const Writable = globalThis.Writable || _Writable;

const __Duplex = class {
  allowHalfOpen = true;
  _destroy;
  constructor(readable = new Readable(), writable = new Writable()) {
    Object.assign(this, readable);
    Object.assign(this, writable);
    this._destroy = mergeFns(readable._destroy, writable._destroy);
  }
};
function getDuplex() {
  Object.assign(__Duplex.prototype, Readable.prototype);
  Object.assign(__Duplex.prototype, Writable.prototype);
  return __Duplex;
}
const _Duplex = /* @__PURE__ */ getDuplex();
const Duplex = globalThis.Duplex || _Duplex;

class Socket extends Duplex {
  __unenv__ = true;
  bufferSize = 0;
  bytesRead = 0;
  bytesWritten = 0;
  connecting = false;
  destroyed = false;
  pending = false;
  localAddress = "";
  localPort = 0;
  remoteAddress = "";
  remoteFamily = "";
  remotePort = 0;
  readyState = "readOnly";
  constructor(_options) {
    super();
  }
  write(_buffer, _arg1, _arg2) {
    return false;
  }
  connect(_arg1, _arg2, _arg3) {
    return this;
  }
  end(_arg1, _arg2, _arg3) {
    return this;
  }
  setEncoding(_encoding) {
    return this;
  }
  pause() {
    return this;
  }
  resume() {
    return this;
  }
  setTimeout(_timeout, _callback) {
    return this;
  }
  setNoDelay(_noDelay) {
    return this;
  }
  setKeepAlive(_enable, _initialDelay) {
    return this;
  }
  address() {
    return {};
  }
  unref() {
    return this;
  }
  ref() {
    return this;
  }
  resetAndDestroy() {
    const err = new Error("ERR_SOCKET_CLOSED");
    err.code = "ERR_SOCKET_CLOSED";
    this.destroy(err);
    return this;
  }
}

class IncomingMessage extends Readable {
  __unenv__ = {};
  aborted = false;
  httpVersion = "1.1";
  httpVersionMajor = 1;
  httpVersionMinor = 1;
  complete = true;
  connection;
  socket;
  headers = {};
  trailers = {};
  method = "GET";
  url = "/";
  statusCode = 200;
  statusMessage = "";
  closed = false;
  errored = null;
  readable = false;
  constructor(socket) {
    super();
    this.socket = this.connection = socket || new Socket();
  }
  get rawHeaders() {
    return rawHeaders(this.headers);
  }
  get rawTrailers() {
    return [];
  }
  setTimeout(_msecs, _callback) {
    return this;
  }
  get headersDistinct() {
    return _distinct(this.headers);
  }
  get trailersDistinct() {
    return _distinct(this.trailers);
  }
}
function _distinct(obj) {
  const d = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key) {
      d[key] = (Array.isArray(value) ? value : [value]).filter(
        Boolean
      );
    }
  }
  return d;
}

class ServerResponse extends Writable {
  __unenv__ = true;
  statusCode = 200;
  statusMessage = "";
  upgrading = false;
  chunkedEncoding = false;
  shouldKeepAlive = false;
  useChunkedEncodingByDefault = false;
  sendDate = false;
  finished = false;
  headersSent = false;
  strictContentLength = false;
  connection = null;
  socket = null;
  req;
  _headers = {};
  constructor(req) {
    super();
    this.req = req;
  }
  assignSocket(socket) {
    socket._httpMessage = this;
    this.socket = socket;
    this.connection = socket;
    this.emit("socket", socket);
    this._flush();
  }
  _flush() {
    this.flushHeaders();
  }
  detachSocket(_socket) {
  }
  writeContinue(_callback) {
  }
  writeHead(statusCode, arg1, arg2) {
    if (statusCode) {
      this.statusCode = statusCode;
    }
    if (typeof arg1 === "string") {
      this.statusMessage = arg1;
      arg1 = void 0;
    }
    const headers = arg2 || arg1;
    if (headers) {
      if (Array.isArray(headers)) ; else {
        for (const key in headers) {
          this.setHeader(key, headers[key]);
        }
      }
    }
    this.headersSent = true;
    return this;
  }
  writeProcessing() {
  }
  setTimeout(_msecs, _callback) {
    return this;
  }
  appendHeader(name, value) {
    name = name.toLowerCase();
    const current = this._headers[name];
    const all = [
      ...Array.isArray(current) ? current : [current],
      ...Array.isArray(value) ? value : [value]
    ].filter(Boolean);
    this._headers[name] = all.length > 1 ? all : all[0];
    return this;
  }
  setHeader(name, value) {
    this._headers[name.toLowerCase()] = value;
    return this;
  }
  getHeader(name) {
    return this._headers[name.toLowerCase()];
  }
  getHeaders() {
    return this._headers;
  }
  getHeaderNames() {
    return Object.keys(this._headers);
  }
  hasHeader(name) {
    return name.toLowerCase() in this._headers;
  }
  removeHeader(name) {
    delete this._headers[name.toLowerCase()];
  }
  addTrailers(_headers) {
  }
  flushHeaders() {
  }
  writeEarlyHints(_headers, cb) {
    if (typeof cb === "function") {
      cb();
    }
  }
}

function useBase(base, handler) {
  base = withoutTrailingSlash(base);
  if (!base || base === "/") {
    return handler;
  }
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _path = event._path || event.node.req.url || "/";
    event._path = withoutBase(event.path || "/", base);
    event.node.req.url = event._path;
    try {
      return await handler(event);
    } finally {
      event._path = event.node.req.url = _path;
    }
  });
}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

var __defProp$1$1 = Object.defineProperty;
var __defNormalProp$1$1 = (obj, key, value) => key in obj ? __defProp$1$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1$1 = (obj, key, value) => {
  __defNormalProp$1$1(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class H3Error extends Error {
  constructor(message, opts = {}) {
    super(message, opts);
    __publicField$1$1(this, "statusCode", 500);
    __publicField$1$1(this, "fatal", false);
    __publicField$1$1(this, "unhandled", false);
    __publicField$1$1(this, "statusMessage");
    __publicField$1$1(this, "data");
    __publicField$1$1(this, "cause");
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
__publicField$1$1(H3Error, "__h3_error__", true);
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function getQuery(event) {
  return getQuery$1(event.path || "");
}
function getRouterParams(event) {
  return event.context.params || {};
}
function getRouterParam(event, name) {
  const params = getRouterParams(event);
  return params[name];
}
function isMethod(event, expected, allowHead) {
  if (allowHead && event.method === "HEAD") {
    return true;
  }
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected, allowHead)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
const getHeaders = getRequestHeaders;
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}

const RawBodySymbol = Symbol.for("h3RawBody");
const ParsedBodySymbol = Symbol.for("h3ParsedBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "")) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
async function readBody(event, options = {}) {
  const request = event.node.req;
  if (hasProp(request, ParsedBodySymbol)) {
    return request[ParsedBodySymbol];
  }
  const contentType = request.headers["content-type"] || "";
  const body = await readRawBody(event);
  let parsed;
  if (contentType === "application/json") {
    parsed = _parseJSON(body, options.strict ?? true);
  } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
    parsed = _parseURLEncodedBody(body);
  } else if (contentType.startsWith("text/")) {
    parsed = body;
  } else {
    parsed = _parseJSON(body, options.strict ?? false);
  }
  request[ParsedBodySymbol] = parsed;
  return parsed;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  return event.web?.request?.body || event._requestBody || new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}
function _parseJSON(body = "", strict) {
  if (!body) {
    return void 0;
  }
  try {
    return destr(body, { strict });
  } catch {
    throw createError$1({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Invalid JSON body"
    });
  }
}
function _parseURLEncodedBody(body) {
  const form = new URLSearchParams(body);
  const parsedForm = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of form.entries()) {
    if (hasProp(parsedForm, key)) {
      if (!Array.isArray(parsedForm[key])) {
        parsedForm[key] = [parsedForm[key]];
      }
      parsedForm[key].push(value);
    } else {
      parsedForm[key] = value;
    }
  }
  return parsedForm;
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= opts.modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function parseCookies(event) {
  return parse(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions) {
  const cookieStr = serialize(name, value, {
    path: "/",
    ...serializeOptions
  });
  let setCookies = event.node.res.getHeader("set-cookie");
  if (!Array.isArray(setCookies)) {
    setCookies = [setCookies];
  }
  setCookies = setCookies.filter((cookieValue) => {
    return cookieValue && !cookieValue.startsWith(name + "=");
  });
  event.node.res.setHeader("set-cookie", [...setCookies, cookieStr]);
}
function deleteCookie(event, name, serializeOptions) {
  setCookie(event, name, "", {
    ...serializeOptions,
    maxAge: 0
  });
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start, cookiesString.length));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(name, value);
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders(
    getProxyRequestHeaders(event),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  const response = await _getFetch(opts.fetch)(target, {
    headers: opts.headers,
    ignoreResponseError: true,
    // make $ofetch.raw transparent
    ...opts.fetchOptions
  });
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name)) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    for (const [key, value] of Object.entries(input)) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => {
  __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class H3Event {
  constructor(req, res) {
    __publicField$2(this, "__is_event__", true);
    // Context
    __publicField$2(this, "node");
    // Node
    __publicField$2(this, "web");
    // Web
    __publicField$2(this, "context", {});
    // Shared
    // Request
    __publicField$2(this, "_method");
    __publicField$2(this, "_path");
    __publicField$2(this, "_headers");
    __publicField$2(this, "_requestBody");
    // Response
    __publicField$2(this, "_handled", false);
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. **/
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. **/
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    return Object.assign(handler, { __is_handler__: true });
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  return Object.assign(_handler, { __is_handler__: true });
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  if (!isEventHandler(input)) {
    console.warn(
      "[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.",
      _route && _route !== "/" ? `
     Route: ${_route}` : "",
      `
     Handler: ${input}`
    );
  }
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler = r.default || r;
        if (typeof handler !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler
          );
        }
        _resolved = toEventHandler(r.default || r);
        return _resolved;
      });
    }
    return _promise;
  };
  return eventHandler((event) => {
    if (_resolved) {
      return _resolved(event);
    }
    return resolveHandler().then((handler) => handler(event));
  });
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const app = {
    // @ts-ignore
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    handler,
    stack,
    options
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(
      normalizeLayer({ ...arg2, route: "/", handler: arg1 })
    );
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _reqPath = event._path || event.node.req.url || "/";
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      await options.onAfterResponse(event, void 0);
    }
  });
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler, void 0, path);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  router.handler = eventHandler((event) => {
    let path = event.path || "/";
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      if (opts.preemptive || opts.preemtive) {
        throw createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${event.path || "/"}.`
        });
      } else {
        return;
      }
    }
    const method = (event.node.req.method || "get").toLowerCase();
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      if (opts.preemptive || opts.preemtive) {
        throw createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        });
      } else {
        return;
      }
    }
    event.context.matchedRoute = matched;
    const params = matched.params || {};
    event.context.params = params;
    return Promise.resolve(handler(event)).then((res) => {
      if (res === void 0 && (opts.preemptive || opts.preemtive)) {
        return null;
      }
      return res;
    });
  });
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      await sendError(event, error, !!app.options.debug);
    }
  };
  return toNodeHandle;
}

const s=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function mergeFetchOptions(input, defaults, Headers = globalThis.Headers) {
  const merged = {
    ...defaults,
    ...input
  };
  if (defaults?.params && input?.params) {
    merged.params = {
      ...defaults?.params,
      ...input?.params
    };
  }
  if (defaults?.query && input?.query) {
    merged.query = {
      ...defaults?.query,
      ...input?.query
    };
  }
  if (defaults?.headers && input?.headers) {
    merged.headers = new Headers(defaults?.headers || {});
    for (const [key, value] of new Headers(input?.headers || {})) {
      merged.headers.set(key, value);
    }
  }
  return merged;
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  //  Gateway Timeout
]);
const nullBodyResponses$1 = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch$1(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1,
          timeout: context.options.timeout
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: mergeFetchOptions(_options, globalOptions.defaults, Headers),
      response: void 0,
      error: void 0
    };
    context.options.method = context.options.method?.toUpperCase();
    if (context.options.onRequest) {
      await context.options.onRequest(context);
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query || context.options.params) {
        context.request = withQuery(context.request, {
          ...context.options.params,
          ...context.options.query
        });
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        context.options.body = typeof context.options.body === "string" ? context.options.body : JSON.stringify(context.options.body);
        context.options.headers = new Headers(context.options.headers || {});
        if (!context.options.headers.has("content-type")) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await context.options.onRequestError(context);
      }
      return await onError(context);
    }
    const hasBody = context.response.body && !nullBodyResponses$1.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await context.options.onResponse(context);
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await context.options.onResponseError(context);
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}) => createFetch$1({
    ...globalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch || createNodeFetch();
const Headers$1 = globalThis.Headers || s;
const AbortController = globalThis.AbortController || i;
const ofetch = createFetch$1({ fetch, Headers: Headers$1, AbortController });
const $fetch = ofetch;

const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createCall(handle) {
  return function callHandle(context) {
    const req = new IncomingMessage();
    const res = new ServerResponse(req);
    req.url = context.url || "/";
    req.method = context.method || "GET";
    req.headers = {};
    if (context.headers) {
      const headerEntries = typeof context.headers.entries === "function" ? context.headers.entries() : Object.entries(context.headers);
      for (const [name, value] of headerEntries) {
        if (!value) {
          continue;
        }
        req.headers[name.toLowerCase()] = value;
      }
    }
    req.headers.host = req.headers.host || context.host || "localhost";
    req.connection.encrypted = // @ts-ignore
    req.connection.encrypted || context.protocol === "https";
    req.body = context.body || null;
    req.__unenv__ = context.context;
    return handle(req, res).then(() => {
      let body = res._data;
      if (nullBodyResponses.has(res.statusCode) || req.method.toUpperCase() === "HEAD") {
        body = null;
        delete res._headers["content-length"];
      }
      const r = {
        body,
        headers: res._headers,
        status: res.statusCode,
        statusText: res.statusMessage
      };
      req.destroy();
      res.destroy();
      return r;
    });
  };
}

function createFetch(call, _fetch = global.fetch) {
  return async function ufetch(input, init) {
    const url = input.toString();
    if (!url.startsWith("/")) {
      return _fetch(url, init);
    }
    try {
      const r = await call({ url, ...init });
      return new Response(r.body, {
        status: r.status,
        statusText: r.statusText,
        headers: Object.fromEntries(
          Object.entries(r.headers).map(([name, value]) => [
            name,
            Array.isArray(value) ? value.join(",") : String(value) || ""
          ])
        )
      });
    } catch (error) {
      return new Response(error.toString(), {
        status: Number.parseInt(error.statusCode || error.code) || 500,
        statusText: error.statusText
      });
    }
  };
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char.toUpperCase() === char;
}
function splitByCase(string_, separators) {
  const splitters = separators ?? STR_SPLITTERS;
  const parts = [];
  if (!string_ || typeof string_ !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of string_) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff[buff.length - 1];
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(string_, joiner) {
  return !string_ ? "" : (Array.isArray(string_) ? string_ : splitByCase(string_)).map((p) => p.toLowerCase()).join(joiner ?? "-");
}
function snakeCase(string_) {
  return kebabCase(string_, "_");
}

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {
  "nuxt": {
    "buildId": "ae958178-3a58-41c8-a5f3-33e8a862460f"
  }
};



const appConfig = defuFn(inlineAppConfig);

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {},
  "ipx": {
    "baseURL": "/_ipx",
    "alias": {},
    "fs": {
      "dir": "../public"
    },
    "http": {
      "domains": []
    }
  }
};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const _sharedRuntimeConfig = _deepFreeze(
  _applyEnv(klona(_inlineRuntimeConfig))
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  _applyEnv(runtimeConfig);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _getEnv(key) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function _applyEnv(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = _getEnv(subKey);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      _applyEnv(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
  return obj;
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const defaults = Object.freeze({
  ignoreUnknown: false,
  respectType: false,
  respectFunctionNames: false,
  respectFunctionProperties: false,
  unorderedObjects: true,
  unorderedArrays: false,
  unorderedSets: false,
  excludeKeys: void 0,
  excludeValues: void 0,
  replacer: void 0
});
function objectHash(object, options) {
  if (options) {
    options = { ...defaults, ...options };
  } else {
    options = defaults;
  }
  const hasher = createHasher(options);
  hasher.dispatch(object);
  return hasher.toString();
}
const defaultPrototypesKeys = Object.freeze([
  "prototype",
  "__proto__",
  "constructor"
]);
function createHasher(options) {
  let buff = "";
  let context = /* @__PURE__ */ new Map();
  const write = (str) => {
    buff += str;
  };
  return {
    toString() {
      return buff;
    },
    getContext() {
      return context;
    },
    dispatch(value) {
      if (options.replacer) {
        value = options.replacer(value);
      }
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    },
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      if (objectLength < 10) {
        objType = "unknown:[" + objString + "]";
      } else {
        objType = objString.slice(8, objectLength - 1);
      }
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = context.get(object)) === void 0) {
        context.set(object, context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        write("buffer:");
        return write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else if (!options.ignoreUnknown) {
          this.unkown(object, objType);
        }
      } else {
        let keys = Object.keys(object);
        if (options.unorderedObjects) {
          keys = keys.sort();
        }
        let extraKeys = [];
        if (options.respectType !== false && !isNativeFunction(object)) {
          extraKeys = defaultPrototypesKeys;
        }
        if (options.excludeKeys) {
          keys = keys.filter((key) => {
            return !options.excludeKeys(key);
          });
          extraKeys = extraKeys.filter((key) => {
            return !options.excludeKeys(key);
          });
        }
        write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          write(":");
          if (!options.excludeValues) {
            this.dispatch(object[key]);
          }
          write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    },
    array(arr, unordered) {
      unordered = unordered === void 0 ? options.unorderedArrays !== false : unordered;
      write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = createHasher(options);
        hasher.dispatch(entry);
        for (const [key, value] of hasher.getContext()) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    },
    date(date) {
      return write("date:" + date.toJSON());
    },
    symbol(sym) {
      return write("symbol:" + sym.toString());
    },
    unkown(value, type) {
      write(type);
      if (!value) {
        return;
      }
      write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          Array.from(value.entries()),
          true
          /* ordered */
        );
      }
    },
    error(err) {
      return write("error:" + err.toString());
    },
    boolean(bool) {
      return write("bool:" + bool);
    },
    string(string) {
      write("string:" + string.length + ":");
      write(string);
    },
    function(fn) {
      write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
      if (options.respectFunctionNames !== false) {
        this.dispatch("function-name:" + String(fn.name));
      }
      if (options.respectFunctionProperties) {
        this.object(fn);
      }
    },
    number(number) {
      return write("number:" + number);
    },
    xml(xml) {
      return write("xml:" + xml.toString());
    },
    null() {
      return write("Null");
    },
    undefined() {
      return write("Undefined");
    },
    regexp(regex) {
      return write("regex:" + regex.toString());
    },
    uint8array(arr) {
      write("uint8array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    uint8clampedarray(arr) {
      write("uint8clampedarray:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    int8array(arr) {
      write("int8array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    uint16array(arr) {
      write("uint16array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    int16array(arr) {
      write("int16array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    uint32array(arr) {
      write("uint32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    int32array(arr) {
      write("int32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    float32array(arr) {
      write("float32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    float64array(arr) {
      write("float64array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    arraybuffer(arr) {
      write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    },
    url(url) {
      return write("url:" + url.toString());
    },
    map(map) {
      write("map:");
      const arr = [...map];
      return this.array(arr, options.unorderedSets !== false);
    },
    set(set) {
      write("set:");
      const arr = [...set];
      return this.array(arr, options.unorderedSets !== false);
    },
    file(file) {
      write("file:");
      return this.dispatch([file.name, file.size, file.type, file.lastModfied]);
    },
    blob() {
      if (options.ignoreUnknown) {
        return write("[blob]");
      }
      throw new Error(
        'Hashing Blob objects is currently not supported\nUse "options.replacer" or "options.ignoreUnknown"\n'
      );
    },
    domwindow() {
      return write("domwindow");
    },
    bigint(number) {
      return write("bigint:" + number.toString());
    },
    /* Node.js standard native objects */
    process() {
      return write("process");
    },
    timer() {
      return write("timer");
    },
    pipe() {
      return write("pipe");
    },
    tcp() {
      return write("tcp");
    },
    udp() {
      return write("udp");
    },
    tty() {
      return write("tty");
    },
    statwatcher() {
      return write("statwatcher");
    },
    securecontext() {
      return write("securecontext");
    },
    connection() {
      return write("connection");
    },
    zlib() {
      return write("zlib");
    },
    context() {
      return write("context");
    },
    nodescript() {
      return write("nodescript");
    },
    httpparser() {
      return write("httpparser");
    },
    dataview() {
      return write("dataview");
    },
    signal() {
      return write("signal");
    },
    fsevent() {
      return write("fsevent");
    },
    tlswrap() {
      return write("tlswrap");
    }
  };
}
const nativeFunc = "[native code] }";
const nativeFuncLength = nativeFunc.length;
function isNativeFunction(f) {
  if (typeof f !== "function") {
    return false;
  }
  return Function.prototype.toString.call(f).slice(-nativeFuncLength) === nativeFunc;
}

class WordArray {
  constructor(words, sigBytes) {
    words = this.words = words || [];
    this.sigBytes = sigBytes === void 0 ? words.length * 4 : sigBytes;
  }
  toString(encoder) {
    return (encoder || Hex).stringify(this);
  }
  concat(wordArray) {
    this.clamp();
    if (this.sigBytes % 4) {
      for (let i = 0; i < wordArray.sigBytes; i++) {
        const thatByte = wordArray.words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
        this.words[this.sigBytes + i >>> 2] |= thatByte << 24 - (this.sigBytes + i) % 4 * 8;
      }
    } else {
      for (let j = 0; j < wordArray.sigBytes; j += 4) {
        this.words[this.sigBytes + j >>> 2] = wordArray.words[j >>> 2];
      }
    }
    this.sigBytes += wordArray.sigBytes;
    return this;
  }
  clamp() {
    this.words[this.sigBytes >>> 2] &= 4294967295 << 32 - this.sigBytes % 4 * 8;
    this.words.length = Math.ceil(this.sigBytes / 4);
  }
  clone() {
    return new WordArray([...this.words]);
  }
}
const Hex = {
  stringify(wordArray) {
    const hexChars = [];
    for (let i = 0; i < wordArray.sigBytes; i++) {
      const bite = wordArray.words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
      hexChars.push((bite >>> 4).toString(16), (bite & 15).toString(16));
    }
    return hexChars.join("");
  }
};
const Base64 = {
  stringify(wordArray) {
    const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const base64Chars = [];
    for (let i = 0; i < wordArray.sigBytes; i += 3) {
      const byte1 = wordArray.words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
      const byte2 = wordArray.words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 255;
      const byte3 = wordArray.words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 255;
      const triplet = byte1 << 16 | byte2 << 8 | byte3;
      for (let j = 0; j < 4 && i * 8 + j * 6 < wordArray.sigBytes * 8; j++) {
        base64Chars.push(keyStr.charAt(triplet >>> 6 * (3 - j) & 63));
      }
    }
    return base64Chars.join("");
  }
};
const Latin1 = {
  parse(latin1Str) {
    const latin1StrLength = latin1Str.length;
    const words = [];
    for (let i = 0; i < latin1StrLength; i++) {
      words[i >>> 2] |= (latin1Str.charCodeAt(i) & 255) << 24 - i % 4 * 8;
    }
    return new WordArray(words, latin1StrLength);
  }
};
const Utf8 = {
  parse(utf8Str) {
    return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
  }
};
class BufferedBlockAlgorithm {
  constructor() {
    this._data = new WordArray();
    this._nDataBytes = 0;
    this._minBufferSize = 0;
    this.blockSize = 512 / 32;
  }
  reset() {
    this._data = new WordArray();
    this._nDataBytes = 0;
  }
  _append(data) {
    if (typeof data === "string") {
      data = Utf8.parse(data);
    }
    this._data.concat(data);
    this._nDataBytes += data.sigBytes;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _doProcessBlock(_dataWords, _offset) {
  }
  _process(doFlush) {
    let processedWords;
    let nBlocksReady = this._data.sigBytes / (this.blockSize * 4);
    if (doFlush) {
      nBlocksReady = Math.ceil(nBlocksReady);
    } else {
      nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
    }
    const nWordsReady = nBlocksReady * this.blockSize;
    const nBytesReady = Math.min(nWordsReady * 4, this._data.sigBytes);
    if (nWordsReady) {
      for (let offset = 0; offset < nWordsReady; offset += this.blockSize) {
        this._doProcessBlock(this._data.words, offset);
      }
      processedWords = this._data.words.splice(0, nWordsReady);
      this._data.sigBytes -= nBytesReady;
    }
    return new WordArray(processedWords, nBytesReady);
  }
}
class Hasher extends BufferedBlockAlgorithm {
  update(messageUpdate) {
    this._append(messageUpdate);
    this._process();
    return this;
  }
  finalize(messageUpdate) {
    if (messageUpdate) {
      this._append(messageUpdate);
    }
  }
}

const H = [
  1779033703,
  -1150833019,
  1013904242,
  -1521486534,
  1359893119,
  -1694144372,
  528734635,
  1541459225
];
const K = [
  1116352408,
  1899447441,
  -1245643825,
  -373957723,
  961987163,
  1508970993,
  -1841331548,
  -1424204075,
  -670586216,
  310598401,
  607225278,
  1426881987,
  1925078388,
  -2132889090,
  -1680079193,
  -1046744716,
  -459576895,
  -272742522,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  -1740746414,
  -1473132947,
  -1341970488,
  -1084653625,
  -958395405,
  -710438585,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  -2117940946,
  -1838011259,
  -1564481375,
  -1474664885,
  -1035236496,
  -949202525,
  -778901479,
  -694614492,
  -200395387,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  -2067236844,
  -1933114872,
  -1866530822,
  -1538233109,
  -1090935817,
  -965641998
];
const W = [];
class SHA256 extends Hasher {
  constructor() {
    super(...arguments);
    this._hash = new WordArray([...H]);
  }
  reset() {
    super.reset();
    this._hash = new WordArray([...H]);
  }
  _doProcessBlock(M, offset) {
    const H2 = this._hash.words;
    let a = H2[0];
    let b = H2[1];
    let c = H2[2];
    let d = H2[3];
    let e = H2[4];
    let f = H2[5];
    let g = H2[6];
    let h = H2[7];
    for (let i = 0; i < 64; i++) {
      if (i < 16) {
        W[i] = M[offset + i] | 0;
      } else {
        const gamma0x = W[i - 15];
        const gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;
        const gamma1x = W[i - 2];
        const gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;
        W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
      }
      const ch = e & f ^ ~e & g;
      const maj = a & b ^ a & c ^ b & c;
      const sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);
      const sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);
      const t1 = h + sigma1 + ch + K[i] + W[i];
      const t2 = sigma0 + maj;
      h = g;
      g = f;
      f = e;
      e = d + t1 | 0;
      d = c;
      c = b;
      b = a;
      a = t1 + t2 | 0;
    }
    H2[0] = H2[0] + a | 0;
    H2[1] = H2[1] + b | 0;
    H2[2] = H2[2] + c | 0;
    H2[3] = H2[3] + d | 0;
    H2[4] = H2[4] + e | 0;
    H2[5] = H2[5] + f | 0;
    H2[6] = H2[6] + g | 0;
    H2[7] = H2[7] + h | 0;
  }
  finalize(messageUpdate) {
    super.finalize(messageUpdate);
    const nBitsTotal = this._nDataBytes * 8;
    const nBitsLeft = this._data.sigBytes * 8;
    this._data.words[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
    this._data.words[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(
      nBitsTotal / 4294967296
    );
    this._data.words[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
    this._data.sigBytes = this._data.words.length * 4;
    this._process();
    return this._hash;
  }
}
function sha256base64(message) {
  return new SHA256().finalize(message).toString(Base64);
}

function hash(object, options = {}) {
  const hashed = typeof object === "string" ? object : objectHash(object, options);
  return sha256base64(hashed).slice(0, 10);
}

function isEqual(object1, object2, hashOptions = {}) {
  if (object1 === object2) {
    return true;
  }
  if (objectHash(object1, hashOptions) === objectHash(object2, hashOptions)) {
    return true;
  }
  return false;
}

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
function checkBufferSupport() {
  if (typeof Buffer === void 0) {
    throw new TypeError("[unstorage] Buffer is not supported!");
  }
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  checkBufferSupport();
  const base64 = Buffer.from(value).toString("base64");
  return BASE64_PREFIX + base64;
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  checkBufferSupport();
  return Buffer.from(value.slice(BASE64_PREFIX.length), "base64");
}

const storageKeyProperties = [
  "hasItem",
  "getItem",
  "getItemRaw",
  "setItem",
  "setItemRaw",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    options: {},
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) || null;
    },
    getItemRaw(key) {
      return data.get(key) || null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return Array.from(data.keys());
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          await asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      for (const mount of mounts) {
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        const keys = rawKeys.map((key) => mount.mountpoint + normalizeKey$1(key)).filter((key) => !maskedMounts.some((p) => key.startsWith(p)));
        allKeys.push(...keys);
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      return base ? allKeys.filter((key) => key.startsWith(base) && !key.endsWith("$")) : allKeys.filter((key) => !key.endsWith("$"));
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    }
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        const dirFiles = await readdirRecursive(entryPath, ignore);
        files.push(...dirFiles.map((f) => entry.name + "/" + f));
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.\:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve$1(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys() {
      return readdirRecursive(r("."), opts.ignore);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"/Users/a_abramenko/Web/Aga/Site/.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          const promise = useStorage().setItem(cacheKey, entry).catch((error) => {
            console.error(`[nitro] [cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event && event.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[nitro] [cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      const _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        variableHeaders[header] = incomingEvent.node.req.headers[header];
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            for (const header in headers2) {
              this.setHeader(header, headers2[header]);
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.context = incomingEvent.context;
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        event.node.res.setHeader(name, value);
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function normalizeError(error) {
  const cwd = typeof process.cwd === "function" ? process.cwd() : "/";
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}
function _captureError(error, type) {
  console.error(`[nitro] [${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(
        event,
        routeRules.redirect.to,
        routeRules.redirect.statusCode
      );
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

const plugins = [
  
];

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.path,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (event.handled) {
    return;
  }
  setResponseStatus(event, errorObject.statusCode !== 200 && errorObject.statusCode || 500, errorObject.statusMessage);
  if (isJsonRequest(event)) {
    setResponseHeader(event, "Content-Type", "application/json");
    return send(event, JSON.stringify(errorObject));
  }
  const isErrorPage = event.path.startsWith("/__nuxt_error");
  const res = !isErrorPage ? await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig().app.baseURL, "/__nuxt_error"), errorObject), {
    headers: getRequestHeaders(event),
    redirect: "manual"
  }).catch(() => null) : null;
  if (!res) {
    const { template } = await import('../error-500.mjs');
    if (event.handled) {
      return;
    }
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  if (event.handled) {
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : void 0, res.statusText);
  return send(event, html);
});

const assets = {
  "/.DS_Store": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"1804-uB0HjLKc62p7yEQbiV0NlreWxsQ\"",
    "mtime": "2023-10-30T01:01:22.478Z",
    "size": 6148,
    "path": "../public/.DS_Store"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"10be-n8egyE9tcb7sKGr/pYCaQ4uWqxI\"",
    "mtime": "2023-10-30T01:01:22.479Z",
    "size": 4286,
    "path": "../public/favicon.ico"
  },
  "/css/nuxt-google-fonts.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2824-5sLaioVYWGyl3nviJxn6NiRJnrM\"",
    "mtime": "2023-10-30T01:01:22.446Z",
    "size": 10276,
    "path": "../public/css/nuxt-google-fonts.css"
  },
  "/images/.DS_Store": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"1804-3y++sUAKzaCQmjLBz2v0kvESHgc\"",
    "mtime": "2023-10-30T01:01:22.479Z",
    "size": 6148,
    "path": "../public/images/.DS_Store"
  },
  "/images/clouds.svg": {
    "type": "image/svg+xml",
    "etag": "\"5303-E04q0xVCznkVUKOZfDViKsc9//U\"",
    "mtime": "2023-10-30T01:01:22.471Z",
    "size": 21251,
    "path": "../public/images/clouds.svg"
  },
  "/images/clouds_bottom.svg": {
    "type": "image/svg+xml",
    "etag": "\"615e-WUKTzUod2CDtul+DVJVZfwuy5m0\"",
    "mtime": "2023-10-30T01:01:22.472Z",
    "size": 24926,
    "path": "../public/images/clouds_bottom.svg"
  },
  "/images/footer_clouds.svg": {
    "type": "image/svg+xml",
    "etag": "\"610c-DreCqr+C98gdlRYbD1NVulVHi4c\"",
    "mtime": "2023-10-30T01:01:22.472Z",
    "size": 24844,
    "path": "../public/images/footer_clouds.svg"
  },
  "/images/forest_bg.svg": {
    "type": "image/svg+xml",
    "etag": "\"2983-lXjLeBxj2rgh3YQ5b4lfxXjDtb0\"",
    "mtime": "2023-10-30T01:01:22.472Z",
    "size": 10627,
    "path": "../public/images/forest_bg.svg"
  },
  "/images/hills_and_sky.jpg": {
    "type": "image/jpeg",
    "etag": "\"661187-LfCcDF1M5SeVn0IgqsMoKNpqr+o\"",
    "mtime": "2023-10-30T01:01:22.479Z",
    "size": 6689159,
    "path": "../public/images/hills_and_sky.jpg"
  },
  "/images/logo-color.svg": {
    "type": "image/svg+xml",
    "etag": "\"2420-AYJGMTO3MszNImmlCkQokxHVpKY\"",
    "mtime": "2023-10-30T01:01:22.476Z",
    "size": 9248,
    "path": "../public/images/logo-color.svg"
  },
  "/images/logo-white.svg": {
    "type": "image/svg+xml",
    "etag": "\"2464-SY3Nvh58UPOxtyItM2mZm3bC76w\"",
    "mtime": "2023-10-30T01:01:22.476Z",
    "size": 9316,
    "path": "../public/images/logo-white.svg"
  },
  "/images/rocks.png": {
    "type": "image/png",
    "etag": "\"38e6d6-9v45LRMJGDz6++jyr7qbR9Uu6DY\"",
    "mtime": "2023-10-30T01:01:22.481Z",
    "size": 3729110,
    "path": "../public/images/rocks.png"
  },
  "/upload/49c352a8fae3fcce04c067200.jpg": {
    "type": "image/jpeg",
    "etag": "\"1094c-QV3DgV4b1kPzODvd5ThWsvS17jM\"",
    "mtime": "2023-10-30T01:01:22.471Z",
    "size": 67916,
    "path": "../public/upload/49c352a8fae3fcce04c067200.jpg"
  },
  "/upload/49c352a8fae3fcce04c067201.jpg": {
    "type": "image/jpeg",
    "etag": "\"5e4d4-wleV6b+1EDMl3yvJyFiwCidnh2A\"",
    "mtime": "2023-10-30T01:01:22.476Z",
    "size": 386260,
    "path": "../public/upload/49c352a8fae3fcce04c067201.jpg"
  },
  "/upload/49c352a8fae3fcce04c067202.jpg": {
    "type": "image/jpeg",
    "etag": "\"f4ec7-qcpyrs77JUyeANInH0IFJ9TffFI\"",
    "mtime": "2023-10-30T01:01:22.479Z",
    "size": 1003207,
    "path": "../public/upload/49c352a8fae3fcce04c067202.jpg"
  },
  "/upload/cda3094264a8246f4dc458c00.59.02.png": {
    "type": "image/png",
    "etag": "\"11a91-HNX94buATBlYQzrnJUEpwkZ0XMQ\"",
    "mtime": "2023-10-30T01:01:22.472Z",
    "size": 72337,
    "path": "../public/upload/cda3094264a8246f4dc458c00.59.02.png"
  },
  "/upload/cda3094264a8246f4dc458c01.jpg": {
    "type": "image/jpeg",
    "etag": "\"9523-3MCEs6eDtf5ci6LsLUs2xzyB8O4\"",
    "mtime": "2023-10-30T01:01:22.471Z",
    "size": 38179,
    "path": "../public/upload/cda3094264a8246f4dc458c01.jpg"
  },
  "/upload/cda3094264a8246f4dc458c02.jpg": {
    "type": "image/jpeg",
    "etag": "\"10f08f-C0stBqrLAS88R3l3TNkwnit4XJk\"",
    "mtime": "2023-10-30T01:01:22.477Z",
    "size": 1110159,
    "path": "../public/upload/cda3094264a8246f4dc458c02.jpg"
  },
  "/fonts/Fira_Sans-400-1.woff2": {
    "type": "font/woff2",
    "etag": "\"4ca0-XPMGj1oCCn4GlSQ3ympeEOxj2vg\"",
    "mtime": "2023-10-30T01:01:22.446Z",
    "size": 19616,
    "path": "../public/fonts/Fira_Sans-400-1.woff2"
  },
  "/fonts/Fira_Sans-400-15.woff2": {
    "type": "font/woff2",
    "etag": "\"44c0-ElYAcNR38FAMEicypTw6mEmXkmY\"",
    "mtime": "2023-10-30T01:01:22.446Z",
    "size": 17600,
    "path": "../public/fonts/Fira_Sans-400-15.woff2"
  },
  "/fonts/Fira_Sans-400-16.woff2": {
    "type": "font/woff2",
    "etag": "\"2a10-lC2cy2Ycdj+r4FZUtYC7/LOk2Kk\"",
    "mtime": "2023-10-30T01:01:22.446Z",
    "size": 10768,
    "path": "../public/fonts/Fira_Sans-400-16.woff2"
  },
  "/fonts/Fira_Sans-400-17.woff2": {
    "type": "font/woff2",
    "etag": "\"1f18-/O5DqJ7AScdiP6klTBoGVNFixBw\"",
    "mtime": "2023-10-30T01:01:22.446Z",
    "size": 7960,
    "path": "../public/fonts/Fira_Sans-400-17.woff2"
  },
  "/fonts/Fira_Sans-400-18.woff2": {
    "type": "font/woff2",
    "etag": "\"31d8-Q1CRZxR6Z4AnVmDoeGxvU3j8UkI\"",
    "mtime": "2023-10-30T01:01:22.446Z",
    "size": 12760,
    "path": "../public/fonts/Fira_Sans-400-18.woff2"
  },
  "/fonts/Fira_Sans-400-19.woff2": {
    "type": "font/woff2",
    "etag": "\"20e8-0yECNxdqnl0V6iIrWOGUHWqhRe8\"",
    "mtime": "2023-10-30T01:01:22.447Z",
    "size": 8424,
    "path": "../public/fonts/Fira_Sans-400-19.woff2"
  },
  "/fonts/Fira_Sans-400-2.woff2": {
    "type": "font/woff2",
    "etag": "\"2dd8-msqrU47Xappb78HEhiwgr+pkbJQ\"",
    "mtime": "2023-10-30T01:01:22.446Z",
    "size": 11736,
    "path": "../public/fonts/Fira_Sans-400-2.woff2"
  },
  "/fonts/Fira_Sans-400-20.woff2": {
    "type": "font/woff2",
    "etag": "\"a6f0-YPCKe1KnFDrBLq4YPtxub1FBmyA\"",
    "mtime": "2023-10-30T01:01:22.446Z",
    "size": 42736,
    "path": "../public/fonts/Fira_Sans-400-20.woff2"
  },
  "/fonts/Fira_Sans-400-21.woff2": {
    "type": "font/woff2",
    "etag": "\"5d48-qvAuV3l9yYqkH+8hlFJnTwLgbdY\"",
    "mtime": "2023-10-30T01:01:22.446Z",
    "size": 23880,
    "path": "../public/fonts/Fira_Sans-400-21.woff2"
  },
  "/fonts/Fira_Sans-400-3.woff2": {
    "type": "font/woff2",
    "etag": "\"206c-08leydAI9Ye2cgitKr/pBRJpA1w\"",
    "mtime": "2023-10-30T01:01:22.446Z",
    "size": 8300,
    "path": "../public/fonts/Fira_Sans-400-3.woff2"
  },
  "/fonts/Fira_Sans-400-4.woff2": {
    "type": "font/woff2",
    "etag": "\"3360-WJAuMDb6EXeVtFQ/w0K0fwhI/9Q\"",
    "mtime": "2023-10-30T01:01:22.446Z",
    "size": 13152,
    "path": "../public/fonts/Fira_Sans-400-4.woff2"
  },
  "/fonts/Fira_Sans-400-5.woff2": {
    "type": "font/woff2",
    "etag": "\"2540-l2xpyhaEgBGsM1hOiM+jcTMt3M4\"",
    "mtime": "2023-10-30T01:01:22.447Z",
    "size": 9536,
    "path": "../public/fonts/Fira_Sans-400-5.woff2"
  },
  "/fonts/Fira_Sans-400-6.woff2": {
    "type": "font/woff2",
    "etag": "\"aab4-PWdzXygoaVVbfkne12Xn6TuYrH4\"",
    "mtime": "2023-10-30T01:01:22.447Z",
    "size": 43700,
    "path": "../public/fonts/Fira_Sans-400-6.woff2"
  },
  "/fonts/Fira_Sans-400-7.woff2": {
    "type": "font/woff2",
    "etag": "\"6168-nZikkOe4PVyilTh8RaMgeYKfxno\"",
    "mtime": "2023-10-30T01:01:22.447Z",
    "size": 24936,
    "path": "../public/fonts/Fira_Sans-400-7.woff2"
  },
  "/fonts/Fira_Sans-600-22.woff2": {
    "type": "font/woff2",
    "etag": "\"4c68-YxxajKw/IKqZKOn8ObDr2R+tKCM\"",
    "mtime": "2023-10-30T01:01:22.447Z",
    "size": 19560,
    "path": "../public/fonts/Fira_Sans-600-22.woff2"
  },
  "/fonts/Fira_Sans-600-23.woff2": {
    "type": "font/woff2",
    "etag": "\"2d30-Yl12+69NFjyNzYl7HQBOyw0yCYE\"",
    "mtime": "2023-10-30T01:01:22.447Z",
    "size": 11568,
    "path": "../public/fonts/Fira_Sans-600-23.woff2"
  },
  "/fonts/Fira_Sans-600-24.woff2": {
    "type": "font/woff2",
    "etag": "\"2088-I3GewWzKSwG1SqR0NkcNHyOpBEw\"",
    "mtime": "2023-10-30T01:01:22.447Z",
    "size": 8328,
    "path": "../public/fonts/Fira_Sans-600-24.woff2"
  },
  "/fonts/Fira_Sans-600-25.woff2": {
    "type": "font/woff2",
    "etag": "\"3588-ySAOccYb89TAbPjC9kY1r9pRRLY\"",
    "mtime": "2023-10-30T01:01:22.447Z",
    "size": 13704,
    "path": "../public/fonts/Fira_Sans-600-25.woff2"
  },
  "/fonts/Fira_Sans-600-26.woff2": {
    "type": "font/woff2",
    "etag": "\"2284-fwOxN8L4pB6oJYfT7DEqiqasL7A\"",
    "mtime": "2023-10-30T01:01:22.447Z",
    "size": 8836,
    "path": "../public/fonts/Fira_Sans-600-26.woff2"
  },
  "/fonts/Fira_Sans-600-27.woff2": {
    "type": "font/woff2",
    "etag": "\"b678-U/hcAd1Se7tBhZ0p/s4EIz5FYeU\"",
    "mtime": "2023-10-30T01:01:22.447Z",
    "size": 46712,
    "path": "../public/fonts/Fira_Sans-600-27.woff2"
  },
  "/fonts/Fira_Sans-600-28.woff2": {
    "type": "font/woff2",
    "etag": "\"6124-2gIX5/RQNfJT6//pdeMu5ZjGhJM\"",
    "mtime": "2023-10-30T01:01:22.447Z",
    "size": 24868,
    "path": "../public/fonts/Fira_Sans-600-28.woff2"
  },
  "/fonts/Fira_Sans-700-10.woff2": {
    "type": "font/woff2",
    "etag": "\"217c-/d2oTGfgXg+aXfYz1YuhBc1CaxA\"",
    "mtime": "2023-10-30T01:01:22.447Z",
    "size": 8572,
    "path": "../public/fonts/Fira_Sans-700-10.woff2"
  },
  "/fonts/Fira_Sans-700-11.woff2": {
    "type": "font/woff2",
    "etag": "\"376c-6h9TiJYj/Wa6efwG/Ji9pSpFBBs\"",
    "mtime": "2023-10-30T01:01:22.447Z",
    "size": 14188,
    "path": "../public/fonts/Fira_Sans-700-11.woff2"
  },
  "/fonts/Fira_Sans-700-12.woff2": {
    "type": "font/woff2",
    "etag": "\"2890-xDAWzCFgUhqhRSO9YqRmlQ55Xq8\"",
    "mtime": "2023-10-30T01:01:22.447Z",
    "size": 10384,
    "path": "../public/fonts/Fira_Sans-700-12.woff2"
  },
  "/fonts/Fira_Sans-700-13.woff2": {
    "type": "font/woff2",
    "etag": "\"bc78-v9VXTRqmLGofUADzhXc6uivEPoU\"",
    "mtime": "2023-10-30T01:01:22.447Z",
    "size": 48248,
    "path": "../public/fonts/Fira_Sans-700-13.woff2"
  },
  "/fonts/Fira_Sans-700-14.woff2": {
    "type": "font/woff2",
    "etag": "\"65d8-S6t3hpWa6rmz1H8aV2j6CZxKxC0\"",
    "mtime": "2023-10-30T01:01:22.448Z",
    "size": 26072,
    "path": "../public/fonts/Fira_Sans-700-14.woff2"
  },
  "/fonts/Fira_Sans-700-29.woff2": {
    "type": "font/woff2",
    "etag": "\"4c44-1B2bDTwHe+Z+FSSmbKlc1mYiZZo\"",
    "mtime": "2023-10-30T01:01:22.448Z",
    "size": 19524,
    "path": "../public/fonts/Fira_Sans-700-29.woff2"
  },
  "/fonts/Fira_Sans-700-30.woff2": {
    "type": "font/woff2",
    "etag": "\"2d4c-O9LLu+LM/JsGH64EZjseMaLSv6M\"",
    "mtime": "2023-10-30T01:01:22.448Z",
    "size": 11596,
    "path": "../public/fonts/Fira_Sans-700-30.woff2"
  },
  "/fonts/Fira_Sans-700-31.woff2": {
    "type": "font/woff2",
    "etag": "\"2060-u75tFBHsNstF70AP6BJzUXdzkNQ\"",
    "mtime": "2023-10-30T01:01:22.448Z",
    "size": 8288,
    "path": "../public/fonts/Fira_Sans-700-31.woff2"
  },
  "/fonts/Fira_Sans-700-32.woff2": {
    "type": "font/woff2",
    "etag": "\"357c-ly4dHu3QTQhCr5Ovg1q3BtWNM6E\"",
    "mtime": "2023-10-30T01:01:22.448Z",
    "size": 13692,
    "path": "../public/fonts/Fira_Sans-700-32.woff2"
  },
  "/fonts/Fira_Sans-700-33.woff2": {
    "type": "font/woff2",
    "etag": "\"2274-qPxoyq1pQ2hLup/so5u2uNjhWpk\"",
    "mtime": "2023-10-30T01:01:22.448Z",
    "size": 8820,
    "path": "../public/fonts/Fira_Sans-700-33.woff2"
  },
  "/fonts/Fira_Sans-700-34.woff2": {
    "type": "font/woff2",
    "etag": "\"b6b8-tNdEshzZsKQ5eBwJG1h8tQF1kSE\"",
    "mtime": "2023-10-30T01:01:22.448Z",
    "size": 46776,
    "path": "../public/fonts/Fira_Sans-700-34.woff2"
  },
  "/fonts/Fira_Sans-700-35.woff2": {
    "type": "font/woff2",
    "etag": "\"6184-bWwkYZEVZJxMgKINclx49lF1+zg\"",
    "mtime": "2023-10-30T01:01:22.448Z",
    "size": 24964,
    "path": "../public/fonts/Fira_Sans-700-35.woff2"
  },
  "/fonts/Fira_Sans-700-8.woff2": {
    "type": "font/woff2",
    "etag": "\"5548-joriok+9x0390TX7JZlTpSYUIBM\"",
    "mtime": "2023-10-30T01:01:22.448Z",
    "size": 21832,
    "path": "../public/fonts/Fira_Sans-700-8.woff2"
  },
  "/fonts/Fira_Sans-700-9.woff2": {
    "type": "font/woff2",
    "etag": "\"3200-AhU1PYx7xCMlX/fLkUl7V/ISsKQ\"",
    "mtime": "2023-10-30T01:01:22.448Z",
    "size": 12800,
    "path": "../public/fonts/Fira_Sans-700-9.woff2"
  },
  "/_nuxt/Fira_Sans-400-1.e4febcea.woff2": {
    "type": "font/woff2",
    "etag": "\"4ca0-XPMGj1oCCn4GlSQ3ympeEOxj2vg\"",
    "mtime": "2023-10-30T01:01:22.462Z",
    "size": 19616,
    "path": "../public/_nuxt/Fira_Sans-400-1.e4febcea.woff2"
  },
  "/_nuxt/Fira_Sans-400-15.61d002d2.woff2": {
    "type": "font/woff2",
    "etag": "\"44c0-ElYAcNR38FAMEicypTw6mEmXkmY\"",
    "mtime": "2023-10-30T01:01:22.462Z",
    "size": 17600,
    "path": "../public/_nuxt/Fira_Sans-400-15.61d002d2.woff2"
  },
  "/_nuxt/Fira_Sans-400-16.6be5cf1e.woff2": {
    "type": "font/woff2",
    "etag": "\"2a10-lC2cy2Ycdj+r4FZUtYC7/LOk2Kk\"",
    "mtime": "2023-10-30T01:01:22.462Z",
    "size": 10768,
    "path": "../public/_nuxt/Fira_Sans-400-16.6be5cf1e.woff2"
  },
  "/_nuxt/Fira_Sans-400-17.e48378b0.woff2": {
    "type": "font/woff2",
    "etag": "\"1f18-/O5DqJ7AScdiP6klTBoGVNFixBw\"",
    "mtime": "2023-10-30T01:01:22.462Z",
    "size": 7960,
    "path": "../public/_nuxt/Fira_Sans-400-17.e48378b0.woff2"
  },
  "/_nuxt/Fira_Sans-400-18.86edeee5.woff2": {
    "type": "font/woff2",
    "etag": "\"31d8-Q1CRZxR6Z4AnVmDoeGxvU3j8UkI\"",
    "mtime": "2023-10-30T01:01:22.462Z",
    "size": 12760,
    "path": "../public/_nuxt/Fira_Sans-400-18.86edeee5.woff2"
  },
  "/_nuxt/Fira_Sans-400-19.f4ab47d9.woff2": {
    "type": "font/woff2",
    "etag": "\"20e8-0yECNxdqnl0V6iIrWOGUHWqhRe8\"",
    "mtime": "2023-10-30T01:01:22.462Z",
    "size": 8424,
    "path": "../public/_nuxt/Fira_Sans-400-19.f4ab47d9.woff2"
  },
  "/_nuxt/Fira_Sans-400-2.9b8c96af.woff2": {
    "type": "font/woff2",
    "etag": "\"2dd8-msqrU47Xappb78HEhiwgr+pkbJQ\"",
    "mtime": "2023-10-30T01:01:22.462Z",
    "size": 11736,
    "path": "../public/_nuxt/Fira_Sans-400-2.9b8c96af.woff2"
  },
  "/_nuxt/Fira_Sans-400-20.5ebb17b6.woff2": {
    "type": "font/woff2",
    "etag": "\"a6f0-YPCKe1KnFDrBLq4YPtxub1FBmyA\"",
    "mtime": "2023-10-30T01:01:22.462Z",
    "size": 42736,
    "path": "../public/_nuxt/Fira_Sans-400-20.5ebb17b6.woff2"
  },
  "/_nuxt/Fira_Sans-400-21.89ae1743.woff2": {
    "type": "font/woff2",
    "etag": "\"5d48-qvAuV3l9yYqkH+8hlFJnTwLgbdY\"",
    "mtime": "2023-10-30T01:01:22.462Z",
    "size": 23880,
    "path": "../public/_nuxt/Fira_Sans-400-21.89ae1743.woff2"
  },
  "/_nuxt/Fira_Sans-400-3.12d12255.woff2": {
    "type": "font/woff2",
    "etag": "\"206c-08leydAI9Ye2cgitKr/pBRJpA1w\"",
    "mtime": "2023-10-30T01:01:22.463Z",
    "size": 8300,
    "path": "../public/_nuxt/Fira_Sans-400-3.12d12255.woff2"
  },
  "/_nuxt/Fira_Sans-400-4.c00fc0a0.woff2": {
    "type": "font/woff2",
    "etag": "\"3360-WJAuMDb6EXeVtFQ/w0K0fwhI/9Q\"",
    "mtime": "2023-10-30T01:01:22.463Z",
    "size": 13152,
    "path": "../public/_nuxt/Fira_Sans-400-4.c00fc0a0.woff2"
  },
  "/_nuxt/Fira_Sans-400-5.234a6d78.woff2": {
    "type": "font/woff2",
    "etag": "\"2540-l2xpyhaEgBGsM1hOiM+jcTMt3M4\"",
    "mtime": "2023-10-30T01:01:22.463Z",
    "size": 9536,
    "path": "../public/_nuxt/Fira_Sans-400-5.234a6d78.woff2"
  },
  "/_nuxt/Fira_Sans-400-6.3ecdbb41.woff2": {
    "type": "font/woff2",
    "etag": "\"aab4-PWdzXygoaVVbfkne12Xn6TuYrH4\"",
    "mtime": "2023-10-30T01:01:22.463Z",
    "size": 43700,
    "path": "../public/_nuxt/Fira_Sans-400-6.3ecdbb41.woff2"
  },
  "/_nuxt/Fira_Sans-400-7.f5155a85.woff2": {
    "type": "font/woff2",
    "etag": "\"6168-nZikkOe4PVyilTh8RaMgeYKfxno\"",
    "mtime": "2023-10-30T01:01:22.463Z",
    "size": 24936,
    "path": "../public/_nuxt/Fira_Sans-400-7.f5155a85.woff2"
  },
  "/_nuxt/Fira_Sans-600-22.cfbd84f6.woff2": {
    "type": "font/woff2",
    "etag": "\"4c68-YxxajKw/IKqZKOn8ObDr2R+tKCM\"",
    "mtime": "2023-10-30T01:01:22.463Z",
    "size": 19560,
    "path": "../public/_nuxt/Fira_Sans-600-22.cfbd84f6.woff2"
  },
  "/_nuxt/Fira_Sans-600-23.268fbaf3.woff2": {
    "type": "font/woff2",
    "etag": "\"2d30-Yl12+69NFjyNzYl7HQBOyw0yCYE\"",
    "mtime": "2023-10-30T01:01:22.463Z",
    "size": 11568,
    "path": "../public/_nuxt/Fira_Sans-600-23.268fbaf3.woff2"
  },
  "/_nuxt/Fira_Sans-600-24.090013b9.woff2": {
    "type": "font/woff2",
    "etag": "\"2088-I3GewWzKSwG1SqR0NkcNHyOpBEw\"",
    "mtime": "2023-10-30T01:01:22.463Z",
    "size": 8328,
    "path": "../public/_nuxt/Fira_Sans-600-24.090013b9.woff2"
  },
  "/_nuxt/Fira_Sans-600-25.e16f8f18.woff2": {
    "type": "font/woff2",
    "etag": "\"3588-ySAOccYb89TAbPjC9kY1r9pRRLY\"",
    "mtime": "2023-10-30T01:01:22.463Z",
    "size": 13704,
    "path": "../public/_nuxt/Fira_Sans-600-25.e16f8f18.woff2"
  },
  "/_nuxt/Fira_Sans-600-26.d13ae7c2.woff2": {
    "type": "font/woff2",
    "etag": "\"2284-fwOxN8L4pB6oJYfT7DEqiqasL7A\"",
    "mtime": "2023-10-30T01:01:22.463Z",
    "size": 8836,
    "path": "../public/_nuxt/Fira_Sans-600-26.d13ae7c2.woff2"
  },
  "/_nuxt/Fira_Sans-600-27.08965fb0.woff2": {
    "type": "font/woff2",
    "etag": "\"b678-U/hcAd1Se7tBhZ0p/s4EIz5FYeU\"",
    "mtime": "2023-10-30T01:01:22.463Z",
    "size": 46712,
    "path": "../public/_nuxt/Fira_Sans-600-27.08965fb0.woff2"
  },
  "/_nuxt/Fira_Sans-600-28.3bdc2910.woff2": {
    "type": "font/woff2",
    "etag": "\"6124-2gIX5/RQNfJT6//pdeMu5ZjGhJM\"",
    "mtime": "2023-10-30T01:01:22.463Z",
    "size": 24868,
    "path": "../public/_nuxt/Fira_Sans-600-28.3bdc2910.woff2"
  },
  "/_nuxt/Fira_Sans-700-10.2a68522d.woff2": {
    "type": "font/woff2",
    "etag": "\"217c-/d2oTGfgXg+aXfYz1YuhBc1CaxA\"",
    "mtime": "2023-10-30T01:01:22.463Z",
    "size": 8572,
    "path": "../public/_nuxt/Fira_Sans-700-10.2a68522d.woff2"
  },
  "/_nuxt/Fira_Sans-700-11.7a466805.woff2": {
    "type": "font/woff2",
    "etag": "\"376c-6h9TiJYj/Wa6efwG/Ji9pSpFBBs\"",
    "mtime": "2023-10-30T01:01:22.463Z",
    "size": 14188,
    "path": "../public/_nuxt/Fira_Sans-700-11.7a466805.woff2"
  },
  "/_nuxt/Fira_Sans-700-12.956559b0.woff2": {
    "type": "font/woff2",
    "etag": "\"2890-xDAWzCFgUhqhRSO9YqRmlQ55Xq8\"",
    "mtime": "2023-10-30T01:01:22.463Z",
    "size": 10384,
    "path": "../public/_nuxt/Fira_Sans-700-12.956559b0.woff2"
  },
  "/_nuxt/Fira_Sans-700-13.7915de52.woff2": {
    "type": "font/woff2",
    "etag": "\"bc78-v9VXTRqmLGofUADzhXc6uivEPoU\"",
    "mtime": "2023-10-30T01:01:22.464Z",
    "size": 48248,
    "path": "../public/_nuxt/Fira_Sans-700-13.7915de52.woff2"
  },
  "/_nuxt/Fira_Sans-700-14.f896027f.woff2": {
    "type": "font/woff2",
    "etag": "\"65d8-S6t3hpWa6rmz1H8aV2j6CZxKxC0\"",
    "mtime": "2023-10-30T01:01:22.464Z",
    "size": 26072,
    "path": "../public/_nuxt/Fira_Sans-700-14.f896027f.woff2"
  },
  "/_nuxt/Fira_Sans-700-29.d98a623f.woff2": {
    "type": "font/woff2",
    "etag": "\"4c44-1B2bDTwHe+Z+FSSmbKlc1mYiZZo\"",
    "mtime": "2023-10-30T01:01:22.464Z",
    "size": 19524,
    "path": "../public/_nuxt/Fira_Sans-700-29.d98a623f.woff2"
  },
  "/_nuxt/Fira_Sans-700-30.1f2f69e5.woff2": {
    "type": "font/woff2",
    "etag": "\"2d4c-O9LLu+LM/JsGH64EZjseMaLSv6M\"",
    "mtime": "2023-10-30T01:01:22.464Z",
    "size": 11596,
    "path": "../public/_nuxt/Fira_Sans-700-30.1f2f69e5.woff2"
  },
  "/_nuxt/Fira_Sans-700-31.f86e63ae.woff2": {
    "type": "font/woff2",
    "etag": "\"2060-u75tFBHsNstF70AP6BJzUXdzkNQ\"",
    "mtime": "2023-10-30T01:01:22.464Z",
    "size": 8288,
    "path": "../public/_nuxt/Fira_Sans-700-31.f86e63ae.woff2"
  },
  "/_nuxt/Fira_Sans-700-32.2b739f6c.woff2": {
    "type": "font/woff2",
    "etag": "\"357c-ly4dHu3QTQhCr5Ovg1q3BtWNM6E\"",
    "mtime": "2023-10-30T01:01:22.464Z",
    "size": 13692,
    "path": "../public/_nuxt/Fira_Sans-700-32.2b739f6c.woff2"
  },
  "/_nuxt/Fira_Sans-700-33.24c6b71c.woff2": {
    "type": "font/woff2",
    "etag": "\"2274-qPxoyq1pQ2hLup/so5u2uNjhWpk\"",
    "mtime": "2023-10-30T01:01:22.464Z",
    "size": 8820,
    "path": "../public/_nuxt/Fira_Sans-700-33.24c6b71c.woff2"
  },
  "/_nuxt/Fira_Sans-700-34.9196fb18.woff2": {
    "type": "font/woff2",
    "etag": "\"b6b8-tNdEshzZsKQ5eBwJG1h8tQF1kSE\"",
    "mtime": "2023-10-30T01:01:22.464Z",
    "size": 46776,
    "path": "../public/_nuxt/Fira_Sans-700-34.9196fb18.woff2"
  },
  "/_nuxt/Fira_Sans-700-35.45f1b654.woff2": {
    "type": "font/woff2",
    "etag": "\"6184-bWwkYZEVZJxMgKINclx49lF1+zg\"",
    "mtime": "2023-10-30T01:01:22.464Z",
    "size": 24964,
    "path": "../public/_nuxt/Fira_Sans-700-35.45f1b654.woff2"
  },
  "/_nuxt/Fira_Sans-700-8.1e5f3561.woff2": {
    "type": "font/woff2",
    "etag": "\"5548-joriok+9x0390TX7JZlTpSYUIBM\"",
    "mtime": "2023-10-30T01:01:22.464Z",
    "size": 21832,
    "path": "../public/_nuxt/Fira_Sans-700-8.1e5f3561.woff2"
  },
  "/_nuxt/Fira_Sans-700-9.c44eb255.woff2": {
    "type": "font/woff2",
    "etag": "\"3200-AhU1PYx7xCMlX/fLkUl7V/ISsKQ\"",
    "mtime": "2023-10-30T01:01:22.464Z",
    "size": 12800,
    "path": "../public/_nuxt/Fira_Sans-700-9.c44eb255.woff2"
  },
  "/_nuxt/ModerationPopup.vue.a982036e.js": {
    "type": "application/javascript",
    "etag": "\"8ac-TA+TicPKVr/eZIUYAZNgGAUzitc\"",
    "mtime": "2023-10-30T01:01:22.464Z",
    "size": 2220,
    "path": "../public/_nuxt/ModerationPopup.vue.a982036e.js"
  },
  "/_nuxt/PhotosList.vue.b17eff9b.js": {
    "type": "application/javascript",
    "etag": "\"7b4-OqZ9V1C8ONB/g7sFim9+AcS1UEY\"",
    "mtime": "2023-10-30T01:01:22.464Z",
    "size": 1972,
    "path": "../public/_nuxt/PhotosList.vue.b17eff9b.js"
  },
  "/_nuxt/Popup.vue.d0c05546.js": {
    "type": "application/javascript",
    "etag": "\"1669a-PsC9vHtY54s3VTNNgejpkx2QuIM\"",
    "mtime": "2023-10-30T01:01:22.465Z",
    "size": 91802,
    "path": "../public/_nuxt/Popup.vue.d0c05546.js"
  },
  "/_nuxt/PopupContainer.21fb2484.js": {
    "type": "application/javascript",
    "etag": "\"22a-AlWJ93OxmUThDfPrbtNKxNemUFs\"",
    "mtime": "2023-10-30T01:01:22.464Z",
    "size": 554,
    "path": "../public/_nuxt/PopupContainer.21fb2484.js"
  },
  "/_nuxt/PopupContainer.3f5210c5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5a5-heSvJQo+mJDUDJzcgLJHa1eYvmo\"",
    "mtime": "2023-10-30T01:01:22.464Z",
    "size": 1445,
    "path": "../public/_nuxt/PopupContainer.3f5210c5.css"
  },
  "/_nuxt/admin.c7df88cc.js": {
    "type": "application/javascript",
    "etag": "\"10a-hN3QYGsQIXmOguWbOBxJlkRlcbo\"",
    "mtime": "2023-10-30T01:01:22.464Z",
    "size": 266,
    "path": "../public/_nuxt/admin.c7df88cc.js"
  },
  "/_nuxt/auth.4f35bfe4.js": {
    "type": "application/javascript",
    "etag": "\"b9-XhqLiHRpuXBtCeG/wI1Xp6XY5cg\"",
    "mtime": "2023-10-30T01:01:22.464Z",
    "size": 185,
    "path": "../public/_nuxt/auth.4f35bfe4.js"
  },
  "/_nuxt/client.81797db6.js": {
    "type": "application/javascript",
    "etag": "\"535-oR94YYHZbWlmH9T95tgnc1sSHDI\"",
    "mtime": "2023-10-30T01:01:22.465Z",
    "size": 1333,
    "path": "../public/_nuxt/client.81797db6.js"
  },
  "/_nuxt/company.44139364.js": {
    "type": "application/javascript",
    "etag": "\"101-gLfEeF4iJCq+FwIcQB+2Huyy2rE\"",
    "mtime": "2023-10-30T01:01:22.465Z",
    "size": 257,
    "path": "../public/_nuxt/company.44139364.js"
  },
  "/_nuxt/cookie.c0d62a03.js": {
    "type": "application/javascript",
    "etag": "\"b93-8FINBGg1aconRMhNHJ6gUCGQZBo\"",
    "mtime": "2023-10-30T01:01:22.465Z",
    "size": 2963,
    "path": "../public/_nuxt/cookie.c0d62a03.js"
  },
  "/_nuxt/default.739c8cd3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"21a2-Dxvu/moBmUxgLKPSYfaG7KiNPjY\"",
    "mtime": "2023-10-30T01:01:22.465Z",
    "size": 8610,
    "path": "../public/_nuxt/default.739c8cd3.css"
  },
  "/_nuxt/default.8d117691.js": {
    "type": "application/javascript",
    "etag": "\"31b6-qG+YK0wP5ONDfrMaFrUjfCA6zW4\"",
    "mtime": "2023-10-30T01:01:22.465Z",
    "size": 12726,
    "path": "../public/_nuxt/default.8d117691.js"
  },
  "/_nuxt/entry.56efca1e.js": {
    "type": "application/javascript",
    "etag": "\"26f74-2p5fsaz2ZZysxSs9UuzCuM9ufVI\"",
    "mtime": "2023-10-30T01:01:22.465Z",
    "size": 159604,
    "path": "../public/_nuxt/entry.56efca1e.js"
  },
  "/_nuxt/error-404.8ee656bd.js": {
    "type": "application/javascript",
    "etag": "\"8f5-KJmIYfuioSdm8/Frpf2/9no3ZTo\"",
    "mtime": "2023-10-30T01:01:22.465Z",
    "size": 2293,
    "path": "../public/_nuxt/error-404.8ee656bd.js"
  },
  "/_nuxt/error-404.95c28eb4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-L8dF9pJCW0qi7de8Az4GyBoTHvI\"",
    "mtime": "2023-10-30T01:01:22.465Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.95c28eb4.css"
  },
  "/_nuxt/error-500.31ee363d.js": {
    "type": "application/javascript",
    "etag": "\"77e-iZYqNNMomMxgg/HcWfEVV4uosF8\"",
    "mtime": "2023-10-30T01:01:22.465Z",
    "size": 1918,
    "path": "../public/_nuxt/error-500.31ee363d.js"
  },
  "/_nuxt/error-500.e798523c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-QP983DB9m1oiDr87r1V1AYEhrfo\"",
    "mtime": "2023-10-30T01:01:22.465Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.e798523c.css"
  },
  "/_nuxt/fetch.217e6b20.js": {
    "type": "application/javascript",
    "etag": "\"2f3e-HhvnrYyFjDywipcSdL9LgWLWQRM\"",
    "mtime": "2023-10-30T01:01:22.465Z",
    "size": 12094,
    "path": "../public/_nuxt/fetch.217e6b20.js"
  },
  "/_nuxt/formkit.config.73c7990b.js": {
    "type": "application/javascript",
    "etag": "\"2fe65-uTlW5iWRpHh+F2oPBBXM09u74nY\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 196197,
    "path": "../public/_nuxt/formkit.config.73c7990b.js"
  },
  "/_nuxt/icon-checkbox.3e391fd6.js": {
    "type": "application/javascript",
    "etag": "\"1fc-TCMsGycw0NGzS1n130c6lPAICfI\"",
    "mtime": "2023-10-30T01:01:22.465Z",
    "size": 508,
    "path": "../public/_nuxt/icon-checkbox.3e391fd6.js"
  },
  "/_nuxt/icon-checkbox.d69e1d6d.svg": {
    "type": "image/svg+xml",
    "etag": "\"160-RpAIiYBOpmsfa/r1FZ+/FQPPEiI\"",
    "mtime": "2023-10-30T01:01:22.465Z",
    "size": 352,
    "path": "../public/_nuxt/icon-checkbox.d69e1d6d.svg"
  },
  "/_nuxt/icon-close.76b2cbe5.svg": {
    "type": "image/svg+xml",
    "etag": "\"12b-xEgfmzmZfyjFsZn9m5zMzzM/xzM\"",
    "mtime": "2023-10-30T01:01:22.465Z",
    "size": 299,
    "path": "../public/_nuxt/icon-close.76b2cbe5.svg"
  },
  "/_nuxt/icon-close.f5b247d4.js": {
    "type": "application/javascript",
    "etag": "\"1ae-dxK5drXVAgcLqXoiCklm2OYoiAA\"",
    "mtime": "2023-10-30T01:01:22.465Z",
    "size": 430,
    "path": "../public/_nuxt/icon-close.f5b247d4.js"
  },
  "/_nuxt/icon-edit.2f870637.svg": {
    "type": "image/svg+xml",
    "etag": "\"1ab-WRREZlcNuqtx+KOMakwf81+uWKQ\"",
    "mtime": "2023-10-30T01:01:22.465Z",
    "size": 427,
    "path": "../public/_nuxt/icon-edit.2f870637.svg"
  },
  "/_nuxt/icon-edit.6d88d0b6.js": {
    "type": "application/javascript",
    "etag": "\"232-Pw8yTfyNLDDDODFRcuzhwmQ0eJU\"",
    "mtime": "2023-10-30T01:01:22.465Z",
    "size": 562,
    "path": "../public/_nuxt/icon-edit.6d88d0b6.js"
  },
  "/_nuxt/icon-login.70e20e6f.svg": {
    "type": "image/svg+xml",
    "etag": "\"17a-7T0e/ZmNqK/61Ixxadn8TbXpV8Y\"",
    "mtime": "2023-10-30T01:01:22.465Z",
    "size": 378,
    "path": "../public/_nuxt/icon-login.70e20e6f.svg"
  },
  "/_nuxt/icon-login.8110a381.js": {
    "type": "application/javascript",
    "etag": "\"214-B7AQDrNQUfaLcviGQH/2s7bBv9I\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 532,
    "path": "../public/_nuxt/icon-login.8110a381.js"
  },
  "/_nuxt/icon-plus.5c8a6778.svg": {
    "type": "image/svg+xml",
    "etag": "\"153-1r6aRJM2Kh739SHYN7V5MO3D1Hk\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 339,
    "path": "../public/_nuxt/icon-plus.5c8a6778.svg"
  },
  "/_nuxt/icon-plus.72ffa236.js": {
    "type": "application/javascript",
    "etag": "\"1fb-7vcN4E7nhYaifoIkWgdzpUHzpdw\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 507,
    "path": "../public/_nuxt/icon-plus.72ffa236.js"
  },
  "/_nuxt/icon-restore.6aa7e34a.svg": {
    "type": "image/svg+xml",
    "etag": "\"16e-bWdQyRYDtLOwQwdqYinCop5MoKo\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 366,
    "path": "../public/_nuxt/icon-restore.6aa7e34a.svg"
  },
  "/_nuxt/icon-restore.fc7a6b0a.js": {
    "type": "application/javascript",
    "etag": "\"201-zM0vGJ/KS3NtZGXJq7wROeUcl0o\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 513,
    "path": "../public/_nuxt/icon-restore.fc7a6b0a.js"
  },
  "/_nuxt/icon-search.4c17c5ce.svg": {
    "type": "image/svg+xml",
    "etag": "\"148-/cm5n2HFT0ZEUeY6OZr4TS+WMps\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 328,
    "path": "../public/_nuxt/icon-search.4c17c5ce.svg"
  },
  "/_nuxt/icon-search.d50ff722.js": {
    "type": "application/javascript",
    "etag": "\"1c3-BgaGaZyM4VJTUZ+7Ee2MEHQVHTs\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 451,
    "path": "../public/_nuxt/icon-search.d50ff722.js"
  },
  "/_nuxt/icon-square-minus.725cb42f.js": {
    "type": "application/javascript",
    "etag": "\"1d1-yeTfbGrOUYEY0jTtHSB39cAYims\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 465,
    "path": "../public/_nuxt/icon-square-minus.725cb42f.js"
  },
  "/_nuxt/icon-square-minus.a0eab0f5.svg": {
    "type": "image/svg+xml",
    "etag": "\"152-8Gr3qAPEzfmKlBlZhCI4GtuHe9Q\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 338,
    "path": "../public/_nuxt/icon-square-minus.a0eab0f5.svg"
  },
  "/_nuxt/icon-square-plus.6288f80f.js": {
    "type": "application/javascript",
    "etag": "\"1d9-aQKsTbfIQ+E1EpWvejUWzfJJSA4\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 473,
    "path": "../public/_nuxt/icon-square-plus.6288f80f.js"
  },
  "/_nuxt/icon-square-plus.a13c7c89.svg": {
    "type": "image/svg+xml",
    "etag": "\"169-5C+eb8U7Ge4bfFsE8/WdEaVdi1k\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 361,
    "path": "../public/_nuxt/icon-square-plus.a13c7c89.svg"
  },
  "/_nuxt/icon-square.94b385ef.js": {
    "type": "application/javascript",
    "etag": "\"1df-fKzeYeWqJp+PPB0aA4FEhAZoehI\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 479,
    "path": "../public/_nuxt/icon-square.94b385ef.js"
  },
  "/_nuxt/icon-square.b94e7478.svg": {
    "type": "image/svg+xml",
    "etag": "\"151-JXiBDrleGZJZ2+/E9+I/QO5+sgo\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 337,
    "path": "../public/_nuxt/icon-square.b94e7478.svg"
  },
  "/_nuxt/icon-trash.07644d23.js": {
    "type": "application/javascript",
    "etag": "\"203-znprjzibQZrRq8cvF2Ik5Cmy8w8\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 515,
    "path": "../public/_nuxt/icon-trash.07644d23.js"
  },
  "/_nuxt/icon-trash.f317fa0f.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b5-RhfXcm0Tzx1WE9jcHPT9J7CdYdw\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 437,
    "path": "../public/_nuxt/icon-trash.f317fa0f.svg"
  },
  "/_nuxt/icon-user-check.15eb6ddc.js": {
    "type": "application/javascript",
    "etag": "\"1e0-PzYCwY0IxTqiNRTJZj44h7hakZo\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 480,
    "path": "../public/_nuxt/icon-user-check.15eb6ddc.js"
  },
  "/_nuxt/icon-user-check.7fed2a34.svg": {
    "type": "image/svg+xml",
    "etag": "\"16b-TysabNnN7kyWq6WycLlbZA2V/AM\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 363,
    "path": "../public/_nuxt/icon-user-check.7fed2a34.svg"
  },
  "/_nuxt/icon-user-cog.37ba31fb.svg": {
    "type": "image/svg+xml",
    "etag": "\"258-8bUhU/2xn2tSnYH9AFViTK6SEe4\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 600,
    "path": "../public/_nuxt/icon-user-cog.37ba31fb.svg"
  },
  "/_nuxt/icon-user-cog.f4155a5c.js": {
    "type": "application/javascript",
    "etag": "\"263-CBHndtU+/jjfhkxYUYGCMhZYDMs\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 611,
    "path": "../public/_nuxt/icon-user-cog.f4155a5c.js"
  },
  "/_nuxt/icon-user-plus.aa9296a1.svg": {
    "type": "image/svg+xml",
    "etag": "\"17c-C/av7SHgztyIbwccP1id3UigUpw\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 380,
    "path": "../public/_nuxt/icon-user-plus.aa9296a1.svg"
  },
  "/_nuxt/icon-user-plus.f93659a3.js": {
    "type": "application/javascript",
    "etag": "\"1dd-y56WOZkuQQGQ33H42gG1++dB55c\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 477,
    "path": "../public/_nuxt/icon-user-plus.f93659a3.js"
  },
  "/_nuxt/index.23a26c1a.js": {
    "type": "application/javascript",
    "etag": "\"15af-/7H3sEIzmzjiLO/+/5NKWDP4aH0\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 5551,
    "path": "../public/_nuxt/index.23a26c1a.js"
  },
  "/_nuxt/index.3349c4fb.js": {
    "type": "application/javascript",
    "etag": "\"adc-MGt+NtwIaJZs2vIRw4GCusKgqKc\"",
    "mtime": "2023-10-30T01:01:22.466Z",
    "size": 2780,
    "path": "../public/_nuxt/index.3349c4fb.js"
  },
  "/_nuxt/index.57ec8b93.js": {
    "type": "application/javascript",
    "etag": "\"147c-vD8eF7fIZLmdaODlXH7Xm8u0YhI\"",
    "mtime": "2023-10-30T01:01:22.467Z",
    "size": 5244,
    "path": "../public/_nuxt/index.57ec8b93.js"
  },
  "/_nuxt/index.5fd4f1c2.js": {
    "type": "application/javascript",
    "etag": "\"18d7-3dNlLoXKUsJS+RmNOz4oX1zud1M\"",
    "mtime": "2023-10-30T01:01:22.467Z",
    "size": 6359,
    "path": "../public/_nuxt/index.5fd4f1c2.js"
  },
  "/_nuxt/index.61b69777.js": {
    "type": "application/javascript",
    "etag": "\"1067-fspo617GVwIc8bERF+t70vYtLhM\"",
    "mtime": "2023-10-30T01:01:22.467Z",
    "size": 4199,
    "path": "../public/_nuxt/index.61b69777.js"
  },
  "/_nuxt/index.aa1c2c5b.js": {
    "type": "application/javascript",
    "etag": "\"b4f-c/4swOC7/ZgeBGTwOWFPzCG9HPo\"",
    "mtime": "2023-10-30T01:01:22.467Z",
    "size": 2895,
    "path": "../public/_nuxt/index.aa1c2c5b.js"
  },
  "/_nuxt/index.aa490c61.js": {
    "type": "application/javascript",
    "etag": "\"1682-DSChtd9Y8S4KIejLpuikNMbajfQ\"",
    "mtime": "2023-10-30T01:01:22.467Z",
    "size": 5762,
    "path": "../public/_nuxt/index.aa490c61.js"
  },
  "/_nuxt/index.b1982b73.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"14d-LzE9YcRLyYALHEHffZIdaFUj51o\"",
    "mtime": "2023-10-30T01:01:22.467Z",
    "size": 333,
    "path": "../public/_nuxt/index.b1982b73.css"
  },
  "/_nuxt/index.bcecb0df.js": {
    "type": "application/javascript",
    "etag": "\"608a-w/nw7e1sv/9J4SG5QDcLbvT3B74\"",
    "mtime": "2023-10-30T01:01:22.467Z",
    "size": 24714,
    "path": "../public/_nuxt/index.bcecb0df.js"
  },
  "/_nuxt/index.c8594d8e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1dc-k47gV80Gnw5GzSrydby2y/jxO5Q\"",
    "mtime": "2023-10-30T01:01:22.467Z",
    "size": 476,
    "path": "../public/_nuxt/index.c8594d8e.css"
  },
  "/_nuxt/index.d64659c2.js": {
    "type": "application/javascript",
    "etag": "\"107-W1UGceLakULM6bGuA2ZH0JWIpPE\"",
    "mtime": "2023-10-30T01:01:22.467Z",
    "size": 263,
    "path": "../public/_nuxt/index.d64659c2.js"
  },
  "/_nuxt/logo-white.a8ce8157.js": {
    "type": "application/javascript",
    "etag": "\"6d-u5P62Ni2vX2ggiPBDH4ssICLZ9E\"",
    "mtime": "2023-10-30T01:01:22.467Z",
    "size": 109,
    "path": "../public/_nuxt/logo-white.a8ce8157.js"
  },
  "/_nuxt/moderator.cc83145a.js": {
    "type": "application/javascript",
    "etag": "\"10a-G93fqXlNggUAB+7Ojm8l7x9Hi80\"",
    "mtime": "2023-10-30T01:01:22.467Z",
    "size": 266,
    "path": "../public/_nuxt/moderator.cc83145a.js"
  },
  "/_nuxt/nuxt-img.9e7e8bff.js": {
    "type": "application/javascript",
    "etag": "\"21ea-zTtt6RNHM+cDgPj1Qo4hSc05FWs\"",
    "mtime": "2023-10-30T01:01:22.467Z",
    "size": 8682,
    "path": "../public/_nuxt/nuxt-img.9e7e8bff.js"
  },
  "/_nuxt/nuxt-link.c817fee7.js": {
    "type": "application/javascript",
    "etag": "\"fd1-jd3nL1sb5xyNVirnUP+brYsE5ek\"",
    "mtime": "2023-10-30T01:01:22.467Z",
    "size": 4049,
    "path": "../public/_nuxt/nuxt-link.c817fee7.js"
  },
  "/_nuxt/slugify.7011283c.js": {
    "type": "application/javascript",
    "etag": "\"384c-i9t7Cl5pHdQhgWOyo2avjJEwjQY\"",
    "mtime": "2023-10-30T01:01:22.467Z",
    "size": 14412,
    "path": "../public/_nuxt/slugify.7011283c.js"
  },
  "/_nuxt/ssr.19412030.js": {
    "type": "application/javascript",
    "etag": "\"7c-asO9zY5oFT1XxPnHvZcZtgMVaLM\"",
    "mtime": "2023-10-30T01:01:22.467Z",
    "size": 124,
    "path": "../public/_nuxt/ssr.19412030.js"
  },
  "/_nuxt/useAuth.0be3f69d.js": {
    "type": "application/javascript",
    "etag": "\"5ab-KMgNSJeTgHA3maDgV44kAaVxUbA\"",
    "mtime": "2023-10-30T01:01:22.467Z",
    "size": 1451,
    "path": "../public/_nuxt/useAuth.0be3f69d.js"
  },
  "/_nuxt/useData.64c161f1.js": {
    "type": "application/javascript",
    "etag": "\"223a-mLf+/xnnLmhLES06oe/PaV/HgEI\"",
    "mtime": "2023-10-30T01:01:22.467Z",
    "size": 8762,
    "path": "../public/_nuxt/useData.64c161f1.js"
  },
  "/_nuxt/vue.f36acd1f.538f8369.js": {
    "type": "application/javascript",
    "etag": "\"18a-Wix4Jd3Odu1lK3a1usfyADznt3M\"",
    "mtime": "2023-10-30T01:01:22.467Z",
    "size": 394,
    "path": "../public/_nuxt/vue.f36acd1f.538f8369.js"
  },
  "/_nuxt/builds/latest.json": {
    "type": "application/json",
    "etag": "\"47-/SXV7eUsGdoSIhxLih0Cae2K1ak\"",
    "mtime": "2023-10-30T01:01:22.443Z",
    "size": 71,
    "path": "../public/_nuxt/builds/latest.json"
  },
  "/_nuxt/builds/meta/ae958178-3a58-41c8-a5f3-33e8a862460f.json": {
    "type": "application/json",
    "etag": "\"8b-F4fLgXM8KkJyEaiw3gl8Whs77vw\"",
    "mtime": "2023-10-30T01:01:22.440Z",
    "size": 139,
    "path": "../public/_nuxt/builds/meta/ae958178-3a58-41c8-a5f3-33e8a862460f.json"
  }
};

function normalizeWindowsPath(input = "") {
  if (!input || !input.includes("\\")) {
    return input;
  }
  return input.replace(/\\/g, "/");
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises$1.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta":{"maxAge":31536000},"/_nuxt/builds":{"maxAge":1},"/_nuxt":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    setResponseHeader(event, "Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError$1({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => {
  __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class UsersService {
  constructor(usersRepository, tokenService, emailService, event) {
    this.usersRepository = usersRepository;
    this.tokenService = tokenService;
    this.emailService = emailService;
    __publicField$1(this, "event");
    this.event = event || useRequestEvent();
  }
  async create(body) {
    var _a;
    const response = {
      errors: void 0,
      user: void 0
    };
    if (!body) {
      response.errors = { other: "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u044B \u0432\u0441\u0435 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435" };
      return response;
    }
    if (!body.email.trim()) {
      response.errors = { email: "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D email" };
      return response;
    }
    const user = await this.usersRepository.checkEmail(body.email);
    if (user) {
      response.errors = { email: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0441 \u0443\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u043C email \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442" };
      return response;
    }
    if (!((_a = body == null ? void 0 : body.fio) == null ? void 0 : _a.trim())) {
      response.errors = { fio: "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D \u0424\u0418\u041E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F" };
      return response;
    }
    const code = this.makeCode();
    if (!(body == null ? void 0 : body.code)) {
      const user2 = await this.usersRepository.createUser(body.email, code);
      if (!user2) {
        await this.usersRepository.saveCode(body.email, code);
      }
      await this.sendEmail(body.email, code);
      response.user = user2;
      return response;
    }
    const logged = await this.usersRepository.registration(body);
    if (!logged) {
      response.errors = { confirm_code: "\u0423\u043A\u0430\u0437\u0430\u043D \u043D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043A\u043E\u0434" };
      return response;
    }
    const payload = this.makePayload(logged);
    const tokens = await this.tokenService.generate(payload);
    if (this.event)
      this.tokenService.save(tokens, this.event);
    response.user = payload;
    return response;
  }
  delete(id) {
    return Promise.resolve(false);
  }
  async get(id) {
    return await this.usersRepository.info(id);
  }
  async login(email) {
    const user = await this.usersRepository.checkEmail(email);
    const response = {
      errors: void 0,
      user: user !== null ? user : void 0
    };
    if (user === null) {
      response.errors = {
        email: `\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0441 email \xAB${email}\xBB \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442`
      };
      return response;
    }
    const code = this.makeCode();
    try {
      await this.usersRepository.saveCode(email, code);
      await this.sendEmail(email, code);
    } catch (e) {
      response.errors = {
        other: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0438 email, \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043F\u043E\u0437\u0436\u0435"
      };
    }
    return response;
  }
  async validate(user) {
    const founded = await this.usersRepository.authorize(user.email, user.confirmCode || "0");
    const response = {
      errors: void 0,
      user: void 0
    };
    if (!founded) {
      response.errors = {
        confirm_code: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043A\u043E\u0434 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F"
      };
      return response;
    }
    const payload = this.makePayload(founded);
    const tokens = await this.tokenService.generate(payload);
    if (this.event) {
      this.tokenService.save(tokens, this.event);
    }
    response.user = payload;
    return response;
  }
  totalCount() {
    return Promise.resolve(0);
  }
  makeCode(min = 1e7, max = 99999999) {
    return String(Math.floor(Math.random() * (max - min) + min));
  }
  async sendEmail(email, code) {
    var _a;
    const result = await this.emailService.send({
      to: email,
      from: process.env.MAIL_FROM || "",
      subject: "\u041A\u043E\u0434 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F",
      text: `\u041A\u043E\u0434 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F: ${code}`,
      html: `<html lang="ru"><head></head><body><h1>\u041A\u043E\u0434 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F: ${code}</h1></body></html>`
    });
    if (!result.error)
      return { email };
    throw createError$1({
      statusCode: 500,
      message: (_a = result.error) == null ? void 0 : _a.message
    });
  }
  async check(accessToken) {
    const payload = await this.tokenService.checkAccess(accessToken);
    if (payload && typeof payload !== "string" && typeof payload !== "boolean") {
      const user = await this.get(payload.id);
      if (user)
        return this.makePayload(user);
      return null;
    }
    return null;
  }
  async refresh() {
    if (!this.event)
      return null;
    const payload = await this.tokenService.checkRefresh(this.event);
    if (payload && typeof payload !== "string" && typeof payload !== "boolean") {
      const user = await this.get(payload.id);
      if (user)
        return this.makePayload(user);
    }
    return null;
  }
  logout() {
    if (this.event) {
      this.tokenService.logout(this.event);
    }
  }
  makePayload(user) {
    return {
      id: user == null ? void 0 : user.id,
      email: user.email,
      fio: user == null ? void 0 : user.fio,
      rights: ((user == null ? void 0 : user.isAdmin) ? 2 : 0) + ((user == null ? void 0 : user.isModerator) ? 1 : 0)
    };
  }
}

const prismaClient = new PrismaClient({ log: ["query"] });

class UsersRepository {
  async count() {
    return prismaClient.users.count({});
  }
  async list(skip = 0, take = 20) {
    return prismaClient.users.findMany({
      skip,
      take,
      orderBy: [
        { isAdmin: "desc" },
        { isModerator: "desc" },
        { fio: "asc" }
      ]
    });
  }
  async info(id) {
    return prismaClient.users.findFirst({
      where: {
        id
      }
    });
  }
  async registration(body) {
    await this.deleteOldCodes();
    try {
      return await prismaClient.users.update({
        where: {
          email: body == null ? void 0 : body.email,
          confirmCode: body == null ? void 0 : body.code,
          isNew: true
        },
        data: {
          fio: body == null ? void 0 : body.fio,
          isNew: false,
          changedAt: /* @__PURE__ */ new Date()
        }
      });
    } catch (e) {
      console.log(e);
    }
    return void 0;
  }
  /**
   * Сохраняем сгенерированный код, при логине
   * @param email
   * @param code
   */
  async saveCode(email, code) {
    try {
      await prismaClient.users.update({
        where: { email },
        data: {
          confirmCode: code,
          changedAt: /* @__PURE__ */ new Date()
        }
      });
    } catch (e) {
    }
  }
  /**
   * Создаём нового пользователя при регистрации
   * @param email
   * @param code
   */
  async createUser(email, code) {
    const user = await prismaClient.users.findFirst({
      where: {
        email
      }
    });
    if (user)
      return void 0;
    return prismaClient.users.create({
      data: {
        email,
        confirmCode: code,
        isNew: true
      }
    });
  }
  async save(user) {
    if (!(user == null ? void 0 : user.id)) {
      return prismaClient.users.create({
        data: {
          email: user.email,
          fio: user.fio,
          isNew: false,
          isAdmin: user.isAdmin,
          isModerator: user.isModerator
        }
      });
    }
    return prismaClient.users.update({
      data: {
        email: user.email,
        fio: user.fio,
        isAdmin: user.isAdmin,
        isModerator: user.isModerator
      },
      where: {
        id: user.id
      }
    });
  }
  async delete(id) {
    return prismaClient.users.delete({
      where: { id }
    });
  }
  async checkEmail(email, id) {
    return prismaClient.users.findFirst({
      where: {
        AND: [
          { email },
          {
            id: {
              not: id
            },
            isNew: false
          }
        ]
      }
    });
  }
  /**
   * Авторизация пользователя и генерация JWT
   * @param email
   * @param code
   */
  async authorize(email, code) {
    await this.deleteOldCodes();
    return prismaClient.users.findFirst({
      where: {
        email,
        confirmCode: code
      }
    });
  }
  async deleteOldCodes() {
    const timeout = /* @__PURE__ */ new Date();
    timeout.setTime(timeout.getTime() - 30 * 6e4);
    await prismaClient.users.updateMany({
      where: {
        changedAt: {
          lte: timeout
        }
      },
      data: {
        confirmCode: ""
      }
    });
  }
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class TokenService {
  constructor() {
    __publicField(this, "refreshSecret");
    __publicField(this, "refreshLifetime");
    __publicField(this, "accessSecret");
    __publicField(this, "accessLifetime");
    var _a, _b, _c, _d;
    this.accessSecret = ((_a = process == null ? void 0 : process.env) == null ? void 0 : _a.JWT_ACCESS_SECRET) || "SECRET";
    this.accessLifetime = ((_b = process == null ? void 0 : process.env) == null ? void 0 : _b.JWT_ACCESS_LIFETIME) || "30m";
    this.refreshSecret = ((_c = process == null ? void 0 : process.env) == null ? void 0 : _c.JWT_REFRESH_SECRET) || "REFRESH_SECRET";
    this.refreshLifetime = ((_d = process == null ? void 0 : process.env) == null ? void 0 : _d.JWT_REFRESH_LIFETIME) || "30d";
  }
  /**
   * Проверяем соответствие токена
   * @param token
   * @param secret
   */
  async check(token, secret) {
    try {
      return jwt.verify(token, secret);
    } catch (e) {
      return false;
    }
  }
  async checkAccess(token) {
    return await this.check(token, this.accessSecret);
  }
  async checkRefresh(event) {
    const token = getCookie(event, "rf_token");
    if (!token)
      return false;
    return await this.refresh(token, event);
  }
  /**
   * Формирование JWT токенов
   * @param payload
   * @param secret
   * @param expiresIn
   */
  make(payload, secret, expiresIn) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        secret,
        {
          algorithm: "HS256",
          expiresIn
        },
        (err, token) => {
          if (err)
            reject(err);
          resolve(token);
        }
      );
    });
  }
  /**
   * Генерация Access и Refresh токенов
   * @param payload
   */
  async generate(payload) {
    return {
      access: await this.make(payload, this.accessSecret, this.accessLifetime),
      refresh: await this.make(payload, this.refreshSecret, this.refreshLifetime)
    };
  }
  /**
   * СОхранение Access и Refresh токенов в куки
   * @param tokens
   * @param event
   */
  save(tokens, event) {
    if (!event)
      return;
    this.saveAccess(tokens.access, event);
    this.saveRefresh(tokens.refresh, event);
  }
  saveAccess(token, event) {
    const exp = /* @__PURE__ */ new Date();
    exp.setTime(Date.now() + ms(this.accessLifetime));
    this.saveTokenCookie("ac_token", token, event, exp, false);
  }
  saveRefresh(token, event) {
    if (!event)
      return;
    const exp = /* @__PURE__ */ new Date();
    exp.setTime(Date.now() + ms(this.refreshLifetime));
    this.saveTokenCookie("rf_token", token, event, exp, true);
  }
  saveTokenCookie(tokenName, tokenValue, event, expires, httpOnly = true) {
    setCookie(event, tokenName, tokenValue, {
      httpOnly,
      expires
    });
  }
  /**
   * Обновление токенов
   * @param event
   * @param token
   */
  async refresh(token, event) {
    if (!event)
      return null;
    const data = await this.check(token, this.refreshSecret);
    if (typeof data !== "string" && data && typeof data !== "boolean") {
      const { exp, iat, ...userData } = data;
      const payload = userData;
      const jwt2 = await this.generate(payload);
      this.saveAccess(jwt2.access, event);
      this.saveRefresh(jwt2.refresh, event);
      return { ...payload, accessToken: jwt2.access };
    }
    return null;
  }
  logout(event) {
    deleteCookie(event, "ac_token");
    deleteCookie(event, "rf_token");
  }
}

class EmailService {
  async send(email) {
    return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_SERVER,
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PSW
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      transporter.verify(async (error) => {
        if (error) {
          reject({
            message: `Can't connect`,
            error
          });
        } else {
          const result = await this.process(transporter, email);
          resolve(result);
        }
      });
      transporter.close();
    });
  }
  async process(transporter, email) {
    return new Promise(async (resolve, reject) => {
      transporter.sendMail(
        {
          from: email.from,
          to: email.to,
          subject: email.subject,
          text: email.text,
          html: (email == null ? void 0 : email.html) || email.text
        },
        (error, info) => {
          if (error)
            reject({ message: "Error", error });
          resolve({ message: info.response });
        }
      );
    });
  }
}

async function authMiddleware(accessToken, event) {
  const userService = new UsersService(
    new UsersRepository(),
    new TokenService(),
    new EmailService(),
    event
  );
  let user = await userService.check(accessToken);
  if (!user) {
    user = await userService.refresh();
  }
  return user;
}

const _t6kEBP = defineEventHandler(async (event) => {
  var _a;
  if (!(event == null ? void 0 : event.path.match(/^\/(client|api)\/?/im)) || (event == null ? void 0 : event.path.match(/^\/api\/users\/logout/im)))
    return;
  console.log("middleware.auth", event == null ? void 0 : event.path);
  const access = getCookie(event, "ac_token");
  const headers = getHeaders(event);
  const accessToken = ((_a = headers["authorization"]) == null ? void 0 : _a.replace("Bearer ", "").trim()) || access;
  const refreshToken = getCookie(event, "rf_token");
  if (!accessToken && !refreshToken) {
    console.log("Server middleware", "no tokens");
    return;
  }
  if (!accessToken)
    return;
  const user = await authMiddleware(accessToken, event);
  if (user) {
    event.context.user = user;
  }
});

const _DVOx8p = lazyEventHandler(() => {
  const opts = useRuntimeConfig().ipx || {};
  const fsDir = opts.fs?.dir ? isAbsolute(opts.fs.dir) ? opts.fs.dir : fileURLToPath(new URL(opts.fs.dir, globalThis._importMeta_.url)) : void 0;
  const fsStorage = opts.fs?.dir ? ipxFSStorage({ ...opts.fs, dir: fsDir }) : void 0;
  const httpStorage = opts.http?.domains ? ipxHttpStorage({ ...opts.http }) : void 0;
  if (!fsStorage && !httpStorage) {
    throw new Error("IPX storage is not configured!");
  }
  const ipxOptions = {
    ...opts,
    storage: fsStorage || httpStorage,
    httpStorage
  };
  const ipx = createIPX(ipxOptions);
  const ipxHandler = createIPXH3Handler(ipx);
  return useBase(opts.baseURL, ipxHandler);
});

const _lazy_eHzX3P = () => import('../_...category_.delete.mjs');
const _lazy_GspKGH = () => import('../_...category_.get.mjs');
const _lazy_IQhGsQ = () => import('../_...category_.post.mjs');
const _lazy_YiZPsW = () => import('../index.get.mjs');
const _lazy_Sfbn3x = () => import('../_id_.get.mjs');
const _lazy_UJ6LBU = () => import('../_...category_.get2.mjs');
const _lazy_BW9hrS = () => import('../_...category_.post2.mjs');
const _lazy_o9T4SX = () => import('../index.get2.mjs');
const _lazy_DeOoTo = () => import('../_id_.post.mjs');
const _lazy_WCLigA = () => import('../_...params_.post.mjs');
const _lazy_od29MT = () => import('../_email_.get.mjs');
const _lazy_v5ezXA = () => import('../_code_.get.mjs');
const _lazy_VhfrUT = () => import('../index.get3.mjs');
const _lazy_CbFL5i = () => import('../registration.post.mjs');
const _lazy_bIsAvh = () => import('../handlers/renderer.mjs').then(function (n) { return n.r; });

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _t6kEBP, lazy: false, middleware: true, method: undefined },
  { route: '/api/admin/data/**:category', handler: _lazy_eHzX3P, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/data/**:category', handler: _lazy_GspKGH, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/data/**:category', handler: _lazy_IQhGsQ, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/data', handler: _lazy_YiZPsW, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/user/:id', handler: _lazy_Sfbn3x, lazy: true, middleware: false, method: "get" },
  { route: '/api/data/**:category', handler: _lazy_UJ6LBU, lazy: true, middleware: false, method: "get" },
  { route: '/api/data/**:category', handler: _lazy_BW9hrS, lazy: true, middleware: false, method: "post" },
  { route: '/api/data', handler: _lazy_o9T4SX, lazy: true, middleware: false, method: "get" },
  { route: '/api/news/edit/:id', handler: _lazy_DeOoTo, lazy: true, middleware: false, method: "post" },
  { route: '/api/users/**:params', handler: _lazy_WCLigA, lazy: true, middleware: false, method: "post" },
  { route: '/api/users/:email', handler: _lazy_od29MT, lazy: true, middleware: false, method: "get" },
  { route: '/api/users/check/:code', handler: _lazy_v5ezXA, lazy: true, middleware: false, method: "get" },
  { route: '/api/users/logout', handler: _lazy_VhfrUT, lazy: true, middleware: false, method: "get" },
  { route: '/api/users/registration', handler: _lazy_CbFL5i, lazy: true, middleware: false, method: "post" },
  { route: '/__nuxt_error', handler: _lazy_bIsAvh, lazy: true, middleware: false, method: undefined },
  { route: '/_ipx/**', handler: _DVOx8p, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_bIsAvh, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((_err) => {
      console.error("Error while capturing another error", _err);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      await nitroApp.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const localCall = createCall(toNodeListener(h3App));
  const _localFetch = createFetch(localCall, globalThis.fetch);
  const localFetch = (input, init) => _localFetch(input, init).then(
    (response) => normalizeFetchResponse(response)
  );
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  h3App.use(
    eventHandler((event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const envContext = event.node.req?.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (envContext?.waitUntil) {
          envContext.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
    })
  );
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  for (const plugin of plugins) {
    try {
      plugin(app);
    } catch (err) {
      captureError(err, { tags: ["plugin"] });
      throw err;
    }
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((err) => {
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        destroy(socket);
      }
    }
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        destroy(socket);
      }
    }
  }
  server.on("request", function(req, res) {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", function() {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", function(socket) {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", function() {
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    if (options.development) {
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        return Promise.resolve(false);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((err) => {
      const errString = typeof err === "string" ? err : JSON.stringify(err);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT, 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((err) => {
          console.error(err);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const path = process.env.NITRO_UNIX_SOCKET;
const listener = server.listen(path ? { path } : { port, host }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  if (typeof addressInfo === "string") {
    console.log(`Listening on unix socket ${addressInfo}`);
    return;
  }
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening on ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

export { $fetch as $, deleteCookie as A, hash as B, parse as C, getRequestHeader as D, EmailService as E, destr as F, isEqual as G, setCookie as H, getCookie as I, parseQuery as J, withTrailingSlash as K, withoutTrailingSlash as L, encodeParam as M, withLeadingSlash as N, encodePath as O, nodeServer as P, TokenService as T, UsersRepository as U, UsersService as a, getRouterParam as b, createError$1 as c, defineEventHandler as d, eventHandler as e, send as f, getRequestHeaders as g, getResponseStatus as h, setResponseStatus as i, setResponseHeaders as j, joinURL as k, useRuntimeConfig as l, getQuery as m, getRouteRules as n, getResponseStatusText as o, prismaClient as p, hasProtocol as q, readBody as r, setResponseHeader as s, parseURL as t, useNitroApp as u, isScriptProtocol as v, withQuery as w, defu as x, sanitizeStatusCode as y, createHooks as z };
