<script setup lang="ts">
import Button from '~/components/ui/Button.vue';
import IconLogin from '~/assets/svg/icon-login.svg';
</script>

<template>
	<div class="flex order-2 md:order-3 items-center justify-end md:justify-start w-6/12 md:w-1/12">
		<Button class="btn-main" title="Войти">
			<IconLogin filled /><span class="hidden md:inline">Войти</span>
		</Button>
	</div>
</template>

<style scoped lang="postcss">
.btn-main {
	@apply bg-main text-white flex items-center hover:bg-main-light;
	svg {
		@apply block text-white w-6 h-6 pl-1 md:pl-0 md:pr-1 m-0;
	}
}
</style>