<script setup lang="ts">
import { useClientData } from '~/components/stores/useClientData';
import type { TInitiativeTypes } from '~/src/data/types/initiatives.types';
import TypesListItem from '~/components/content/TypesListItem.vue';

const clientData = useClientData();
const typesList = ref<TInitiativeTypes[]>();

clientData.typesList().then((data) => {
	typesList.value = data as TInitiativeTypes[];
	console.log(clientData.types);
});

</script>

<template>
	<div class="divide-y divide-gray-200">
		<TypesListItem
			v-for="item in typesList"
			:item="item"
			:key="item.id"
		/>
	</div>
</template>

<style scoped>

</style>