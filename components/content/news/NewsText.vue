<script setup lang="ts">
import type { TNews, TNewsTime } from '~/src/data/types/news';

const props = defineProps({
	data: Object
})
const newsData = ref<TNews & TNewsTime>(props.data as TNews);

useHead({
	title: props.data?.title || 'Новости'
})

</script>

<template>
	<h2 class="text-main text-xl lg:text-2xl mb-6">{{ newsData.title }}</h2>
	<div class="text-dark-light text-xs lg:text-sm mb-6"><time :datetime="newsData.date">{{ newsData.timeInfo }}</time></div>
	<div class="text-dark-main lg:text-lg" v-html="newsData.text?.split('\n').join('<br />')"></div>
</template>

<style scoped>

</style>