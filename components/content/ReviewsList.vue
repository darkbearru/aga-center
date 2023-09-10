<script setup lang="ts">
import ReviewItem from '~/components/content/ReviewItem.vue';

const reviews = [
	{
		name: 'Игорь Иванов',
		anons: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.'
	},
	{
		name: 'Игорь Иванов',
		anons: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.'
	},
	{
		name: 'Игорь Иванов',
		anons: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.'
	},
	{
		name: 'Игорь Иванов',
		anons: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.'
	},
];
</script>

<template>
	<div class="flex flex-wrap md:flex-nowrap content-stretch justify-start md:gap-8 mb-4">
		<div v-for="review in reviews">
			<ReviewItem :name="review.name">{{ review.anons }}</ReviewItem>
		</div>
	</div>
</template>

<style scoped>

</style>