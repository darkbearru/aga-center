<script setup lang="ts">

import type { TCommonData } from '~/src/data/types/common.data';
import News from '~/components/layout/admin/News.vue';
import Companies from '~/components/layout/admin/Companies.vue';

definePageMeta({
	middleware: ["auth"],
	layout: "client",
});

</script>

<template>
	Профиль
</template>

<style scoped>

</style>