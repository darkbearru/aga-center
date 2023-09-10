import { RouteLocationNormalized } from 'vue-router';
import { authMiddleware } from '~/src/middleware/auth.middleware';
import { H3Event } from 'h3';

export default defineNuxtRouteMiddleware((to: RouteLocationNormalized) => {
	const event: H3Event = useRequestEvent();
	return authMiddleware(event, to.path);
})