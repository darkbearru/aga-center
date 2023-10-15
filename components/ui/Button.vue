<script setup lang="ts">

defineProps({
	to: String
})
</script>

<template>
	<NuxtLink class="rounded px-4 py-1 whitespace-nowrap cursor-pointer" :to="to">
		<slot />
	</NuxtLink>
</template>

<style scoped>

</style>