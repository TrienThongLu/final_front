<template>
  <div class="Modal" v-if="ModalPaymentDetailActive">
    <span class="Modal-backdrop" @click="closeModalPaymentDetail"></span>
    <transition name="bounce" appear>
      <div class="Modal-container">
        <div class="Modal-close" @click="closeModalPaymentDetail">
          <i
            class="bi form-control-feedback bi-x-lg"
            style="font-size: 22px"
          ></i>
        </div>
        <div class="Modal-body" v-if="type == 'MoMo'">
          <h1>MoMo Payment Detail</h1>
          <div class="Modal_inputs">
            <div class="Modal_input">
              <label>Payment Id</label>
              <input type="text" :disabled="true" v-model="momo.orderId" />
            </div>
            <div class="Modal_input">
              <label>RequestId</label>
              <input type="text" :disabled="true" v-model="momo.requestId" />
            </div>
          </div>
          <div class="Modal_inputs">
            <div class="Modal_input">
              <label>Amount</label>
              <input type="text" :disabled="true" v-model="Amount" />
            </div>
            <div class="Modal_input">
              <label>Transition Id</label>
              <input type="text" :disabled="true" v-model="momo.transId" />
            </div>
          </div>
          <div class="Modal_inputs">
            <div class="Modal_input">
              <label>Pay Type</label>
              <input type="text" :disabled="true" v-model="momo.payType" />
            </div>
            <div class="Modal_input">
              <label>Message</label>
              <input type="text" :disabled="true" v-model="momo.message" />
            </div>
          </div>
        </div>
        <div class="Modal-body" v-else>
          <h1>PayPal Payment Detail</h1>
          <div class="Modal_inputs">
            <div class="Modal_input">
              <label>Payment Id</label>
              <input type="text" :disabled="true" v-model="paypal.id" />
            </div>
            <div class="Modal_input">
              <label>Payer Id</label>
              <input type="text" :disabled="true" v-model="paypal.payer" />
            </div>
          </div>
          <div class="Modal_inputs">
            <div class="Modal_input">
              <label>Amount</label>
              <input type="text" :disabled="true" v-model="Amount" />
            </div>
            <div class="Modal_input">
              <label>State</label>
              <input type="text" :disabled="true" v-model="paypal.state" />
            </div>
          </div>
          <div class="Modal_inputs">
            <div class="Modal_input">
              <label>Pay Type</label>
              <input type="text" :disabled="true" v-model="paypal.type" />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <span v-else style="display: none"></span>
</template>

<script>
export default {
  name: "Modal-PaymentDetail",
  props: ["ModalPaymentDetailActive", "OrderId"],
  setup(props, { emit }) {
    const closeModalPaymentDetail = () => {
      emit("closeModalPaymentDetail");
    };
    return { closeModalPaymentDetail };
  },
  data() {
    return {
      Amount: "",
      type: "",
      momo: {
        type: "",
        orderId: "",
        requestId: "",
        amount: "",
        transId: "",
        payType: "",
        message: "",
      },
      paypal: {
        amount: "",
        createdTime: "",
        id: "",
        state: "",
        type: "",
        payer: "",
      },
    };
  },
  methods: {
    toLocaleNumber(value) {
      if (value) {
        const result = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return result;
      }
    },
    async getPaymentDetail() {
      try {
        const res = await this.$mainAxios.get(
          `Order/OnlinePayDetail/${this.OrderId}`
        );
        if (res.status == 200) {
          if (res.data.type == "MoMo") {
            this.momo = res.data;
            this.type = res.data.type;
          } else {
            this.paypal = res.data;
            this.type = res.data.type;
          }
          console.log(res);
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
    ModalPaymentDetailActive(value) {
      if (value) {
        this.getPaymentDetail();
      }
    },
    "momo.amount"(newValue) {
      this.Amount = this.toLocaleNumber(newValue) + "₫";
    },
    "paypal.amount"(newValue) {
      this.Amount = "$" + this.toLocaleNumber(newValue);
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
.Modal_input input,
.Modal_input span {
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
