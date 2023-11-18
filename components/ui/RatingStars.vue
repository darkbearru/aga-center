<script setup lang="ts">
import IconStar from 'assets/svg/icon-star.svg';
import IconStarFilled from 'assets/svg/icon-star-filled.svg';

const props = defineProps({
	rating: {
		type: Number,
		default: 0
	},
	className: {
		type: String,
		default: 'w-4 h-4'
	}
});
const ratingStarts = ref([1,2,3,4,5]);

</script>

<template>
	<div class="flex">
		<div v-for="rate in ratingStarts">
			<IconStarFilled v-if="rate <= rating" :class="className" filled />
			<IconStar v-else :class="className" filled />
		</div>
	</div>
</template>

<style scoped>

</style>