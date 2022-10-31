<template>
  <div class="payment-header">
    <i class="bi bi-receipt-cutoff"></i>
    <h1>Confirm Payment</h1>
  </div>
  <div class="payment-container">
    <div class="payment-container-deliveryDetail">
      <button
        v-if="!disabled"
        class="payment-container-deliveryDetail-item"
        @click="isOpenModalAddressPayAct"
      >
        <i class="bi bi-geo-alt"></i>
        <div class="payment-container-deliveryDetail-item_content">
          <p style="font-weight: bold">Address</p>
          <p
            v-html="
              order.customerAddress == ''
                ? 'No address chosen yet'
                : order.customerAddress
            "
          ></p>
        </div>
        <i class="bi bi-chevron-right"></i>
      </button>
      <span v-else style="display: none"></span>
      <button
        class="payment-container-deliveryDetail-item"
        @click="isOpenModalUserDeAct"
      >
        <i class="bi bi-person-fill"></i>
        <div class="payment-container-deliveryDetail-item_content">
          <p style="font-weight: bold">User Detail</p>
          <p>{{ userDetail.fullname }}</p>
          <p>Phone number: {{ userDetail.phoneNumber }}</p>
        </div>
        <i class="bi bi-chevron-right"></i>
      </button>
      <button
        v-if="!disabled"
        class="payment-container-deliveryDetail-item"
        :style="!order.customerAddress ? 'opacity: 0.3; cursor: auto;' : ''"
        :disabled="!order.customerAddress"
        @click="isOpenModalStorePayAct"
      >
        <i class="bi bi-shop"></i>
        <div class="payment-container-deliveryDetail-item_content">
          <p style="font-weight: bold">From Store</p>
          <p>
            {{ store == "" ? "No store chosen yet" : store }}
          </p>
        </div>
        <i class="bi bi-chevron-right"></i>
      </button>
      <span v-else style="display: none"></span>
      <div class="payment-container-deliveryDetail-item">
        <i class="bi bi-journal-text"></i>
        <div class="payment-container-deliveryDetail-item_content">
          <p style="font-weight: bold">Note</p>
          <textarea maxlength="340" v-model="order.customerNote"></textarea>
        </div>
      </div>
    </div>
    <div class="payment-container-paymentDetail">
      <div class="payment-container-paymentDetail-item">
        <i class="bi bi-info-circle"></i>
        <div class="payment-container-paymentDetail-item_content">
          <p style="font-weight: bold">Payment Information</p>
        </div>
      </div>
      <div class="payment-container-paymentDetail-text">
        <p>Total price of item(s)</p>
        <p>{{ toLocaleNumber(order.totalPrice) }}₫</p>
      </div>
      <div class="payment-container-paymentDetail-text">
        <p>Discount</p>
        <p>
          {{ order.discount }}% ({{
            toLocaleNumber((order.totalPrice * order.discount) / 100)
          }}₫)
        </p>
      </div>
      <div class="payment-container-paymentDetail-text" v-if="!disabled">
        <p>Distance</p>
        <p>{{ order.distance ? order.distance : "No store selected" }}</p>
      </div>
      <span v-else style="display: none"></span>
      <div class="payment-container-paymentDetail-text" v-if="!disabled">
        <p>Shipping fees</p>
        <p>{{ toLocaleNumber(order.shippingFee) }}₫</p>
      </div>
      <span v-else style="display: none"></span>
      <div class="payment-container-paymentDetail-text">
        <p>Amount</p>
        <p>{{ toLocaleNumber(order.amount) }}₫</p>
      </div>
      <div class="payment-container-paymentDetail-item">
        <i class="bi bi-cash"></i>
        <div class="payment-container-paymentDetail-item_content">
          <p style="font-weight: bold">Payment Method</p>
        </div>
      </div>
      <div class="payment-container-paymentDetail-payment" v-if="disabled">
        <div>
          <input
            type="radio"
            id="Cash"
            name="Cash"
            value="Cash"
            v-model="order.paymentMethod"
          />
          <label for="Cash">
            <img src="../assets/Images/Payment/cash.png" alt="cash" />
            <p>Cash</p>
            <div class="radio"></div>
          </label>
        </div>
        <div>
          <input
            type="radio"
            id="MoMoQr"
            name="MoMoQr"
            value="MoMoQr"
            v-model="order.paymentMethod"
          />
          <label for="MoMoQr">
            <img src="../assets/Images/Payment/momo.png" alt="momo" />
            <p>Momo (QrCode)</p>
            <div class="radio"></div>
          </label>
        </div>
        <div>
          <input
            type="radio"
            id="MoMoATM"
            name="MoMoATM"
            value="MoMoATM"
            v-model="order.paymentMethod"
          />
          <label for="MoMoATM">
            <img src="../assets/Images/Payment/momo.png" alt="momo" />
            <p>Momo (ATM)</p>
            <div class="radio"></div>
          </label>
        </div>
      </div>
      <div class="payment-container-paymentDetail-payment" v-else>
        <div style="justify-content: space-between">
          <div>
            <input
              type="radio"
              id="COD"
              name="COD"
              value="COD"
              v-model="order.paymentMethod"
            />
            <label for="COD">
              <img src="../assets/Images/Payment/cash.png" alt="cash" />
              <p>COD</p>
              <div class="radio"></div>
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="PayPal"
              name="PayPal"
              value="PayPal"
              v-model="order.paymentMethod"
            />
            <label for="PayPal">
              <img src="../assets/Images/Payment/paypal.png" alt="cash" />
              <p>PayPal</p>
              <div class="radio"></div>
            </label>
          </div>
        </div>
        <div>
          <input
            type="radio"
            id="MoMoQr"
            name="MoMoQr"
            value="MoMoQr"
            v-model="order.paymentMethod"
          />
          <label for="MoMoQr">
            <img src="../assets/Images/Payment/momo.png" alt="momo" />
            <p>Momo (QrCode)</p>
            <div class="radio"></div>
          </label>
        </div>
        <div>
          <input
            type="radio"
            id="MoMoATM"
            name="MoMoATM"
            value="MoMoATM"
            v-model="order.paymentMethod"
          />
          <label for="MoMoATM">
            <img src="../assets/Images/Payment/momo.png" alt="momo" />
            <p>Momo (ATM)</p>
            <div class="radio"></div>
          </label>
        </div>
      </div>
      <button
        :style="confirmDisabled ? 'opacity: 0.3; cursor: auto' : ''"
        @click.once="createOrder"
        :disabled="confirmDisabled"
      >
        Confirm Order
      </button>
    </div>
  </div>
  <modal-user-de-payment
    v-if="!disabled"
    :ModalUserDeActive="isOpenModalUserDe"
    :Fullname="userDetail.fullname"
    :Phonenumber="userDetail.phoneNumber"
    @closeModalUserDe="isOpenModalUserDeAct"
    @userDe="changeUserDe"
  ></modal-user-de-payment>
  <modal-search-user
    v-else
    :ModalSearchUserActive="isOpenModalUserDe"
    @closeModalSearchUser="isOpenModalUserDeAct"
    @searchUser="searchUserDe"
  ></modal-search-user>
  <modal-address-payment
    :ModalAddressPayActive="isOpenModalAddressPay"
    :Addresses="userDetail.addresses"
    @closeModalAddressPay="isOpenModalAddressPayAct"
    @addressSubmit="submitAddress"
  ></modal-address-payment>
  <modal-store-payment
    :ModalStorePaymentActive="isOpenModalStorePay"
    :Address="order.customerAddress"
    @closeModalStorePayment="isOpenModalStorePayAct"
    @storeSubmit="submitStore"
  ></modal-store-payment>
</template>

<script>
import { ref } from "vue";
import ModalUserDePayment from "../components/ModalUserDePayment.vue";
import ModalAddressPayment from "../components/ModalAddressPayment.vue";
import ModalStorePayment from "../components/ModalStorePayment.vue";
import ModalSearchUser from "../components/ModalSearchUser.vue";

export default {
  components: {
    ModalUserDePayment,
    ModalAddressPayment,
    ModalStorePayment,
    ModalSearchUser,
  },
  data() {
    return {
      userDetail: {},

      store: "",

      order: {
        storeId: "",
        customerAddress: "",
        customerName: "",
        customerNumber: "",
        customerNote: "",
        distance: "",
        totalPrice: 0,
        shippingFee: 0,
        discount: 0,
        amount: 0,
        paymentMethod: "",
      },

      confirmDisabled: true,
    };
  },
  computed: {
    auth() {
      return this.$cookies.get("Auth");
    },
    disabled() {
      if (!this.auth.includes("Staff") && this.auth != "Customer") {
        return false;
      }
      return true;
    },
  },
  methods: {
    toLocaleNumber(value) {
      const result = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return result;
    },
    changeUserDe(value) {
      this.userDetail.fullname = value.fullname;
      this.userDetail.phoneNumber = value.phonenumber;
    },
    searchUserDe(value) {
      this.userDetail.id = value.id;
      this.userDetail.fullname = value.fullname;
      this.userDetail.phoneNumber = value.phonenumber;
      this.userDetail.ranking = value.ranking;
    },
    submitAddress(value) {
      this.order.customerAddress = value;
    },
    submitStore(value) {
      this.order.storeId = value.id;
      this.order.distance = value.distance;
      this.store = value.name;
    },
    calcTotal() {
      this.order.totalPrice = 0;
      let cartItems = JSON.parse(localStorage.getItem("Cart"));
      if (cartItems && cartItems.length > 0) {
        for (let item of cartItems) {
          this.order.totalPrice += item.totalPrice;
        }
      }
    },
    calcShipingFee() {
      this.order.shippingFee = 0;
      let distance = parseFloat(this.order.distance.match(/\d+/), 10);
      for (let i = 0; i < distance; i++) {
        this.order.shippingFee += 2000;
      }
    },
    calcAmount() {
      this.order.amount =
        (this.order.totalPrice * (100 - this.order.discount)) / 100 +
        this.order.shippingFee;
    },
    cleanAddress(value) {
      return value.replace(/<\/?[^>]+(>|$)/g, "");
    },
    async getUser() {
      try {
        const userId = this.$cookies.get("UserId");
        const res = await this.$mainAxios.get(`User/GetUser/${userId}`);
        if (res.status == 200) {
          this.userDetail = res.data.content;
          // if (res.data.content.addresses) {
          //   this.userProfile.addresses = res.data.content.addresses;
          // }
          console.log(res);
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    async createOrder() {
      try {
        let auth = this.$cookies.get("Auth");
        let itemsFiltered = [];
        let cartItems = JSON.parse(localStorage.getItem("Cart"));
        for (let item of cartItems) {
          const toppings = [];
          for (let topping of item.item.toppings) {
            const toppingObject = {
              name: topping.name,
              quantity: topping.quantity,
              price: topping.price,
            };
            toppings.push(toppingObject);
          }
          const itemObject = {
            name: item.item.name,
            basePrice: item.item.basePrice,
            price: item.item.itemPrice,
            itemTotalPrice: item.item.itemTotalPrice,
            quantity: item.quantity,
            size: item.item.size.name,
            topping: toppings,
          };
          itemsFiltered.push(itemObject);
        }
        if (this.userDetail.id) {
          var userInfo = {
            id: this.userDetail.id,
            name: this.order.customerName,
            phonenumber: this.order.customerNumber,
            address: this.order.customerAddress
              ? this.cleanAddress(this.order.customerAddress)
              : null,
          };
        }

        const paymentInfo =
          this.order.paymentMethod == "Cash"
            ? null
            : auth == "Online Customer" || auth == "Admin"
            ? {
                distance: this.order.distance,
                shippingFee: this.order.shippingFee,
              }
            : {
                distance: null,
                shippingFee: null,
              };

        const orderObject = {
          storeId: this.$cookies.get("StoreId")
            ? this.$cookies.get("StoreId")
            : this.order.storeId,
          items: itemsFiltered,
          totalPrice: this.order.totalPrice,
          discountPercent: this.order.discount,
          amount: this.order.amount,
          takenBy:
            auth == "Online Customer" || auth == "Admin"
              ? null
              : this.$cookies.get("UserId"),
          customerInfo: userInfo ? userInfo : null,
          type: auth == "Online Customer" || auth == "Admin" ? 0 : 1,
          paymentMethod: this.order.paymentMethod,
          paymentInfo: paymentInfo,
          note: this.order.customerNote,
        };
        console.log(orderObject);
        const res = await this.$mainAxios.post(
          `Order/CreateOrder`,
          orderObject
        );
        if (res.status == 200) {
          console.log(res);
          localStorage.removeItem("Cart");
          this.$mitt.emit("itemAdded", true);
          if (res.data.payUrl != null) {
            location.href = res.data.payUrl;
          } else {
            if (this.auth.includes("Staff")) {
              this.$router.push({
                name: "product",
              });
            } else {
              this.$router.push({
                name: "thankyou",
                query: {
                  partnerCode: "empty",
                  orderId: "empty",
                },
              });
            }
          }
        }
      } catch (error) {
        console.log(error.response);
      }
    },
  },
  watch: {
    "userDetail.ranking"(value) {
      switch (value) {
        case "Silver":
          this.order.discount = 5;
          break;
        case "Gold":
          this.order.discount = 10;
          break;
        case "Diamond":
          this.order.discount = 15;
          break;
        default:
          this.order.discount = 0;
          break;
      }
      this.calcAmount();
    },
    "order.distance"() {
      this.calcShipingFee();
    },
    "order.shippingFee"() {
      this.calcAmount();
    },
    "order.totalPrice"() {
      this.calcAmount();
    },
    order: {
      handler(val) {
        if (!this.disabled) {
          var filtered = Object.keys(val).filter(
            (val) =>
              val != "customerNote" && val != "shippingFee" && val != "discount"
          );
          let result = filtered.reduce((r, k) => r.concat(val[k]), []);
          const isEmptyValue = result.some((x) => !x);
          this.confirmDisabled = isEmptyValue;
        } else {
          if (val.paymentMethod) {
            this.confirmDisabled = false;
          }
        }
      },
      deep: true,
    },
    userDetail: {
      handler(val) {
        this.order.customerName = val.fullname;
        this.order.customerNumber = val.phoneNumber;
      },
      deep: true,
    },
  },
  mounted() {
    if (!this.auth.includes("Staff") && this.auth != "Customer") {
      this.getUser();
    }
    this.calcTotal();
    this.calcShipingFee();
    this.$mitt.on("itemAdded", (isOpen) => {
      if (isOpen) {
        this.calcTotal();
      }
    });
  },
  setup() {
    const isOpenModalUserDe = ref(false);
    const isOpenModalUserDeAct = () => {
      isOpenModalUserDe.value = !isOpenModalUserDe.value;
    };

    const isOpenModalAddressPay = ref(false);
    const isOpenModalAddressPayAct = () => {
      isOpenModalAddressPay.value = !isOpenModalAddressPay.value;
    };

    const isOpenModalStorePay = ref(false);
    const isOpenModalStorePayAct = () => {
      isOpenModalStorePay.value = !isOpenModalStorePay.value;
    };

    return {
      isOpenModalUserDe,
      isOpenModalUserDeAct,
      isOpenModalAddressPay,
      isOpenModalAddressPayAct,
      isOpenModalStorePay,
      isOpenModalStorePayAct,
    };
  },
};
</script>

<style scoped>
.black {
  color: black;
}
.modalError {
  font-size: 13px;
  color: red;
  text-align: left;
  margin-left: 16px;
  margin-top: 16px;
}
.payment-header {
  margin: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.payment-header i {
  font-size: 26px;
  color: white;
  margin-right: 16px;
  background-color: #fdd7a4;
  border: 2px solid #fdd7a4;
  border-radius: 50%;
  padding: 6px 8px;
}

.payment-container {
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
  display: flex;
  justify-content: space-evenly;
  min-height: 500px;
  margin-bottom: 30px;
}
.payment-container-deliveryDetail,
.payment-container-paymentDetail {
  width: 46%;
  border: 1px solid #fdd7a4;
  padding: 26px 20px;
  border-radius: 20px;
  position: relative;
}
.payment-container-deliveryDetail-item {
  border: none;
  background: none;
  width: 100%;
  cursor: pointer;
}
.payment-container-deliveryDetail-item,
.payment-container-paymentDetail-item {
  text-align: left;
  display: flex;
  align-items: center;
  margin-bottom: 36px;
}
.payment-container-deliveryDetail-item:last-child {
  align-items: flex-start;
}
.payment-container-deliveryDetail-item button {
  border: none;
  background: none;
}
.payment-container-deliveryDetail-item i,
.payment-container-paymentDetail-item i {
  font-size: 28px;
  color: #ff9f68;
}
.payment-container-deliveryDetail-item i::before,
.payment-container-paymentDetail-item i::before {
  font-weight: bold !important;
}
.payment-container-deliveryDetail-item_content {
  /* font-family: serif; */
  font-size: 18px;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.payment-container-deliveryDetail-item:last-child p {
  margin-left: 8px;
}
.payment-container-deliveryDetail-item_content textarea {
  resize: none;
  height: 110px;
  width: 100%;
  padding: 12px;
  border-radius: 16px;
  margin-top: 10px;
}

.payment-container-paymentDetail button {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 20px;
  width: 92%;
  border-radius: 14px;
  background-color: orange;
  cursor: pointer;
  border: none;
  color: white;
  font-weight: bold;
  font-size: 16px;
}
.payment-container-paymentDetail button:hover {
  opacity: 0.5;
}
.payment-container-paymentDetail-item {
  text-align: left;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.payment-container-paymentDetail-item_content {
  /* font-family: serif; */
  font-size: 18px;
  margin-left: 12px;
}
.payment-container-paymentDetail-text {
  display: flex;
  justify-content: space-between;
  /* font-family: serif; */
  font-size: 15px;
  margin-bottom: 20px;
}
.payment-container-paymentDetail-payment {
  margin-bottom: 20px;
}
.payment-container-paymentDetail-payment > div,
.payment-container-paymentDetail-payment > div > div {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  position: relative;
}
.payment-container-paymentDetail-payment label {
  display: flex;
  align-items: center;
  padding-left: 36px;
  cursor: pointer;
}
.payment-container-paymentDetail-payment img {
  width: 30px;
  height: auto;
  margin-right: 12px;
}
.payment-container-paymentDetail-payment p {
  font-size: 16px;
  font-weight: bold;
}
.payment-container-paymentDetail-text p:first-child {
  font-weight: bold;
}
.payment-container-paymentDetail button {
}

.payment-container-paymentDetail-payment input[type="radio"] {
  position: absolute;
  visibility: hidden;
  left: 5%;
  top: 50%;
  transform: translateY(-50%);
}
.payment-container-paymentDetail-payment .radio {
  display: block;
  position: absolute;
  border: 4px solid rgba(170, 170, 170, 1);
  border-radius: 100%;
  height: 25px;
  width: 25px;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  z-index: 5;
  transition: border 0.25s linear;
  -webkit-transition: border 0.25s linear;
}
.payment-container-paymentDetail-payment .radio::before {
  display: block;
  position: absolute;
  content: "";
  border-radius: 100%;
  height: 15px;
  width: 15px;
  /* top: 5px;
  left: 5px; */
  margin: auto;
}
.payment-container-paymentDetail-payment div:hover .radio {
  border: 5px solid rgba(170, 170, 170, 0.5);
}
.payment-container-paymentDetail-payment
  div
  input[type="radio"]:checked
  ~ label
  > .radio {
  border: 5px solid #edb724;
}
.payment-container-paymentDetail-payment
  div
  input[type="radio"]:checked
  ~ label
  .radio::before {
  background: #edb724;
}
.payment-container-paymentDetail-payment
  div
  input[type="radio"]:checked
  ~ label {
  color: #edb724;
}

/*Horizontal Ipad(1024 x 768)*/
@media screen and (max-width: 1024px) {
}

@media screen and (max-width: 992px) {
}

@media (max-width: 900px) {
  .payment-container {
    flex-direction: column;
    align-items: center;
  }
  .payment-container-deliveryDetail,
  .payment-container-paymentDetail {
    width: 90%;
  }
  .payment-container-paymentDetail {
    margin-top: 26px;
  }
  .payment-container-paymentDetail-payment {
    margin-bottom: 54px;
  }
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
  .payment-container-paymentDetail-text {
    font-size: 13px;
  }
}
/*Iphone(480 x 640)*/
@media screen and (max-width: 320px) {
}
/*Small phone*/
@media screen and (max-width: 240px) {
}
</style>
