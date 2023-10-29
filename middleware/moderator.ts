export default defineNuxtRouteMiddleware((to) => {
	const event = useRequestEvent();
	if (!event) return;

	let accessGranted: boolean = false;
	if (event.context.user) {
		if (event.context.user?.rights&1) {
			accessGranted = true;
		}
	}

	if (to.path !== '/' && (!accessGranted)) {
		return navigateTo('/')
	}
})