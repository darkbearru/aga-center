<script setup lang="ts">

import Regions from '~/components/layout/admin/Regions.vue';

definePageMeta({
	middleware: ["admin"],
	layout: "client",
});
useHead({ title: 'АГА. Настройка регионов' });

</script>

<template>
	<Regions />
</template>

<style scoped>

</style>