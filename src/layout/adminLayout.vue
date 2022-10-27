<template>
  <div class="admin-nav">
    <i class="bi bi-list" @click="showMenu = !showMenu"></i>
    <div class="admin-nav-element" :class="showMenu ? 'displayBlock' : ''">
      <span class="backdrop" @click="showMenu = false"></span>
      <div class="admin-nav-list">
        <div class="close" @click="showMenu = false">
          <i
            class="bi form-control-feedback bi-x-lg"
            style="font-size: 22px"
          ></i>
        </div>
        <ul>
          <li @click="changeRoute('home'), (showMenu = false)">
            <router-link to="/">
              <img src="../assets/Images/Icon/CorgiCoffee.png" />
            </router-link>
          </li>
          <li @click="changeRoute('admin'), (showMenu = false)">
            <router-link to="/admin">
              <i class="bi bi-graph-up bi-margin-right"></i>
              Dashboard</router-link
            >
          </li>
          <li @click="changeRoute('userManagement'), (showMenu = false)">
            <router-link to="/admin/UserManagement">
              <i class="bi bi-person-lines-fill bi-margin-right"></i>User
              Management</router-link
            >
          </li>
          <li @click="changeRoute('roleManagement'), (showMenu = false)">
            <router-link to="/admin/RoleManagement" style="position: relative"
              ><i class="bi bi-person-fill bi-margin-right"></i>Role
              Management</router-link
            >
          </li>
          <li @click="changeRoute('itemManagement'), (showMenu = false)">
            <router-link to="/admin/ItemManagement"
              ><i class="bi bi-box-seam bi-margin-right"></i>Item
              Management</router-link
            >
          </li>
          <li @click="changeRoute('itemTypeManagement'), (showMenu = false)">
            <router-link to="/admin/ItemTypeManagement"
              ><i class="bi bi-boxes bi-margin-right"></i>Type
              Management</router-link
            >
          </li>
          <li @click="changeRoute('toppingManagement'), (showMenu = false)">
            <router-link to="/admin/ToppingManagement"
              ><i class="bi bi-collection bi-margin-right"></i>Topping
              Management</router-link
            >
          </li>
          <li @click="changeRoute('orderManagement'), (showMenu = false)">
            <router-link to="/admin/OrderManagement"
              ><i class="bi bi-receipt-cutoff bi-margin-right"></i>Order
              Management</router-link
            >
          </li>
          <li @click="changeRoute('storeManagement'), (showMenu = false)">
            <router-link to="/admin/StoreManagement"
              ><i class="bi bi-shop-window bi-margin-right"></i>Store
              Management</router-link
            >
          </li>
          <li @click="changeRoute('profile')">
            <router-link to="/profile"
              ><i class="bi bi-person-badge-fill bi-margin-right"></i
              >Profile</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showMenu: false,
    };
  },
  methods: {
    changeRoute(value) {
      this.$router.push({ name: value });
    },
  },
};
</script>

<style scoped>
.admin-nav {
  position: fixed;
  height: 100%;
  width: 244px;
  z-index: 3;
  background: white;
  box-shadow: 0 0px 10px 4px rgb(204, 204, 204);
}

.backdrop {
  display: none;
}

.close {
  display: none;
}

.admin-nav-element {
  cursor: pointer;
  margin-top: 30px;
  height: calc(100% - 30px);
}

.admin-nav > i {
  display: none;
  cursor: pointer;
}

.admin-nav-list {
  height: 100%;
}

.admin-nav ul {
  list-style: none;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.admin-nav ul li img {
  width: 100%;
}

.admin-nav ul li {
  font-size: 18px;
  padding: 20px 10px;
  margin: 0px 14px;
  text-align: left;
  cursor: pointer;
  border-radius: 10px;
  border-top-right-radius: 38px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.admin-nav ul li:last-child {
  margin-top: auto;
  margin-bottom: 10px;
}

/* .admin-nav ul li:last-child {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 28px);
  width: 94%;
  margin: 0;
  padding: 20px 10px;
  border-radius: 18px;
} */

.admin-nav ul li:not(:first-child):hover {
  background-color: #ff9f68;
}

.admin-nav ul li:hover a {
  color: white;
}

.admin-nav ul li a {
  color: black;
  text-decoration: none;
}

.admin-nav ul li a.router-link-exact-active,
.admin-nav ul li a.router-link-exact-active i::before {
  color: #e98a1c;
  font-weight: 600 !important;
}

.bi-margin-right {
  margin-right: 12px;
}

.bi-person-fill::after {
  content: "\f3e4";
  display: inline-block;
  font-family: bootstrap-icons !important;
  font-style: normal;
  font-weight: normal !important;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: -0.125em;
  -webkit-font-smoothing: antialiased;
  position: absolute;
  top: -3px;
  left: -4px;
  font-size: 26px;
}

@media screen and (max-width: 1140px) {
  .admin-nav {
    width: 190px;
  }
  .admin-nav ul li {
    line-height: 30px;
  }
}

@media screen and (max-width: 992px) {
  .admin-nav {
    width: 100%;
    height: 52px;
    text-align: left;
  }
  .admin-nav ul li img {
    width: 200px;
  }
  .admin-nav-element {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
    display: none;
    margin-top: 0;
    height: 100%;
  }
  .backdrop {
    background: rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    display: block;
  }
  .admin-nav > i {
    display: block;
  }
  .admin-nav > i {
    font-size: 36px;
    position: absolute;
    transform: translateY(10%);
    left: 26px;
    cursor: pointer;
  }
  .admin-nav-list {
    position: fixed;
    width: 50vw;
    height: 100vh;
    z-index: 3;
  }
  .admin-nav ul {
    margin: 0;
    background-color: white;
    width: 100%;
    height: 100%;
    /* margin-left: 6px; */
    border: 2px solid black;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    padding: 40px 0;
    animation: fadeIn 0.25s linear;
  }
  .close {
    position: absolute;
    top: 0;
    right: 0;
    padding: 12px;
    cursor: pointer;
    font-size: 20px;
    display: block;
    animation: fadeIn 0.25s linear;
  }
  .displayBlock {
    display: block !important;
  }
  @keyframes fadeIn {
    0% {
      transform: translateX(-40px);
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @media screen and (max-width: 560px) {
    .admin-nav-list {
      width: 56vw;
      height: 100vh;
    }
  }
  @media screen and (max-width: 480px) {
    .admin-nav-list {
      width: 80vw;
      height: 100vh;
    }
  }
  @media screen and (max-width: 320px) {
    .admin-nav-list {
      width: 100vw;
      height: 100vh;
    }
    .admin-nav ul {
      border-radius: 0px;
    }
    .admin-nav ul li {
      font-size: 15px;
    }
    .bi-person-fill::after {
      font-size: 23px;
    }
  }
}
</style>