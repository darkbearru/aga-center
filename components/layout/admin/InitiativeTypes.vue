<script setup lang="ts">
import Button from '~/components/ui/Button.vue';
import IconUserPlus from 'assets/svg/icon-user-plus.svg';
import Popup from '~/components/ui/Popup.vue';
import PopupContainer from '~/components/ui/PopupContainer.vue';
import { useData } from '~/components/stores/useData';
import { setErrors } from '@formkit/core';
import { TInitiativeTypes } from '~/src/data/types/initiatives.types';
import InitiativeTypesList from '~/components/layout/admin/initiatives/InitiativeTypesList.vue';

const titlePopup = ref('Добавление типа инициативы')
const popup = ref();
const inputName = ref<String>('');
const inputId = ref<Number | undefined>(undefined);
const userData = useData();
const typesList = ref();

const popupOpen = (item?: TInitiativeTypes): void => {
	titlePopup.value = 'Добавление типа инициативы';
	if (item?.id) {
		titlePopup.value = 'Изменение наименования типа';
		inputName.value = item?.name|| '';
		inputId.value = item?.id || undefined;
	}
	popup.value.show();
}

const popupClose = (): void => {
	popup.value.hide();
	inputName.value = '';
	inputId.value = undefined;
}

const popupSubmit = async (): Promise<void> => {
	userData.updateInitiativeTypes({
		id: inputId.value as number || undefined,
		name: inputName.value as string,
	}).then((result) => {
		if (result) {
			if (result?.errors) return setErrors('types_form', [], result.errors);
			typesList.value.update();
			popupClose();
		}
	}).catch((error) => {
		console.log(error);
	});
}

const deleteTypes = async (type: TInitiativeTypes): Promise<void> => {
	await userData.deleteInitiativeTypes(type).then(() => typesList.value.update());
}

</script>

<template>
	<div class="w-7/12 min-w-[520px]">
		<div class="w-full text-center">
			<Button class="inline-flex items-center bg-main text-white hover:bg-main-light py-3 px-6 w-auto mx-auto mb-8"
			        title="Добавить тип инициативы" @click="popupOpen">
				<IconUserPlus class="block text-white w-6 h-6 mr-2" filled/>
				<span class="hidden md:inline">Добавление типа инициативы</span>
			</Button>
		</div>

		<InitiativeTypesList @click="popupOpen" @delete="deleteTypes" ref="typesList" />

		<PopupContainer ref="popup">
			<Popup class="bg-gray-light/60 w-full min-w-[300px] max-w-[500px] pb-0" :title="titlePopup" @close="popupClose">
				<FormKit
				id="ownership_form"
				type="form"
				:submit-label="inputId ? 'Сохранить' : 'Добавить'"
				:config="{ validationVisibility: 'submit' }"
				@submit="popupSubmit"
				>
					<FormKit
					type="text"
					name="name_short"
					id="name_short"
					label="Наименование"
					placeholder="Наименование типа"
					v-model="inputName"
					validation="required|length:5|ccontains_alpha_spaces"
					validation-visibility="live"
					:validation-messages="{
              length: 'Длина наименование должна быть не менее 5 символов',
              required: 'Необходимо указать наименование',
              contains_alpha_spaces: 'Наименование должно состоять из букв и пробелов'
            }"
					/>
				</FormKit>
			</Popup>
		</PopupContainer>
	</div>

</template>

<style scoped>
</style>