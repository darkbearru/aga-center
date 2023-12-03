<script setup lang="ts">

import type { TInitiative } from '~/src/data/types/initiatives';
import IconNotActive from 'assets/svg/icon-square.svg';
import IconActive from 'assets/svg/icon-checkbox.svg';

const props = defineProps({
	item: Object,
	index: Number,
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
	<div class="flex items-start gap-2 px-3 py-3 bg-dark-light/10 odd:bg-white hover:bg-dark-light/20 cursor-pointer round" @click.prevent.stop="onClick">
		<div class="w-[20px] pt-0.5">
			<IconActive v-if="props.item?.promoStr" class="w-5 h-5" filled />
			<IconNotActive v-else class="w-5 h-5" filled />
		</div>
		<div class="w-8/12 grow">
			{{ props.item.name }}
			<p v-if="props.item?.promoStr" class="text-main text-sm">в промо-блоке до {{ props.item.promoStr }}</p>
		</div>
		<div class="w-2/12">{{ directions[props.item.direction] }}</div>
		<div class="w-2/12 text-right">{{ props.item.region.name }}</div>
	</div>
</template>

<style scoped>

</style>