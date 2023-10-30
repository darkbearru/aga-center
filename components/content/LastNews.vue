<script setup lang="ts">

import { useClientData } from '~/components/stores/useClientData';
import NewsItem from '~/components/content/NewsItem.vue';
import type { TNewsList } from '~/src/data/types/news';

const lastNews = ref<TNewsList>([]);
const clientData = useClientData();

onMounted(() => {
	lastNews.value = clientData.news;
});


</script>

<template>
	<div class="space-y-4 mb-4">
		<NewsItem
			v-for="item in lastNews"
			:key="item.id"
			:link="`/news/${item.slug}`"
			:time-info="item.timeInfo"
			:time-short="item.timeShort"
		>
			{{ item.title }}
		</NewsItem>
	</div>
</template>

<style scoped>

</style>