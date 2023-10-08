<script setup lang="ts">
import { useData } from '~/components/stores/useData';
import { TUser } from '~/src/users/types/users';
import UsersListItem from '~/components/layout/admin/UsersListItem.vue';

const data = useData();
const usersList = ref(data.users);

const emit = defineEmits(['click', 'delete']);

const onClick = (item: TUser) => {
	emit('click', item);
}

const onDelete = (item: TUser) => {
	emit('delete', item);
}

const update = () => {
	console.log('Update');
	usersList.value = data.users;
	console.log(usersList.value);
}
defineExpose({update});

</script>

<template>
	<UsersListItem v-for="item in usersList" :item="item" :key="item.id" @click="onClick" @delete="onDelete"/>
</template>

<style scoped>

</style>