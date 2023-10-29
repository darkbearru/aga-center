<script setup lang="ts">

import { TCommonData } from '~/src/data/types/common.data';
import News from '~/components/layout/admin/News.vue';
import Companies from '~/components/layout/admin/Companies.vue';

definePageMeta({
	middleware: ["auth"],
	layout: "client",
});

const props = defineProps({
	data: Object
})

useHead({
	title: (props.data as TCommonData)?.news ? 'АГА. Список новостей' : 'Список компаний / инициатив'
});

</script>

<template>
	<div v-if="(data as TCommonData)?.news">
		<News />
	</div>
	<div v-else>
		<Companies />
	</div>
</template>

<style scoped>

</style>