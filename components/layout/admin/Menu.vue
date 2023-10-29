<script setup lang="ts">

defineProps({
	menu: Object
});

const route = useRoute();
</script>

<template>
	<div class="flex flex-wrap my-8">
		<NuxtLink
			v-for="(title, url) in menu"
			:key="url"
			:to="url"
			class="w-full py-2 px-4 text-white hover:text-second rounded"
			:class="((route.path.substring(0, url.toString().length) === url && url !== '/client') || (route.path === url)) ? ' bg-second hover:text-white' : ''"
		>
			{{ title }}
		</NuxtLink>
	</div>
</template>

<style scoped>

</style>