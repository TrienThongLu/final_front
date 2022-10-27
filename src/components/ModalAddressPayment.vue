<template>
  <div class="Modal" v-if="ModalAddressPayActive">
    <span class="Modal-backdrop" @click="closeModalAddressPay"></span>
    <transition name="bounce" appear>
      <div class="Modal-container">
        <div class="Modal-close" @click="closeModalAddressPay">
          <i
            class="bi form-control-feedback bi-x-lg"
            style="font-size: 22px"
          ></i>
        </div>
        <div class="Modal-body">
          <div class="userInfo_addresses">
            <div class="userInfo_addresses_element">
              <p>
                <b>{{ addressesDisplay.length }}</b> Addresses
              </p>
              <button @click="isOpenModalAddAddressAct">Add</button>
            </div>
            <div class="userInfo_addresses_element" style="flex-wrap: wrap">
              <div
                v-for="address in addressesDisplay"
                :key="address"
                @click="selectAddress(address)"
                class="userInfo_addresses_element_address"
                :class="addressSelected == address ? 'focus' : ''"
              >
                <div class="userInfo_addresses_element_address-top">
                  <div class="userInfo_addresses_element_address-top-1">
                    <i class="bi bi-geo-alt"></i>
                  </div>
                </div>
                <p v-html="addressSplit(address)"></p>
                <div class="userInfo_addresses_element_address-address">
                  <span v-html="addressRemove(address)"></span>
                </div>
              </div>
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
  <modal-add-address
    :ModalActive="isOpenModalAddAddress"
    @closeModalAddAddress="isOpenModalAddAddressAct"
  ></modal-add-address>
</template>

<script>
import { ref } from "vue";
import ModalAddAddress from "../components/ModalAddAddress.vue";

export default {
  name: "Modal-AddressPay",
  components: {
    ModalAddAddress,
  },
  props: ["ModalAddressPayActive", "Addresses"],
  emits: ["closeModalAddressPay", "addressSubmit"],
  setup(props, { emit }) {
    const closeModalAddressPay = () => {
      emit("closeModalAddressPay");
    };

    const isOpenModalAddAddress = ref(false);
    const isOpenModalAddAddressAct = () => {
      isOpenModalAddAddress.value = !isOpenModalAddAddress.value;
    };

    return {
      closeModalAddressPay,
      isOpenModalAddAddress,
      isOpenModalAddAddressAct,
    };
  },
  data() {
    return {
      addressesDisplay: [],
      addressSelected: "",
      Error: "",
    };
  },
  methods: {
    submit() {
      this.$emit("addressSubmit", this.addressSelected);
      this.closeModalAddressPay();
    },
    selectAddress(value) {
      this.addressSelected = value;
    },
    addressSplit(value) {
      let province = "Province: " + value.split(",")[3];
      return province;
    },
    addressRemove(value) {
      const arrayAddress = value.split(",");
      let address = " " + arrayAddress[0] + arrayAddress[1] + arrayAddress[2];
      return address;
    },
  },
  watch: {
    ModalAddressPayActive(value) {
      const body = document.querySelector("body");
      if (value) {
        body.style.overflow = "hidden";
        if (this.Addresses) {
          this.addressesDisplay = this.Addresses;
        }
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
  border: 2px solid #ffb100 !important;
}
.userInfo_addresses {
  padding: 24px;
  border: 1px solid rgb(217, 217, 217);
  height: fit-content;
  border-radius: 8px;
}
.userInfo_addresses_element {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
}
.userInfo_addresses_element:last-child {
  margin-top: 20px;
  overflow: auto;
  max-height: 442px;
}
.userInfo_addresses_element p {
  text-align: left;
}
.userInfo_addresses_element button {
  height: 32px;
  width: 72px;
  font-weight: 600;
  border-radius: 12px;
  border-color: transparent;
  background-color: #ffb100;
  cursor: pointer;
}
.userInfo_addresses_element_address {
  min-height: 160px;
  width: 49%;
  border: 2px solid rgb(217, 217, 217);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: normal;
}
.userInfo_addresses_element_address:hover {
  border: 2px solid #ffb100;
}
.userInfo_addresses_element_address-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.userInfo_addresses_element_address-top-1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.userInfo_addresses_element_address-top-1 p {
  background-color: #ffb100;
  border-radius: 8px;
  padding: 4px;
  font-size: 14px;
  color: white;
  font-weight: 600;
}
.userInfo_addresses_element_address-top-1 i {
  font-size: 20px;
  margin-right: 12px;
}
.userInfo_addresses_element_address-top-2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.userInfo_addresses_element_address-top-2 p {
  text-decoration: underline;
  color: #ffb100;
  font-weight: 600;
  cursor: pointer;
}
.userInfo_addresses_element_address-top-2 p:first-child {
  margin-right: 12px;
}
.userInfo_addresses_element_address > p {
  font-weight: 600;
  margin: 10px 4px;
}
.userInfo_addresses_element_address span {
  text-align: left;
}
.userInfo_addresses_element_address-bottom {
  display: none;
}
.userInfo_addresses_element_address-address {
  text-align: left;
  margin: 0 4px;
  margin-bottom: 4px;
  line-height: 24px;
}
.userInfo_addresses_element_address-phonenumber {
  text-align: left;
  margin: 0 4px;
}

.userInfo_addresses_element:last-child::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  /* border-radius: 10px; */
  background-color: #f5f5f5;
}

.userInfo_addresses_element:last-child::-webkit-scrollbar {
  width: 8px;
  background-color: #f5f5f5;
}

.userInfo_addresses_element:last-child::-webkit-scrollbar-thumb {
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