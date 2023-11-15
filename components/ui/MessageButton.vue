<script setup lang="ts">

import Button from '~/components/ui/Button.vue';

defineProps({
	title: String
})
</script>

<template>
	<Button class="flex items-center justify-center px-6 py-3 min-w-[140px]" :title="title">
		<slot />
	</Button>
</template>

<style scoped>

</style>