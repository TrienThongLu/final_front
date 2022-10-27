<template>
  <div class="store-header">
    <i class="bi bi-geo-alt"></i>
    <h1>Stores' Location</h1>
  </div>
  <div class="store-container">
    <div class="store-container-side">
      <div class="store-container-side-filter_form">
        <input type="text" placeholder="Find a store" v-model="search" />
      </div>
      <div
        class="store-container-side-filter_list"
        id="store-list"
        @scroll="handleScroll"
      >
        <ul>
          <li
            v-for="store in stores"
            :key="store.id"
            :id="store.id"
            :ref="store.id"
            :class="focus == store.id ? 'focus' : ''"
            @click="focusTo(store)"
          >
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <p>{{ store.name }}</p>
              <i class="bi bi-info-circle" style="font-size: 20px"></i>
            </div>
            <p>{{ store.startTime }}:00 - {{ store.closeTime }}:00</p>
            <p>{{ store.address }}</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="store-container-map">
      <GMapMap
        :center="center.positions"
        :zoom="center.zoom"
        map-type-id="terrain"
        style="width: 100%; height: 100%"
      >
        <GMapMarker
          :key="index"
          v-for="(m, index) in stores"
          :position="m.positions"
          :icon="
            focus != m.id
              ? {
                  url: 'https://firebasestorage.googleapis.com/v0/b/final-project-7e92c.appspot.com/o/brownDot.png?alt=media&token=22991a93-8fcb-477f-957c-bea76b735c74',
                  scaledSize: { width: 20, height: 20 },
                  labelOrigin: { x: 16, y: -10 },
                }
              : {
                  url: 'https://firebasestorage.googleapis.com/v0/b/final-project-7e92c.appspot.com/o/destinitionFocus.png?alt=media&token=5c30d9de-71d5-4d7b-a684-49f8d9fb3a87',
                  scaledSize: { width: 45, height: 45 },
                  labelOrigin: { x: 16, y: -10 },
                }
          "
          @click="focusTo(m)"
        />
      </GMapMap>
    </div>
  </div>
</template>

<script>
var timeOut;

export default {
  components: {},
  data() {
    return {
      center: {
        positions: { lat: 10.760682781277346, lng: 106.65417733699996 },
        zoom: 7,
      },
      expandDetailId: "",
      focus: "",
      stores: [],
      search: "",
    };
  },
  methods: {
    scrollToElement(value) {
      var target = document.getElementById(value);
      target.parentNode.parentNode.scrollTop = target.offsetTop;
    },
    focusTo(value) {
      this.focus = value.id;
      this.center.positions = value.positions;
      this.center.zoom = 15;
      this.scrollToElement(value.id);
    },
    async getStores() {
      try {
        const res = await this.$mainAxios.get(
          `StoreLocation/GetStores?searchString=${this.search}`
        );
        if (res.status == 200) {
          console.log(res);
          this.stores = res.data.data;
        }
      } catch (error) {
        console.log(error.response);
      }
    },
  },
  watch: {
    search() {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        this.getStores();
      }, 300);
    },
  },
  mounted() {
    this.getStores();
  },
  setup() {},
};
</script>

<style scoped>
.store-header {
  margin: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.store-header i {
  font-size: 30px;
  color: white;
  margin-right: 16px;
  background-color: #fdd7a4;
  border: 2px solid #fdd7a4;
  border-radius: 50%;
  padding: 2px 4px;
}

.store-container {
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  min-height: 500px;
  margin-bottom: 30px;
}
.store-container-side {
  width: 400px;
  background: #fff;
}
.store-container-map {
  width: calc(100% - 400px);
}
.store-container-side-filter_form {
  padding: 12px 12px;
  background: #f0f0f0;
}
.store-container-side-filter_form input {
  background: #fff;
  display: block;
  width: 100%;
  height: 40px;
  padding: 4px 6px;
  border: 2px solid #ededed;
}
.store-container-side-filter_list {
  padding: 12px 0;
  overflow: auto;
  height: calc(500px - 46px);
  position: relative;
  scroll-behavior: smooth;
}
.store-container-side-filter_list ul {
  list-style: none;
  text-align: left;
}
.focus {
  background: #ddd;
}
.store-container-side-filter_list li {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
}
.store-container-side-filter_list li p {
  font-weight: 900;
  font-size: 14px;
  margin-top: 12px;
}
.store-container-side-filter_list li p:first-child {
  text-transform: uppercase;
  font-size: 16px;
  margin: 0;
}
.store-container-side-filter_list li i::before {
  font-weight: 900 !important;
}
.store-container-side-filter_list::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  /* border-radius: 10px; */
  background-color: #f5f5f5;
}

.store-container-side-filter_list::-webkit-scrollbar {
  width: 8px;
  background-color: #f5f5f5;
}

.store-container-side-filter_list::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
.vue-map-container {
  height: 100%;
  width: 100%;
}

/*Horizontal Ipad(1024 x 768)*/
@media screen and (max-width: 1024px) {
}

@media screen and (max-width: 992px) {
  .store-container {
    flex-direction: column-reverse;
    align-items: center;
  }
  .store-container-map {
    width: 100%;
    height: 400px;
  }
  .store-container-side {
    width: 82%;
  }
}

@media (max-width: 900px) {
}

/*Vertical Ipad(768 x 1024)*/
@media screen and (max-width: 768px) {
}
@media screen and (max-width: 700px) {
}
@media screen and (max-width: 560px) {
}
/*Small tablet(480 x 640)*/
@media screen and (max-width: 480px) {
}
/*Iphone(480 x 640)*/
@media screen and (max-width: 320px) {
}
/*Small phone*/
@media screen and (max-width: 240px) {
}
</style>