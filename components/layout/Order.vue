<script setup lang="ts">
import { useData } from '~/components/stores/useData';
import type { TInitiative } from '~/src/data/types/initiatives';
import type { TOrder } from '~/src/data/types/order';
import { OrderAuthor, OrderStatus } from '~/src/data/types/order';
import Initiative from '~/components/content/order/Initiative.vue';
import Messages from '~/components/content/order/Messages.vue';
import MessageForm from '~/components/content/order/MessageForm.vue';
import Button from '~/components/ui/Button.vue';
import SvgLoading from '~/components/ui/SvgLoading.vue';


const props = defineProps({
	backUrl: {
		type: String,
		default: '/'
	},
	direction: Number
})
const route = useRoute();
const order = ref<TOrder | undefined>(undefined);
const userData = useData();
const refInitiative = ref();
const refMessages = ref();
const refForm = ref();
const orderCode = ref('');
const isLoading = ref<boolean>(false);
const isDisabled = ref<boolean>(false);

if (!route.params.code) navigateTo(props.backUrl);

onMounted(async () => {
	if (!Array.isArray(route.params.code)) {
		orderCode.value = route.params.code as string;
		refreshOrder();
	}
});

function refreshOrder(): void {
	if (isDisabled.value) return;
	isLoading.value = true;
	userData.getOrder(orderCode.value).then(async (data) => {
		if (!data) await navigateTo(props.backUrl);
		updateData(data);
	});
}

watch(isLoading, (newValue) => {
	if (newValue === true) {
		isDisabled.value = true;
	} else {
		setTimeout(() => {
			isDisabled.value = false;
		}, 5000);
	}
})

const addMessage = (message: string, status: OrderStatus, rating?: number) : void => {
	isLoading.value = true;
	userData.orderAddMessage(orderCode.value, status, message, props.direction as OrderAuthor, rating).then((data) => {
		if (!data) {
			alert('Ошибка добавления сообщения, попробуйте позже');
			return;
		}
		updateData(data);
	})
	return;
}

const updateData = (data: TOrder): void => {
	order.value = data;
	refInitiative.value?.update(data?.initiative);
	refMessages.value?.update(
		data.messages,
		data.changed,
		data.created,
		data.user?.fio,
		data.status,
		props.direction as OrderAuthor,
		(data?.initiative as TInitiative)?.company.nameShort
	);
	refForm.value?.update(data.status, props.direction as OrderAuthor, (data?.initiative as TInitiative)?.company.nameShort);
	isLoading.value = false;
}
</script>

<template>
	<div>
		<div class="max-w-4xl">
			<Initiative :data="(order as TOrder)?.initiative" ref="refInitiative"/>
			<Messages class="mt-4"
			          :created="(order as TOrder)?.created || ''"
			          :changed="(order as TOrder)?.changed || ''"
			          :author="(order as TOrder)?.user?.fio || 'John Doe'"
			          :orderStatus="(order as TOrder)?.status"
			          :currentAuthor="props.direction as OrderAuthor"
			          :company="((order as TOrder)?.initiative as TInitiative)?.company.nameShort || 'Company'"
			          :data="(order as TOrder)?.messages" ref="refMessages"
			/>
			<div class="text-center my-4">
				<Button
					v-if="(order as TOrder)?.status !== OrderStatus.complete"
					class="btn"
					@click.prevent="refreshOrder"
					:class="isDisabled ? 'disabled' : ''"
				>
					 Обновить
					<div v-if="isLoading" class="absolute left-0 top-0 right-1 bottom-0 rounded flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
						<SvgLoading class="inline-block w-5 h-5" />
					</div>
				</Button>
			</div>
			<MessageForm @submit="addMessage" ref="refForm"/>
		</div>
	</div>
</template>

<style scoped lang="postcss">
.btn {
	@apply relative border border-gray-300 hover:border-dark-light bg-white hover:bg-dark-light text-gray-500 hover:text-white text-sm px-4 py-2 transition-all duration-300;
	&.disabled {
		@apply opacity-40 hover:border-gray-300 hover:bg-white hover:text-gray-500;
	}
}
</style>