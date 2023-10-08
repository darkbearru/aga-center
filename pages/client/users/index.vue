<script setup lang="ts">

import Users from '~/components/layout/admin/Users.vue';

definePageMeta({
	middleware: ["auth"],
	layout: "client",
});

</script>

<template>
	<Users />
</template>

<style scoped>

</style>