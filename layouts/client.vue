<script lang="ts" setup>
import Menu from '~/components/layout/admin/Menu.vue';
import { useAuth } from '~/components/stores/useAuth';
import { useData } from '~/components/stores/useData';


/*
1. Последняя проверка работы авторизации
2. Форма редактирования профиля пользователя
3. Форма редактирования и добавления новостей
*/
const authUser = useAuth();
await authUser.check().then(() => {});

const data = useData();
await data.get().then(() => {});
</script>

<template>
  <div class="flex bg-white h-full">
	  <aside class="w-[320px] p-8 bg-main">
		  <div class=""><img src="/images/logo-white.svg" alt="АГА. Тур-центр. Логотип"/></div>
		  <div v-if="data.menu">
			  <Menu :menu="data.menu" />
		  </div>
	  </aside>
	  <main class="grow p-8">
		  <NuxtPage :data="data"/>
	  </main>
  </div>
</template>

<style scoped></style>
