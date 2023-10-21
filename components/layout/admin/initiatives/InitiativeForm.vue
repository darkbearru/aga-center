<script setup lang="ts">

import EditorJS from '~/components/ui/EditorJS.vue';

const inputID = ref(0);
const inputName = ref('');

onMounted(() => {
	console.log('Mounted');
})
</script>

<template>
	<div class="max-w-[600px] formkit-w-full">
		<FormKit
			id="companies_form"
			type="form"
			:submit-label="inputID ? 'Сохранить' : 'Добавить'"
			:config="{ validationVisibility: 'submit' }"
			@submit=""
		>
			<FormKit
				type="text"
				name="name"
				id="name"
				label="Наименование"
				placeholder="Наименование инициативы"
				v-model="inputName"
				validation="required|length:3|contains_alpha_spaces"
				:validation-messages="{
          initiative_exists: 'Указанная компания уже существует',
          length: 'Длина наименование должна быть не менее 3 символов',
          required: 'Необходимо указать юридическое наименование компании',
          name: 'Наименование должно состоять из букв и пробелов'
        }"
			/>

			<client-only>
				<EditorJS />
			</client-only>
		</FormKit>
	</div>

</template>


<style scoped>

</style>