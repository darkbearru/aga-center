<script setup lang="ts">

import Moderation from '~/components/layout/admin/Moderation.vue';

definePageMeta({
	middleware: ["moderator"],
	layout: "client",
});
useHead({ title: 'АГА. Модерация списка компаний' });

</script>

<template>
	<Moderation />
</template>

<style scoped>

</style>