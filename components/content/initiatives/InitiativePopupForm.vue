<script setup lang="ts">

import PhotosList from '~/components/content/admin/photos/PhotosList.vue';
import Button from '~/components/ui/Button.vue';
import LoadingBg from '~/components/ui/LoadingBg.vue';
import Popup from '~/components/ui/Popup.vue';
import PopupContainer from '~/components/ui/PopupContainer.vue';
import RatingStars from '~/components/ui/RatingStars.vue';
import type { TInitiativeListItem } from '~/src/data/types/initiatives';
import { OrderStatus } from '~/src/data/types/order';
import type { TOrder, TOrderResponse } from '~/src/data/types/order';
import { setErrors } from '@formkit/core';
import { useAuth } from '~/components/stores/useAuth';
import { useClientData } from '~/components/stores/useClientData';


defineExpose({ popupOpen });

const auth = useAuth();
const clientData = useClientData();
const popup = ref();
const photos = ref();

let currentInitiativeId: number;


const initiativeData = reactive({
	title: '',
	text: '',
	company: '',
	company_info: '',
	company_slug: '',
	rating: 0,
	order: false,
});
const loginForm = reactive({
	email: '',
	fio: '',
	mode: false,
	code: '',
	message: '',
	agreement: true,
	loading: false,
})

function popupOpen(initiative: TInitiativeListItem): void {
	if (!initiative) return;
	popup?.value?.show();
	currentInitiativeId = initiative.id;
	initiativeData.title = initiative.name || '';
	initiativeData.text = (initiative.text || '').split('\n').join('<br />');
	initiativeData.company = initiative.Company?.nameShort || '';
	initiativeData.company_info = `${initiative.Company?.typeOwnership?.nameShort} «${initiative.Company?.nameFull || ''}»`;
	initiativeData.company_slug = initiative.Company?.slug || '';
	initiativeData.rating = initiative.rating || 0;
	initiativeData.order = false;
	loginForm.mode = false;
	loginForm.message = '';
	loginForm.code = '';
	loginForm.email = '';
	loginForm.fio = '';
	if (auth.user) {
		loginForm.email = auth.user.email;
		loginForm.fio = auth.user.fio || '';
		loginForm.agreement = false;
	}
	photos?.value?.update(initiative.Photos);
}

const popupClose = () => {
	popup?.value?.hide();
	currentInitiativeId = 0;
}

const orderCheck = () => submitForm('order_form');

const order = async () => {
	clearErrors('order_form', true);
	loginForm.loading = true;
	if (!currentInitiativeId) return;
	const order: TOrder = {
		user: {
			id: auth.user?.id || 0,
			email: loginForm.email,
			fio: loginForm.fio,
			confirmCode: loginForm.mode ? loginForm.code : undefined
		},
		status: OrderStatus.request,
		initiative: currentInitiativeId,
		message: loginForm.message
	}
	await clientData.makeOrder(order).then((data: TOrderResponse) => {
		loginForm.loading = false;
		if (data.errors) {
			return setErrors('order_form', data.errors?.other ? [data.errors?.other] : [], data.errors);
		}
		if (loginForm.mode) {
			alert('Ваша заявка принята. Ответ исполнителя придёт вам на email');
			return popupClose();
		}
		loginForm.mode = true;
	});
}

const makeOrder = () => {
	initiativeData.order = true;
}

</script>

<template>
	<PopupContainer ref="popup" @close="popupClose">
		<Popup class="relative bg-gray-200/80 w-full max-h-full min-w-[300px] max-w-[600px] pb-0"
		       :title="	initiativeData.title" @close="popupClose">
			<div v-if="!initiativeData.order">
				<div class="flex flex-wrap sm:flex-nowrap italic text-sm mb-4 gap-3">
					<h4 class="grow text-main">
						<a class="hover:underline decoration-main/80 underline-offset-4 decoration-2" :href="`/companies/${initiativeData.company_slug}`">{{ initiativeData.company }}</a>
						<span class="pl-2 text-xs text-gray-500">{{ initiativeData.company_info }}</span>
					</h4>
					<div class="flex w-[6.25rem] text-main">
						<RatingStars :rating="initiativeData.rating" />
					</div>
				</div>
				<div class="text-lg text-dark-main">
					<div v-html="initiativeData.text"></div>
				</div>
				<PhotosList class="mt-4" :photos=[] ref="photos" :moderation=false />
				<div class="flex justify-center mt-4">
					<Button class="bg-main hover:bg-second text-white px-10 py-3" @click="makeOrder">Оставить заявку</Button>
				</div>
			</div>
			<div v-else>
				<FormKit
				id="order_form"
				type="form"
				submit-label="Order"
				:config="{ validationVisibility: 'submit' }"
				:actions="false"
				@submit="order"
				>
					<div class="flex gap-3">
						<div class="w-6/12">
							<FormKit
							type="email"
							name="email"
							id="email"
							label="E-mail"
							placeholder="E-mail адрес"
							v-model="loginForm.email"
							validation="required|email"
							validation-visibility="submit"
							:disabled="!!auth.user"
							:validation-messages="{
					              user_exists: 'Указанный пользователь уже существует',
					              email: 'Введённый текст не соответствует формату Email',
					              required: 'Необходимо указать ваш email',
					            }"
							/>
						</div>
						<div class="w-6/12">
							<FormKit
							type="text"
							name="fio"
							id="fio"
							label="ФИО"
							placeholder="ФИО"
							v-model="loginForm.fio"
							validation="required|length:5|contains_alpha_spaces"
							validation-visibility="submit"
							:disabled="!!auth.user || loginForm.mode"
							:validation-messages="{
					              length: 'Длина ФИО должна быть не менее 5 символов',
					              required: 'Необходимо указать ФИО',
					              contains_alpha_spaces: 'ФИО может состоять только из букв и пробелов'
					            }"
							/>
						</div>
					</div>
					<FormKit
					id="message"
					name="message"
					type="textarea"
					label="Сообщение"
					placeholder="Сообщение исполнителю"
					:disabled="loginForm.mode"
					v-model="loginForm.message"
					/>
					<FormKit
					v-if="loginForm.mode"
					type="text"
					id="code"
					name="confirm_code"
					class="confirm_code"
					label="Код"
					placeholder="Код подтверждения"
					v-model="loginForm.code"
					validation="required|length:8|contains_numeric"
					validation-visibility="submit"
					help="Введите код подтверждения, отправленный на указанный вами email"
					:validation-messages="{
				              code_not_exists: 'Введён неверный код',
				              length: 'Длина кода должна быть 8 символов',
				              required: 'Необходимо указать ваш email',
				              contains_numeric: 'Код должен состоять из цифр'
				            }"
					/>
					<FormKit
					v-if="loginForm.agreement"
					type="checkbox"
					name="confirm"
					id="confirm"
					:checked="true"
					:default="true"
					label="Согласен с правилами сайта"
					validation="required"
					:validation-messages="{
		              required: 'Без согласия с правилами сайта регистрация невозможна',
	            }"
					/>

					<div class="flex items-stretch justify-center h-12 gap-3">
						<Button
						class="flex items-center border border-second bg-second text-white hover:border-main hover:bg-main px-6"
						title="Оформить заявку"
						@click="orderCheck"
						>
							Оформить заявку
						</Button>
						<Button
						class="flex items-center justify-center bg-transparent border border-main text-main hover:text-white hover:bg-main hover:border-main group"
						title="Отменить"
						@click="popupClose"
						>
							Отменить
						</Button>
					</div>
				</FormKit>
			</div>
			<LoadingBg v-show="loginForm.loading"/>
		</Popup>
	</PopupContainer>

</template>

<style scoped>

</style>