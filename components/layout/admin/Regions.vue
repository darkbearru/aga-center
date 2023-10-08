<script setup lang="ts">
import RegionsList from '~/components/layout/admin/regions/RegionsList.vue';
import Button from '~/components/ui/Button.vue';
import IconUserPlus from 'assets/svg/icon-user-plus.svg';
import Popup from '~/components/ui/Popup.vue';
import PopupContainer from '~/components/ui/PopupContainer.vue';
import { useData } from '~/components/stores/useData';
import { setErrors } from '@formkit/core';
import { TRegion } from '~/src/data/types/regions';
import { slugify } from '~/src/utils/slugify';

const titlePopup = ref('Добавить регион')
const popup = ref();
const inputName = ref<String>('');
const inputSlug = ref<String>('');
const inputIsActive = ref<Boolean>(false);
const inputId = ref<Number | undefined>(undefined);
const userData = useData();
const regionsList = ref();

const popupOpen = (item?: TRegion): void => {
	titlePopup.value = 'Добавить регион';
	if (item?.id) {
		titlePopup.value = 'Изменение данных региона';
		inputName.value = item?.name || '';
		inputSlug.value = item?.slug || '';
		inputIsActive.value = item?.isActive || false;
		inputId.value = item?.id || undefined;
	}
	popup.value.show();
}

const popupClose = (): void => {
	popup.value.hide();
	inputName.value = '';
	inputSlug.value = '';
	inputIsActive.value = false;
	inputId.value = undefined;
}

const popupSubmit = async (): Promise<void> => {
	userData.updateRegion({
		id: inputId.value as number || undefined,
		name: inputName.value as string,
		slug: inputSlug.value as string,
		isActive: inputIsActive.value as boolean,
	}).then((result) => {
		if (result) {
			if (result?.errors) return setErrors('regions_form', [], result.errors);
			regionsList.value.update();
			popupClose();
		}
	}).catch((error) => {
		console.log(error);
	});
}

const deleteRegion = async (region: TRegion): Promise<void> => {
	await userData.deleteRegion(region).then(() => regionsList.value.update());
}

const createSlug = () => {
	inputSlug.value = slugify(inputName.value as string);
}

</script>

<template>
	<div class="w-7/12 min-w-[520px]">
		<div class="w-full text-center">
			<Button class="inline-flex items-center bg-main text-white hover:bg-main-light py-3 px-6 w-auto mx-auto mb-8"
			        title="Добавить регион" @click="popupOpen">
				<IconUserPlus class="block text-white w-6 h-6 mr-2" filled/>
				<span class="hidden md:inline">Добавление региона</span>
			</Button>
		</div>

		<RegionsList @click="popupOpen" @delete="deleteRegion" ref="regionsList" />

		<PopupContainer ref="popup">
			<Popup class="bg-gray-light/60 w-full min-w-[300px] max-w-[500px] pb-0" :title="titlePopup" @close="popupClose">
				<FormKit
					id="regions_form"
					type="form"
					:submit-label="inputId ? 'Сохранить' : 'Добавить'"
					@submit="popupSubmit"
				>
					<FormKit
						type="text"
						name="name"
						id="name"
						label="Название"
						placeholder="Наименование региона"
						v-model="inputName"
						@keyup="createSlug"
						validation="required|length:3|contains_alpha_spaces"
						validation-visibility="live"
						:validation-messages="{
              region_exists: 'Указанный регион уже существует',
              length: 'Длина наименование должна быть не менее 3 символов',
              required: 'Необходимо указать наименование региона',
              name: 'Наименование должно состоять из букв и пробелов'
            }"
					/>
					<FormKit
						type="text"
						name="slug"
						id="slug"
						label="Идентификатор"
						placeholder="name_url_link"
						v-model="inputSlug"
						validation="required|length:3|matches:/[0-9a-z_]/"
						validation-visibility="live"
						:validation-messages="{
              length: 'Длина Идентификатора должна быть не менее 3 символов',
              required: 'Необходимо указать Идентификатор',
              matches: 'В написании Идентификатора допустимо использование символов английского алфавита и нижнего подчеркивания'
            }"
					/>
					<FormKit type="checkbox" name="isActive" id="isActive" label="Отображение региона на сайте" v-model="inputIsActive"/>
				</FormKit>
			</Popup>
		</PopupContainer>
	</div>

</template>

<style scoped>
</style>