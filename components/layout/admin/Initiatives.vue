<script setup lang="ts">
import { useData } from '~/components/stores/useData';
import { TInitiative } from '~/src/data/types/initiatives';
import InitiativeList from '~/components/layout/admin/initiatives/InitiativeList.vue';
import InitiativeForm from '~/components/layout/admin/initiatives/InitiativeForm.vue';
import PopupContainer from '~/components/ui/PopupContainer.vue';
import Popup from '~/components/ui/Popup.vue';
import Button from '~/components/ui/Button.vue';
import IconPlus from 'assets/svg/icon-plus.svg';

const userData = useData();

const initiatives = ref<TInitiative[]>(userData.initiatives as TInitiative[]);
const titlePopup = ref('Добавить инициативу')
const popup = ref();
const initiativeForm = ref();
const initiativeList = ref();

const popupEdit = (id: number): void => {
	if (!userData?.initiatives) return;
	const item: TInitiative | undefined = userData?.initiatives.find(item => item.id === id);
	if (!item) return;
	popupOpen(item);
}

const popupOpen = (item?: TInitiative): void => {
	titlePopup.value = 'Добавить инициативу';
	if (item?.id) {
		titlePopup.value = 'Изменение инициативу';
	}
	initiativeForm.value.setup(item);
	popup.value.show();
}

const popupClose = (): void => {
	popup.value.hide();
	titlePopup.value = '';
	if (userData?.initiatives) initiativeList.value.return();
}


</script>

<template>

	<h2 class="mt-8 mb-4">Инициативы</h2>

	<InitiativeForm v-if="!initiatives.length" />

	<div v-else>
		<Button class="inline-flex items-center bg-second text-white hover:bg-main-light py-2 px-6" title="Добавить инициативу" @click="popupOpen">
			<IconPlus filled class="w-6 h-6" /> Добавить инициативу
		</Button>

		<InitiativeList ref="initiativeList" />

		<PopupContainer ref="popup">
			<Popup class="bg-gray-light/60 w-full min-w-[300px] max-w-[500px] pb-0" :title="titlePopup" @close="popupClose">
<!--				<InitiativeForm ref="initiativeForm" @save="popupClose"/>-->
			</Popup>
		</PopupContainer>

	</div>
</template>

<style scoped>

</style>