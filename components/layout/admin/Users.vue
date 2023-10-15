<script setup lang="ts">
import UsersList from '~/components/layout/admin/users/UsersList.vue';
import Button from '~/components/ui/Button.vue';
import IconUserPlus from 'assets/svg/icon-user-plus.svg';
import Popup from '~/components/ui/Popup.vue';
import PopupContainer from '~/components/ui/PopupContainer.vue';
import { TUser } from '~/src/users/types/users';
import { useData } from '~/components/stores/useData';
import { setErrors } from '@formkit/core';

const titlePopup = ref('Добавить пользователя')
const popup = ref();
const inputEmail = ref<String>('');
const inputFio = ref<String>('');
const inputIsAdmin = ref<Boolean>(false);
const inputIsModerator = ref<Boolean>(false);
const inputId = ref<Number | undefined>(undefined);
const userData = useData();
const usersList = ref();

const popupOpen = (item?: TUser): void => {
	titlePopup.value = 'Добавить пользователя';
	if (item?.id) {
		titlePopup.value = 'Изменение данных пользователя';
		inputEmail.value = item?.email || '';
		inputFio.value = item?.fio || '';
		inputIsAdmin.value = item?.isAdmin || false;
		inputIsModerator.value = item?.isModerator || false;
		inputId.value = item?.id || undefined;
	}
	popup.value.show();
}

const popupClose = (): void => {
	popup.value.hide();
	inputEmail.value = '';
	inputFio.value = '';
	inputIsAdmin.value = false;
	inputIsModerator.value = false;
	inputId.value = undefined;
}

const popupSubmit = async (): Promise<void> => {
	userData.updateUser({
		id: inputId.value as number || undefined,
		email: inputEmail.value as string,
		fio: inputFio.value as string,
		isModerator: inputIsModerator.value as boolean,
		isAdmin: inputIsAdmin.value as boolean,
	}).then((result) => {
		if (result) {
			if (result?.errors) return setErrors('users_form', [], result.errors);
			usersList.value.update();
			popupClose();
		}
	}).catch((error) => {
		console.log(error);
	});
}

const deleteUser = async (user: TUser): Promise<void> => {
	await userData.deleteUser(user).then(() => usersList.value.update());
}

</script>

<template>
	<div class="w-7/12 min-w-[520px]">
		<div class="w-full text-center">
			<Button class="inline-flex items-center bg-main text-white hover:bg-main-light py-3 px-6 w-auto mx-auto mb-8"
			        title="Добавление пользователя" @click="popupOpen">
				<IconUserPlus class="block text-white w-6 h-6 mr-2" filled/>
				<span class="hidden md:inline">Добавление пользователя</span>
			</Button>
		</div>

		<UsersList @click="popupOpen" @delete="deleteUser" ref="usersList"/>

		<PopupContainer ref="popup">
			<Popup class="bg-gray-light/60 w-full min-w-[300px] max-w-[500px] pb-0" :title="titlePopup" @close="popupClose">
				<FormKit
					id="users_form"
					type="form"
					:submit-label="inputId ? 'Сохранить' : 'Добавить'"
					:config="{ validationVisibility: 'submit' }"
					@submit="popupSubmit"
				>
					<FormKit
						type="email"
						name="email"
						id="email"
						label="E-mail"
						placeholder="your@email.com"
						v-model="inputEmail"
						validation="required|length:5|email"
						validation-visibility="live"
						:validation-messages="{
              email_exists: 'Указанный email уже занят, попробуйте указать другой',
              length: 'Длина Email должна быть не менее 5 символов',
              required: 'Необходимо указать Email',
              email: 'Email должен соответствовать формату «aaa@domain.name»'
            }"
					/>
					<FormKit
						type="text"
						name="fio"
						id="fio"
						label="ФИО"
						placeholder="ФИО"
						v-model="inputFio"
						validation="required|length:5|contains_alpha_spaces"
						validation-visibility="live"
						:validation-messages="{
              length: 'Длина ФИО должна быть не менее 5 символов',
              required: 'Необходимо указать ФИО',
              contains_alpha_spaces: 'ФИО может состоять только из букв и пробелов'
            }"
					/>
					<FormKit type="checkbox" name="isAdmin" id="isAdmin" label="Права администратора" v-model="inputIsAdmin"/>
					<FormKit type="checkbox" name="isModerator" id="isModerator" label="Права модератора"
					         v-model="inputIsModerator"/>
				</FormKit>
			</Popup>
		</PopupContainer>
	</div>

</template>

<style scoped>
</style>