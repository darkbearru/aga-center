<script setup lang="ts">

import ModerationInitiative from '~/components/layout/admin/ModerationInitiative.vue';

definePageMeta({
	middleware: ["moderator"],
	layout: "client",
});
useHead({ title: 'АГА. Модерация списка инициатив' });

</script>

<template>
	<ModerationInitiative />
</template>

<style scoped>

</style>