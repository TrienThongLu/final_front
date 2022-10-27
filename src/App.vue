<template>
  <div class="body" :class="layout == 'admin-layout' ? 'body-no-top' : ''">
    <div v-if="layout != 'admin-layout'">
      <component :is="layout"> </component>
      <router-view />
      <footer-component />
    </div>
    <div v-else>
      <!-- <component :is="'default-layout'"> </component> -->
      <component :is="layout"> </component>
      <div style="height: 53px" v-if="screenWidth < 992"></div>
      <span v-else style="display: none"></span>
      <router-view />
    </div>
    <div
      style="height: 56px"
      v-if="screenWidth < 992 && layout != 'admin-layout'"
    ></div>
    <span v-else style="display: none"></span>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import footerComponent from "./layout/footer.vue";
import "@fontsource/arimo";

const defaultLayout = "default";
export default {
  components: {
    footerComponent,
  },
  computed: {
    layout() {
      const { currentRoute } = useRouter();
      return `${currentRoute.value.meta.layout || defaultLayout}-layout`;
    },
  },
  data() {
    return {
      screenWidth: window.innerWidth,
    };
  },
  methods: {
    pcResized() {
      this.screenWidth = window.innerWidth;
    },
  },
  created() {
    window.addEventListener("resize", this.pcResized);
  },
  unmounted() {
    window.removeEventListener("resize", this.pcResized);
  },
  mounted() {
    var token = this.$cookies.get("Token");
    if (token) {
      this.$mainAxios.defaults.headers["Authorization"] = `Bearer ${token}`;
    }
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  /* background: #000 !important;
  color: #0f0 !important;
  outline: solid #f00 1px !important; */
}

:root {
  --headerHeight: 72px;
}

#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  font-family: "Arimo";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.body {
  position: relative;
  top: var(--headerHeight);
}

.body-no-top {
  top: 0;
  width: 100vw;
  height: 100vh;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.pac-container {
  max-height: 410px;
  overflow: auto;
}

.pac-container::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

.pac-container::-webkit-scrollbar {
  width: 6px;
  background-color: #f5f5f5;
}

.pac-container::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}

.pac-logo:after {
  content: unset;
}
.pac-item {
  padding: 10px 8px;
  white-space: unset;
  font-size: 14px !important;
  cursor: pointer;
}

@media screen and (max-width: 992px) {
  .body {
    top: 0;
  }
}
</style>
