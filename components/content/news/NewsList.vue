<script setup lang="ts">

import NewsItem from '~/components/content/NewsItem.vue';
import type { TNewsList } from '~/src/data/types/news';

const props = defineProps({ data: Object });
const news = ref<TNewsList>(props.data as TNewsList)

const update = (data: TNewsList) => {
	news.value = data;
}

defineExpose({ update });

</script>

<template>
	<h2 class="text-main text-xl lg:text-2xl mb-6">Новости</h2>
	<div class="space-y-4 mb-4">
		<NewsItem
			v-for="item in news"
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