<script setup lang="ts">

import Button from '~/components/ui/Button.vue';
import IconSearch from 'assets/svg/icon-search.svg';
</script>

<template>
	<div class="search-block-container">
		<div class="search-block">
			<nav>
				<a href="" class="selected">Отдых</a>
				<a href="">Бизнес</a>
			</nav>
			<div class="flex sm:gap-x-4 order-1 sm:order-2 w-full">
				<input type="text" />
				<Button class="btn-main"><IconSearch filled /><span>Найти</span></Button>
			</div>
		</div>
	</div>
</template>

<style scoped lang="postcss">
	.search-block-container {
		@apply absolute w-full h-20 bottom-4 sm:bottom-8 z-20;
	}
	.search-block {
		@apply flex flex-wrap sm:flex-nowrap items-center justify-center sm:gap-x-4 w-10/12 h-20 drop-shadow-md sm:bg-white sm:pr-8 max-w-screen-xl mx-auto my-0;
		nav {
			@apply flex content-stretch w-10/12 sm:w-auto sm:h-full order-2 sm:order-1;
			a {
				@apply flex items-center justify-center w-6/12 sm:w-auto h-8 sm:h-full px-4 sm:px-8 text-base sm:text-lg font-bold text-main text-center bg-white;
				&.selected {
					@apply sm:px-8 bg-main-light text-white;
				}
				&:last-child {
					@apply sm:pr-4;
				}
			}
		}
		input {
			@apply grow w-full h-12 p-4 rounded-l-sm rounded-r-none sm:rounded-sm border border-main-light sm:border-gray-light text-lg accent-gray-light;
			&:focus {
				outline: none;
				@apply border-main;
			}
			&:focus + button {
				@apply bg-main;
			}
		}
	}
	.btn-main {
		@apply flex items-center bg-main-light h-12 text-lg rounded-l-none sm:rounded-l-sm  text-white hover:bg-main;
		svg {
			@apply block text-white w-6 h-6 sm:pr-1 m-0;
		}
		span {
			@apply hidden sm:inline;
		}
	}
</style>