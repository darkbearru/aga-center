<script setup lang="ts">
import { useData } from '~/components/stores/useData';
import type { TOwnership } from '~/src/data/types/ownership';
import OwnershipListItem from '~/components/content/admin/ownership/OwnershipListItem.vue';

const data = useData();
const ownershipList = ref(data.ownership);

const emit = defineEmits(['click', 'delete']);

const onClick = (item: TOwnership) => {
	emit('click', item);
}

const onDelete = (item: TOwnership) => {
	emit('delete', item);
}

const update = () => {
	ownershipList.value = data.ownership;
}
defineExpose({update});

</script>

<template>
	<OwnershipListItem v-for="item in ownershipList" :item="item" :key="item.id" @click="onClick" @delete="onDelete"/>
</template>

<style scoped>

</style>