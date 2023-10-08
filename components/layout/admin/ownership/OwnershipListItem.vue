<script setup lang="ts">

import IconEdit from 'assets/svg/icon-edit.svg';
import IconTrash from 'assets/svg/icon-trash.svg';
import { TOwnership } from '~/src/data/types/ownership';
const props = defineProps({
	item: Object
});

const emit = defineEmits(['click', 'delete']);

const onClick = () => {
	emit('click', props.item as TOwnership);
}

const onDelete = () => {
	if (confirm(`Вы действительно хотите удалить форму собственности «${props.item?.nameFull} (${props.item?.nameShort})»`)) {
		emit('delete', props.item as TOwnership);
	}
}
</script>

<template>
	<div class="flex items-center px-4 py-3 bg-dark-light/10 odd:bg-white hover:bg-dark-light/20 cursor-pointer rounded">
		<div class="flex items-center w-2/12">
			{{ (item as TOwnership).nameShort }}
		</div>
		<div class="w-8/12">{{ (item as TOwnership).nameFull }}</div>
		<div class="w-2/12 flex items-center justify-end">
			<a href="" class="block w-5 h-5 mx-1 text-dark-main hover:text-main" @click.prevent="onClick"><IconEdit filled /></a>
			<a href="" class="block w-5 h-5 mx-1 text-dark-main hover:text-main" @click.prevent="onDelete"><IconTrash filled /></a>
		</div>
	</div>
</template>

<style scoped>

</style>