import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import '../node_modules/flowbite-vue/dist/index.css'
import './assets/global.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// TODO:
// 1. Create a dynamic progress bar [Done]
// 2. Fix logic to swipe delete event
// 3. Add modal section to edit item bill [Done]
// 4. Increase camera resolution [Done]
// 5. Add loading page after scanning / uploading bill image
// 6. Responsive design for phone view
// 7. Styling the final page
// 8. Handle assign item modal to user
