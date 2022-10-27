<template>
  <div class="Modal" v-if="ModalActive">
    <span class="Modal-backdrop" @click="closeModalAddAddress"></span>
    <transition name="bounce" appear>
      <div class="Modal-container">
        <div class="Modal-close" @click="closeModalAddAddress">
          <i
            class="bi form-control-feedback bi-x-lg"
            style="font-size: 22px"
          ></i>
        </div>
        <div class="Modal-body">
          <h1>Add New Address</h1>
          <form @submit.prevent="addAddress">
            <!-- <div class="Modal_inputs">
              <div class="Modal_input">
                <label>City</label>
                <select v-model="selectedProvince">
                  <option value="" disabled selected hidden></option>
                  <option
                    v-for="province in provinces"
                    :key="province.code"
                    :value="province"
                  >
                    {{ province.name }}
                  </option>
                </select>
              </div>
              <div class="Modal_input">
                <label>District</label>
                <select v-model="selectedDistrict">
                  <option value="" disabled selected hidden></option>
                  <option
                    v-for="district in districts"
                    :key="district.code"
                    :value="district"
                  >
                    {{ district.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="Modal_inputs">
              <div class="Modal_input">
                <label>Ward</label>
                <select v-model="selectedWard">
                  <option value="" disabled selected hidden></option>
                  <option v-for="ward in wards" :key="ward.code" :value="ward">
                    {{ ward.name }}
                  </option>
                </select>
              </div>
              <div class="Modal_input">
                <label>Address</label>
                <input type="text" v-model="address" maxlength="30" />
              </div>
            </div> -->
            <GMapAutocomplete class="google-places" @place_changed="setPlace">
            </GMapAutocomplete>
            <p class="modalError">{{ Error }}</p>
            <div class="Modal_inputs">
              <!-- <button
                :disabled="
                  Object.keys(selectedProvince).length === 0 ||
                  Object.keys(selectedDistrict).length === 0 ||
                  Object.keys(selectedWard).length === 0 ||
                  address === ''
                "
              >
                Add
              </button> -->
              <button :disabled="place == ''">Add</button>
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
  name: "Modal-AddAddress",
  props: ["ModalActive"],
  setup(props, { emit }) {
    const closeModalAddAddress = () => {
      emit("closeModalAddAddress");
    };
    return { closeModalAddAddress };
  },
  data() {
    return {
      // provinces: [],
      // districts: [],
      // wards: [],

      // selectedProvince: {},
      // selectedDistrict: {},
      // selectedWard: {},
      // address: "",

      place: "",

      Error: "",
    };
  },
  methods: {
    setPlace(value) {
      this.place = value.adr_address;
    },
    async addAddress() {
      // var addressString =
      //   this.address +
      //   "," +
      //   this.selectedDistrict.name +
      //   "," +
      //   this.selectedWard.name +
      //   "," +
      //   this.selectedProvince.name;
      try {
        const res = await this.$mainAxios.post(`User/AddAddress`, {
          id: this.$cookies.get("UserId"),
          address: this.place,
        });
        if (res.status == 200) {
          console.log(res);
          this.$router.go();
        }
      } catch (error) {
        console.log(error.response);
        this.Error = error.response.data.message;
      }
    },
    // async getProvinces() {
    //   try {
    //     const res = await this.$mainAxios.get(
    //       `https://provinces.open-api.vn/api/p/1`,
    //       {
    //         transformRequest: (data, headers) => {
    //           delete headers["Authorization"];
    //         },
    //       }
    //     );
    //     if (res.status == 200) {
    //       this.provinces.push(res.data);
    //     }
    //     const resHCM = await this.$mainAxios.get(
    //       `https://provinces.open-api.vn/api/p/79`,
    //       {
    //         transformRequest: (data, headers) => {
    //           delete headers["Authorization"];
    //         },
    //       }
    //     );
    //     if (resHCM.status == 200) {
    //       this.provinces.push(resHCM.data);
    //     }
    //   } catch (error) {
    //     console.log(error.response);
    //   }
    // },
    // async getDistricts(value) {
    //   try {
    //     const res = await this.$mainAxios.get(
    //       `https://provinces.open-api.vn/api/p/${value}?depth=2`,
    //       {
    //         transformRequest: (data, headers) => {
    //           delete headers["Authorization"];
    //         },
    //       }
    //     );
    //     if (res.status == 200) {
    //       this.districts = res.data.districts;
    //     }
    //   } catch (error) {
    //     console.log(error.response);
    //   }
    // },
    // async getWards(value) {
    //   try {
    //     const res = await this.$mainAxios.get(
    //       `https://provinces.open-api.vn/api/d/${value}?depth=2`,
    //       {
    //         transformRequest: (data, headers) => {
    //           delete headers["Authorization"];
    //         },
    //       }
    //     );
    //     if (res.status == 200) {
    //       this.wards = res.data.wards;
    //     }
    //   } catch (error) {
    //     console.log(error.response);
    //   }
    // },
  },
  watch: {
    // selectedProvince(value) {
    //   this.selectedDistrict = {};
    //   this.selectedWard = {};
    //   this.getDistricts(value.code);
    // },
    // selectedDistrict(value) {
    //   if (value.code) {
    //     this.selectedWard = {};
    //     this.getWards(value.code);
    //   }
    // },
    ModalActive(value) {
      const body = document.querySelector("body");
      if (value) {
        body.style.overflow = "hidden";
      } else {
        body.style.overflow = "auto";
      }
    },
  },
  mounted() {
    // this.getProvinces();
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
  /* width: 450px; */
  width: 80%;
  height: 80%;
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
  height: 100%;
}

.Modal-body h1 {
  font-size: 22px;
}

.Modal-body form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 94%;
}

.Modal_inputs:last-child {
  /* justify-content: flex-end; */
}
.Modal_inputs button {
  height: 40px;
  width: 92%;
  font-weight: 600;
  border-radius: 12px;
  border-color: transparent;
  background-color: #ffb100;
  cursor: pointer;
}
.Modal_inputs {
  display: flex;
  justify-content: space-around;
  width: 100%;
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

.google-places {
  /* pointer-events: none; */
  width: 80%;
  min-width: 95%;
  padding: 10px 14px;
  border-radius: 6px;
  border-color: #b3b3b3;
  border-style: double;
  height: 40px;
  margin-top: 24px;
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
  .Modal_inputs {
    flex-direction: column;
  }
  .Modal_inputs:last-child {
    flex-direction: inherit;
  }
  .Modal_input {
    width: 100%;
  }
  .Modal-container {
    width: 96%;
  }
}
</style>