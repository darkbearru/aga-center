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
	<div class="flex items-center gap-2 px-3 py-3 bg-dark-light/10 odd:bg-white hover:bg-dark-light/20 cursor-pointer round" @click.prevent.stop="onClick">
		<div class="w-[20px]">
			<IconActive v-if="props.item?.status" class="w-5 h-5" filled />
			<IconNotActive v-else class="w-хъ h-5" filled />
		</div>
		<div class="w-6/12 grow">
			{{ props.item.name }}
			<div v-if="!props.item?.isApproved && !props.item?.isDeclined"
			     class="inline-flex items-center text-center px-2 py-1 rounded bg-yellow-500 text-white text-xs ml-2"
			>
				Ожидает&nbsp;модерации
			</div>
			<div v-if="!props.item?.isApproved && props.item?.isDeclined"
			     class="inline-flex items-center text-center px-2 py-1 rounded bg-red-600 text-white text-xs ml-2"
			>
				Отклонена
			</div>
		</div>
		<div class="w-2/12">{{ directions[props.item.direction] }}</div>
		<div class="w-2/12">{{ props.item.region.name }}</div>
		<div class="flex w-[20px] justify-end">
			<a href="" class="block w-5 h-5 text-dark-main hover:text-main" @click.prevent.stop="onDelete"><IconTrash filled /></a>
		</div>
	</div>
</template>

<style scoped>

</style>