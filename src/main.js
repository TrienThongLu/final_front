import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "./plugins/axios.js";
import VueCookies from "vue-cookies";
import mitt from "mitt";
import userLayout from "./layout/userLayout.vue";
import adminLayout from "./layout/adminLayout.vue";
import "bootstrap-icons/font/bootstrap-icons";
import "bootstrap-icons/font/bootstrap-icons.css";
import modalLogin from "./components/ModalLogin.vue";
import modalConfirm from "./components/ModalConfirm.vue";
import PaginationList from "./components/PaginationList.vue";
import VueGoogleMaps from "@fawmi/vue-google-maps";

const app = createApp(App);
app.config.globalProperties.$mainAxios = axios.mainAxios;
app.config.globalProperties.$customAxios = axios.customAxios;
app.config.globalProperties.$mitt = mitt();

app.use(router);
app.use(VueCookies);
app.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyCjNQyaPdELQKIOgMbMSEmgFNP48C4NEQE",
    language: "vi",
    libraries: "places",
    region: "VN",
  },
});

axios.mainAxios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    switch (error.response.status) {
      case 401:
      case 403:
        // VueCookies.VueCookies.remove("UserId");
        // VueCookies.VueCookies.remove("Token");
        // VueCookies.VueCookies.remove("Auth");
        // VueCookies.VueCookies.remove("StoreId");
        app.$cookies.remove("UserId");
        app.$cookies.remove("Token");
        app.$cookies.remove("Auth");
        app.$cookies.remove("StoreId");
        router.push({ name: "home" });
        break;
      case 500:
        break;
      default:
        break;
    }
    return Promise.reject(error);
  }
);

app.component("modal-login", modalLogin);
app.component("modal-confirm", modalConfirm);
app.component("default-layout", userLayout);
app.component("admin-layout", adminLayout);
app.component("pagination-list", PaginationList);
app.mount("#app");
