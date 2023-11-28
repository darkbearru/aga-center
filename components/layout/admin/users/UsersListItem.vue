<script setup lang="ts">

import type { TUser } from '~/src/users/types/users';
import IconEdit from 'assets/svg/icon-edit.svg';
import IconTrash from 'assets/svg/icon-trash.svg';
import IconAdmin from 'assets/svg/icon-user-cog.svg';
import IconModerator from 'assets/svg/icon-user-check.svg';
import IconBasket from 'assets/svg/icon-basket.svg';

const props = defineProps({
	item: Object
});
const emit = defineEmits(['click', 'delete']);

const onClick = () => {
	emit('click', props.item as TUser);
}

const onDelete = () => {
	if (confirm(`Вы действительно хотите удалить пользователя «${props.item?.fio} (${props.item?.email})»`)) {
		emit('delete', props.item as TUser);
	}
}
</script>

<template>
	<div class="flex flex-wrap sm:flex-nowrap items-center px-2 sm:px-4 py-2 sm:py-3 bg-dark-light/10 odd:bg-white hover:bg-dark-light/20 cursor-pointer rounded">
		<div class="flex items-center w-full sm:w-6/12 text-dark-main">
			<div class="mr-1">
				{{ (item as TUser)?.fio }}
			</div>
			<div class="flex justify-center items-center ml-1 w-6 h-6 p-0.5 bg-main rounded" v-if="(item as TUser)?.isAdmin" title="Администратор сайта">
				<IconAdmin class="w-5 h-5 text-white" filled />
			</div>
			<div class="flex justify-center items-center ml-1 w-6 h-6 p-0.5 bg-second rounded" v-if="(item as TUser)?.isModerator" title="Модератор сайта">
				<IconModerator class="w-5 h-5 text-white" filled/>
			</div>
			<div class="flex justify-center items-center ml-1 w-6 h-6 p-0.5 bg-second rounded" v-if="(item as TUser)?.isClient" title="Клиент">
				<IconBasket class="w-5 h-5 text-white" filled/>
			</div>
		</div>
		<div class="w-8/12 text-sm sm:text-base text-dark-light sm:text-dark-main sm:w-4/12">
			{{ (item as TUser)?.email }}
			<p v-if="(item as TUser)?.lastLoginDate" class="text-gray-500 text-xs" title="Последний вход">
				{{ (item as TUser)?.lastLoginDate }}
			</p>
		</div>
		<div class="w-4/12 sm:w-2/12 flex items-center justify-end">
			<a href="" class="block w-5 h-5 ml-1 sm:mx-1 text-dark-main hover:text-main" @click.prevent="onClick"><IconEdit filled /></a>
			<a href="" class="block w-5 h-5 ml-1 sm:mx-1 text-dark-main hover:text-main" @click.prevent="onDelete"><IconTrash filled /></a>
		</div>
	</div>
</template>

<style scoped>

</style>