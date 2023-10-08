<script setup lang="ts">

import Regions from '~/components/layout/admin/Regions.vue';

definePageMeta({
	middleware: ["auth"],
	layout: "client",
});

</script>

<template>
	<Regions />
</template>

<style scoped>

</style>