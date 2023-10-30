import getSlug from 'speakingurl';

function slugify(text, maxLen = 20) {
  text = text.toLowerCase();
  const nonPunctuationMatcher = new RegExp(`([^0-9A-Za-z\u0430-\u044F ]+)`, "g");
  text = text.replace(nonPunctuationMatcher, "");
  text = text.replace(/\s+/, " ");
  text = getSlug(text, {
    lang: "ru",
    separator: "_",
    maintainCase: false,
    custom: {}
  });
  return text.substring(0, maxLen);
}

export { slugify as s };
