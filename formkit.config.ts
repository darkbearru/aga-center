import { ru } from '@formkit/i18n'
import { defineFormKitConfig } from '@formkit/vue'
import { generateClasses } from '@formkit/themes'
import { genesisIcons } from '@formkit/icons'
import formkitTailwindTheme from './formkit.tailwind.theme'

export default defineFormKitConfig({
	locales: { ru },
	locale: 'ru',
	icons: {
		...genesisIcons,
	},
	config: {
		classes: generateClasses(formkitTailwindTheme),
	},
})

