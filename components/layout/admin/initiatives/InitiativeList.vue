<script setup lang="ts">
import { useData } from '~/components/stores/useData';
import InitiativeListItem from '~/components/layout/admin/initiatives/InitiativeListItem.vue';
import type { TInitiative } from '~/src/data/types/initiatives';

const userData = useData();
const initiatives = ref<TInitiative[]>(userData.initiatives as TInitiative[]);

defineExpose({ refresh, update });
const emit = defineEmits(['onClick', 'onDelete']);

function refresh(items?: TInitiative[]): void {
	initiatives.value = (items || userData.initiatives)  as TInitiative[];
}

function update(item: TInitiative, index: number) {
	if (initiatives.value[index]) initiatives.value[index] = item;
}

function onClick(item: TInitiative, index: number) {
	refresh();
	emit('onClick', initiatives.value[index], index);
}

function onDelete(item: TInitiative, index: number) {
	emit('onDelete', item, index);
}

</script>

<template>
	<div class="my-4 max-w-5xl">
		<InitiativeListItem v-for="(item, index) in initiatives" :key="`init${item.id}`" :item="item" :index="index" @onClick="onClick" @onDelete="onDelete" />
	</div>
</template>

<style scoped>

</style>