<script setup lang="ts">

import type { TOrderMessages } from '~/src/data/types/order';
import { OrderAuthor, OrderStatus } from '~/src/data/types/order';
import IconStarFilled from 'assets/svg/icon-star-filled.svg';
import IconStar from 'assets/svg/icon-star.svg';


defineExpose({ update });
const props = defineProps({
	data: Object,
	author: String,
	created: String,
	changed: String,
	company: String,
	orderStatus: Number,
	direction: Number,
})
const messageBg = ref('bg-dark-main/10');
const messagesList = ref<TOrderMessages>(props.data as TOrderMessages);
const messageData = reactive({
	count: 0,
	author: props.author,
	created: props.created,
	changed: props.changed,
	status: props.orderStatus,
	direction: props.direction,
	company: props.company,
});

const ratingStarts = ref([1,2,3,4,5]);


function update(data: TOrderMessages, changed: string, created: string, author: string, status: OrderStatus, direction: OrderAuthor, company: string): void {
	messagesList.value = data;
	messageData.count = data.length;
	messageData.author = direction === OrderAuthor.company ? author : 'Вы';
	messageData.created = created;
	messageData.changed = changed;
	messageData.status = status;
	messageData.direction = direction;
	messageData.company = direction === OrderAuthor.client ? company : 'Вы';

	// messageBg.value = direction === OrderAuthor.client ? 'bg-second/10' : 'bg-dark-main/10';

	switch (status) {
		case OrderStatus.tryComplete: {
			messageBg.value = 'bg-yellow-100';
			break;
		}
		case OrderStatus.complete: {
			messageBg.value = 'bg-lime-100';
			break;
		}
		case OrderStatus.cancelComplete: {
			messageBg.value = 'bg-red-100';
			break;
		}
		case OrderStatus.canceled: {
			messageBg.value = 'bg-red-100';
			break;
		}
		case OrderStatus.deleted: {
			messageBg.value = 'bg-red-200';
			break;
		}
	}
}
</script>

<template>
	<div>
		<div v-for="(message, index) in messagesList">
			<div class="flex flex-wrap mb-4" :class="message.author === OrderAuthor.client ? 'justify-start' : 'justify-end'">
				<div v-if="message.author === OrderAuthor.client" class="w-full sm:w-10/12 mr-4 sm:mr-0 ">
					<div class="flex items-center w-full text-second mb-1">
						<h3 class="grow italic text-sm">{{ messageData.author }}</h3>
						<div v-if="index === 0" class="text-gray-500 text-sm italic mr-2">{{ messageData.created }}</div>
						<div v-else-if="index === messageData.count - 1" class="text-gray-500 text-sm italic mr-2">{{ messageData.changed }}</div>
					</div>
					<div class="w-full p-4 rounded-tr-xl rounded-br-xl rounded-bl-xl" :class="(index === messageData.count - 1) ? messageBg : 'bg-second/10'">
						{{ message.message }}
						<div v-if="message?.rating" class="flex justify-center text-second">
							<div v-for="rate in ratingStarts">
								<IconStarFilled v-if="rate <= message?.rating" class="w-8 h-8 " filled />
								<IconStar v-else class="w-8 h-8 " filled />
							</div>
						</div>
					</div>
				</div>
<!--
				<div v-if="(index === messageData.count - 1) && (messageData.status === OrderStatus.tryComplete) && (messageData.direction === OrderAuthor.client)"
				     class="w-full mt-4 mb-3 bg-blue-500 text-white rounded-tl-xl rounded-tr-xl p-4 text-lg text-center"
				>
					«{{ messageData.company }}» предлагает завершить сделку
				</div>
-->
				<div v-if="message.author !== OrderAuthor.client" class="w-full ml-4 sm:ml-8">
					<div class="flex items-center w-full text-dark-main text-right mb-1">
						<h3 class="grow italic text-sm">{{ messageData.company }}</h3>
						<div v-if="index === messageData.count - 1" class="text-gray-500 text-sm italic ml-4">{{ messageData.changed }}</div>
					</div>
					<div class="w-full p-4 rounded-tl-xl rounded-br-xl rounded-bl-xl" :class="(index === messageData.count - 1) ? messageBg : 'bg-dark-main/10'">
						{{ message.message }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>