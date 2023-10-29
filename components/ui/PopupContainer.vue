<script setup lang="ts">

const emit = defineEmits(['close']);
defineExpose({show, hide});

const isPopupVisible = ref(false);

function show(): void {
	isPopupVisible.value = true;
}

function hide(): void {
	isPopupVisible.value = false;
}

function onClose(e: Event): void {
	if ((e?.target as HTMLElement)?.classList.contains('popup-container')) emit('close');
}
//
</script>

<template>
	<div class="popup-container" :class="isPopupVisible ? 'show' : ''" @click="onClose">
		<slot />
	</div>
</template>

<style scoped lang="postcss">
.popup-container {
	@apply fixed flex invisible top-0 left-0 right-0 bottom-0 z-[100] bg-white/50 backdrop-blur-md opacity-0 transition-opacity duration-500;
	&.show {
		@apply visible items-center justify-center opacity-100;
	}

}
</style>