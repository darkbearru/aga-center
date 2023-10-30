<script setup lang="ts">

</script>

<template>
	<nav class="flex grow-1 items-center justify-center order-3 md:order-2 w-full">
		<ul class="flex justify-center w-full md:w-auto">
			<li><NuxtLink href="/news">Новости</NuxtLink></li>
			<li><NuxtLink href="/relax">Отдых</NuxtLink></li>
			<li><NuxtLink href="/work">Работа</NuxtLink></li>
		</ul>
	</nav>
</template>

<style scoped lang="postcss">
	nav li {
		@apply grow w-4/12 md:w-32 text-main text-center md:text-left;
	}
</style>