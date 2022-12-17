<template>
  <div class="Modal" v-if="ModalStorePaymentActive">
    <span class="Modal-backdrop" @click="closeModalStorePayment"></span>
    <transition name="bounce" appear>
      <div class="Modal-container">
        <div class="Modal-close" @click="closeModalStorePayment">
          <i
            class="bi form-control-feedback bi-x-lg"
            style="font-size: 22px"
          ></i>
        </div>
        <div class="Modal-body">
          <div class="store-container-side">
            <div class="store-container-side-filter_form">
              <input
                type="text"
                placeholder="Find a store"
                v-model="searchStores"
              />
            </div>
            <div
              class="store-container-side-filter_list"
              id="store-list"
              @scroll="handleScroll"
            >
              <ul>
                <li
                  v-for="store in storesDisplayed"
                  :key="store.id"
                  :id="store.id"
                  :ref="store.id"
                  :class="storeSelected.id == store.id ? 'focus' : ''"
                  @click="selectStore(store)"
                >
                  <div
                    style="
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                    "
                  >
                    <p>{{ store.name }}</p>
                  </div>
                  <div
                    style="
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                    "
                  >
                    <p>{{ store.startTime }}:00 - {{ store.closeTime }}:00</p>
                    <p style="margin: 0">Distance: {{ store.distance }}</p>
                  </div>
                  <p>{{ store.address }}</p>
                </li>
              </ul>
            </div>
          </div>
          <div class="Modal_inputs">
            <button @click="submit">Select</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <span v-else style="display: none"></span>
</template>

<script>
export default {
  name: "Modal-StorePayment",
  props: ["ModalStorePaymentActive", "Address"],
  emits: ["closeModalStorePayment", "storeSubmit"],
  setup(props, { emit }) {
    const closeModalStorePayment = () => {
      emit("closeModalStorePayment");
    };

    return {
      closeModalStorePayment,
    };
  },
  data() {
    return {
      storeSelected: {},
      storesDisplayed: [],
      stores: [],
      searchStores: "",
      Error: "",
    };
  },
  methods: {
    submit() {
      this.$emit("storeSubmit", this.storeSelected);
      this.closeModalStorePayment();
    },
    selectStore(value) {
      this.storeSelected = value;
    },
    show() {
      console.log(this.storeSelected);
    },
    async getStores() {
      try {
        const res = await this.$mainAxios.get(`StoreLocation/GetStores`);
        if (res.status == 200) {
          this.stores = res.data.data;
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    location() {
      this.stores.forEach(async (store) => {
        try {
          // var name = store.name + " Viet Nam";
          const res = await this.$customAxios.get(
            `json?origins=${this.Address}&destinations=${store.address}&key=AIzaSyDHvv3AiHlPorA8rQRLUba3v9PDUifi7BE`,
            {
              transformRequest: (data, headers) => {
                delete headers["Authorization"];
              },
            }
          );
          if (res.status == 200) {
            if (!res.data.error_message) {
              store.distance = res.data.rows[0].elements[0].distance.text;
            } else {
              store.distance = "0";
            }
          }
        } catch (error) {
          console.log(error);
        }
        this.storesDisplayed.push(store);
      });
    },
  },
  watch: {
    ModalStorePaymentActive(value) {
      const body = document.querySelector("body");
      if (value) {
        body.style.overflow = "hidden";
      } else {
        body.style.overflow = "auto";
      }
    },
    Address() {
      this.location();
    },
    searchStores(newValue) {
      if (newValue) {
        this.storesDisplayed = this.stores.filter((item) => {
          return newValue
            .toLowerCase()
            .split(" ")
            .every(
              (v) =>
                item.name.toLowerCase().includes(v) ||
                item.address.toLowerCase().includes(v)
            );
        });
      } else {
        this.storesDisplayed = this.stores;
      }
    },
  },
  mounted() {
    this.getStores();
  },
};
</script>

<style scoped>
.Modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
}

.Modal-backdrop {
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
}

.Modal-container {
  position: relative;
  width: 540px;
  max-width: calc(100% - 32px);
  /* min-height: 300px; */
  background-color: white;
  border-radius: 5px;

  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 26px;
  line-height: 26px;
  z-index: 2;
}

.Modal-header {
  position: absolute;
  width: 250px;
  height: 30px;
  left: calc(50% - 250px / 2);
  top: 20px;
  text-align: center;
}

.Modal-header p {
  font-size: 20px;
}

.Modal-logo {
  height: 76px;
  position: absolute;
  top: -36px;
  left: 50%;
  transform: translateX(-50%);
}

.Modal-logo img {
  height: 76px;
  border-radius: 30px;
}

.Modal-close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 12px;
  cursor: pointer;
  font-size: 20px;
}

.Modal-body {
  padding: 24px 16px;
  margin-top: 16px;
  text-align: center;
}

.Modal-body h1 {
  font-size: 22px;
}

.Modal_inputs button {
  height: 32px;
  width: 84%;
  font-weight: 600;
  border-radius: 12px;
  border-color: transparent;
  background-color: #ffb100;
  margin-right: 16px;
  cursor: pointer;
  margin-top: 16px;
}

.focus {
  background: #ddd;
}

.store-container-side {
  width: 100%;
  background: #fff;
  margin: 0 auto;
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

.modalError {
  font-size: 15px;
  margin-top: 8px;
  color: red;
}

.bounce-enter-active {
  animation: bounce-in 0.15s;
}
.bounce-leave-active {
  animation: bounce-in 0.15s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
}

@media screen and (max-width: 560px) {
  .userInfo_addresses {
    padding: 24px 10px;
  }
  /* .userInfo_addresses_element:last-child {
    justify-content: center;
  } */
  .userInfo_addresses_element_address {
    width: 98%;
    min-width: 300px;
  }
}
</style>
