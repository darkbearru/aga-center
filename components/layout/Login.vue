<script setup lang="ts">
import Button from '~/components/ui/Button.vue';
import IconLogin from '~/assets/svg/icon-login.svg';


defineExpose({ hidePopup });
defineProps({
	loggedUser: {
		type: Object,
		default: undefined,
	}
});

const emit = defineEmits(['showPopup']);
const isPopupShow = ref(false);

function showPopup(): void {
	togglePopup();
	emit('showPopup');
}

function hidePopup(): void {
	togglePopup();
}

function togglePopup(): void {
	isPopupShow.value = !isPopupShow.value;
}
</script>

<template>
	<div class="flex order-2 md:order-3 items-center justify-end md:justify-end w-6/12 md:w-2/12 pr-8">
		<div v-if="!loggedUser">
			<Button class="btn-main" :class="isPopupShow ? 'hide' : ''" title="Войти" @click="showPopup">
				<IconLogin filled /><span class="hidden md:inline">Войти</span>
			</Button>
		</div>
		<div v-else>
			<Button class="btn-main" to="/client" title="Личный кабинет">
				<IconLogin filled /><span class="hidden md:inline">Личный кабинет</span>
			</Button>
		</div>
	</div>
</template>

<style scoped lang="postcss">
.btn-main {
	@apply bg-main px-4 py-2 text-white flex items-center hover:bg-main-light transition-all duration-200 opacity-100 scale-100;
	svg {
		@apply block text-white w-6 h-6 pl-1 md:pl-0 md:pr-1 m-0;
	}
	&.hide {
		@apply scale-75 opacity-0;
	}
}
</style>