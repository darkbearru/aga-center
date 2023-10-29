<script setup lang="ts">

import Popup from '~/components/ui/Popup.vue';
import PopupContainer from '~/components/ui/PopupContainer.vue';
import ButtonRow from '~/components/ui/ButtonRow.vue';
import Button from '~/components/ui/Button.vue';

const popup = ref();
const titlePopup = ref('');
const reasonText = ref('');
const emit = defineEmits(['approve', 'decline']);

const popupOpen = (title: string) => {
	titlePopup.value = title;
	reasonText.value = '';
	if (popup.value) popup.value.show();
}
const popupClose = () => {
	if (popup.value) popup.value.hide();
}

const approve = () => {
	emit('approve');
	popupClose();
}

const declineCheck = () => submitForm('reason_form');
const getReason = (): string => reasonText.value;

const decline = () => {
	emit('decline', unref(reasonText));
	popupClose();
}

defineExpose({ popupOpen, getReason });

</script>

<template>
	<PopupContainer ref="popup" @close="popupClose">
		<Popup class="bg-gray-light/60 w-full max-h-full min-w-[300px] max-w-[600px] pb-0" :title="titlePopup" @close="popupClose">
			<slot />
			<div class="max-w-[600px] formkit-w-full">
				<FormKit
					id="reason_form"
					type="form"
					submit-label="Войти"
					:config="{ validationVisibility: 'submit' }"
					:actions="false"
					@submit="decline"
				>
					<FormKit
						id="reason"
						type="textarea"
						label="Причина отклонения"
						placeholder="В случае отклонения укажите причину"
						v-model="reasonText"
						validation="required"
						:validation-messages="{
		          required: 'Необходимо указать причину отклонения',
	          }"
					/>
					<div class="flex gap-4 mt-4 justify-center">
						<Button class="bg-main hover:bg-second text-white px-10 py-3" @click="approve">Принять</Button>
						<Button class="bg-red-600 hover:bg-red-800 text-white px-6 py-3" @click="declineCheck">Отклонить</Button>
					</div>
				</FormKit>
			</div>
		</Popup>
	</PopupContainer>

</template>

<style scoped>

</style>