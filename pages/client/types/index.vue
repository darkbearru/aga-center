<script setup lang="ts">

import InitiativeTypes from '~/components/content/admin/InitiativeTypes.vue';

definePageMeta({
	middleware: ["moderator"],
	layout: "client",
});
useHead({ title: 'АГА. Список типов' });

</script>

<template>
	<InitiativeTypes />
</template>

<style scoped>

</style>