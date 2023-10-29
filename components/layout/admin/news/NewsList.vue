<script setup lang="ts">
import { useData } from '~/components/stores/useData';
import NewsListItem from '~/components/layout/admin/news/NewsListItem.vue';
import type { TNews } from '~/src/data/types/news';

const data = useData();
const newsList = ref(data.news);

const emit = defineEmits(['click', 'delete']);

const onClick = (item: TNews) => {
	emit('click', item);
}

const onDelete = (item: TNews) => {
	emit('delete', item);
}

const update = () => {
	newsList.value = data.news;
}
defineExpose({update});

</script>

<template>
	<NewsListItem v-for="item in newsList" :item="item" :key="item.id" @click="onClick" @delete="onDelete"/>
</template>

<style scoped>

</style>