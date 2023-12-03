<script setup lang="ts">

import type { TInitiative } from '~/src/data/types/initiatives';
import type { TOwnership } from '~/src/data/types/ownership';
import type { TInitiativeTypes } from '~/src/data/types/initiatives.types';
import type { TFormkitOption } from '~/src/data/types/company';
import type { TRegion } from '~/src/data/types/regions';
import { useData } from '~/components/stores/useData';
import { slugify } from '~/src/utils/slugify';

definePageMeta({
	middleware: ["moderator"],
	layout: "client",
});
useHead({ title: 'АГА. Управление инициативами' });

const userData = useData();
const initiative = ref<TInitiative | undefined>(userData.current);
const formStatus = reactive({
	isChanged: false,
	isSlugChanged: false
});
const directions = [
	{ label: 'Отдых', value: 0 },
	{ label: 'Бизнес', value: 1 },
];
const isReady = ref<boolean>(false);
const ownerships: TFormkitOption[] = [];
const typesList: TFormkitOption[] = [];
const regionsList: TFormkitOption[] = [];

const manageData = reactive({
	email: '',
	nameFull: '',
	nameShort: '',
	slug: '',
	ownershipId: 0,
	regionId: 0,
	initiativeTypesId: 0,
	direction: 0,
	name: initiative?.value?.name || '',
	text: initiative?.value?.text || '',
});

onMounted(() => {
	if (!userData.isLoaded) {
		userData.get().then(() => initForm())
	} else {
		initForm();
	}
});

function initForm(): void {
	initOwnerships();
	initTypesForm();
	initRegionsForm();
	isReady.value = true;
}

function initOwnerships(): void {
	const list = userData.ownership;
	if (!list) return;
	list.forEach((item: TOwnership) => {
		const owner: TFormkitOption = {
			label: `${item.nameShort} (${item.nameFull})`,
			value: item.id || 0,
		};
		if (initiative.value && initiative.value?.company?.ownership?.id === item.id) {
			manageData.ownershipId = item.id || 0;
			owner.attr = { default: true }
		}
		ownerships.push(owner);
	});
}

function initTypesForm(): void {
	const types = userData.types;
	if (!types) return;

	types.forEach((item: TInitiativeTypes) => {
		const type: TFormkitOption = {
			label: item.name,
			value: item.id || 0
		};
		if (initiative.value && initiative.value?.type.id === item.id) {
			manageData.initiativeTypesId = item.id || 0;
			type.attr = { default: true }
		}
		typesList.push(type);
	});
	if (!manageData.initiativeTypesId) manageData.initiativeTypesId = types[0].id || 0;
}

function initRegionsForm(): void {
	const regions = userData.regions;
	if (!regions) return;
	regions.forEach((item: TRegion) => {
		const region: TFormkitOption = {
			label: item.name,
			value: item.id || 0
		};
		if (initiative.value && initiative.value?.region.id === item.id) {
			manageData.regionId = item.id || 0;
			region.attr = { default: true }
		}
		regionsList.push(region);
	});
	if (!manageData.regionId) manageData.regionId = regions[0].id || 0;
}

const cloneName = () => {
	if (formStatus.isChanged) return;
	manageData.nameShort = manageData.nameFull.trim();
	createSlug();
}

const shortNameModify = () => {
	formStatus.isChanged = manageData.nameFull.trim() !== manageData.nameShort.trim();
	createSlug();
}

const createSlug = () => {
	if (formStatus.isSlugChanged) return;
	manageData.slug = slugify(manageData.nameShort as string, 50);
}

const slugChange = () => {
	formStatus.isSlugChanged = manageData.slug.length !== 0;
}

const onSubmit = () => {
	console.log(manageData);
	userData.saveInitiative(manageData).then((data) => {
		console.log(`Saved ${data}`);
		const router = useRouter();
		router.push('/client/companies');
	})
}

</script>

<template>
	<div class="max-w-[600px] formkit-w-full">
		<FormKit
			v-if="isReady"
			id="initiatives_form"
			type="form"
			:submit-label="initiative ? 'Сохранить' : 'Добавить'"
			:config="{ validationVisibility: 'submit' }"
			@submit="onSubmit"
		>
			<FormKit
				type="select"
				label="Форма собственности"
				name="ownership"
				:options="ownerships"
				v-model="manageData.ownershipId"
			/>
			<FormKit
				type="text"
				name="nameFull"
				id="name_full"
				label="Полное название"
				placeholder="Юридическое название компании"
				v-model="manageData.nameFull"
				@keyup="cloneName"
				validation="required|length:3|contains_alpha_spaces"
				:validation-messages="{
		          company_exists: 'Указанная компания уже существует',
		          length: 'Длина наименование должна быть не менее 3 символов',
		          required: 'Необходимо указать юридическое наименование компании',
		          name: 'Наименование должно состоять из букв и пробелов'
		        }"
			/>
			<FormKit
				type="text"
				name="nameShort"
				id="name_short"
				label="«Публичное» название"
				placeholder="«Публичное» название компании"
				v-model="manageData.nameShort"
				@change="createSlug"
				@keyup="shortNameModify"
				validation="required|length:3|contains_alpha_spaces"
				:validation-messages="{
		          company_exists: 'Указанная компания уже существует',
		          length: 'Длина наименование должна быть не менее 3 символов',
		          required: 'Необходимо указать «публичное» наименование компании',
		          name: 'Наименование должно состоять из букв и пробелов'
		        }"
			/>
			<FormKit
				type="text"
				name="slug"
				id="slug"
				label="Идентификатор"
				placeholder="name_url_slug"
				@keyup="slugChange"
				v-model="manageData.slug"
				validation="required|length:3|matches:/[0-9a-z_]/"
				:validation-messages="{
						  slug_exists: 'Указанный идентификатор уже занят',
	            length: 'Длина Идентификатора должна быть не менее 5 символов',
	            required: 'Необходимо указать Идентификатор',
	            matches: 'В написании Идентификатора допустимо использование символов английского алфавита и нижнего подчеркивания'
	          }"
			/>
			<FormKit
				type="email"
				name="email"
				id="email"
				label="E-mail"
				placeholder="your@email.com"
				v-model="manageData.email"
				validation="required|length:5|email"
				validation-visibility="live"
				:validation-messages="{
	              email_exists: 'Указанный email уже занят, попробуйте указать другой',
	              length: 'Длина Email должна быть не менее 5 символов',
	              required: 'Необходимо указать Email',
	              email: 'Email должен соответствовать формату «aaa@domain.name»'
	            }"
			/>

			<FormKit
				type="select"
				name="region"
				id="region"
				label="Регион"
				v-model="manageData.regionId"
				:options="regionsList"
			/>
			<FormKit
				type="select"
				name="direction"
				id="direction"
				label="Направление"
				v-model="manageData.direction"
				:options="directions"
			/>
			<FormKit
				type="select"
				name="type"
				id="type"
				label="Тип инициативы"
				v-model="manageData.initiativeTypesId"
				:options="typesList"
			/>
			<FormKit
				type="text"
				name="name"
				id="name"
				label="Наименование"
				placeholder="Наименование инициативы"
				v-model="manageData.name"
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
				rows="12"
				placeholder="Введите текст инициативы"
				v-model="manageData.text"
			/>
		</FormKit>
	</div>
</template>

<style scoped>

</style>