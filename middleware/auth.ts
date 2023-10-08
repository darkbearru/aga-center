export default defineNuxtRouteMiddleware((to) => {
	const event = useRequestEvent();
	if (!event) return;

	if (to.path !== '/' && !event.context.user) {
		return navigateTo('/')
	}
})