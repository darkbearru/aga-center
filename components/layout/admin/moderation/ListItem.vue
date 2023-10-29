<script setup lang="ts">
const props = defineProps({
	id: Number,
	title: String,
	text: String
});

const emit = defineEmits(['click']);

const click = () => {
	emit('click', props.id);
}

</script>

<template>
	<div class="flex items-center px-4 py-3 bg-dark-light/10 odd:bg-white hover:bg-dark-light/20 cursor-pointer round" @click.prevent.stop="click">
		<div class="w-5/12">{{ props.title }}</div>
		<div class="w-7/12">{{ props.text }}</div>
	</div>
</template>

<style scoped>

</style>