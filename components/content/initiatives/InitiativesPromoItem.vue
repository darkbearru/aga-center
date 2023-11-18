<script setup lang="ts">

import type { TInitiativeListItem } from '~/src/data/types/initiatives';
import type { TPhotoItem } from '~/src/data/types/photos';
import getRandom from '~/src/utils/random';

defineExpose({update});
const props = defineProps({
	initiative: Object
});
const photo = ref<TPhotoItem>()
const initiative = ref<TInitiativeListItem>(props.initiative as TInitiativeListItem);

update(initiative.value);

function update(item?: TInitiativeListItem): void {
	if (!item) return;
	initiative.value = item;
	if (item?.Photos) {
		const idx = getRandom(0, item?.Photos.length);
		photo.value = item.Photos[Math.floor(idx)];
	}
}

</script>

<template>
	<div
		class="relative rounded-2xl bg-dark-light w-6/12 sm:w-3/12 h-[260px] sm:h-[360px] bg-no-repeat bg-cover cursor-pointer"
		:style="`background-image: url('${(photo as TPhotoItem).path}')`"
	>
		<div class="absolute left-3 bottom-4 z-10 w-7/12 h-6/12">
			<h3 class="inline bg-second text-white text-left text-lg leading-6 decoration-clone px-4 py-2 rounded">{{ initiative?.name }}</h3>
		</div>
<!--
		<NuxtImg v-if="photo"
			:src="(photo as TPhotoItem).path"
			format="webp"
			quality="85"
			aspect="4/3"
			class="absolute left-0 top-0 right-0 bottom-0 object-cover"
		/>
-->
	</div>
</template>

<style scoped>
</style>