<script setup lang="ts">

import ContentAndHeader from '~/components/layout/ContentAndHeader.vue';
import LastNews from '~/components/content/LastNews.vue';
import ReviewsList from '~/components/content/ReviewsList.vue';
import { useClientData } from '~/components/stores/useClientData';
import TypesList from '~/components/content/TypesList.vue';
import TitlePicture from '~/components/layout/TitlePicture.vue';

useHead({ title: 'АГА. Тур-центр' });

const typesList = ref();

const directionChange = (value: number) => typesList?.value?.directionChange(value);

const searchChange = () => typesList?.value?.searchChange();


</script>

<template>
	<div>
		<TitlePicture @direction="directionChange" @search="searchChange"/>
		<div class="grid grid-cols-12 md:gap-8 mt-4 md:mt-0 w-full max-w-screen-xl mx-auto my-0">
			<ContentAndHeader class="order-2 md:order-1 col-span-12 md:col-span-3" title="Новости проекта">
				<LastNews />
			</ContentAndHeader>
			<ContentAndHeader class="order-1 md:order-2 col-span-12 md:col-span-9" title="Список инициатив">
				<TypesList ref="typesList" />
			</ContentAndHeader>
			<ContentAndHeader class="order-3 md:order-3 col-span-12" title="Отзывы">
				<ReviewsList/>
			</ContentAndHeader>
		</div>
	</div>
</template>

<style scoped>

</style>