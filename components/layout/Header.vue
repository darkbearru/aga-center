<script setup lang="ts">
import LogoColor from '~/components/layout/LogoColor.vue';
import Menu from '~/components/layout/Menu.vue';
import Login from '~/components/layout/Login.vue';
</script>

<template>
	<header class="flex flex-wrap md:flex-nowrap top-0 md:h-44 p-4 md:p-0 md:pt-[22px] bg-none md:bg-[url('/images/clouds.svg')] bg-repeat-x bg-left-top md:sticky z-30">
		<LogoColor class="md:h-20" href="/"/>
		<Menu class="md:h-20" />
		<Login class="md:h-20" />
	</header>
</template>

<style scoped lang="postcss">
</style>