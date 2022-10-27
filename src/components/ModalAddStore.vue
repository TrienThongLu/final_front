<template>
  <div class="Modal" v-if="ModalAddStoreActive">
    <span class="Modal-backdrop" @click="closeModalAddStore"></span>
    <transition name="bounce" appear>
      <div class="Modal-container">
        <div class="Modal-close" @click="closeModalAddStore">
          <i
            class="bi form-control-feedback bi-x-lg"
            style="font-size: 22px"
          ></i>
        </div>
        <div class="Modal-body">
          <h1>Add New Store</h1>
          <form @submit.prevent="addStore">
            <div class="Modal_inputs">
              <div class="Modal_input">
                <label>Store Name</label>
                <input
                  type="text"
                  placeholder="Store name"
                  v-model="newStore.name"
                />
              </div>
              <div class="Modal_input">
                <label>Store Address</label>
                <input
                  type="text"
                  placeholder="Store address"
                  v-model="newStore.address"
                />
              </div>
            </div>
            <div class="Modal_inputs">
              <div class="Modal_input">
                <label>Latitude</label>
                <input
                  type="text"
                  placeholder="Store latitude"
                  @keypress="isNumber($event)"
                  v-model="newStore.positions.lat"
                />
              </div>
              <div class="Modal_input">
                <label>longitude</label>
                <input
                  type="text"
                  placeholder="Store longitude"
                  @keypress="isNumber($event)"
                  v-model="newStore.positions.lng"
                />
              </div>
            </div>
            <div class="Modal_inputs">
              <div class="Modal_input">
                <label>Open time</label>
                <select v-model="newStore.startTime">
                  <option :value="6">6:00</option>
                  <option :value="7">7:00</option>
                  <option :value="8">8:00</option>
                  <option :value="9">9:00</option>
                  <option :value="10">10:00</option>
                </select>
              </div>
              <div class="Modal_input">
                <label>Close time</label>
                <select v-model="newStore.endTime">
                  <option :value="21">21:00</option>
                  <option :value="22">22:00</option>
                  <option :value="23">23:00</option>
                  <option :value="24">24:00</option>
                  <option :value="1">1:00</option>
                </select>
              </div>
            </div>
            <p class="modalError">{{ Error }}</p>
            <div class="Modal_inputs">
              <button
                :disabled="
                  !newStore.name &&
                  !newStore.address &&
                  !newStore.open &&
                  !newStore.close
                "
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
  <span v-else style="display: none"></span>
</template>

<script>
export default {
  name: "Modal-AddStore",
  props: ["ModalAddStoreActive"],
  setup(props, { emit }) {
    const closeModalAddStore = () => {
      emit("closeModalAddStore");
    };
    return { closeModalAddStore };
  },
  data() {
    return {
      newStore: {
        name: "",
        address: "",
        positions: {
          lat: undefined,
          lng: undefined,
        },
        startTime: undefined,
        endTime: undefined,
      },
      Error: "",
    };
  },
  methods: {
    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode === 190 || charCode === 110) {
        return true;
      }
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    async addStore() {
      try {
        const res = await this.$mainAxios.post(
          `StoreLocation/AddStore`,
          this.newStore
        );
        if (res.status == 200) {
          this.$router.go();
        }
      } catch (error) {
        console.log(error.response);
        if (error.response.data.Message) {
          this.Error = error.response.data.Message;
        }
      }
    },
  },
  watch: {
    ModalAddStoreActive(value) {
      const body = document.querySelector("body");
      if (value) {
        body.style.overflow = "hidden";
      } else {
        body.style.overflow = "auto";
      }
    },
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
  width: 450px;
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

.Modal_inputs:last-child {
  justify-content: flex-end;
}
.Modal_inputs button {
  height: 32px;
  width: 72px;
  font-weight: 600;
  border-radius: 12px;
  border-color: transparent;
  background-color: #ffb100;
  margin-right: 16px;
  cursor: pointer;
}
.Modal_inputs {
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
}
.Modal_input {
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 46%;
}
.Modal_input label {
  margin-left: 16px;
  margin-bottom: 6px;
  font-size: 16px;
}
.Modal_input input {
  width: 100%;
  min-width: 95%;
  padding: 10px 14px;
  border-radius: 6px;
  border-color: #b3b3b3;
  border-style: double;
  height: 40px;
}
.Modal_input input:focus {
  outline: none !important;
  border-color: #ffb100 !important;
}
.Modal_input select {
  width: 100%;
  padding: 10px 14px;
  border-radius: 6px;
  border-color: #b3b3b3;
  border-style: double;
  border-width: 2px;
  height: 40px;
}
.Modal_input select:focus {
  outline: none !important;
  border-color: #ffb100 !important;
}

select::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

select::-webkit-scrollbar {
  width: 5px;
  background-color: #f5f5f5;
}

select::-webkit-scrollbar-thumb {
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
</style>