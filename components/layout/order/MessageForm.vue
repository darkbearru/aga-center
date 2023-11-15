<script setup lang="ts">

import { OrderAuthor, OrderStatus } from '~/src/data/types/order';
import MessageButton from '~/components/ui/MessageButton.vue';
import StarRating from '~/components/ui/StarRating.vue';

defineExpose({ update });

const searchText = ref('');
const emit = defineEmits(['submit']);
const orderStatus = ref<OrderStatus>(OrderStatus.request);
const direction = ref<OrderAuthor>(OrderAuthor.client);
const companyName = ref('');
const ratingStars = ref(0);
const showMode = ref(0);
const formPlaceholder = ref('Тест сообщения');
const formBg = ref('bg-gray-200');
let newStatus: OrderStatus;

const sendClick = (status: OrderStatus): void => {
	newStatus = status;
	clearErrors('message_form', true);
	submitForm('message_form');
}


function submit(): void {
	if ((newStatus === OrderStatus.complete) && !ratingStars?.value) {
		setErrors('message_form', ['Необходимо оценить работу исполнителя']);
		return;
	}
	if(searchText.value.trim().length >= 2) {
		emit('submit', searchText.value, newStatus, ratingStars?.value);
	}
}

function update(status: OrderStatus, dir: OrderAuthor, company: string): void {
	orderStatus.value = status;
	direction.value = dir;
	companyName.value = company;
	searchText.value = '';
	switchMode();
}

function selectRating(value : number): void {
	ratingStars.value = value;
	clearErrors('message_form', true);
}

function switchMode(mode?: number): void {
	formPlaceholder.value = 'Текст сообщения';
	if (direction.value === OrderAuthor.company) {
		if (orderStatus.value in {[OrderStatus.request]: 1, [OrderStatus.active]: 1, [OrderStatus.cancelComplete]: 1}) {
			showMode.value = 1;
			if (orderStatus.value === OrderStatus.request) showMode.value = 2;
			if (orderStatus.value === OrderStatus.cancelComplete) {
				formBg.value = 'bg-red-100'
			}
		}
	} else {
		if (orderStatus.value in {[OrderStatus.active]: 1, [OrderStatus.tryComplete]: 1}) {
			showMode.value = 3;
			if (orderStatus.value === OrderStatus.tryComplete) {
				showMode.value = 4;
				formBg.value = 'bg-blue-100'
			}
		}
	}
	if (orderStatus.value === OrderStatus.complete) showMode.value = 0;
	if (mode) showMode.value = mode;

	switch (showMode.value) {
		case 5: {
			formBg.value = 'bg-red-100';
			formPlaceholder.value = 'Укажите причину отказа';
			break;
		}
		case 6: {
			formBg.value = 'bg-lime-100';
			break;
		}
	}
}
</script>

<template>
	<div>
		<div v-if="showMode > 0" class="formkit-full-size mt-4 p-4 bg-gray-200 rounded" :class="formBg">
			<FormKit
				id="message_form"
				type="form"
				submit-label="Отправить"
				:config="{ validationVisibility: 'submit' }"
				:actions="false"
				@submit="submit"
			>
				<FormKit
					v-if="showMode !== 4 && showMode !== 6"
					type="textarea"
					name="message"
					id="message"
					:placeholder="formPlaceholder"
					v-model="searchText"
					validation="required|length:2"
					:validation-messages="{
						  required: 'Поле обязательное для заполнения',
		          length: 'Длина сообщения должна быть не менее 5 символов',
		        }"
				/>
				<FormKit
					v-if="showMode === 6"
					type="textarea"
					name="review"
					id="message"
					placeholder="Оставьте пожалуйста отзыв о проделанной работе и поставьте оценку исполнителю"
					v-model="searchText"
				/>
				<div class="flex justify-center">
					<StarRating v-if="showMode === 6" @select="selectRating" />
				</div>
			</FormKit>
			<div v-if="showMode === 2" class="flex flex-nowrap justify-center gap-3 w-full mt-4">
				<MessageButton class="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
						title="Отклонить, сообщив клиенту причину отказа"
						@click="sendClick(OrderStatus.deleted)"
				>
					Отменить
				</MessageButton>
				<MessageButton class="bg-second text-white hover:bg-main"
						title="Принять в работу"
						@click="sendClick(OrderStatus.active)"
				>
					Принять
				</MessageButton>
			</div>
			<div v-if="showMode === 1" class="flex flex-nowrap justify-center gap-3 w-full mt-4">
				<MessageButton class="border border-second text-second hover:bg-second hover:text-white"
					title="Завершить заказ (потребует подтверждения от заказчика)"
					@click="sendClick(OrderStatus.tryComplete)"
				>
					Завершить
				</MessageButton>
				<MessageButton class="bg-second text-white hover:bg-main"
				               title="Отправить"
				               @click="sendClick(OrderStatus.active)"
				>
					Отправить
				</MessageButton>
			</div>
			<div v-if="showMode === 3" class="flex flex-nowrap justify-center gap-3 w-full mt-4">
				<MessageButton class="bg-dark-light text-white  hover:bg-dark-main"
						title="Отправить"
						@click="sendClick(OrderStatus.active)"
				>
					Отправить
				</MessageButton>
			</div>
			<div v-if="showMode === 4" class="flex flex-wrap justify-center gap-3 w-full mt-4 pb-4">
				<h3 class="text-lg m-3 w-full text-center">Компания «{{ companyName }}» предлагает завершить сделку</h3>
				<MessageButton class="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
				               title="Отклонить, сообщив заказчику причину"
				               @click="switchMode(5)"
				>
					Отклонить
				</MessageButton>
				<MessageButton class="bg-second text-white hover:bg-main"
				               title="Согласиться на завершение сделки"
				               @click="switchMode( 6)"
				>
					Принять
				</MessageButton>

			</div>
			<div v-if="showMode === 5" class="flex flex-nowrap justify-center gap-3 w-full mt-4">
				<MessageButton class="border border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white"
				               title="Вернуться к предыдущему состоянию"
				               @click="switchMode(4)"
				>
					Назад
				</MessageButton>
				<MessageButton class="bg-red-600 hover:bg-red-700 text-white"
				               title="Отклонить и отправить исполнителю причину отклонения"
				               @click="sendClick(OrderStatus.cancelComplete)"
				>
					Отклонить
				</MessageButton>
			</div>
			<div v-if="showMode === 6" class="flex flex-nowrap justify-center gap-3 w-full mt-4">
				<MessageButton class="border border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white"
				               title="Вернуться к предыдущему состоянию"
				               @click="switchMode(4)"
				>
					Назад
				</MessageButton>
				<MessageButton class="bg-second text-white hover:bg-main"
				               title="Согласиться на завершение сделки"
				               @click="switchMode(0); sendClick(OrderStatus.complete)"
				>
					Завершить сделку
				</MessageButton>
			</div>
		</div>
	</div>
</template>

<style lang="postcss">
.formkit-full-size{
	.formkit-form {
		@apply w-full grow;
	}
	.formkit-outer {
		@apply mb-0;
	}
	.formkit-inner {
		@apply max-w-none w-full;
	}
}
</style>