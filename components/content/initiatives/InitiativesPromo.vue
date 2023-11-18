<script setup lang="ts">

import shuffle from '~/src/utils/shuffle';
import { useClientData } from '~/components/stores/useClientData';
import InitiativesPromoItem from '~/components/content/initiatives/InitiativesPromoItem.vue';
import type { TInitiativeList, TInitiativeListItem } from '~/src/data/types/initiatives';

const clientData = useClientData();
const promo = ref<TInitiativeList>();
const emit = defineEmits(['click']);

clientData.initiativePromo().then(data => {
	data = shuffle<TInitiativeListItem>(data);
	promo.value = data.slice(0, 3);
})

const onClick = (initiative: TInitiativeListItem): void => {
	emit('click', initiative);
}

</script>

<template>
	<div v-if="promo && (promo as TInitiativeList).length" class="col-span-12 flex flex-wrap sm:flex-nowrap w-full gap-4 sm:gap-8">
		<InitiativesPromoItem v-for="item in promo" :initiative="item" @click="onClick(item)" />
	</div>
</template>

<style scoped></style>