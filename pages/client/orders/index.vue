<script setup lang="ts">

import { useData } from '~/components/stores/useData';
import type { TInitiativeWithOrders } from '~/src/data/types/initiatives';
import type { TOrder, TOrderMessage } from '~/src/data/types/order';
import { OrderAuthor, OrderStatus } from '~/src/data/types/order';
import { useRoute } from 'nuxt/app';

definePageMeta({
	middleware: ["auth"],
	layout: "client",
});

const userData = useData();
const initiatives = ref<TInitiativeWithOrders>([]);
const initiativesList = ref<TInitiativeWithOrders>([]);
await userData.ordersList().then((data) => {
	initiatives.value = data;
	initiativesList.value = processOrders(initiatives.value);
});

watch(initiatives, () => {
	console.log('Watch');
	initiativesList.value = processOrders(initiatives.value);
});


function processOrders(list: TInitiativeWithOrders): TInitiativeWithOrders {
	list = list.map((item) => {
		item.orders = item.orders?.map((order: TOrder) => {
			order.message = 'undefined';
			order.author = OrderAuthor.client;
			if (order?.messages && Array.isArray(order?.messages)) {
				const lastMessage: TOrderMessage = order.messages[order.messages.length - 1] as TOrderMessage;
				order.message = lastMessage.message;
				order.author = lastMessage.author;
			}
			order.statusText = 'Завершён';
			order.statusColor = 'bg-green-600';
/*
			request = 1,
			canceled = 2,
			active = 3,
			tryComplete = 5,
			cancelComplete = 6,
			complete = 7,
			deleted = 8
*/

			switch(order.status) {
				case OrderStatus.request: {
					order.statusText = 'Запрос';
					order.statusColor = 'bg-yellow-600';
					break;
				}
				case OrderStatus.active: {
					order.statusText = 'Активный';
					order.statusColor = 'bg-blue-500';
					break;
				}
				case OrderStatus.deleted: {
					order.statusText = 'Удалён';
					order.statusColor = 'bg-red-600';
					break;
				}
				case OrderStatus.canceled: {
					order.statusText = 'Отменён';
					order.statusColor = 'bg-red-600';
					break;
				}
				case OrderStatus.tryComplete: {
					order.statusText = 'Заявка на завершение';
					order.statusColor = 'bg-yellow-600';
					break;
				}
				case OrderStatus.cancelComplete: {
					order.statusText = 'Завершение отклонено';
					order.statusColor = 'bg-orange-500';
					break;
				}
				case OrderStatus.complete: {
					order.statusText = 'Завершён';
					order.statusColor = 'bg-lime-500';
					break;
				}
			}
			return order;
		});
		return item;
	});
	return list;
}

async function gotoOrder(order: TOrder): Promise<void> {
	const route = useRouter();
	await route.push(`/client/orders/${order.code}`);
	// await navigateTo(`/client/orders/${order.code}`);
}
</script>

<template>
	<div>
		<div v-for="(item, idx) in initiativesList"
		     class="text-lg text-main px-4 py-3 bg-dark-light/10 odd:bg-white hover:bg-dark-light/20 border-b border-b-dark-light cursor-pointer rounded"
		>
			<h3>{{ item.name }}</h3>
			<div v-for="(order, index) in item.orders"
			     class="flex items-center ml-2 px-4 py-2 text-base text-dark-main border-b-dark-light hover:bg-dark-light/20 cursor-pointer rounded"
			     @click.prevent="gotoOrder(unref(order) as TOrder)"
			>
				<div class="w-8/12 flex items-center">
					<span v-if="order.author === OrderAuthor.client" class="px-2 py-1 rounded bg-blue-500 text-xs text-white mr-3">Клиент</span>
					<span v-if="order.author === OrderAuthor.company" class="px-2 py-1 rounded bg-dark-light text-xs text-white mr-3">Вы</span>
					{{ order.message }}
				</div>
				<div class="w-4/12 flex gap-3 items-center">
					<div class="p-2 rounded text-xs text-white" :class="order.statusColor">{{ order.statusText }}</div>
					<div class="grow text-right text-dark-light text-xs">{{ order.changed }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>