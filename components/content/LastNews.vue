<script setup lang="ts">

import { useClientData } from '~/components/stores/useClientData';
import NewsItem from '~/components/content/NewsItem.vue';
import type { TNewsList } from '~/src/data/types/news';

const lastNews = ref<TNewsList>([]);

const clientData = useClientData();
clientData.newsList(0).then((data) => {
	lastNews.value = data as TNewsList;
});

</script>

<template>
	<div>
		<div class="space-y-4 mb-4">
			<div v-for="item in lastNews">
				<NewsItem :key="item.id" :time-info="item.timeInfo" :time-short="item.timeShort"  :link="`/news/${item.slug}`">
					{{ item.title }}
				</NewsItem>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>