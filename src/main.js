import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from "./plugins/axios.js";
import VueCookies  from 'vue-cookies';
import mitt from "mitt";
import userLayout from './layout/userLayout.vue';
import adminLayout from './layout/adminLayout.vue';
import 'bootstrap-icons/font/bootstrap-icons';
import 'bootstrap-icons/font/bootstrap-icons.css';
import modalLogin from './components/ModalLogin.vue';
import modalConfirm from './components/ModalConfirm.vue';
import PaginationList from "./components/PaginationList.vue";
import VueGoogleMaps from '@fawmi/vue-google-maps'

const app = createApp(App);
app.config.globalProperties.$mainAxios = axios.mainAxios;
app.config.globalProperties.$customAxios = axios.customAxios;
app.config.globalProperties.$mitt = mitt();

// axios.interceptors.response.use(
//     function (response) {
//       return response;
//     },
//     async function (error) {
//         switch (error.response.status) {
//         // case 400:
//         //   console.log(error.response);
//         //   break;
//         case 401:
//             break;
//         case 403:
//             break;
//         case 500:
//           break;
//         default:
//           break;
//       }
//       return Promise.reject(error);
//     }
//   );

app.use(router);
app.use(VueCookies);
app.use(VueGoogleMaps, {
  load: {
      key: 'AIzaSyBo2aJzl7bLF3AYG5maLqRL7pk-HcutXNg',
      language: 'vi',
      libraries: "places",
      region: 'VN'
  },
});
app.component("modal-login", modalLogin);
app.component("modal-confirm", modalConfirm);
app.component("default-layout",userLayout);
app.component("admin-layout",adminLayout);
app.component("pagination-list", PaginationList);
app.mount('#app');