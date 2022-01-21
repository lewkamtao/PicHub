import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/css/reset.scss'
import './assets/css/main.scss'
import './assets/css/fancybox.css'

const app = createApp(App)

app.use(router)
app.mount('#app')
 