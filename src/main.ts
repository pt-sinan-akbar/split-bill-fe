import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import '../node_modules/flowbite-vue/dist/index.css'
import './assets/global.css'
import { createHead } from '@unhead/vue/client'

const app = createApp(App)
const head = createHead()

app.use(createPinia())
app.use(router)
app.use(head)

app.mount('#app')
