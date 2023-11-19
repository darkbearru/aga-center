<script setup lang="ts">

import type { TPhotos, TPhotoItem } from '~/src/data/types/photos';

defineExpose({update});
const props = defineProps({
	photos: Array
});
const photosList = ref<TPhotos>(props.photos as TPhotos || []);

function update(photos?: TPhotos): void {
	photosList.value = photos || [];
	console.log(photos);
}


</script>

<template>
	<div>
		<div v-for="item in photosList" class="p-4 bg-gray-100 rounded">
			<NuxtImg
				:src="(item as TPhotoItem).path"
				format="webp"
				quality="85"
				aspect="4/3"
				class="w-full h-full rounded object-cover"
			/>
		</div>
	</div>
</template>

<style scoped>

</style>