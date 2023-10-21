<script setup lang="ts">

import { useData } from '~/components/stores/useData';
import { TCompany, TFormkitCompanyOption } from '~/src/data/types/company';
import CompaniesForm from '~/components/layout/admin/companies/CompaniesForm.vue';
import Popup from '~/components/ui/Popup.vue';
import PopupContainer from '~/components/ui/PopupContainer.vue';
import Button from '~/components/ui/Button.vue';
import IconPlus from 'assets/svg/icon-plus.svg';
import IconEdit from 'assets/svg/icon-edit.svg';
import Initiatives from '~/components/layout/admin/Initiatives.vue';


const titlePopup = ref('Добавить компанию')
const popup = ref();
const userData = useData();
const companies = ref(userData.companies);
const companiesList = ref<TFormkitCompanyOption[]>([]);
const companyCurrentID = ref(userData.companies ? userData.companies[0]?.id : 0);
const companyCurrent = ref(userData.companies ? userData.companies[0] : undefined);
const companyForm = ref();


const refreshCompanies = (): void => {
	if (userData?.companies) {
		companiesList.value = [];
		userData?.companies.forEach(item => {
			companiesList.value.push({
				label: item.nameShort !== item.nameFull ? `${item.nameShort} (${item.nameFull})` : item.nameFull,
				value: item.id || 0,
			});
		});
	}
}

const popupEdit = (): void => {
	if (!userData?.companies) return;
	const id: number =  companyCurrentID.value || 0;
	const company: TCompany | undefined = userData?.companies.find(item => item.id === id);
	if (!company) return;
	popupOpen(company);
}

const popupOpen = (item?: TCompany): void => {
	titlePopup.value = 'Добавить компанию';
	companyCurrent.value = undefined;
	if (item?.id) {
		titlePopup.value = 'Изменение компании';
		companyCurrent.value = item;
	}
	companyForm.value.setup(item);
	popup.value.show();
}

const popupClose = (): void => {
	popup.value.hide();
	titlePopup.value = '';
	if (userData?.companies) refreshCompanies();
}


const deleteCompany = async (company: TCompany): Promise<void> => {
	await userData.deleteCompany(company).then(() => {
		popupClose();
		refreshCompanies()
	});
}

refreshCompanies();

</script>

<template>

	<div v-if="!companies">
		<CompaniesForm :data="companies"/>
	</div>
	<div v-else>
		<div class="formkit-no-limits flex gap-2 items-end max-w-[600px]">
			<div class="grow">
				<FormKit
					type="select"
					name="companies"
					v-model="companyCurrentID"
					:label="companies.length === 1 ? 'Компания' : 'Компании'"
					:options="companiesList"
				/>
			</div>
			<Button class="inline-flex items-center bg-main text-white hover:bg-main-light py-2 px-6" title="Редактировать" @click="popupEdit">
				<IconEdit filled class="w-6 h-6" />
			</Button>
			<Button class="inline-flex items-center bg-second text-white hover:bg-main-light py-2 px-6" title="Добавить компанию" @click="popupOpen">
				<IconPlus filled class="w-6 h-6" />
			</Button>
		</div>

		<Initiatives />

		<PopupContainer ref="popup">
			<Popup class="bg-gray-light/60 w-full min-w-[300px] max-w-[500px] pb-0" :title="titlePopup" @close="popupClose">
				<CompaniesForm ref="companyForm" @save="popupClose" @delete="deleteCompany"/>
			</Popup>
		</PopupContainer>
	</div>

</template>

<style scoped>

</style>