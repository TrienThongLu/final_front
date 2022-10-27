<template>
  <div class="Modal" v-if="ModalChangeCusActive">
    <span class="Modal-backdrop" @click="closeModalChangeCus"></span>
    <transition name="bounce" appear>
      <div class="Modal-container">
        <div class="Modal-close" @click="closeModalChangeCus">
          <i
            class="bi form-control-feedback bi-x-lg"
            style="font-size: 22px"
          ></i>
        </div>
        <div class="Modal-body">
          <div class="userInfo_addresses">
            <div class="userInfo_addresses_element">
              <p>
                <b>{{ customers.length }}</b> Customer
              </p>
            </div>
            <div class="userInfo_addresses_element" style="flex-wrap: wrap">
              <div
                v-for="customer in customers"
                :key="customer"
                @click="selectCustomer(customer.id)"
                class="userInfo_addresses_element_address"
                :class="customerSelected == customer.id ? 'focus' : ''"
              >
                <div class="userInfo_addresses_element_address-top">
                  <div class="userInfo_addresses_element_address-top-1">
                    <i class="bi bi-person-circle"></i>
                  </div>
                  <div v-if="CustomerId == customer.id">
                    <p class="currentTable">Current Cus</p>
                  </div>
                  <span v-else style="display: none"></span>
                </div>
                <p>{{ customer.fullname }}</p>
              </div>
            </div>
          </div>
          <div class="Modal_inputs">
            <button @click="submit">Change</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <span v-else style="display: none"></span>
</template>

<script>
export default {
  name: "Modal-ChangeCus",
  props: ["ModalChangeCusActive", "StoreId", "OrderId", "CustomerId"],
  emits: ["closeModalChangeCus", "customerSubmit"],
  setup(props, { emit }) {
    const closeModalChangeCus = () => {
      emit("closeModalChangeCus");
    };

    return {
      closeModalChangeCus,
    };
  },
  data() {
    return {
      customerSelected: "",
      customers: [],
      Error: "",
    };
  },
  methods: {
    async submit() {
      try {
        const orderData = {
          orderId: this.OrderId,
          userId: this.customerSelected,
        };
        const res = await this.$mainAxios.put(
          `Order/ChangeCustomer`,
          orderData
        );
        if (res.status == 200) {
          console.log(res);
          this.$emit("customerSubmit");
          this.closeModalChangeCus();
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    selectCustomer(value) {
      this.customerSelected = value;
    },
    async getCustomers() {
      try {
        const res = await this.$mainAxios.get(
          `User/GetStoreCustomers/${this.StoreId}`
        );
        if (res.status == 200) {
          console.log(res);
          this.customers = res.data.content;
        }
      } catch (error) {
        console.log(error.response);
      }
    },
  },
  watch: {
    ModalChangeCusActive() {
      const selected = this.CustomerId;
      this.customerSelected = selected;
    },
  },
  mounted() {
    this.getCustomers();
  },
};
</script>

<style scoped>
.currentTable {
  padding: 4px 6px;
  background-color: #dccdc6;
  border-radius: 20px;
}
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
  min-height: 106px;
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