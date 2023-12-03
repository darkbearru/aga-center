<script setup lang="ts">
import { useData } from '~/components/stores/useData';
import InitiativeTypesListItem from '~/components/content/admin/initiatives/InitiativeTypesListItem.vue';
import type { TInitiativeTypes } from '~/src/data/types/initiatives.types';

const data = useData();
const typesList = ref(data.types);

const emit = defineEmits(['click', 'delete']);

const onClick = (item: TInitiativeTypes) => {
	emit('click', item);
}

const onDelete = (item: TInitiativeTypes) => {
	emit('delete', item);
}

const update = () => {
	typesList.value = data.types;
}
defineExpose({update});

</script>

<template>
	<InitiativeTypesListItem v-for="item in typesList" :item="item" :key="`types${item.id}`" @click="onClick" @delete="onDelete"/>
</template>

<style scoped>

</style>