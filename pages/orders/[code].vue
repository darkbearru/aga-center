<script setup lang="ts">
import Order from '~/components/layout/Order.vue';
import { OrderAuthor } from '~/src/data/types/order';

definePageMeta({
	layout: "client",
});

</script>

<template>
	<div>
		<Order back="/" :direction="OrderAuthor.client" />
	</div>
</template>

<style scoped>

</style>