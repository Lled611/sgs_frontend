import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ru from './locales/ru.json'

function loadLocaleMessage() {
    const locales = [{en: en}, {ru: ru}]
    const messages = {}
    locales.forEach(lang => {
        const key = Object.keys(lang)
        messages[key] = lang[key]
    })
    return messages
}

export default createI18n({
    legacy: false,
    locale: 'ru',
    fallbackLocale: 'en',
    messages: loadLocaleMessage()
})
