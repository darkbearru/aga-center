<script setup lang="ts">

import { TPhotoItem } from '~/src/data/types/photos';
import IconTrash from 'assets/svg/icon-trash.svg';
import IconRestore from 'assets/svg/icon-restore.svg';

const props = defineProps({
	item: Object,
	moderation: {
		type: Boolean,
		default: true,
	}
});
const emit = defineEmits(['deleted']);
const deleted = ref((props.item as TPhotoItem).isDeleted || false);

const onDelete = () => {
	deleted.value = !deleted.value;
	emit('deleted', unref(deleted), props.item?.id);
}

</script>

<template>
	<div class="relative w-[150px] h-[112px]">
		<div v-if="moderation">
			<div v-if="deleted" class="absolute z-20 right-0 top-0 w-6 h-6 p-1 bg-main hover:bg-second text-white cursor-pointer rounded-tr rounded-bl" @click.prevent.stop="onDelete"><IconRestore filled /></div>
			<div v-else class="absolute z-20 right-0 top-0 w-6 h-6 p-1 bg-dark-light hover:bg-red-600 text-white cursor-pointer rounded-tr rounded-bl" @click.prevent.stop="onDelete"><IconTrash filled /></div>
		</div>
		<NuxtImg
			:src="(item as TPhotoItem).path"
			format="webp"
			quality="85"
			aspect="4/3"
			class="w-full h-full rounded object-cover"
		/>
		<div v-if="moderation">
			<div v-if="deleted" class="absolute z-10 top-0 left-0 right-0 bottom-0 backdrop-blur-md bg-dark-light/60 flex items-center justify-center text-white rounded">DELETED</div>
		</div>
	</div>
</template>

<style scoped>

</style>