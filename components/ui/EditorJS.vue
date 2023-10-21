
<script setup lang="ts">

import LoadingBg from '~/components/ui/LoadingBg.vue';

const loading = ref(true);

onMounted(async () => {
		setTimeout(async () => {
			const Editor = import('@editorjs/editorjs').then(async (script )=> {
				new script.default({
					holder: 'editor_js',//editorRef.value,
					tools: {} // Add your EditorJS tools configuration here
				}).isReady.then(() => {
					loading.value = false;
					console.log('Editor Is Ready')
				})
			})
		}, 100);
});


</script>

<template>
	<div class="relative">
		<div ref="editor" id="editor_js"></div>
		<LoadingBg v-if="loading" />
	</div>
</template>

<style scoped>

</style>