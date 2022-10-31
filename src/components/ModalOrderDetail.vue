<template>
  <div class="Modal" v-if="ModalOrderDetailActive">
    <span class="Modal-backdrop" @click="closeModalOrderDetail"></span>
    <transition name="bounce" appear>
      <div class="Modal-container">
        <div class="Modal-close" @click="closeModalOrderDetail">
          <i
            class="bi form-control-feedback bi-x-lg"
            style="font-size: 28px"
          ></i>
        </div>
        <div class="Modal-body">
          <div class="Modal-body-header">
            <div>
              <p>
                Order # ({{ orderDetail.type == 1 ? "At Store" : "Online" }})
              </p>
              <p>
                {{ orderDetail.sId }}
                <span
                  v-if="!auth.includes('Customer')"
                  @click="print(orderDetail.sId)"
                  >(Print bill)</span
                >
              </p>
            </div>
            <div>
              <p>Placed on</p>
              <p>{{ convertToDateTime(orderDetail.createdDate) }}</p>
            </div>
          </div>
          <div class="Modal-body-content">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody v-for="(item, i) in orderDetail.items" :key="item">
                <tr>
                  <td>{{ i + 1 }}</td>
                  <td>{{ item.name }} ({{ item.size }})</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ toLocaleNumber(item.price) }}₫</td>
                  <td>{{ toLocaleNumber(item.price * item.quantity) }}₫</td>
                </tr>
                <tr v-for="topping in item.topping" :key="topping.id">
                  <td></td>
                  <td style="padding-left: 40px">+ {{ topping.name }}</td>
                  <td>{{ topping.quantity }} (x{{ item.quantity }})</td>
                  <td>{{ toLocaleNumber(topping.price) }}₫</td>
                  <td>
                    {{
                      toLocaleNumber(
                        topping.price * (topping.quantity * item.quantity)
                      )
                    }}₫
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <div class="Modal-body-content_bottom">
              <div>
                <p>Note: {{ orderDetail.note }}</p>
                <div v-if="orderDetail.type == 0">
                  <p>
                    Customer Name: <b>{{ orderDetail.customerInfo.name }}</b>
                  </p>
                  <p>
                    Customer Phone number:
                    <b>{{ orderDetail.customerInfo.phonenumber }}</b>
                  </p>
                  <p>
                    Customer Address:
                    <b>{{ orderDetail.customerInfo.address }}</b>
                  </p>
                </div>
                <div v-else>
                  <p
                    v-if="
                      orderDetail.takenBy.isCustomer &&
                      (this.$route.name == 'orders' ||
                        this.$route.name == 'ordersPrc')
                    "
                  >
                    Taken By:
                    <b class="isCustomer" @click="isOpenModalChangeCusAct()">{{
                      orderDetail.takenBy.name
                    }}</b>
                  </p>
                  <p v-else>
                    Taken By: <b>{{ orderDetail.takenBy.name }}</b>
                  </p>
                </div>
              </div>
              <div class="bottom-right">
                <p>
                  Payment Method:
                  <b>{{ toLocaleNumber(orderDetail.paymentMethod) }}</b>
                </p>
                <p>
                  Subtotal: <b>{{ toLocaleNumber(orderDetail.totalPrice) }}₫</b>
                </p>
                <p>
                  Discount: <b>{{ orderDetail.discountPercent }}%</b>
                </p>
                <p>
                  Amount: <b>{{ toLocaleNumber(orderDetail.amount) }}₫</b>
                </p>
                <div v-if="auth == 'Admin'">
                  <div v-if="orderDetail.paymentMethod.includes('MoMo')">
                    <p>
                      Request Id:
                      <b>{{ orderDetail.paymentInfo.moMoRequestId }}%</b>
                    </p>
                    <p>
                      Transition Id:
                      <b>{{ orderDetail.paymentInfo.moMoTransId }}%</b>
                    </p>
                  </div>
                  <div v-else-if="orderDetail.paymentMethod == 'PayPal'">
                    <p>
                      Pay Id: <b>{{ orderDetail.paymentInfo.ppPayId }}%</b>
                    </p>
                    <p>
                      Payer: <b>{{ orderDetail.paymentInfo.ppPayer }}%</b>
                    </p>
                    <p>
                      Token: <b>{{ orderDetail.paymentInfo.ppToken }}%</b>
                    </p>
                  </div>
                  <span v-else style="display: none"></span>
                </div>
                <span v-else style="display: none"></span>
              </div>
            </div>
            <div
              v-if="
                this.$route.name == 'orders' || this.$route.name == 'ordersPrc'
              "
            >
              <div v-if="this.$route.name == 'ordersPrc'">
                <button
                  class="modal-submit"
                  style="width: 100%"
                  @click="finishOrder()"
                >
                  Finish
                </button>
              </div>
              <div v-else-if="orderDetail.status == 1">
                <button
                  class="modal-submit"
                  style="width: 100%"
                  :disabled="!orderDetail.isDone"
                  :style="!orderDetail.isDone ? 'cursor: auto' : ''"
                  @click="nextStage()"
                >
                  {{ orderDetail.type == 0 ? "Delivery" : "Complete" }}
                </button>
              </div>
              <div v-else-if="orderDetail.status == 2">
                <button
                  class="modal-submit"
                  style="width: 100%"
                  @click="completeOrder()"
                >
                  Complete
                </button>
              </div>
              <div v-else-if="orderDetail.status == 0">
                <button
                  class="modal-submit"
                  style="width: 100%"
                  @click="completeOrder()"
                >
                  Complete
                </button>
              </div>
              <span v-else style="display: none"></span>
            </div>
            <span v-else style="display: none"></span>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <span v-else style="display: none"></span>
  <div v-if="orderDetail.takenBy.isCustomer">
    <modal-change-cus
      :ModalChangeCusActive="isOpenModalChangeCus"
      :OrderId="orderDetail.sId"
      :StoreId="orderDetail.storeId"
      :CustomerId="orderDetail.takenBy.id"
      @closeModalChangeCus="isOpenModalChangeCusAct"
      @customerSubmit="getOrderDetail(OrderId)"
    ></modal-change-cus>
  </div>
</template>

<script>
import { ref } from "vue";
import ModalChangeCus from "../components/ModalChangeCus.vue";

export default {
  name: "Modal-OrderDetail",
  components: {
    ModalChangeCus,
  },
  props: ["ModalOrderDetailActive", "OrderId"],
  emits: ["closeModalOrderDetail"],
  setup(props, { emit }) {
    const closeModalOrderDetail = () => {
      emit("closeModalOrderDetail");
    };

    const isOpenModalChangeCus = ref(false);
    const isOpenModalChangeCusAct = () => {
      isOpenModalChangeCus.value = !isOpenModalChangeCus.value;
    };

    return {
      closeModalOrderDetail,
      isOpenModalChangeCus,
      isOpenModalChangeCusAct,
    };
  },
  data() {
    return this.initialState();
  },
  computed: {
    auth() {
      return this.$cookies.get("Auth");
    },
  },
  methods: {
    initialState() {
      return {
        orderDetail: {
          sId: "",
          type: undefined,
          status: undefined,
          totalPrice: undefined,
          discountPercent: undefined,
          amount: undefined,
          createdDate: undefined,
          customerInfo: undefined,
          isDone: undefined,
          isPaid: undefined,
          items: undefined,
          note: undefined,
          paymentInfo: undefined,
          paymentMethod: "",
          storeId: "",
          takenBy: { id: "", name: "" },
        },

        orderId: "",
      };
    },
    reset() {
      this.orderDetail = this.initialState().orderDetail;
    },
    toLocaleNumber(value) {
      if (value) {
        const result = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return result;
      }
    },
    convertToDateTime(value) {
      var date = new Date(value);
      return date.toLocaleString();
    },
    async getOrderDetail(value) {
      try {
        const res = await this.$mainAxios.get(`Order/GetOrder/${value}`);
        if (res.status == 200) {
          console.log(res);
          this.orderDetail = res.data.content;
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    async nextStage() {
      try {
        const res = await this.$mainAxios.put(
          `Order/NextStatus/${this.orderDetail.sId}`
        );
        if (res.status == 200) {
          console.log(res);
          this.$router.go();
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    async completeOrder() {
      try {
        const res = await this.$mainAxios.put(
          `Order/CompleteOrder/${this.orderDetail.sId}`
        );
        if (res.status == 200) {
          console.log(res);
          this.$router.go();
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    async finishOrder() {
      try {
        const res = await this.$mainAxios.put(
          `Order/OrderDone/${this.orderDetail.sId}`
        );
        if (res.status == 200) {
          console.log(res);
          this.$router.go();
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    async print(value) {
      try {
        const res = await this.$mainAxios.get(`Order/getFileOrder/${value}`, {
          responseType: "arraybuffer",
        });
        if (res.status == 200) {
          console.log(res);

          var blob = new Blob([res.data], { type: "application/pdf" });
          var blobURL = URL.createObjectURL(blob);

          var link = document.createElement("a");
          link.href = blobURL;
          link.download = value + ".pdf";
          link.dispatchEvent(new MouseEvent("click"));
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    convertToByteArray(input) {
      var sliceSize = 512;
      var bytes = [];

      for (var offset = 0; offset < input.length; offset += sliceSize) {
        var slice = input.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);

        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        bytes.push(byteArray);
      }

      return bytes;
    },
  },
  watch: {
    ModalOrderDetailActive(value) {
      const body = document.querySelector("body");
      if (value) {
        body.style.overflow = "hidden";
        this.getOrderDetail(this.OrderId);
      } else {
        body.style.overflow = "auto";
        this.reset();
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
  width: 94%;
  max-width: 1000px;
  height: 94%;
  /* min-height: 500px; */
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
  padding: 42px 24px 24px 24px;
  text-align: center;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.Modal-body-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  height: 52px;
}
.Modal-body-header > div > p:first-child {
  font-weight: bold;
  color: #adb5bd;
}
.Modal-body-header span {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
.Modal-body-header span:hover {
  opacity: 0.6;
}

.Modal-body-content {
  margin-top: 20px;
  flex: 1 1 auto;
  overflow: auto;
  /* min-height: 400px; */
}
.Modal-body-content::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}
.Modal-body-content::-webkit-scrollbar {
  width: 6px;
  background-color: #f5f5f5;
}
.Modal-body-content::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
.Modal-body-content table {
  width: 100%;
  padding: 0 12px;
  border-collapse: collapse;
}
thead::after {
  content: "@";
  display: block;
  line-height: 10px;
  text-indent: -99999px;
}
.Modal-body-content table thead {
  font-size: 20px;
}
.Modal-body-content table tbody tr td:nth-child(2) {
  text-align: left;
}
.Modal-body-content table tbody tr:first-child td:nth-child(2) {
  padding-left: 20px;
}
.Modal-body-content table tbody tr td {
  font-size: 18px;
}
.Modal-body-content table th {
  padding: 6px 0;
  background-color: #dccdc6;
  position: sticky;
  top: 0;
}
.Modal-body-content table thead th:first-child {
  border-top-left-radius: 18px;
  border-bottom-left-radius: 18px;
}
.Modal-body-content table thead th:last-child {
  border-top-right-radius: 18px;
  border-bottom-right-radius: 18px;
}
.Modal-body-content table thead tr th:first-child {
  padding-left: 18px;
  text-align: left;
}
.Modal-body-content table td:not(:last-child) {
  border-right: 2px black solid;
}

.Modal-body-content_bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 24px 0;
  text-align: left;
  font-size: 16px;
  font-weight: normal;
  font-family: cursive;
}
.Modal-body-content_bottom > div:first-child {
  width: 62%;
}
.isCustomer {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
.isCustomer:hover {
  opacity: 0.5;
}
.bottom-right {
  text-align: right;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-submit {
  width: 48%;
  padding: 16px 14px;
  border-radius: 16px;
  cursor: pointer;
}
.modal-submit:hover {
  opacity: 0.5;
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

/*Horizontal Ipad(1024 x 768)*/
@media screen and (max-width: 1024px) {
}
@media screen and (max-width: 992px) {
}
@media (max-width: 900px) {
}
/*Vertical Ipad(768 x 1024)*/
@media screen and (max-width: 768px) {
}
@media screen and (max-width: 700px) {
  .Modal-body-content table thead th:nth-child(2),
  .Modal-body-content table tbody td:nth-child(2) {
    min-width: 350px;
  }
  .Modal-body-content table thead th:nth-child(3),
  .Modal-body-content table tbody td:nth-child(3),
  .Modal-body-content table thead th:nth-child(4),
  .Modal-body-content table tbody td:nth-child(4),
  .Modal-body-content table thead th:nth-child(5),
  .Modal-body-content table tbody td:nth-child(5) {
    min-width: 110px;
  }
  .Modal-body-header {
    flex-direction: column;
    height: auto;
    text-align: left;
    align-items: flex-start;
  }
}
@media screen and (max-width: 560px) {
  .Modal-body-content_bottom > div {
    width: 100% !important;
  }
  .Modal-body-content_bottom {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
  .bottom-right {
    text-align: left;
  }
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
