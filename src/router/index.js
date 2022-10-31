import { createRouter, createWebHashHistory } from "vue-router";
import cookie from "vue-cookies";

import HomeView from "../views/HomeView.vue";
import PaymentView from "../views/PaymentView.vue";
import ProfileView from "../views/ProfileView.vue";
import ProductView from "../views/ProductView.vue";
import StoreView from "../views/StoreView.vue";
import OrdersView from "../views/OrdersView.vue";
import AllOrdersView from "../views/AllOrdersView.vue";
import OrdersPrcView from "../views/OrdersPrcView.vue";
import ThankYouView from "../views/ThankYouView.vue";
import PayPalTYView from "../views/PayPalTYView.vue";
import AdminHomeView from "../views/AdminHomeView.vue";
import AdminUserManView from "../views/AdminUserManView.vue";
import AdminRoleManView from "../views/AdminRoleManView.vue";
import AdminItemManView from "../views/AdminItemManView.vue";
import AdminItemTypeManView from "../views/AdminItemTypeManView.vue";
import AdminToppingManView from "../views/AdminToppingManView.vue";
import AdminOrderManView from "../views/AdminOrderManView.vue";
import AdminStoreManView from "../views/AdminStoreManView.vue";

const routes = [
  {
    path: "/:catchAll(.*)", // Unrecognized path automatically matches 404
    redirect: "/",
  },
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/profile/:type?",
    name: "profile",
    component: ProfileView,
  },
  {
    path: "/product/:category?",
    name: "product",
    component: ProductView,
  },
  {
    path: "/stores",
    name: "stores",
    component: StoreView,
  },
  {
    path: "/payment",
    name: "payment",
    component: PaymentView,
  },
  {
    path: "/orders",
    name: "orders",
    component: OrdersView,
  },
  {
    path: "/ordersPrc",
    name: "ordersPrc",
    component: OrdersPrcView,
  },
  {
    path: "/allOrders",
    name: "allOrders",
    component: AllOrdersView,
  },
  {
    path: "/thankyou",
    name: "thankyou",
    component: ThankYouView,
  },
  {
    path: "/payPalTY/:id",
    name: "payPalTY",
    component: PayPalTYView,
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminHomeView,
    meta: { layout: "admin" },
  },
  {
    path: "/admin/UserManagement",
    name: "userManagement",
    component: AdminUserManView,
    meta: { layout: "admin" },
  },
  {
    path: "/admin/RoleManagement",
    name: "roleManagement",
    component: AdminRoleManView,
    meta: { layout: "admin" },
  },
  {
    path: "/admin/ItemManagement",
    name: "itemManagement",
    component: AdminItemManView,
    meta: { layout: "admin" },
  },
  {
    path: "/admin/ItemTypeManagement",
    name: "itemTypeManagement",
    component: AdminItemTypeManView,
    meta: { layout: "admin" },
  },
  {
    path: "/admin/ToppingManagement",
    name: "toppingManagement",
    component: AdminToppingManView,
    meta: { layout: "admin" },
  },
  {
    path: "/admin/OrderManagement",
    name: "orderManagement",
    component: AdminOrderManView,
    meta: { layout: "admin" },
  },
  {
    path: "/admin/StoreManagement",
    name: "storeManagement",
    component: AdminStoreManView,
    meta: { layout: "admin" },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  var auth = cookie.get("Auth");
  switch (to.name) {
    case "admin":
    case "userManagement":
    case "roleManagement":
    case "itemManagement":
    case "itemTypeManagement":
    case "toppingManagement":
    case "orderManagement":
    case "storeManagement":
      if (auth == "Admin") {
        next();
      } else {
        next("/");
      }
      break;
    case "orders":
    case "ordersPrc":
    case "allOrders":
      if (auth != null && !auth.includes("Customer")) {
        next();
      } else {
        next("/");
      }
      break;
    case "profile":
      if (auth) {
        next();
      } else {
        next("/");
      }
      break;
    case "thankyou":
      if (auth != null && to.query.partnerCode && to.query.orderId) {
        next();
      } else {
        next("/");
      }
      break;
    case "payPalTY":
      if (to.params.id && to.query.token) {
        next();
      } else {
        next("/");
      }
      break;
    case "payment":
      if (auth != null && localStorage.getItem("Cart") != null) {
        next();
      } else {
        next("/");
      }
      break;
    default:
      next();
      break;
  }
});

export default router;
