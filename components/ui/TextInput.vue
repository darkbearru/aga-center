<script setup lang="ts">
	defineProps({
		placeholder: String,
		type: {
			type: String,
			default: "text"
		},
		modelValue: String
	});
	defineEmits(['update:modelValue'])</script>

<template>
	<input
		class="w-full p-2 rounded-sm text-lg text-dark-light placeholder-dark-light placeholder-opacity-60 border border-main ring-0 ring-offset-0 outline-none focus:outline-none focus-visible:ring focus:ring-1 focus:border-main-light focus:ring-main-light"
		:type="type"
		:placeholder="placeholder"
		@input="$emit('update:modelValue', $event.target.value)"
	/>
</template>

<style scoped>

</style>