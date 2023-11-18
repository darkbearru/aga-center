<script setup lang="ts">

import { useClientData } from '~/components/stores/useClientData';
import type { TCompany } from '~/src/data/types/company';
import ContentAndHeader from '~/components/layout/ContentAndHeader.vue';
import TypesList from '~/components/content/TypesList.vue';
import CompanyListItem from '~/components/content/companies/CompanyListItem.vue';
useHead({ title: 'АГА. Список компаний' });

const companiesList = ref<TCompany[] | undefined>(undefined);
const clientData = useClientData();

clientData.companiesList().then((data) => {
	companiesList.value = data;
})

</script>

<template>
	<div>
		<div class="mx-auto w-full max-w-3xl">
			<ContentAndHeader title="Список компаний">
				<div class="w-full divide-y divide-gray-200">
					<CompanyListItem v-for="item in companiesList" :company="item"  />
				</div>
			</ContentAndHeader>
		</div>
	</div>

</template>

<style scoped>

</style>