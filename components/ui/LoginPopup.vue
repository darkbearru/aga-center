<script setup lang="ts">
import ButtonRow from '~/components/ui/ButtonRow.vue';
import IconLogin from 'assets/svg/icon-login.svg';
import Popup from '~/components/ui/Popup.vue';
import Button from '~/components/ui/Button.vue';
import TextInput from '~/components/ui/TextInput.vue';
import { codeValidate, emailValidate } from '~/src/services/validation/validation';
import LoadingBg from '~/components/ui/LoadingBg.vue';
import { useAuth } from '~/components/stores/useAuth';
import { setErrors } from '@formkit/core';


const loginForm = reactive({
	email: '',
	code: '',
	isReg: false,
	regEmail: '',
	regCode: '',
	regFIO: '',
	mode: false,
	classList: '',
	show: false,
	loading: false,
});
const authUser = useAuth();

defineExpose({show, hide});
const emit = defineEmits(['hide-popup']);

function show(): void {
	loginForm.show = true;
}

function hide(): void {
	loginForm.show = false;
	loginForm.isReg = false;
	loginForm.classList = '';
	loginForm.mode = false;
	emit('hide-popup');
}

const switchRegistration = (): void => {
	loginForm.isReg = !loginForm.isReg;
	loginForm.classList = loginForm.isReg ? 'is-registration' : '';
	loginForm.mode = false;
}

const loginClick = (): void => {
	submitForm('login_form');
}
const registrationClick = (): void => {
	submitForm('registration_form');
}

const login = async (): Promise<void> => {

	if (!loginForm.mode) {
		loginForm.loading = true;
		const result = await authUser.login(loginForm.email);
		if (result?.errors) {
			console.log(result.errors);
			setErrors('login_form', result.errors?.other ? [result.errors?.other]  : [], result.errors);
		}
		loginForm.loading = false;
		if (!result?.errors && result?.user) loginForm.mode = true;
		return;
	}

	loginForm.loading = true;
	const result = await authUser.login(loginForm.email, loginForm.code);
	if (result?.errors) {
		setErrors('login_form', result.errors?.other ? [result.errors?.other]  : [], result.errors);
	}
	loginForm.loading = false;

	if (!result?.user) return;
	hide();
	await gotoClientArea();
}

const register = async (data: any): Promise<void> => {
	if (!loginForm.mode) {
		loginForm.loading = true;
		const result = await authUser.register(loginForm.regEmail, loginForm.regFIO, loginForm.regCode);
		if (result?.errors) {
			console.log(result.errors);
			setErrors('registration_form', result.errors?.other ? [result.errors?.other]  : [], result.errors);
		}
		loginForm.loading = false;
		if (!result?.errors && result?.user) loginForm.mode = true;
		return;
	}

	loginForm.loading = true;
	const result = await authUser.register(loginForm.regEmail, loginForm.regFIO, loginForm.regCode);
	if (result?.errors) {
		setErrors('registration_form', result.errors?.other ? [result.errors?.other]  : [], result.errors);
	}
	loginForm.loading = false;

	if (!result?.user) return;
	hide();
	await gotoClientArea();
}

const gotoClientArea = async () => {
	const router = useRouter();
	await router.push({path: '/client'});
}

</script>

<template>
	<div class="login-popup-container " :class="(loginForm.show ? 'show ' : '')">
		<div class="login-popup" :class="loginForm.classList">
			<Popup title="Авторизация" class="w-full bg-gray-200/60 pb-6 shadow-md" @close="hide">
				<FormKit
					id="login_form"
					type="form"
					submit-label="Войти"
					:config="{ validationVisibility: 'submit' }"
					:actions="false"
					@submit="login"
				>
					<FormKit
						type="email"
						id="email"
						name="email"
						label="E-mail"
						placeholder="E-mail адрес"
						v-model="loginForm.email"
						validation="required|email"
						validation-visibility="submit"
						:validation-messages="{
              not_exists: 'Указанный пользователь не существует',
              email: 'Введённый текст не соответствует формату Email',
              required: 'Необходимо указать ваш email',
            }"
					/>
					<FormKit
						v-if="loginForm.mode"
						type="text"
						id="confirm_code"
						name="confirm_code"
						class="confirm_code"
						label="Код"
						placeholder="Код подтверждения"
						v-model="loginForm.code"
						validation="required|length:8|contains_numeric"
						validation-visibility="submit"
						:validation-messages="{
              code_not_exists: 'Введён неверный код',
              length: 'Длина кода должна быть 8 символов',
              required: 'Необходимо указать ваш email',
              contains_numeric: 'Код должен состоять из цифр'
            }"
					/>
					<ButtonRow class="h-12">
						<Button
							class="flex items-center justify-center grow bg-transparent border border-main text-main hover:text-white hover:bg-main hover:border-main group disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-main-light-2 disabled:hover:text-main-light-2"
							title="Зарегистрироваться"
							@click="switchRegistration"
							v-show="!loginForm.mode"
						>
							Регистрация
						</Button>
						<Button
							class="flex items-center border border-second bg-second text-white hover:border-main hover:bg-main px-6"
							title="Войти"
							@click="loginClick"
						>
							<IconLogin class="w-6 h-6 block text-white pr-1" filled/>
							Войти
						</Button>
					</ButtonRow>
				</FormKit>
				<LoadingBg v-show="loginForm.loading"/>
			</Popup>

			<Popup title="Регистрация" class="w-full bg-gray-200/60 pb-6 shadow-md" @close="hide">
				<FormKit
					id="registration_form"
					type="form"
					submit-label="Зарегистрироваться"
					:config="{ validationVisibility: 'submit' }"
					:actions="false"
					@submit="register"
				>
					<FormKit
						type="email"
						name="email"
						id="email"
						label="E-mail"
						placeholder="E-mail адрес"
						v-model="loginForm.regEmail"
						validation="required|email"
						validation-visibility="submit"
						:validation-messages="{
	              user_exists: 'Указанный пользователь уже существует',
	              email: 'Введённый текст не соответствует формату Email',
	              required: 'Необходимо указать ваш email',
	            }"
					/>
					<FormKit
						type="text"
						name="fio"
						id="fio"
						label="ФИО"
						placeholder="ФИО"
						v-model="loginForm.regFIO"
						validation="required|length:5|contains_alpha_spaces"
						validation-visibility="submit"
						:validation-messages="{
	              length: 'Длина ФИО должна быть не менее 5 символов',
	              required: 'Необходимо указать ФИО',
	              contains_alpha_spaces: 'ФИО может состоять только из букв и пробелов'
	            }"
					/>
					<FormKit
						v-if="loginForm.mode"
						type="text"
						id="code"
						name="confirm_code"
						class="confirm_code"
						label="Код"
						placeholder="Код подтверждения"
						v-model="loginForm.regCode"
						validation="required|length:8|contains_numeric"
						validation-visibility="submit"
						:validation-messages="{
		              code_not_exists: 'Введён неверный код',
		              length: 'Длина кода должна быть 8 символов',
		              required: 'Необходимо указать ваш email',
		              contains_numeric: 'Код должен состоять из цифр'
		            }"
					/>
					<FormKit
						type="checkbox"
						name="confirm"
						id="confirm"
						:checked="true"
						label="Согласен с правилами сайта"
						validation="required"
						:validation-messages="{
	              required: 'Без согласия с правилами сайта регистрация невозможна',
	            }"
					/>
					<ButtonRow class="h-12">
						<Button
						class="flex items-center justify-center grow bg-transparent border border-main text-main hover:text-white hover:bg-main hover:border-main group"
						title="Войти"
						@click="switchRegistration"
						>
							Авторизация
						</Button>
						<Button
							class="flex items-center border border-second bg-second text-white hover:border-main hover:bg-main px-6"
							title="Зарегистрироваться"
							@click="registrationClick"
						>
							Зарегистрироваться
						</Button>
					</ButtonRow>
				</FormKit>
				<LoadingBg v-show="loginForm.loading"/>
			</Popup>
		</div>
	</div>
</template>

<style scoped lang="postcss">
.login-popup {
	transform-style: preserve-3d;
	position: relative;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
	transition: all 0.6s cubic-bezier(0.785, 0.135, 0.15, 0.86);
	transform: rotateY(0);

	&-container {
		@apply fixed z-50 right-4 top-8 w-full min-w-[300px] max-w-[440px] invisible scale-110 opacity-0 transition-all duration-300;
		perspective: 3000px;

		&.show {
			@apply visible opacity-100 scale-100;
		}
	}

	&.is-registration {
		transform: rotateY(180deg);
	}

	& > div {
		overflow: hidden;
		position: absolute;

		&:first-child {
			backface-visibility: hidden;
			z-index: 2;
			transform: rotateY(0deg);
		}

		&:last-child {
			backface-visibility: hidden;
			transform: rotateY(180deg);
		}
	}
}
</style>