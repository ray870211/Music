import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import veeValidatePlugin from "./includes/validation";
import { auth } from "./includes/firebase";

let app;

auth.onAuthStateChanged(() => {
  //每當用戶的身份驗證狀態發生變化時，firebase都會發出該事件，至少運行一次
  if (!app) {
    app = createApp(App);
    app.use(createPinia());
    app.use(router);
    app.use(veeValidatePlugin);

    app.mount("#app");
  }
});

import "./assets/base.css";
import "./assets/main.css";
