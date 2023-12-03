<script setup lang="ts">

import { useData } from '~/components/stores/useData';
import { ContactsTypeNames } from '~/src/data/types/company';
import type { TCompany, TContact, TContactsType } from '~/src/data/types/company';
import ListItem from '~/components/content/admin/moderation/ListItem.vue';
import ModerationPopup from '~/components/content/admin/moderation/ModerationPopup.vue';
import type { TInitiative } from '~/src/data/types/initiatives';

const props = defineProps({ mode: String })
const userData = useData();
const companies = ref<TCompany[]>(userData.companies || []);
const initiatives = ref<TInitiative[]>(userData.initiatives || []);
const popupText = ref('');
const popupReason = ref('');
const popupContacts = ref('');
const popup = ref();
const contacts = Object(ContactsTypeNames);
let currentID: number;

const selectCompany = (id: number) => {
	if (!popup.value || (typeof companies.value === 'undefined')) return;
	currentID = id;
	const company = companies.value.find(item => item.id === id);
	if (company) {
		popupReason.value = company.declineReason ? company.declineReason : '';
		let contactsStr: string = '';
		if (company.contacts) {
			company.contacts.forEach((item: TContact) => {
				contactsStr += `${contacts[item.type as TContactsType]}: ${item.value}\n`;
			});
		}
		popupText.value = `${company.requsites}`;
		popupContacts.value = contactsStr;
		popup.value.popupOpen(`${company.nameShort} (${company.ownership?.nameShort} «${company.nameFull}»)`);
	}
}

const approveCompany = async () => {
	if (!currentID) return;
	if (await userData.approveCompany(currentID)) {
		currentID = 0;
		companies.value = userData.companies as TCompany[];
	}
}

const declineCompany = async () => {
	if (!currentID) return;
	const reason: string = popup?.value.getReason() || '';
	if (await userData.declineCompany(currentID, reason)) {
		currentID = 0;
		companies.value = userData.companies as TCompany[];
	}
}

userData.refreshModeration(() => {
	companies.value = userData.companies as TCompany[];
	initiatives.value = userData.initiatives as TInitiative[];
});

</script>

<template>
	<div class="border-b-[3px] mb-4">
		<div class="flex w-full border-b border-b-main">
			<NuxtLink
				class="py-3 px-6 rounded-tl rounded-tr bg-main text-white">
					Компании <span class="inline-block bg-second text-white text-xs rounded-lg px-2">{{ companies.length }}</span>
			</NuxtLink>
			<NuxtLink
				href="/client/moderation/initiatives"
				class="py-3 px-6 rounded-tl rounded-tr text-main hover:bg-main/10">
				Инициативы  <span class="inline-block bg-second text-white text-xs rounded-lg px-2">{{ initiatives.length }}</span>
			</NuxtLink>
		</div>
	</div>


	<div v-if="companies.length" class="my-4">
		<ListItem v-for="item in companies" :key="item.id"
		          :id="item.id" :title="`${item.nameShort}`"
		          :text="`${item.ownership?.nameShort} «${item.nameFull}»`" @click="selectCompany"
		/>
	</div>
	<div v-else>
		<h3 class="text-2xl">Нет, инициатив в очереди для модерации</h3>
	</div>

	<ModerationPopup ref="popup" @approve="approveCompany" @decline="declineCompany">
		<div class="mb-4">
			<div class="text-lg text-gray-700 mb-2" v-html="popupText.split('\n').join('<br />')"></div>
			<div class="italic text-gray-500 mb-2" v-html="popupContacts.split('\n').join('<br />')"></div>
			<div v-if="popupReason" class="bg-red-600 text-white text-sm px-4 py-2 rounded line-">
				<b>Причина прошлого отклонения:</b><br />
				{{ popupReason }}
			</div>
		</div>
	</ModerationPopup>

</template>

<style scoped>

</style>