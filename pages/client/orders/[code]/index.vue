<script setup lang="ts">

import Order from '~/components/layout/Order.vue';
import { OrderAuthor } from '~/src/data/types/order';

definePageMeta({
	middleware: ["auth"],
	layout: "client",
});


</script>

<template>
	<div>
		<Order back="/client/orders" :direction="OrderAuthor.company"/>
	</div>
</template>

<style scoped>

</style>