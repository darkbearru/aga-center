<script setup lang="ts">

import type { TCompany, TContacts } from '~/src/data/types/company';
import { useData } from '~/components/stores/useData';
import type { TOwnership } from '~/src/data/types/ownership';
import ContactsList from '~/components/layout/admin/companies/ContactsList.vue';
import { useAuth } from '~/components/stores/useAuth';
import { setErrors } from '@formkit/core';
import Button from '~/components/ui/Button.vue';
import IconTrash from 'assets/svg/icon-trash.svg';
import { slugify } from '~/src/utils/slugify';

const props = defineProps({
	data: {
		type: Object,
		default: undefined
	}
});
const emit = defineEmits(['save', 'delete']);
defineExpose({setup});

let company: TCompany = props.data as TCompany;
const userData = useData();
const auth = useAuth();

const companyContacts = ref<TContacts>();
const ownerships = ref<String[]>([]);
if (userData.ownership) {
	userData.ownership.forEach((item: TOwnership) => {
		ownerships.value.push(`${item.nameShort} (${item.nameFull})`);
	});
}

const refCompany = ref<TCompany | undefined>(company);
const inputID = ref<Number>(company?.id || 0);
const inputNameShort = ref<String>(company?.nameShort || '');
const inputNameFull = ref<String>(company?.nameFull || '');
const inputRequisites = ref<String>(company?.requsites || '');
const inputSlug = ref<String>(company?.slug || '');
const inputOwnership = ref<String>(company?.ownership ? `${company.ownership.nameShort} (${company.ownership.nameFull})` : '');
const contacts = ref();

let isShortName: boolean = false;
let isSlugChanged: boolean = false;


function setup(item?: TCompany): void {
	if (item) {
		company = item;
		refCompany.value = item;
	}
	inputNameShort.value = item?.nameShort || '';
	inputNameFull.value = item?.nameFull || '';
	inputRequisites.value = item?.requsites || '';
	inputOwnership.value = item?.ownership ? `${item.ownership.nameShort} (${item.ownership.nameFull})` : ''
	inputSlug.value = item?.slug || slugify(inputNameShort.value as string, 50);
	inputID.value = item?.id || 0;
	isShortName = !!item?.nameShort;
	companyContacts.value = item?.contacts;
	contacts.value.update(item?.contacts);
}

const submit = () => {
	const contactsList = contacts.value.getContacts();
	if (typeof company === 'undefined') {
		company = {
			nameFull: '',
			nameShort: '',
			slug: '',
			user: {
				id: auth.user?.id,
				email: auth.user?.email || '',
				fio: auth.user?.fio
			}
		}
	}

	company.id = inputID.value as number;
	company.nameFull = inputNameFull.value as string;
	company.nameShort = inputNameShort.value as string;
	company.requsites = inputRequisites.value as string;
	company.slug = inputSlug.value as string;
	if (userData.ownership) {
		inputOwnership.value = inputOwnership.value || userData.ownership[0];
		const idx = userData.ownership.findIndex(item => `${item.nameShort} (${item.nameFull})` === inputOwnership.value);
		company.ownership = userData.ownership[idx >= 0 ? idx : 0];
	}
	company.contacts = contactsList;

	userData.updateCompany(company).then((result) => {
		if (result) {
			if (result?.errors)
				return setErrors('companies_form', result.errors?.other ? [result.errors?.other]  : [], result.errors);
			emit('save');
		}
	}).catch((error) => {
		console.log(error);
	});
}

const cloneName = () => {
	if (isShortName) return;
	inputNameShort.value = inputNameFull.value.trim();
	createSlug();
}

const shortNameModify = () => {
	isShortName = inputNameFull.value.trim() !== inputNameShort.value.trim();
	createSlug();
}

const deleteCompany = () => {
	if (confirm(`Вы действительно хотите удалить компанию «${inputNameFull.value}»`)) {
		emit('delete', company);
	}
}

const createSlug = () => {
	if (isSlugChanged) return;
	inputSlug.value = slugify(inputNameShort.value as string, 50);
}

const slugChange = () => {
	isSlugChanged = true;
	if (inputSlug.value.length === 0) isSlugChanged = false;
}

onMounted(() => {
	setup();
})
</script>

<template>
	<div class="max-w-[600px] formkit-w-full">

		<div v-if="refCompany && !refCompany?.isApproved && !refCompany.isDeclined" class="mb-4 flex flex-wrap justify-center text-center">
			<div class="flex items-center text-center w-[140px] h-10 px-2 py-1 rounded bg-yellow-500 text-white text-xs">
				ожидает модерации
			</div>
		</div>
		<div v-if="refCompany && !refCompany.isApproved && refCompany.isDeclined"
		     class="relative mt-5 mb-4 p-4 text-center border border-red-600 rounded bg-red-100/50"
		>
			<div class="absolute -top-3.5 left-[50%] -translate-x-[50%] flex items-center justify-center w-[140px] h-6 px-2 py-1 rounded bg-red-600 text-white text-xs mb-2">
				отклонена
			</div>
			<div class="w-full grow text-red-700">{{ refCompany.declineReason }}</div>
		</div>

		<FormKit
			id="companies_form"
			type="form"
			:submit-label="inputID ? 'Сохранить' : 'Добавить'"
			:config="{ validationVisibility: 'submit' }"
			@submit="submit"
		>
			<FormKit
				type="select"
				label="Форма собственности"
				name="ownership"
				:options="ownerships"
				v-model="inputOwnership"
			/>
			<FormKit
				type="text"
				name="nameFull"
				id="name_full"
				label="Полное название"
				placeholder="Юридическое название компании"
				v-model="inputNameFull"
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
				v-model="inputNameShort"
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
				v-model="inputSlug"
				validation="required|length:3|matches:/[0-9a-z_]/"
				:validation-messages="{
					  slug_exists: 'Указанный идентификатор уже занят',
            length: 'Длина Идентификатора должна быть не менее 5 символов',
            required: 'Необходимо указать Идентификатор',
            matches: 'В написании Идентификатора допустимо использование символов английского алфавита и нижнего подчеркивания'
          }"
			/>
			<FormKit
				type="textarea"
				name="requsites"
				id="requsites"
				label="Реквизиты"
				placeholder="Банковские реквизиты"
				v-model="inputRequisites"
				validation="required"
				:validation-messages="{
            required: 'Необходимо указать реквизиты компании',
          }"
			/>

			<ContactsList :contacts="companyContacts" ref="contacts"/>

		</FormKit>

		<Button
			v-if="(userData.companies.length > 1) && (inputID)"
			class="flex items-center justify-center bg-gray-light text-white hover:bg-red-600 py-3 px-6 mt-6 text-center"
			@click.prevent="deleteCompany"
		>
			<IconTrash filled class="w-5 h-5" /> Удалить компанию
		</Button>

	</div>

</template>

<style lang="postcss">
	.formkit-w-full {
		.formkit-inner {
			@apply max-w-none;
		}
		.formkit-actions {
			.formkit-wrapper {
				@apply text-center;
				button {
					@apply min-w-[180px] justify-center;
				}
			}
		}
	}
</style>