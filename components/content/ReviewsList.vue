<script setup lang="ts">
import ReviewItem from '~/components/content/ReviewItem.vue';
import type { TReviewList } from '~/src/data/types/reviews';
import { useClientData } from '~/components/stores/useClientData';
import shuffle from '~/src/utils/shuffle';

const clientData = useClientData();
const reviews = ref<TReviewList>();
clientData.reviewsList()
	.then(data => {
		if (typeof data !== 'string') update(data);
	})
	.catch();


function update(items: TReviewList): void {
	if (items.length < 4) return;
	reviews.value = shuffle(items).slice(0, 4);
}
</script>

<template>
	<div class="flex flex-wrap md:flex-nowrap content-stretch justify-start md:gap-8 mb-4 mt-2">
		<ReviewItem
			v-for="item in reviews"
			:name="item.Users?.fio || 'John Dow'"
			:rating="item.rate || 0"
			:initiative="item.Initiative?.name || ''"
		>
			{{ item.review }}
		</ReviewItem>
	</div>
</template>

<style scoped>

</style>