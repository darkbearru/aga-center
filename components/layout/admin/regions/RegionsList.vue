<script setup lang="ts">
import { useData } from '~/components/stores/useData';
import RegionsListItem from '~/components/layout/admin/regions/RegionsListItem.vue';
import type { TRegion } from '~/src/data/types/regions';

const data = useData();
const regionsList = ref(data.regions);

const emit = defineEmits(['click', 'delete']);

const onClick = (item: TRegion) => {
	emit('click', item);
}

const onDelete = (item: TRegion) => {
	emit('delete', item);
}

const update = () => {
	regionsList.value = data.regions;
}
defineExpose({update});

</script>

<template>
	<RegionsListItem v-for="item in regionsList" :item="item" :key="item.id" @click="onClick" @delete="onDelete"/>
</template>

<style scoped>

</style>