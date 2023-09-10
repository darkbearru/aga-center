<script setup lang="ts">
	defineProps({
		icon: String
	})
</script>

<template>
	<div>
		<div v-html="require(`./../../resources/svg/icon-${icon}.svg`)"></div>
	</div>
</template>

<style scoped>

</style>