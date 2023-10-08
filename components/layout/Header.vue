<script setup lang="ts">
import LogoColor from '~/components/layout/LogoColor.vue';
import Menu from '~/components/layout/Menu.vue';
import Login from '~/components/layout/Login.vue';
import LoginPopup from '~/components/ui/LoginPopup.vue';
import { useAuth } from '~/components/stores/useAuth';
import { TUsersPayload } from '~/src/users/users.payload';

const loginPopup = ref();
const loginBtn = ref();
const loggedUser = ref<TUsersPayload | undefined>(undefined);

const showPopup = (): void => {
	loginPopup.value.show();
}

const hidePopup = (): void => {
	loginBtn.value.hidePopup();
}

const authUser = useAuth();
authUser.check().then(() => {
	loggedUser.value = authUser.user;
});

</script>

<template>
	<header
		class="flex flex-wrap md:flex-nowrap top-0 md:h-44 p-4 md:p-0 md:pt-[22px] bg-none md:bg-[url('/images/clouds.svg')] bg-repeat-x bg-left-top md:sticky z-30"
	>
		<LogoColor class="md:h-20" href="/"/>
		<Menu class="md:h-20" />
		<Login class="md:h-20" @show-popup="showPopup" ref="loginBtn" :loggedUser="loggedUser" />
	</header>
	<LoginPopup @hide-popup="hidePopup" ref="loginPopup"/>

</template>

<style scoped lang="postcss">
</style>