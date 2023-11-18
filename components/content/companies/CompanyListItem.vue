<script setup lang="ts">

import type { TCompany } from '~/src/data/types/company';
import RatingStars from '~/components/ui/RatingStars.vue';

defineExpose({ update });
const props = defineProps({ company: Object });
const company = ref<TCompany>(props.company as TCompany);

function update(item: TCompany): void {
	company.value = item;
}

</script>

<template>
	<div class="flex flex-wrap sm:flex-nowrap items-center py-3 px-4">
		<div class="w-full sm:w-5/12 text-base text-main">
			<a :href="`/companies/${company.slug}`" class="hover:underline decoration-main/80 underline-offset-4 decoration-2">{{ company.nameShort }}</a>
		</div>
		<div class="w-8/12 sm:w-5/12 text-sm text-gray-500">{{ company.ownership?.nameShort }} «{{ company.nameFull }}»</div>
		<div class="w-4/12 sm:w-2/12 min-w-20 text-gray-500">
			<RatingStars :rating="company.rating"/>
		</div>
	</div>
</template>

<style scoped>

</style>