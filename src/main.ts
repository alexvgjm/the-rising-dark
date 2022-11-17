import { createApp } from 'vue'
import './styles/main.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";
import BuildingPanel from './panels/BuildingPanel.vue';
import DemonsPanel from './panels/DemonsPanel.vue';
import SettingsPanel from './panels/SettingsPanel.vue';

const routes: RouteRecordRaw[] = [
    {path: '/', component: BuildingPanel},
    {path: '/demons', component: DemonsPanel},
    {path: '/settings', component: SettingsPanel}
]

// Router
const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
    linkActiveClass: 'main-nav__link--active'
})


const app = createApp(App)
            .use(router)
            .use(createPinia())
            .provide('version', '0.0.015')
            .mount('#app')