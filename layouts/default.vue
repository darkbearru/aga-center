<script lang="ts" setup>
import Header from '~/components/layout/Header.vue';
import Footer from '~/components/layout/Footer.vue';
import TitlePicture from '~/components/layout/TitlePicture.vue';
import LogosList from '~/components/layout/LogosList.vue';
</script>

<template>
  <div class="bg-white">
	  <Header />
    <NuxtPage />
		<Footer>
			<LogosList />
		</Footer>
  </div>
</template>

<style scoped></style>
