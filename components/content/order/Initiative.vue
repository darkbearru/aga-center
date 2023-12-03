<script setup lang="ts">

import type { TInitiative } from '~/src/data/types/initiatives';
import PhotosList from '~/components/content/admin/photos/PhotosList.vue';
import IconInfo from 'assets/svg/icon-info.svg';

defineExpose({ update });

const props = defineProps({
	data: Object
});
const initiative = ref<TInitiative>();
const photosList = ref();
const isShow = ref<boolean>(false);

if(typeof props.data !== 'undefined') {
	update(props.data as TInitiative);
}

function update(data: TInitiative): void {
	if (!data) return;
	const textLines = data.text.split('\n');
	data.text = `<p>${textLines.join('</p><p>')}</p>`;
	initiative.value = data;
	photosList.value?.update(data.photos);
}

</script>

<template>
	<div>
		<div class="w-full border border-second px-4 py-3 rounded cursor-pointer transition-colors duration-300" :class="isShow ? 'bg-white' : ' bg-second'" @click="isShow = !isShow">
			<div class="flex items-center flex-wrap sm:flex-nowrap" :class="isShow ? 'text-second' : 'text-white'">
				<h2 class="w-full grow sm:w-8/12 text-xl">{{ initiative?.name }}</h2>
				<div class="w-full sm:w-4/12 text-sm">
					<a :href="`/companies/${initiative?.company.slug}`" :title="`${initiative?.company.ownership?.nameShort} «${initiative?.company.nameFull}»`">
						{{ initiative?.company.nameShort }}
					</a>
				</div>
				<div class="w-5">
					<IconInfo class="w-5 h-5" filled />
				</div>
			</div>
			<div v-if="isShow" class="text-dark-main text-lg my-3" v-html="initiative?.text"></div>
			<PhotosList v-if="isShow" :photos="initiative?.photos" :moderation="false" ref="photosList" />
		</div>
	</div>

</template>

<style scoped>

</style>