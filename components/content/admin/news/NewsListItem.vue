<script setup lang="ts">

import IconEdit from 'assets/svg/icon-edit.svg';
import IconTrash from 'assets/svg/icon-trash.svg';
import IconActive from 'assets/svg/icon-checkbox.svg';
import IconNotActive from 'assets/svg/icon-square.svg';
import type { TNews } from '~/src/data/types/news';
const props = defineProps({
	item: Object
});

const emit = defineEmits(['click', 'delete']);

const onClick = () => {
	emit('click', props.item as TNews);
}

const onDelete = () => {
	if (confirm(`Вы действительно хотите удалить новость «${props.item?.name}»`)) {
		emit('delete', props.item as TNews);
	}
}
</script>

<template>
	<div class="flex items-center px-4 py-3 bg-dark-light/10 odd:bg-white hover:bg-dark-light/20 cursor-pointer rounded">
		<div class="flex items-center w-6/12">
			<IconActive class="w-5 h-5 mr-1" filled v-if="(item as TNews).active" />
			<IconNotActive class="w-5 h-5 mr-1" filled v-else />
			{{ (item as TNews).title }}
		</div>
		<div class="w-4/12">/news/{{ (item as TNews).slug }}</div>
		<div class="w-2/12 flex items-center justify-end">
			<a href="" class="block w-5 h-5 mx-1 text-dark-main hover:text-main" @click.prevent="onClick"><IconEdit filled /></a>
			<a href="" class="block w-5 h-5 mx-1 text-dark-main hover:text-main" @click.prevent="onDelete"><IconTrash filled /></a>
		</div>
	</div>
</template>

<style scoped>

</style>