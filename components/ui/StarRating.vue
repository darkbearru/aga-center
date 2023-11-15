<script setup lang="ts">

import StarRatingItem from '~/components/ui/StarRatingItem.vue';

const emit = defineEmits([ 'select' ]);

type TStar = {
	idx: number,
	selected: boolean
}
type TStars = TStar[];
const stars = ref<TStars>([]);
const currentSelection = ref(0);
const refStars = ref();

onMounted(() => {
	for(let i = 0; i<5; i++) {
		stars.value.push({
			idx: 5 - i,
			selected: false
		})
	}
});


function selectStar(value: number) {
	currentSelection.value = value;
	emit('select', value);
	stars.value = stars.value.map(item => {
		if (item.idx <= value) {
			item.selected = true
		} else {
			item.selected = false;
		}
		return item;
	});
	refStars.value.forEach((item: any, index: number): void => {
		item?.update(stars.value[index].selected);
	});
}

</script>

<template>
	<div class="rating-block">
		<StarRatingItem  v-for="item in stars" :idx="item.idx" :selected="item.selected" @click="selectStar" ref="refStars"/>
	</div>
</template>

<style lang="postcss">
.rating-block {
	@apply flex flex-nowrap justify-end flex-row-reverse my-3;
	input[type="radio"] {
		display: none;
		&:checked ~ .rating-block__label {
			@apply text-second;
		}
	}
	.rating-block__label {
		@apply block cursor-pointer text-gray-500;
		&:hover,
		&:hover ~ .rating-block__label {
			@apply text-second;
		}
	}
}
</style>