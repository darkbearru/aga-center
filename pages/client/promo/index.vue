<script setup lang="ts">

definePageMeta({
	middleware: ["moderator"],
	layout: "client",
});
useHead({ title: 'АГА. Настройка промо-блока' });

import { useData } from '~/components/stores/useData';
import type { TInitiative } from '~/src/data/types/initiatives';
import Popup from '~/components/ui/Popup.vue';
import PopupContainer from '~/components/ui/PopupContainer.vue';
import PhotosList from '~/components/layout/admin/photos/PhotosList.vue';
import InitiativeListPromoItem from '~/components/layout/admin/initiatives/InitiativeListPromoItem.vue';
import MessageButton from '~/components/ui/MessageButton.vue';

const userData = useData();
const titlePopup = ref('Добавить инициативу')
const popup = ref();
const photos = ref();
const initiatives = ref<TInitiative[]>();
const currentInitiative = ref<TInitiative>();


watch(userData.promo, () => updateList());

function updateList(): void {
	initiatives.value = userData.promo;
}

const popupOpen = (item?: TInitiative): void => {
	if (!item) return;
	popup.value.show();
	if (!(item instanceof Event)) {
		item.text = item.text.split('\n').join('<br />');

		currentInitiative.value = item;
		titlePopup.value = item.name;
		photos.value?.update(item.photos);
	}
}

const popupClose = (): void => {
	if (popup.value) popup.value.hide();
	titlePopup.value = '';
}

const promoChange = (id: number, status : boolean): void => {
	if (!id) return;
	userData.setPromo(id, status).then(data => {
		console.log(data);
		if (currentInitiative.value) currentInitiative.value.promoStr = data || '';
		if (initiatives.value) {
			initiatives.value?.map(item => {
				if (item.id === id) item.promoStr = data;
			});
			console.log(initiatives.value);
		}
	});
	popupClose();
}
onMounted(() => {
	updateList();
});


</script>

<template>
	<div>

		<div class="my-4 max-w-5xl">
			<InitiativeListPromoItem v-for="(item, index) in initiatives" :key="`init${item.id}`" :item="item" :index="index" @onClick="popupOpen(item)"  />
		</div>

		<PopupContainer ref="popup" @close="popupClose">
			<Popup class="bg-gray-light/60 w-full max-h-full min-w-[300px] max-w-[600px] pb-0" :title="titlePopup" @close="popupClose">
				<div class="text-lg text-dark-main">
					<div v-html="currentInitiative?.text || ''"></div>
				</div>
				<PhotosList class="mt-4" :photos=[] ref="photos" :moderation=false />
				<div class="flex justify-center mt-4 mb-2 gap-3">
					<MessageButton
						v-if="currentInitiative?.promoStr"
						class="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
						@click="promoChange(currentInitiative?.id || 0, false)"
					>
						Отменить «Промо»
					</MessageButton>
					<MessageButton class="bg-second text-white hover:bg-main"
					               @click="promoChange(currentInitiative?.id || 0, true)"
					>
						<span v-if="currentInitiative?.promoStr">Продлить «Промо»</span>
						<span v-else>Активировать «Промо», на две недели</span>
					</MessageButton>
				</div>
			</Popup>
		</PopupContainer>

	</div>
</template>

<style scoped>

</style>