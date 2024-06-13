import { createRouter, createWebHistory } from 'vue-router'
import Login from '/src/components/Login.vue'
import Signup from '/src/components/Signup.vue'
import MainPage from '/src/MainPage.vue'
import HouseDetails from '/src/components/HouseDetails.vue';

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/signup', component: Signup },
    { path: '/main', component: MainPage },
    {
        path: '/details',
        name: 'HouseDetails',
        component: HouseDetails,
        props: route => ({
            title: route.params.title,
            description: route.params.description,
            price: parseInt(route.params.price),
            image: JSON.parse(route.params.image)
        })
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
