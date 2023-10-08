<script setup lang="ts">

import { useData } from '~/components/stores/useData';
import Popup from '~/components/ui/Popup.vue';

const data = useData();
const titlePopup = ref('Добавить пользователя')

</script>

<template>
	<div class="">
		<div v-for="user in data.users">
		</div>
	</div>
	<div class="min-w-[300px] max-w-[500px] w-full p-8">
		<Popup :title="titlePopup" class="bg-gray-light/60" @close="">
			<FormKit type="form">
				<FormKit type="email" name="email" id="email" label="E-mail" placeholder="your@email.com" />
				<FormKit type="text" name="fio" id="fio" label="ФИО" placeholder="ФИО" />
				<FormKit type="checkbox" name="isAdmin" id="isAdmin" label="Права администратора" />
				<FormKit type="checkbox" name="isModerator" id="isModerator" label="Права модератора" />
			</FormKit>
		</Popup>
	</div>
</template>

<style scoped>

</style>