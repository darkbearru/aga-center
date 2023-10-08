<script setup lang="ts">
import OwnershipList from '~/components/layout/admin/ownership/OwnershipList.vue';
import Button from '~/components/ui/Button.vue';
import IconUserPlus from 'assets/svg/icon-user-plus.svg';
import Popup from '~/components/ui/Popup.vue';
import PopupContainer from '~/components/ui/PopupContainer.vue';
import { useData } from '~/components/stores/useData';
import { setErrors } from '@formkit/core';
import { TOwnership } from '~/src/data/types/ownership';

const titlePopup = ref('Добавить форму собственности')
const popup = ref();
const inputNameShort = ref<String>('');
const inputNameFull = ref<String>('');
const inputId = ref<Number | undefined>(undefined);
const userData = useData();
const ownershipList = ref();

const popupOpen = (item?: TOwnership): void => {
	titlePopup.value = 'Добавить форму собственности';
	if (item?.id) {
		titlePopup.value = 'Изменение данных формы собственности';
		inputNameShort.value = item?.nameShort || '';
		inputNameFull.value = item?.nameFull || '';
		inputId.value = item?.id || undefined;
	}
	popup.value.show();
}

const popupClose = (): void => {
	popup.value.hide();
	inputNameShort.value = '';
	inputNameFull.value = '';
	inputId.value = undefined;
}

const popupSubmit = async (): Promise<void> => {
	userData.updateOwnership({
		id: inputId.value as number || undefined,
		nameShort: inputNameShort.value as string,
		nameFull: inputNameFull.value as string,
	}).then((result) => {
		if (result) {
			if (result?.errors) return setErrors('ownership_form', [], result.errors);
			ownershipList.value.update();
			popupClose();
		}
	}).catch((error) => {
		console.log(error);
	});
}

const deleteOwnership = async (ownership: TOwnership): Promise<void> => {
	await userData.deleteOwnership(ownership).then(() => ownershipList.value.update());
}

</script>

<template>
	<div class="w-7/12 min-w-[520px]">
		<div class="w-full text-center">
			<Button class="inline-flex items-center bg-main text-white hover:bg-main-light py-3 px-6 w-auto mx-auto mb-8"
			        title="Добавить регион" @click="popupOpen">
				<IconUserPlus class="block text-white w-6 h-6 mr-2" filled/>
				<span class="hidden md:inline">Добавление формы собственности</span>
			</Button>
		</div>

		<OwnershipList @click="popupOpen" @delete="deleteOwnership" ref="ownershipList" />

		<PopupContainer ref="popup">
			<Popup class="bg-gray-light/60 w-full min-w-[300px] max-w-[500px] pb-0" :title="titlePopup" @close="popupClose">
				<FormKit
				id="ownership_form"
				type="form"
				:submit-label="inputId ? 'Сохранить' : 'Добавить'"
				@submit="popupSubmit"
				>
					<FormKit
					type="text"
					name="name_short"
					id="name_short"
					label="Сокрашение"
					placeholder="Сокращённое наименование"
					v-model="inputNameShort"
					validation="required|length:2|contains_alpha|contains_uppercase"
					validation-visibility="live"
					:validation-messages="{
              length: 'Длина наименование должна быть не менее 3 символов',
              required: 'Необходимо указать сокращённое название формы собственности',
              contains_alpha: 'Наименование должно состоять из букв',
              contains_uppercase: 'Наименование должно быть написано большими буквами'
            }"
					/>
					<FormKit
					type="text"
					name="name_full"
					id="name_full"
					label="Наименование"
					placeholder="Полное наименование"
					v-model="inputNameFull"
					validation="required|length:5|contains_alpha_spaces"
					validation-visibility="live"
					:validation-messages="{
              length: 'Длина Наименования должна быть не менее 5 символов',
              required: 'Необходимо указать Наименование',
              contains_alpha_spaces: 'В написании наименования допустимо использование букв и пробелов'
            }"
					/>
				</FormKit>
			</Popup>
		</PopupContainer>
	</div>

</template>

<style scoped>
</style>