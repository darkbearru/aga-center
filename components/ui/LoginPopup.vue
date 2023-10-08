<script setup lang="ts">
import ButtonRow from '~/components/ui/ButtonRow.vue';
import IconLogin from 'assets/svg/icon-login.svg';
import Popup from '~/components/ui/Popup.vue';
import Button from '~/components/ui/Button.vue';
import TextInput from '~/components/ui/TextInput.vue';
import { codeValidate, emailValidate } from '~/src/services/validation/validation';
import LoadingBg from '~/components/ui/LoadingBg.vue';
import { useAuth } from '~/components/stores/useAuth';


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
	emit('hide-popup');
}

const switchRegistration = (): void => {
	loginForm.isReg = !loginForm.isReg;
	loginForm.classList = loginForm.isReg ? 'is-registration' : '';
}

const login = async (): Promise<void> => {
	if (!emailValidate(loginForm.email)) return;

	if (!loginForm.mode) {
		loginForm.loading = true;
		await authUser.login(loginForm.email);
		loginForm.loading = false;
		loginForm.mode = true;
		return;
	}

	if (!codeValidate(loginForm.code)) return;

	loginForm.loading = true;
	const result = await authUser.login(loginForm.email, loginForm.code);
	loginForm.loading = false;

	if (!result) return;

	hide();

	const router = useRouter();
	await router.push({path: '/client/'});
}

</script>

<template>
	<div class="login-popup-container" :class="(loginForm.show ? 'show ' : '')">
		<div class="login-popup" :class="loginForm.classList">
			<Popup title="Авторизация" class="w-full bg-main/90 text-white pb-6" @close="hide">
				<TextInput type="email" placeholder="E-mail адрес" v-model="loginForm.email" :disabled="loginForm.mode"
				           required/>
				<TextInput type="code" class="mt-4" placeholder="Код подтверждения" v-model="loginForm.code"
				           v-show="loginForm.mode"/>
				<ButtonRow class="h-12">
					<Button
					class="flex items-center justify-center grow bg-transparent border border-main-light-2 text-main-light-2 hover:text-white hover:bg-main-light hover:border-main group disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-main-light-2 disabled:hover:text-main-light-2"
					title="Зарегистрироваться"
					@click="switchRegistration"
					v-show="!loginForm.mode"
					>
						Регистрация
					</Button>
					<Button
					class="flex items-center border border-main bg-second text-white hover:bg-transparent hover:border-white px-6"
					title="Войти"
					@click="login"
					>
						<IconLogin class="w-6 h-6 block text-white pr-1" filled/>
						Войти
					</Button>
				</ButtonRow>
				<LoadingBg v-show="loginForm.loading"/>
			</Popup>
			<Popup title="Регистрация" class="w-full bg-main/90 text-white pb-6" @close="hide">
				<TextInput type="email" placeholder="E-mail адрес"/>
				<ButtonRow class="h-12">
					<Button
					class="flex items-center justify-center grow bg-transparent border border-main-light-2 text-main-light-2 hover:text-white hover:bg-main-light hover:border-main group"
					title="Войти"
					@click="switchRegistration"
					>
						Авторизация
					</Button>
					<Button
					class="flex items-center border border-main bg-second text-white hover:bg-transparent hover:border-white px-6"
					title="Зарегистрироваться"
					>
						Зарегистрироваться
					</Button>
				</ButtonRow>
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
			@apply visible opacity-100 scale-100
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