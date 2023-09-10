<script setup lang="ts">

</script>

<template>
	<footer class="bg-second">
		<slot />
		<div class="relative">
			<div class="clouds">
				<div class="forest"></div>
			</div>
		</div>
		<div class="footer">
			<div class="logo"><img src="/images/logo-white.svg" alt="АГА. Тур-центр. Логотип"/></div>
		</div>
	</footer>
</template>

<style scoped lang="postcss">
	.clouds {
		@apply relative w-full h-[130px] left-0 bottom-0;
		background: url('/images/footer_clouds.svg') repeat-x left top;
	}
	.forest {
		@apply absolute w-full h-[110px] left-0 bottom-0;
		background: url('/images/forest_bg.svg') repeat-x left top;
	}
	.footer {
		@apply relative bg-main-light p-8;
	}
	.logo {
		@apply absolute w-[120px] top-[-32px] z-10;
	}
</style>