<script setup lang="ts">
import NewsList from '~/components/layout/admin/news/NewsList.vue';
import Button from '~/components/ui/Button.vue';
import IconUserPlus from 'assets/svg/icon-user-plus.svg';
import Popup from '~/components/ui/Popup.vue';
import PopupContainer from '~/components/ui/PopupContainer.vue';
import { useData } from '~/components/stores/useData';
import { setErrors } from '@formkit/core';
import { slugify } from '~/src/utils/slugify';
import type { TNews } from '~/src/data/types/news';

const titlePopup = ref('Добавить новость')
const popup = ref();
const inputTitle = ref<String>('');
const inputSlug = ref<String>('');
const inputText = ref<String>('');
const inputDate = ref<String>('');
const inputActive = ref<Boolean>(false);
const inputId = ref<Number | undefined>(undefined);
const userData = useData();
const newsList = ref();

const popupOpen = (item?: TNews): void => {
	titlePopup.value = 'Добавить новость';
	if (item?.id) {
		titlePopup.value = 'Изменение новости';
		inputTitle.value = item?.title || '';
		inputSlug.value = item?.slug || '';
		inputText.value = item?.text || '';
		inputDate.value = item?.date.toString() || '';
		inputActive.value = item?.active || false;
		inputId.value = item?.id || undefined;
	}
	popup.value.show();
	clearErrors('news_form');
}

const popupClose = (): void => {
	popup.value.hide();
	inputTitle.value = '';
	inputSlug.value = '';
	inputText.value = '';
	inputDate.value = '';
	inputActive.value = false;
	inputId.value = undefined;
}

const popupSubmit = async (): Promise<void> => {
	const date = inputDate.value.split('-');
	userData.updateNews({
		id: inputId.value as number || undefined,
		title: inputTitle.value as string,
		slug: inputSlug.value as string,
		active: inputActive.value as boolean,
		text: inputText.value as string || null,
		date: date.length >= 3 ? new Date(parseInt(date[0]), parseInt(date[1]), parseInt(date[2])) : new Date(),
	}).then((result) => {
		if (result) {
			if (result?.errors) return setErrors('news_form', [], result.errors);
			newsList.value.update();
			popupClose();
		}
	}).catch((error) => {
		console.log(error);
	});
}

const deleteNews = async (news: TNews): Promise<void> => {
	await userData.deleteNews(news).then(() => newsList.value.update());
}

const createSlug = () => {
	inputSlug.value = slugify(inputTitle.value as string, 50);
}

</script>

<template>
	<div class="w-12/12 min-w-[300px]">
		<div class="w-full text-center">
			<Button class="inline-flex items-center bg-main text-white hover:bg-main-light py-3 px-6 w-auto mx-auto mb-8"
			        title="Добавить новость" @click="popupOpen">
				<IconUserPlus class="block text-white w-6 h-6 mr-2" filled/>
				<span class="hidden md:inline">Добавление новости</span>
			</Button>
		</div>

		<NewsList @click="popupOpen" @delete="deleteNews" ref="newsList" />

		<PopupContainer ref="popup" @close="popupClose">
			<Popup class="bg-gray-light/60 w-full min-w-[300px] max-w-[800px] max-h-full pb-0 formkit-w-full" :title="titlePopup" @close="popupClose">
				<FormKit
					id="news_form"
					type="form"
					:submit-label="inputId ? 'Сохранить' : 'Добавить'"
					:config="{ validationVisibility: 'submit' }"
					@submit="popupSubmit"
				>
					<FormKit
						type="text"
						name="name"
						id="name"
						label="Заголовок"
						placeholder="Заголовок новости"
						v-model="inputTitle"
						@keyup="createSlug"
						validation="required|length:8"
						:validation-messages="{
	              news_exists: 'Новость с данным заголовком уже существует',
	              length: 'Длина заголовка должна быть не менее 8 символов',
	              required: 'Необходимо указать заголовок новости',
	              name: 'Наименование должно состоять из букв и пробелов'
	            }"
					/>
					<FormKit
						type="text"
						name="slug"
						id="slug"
						label="Идентификатор"
						placeholder="name_url_slug"
						v-model="inputSlug"
						validation="required|length:3|matches:/[0-9a-z_]/"
						:validation-messages="{
	              length: 'Длина Идентификатора должна быть не менее 5 символов',
	              required: 'Необходимо указать Идентификатор',
	              matches: 'В написании Идентификатора допустимо использование символов английского алфавита и нижнего подчеркивания'
	            }"
					/>
					<FormKit
						type="textarea"
						name="text"
						id="text"
						label="Текст"
						placeholder="Текст новости"
						v-model="inputText"
						validation="required|length:15"
						:validation-messages="{
	              length: 'Длина текста новости должна быть не менее 15 символов',
	              required: 'Необходимо указать текст новости'
            }"
					/>
					<FormKit
						type="date"
						label="Дата"
						v-model="inputDate"
						validation="required|date_after:2023-10-01"
						:validation-messages="{
	              required: 'Необходимо указать дату выхода новости',
	              date_after: 'Дата должна быть не раньше 01 октября 2023'
            }"
					/>
					<FormKit type="checkbox" name="isActive" id="isActive" label="Отображение новости на сайте" v-model="inputActive"/>
				</FormKit>
			</Popup>
		</PopupContainer>
	</div>

</template>

<style scoped>
</style>