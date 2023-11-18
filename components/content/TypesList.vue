<script setup lang="ts">

import type { TInitiativeTypes } from '~/src/data/types/initiatives.types';
import type { TInitiativeListItem } from '~/src/data/types/initiatives';
import TypesListItem from '~/components/content/TypesListItem.vue';
import InitiativePopupForm from '~/components/content/initiatives/InitiativePopupForm.vue';
import { useClientData } from '~/components/stores/useClientData';

defineExpose({ directionChange, searchChange, popupOpen });

const clientData = useClientData();
const typesList = ref<TInitiativeTypes[]>();
const typesListItem = ref();
const initiativeForm = ref();

await loadTypesList();

async function loadTypesList(): Promise<void> {
	clientData.typesList().then((data) => {
		typesList.value = data as TInitiativeTypes[];
		if (typesList.value?.length === 1) {
			if (typeof typesListItem?.value !== 'undefined') typesListItem?.value[0]?.openInitiativeList();
		}
	});
}


function popupOpen(initiative: TInitiativeListItem): void {
	initiativeForm.value.popupOpen(initiative);
}


async function directionChange(direction: number): Promise<void> {
	clientData.direction = direction;
	await loadTypesList();
}

async function searchChange(): Promise<void> {
	await loadTypesList();
}

const openGroup = (value?: number) => {
	if (!typesListItem.value) return;
	typesListItem.value?.forEach((item: { toggleOpen: (arg0: number | undefined) => any; }) => item?.toggleOpen(value));
};

</script>

<template>
	<div>
		<div class="divide-y divide-gray-200">
			<div v-if="typesList?.length">
				<div v-for="item in typesList">
					<TypesListItem :key="item.id" :item="item" @click="popupOpen" @open="openGroup" ref="typesListItem"/>
				</div>
			</div>
			<div v-else>
				<div class="p-8 my-6 border rounded border-main text-main text-center">
					<div v-if="clientData.searchText">
						По запросу «{{ clientData.searchText }}», ничего не найдено. Попробуйте уточнить запрос.
					</div>
					<div v-else>
						Предложений по направлению «{{ clientData.direction ? 'Бизнес' : 'Отдых' }}»
					</div>
				</div>
			</div>
		</div>

		<InitiativePopupForm ref="initiativeForm"/>

	</div>
</template>

<style scoped lang="postcss">

</style>