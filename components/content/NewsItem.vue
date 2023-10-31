<script setup lang="ts">
const props = defineProps({
	timeShort: String,
	timeInfo: String,
	link: String,
});

</script>

<template>
	<div>
		<a :href="link" class="block px-8 md:px-0 text-dark-light no-underline leading-5 hyphens-auto hover:underline hover:decoration-main hover:text-main" lang="ru">
			<time class="text-main pr-2" :datetime="timeInfo">{{ timeShort }}</time>
			<slot />
		</a>
	</div>
</template>

<style scoped>
</style>