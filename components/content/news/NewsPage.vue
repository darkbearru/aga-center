<script setup lang="ts">
import { useClientData } from '~/components/stores/useClientData';
import type { TNews, TNewsList } from '~/src/data/types/news';
import ContentAndHeader from '~/components/layout/ContentAndHeader.vue';
import LastNews from '~/components/content/LastNews.vue';
import NewsText from '~/components/content/news/NewsText.vue';
import NewsList from '~/components/content/news/NewsList.vue';

useHead({ title: 'АГА.Новости' });

const clientData = useClientData();
const route = useRoute();
const page = parseInt(route.params?.page as string || '0');
const newsData = ref<TNews | undefined>(undefined);
const newsList = ref<TNewsList | undefined>(undefined);
const newsListComponent = ref();

if (route.params.slug) {
	clientData.newsText(route.params.slug as string).then((data) => {
		newsData.value = data as TNews;
		useHead({ title: (data as TNews).title });
	})
} else {
	clientData.newsList(page).then( data => {
		newsList.value = data as TNewsList
		if(newsListComponent.value) newsListComponent.value.update(data as TNewsList);
	})
}

</script>

<template>
	<div>
		<div v-if="newsData" class="grid grid-cols-12 md:gap-8 mt-4 md:mt-0 w-full max-w-screen-xl mx-auto my-0">
			<ContentAndHeader class="order-2 md:order-1 col-span-12 md:col-span-3" title="Новости проекта">
				<LastNews />
			</ContentAndHeader>
			<div class="order-1 md:order-2 col-span-12 md:col-span-9">
				<NewsText :data="newsData" />
			</div>
		</div>
		<div v-else>
			<div class="mx-auto max-w-2xl">
				<NewsList :data="newsList" ref="newsListComponent" />
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>