<script setup lang="ts">

import type { TInitiative } from '~/src/data/types/initiatives';
import { useData } from '~/components/stores/useData';
import InitiativeListPromoItem from '~/components/content/admin/initiatives/InitiativeListPromoItem.vue';
import IconPlus from 'assets/svg/icon-plus.svg';
import Button from '~/components/ui/Button.vue';

definePageMeta({
	middleware: ["moderator"],
	layout: "client",
});
useHead({ title: 'АГА. Управление инициативами' });

const userData = useData();
const initiatives = ref<TInitiative[]>();

if (!userData.isLoaded) userData.get();
watchImmediate(userData.promo, () => updateList());

function updateList(): void {
	initiatives.value = userData.promo;
}

function editForm(item: TInitiative): void {
	userData.current = item;
	console.log('editForm', item);
	const router = useRouter();
	router.push('/client/companies/form');
}

function add(): void {
	userData.current = undefined;
	const router = useRouter();
	router.push('/client/companies/form');
}
</script>

<template>
	<div class="my-4 max-w-5xl">
		<Button class="m-auto mb-4 inline-flex items-center bg-main text-white hover:bg-main-light py-2 px-2" title="Добавить инициативу" @click="add">
			<IconPlus filled class="w-5 h-5 mr-1" />Добавить инициативу
		</Button>

		<InitiativeListPromoItem v-for="(item, index) in initiatives" :key="`init${item.id}`" :item="item" :index="index" @onClick="editForm(item)"  />
	</div>
</template>

<style scoped>

</style>