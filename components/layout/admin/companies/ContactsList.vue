<script setup lang="ts">

import { ContactsType, ContactsTypeNames } from '~/src/data/types/company';
import type {
	TContactsType,
	TContacts,
	TContact,
	TFormkitContactOption
} from '~/src/data/types/company';
import ContactsListItem from '~/components/layout/admin/companies/ContactsListItem.vue';

const props = defineProps({
	contacts: Object
});

defineExpose({getContacts, update});

const contactsList = ref<TContacts>([]);

if (typeof props.contacts !== 'undefined') {
	update(props.contacts as TContacts);
}

const contactsListLength = computed(() => contactsList.value.length - 1);
const contacts = Object(ContactsTypeNames);
const contactsOptions = ref<TFormkitContactOption[]>([]);
const refContacts = ref();

for (const key in contacts) {
	contactsOptions.value.push({
		label: contacts[key],
		value: key as TContactsType,
		attr: {
			default: false
		}
	});
}

function addItem(): void {
	contactsList.value.push({
		id: 0,
		type: ContactsType.phone,
		value: ''
	});
}


function deleteItem(index: number): void {
	contactsList.value[index].isDeleted = true;
	// contactsList.value = contactsList.value.filter((item, idx) => idx !== index);
}

function updateItem(item: TContact, index: number): void {
	contactsList.value[index] = item;
}

function getContacts(): TContacts {
	return (contactsList.value as TContacts).filter(item => item.value.trim() !== '');
}

function update(contacts?: TContacts): void {
	contactsList.value = [];
	if (contacts && contacts.length > 0) {
		contacts.forEach((item: TContact) => {
			contactsList.value.push({
				id: item.id,
				type: item.type,
				value: item.value,
				isDeleted: item.isDeleted
			});
		});
	} else {
		addItem();
	}
	if (refContacts?.value) {
		contactsList.value.forEach((item, index) => {
			refContacts?.value[index]?.updateItem(item);
		})
	}
}

</script>

<template>

	<div v-for="(item, index) in contactsList" :key="index" class="formkit-no-limits">
		<ContactsListItem
			v-if="!item.isDeleted"
			:item="item"
			:index="index"
			:indexLast="(index === contactsListLength)"
			:options="contactsOptions"
			@add="addItem"
			@delete="deleteItem"
			@update="updateItem"
			ref="refContacts"
		/>
	</div>

</template>

<style lang="postcss">
	.formkit-no-limits {
		@apply mb-4;
		.formkit-outer{
			@apply mb-0;
		}
		.formkit-inner {
			@apply mb-0;
		}
	}
</style>