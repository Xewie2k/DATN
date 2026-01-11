import { createApp } from 'vue'
import App from './App.vue'

// QUAN TRỌNG: Phải trỏ đúng vào file router.js
import router from './router/router'

// Nếu có file css thì import, không thì bỏ qua
// import './style.css'

const app = createApp(App)

app.use(router) // Kích hoạt router
app.mount('#app')
