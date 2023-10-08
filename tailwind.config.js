const FormKitVariants = require('@formkit/themes/tailwindcss')

export default {
	content: [
		'./components/**/*.{js,vue,ts}',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./plugins/**/*.{js,ts}',
		'./nuxt.config.{js,ts}',
		'./formkit.tailwind.theme.js',
	],
	theme: {
		extend: {
			colors: {
				'main': '#025959',
				'main-light': '#04adbf',
				'main-light-2': '#4fc5d2',
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
	plugins: [FormKitVariants],
}
