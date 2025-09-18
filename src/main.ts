import { createApp } from 'vue'
import router from './routers'
import store from './stores'

import 'virtual:uno.css'
// 引入 Arco 全量样式（含 css 变量定义），确保变量先注册
import '@arco-design/web-vue/es/style/index.less'
// 自定义全局样式（尽量在 Arco 之后，便于覆盖）
import '@/styles/index.scss'

import App from './App.vue'

const app = createApp(App)
app.use(router).use(store)
app.mount('#app')
