<script setup lang="ts">

import NewsItem from '~/components/content/NewsItem.vue';

const lastNews = [
	{
		timeShort: '21/06',
		timeInfo: '06-21',
		link: '/news/01',
		title: 'Забайкалье готово финансово поддерживать предприятия, участвующие в программе промышленного туризма',
	},
	{
		timeShort: '17/06',
		timeInfo: '06-17',
		link: '/news/02',
		title: '«Baikal Travel Mart»: какие бренды представила Бурятия на туристской выставке',
	},
	{
		timeShort: '15/06',
		timeInfo: '06-15',
		link: '/news/03',
		title: 'Может ли аэропорт «Байкал» стать центром перевозок России и азиатских стран?',
	},
	{
		timeShort: '14/06',
		timeInfo: '06-14',
		link: '/news/04',
		title: 'Забайкалье готово финансово поддерживать предприятия, участвующие в программе промышленного туризма',
	},
	{
		timeShort: '10/06',
		timeInfo: '06-10',
		link: '/news/05',
		title: '«Baikal Travel Mart»: какие бренды представила Бурятия на туристской выставке',
	},
	{
		timeShort: '09/06',
		timeInfo: '06-09',
		link: '/news/06',
		title: 'Может ли аэропорт «Байкал» стать центром перевозок России и азиатских стран?',
	},
	{
		timeShort: '06/06',
		timeInfo: '06-06',
		link: '/news/07',
		title: 'Забайкалье готово финансово поддерживать предприятия, участвующие в программе промышленного туризма',
	},
	{
		timeShort: '05/06',
		timeInfo: '06-05',
		link: '/news/08',
		title: '«Baikal Travel Mart»: какие бренды представила Бурятия на туристской выставке',
	},
];

</script>

<template>
	<div class="space-y-4 mb-4">
		<div v-for="item in lastNews">
			<NewsItem
				:link="item.link"
				:time-info="item.timeInfo"
				:time-short="item.timeShort"
			>
				{{ item.title }}
			</NewsItem>
		</div>
	</div>
</template>

<style scoped>

</style>