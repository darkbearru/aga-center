<script setup lang="ts">

import Users from '~/components/content/admin/Users.vue';

definePageMeta({
	middleware: ["admin"],
	layout: "client",
});

useHead({ title: 'АГА. Список пользователей' });

</script>

<template>
	<Users />
</template>

<style scoped>

</style>