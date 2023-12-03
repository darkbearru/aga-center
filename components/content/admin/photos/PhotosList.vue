<script setup lang="ts">

import type { TPhotos } from '~/src/data/types/photos';
import PhotosListItem from '~/components/content/admin/photos/PhotosListItem.vue';

const props = defineProps({
	photos: Object,
	moderation: {
		type: Boolean,
		default: true,
	}
});
const photosList = ref<TPhotos>(props.photos as TPhotos || []);
const emit = defineEmits(['updated']);

defineExpose({update});

const onDelete = (status: boolean, id: number) => {
	const photos: TPhotos = props.photos as TPhotos;
	const changed = photos.find(item => item?.id === id);
	if (changed) {
		changed.isDeleted = status;
	}
	emit('updated');
}

function update(photos: TPhotos): void {
	photosList.value = photos;
}

</script>

<template>

	<div v-if="photosList.length" class="flex gap-2 mb-4">
		<PhotosListItem v-for="item in photosList" :item="item" :key="`photo_${item.id}`" :moderation="props.moderation" @deleted="onDelete" />
	</div>
</template>

<style scoped>

</style>