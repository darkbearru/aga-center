<script setup lang="ts">

import { useData } from '~/components/stores/useData';
import { useAuth } from '~/components/stores/useAuth';
import { TInitiativeTypes } from '~/src/data/types/initiatives.types';
import { TRegion } from '~/src/data/types/regions';
import { TFormkitOption, TCompany } from '~/src/data/types/company';
import { TInitiative, TInitiativeWithID } from '~/src/data/types/initiatives';
import PhotosList from '~/components/layout/admin/photos/PhotosList.vue';
import { TPhotos } from '~/src/data/types/photos';
import { setErrors } from '@formkit/core';

const userData = useData();
const auth = useAuth();
const props = defineProps({
	company: Object
})

defineExpose({ setup });
const emit = defineEmits(['save']);


const inputID = ref(0);
const inputName = ref('');
const inputText = ref('');
const inputPhoto = ref('');
const inputStatus = ref(false);
const inputPhotos = ref<TPhotos>([]);
const directionList = ref<TFormkitOption[]>([]);
const regionList = ref<TFormkitOption[]>([]);
const typesList = ref<TFormkitOption[]>([]);
const currentDirection = ref(0);
const currentRegion = ref(0);
const currentType = ref(0);
const photosList = ref();

type TFilesList = {
	name: string,
	file: File
}[];

type TDirection = {
	label: string,
	value: number
}

type TDirections = TDirection[];
const regions = userData.regions;
const types = userData.types;
const directions = [
	{
		label: 'Отдых',
		value: 0,
	},
	{
		label: 'Бизнес',
		value: 1,
	},
];

setup();

function setup(initiative?: TInitiative) {

	inputID.value = initiative?.id || 0;
	inputName.value = initiative?.name || '';
	inputText.value = initiative?.text || '';
	inputPhotos.value = initiative?.photos || [];
	inputStatus.value = initiative?.status || false;
	inputPhoto.value = '';

	if (regions) {
		regionList.value = [];
		regions.forEach((item: TRegion) => {
			const region: TFormkitOption = {
				label: item.name,
				value: item.id || 0
			};
			if (initiative && initiative?.region.id === item.id) {
				currentRegion.value = item.id || 0;
				region.attr = { default: true }
			}
			regionList.value.push(region);
		});
		if (!currentRegion.value) currentRegion.value = regions[0].id || 0;
	}

	if (types) {
		typesList.value = [];
		types.forEach((item: TInitiativeTypes) => {
			const type: TFormkitOption = {
				label: item.name,
				value: item.id || 0
			};
			if (initiative && initiative?.type.id === item.id) {
				currentType.value = item.id || 0;
				type.attr = { default: true }
			}
			typesList.value.push(type);
		});
		if (!currentType.value) currentType.value = types[0].id || 0;

	}

	directionList.value = [];
	directions.forEach((item: TDirection) => {
		const direction: TFormkitOption = {
			label: item.label,
			value: item.value
		}
		if (initiative && initiative?.direction === item.value) {
			direction.attr = { default: true }
			currentDirection.value = item.value || 0;
		}
		directionList.value.push(direction);
	});

	if(photosList.value) photosList.value.update(initiative?.photos || []);
}

const onSubmit = (data: Record<string, string | TFilesList>) => {
	const region = regionList.value.find(item => item.value.toString() === (currentRegion.value || data.region));
	const types = typesList.value.find(item => item.value.toString() === (currentType.value || data.type));
	const company = props.company as TCompany;

	let body: FormData | TInitiativeWithID;

	if (data.photos.length) {
		body = new FormData();
		for (const key in data) {
			if (key === 'photos') {
				if (data[key].length) {
					(data[key] as TFilesList)?.forEach((fileItem) => {
						(body as FormData).append('photos', fileItem.file);
					});
				}
			} else {
				switch (key) {
					case 'region' : {
						body.append(key, (currentRegion.value || region?.value || data[key]).toString());
						break;
					}
					case 'type' : {
						body.append(key, (types?.value || data[key]).toString());
						break;
					}
					default : {
						body.append(key, data[key] as string);
					}
				}
			}
		}
		body.append('company', (company?.id || 0).toString());
		body.append('id', inputID.value.toString());
		body.append('photosList', inputPhotos.value.length ? JSON.stringify(inputPhotos.value) : '');
	} else {
		body = {
			id: 	inputID.value.toString(),
			status: data.status.toString(),
			direction: data.direction.toString(),
			region:  (region?.value || data.region).toString(),
			type: (types?.value || data.type).toString(),
			company: (company?.id || 0).toString(),
			photos: unref(inputPhotos),
			name: data.name.toString(),
			text: data.text.toString(),
		}
	}

	userData.updateInitiative(body).then((result) => {
		if (result) {
			if (result?.errors)
				return setErrors('initiative_form', result.errors?.other ? [result.errors?.other]  : [], result.errors);
			emit('save');
		}
	}).catch(e => {
		console.log(e);
	});

}

</script>

<template>
	<div class="max-w-[600px] formkit-w-full" @click.stop="">
		<FormKit
			id="initiative_form"
			type="form"
			:submit-label="inputID ? 'Сохранить' : 'Добавить'"
			:config="{ validationVisibility: 'submit' }"
			@submit="onSubmit"
		>
			<FormKit type="checkbox" name="status" id="status" label="Отображение на сайте" v-model="inputStatus"/>
			<FormKit
				type="select"
				name="direction"
				id="direction"
				label="Направление"
				v-model="currentDirection"
				:options="directionList"
			/>
			<FormKit
				type="select"
				name="type"
				id="type"
				label="Тип инициативы"
				v-model="currentType"
				:options="typesList"
			/>
			<FormKit
				type="select"
				name="region"
				id="region"
				label="Регион"
				v-model="currentRegion"
				:options="regionList"
			/>
			<FormKit
				type="text"
				name="name"
				id="name"
				label="Наименование"
				placeholder="Наименование инициативы"
				v-model="inputName"
				validation="required|length:3|contains_alpha_spaces"
				:validation-messages="{
          initiative_exists: 'Указанная компания уже существует',
          length: 'Длина наименование должна быть не менее 3 символов',
          required: 'Необходимо указать юридическое наименование компании',
          name: 'Наименование должно состоять из букв и пробелов'
        }"
			/>
			<FormKit
				type="textarea"
				name="text"
				id="text"
				label="Текст"
				placeholder="Введите текст инициативы"
				v-model="inputText"
			/>
			<FormKit
				type="file"
				name="photos"
				label="Фотографии"
				accept=".jpg,.gif,.png,.jpeg,.webp,.svg"
				multiple="true"
				v-model="inputPhoto"
			/>
			<PhotosList :photos="inputPhotos" ref="photosList"/>
		</FormKit>
	</div>

</template>


<style scoped>

</style>