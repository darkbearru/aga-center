<script setup lang="ts">

import { useData } from '~/components/stores/useData';
import type { TCompany } from '~/src/data/types/company';
import ListItem from '~/components/layout/admin/moderation/ListItem.vue';
import ModerationPopup from '~/components/layout/admin/moderation/ModerationPopup.vue';
import type { TInitiative } from '~/src/data/types/initiatives';
import PhotosList from '~/components/layout/admin/photos/PhotosList.vue';

const userData = useData();
const companies = ref<TCompany[]>(userData.companies || []);
const initiatives = ref<TInitiative[]>(userData.initiatives || []);
const popupText = ref('');
const popupReason = ref('');
const popup = ref();
const photos = ref();
let currentID: number;

const selectInitiative = (id: number) => {
	if (!popup.value || (typeof initiatives.value === 'undefined')) return;
	currentID = id;
	const initiative = initiatives.value.find(item => item.id === id);
	if (initiative) {
		popupReason.value = initiative.declineReason ? initiative.declineReason : '';
		popupText.value = `${initiative.text}`;
		popup.value.popupOpen(`${initiative.name}`);
		if (photos.value) photos.value.update(initiative?.photos || []);
	}
}

const approveInitiative = async () => {
	if (!currentID) return;
	if (await userData.approveInitiative(currentID)) {
		currentID = 0;
		initiatives.value = userData.initiatives as TInitiative[];
	}
}

const declineInitiative = async () => {
	if (!currentID) return;
	const reason: string = popup?.value.getReason() || '';
	if (await userData.declineInitiative(currentID, reason)) {
		currentID = 0;
		initiatives.value = userData.initiatives as TInitiative[];
	}
}

</script>

<template>
	<div class="border-b-[3px] mb-4">
		<div class="flex w-full border-b border-b-main">
			<NuxtLink
				href="/client/moderation"
				class="py-3 px-6 rounded-tl rounded-tr text-main hover:bg-main/10">
					Компании <span class="inline-block bg-second text-white text-xs rounded-lg px-2">{{ companies.length }}</span>
			</NuxtLink>
			<NuxtLink
				class="py-3 px-6 rounded-tl rounded-tr bg-main text-white">
				Инициативы  <span class="inline-block bg-second text-white text-xs rounded-lg px-2">{{ initiatives.length }}</span>
			</NuxtLink>
		</div>
	</div>


	<div v-if="initiatives.length" class="my-4">
		<ListItem v-for="item in initiatives" :key="item.id"
		          :id="item.id" :title="`${item.name}`"
		          :text="`${item.text.substring(0, 50)}...`" @click="selectInitiative"
		/>
	</div>
	<div v-else>
		<h3 class="text-2xl">Нет, инициатив в очереди для модерации</h3>
	</div>

	<ModerationPopup ref="popup" @approve="approveInitiative" @decline="declineInitiative">
		<div class="mb-4">
			<div class="text-lg text-gray-700 mb-2" v-html="popupText.split('\n').join('<br />')"></div>
			<div class="text-gray-500 mb-2">
				<PhotosList :photos=[] ref="photos" :moderation=false />
			</div>
			<div v-if="popupReason" class="bg-red-600 text-white text-sm px-4 rounded">{{ popupReason }}</div>
		</div>
	</ModerationPopup>

</template>

<style scoped>

</style>