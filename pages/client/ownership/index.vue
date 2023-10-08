<script setup lang="ts">
import Ownership from '~/components/layout/admin/Ownership.vue';

definePageMeta({
	middleware: ["auth"],
	layout: "client",
});

</script>

<template>
	<Ownership />
</template>

<style scoped>

</style>