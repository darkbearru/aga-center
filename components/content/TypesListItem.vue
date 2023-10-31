<script setup lang="ts">

import IconSquarePlus from 'assets/svg/icon-square-plus.svg';
import IconSquareMinus from 'assets/svg/icon-square-minus.svg';
import InitiativeItem from '~/components/content/InitiativeItem.vue';
import { useClientData } from '~/components/stores/useClientData';
import type { TInitiativeTypes } from '~/src/data/types/initiatives.types';
import type { TInitiative, TInitiativeList } from '~/src/data/types/initiatives';

const props = defineProps({
	item: Object,
});
defineExpose({ toggleOpen, openInitiativeList });
const emit = defineEmits(['click', 'open', 'update:modelValue']);
const clientData = useClientData();
const typeItem = ref<TInitiativeTypes>(props.item as TInitiativeTypes);

const initiatives = ref<TInitiativeList>([]);
const isShow = ref(false);
const isLoaded = ref(false);

async function showInitiatives(): Promise<void> {
	isShow.value = !isShow.value;
	if (!isLoaded.value) {
		const data = await clientData.initiativesList(props.item as TInitiativeTypes);
		isLoaded.value = true;
		initiatives.value = data as TInitiativeList;
	}
	emit('open', isShow.value ? typeItem.value?.id : undefined);
}

function openInitiativeList(): void {
	if (!isShow.value) showInitiatives();
}

function toggleOpen(openId?: number): void {
	if (openId !== typeItem?.value?.id) {
		isShow.value = false;
	}
}


const onClick = (id: number): void =>{
	const initiative = initiatives?.value?.find(item => item.id === id);
	if (!initiative) return;
	emit('click', initiative);
}

</script>

<template>
	<div :class="`${isShow  ? 'bg-gray-100' : 'hover:bg-gray-100'}`">
		<div class="flex items-center px-2 py-3 cursor-pointer rounded" @click.prevent="showInitiatives">
			<IconSquarePlus v-if="!isShow" class="w-5 h-5 mr-2 text-gray-400" filled />
			<IconSquareMinus v-else class="w-5 h-5 mr-2 text-gray-400" filled />
			<div class="grow">
				<div class="relative truncate">{{ typeItem.name }}</div>
			</div>
			<div class="inline-block bg-gray-400 text-white text-sm rounded-lg px-2 ml-4">{{ typeItem.countStr }}</div>
		</div>
		<div v-if="isShow" class="pl-6 divide-y divide-gray-200 bg-gray-100">
			<InitiativeItem v-for="item in initiatives" :key="item.id" @click="onClick(item.id)">
				<div class="grow">
					{{ item.name }}
				</div>
				<div>
					{{ item?.Company?.nameShort }}
				</div>
				<div class="">
					{{ item?.rating }}
				</div>
			</InitiativeItem>
		</div>
	</div>
</template>

<style scoped>

</style>