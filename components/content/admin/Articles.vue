<script setup lang="ts">

import type { TArticle, TArticleFormData } from '~/src/data/types/articles';
import type { TPhotos } from '~/src/data/types/photos';
import { useData } from '~/components/stores/useData';
import { setErrors } from '@formkit/core';
import { slugify } from '~/src/utils/slugify';
import ArticlesList from '~/components/content/admin/articles/ArticlesList.vue';
import Button from '~/components/ui/Button.vue';
import IconUserPlus from 'assets/svg/icon-user-plus.svg';
import Popup from '~/components/ui/Popup.vue';
import PopupContainer from '~/components/ui/PopupContainer.vue';
import PhotosList from '~/components/content/admin/photos/PhotosList.vue';

const titlePopup = ref('Добавить статью')
const popup = ref();
const inputTitle = ref<String>('');
const inputSlug = ref<String>('');
const inputText = ref<String>('');
const inputActive = ref<Boolean>(false);
const inputId = ref<Number | undefined>(undefined);
const userData = useData();
const articlesList = ref();
const inputPhotos = ref<TPhotos>([]);
const photosList = ref();
const inputPhoto = ref('');
const currentArticle = ref<TArticle>();


type TFilesList = {
	name: string,
	file: File
}[];


const popupOpen = (item?: TArticle): void => {
	titlePopup.value = 'Добавить статью';
	currentArticle.value = item;
	if (item?.id) {
		titlePopup.value = 'Изменение статью';
		inputTitle.value = item?.title || '';
		inputSlug.value = item?.slug || '';
		inputText.value = item?.text || '';
		inputActive.value = item?.active || false;
		inputId.value = item?.id || undefined;
		photosList.value?.update(item?.photos || []);
		inputPhotos.value = item?.photos || [];
	}
	popup.value.show();
	clearErrors('articles_form');
}

const popupClose = (): void => {
	popup.value.hide();
	inputTitle.value = '';
	inputSlug.value = '';
	inputText.value = '';
	inputActive.value = false;
	inputId.value = undefined;
}

const popupSubmit = async (data: Record<string, string | TFilesList>): Promise<void> => {

	let body: FormData | TArticleFormData;

	if (data.photos.length) {
		body = new FormData();
		for (const key in data) {
			if (key === 'photos') {
				if (data[key].length) {
					(data[key] as TFilesList)?.forEach((fileItem) => {
						(body as FormData).append('photos', fileItem.file);
					});
				}
			} else {
				switch (key) {
					case 'title' : {
						body.append(key, (inputTitle.value || data[key]).toString());
						break;
					}
					case 'text' : {
						body.append(key, (inputText?.value || data[key]).toString());
						break;
					}
					case 'slug' : {
						body.append(key, (inputSlug?.value || data[key]).toString());
						break;
					}
					default : {
						body.append(key, data[key] as string);
					}
				}
			}
		}
		body.append('id', inputId.value?.toString() || '0');
		body.append('photosList', inputPhotos.value.length ? JSON.stringify(inputPhotos.value) : '');
	} else {
		body = {
			id: inputId.value?.toString() || '0',
			title: data.title.toString(),
			text: data.text.toString(),
			slug: data.slug.toString(),
			active: data.active.toString(),
			photos: unref(inputPhotos),
		}
	}
	userData.updateArticle(body).then((result) => {
		if (result) {
			if (result?.errors) return setErrors('articles_form', [], result.errors);
			articlesList.value.update();
			popupClose();
		}
	}).catch((error) => {
		console.log(error);
	});
}

const deleteArticle = async (article: TArticle): Promise<void> => {
	await userData.deleteArticle(article).then(() => articlesList.value.update());
}

const createSlug = () => {
	inputSlug.value = slugify(inputTitle.value as string, 50);
}

</script>

<template>
	<div class="w-12/12 min-w-[300px]">
		<div class="w-full text-center">
			<Button class="inline-flex items-center bg-main text-white hover:bg-main-light py-3 px-6 w-auto mx-auto mb-8"
			        title="Добавить статью" @click="popupOpen">
				<IconUserPlus class="block text-white w-6 h-6 mr-2" filled/>
				<span class="hidden md:inline">Добавление статьи</span>
			</Button>
		</div>

		<ArticlesList @click="popupOpen" @delete="deleteArticle" ref="articlesList"/>

		<PopupContainer ref="popup" @close="popupClose">
			<Popup class="bg-gray-light/60 w-full min-w-[300px] max-w-[800px] max-h-full pb-0 formkit-w-full"
			       :title="titlePopup" @close="popupClose">
				<FormKit
				id="articles_form"
				type="form"
				:submit-label="inputId ? 'Сохранить' : 'Добавить'"
				:config="{ validationVisibility: 'submit' }"
				@submit="popupSubmit"
				>
					<FormKit
					type="text"
					name="title"
					id="title"
					label="Заголовок"
					placeholder="Заголовок статьи"
					v-model="inputTitle"
					@keyup="createSlug"
					validation="required|length:8"
					:validation-messages="{
	              news_exists: 'Статья с данным заголовком уже существует',
	              length: 'Длина заголовка должна быть не менее 8 символов',
	              required: 'Необходимо указать заголовок статьи',
	              title: 'Заголовок должен состоять из букв и пробелов'
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
					placeholder="Текст статьи"
					rows="15"
					v-model="inputText"
					validation="required|length:15"
					:validation-messages="{
	              length: 'Длина текста статьи должна быть не менее 15 символов',
	              required: 'Необходимо указать текст статьи'
            }"
					/>
					<FormKit type="checkbox" name="active" id="active" label="Отображение статьи на сайте"
					         v-model="inputActive"/>
					<FormKit
					type="file"
					name="photos"
					label="Фотографии"
					accept=".jpg,.gif,.png,.jpeg,.webp,.svg"
					multiple="true"
					v-model="inputPhoto"
					/>
					<PhotosList :photos="inputPhotos" ref="photosList"/>
				</FormKit>
			</Popup>
		</PopupContainer>
	</div>

</template>

<style scoped>
</style>