import { p as protectRoute } from './protectRoute.mjs';
import { c as createError } from './nitro/node-server.mjs';

function checkRoute(event) {
  var _a;
  protectRoute(event);
  if (typeof ((_a = event.context.params) == null ? void 0 : _a.category) === "undefined") {
    throw createError({
      statusCode: 400,
      message: "Bad Request"
    });
  }
}

export { checkRoute as c };
