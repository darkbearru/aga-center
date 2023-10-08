<script setup lang="ts">

import InitiativeTypes from '~/components/layout/admin/InitiativeTypes.vue';

definePageMeta({
	middleware: ["auth"],
	layout: "client",
});

</script>

<template>
	<InitiativeTypes />
</template>

<style scoped>

</style>