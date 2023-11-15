<script setup lang="ts">

import InitiativeTypes from '~/components/layout/admin/InitiativeTypes.vue';

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