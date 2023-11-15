<script setup lang="ts">

import Articles from '~/components/layout/admin/Articles.vue';

definePageMeta({
	middleware: ["moderator"],
	layout: "client",
});

useHead({title: 'АГА. Список статей' });

</script>

<template>
	<div>
		<Articles />
	</div>
</template>

<style scoped>

</style>