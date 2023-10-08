import getSlug from 'speakingurl';
export function slugify(text: string, maxLen: number = 20): string {
	text = text.toLowerCase();
	// Убираем знаки пунктуации
	const nonPunctuationMatcher = new RegExp(`([^0-9A-Za-zа-я ]+)`, 'g');
	text = text.replace(nonPunctuationMatcher, '');
	// Убираем дублирование пробелов
	text = text.replace(/\s+/, ' ');
	text = getSlug(text, {
		lang: 'ru',
		separator: '_',
		maintainCase: false,
		custom: {}
	});
	return text.substring(0, maxLen);
}