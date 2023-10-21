<script setup lang="ts">
import { useData } from '~/components/stores/useData';
import InitiativeListItem from '~/components/layout/admin/initiatives/InitiativeListItem.vue';
import { TInitiative } from '~/src/data/types/initiatives';

const userData = useData();
const initiatives = ref<TInitiative[]>(userData.initiatives as TInitiative[]);

defineExpose({ refresh });

function refresh() {
	initiatives.value = userData.initiatives  as TInitiative[];
}
</script>

<template>
	<InitiativeListItem v-for="(item, index) in initiatives" :key="item.id" :item="item" :index="index" />
</template>

<style scoped>

</style>