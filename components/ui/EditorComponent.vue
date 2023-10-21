<template>
	<div ref="editor"></div>
</template>

<script lang="ts">
import EditorJS from '@editorjs/editorjs';

export default defineComponent({
	setup() {
		const editor = ref(null)

		onMounted(() => {
			if (editor.value) {
				new EditorJS({
					holder: editor.value,
					// Your EditorJS configuration options
				})
			}
		})

		return { editor }
	}
})
</script>
