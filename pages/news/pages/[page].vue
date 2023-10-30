<script setup lang="ts">

import { useClientData } from '~/components/stores/useClientData';
import type { TNews } from '~/src/data/types/news';
import NewsPage from '~/components/content/news/NewsPage.vue';

definePageMeta({
	layout: "inner",
});
</script>

<template>
	<NewsPage />
</template>

<style scoped>

</style>