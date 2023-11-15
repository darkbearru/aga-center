<script setup lang="ts">
import IconStarFilled from 'assets/svg/icon-star-filled.svg';
import IconStar from 'assets/svg/icon-star.svg';

defineExpose({ update });
const emit = defineEmits(['click']);
const props = defineProps({
	idx: Number,
	selected: Boolean
});

const idx = ref(props.idx);
const selected = ref(props.selected);

function click(): void {
	selected.value = !selected.value;
	emit('click', idx.value);
}

function update(isSelected: boolean): void {
	selected.value = isSelected;
}

</script>

<template>
	<input name="rating" :value="idx" :id="`rating_${idx}`" type="radio"/>
	<label :for="`rating_${idx}`" class="rating-block__label">
		<IconStar v-if="!selected" filled class="w-8 h-8" @click="click"/>
		<IconStarFilled v-if="selected" filled class="w-8 h-8" @click="click"/>
	</label>
</template>

<style scoped>

</style>