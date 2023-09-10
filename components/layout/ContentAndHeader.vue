<script setup lang="ts">
defineProps({
	title: String
})
</script>

<template>
	<div class="w-full md:w-auto">
		<h2>{{ title }}</h2>
		<slot />
	</div>
</template>

<style scoped lang="postcss">
	h2 {
		@apply inline-flex items-center h-12 min-w-[230px] pl-8 pr-8 mb-4 bg-main-light text-white text-sm md:text-base font-semibold uppercase;
	}
</style>