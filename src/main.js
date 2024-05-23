import "./assets/main.scss";

import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import locale from "element-plus/dist/locale/zh-cn.js";
import { createPinia } from "pinia";
import { createPersistedState } from "pinia-persistedstate-plugin";
import router from "@/router";
import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia();
const persistedState = createPersistedState();
pinia.use(persistedState);
app.use(ElementPlus, { locale });
app.use(pinia);
app.use(router);
app.mount("#app");
