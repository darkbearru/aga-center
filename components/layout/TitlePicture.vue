<script setup lang="ts">

import SearchBlock from '~/components/layout/SearchBlock.vue';

const img = useImage();
</script>

<template>
	<div class="relative h-[200px] md:top-[-100px] md:h-[550px]">
		<div class="relative h-[200px] md:h-[650px] overflow-x-hidden">
			<NuxtImg
				class="relative h-[200px] lg:h-[630px] left-0 z-0 max-w-none"
				src="/images/hills_and_sky.jpg"
				aspect="42/9"
				format="webp"
				quality="85"
				sizes="xs:1400 sm:2800 md:3733 lg:4667 xl:5880"
				loading="lazy"
				:placeholder="img(`/images/hills_and_sky.jpg`, {fit: 'contain', format: 'webp', height: 50, blur: 3, quality: 50 })"
			/>
			<div class="title-footer"></div>
			<SearchBlock/>
		</div>
	</div>
</template>

<style scoped lang="postcss">
.title-footer {
	@apply absolute hidden md:block w-full h-[102px] z-10 bottom-0 left-0;
	background: url('/images/clouds_bottom.svg') repeat-x left top;
}

</style>