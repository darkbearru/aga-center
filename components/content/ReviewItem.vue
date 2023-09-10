<script setup lang="ts">
defineProps({
	name: String,
});
</script>

<template>
	<div class="relative border border-gray-200 p-4 md:p-8 mx-8 mb-6 md:m-0 hyphens-auto text-dark-light" lang="ru">
		<h3 class="absolute left-[50%] bottom-[-11px] translate-x-[-50%] text-center bg-white px-2">{{ name }}</h3>
		<slot />
	</div>
</template>

<style scoped>

</style>