<script setup lang="ts">
import { useData } from '~/components/stores/useData';
import type { TInitiative } from '~/src/data/types/initiatives';
import InitiativeList from '~/components/layout/admin/initiatives/InitiativeList.vue';
import InitiativeForm from '~/components/layout/admin/initiatives/InitiativeForm.vue';
import PopupContainer from '~/components/ui/PopupContainer.vue';
import Popup from '~/components/ui/Popup.vue';
import Button from '~/components/ui/Button.vue';
import IconPlus from 'assets/svg/icon-plus.svg';
import type { TCompany } from '~/src/data/types/company';

const userData = useData();

defineExpose({ setupCompany, updateInitiatives });

;const initiatives = ref<TInitiative[]>(userData.initiatives as TInitiative[]);
const titlePopup = ref('Добавить инициативу')
const popup = ref();
const initiativeForm = ref();
const initiativeList = ref();
const props = defineProps({
	company: Object
})

let company: TCompany = props.company as TCompany;

function setupCompany(item: TCompany): void {
	company = item;
}

function updateInitiatives(): void {
	initiatives.value = userData.initiatives as TInitiative[];
}

const popupEdit = (id: number): void => {
	if (!userData?.initiatives) return;
	const item: TInitiative | undefined = userData?.initiatives.find(item => item.id === id);
	if (!item) return;
	popupOpen(item);
}

const popupOpen = (item?: TInitiative): void => {
	titlePopup.value = 'Добавить инициативу';
	popup.value.show();
	if (!(item instanceof Event)) {
		if (item?.id) {
			titlePopup.value = 'Изменить инициативу';
		}
		initiativeForm.value.setup(company, item);
	} else {
		initiativeForm.value.setup(company);
	}
}

const popupClose = (): void => {
	if (popup.value) popup.value.hide();
	titlePopup.value = '';
	initiatives.value = userData?.initiatives || [];
	// if (userData?.initiatives) initiativeList.value.refresh();
}

watch(initiatives, (newList) => {
	if(newList.length > 0) {
		if (initiativeList.value) initiativeList.value.refresh();
	}
})

const onDelete = (initiative: TInitiative, index: number) => {
	userData.deleteInitiative(initiative).then(() => {
		initiatives.value = userData?.initiatives || [];
	}).catch(e => {
		console.log(e);
	});
}


</script>

<template>

	<h2 class="mt-8 mb-4 text-xl ml-3">Инициативы</h2>

	<InitiativeForm v-if="!initiatives.length" :company="company" ref="initiativeForm" @save="popupClose" />

	<div v-else>
		<Button class="inline-flex items-center bg-second text-white hover:bg-main-light py-2 px-2" title="Добавить инициативу" @click="popupOpen">
			<IconPlus filled class="w-5 h-5 mr-1" />Добавить инициативу
		</Button>

		<InitiativeList ref="initiativeList" @onClick="popupOpen" @onDelete="onDelete" />

		<PopupContainer ref="popup" @close="popupClose">
			<Popup class="bg-gray-light/60 w-full max-h-full min-w-[300px] max-w-[600px] pb-0" :title="titlePopup" @close="popupClose">
				<InitiativeForm :company="company" ref="initiativeForm" @save="popupClose"/>
			</Popup>
		</PopupContainer>

	</div>
</template>

<style scoped>

</style>