<script setup lang="ts">

import { TCommonData } from '~/src/data/types/common.data';
import News from '~/components/layout/admin/News.vue';
import Companies from '~/components/layout/admin/Companies.vue';

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
		<News />
	</div>
	<div v-else>
		<Companies />
	</div>
</template>

<style scoped>

</style>