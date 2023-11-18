<script setup lang="ts">

import { useClientData } from '~/components/stores/useClientData';
import type { TCompany } from '~/src/data/types/company';
import type { TInitiativeList } from '~/src/data/types/initiatives';
import ContentAndHeader from '~/components/layout/ContentAndHeader.vue';
import RatingStars from '~/components/ui/RatingStars.vue';
import InitiativeItem from '~/components/content/initiatives/InitiativeItem.vue';
import InitiativePopupForm from '~/components/content/initiatives/InitiativePopupForm.vue';

const route = useRoute();
if (!route.params.slug) navigateTo('/companies');

const clientData = useClientData();
const company = ref<TCompany>();
const initiatives = ref<TInitiativeList>();
const initiativeForm = ref();

clientData.companyFullInfo(route.params.slug.toString()).then( data => {
	data.company.requsites = (data.company.requsites || '').split('\n').join('<br />');
	if (data.initiatives) {
		data.initiatives.map(item => {
			item.text = (item.text || '').split('\n').join('<br />');
		});
	}
	company.value = data.company;
	initiatives.value = data.initiatives;
});

const onClick = (id: number): void => {
	const initiative = initiatives?.value?.find(item => item.id === id);
	if (!initiative) return;
	initiativeForm.value?.popupOpen(initiative);
}

</script>

<template>
	<div>
		<div class="mx-auto w-full max-w-3xl">

			<h2 class="text-2xl mb-4" v-if="company">{{ (company as TCompany)?.nameShort }}</h2>

      <div class="flex mb-4 text-gray-500" v-if="company">
				<h3 class="text-xl grow">
					{{ (company as TCompany)?.ownership?.nameShort }} «{{ (company as TCompany)?.nameFull }}»
				</h3>
				<RatingStars :rating="(company as TCompany)?.rating" class-name="w-8 h-8" />
			</div>
			<div class="mb-8 text-dark-light" v-if="company" v-html="(company as TCompany)?.requsites"></div>

			<ContentAndHeader title="Список инициатив" v-if="(initiatives as TInitiativeList)?.length">
				<div class="w-full divide-y divide-gray-200">
					<InitiativeItem v-for="item in initiatives" :key="item.id" @click="onClick(item.id)">
						<div class="grow">
							{{ item.name }}
						</div>
						<div class="flex gap-0 w-20 text-gray-400">
							<RatingStars :rating="item?.rating || 0" class-name="w-4 h-4" />
						</div>
						<div>
							{{ item?.Company?.nameShort }}
						</div>
					</InitiativeItem>
				</div>
			</ContentAndHeader>

		</div>

		<InitiativePopupForm ref="initiativeForm"/>
	</div>

</template>

<style scoped>

</style>