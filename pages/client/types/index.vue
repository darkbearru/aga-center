<script setup lang="ts">

import InitiativeTypes from '~/components/layout/admin/InitiativeTypes.vue';

definePageMeta({
	middleware: ["admin"],
	layout: "client",
});
useHead({ title: 'АГА. Список типов' });

</script>

<template>
	<InitiativeTypes />
</template>

<style scoped>

</style>