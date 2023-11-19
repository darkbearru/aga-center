<script setup lang="ts">


import { useClientData } from '~/components/stores/useClientData';
import type { TArticle } from '~/src/data/types/articles';
import BigPhotosList from '~/components/content/photos/BigPhotosList.vue';

const route = useRoute();
const clientData = useClientData();
if (!route.params.slug) navigateTo('/');

const article = ref<TArticle | undefined>();
const photos = ref();
const error = ref('');


clientData.articleBySlug(
(Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug) || ''
).then((data: TArticle) => {
	useHead({ title: data?.title });
	if (data.text) {
		data.text = data.text?.split('\n').join('<br />');
	}
	photos.value?.update(article.value?.photos);
	article.value = data;
}).catch(e => {
	error.value = e;
});


</script>

<template>
	<div>
		<div v-if="error">
			<h2 class="text-red-600 text-xl lg:text-2xl mb-6 text-center">{{ error }}</h2>
		</div>
		<div v-else>
			<div v-if="article" class="grid md:gap-8 mt-4 md:mt-0 w-full max-w-4xl mx-auto mb-6">
				<div class="w-full">
					<h2 class="text-main text-xl lg:text-2xl mb-6">{{ article.title }}</h2>
					<BigPhotosList :photos="article.photos" ref="photos" class="mb-4"/>
					<div class="text-dark-main lg:text-lg" v-html="article.text"></div>
				</div>
			</div>
		</div>
	</div>

</template>

<style scoped>

</style>