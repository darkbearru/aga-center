<script setup lang="ts">

import { useClientData } from '~/components/stores/useClientData';
import type { TCompany } from '~/src/data/types/company';
import type { TInitiative, TInitiativeList, TInitiativeListItem } from '~/src/data/types/initiatives';
import ContentAndHeader from '~/components/layout/ContentAndHeader.vue';
import CompanyListItem from '~/components/content/companies/CompanyListItem.vue';
import RatingStars from '~/components/ui/RatingStars.vue';
import InitiativeItem from '~/components/content/initiatives/InitiativeItem.vue';
import Popup from '~/components/ui/Popup.vue';
import PhotosList from '~/components/layout/admin/photos/PhotosList.vue';
import LoadingBg from '~/components/ui/LoadingBg.vue';
import PopupContainer from '~/components/ui/PopupContainer.vue';
import Button from '~/components/ui/Button.vue';
import IconStar from 'assets/svg/icon-star.svg';
import IconStarFilled from 'assets/svg/icon-star-filled.svg';

const route = useRoute();
if (!route.params.slug) navigateTo('/companies');

const clientData = useClientData();
const company = ref<TCompany>();
const initiatives = ref<TInitiativeList>();
const popup = ref();
const photos = ref();
const currentInitiative = reactive({
	title: '',
	text: '',
	company: '',
	company_info: '',
	company_slug: '',
	rating: 0,
	order: false,
});

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
	currentInitiative.title = initiative.name || '';
	currentInitiative.text = initiative.text || '';
	currentInitiative.company = company.value?.nameShort || '';
	currentInitiative.company_info = `${company.value?.ownership?.nameShort} «${company.value?.nameFull || ''}»`;
	currentInitiative.company_slug = company.value?.slug || '';
	currentInitiative.rating = initiative.rating || 0;
	photos?.value?.update(initiative.Photos);
	popup?.value?.show();
}

const popupClose = () => {
	popup?.value?.hide();
}

</script>

<template>
	<div>
		<div class="mx-auto w-full max-w-3xl">
			<h2 class="text-2xl mb-4">{{ (company as TCompany)?.nameShort }}</h2>
			<div class="flex mb-4 text-gray-500">
				<h3 class="text-xl grow">
					{{ (company as TCompany)?.ownership?.nameShort }} «{{ (company as TCompany)?.nameFull }}»
				</h3>
				<RatingStars :rating="(company as TCompany)?.rating" class-name="w-8 h-8" />
			</div>
			<div class="mb-8 text-dark-light" v-html="(company as TCompany)?.requsites"></div>

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

		<PopupContainer ref="popup" @close="popupClose">
			<Popup class="relative bg-gray-200/80 w-full max-h-full min-w-[300px] max-w-[600px] pb-0"
			       :title="currentInitiative.title" @close="popupClose">
				<div class="flex flex-wrap sm:flex-nowrap italic text-sm mb-4 gap-3">
					<h4 class="grow text-main">
						<a class="hover:underline decoration-main/80 underline-offset-4 decoration-2" :href="`/companies/${currentInitiative.company_slug}`">{{ currentInitiative.company }}</a>
						<span class="pl-2 text-xs text-gray-500">{{ currentInitiative.company_info }}</span>
					</h4>
					<div class="flex w-[6.25rem] text-main">
						<RatingStars :rating="(currentInitiative as TInitiativeListItem).rating || 0" />
					</div>
				</div>
				<div class="text-lg text-dark-main">
					<div v-html="currentInitiative.text"></div>
				</div>
				<PhotosList class="mt-4" :photos=[] ref="photos" :moderation=false />
			</Popup>
		</PopupContainer>
	</div>

</template>

<style scoped>

</style>