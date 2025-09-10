import { createApp } from 'vue'
import router from './routers'
import store from './stores'

import 'virtual:uno.css'
import '@/styles/index.scss'

import App from './App.vue'

const app = createApp(App)
app.use(router).use(store)
app.mount('#app')