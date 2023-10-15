<script setup lang="ts">

import IconPlus from 'assets/svg/icon-plus.svg';
import Button from '~/components/ui/Button.vue';
import {
	ContactsType,
	ContactsTypeNames,
	TContact,
	TFormkitContactOption,
} from '~/src/data/types/company';
import IconTrash from 'assets/svg/icon-trash.svg';


// const contacts = Object(ContactsTypeNames);
const props = defineProps({
	item: Object,
	options: Array,
	index: Number,
	indexLast: Boolean,
});

const emit = defineEmits(['add', 'delete', 'update']);
const item = props.item as TContact;
const type = ref<ContactsType>(item.type);
const typeIndex = ref(ContactsType[item.type]);
const itemValue = ref(item.value);
(props.options as TFormkitContactOption[])?.forEach((item) => {
	if (type.value === item.value) {
		item.attr.default = true;
	}
});

function checkType() {
	const result = getContactsIndex(type.value);
	if (result) typeIndex.value = result as ContactsType;
	itemValue.value = '';
	update();
}

function getContactsIndex(value: ContactsType): string | undefined {
	return Object.keys(ContactsTypeNames).find(key => key === value);
}

function addItem(): void {
	emit('add', props.item);
}

function deleteItem(): void {
	emit('delete', props.index);
}

function update(): void {
	let val = unref(itemValue);
	if (!val) return;
	const item = {
		type: type.value,
		value: val
	}
	emit('update', item, props.index);
}
</script>

<template>
	<div class="flex gap-2">
		<div>
			<FormKit type="select" :options="options" v-model="type" :default="type" @change="checkType"/>
		</div>
		<div class="grow">
			<FormKit v-if="typeIndex === 'phone'" type="mask" name="phone" mask="+7 (###) ###-##-##" v-model="itemValue" autocomplete="off" @keyup="update"/>
			<FormKit v-if="typeIndex === 'email'" type="email" name="email" placeholder="your@email.ru" v-model="itemValue" autocomplete="off" @keyup="update" />
			<FormKit v-if="typeIndex === 'vk'" type="mask" name="vk" mask="vk.com/##########" v-model="itemValue" autocomplete="off" @keyup="update" />
			<FormKit v-if="typeIndex === 'instagram'" type="mask" name="instagram" mask="instagram.com/##########" v-model="itemValue" autocomplete="off" @keyup="update" />
			<FormKit v-if="typeIndex === 'ok'" type="mask" name="ok" mask="ok.ru/##########" v-model="itemValue" autocomplete="off" @keyup="update" />
		</div>
		<div class="flex items-stretch">
			<Button v-if="indexLast" class="inline-flex items-center bg-second text-white hover:bg-main-light py-2 px-6" @click.prevent="addItem">
				<IconPlus filled class="w-5 h-5" />
			</Button>
			<Button v-else class="inline-flex items-center bg-gray-light text-white hover:bg-red-600 py-2 px-6" @click.prevent="deleteItem">
				<IconTrash filled class="w-5 h-5" />
			</Button>
		</div>
	</div>
</template>

<style scoped>

</style>