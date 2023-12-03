<script setup lang="ts">
import { useData } from '~/components/stores/useData';
import type { TUser } from '~/src/users/types/users';
import UsersListItem from '~/components/content/admin/users/UsersListItem.vue';

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
	usersList.value = data.users;
}
defineExpose({update});

</script>

<template>
	<UsersListItem v-for="item in usersList" :item="item" :key="item.id" @click="onClick" @delete="onDelete"/>
</template>

<style scoped>

</style>