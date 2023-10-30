import { c as createError } from './nitro/node-server.mjs';

const protectRoute = (event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized"
    });
  }
};

export { protectRoute as p };
