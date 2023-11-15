<script setup lang="ts">
import Ownership from '~/components/layout/admin/Ownership.vue';

definePageMeta({
	middleware: ["moderator"],
	layout: "client",
});
useHead({ title: 'АГА. Формы собственностей' });

</script>

<template>
	<Ownership />
</template>

<style scoped>

</style>