import { createApp } from 'vue'
import UUID from 'vue3-uuid'
import i18n from './i18n'
import App from './App.vue'
import '@/scss/styles.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'

createApp(App)
    .use(UUID)
    .use(i18n)
    .mount('#app')
