<script setup lang="ts">

import type { TInitiative } from '~/src/data/types/initiatives';
import IconNotActive from 'assets/svg/icon-square.svg';
import IconActive from 'assets/svg/icon-checkbox.svg';
import IconTrash from 'assets/svg/icon-trash.svg';

const props = defineProps({
	item: Object,
	index: Number
})

const initiative = props.item as TInitiative;
const directions = ref([ 'Отдых', 'Бизнес' ]);
const emit = defineEmits(['onClick', 'onDelete']);

function onClick(): void {
	emit('onClick', unref(initiative), props.index);
}
function onDelete(): void {
	if (confirm(`Вы действительно хотите удалить инициативу «${initiative.name}»?`)) {
		emit('onDelete', unref(initiative), props.index);
	}
}
</script>

<template>
	<div class="flex items-center px-4 py-3 bg-dark-light/10 odd:bg-white hover:bg-dark-light/20 cursor-pointer round" @click.prevent.stop="onClick">
		<div class="w-1/12">
			<IconActive v-if="props.item?.status" class="w-5 h-5 mr-1" filled />
			<IconNotActive v-else class="w-хъ h-5 mr-1" filled />
		</div>
		<div class="w-6/12">{{ props.item.name }}</div>
		<div class="w-2/12">{{ directions[props.item.direction] }}</div>
		<div class="w-2/12">{{ props.item.region.name }}</div>
		<div class="flex w-1/12 justify-end">
			<a href="" class="block w-5 h-5 mx-1 text-dark-main hover:text-main" @click.prevent.stop="onDelete"><IconTrash filled /></a>
		</div>
	</div>
</template>

<style scoped>

</style>