<script setup lang="ts">
defineProps({
	href: String
})
</script>

<template>
	<div class="order-1 w-6/12 md:w-2/12 h-14 md:h-full md:max-w-[170px] md:ml-[17px]">
		<a :href="href">
			<img src="/images/logo-color.svg" class="w-auto h-14 md:h-full" alt="АГА. Тур-центр. Логотип">
		</a>
	</div>
</template>

<style scoped>

</style>