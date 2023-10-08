<script setup lang="ts">

import { TCommonData } from '~/src/data/types/common.data';
import News from '~/components/layout/admin/News.vue';

definePageMeta({
	middleware: ["auth"],
	layout: "client",
});

defineProps({
	data: Object
})


</script>

<template>
	<div v-if="(data as TCommonData)?.news">
		Layout: Admin page
		<News />
	</div>
	<div v-else>
		Layout: Client page
	</div>
</template>

<style scoped>

</style>