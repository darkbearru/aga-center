<script setup lang="ts">
import RatingStars from '~/components/ui/RatingStars.vue';

defineProps({
	name: String,
	rating: Number,
	initiative: String
});
</script>

<template>
<!--	md:p-8 mx-8 mb-6 md:m-0 -->
	<div class="relative w-4/12 border border-gray-200 px-4 py-6 hyphens-auto text-dark-light" lang="ru">
		<h3 class="absolute left-[50%] bottom-[-10px] translate-x-[-50%] text-sm text-gray-400 text-center bg-white px-3 whitespace-nowrap">{{ name }}</h3>
		<h4 v-if="initiative" class="text-main mb-1">{{ initiative }}</h4>
		<RatingStars :rating="rating" class="absolute left-[50%] top-[-8px] translate-x-[-50%] text-gray-400 bg-white px-2" />
		<slot />
		{{ rating }}
	</div>
</template>

<style scoped>

</style>