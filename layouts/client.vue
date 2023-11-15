<script lang="ts" setup>
import Menu from '~/components/layout/admin/Menu.vue';
import { useData } from '~/components/stores/useData';

const data = useData();
await data.get().then(() => {}).catch(() => {
	console.log('Data read error');
});

const menuToggle = ref<boolean>(false);

watch(menuToggle, (value) => {
	if (value) {
		document.body.classList.add('is-menu-open');
	} else {
		document.body.classList.remove('is-menu-open');
	}
});

</script>

<template>
  <div class="sm:flex bg-white items-stretch">
	  <aside class="relative h-[4.5rem] sm:h-auto z-[100] sm:z-auto bg-main transition-{height} ease-in-out duration-300">
		  <img class="absolute top-1.5 left-2 w-24 h-16 transition-{left} ease-in-out duration-300 sm:hidden" src="/images/logo-white.svg" alt="АГА. Тур-центр. Логотип"/>
		  <input type="checkbox" class="menu-check-box sm:hidden" v-model="menuToggle">
		  <a href="#" class="menu-burger sm:hidden">
			  <span class="line"></span>
			  <span class="line"></span>
			  <span class="line"></span>
		  </a>
		  <div class="absolute sm:sticky sm:block sm:top-0 w-full sm:w-[200px] md:w-[320px] -left-[640px] sm:left-auto transition-{left} ease-in-out duration-300 p-8 bg-main sm:h-screen">
			  <div class=""><img src="/images/logo-white.svg" alt="АГА. Тур-центр. Логотип"/></div>
			  <div v-if="data.menu">
				  <Menu :menu="data.menu" />
			  </div>
		  </div>
	  </aside>
	  <main class="sm:grow p-2 sm:p-6">
		  <NuxtPage :data="data"/>
	  </main>
  </div>
</template>

<style lang="postcss">
@media (max-width: 639px) {
	.is-menu-open {
		@apply fixed w-screen h-screen overflow-hidden;
	}
	.is-menu-open aside {
		@apply fixed w-screen h-screen overflow-y-scroll;
		& > img {
			@apply -left-32;
		}
	}
	.menu-check-box {
		@apply absolute z-[110] opacity-0 right-4 top-4 w-12 h-10 border-none ring-0 cursor-pointer;
		&:checked + .menu-burger {
			.line:nth-child(1) {
				@apply translate-y-3 rotate-45
			}
			.line:nth-child(2) {
				@apply opacity-0;
			}
			.line:nth-child(3) {
				@apply -translate-y-3 -rotate-45
			}
		}
		&:checked + .menu-burger + div {
			@apply left-0;
		}
	}
	.menu-burger {
		@apply block absolute z-[105] right-4 top-4 w-12 h-10;
		.line {
			@apply block bg-white w-full h-1 my-2 mx-auto transition-all duration-300;
		}
	}
}
</style>