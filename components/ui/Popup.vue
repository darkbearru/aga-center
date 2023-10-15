<script setup lang="ts">
	import IconClose from '~/assets/svg/icon-close.svg';

	defineProps({
		title: String
	});
	const emit = defineEmits(['close']);

	const onClose = () => {
		emit('close');
	}
</script>

<template>
	<div class="relative z-50 pt-4 pb-3 backdrop-blur-md rounded max-h-full overflow-y-scroll">
		<div class="flex items-center relative h-10 px-6 pt-1 pb-4 mb-4 border-b-[1px] border-b-dark-light">
			<h3 v-if="title" class="flex-grow font-semibold uppercase text-inherit m-0">{{ title }}</h3>
			<button class="w-5 h-5 text-inherit" @click="onClose"><IconClose filled /></button>
		</div>
		<div class="px-6">
			<slot />
		</div>
	</div>
</template>

<style scoped>

</style>