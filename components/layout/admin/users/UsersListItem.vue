<script setup lang="ts">

import { TUser } from '~/src/users/types/users';
import IconEdit from 'assets/svg/icon-edit.svg';
import IconTrash from 'assets/svg/icon-trash.svg';
import IconAdmin from 'assets/svg/icon-user-cog.svg';
import IconModerator from 'assets/svg/icon-user-check.svg';

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
	<div class="flex items-center px-4 py-3 bg-dark-light/10 odd:bg-white hover:bg-dark-light/20 cursor-pointer rounded">
		<div class="flex items-center w-6/12">
			{{ (item as TUser)?.fio }}
			<IconAdmin class="w-5 h-5 ml-1 text-second" filled v-if="(item as TUser)?.isAdmin"/>
			<IconModerator class="w-5 h-5 ml-1 text-second" filled v-if="(item as TUser)?.isModerator"/>
		</div>
		<div class="w-4/12">{{ (item as TUser)?.email }}</div>
		<div class="w-2/12 flex items-center justify-end">
			<a href="" class="block w-5 h-5 mx-1 text-dark-main hover:text-main" @click.prevent="onClick"><IconEdit filled /></a>
			<a href="" class="block w-5 h-5 mx-1 text-dark-main hover:text-main" @click.prevent="onDelete"><IconTrash filled /></a>
		</div>
	</div>
</template>

<style scoped>

</style>