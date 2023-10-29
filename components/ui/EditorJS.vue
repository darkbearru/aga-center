
<script setup lang="ts">

import LoadingBg from '~/components/ui/LoadingBg.vue';

const loading = ref(true);
let editor;

onMounted(async () => {
		setTimeout(async () => {
/*
			editor = new EditorWrapper();
			editor.init('Укажите описание инициативы', 'editor_js').then(() => {
				console.log('Editor');
				loading.value = false;
			}).catch(() => {
				console.log('Error');
			});
*/
/*
			const Editor = import('@editorjs/editorjs').then(async (script )=> {
				new script.default({
					holder: 'editor_js',//editorRef.value,
					tools: {} // Add your EditorJS tools configuration here
				}).isReady.then(() => {
					loading.value = false;
					console.log('Editor Is Ready')
				})
			})
*/
		}, 100);
});


</script>

<template>
	<div class="relative rounded mb-1 px-3 py-2 bg-white text-base text-gray-700 ring-1 ring-gray-400 focus-within:ring-main focus-within:ring-2 focus-within:text-main">
		<div ref="editor" id="editor_js"></div>
		<LoadingBg v-if="loading" />
	</div>
</template>

<style scoped>

</style>