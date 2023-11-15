<script setup lang="ts">
import { useData } from '~/components/stores/useData';
import ArticlesListItem from '~/components/layout/admin/articles/ArticlesListItem.vue';
import type { TArticle } from '~/src/data/types/articles';

const data = useData();
const articlesList = ref(data.articles);

const emit = defineEmits(['click', 'delete']);

const onClick = (item: TArticle) => {
	emit('click', item);
}

const onDelete = (item: TArticle) => {
	emit('delete', item);
}

const update = () => {
	articlesList.value = data.articles;
}
defineExpose({update});

</script>

<template>
	<ArticlesListItem v-for="item in articlesList" :item="item" :key="item.id" @click="onClick" @delete="onDelete"/>
</template>

<style scoped>

</style>