import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {useConfig} from "./core/config";
import {createAppRouter} from "./core/router"
import {loadTheme} from "./themes/loader.ts";
import 'virtual:uno.css'

const app = createApp(App)

if(import.meta.env.DEV) {
    console.log("配置加载成功:",useConfig())
}

loadTheme().then(async () => {
    const router = await createAppRouter()
    app.use(router)
    app.mount('#app')
})
