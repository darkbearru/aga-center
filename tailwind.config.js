export default {
	content: [
		'./components/**/*.{js,vue,ts}',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./plugins/**/*.{js,ts}',
		'./nuxt.config.{js,ts}',
	],
	theme: {
		extend: {
			colors: {
				'main': '#025959',
				'main-light': '#04adbf',
				'second': '#a0a602',
				'gray-light': '#a8a8ad',
				'dark-light': '#52525b',
				'dark-main': '#212121',
			},
		},
		fontFamily: {
			sans: ['Fira Sans', 'sans-serif'],
		},
	},
}
