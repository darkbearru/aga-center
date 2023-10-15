import { ru } from '@formkit/i18n'
import { defineFormKitConfig } from '@formkit/vue'
import { generateClasses } from '@formkit/themes'
import { genesisIcons } from '@formkit/icons'
import formkitTailwindTheme from './formkit.tailwind.theme'
import { createProPlugin, rating, toggle, mask } from '@formkit/pro'

const proPlugin = createProPlugin('fk-2b575b1e3', {
	rating, toggle, mask
})

export default defineFormKitConfig({
	locales: { ru },
	locale: 'ru',
	icons: {
		...genesisIcons,
	},
	config: {
		classes: generateClasses(formkitTailwindTheme),
	},
	plugins: [proPlugin],
})

