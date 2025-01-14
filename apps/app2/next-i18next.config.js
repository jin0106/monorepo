// https://github.com/i18next/next-i18next
// https://www.i18next.com/translation-function/interpolation
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
module.exports = {
  i18n: {
    locales: ['default', 'ko', 'en'],
    defaultLocale: 'default',
    localeDetection: false,
    localeExtension: 'yml'
  },
  localePath: path.resolve('./public/locales')
}
