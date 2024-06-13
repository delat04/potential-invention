import { createApp } from 'vue'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import App from './App.vue'
import router from '../router' // Import the router

const app = createApp(App)
app.use(router) // Use the router
app.mount('#app')
