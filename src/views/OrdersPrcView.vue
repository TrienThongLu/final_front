<template>
  <div class="order-container">
    <div class="order-header">
      <i class="bi bi-receipt-cutoff"></i>
      <span v-if="auth == 'Admin'"
        ><h1>Orders at</h1>
        <select v-model="store">
          <option v-for="store in stores" :key="store.id" :value="store">
            {{ store.name }}
          </option>
        </select></span
      >
      <h1 v-else>Orders at {{ store.name }}</h1>
    </div>
    <div class="order-body">
      <div class="order-body-item">
        <div class="order-body-item_header">
          <div>
            <i class="bi bi-play-circle"></i>
            <p>Processing</p>
          </div>
          <p>{{ ordersProcessing.length }}</p>
        </div>
        <div class="order-body-item_body">
          <div
            class="order-body-item_body_item"
            v-for="order in ordersProcessing"
            :key="order.id"
            @click="
              isOpenModalOrderDetailAct();
              orderDetailId = order.id;
            "
          >
            <div
              class="order-body-item_body_item_header processing"
              :style="
                order.type == 'Online'
                  ? 'background-color: greenyellow'
                  : 'background-color: aquamarine'
              "
            >
              <p>{{ order.type }}</p>
              <p
                :style="
                  order.isDone
                    ? 'background-color: #fdd7a4;'
                    : 'background-color: rgba(0, 0, 0, 0.2);'
                "
              >
                {{ order.isDone ? "Finished" : "Unfinished" }}
              </p>
            </div>
            <div class="order-body-item_body_item_body">
              <p>Id: {{ order.id }}</p>
              <div class="order-body-item_body_item_body_content">
                <p>{{ toLocaleNumber(order.amount) }}₫</p>
                <p>
                  {{ order.isPaid ? "Paid" : "Unpaid" }} ({{
                    order.paymentMethod
                  }})
                </p>
              </div>
              <p v-if="order.type == 'Online'">Address: {{ order.address }}</p>
              <p v-else>By: {{ order.takenBy.name }}</p>
              <p>{{ convertToTime(order.createdDate) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <modal-order-detail
    :ModalOrderDetailActive="isOpenModalOrderDetail"
    :OrderId="orderDetailId"
    @closeModalOrderDetail="isOpenModalOrderDetailAct"
  ></modal-order-detail>
</template>

<script>
import { ref } from "vue";
import ModalOrderDetail from "../components/ModalOrderDetail.vue";

export default {
  components: {
    ModalOrderDetail,
  },
  data() {
    return {
      ordersProcessing: [],
      orderDetailId: "",
      stores: [],
      store: {},
      interVal: undefined,
    };
  },
  methods: {
    toLocaleNumber(value) {
      const result = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return result;
    },
    convertToTime(value) {
      var date = new Date(value);
      return date.toLocaleTimeString();
    },
    async GetOrders() {
      try {
        const res = await this.$mainAxios.get(
          `Order/GetOrdersPrc/${this.store.id}`
        );
        if (res.status == 200) {
          console.log(res);
          this.ordersProcessing = res.data.orders;
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    async getStores() {
      if (this.auth == "Admin") {
        try {
          const res = await this.$mainAxios.get(
            `StoreLocation/GetStores?searchString=`
          );
          if (res.status == 200) {
            console.log(res);
            this.stores = res.data.data;
            this.store = this.stores[0];
          }
        } catch (error) {
          console.log(error.response);
        }
      } else {
        try {
          const res = await this.$mainAxios.get(
            `StoreLocation/GetStore/${this.$cookies.get("StoreId")}`
          );
          if (res.status == 200) {
            console.log(res);
            this.store = res.data.content;
          }
        } catch (error) {
          console.log(error.response);
        }
      }
    },
  },
  computed: {
    auth() {
      return this.$cookies.get("Auth");
    },
  },
  watch: {
    store() {
      this.GetOrders();
      this.interVal = setInterval(() => {
        this.GetOrders();
      }, 5000);
    },
  },
  mounted() {
    this.getStores();
  },
  unmounted() {
    clearInterval(this.interVal);
  },
  setup() {
    const isOpenModalOrderDetail = ref(false);
    const isOpenModalOrderDetailAct = () => {
      isOpenModalOrderDetail.value = !isOpenModalOrderDetail.value;
    };

    return {
      isOpenModalOrderDetail,
      isOpenModalOrderDetailAct,
    };
  },
};
</script>

<style scoped>
.order-container {
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
  min-height: 500px;
  margin-bottom: 30px;
}

.order-header {
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}
.order-header i {
  font-size: 30px;
  margin-right: 16px;
  border-radius: 50%;
  padding: 2px 4px;
}
.order-header > span {
  display: flex;
  align-items: center;
}
select {
  padding: 10px 14px;
  border-radius: 6px;
  border-color: #b3b3b3;
  border-style: double;
  border-width: 2px;
  height: 40px;
  margin-left: 12px;
}
select:focus {
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

.order-body {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.order-body-item {
  background-color: rgba(139, 139, 139, 0.2);
  width: 86%;
  height: 600px;
  border-radius: 10px;
}
.order-body-item_header {
  padding: 14px 22px;
  text-align: left;
  font-size: 18px;
  font-weight: bold;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.order-body-item:first-child .order-body-item_header {
  background-color: #8a8add;
}
.order-body-item:nth-child(2) .order-body-item_header {
  background-color: #eb9895;
}
.order-body-item:nth-child(3) .order-body-item_header {
  background-color: #bceb95;
}
.order-body-item:nth-child(4) .order-body-item_header {
  background-color: #95e5eb;
}
.processing {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.processing > p:last-child {
  font-size: 14px;
  padding: 4px;
  border-radius: 12px;
}
.order-body-item_header > div > * {
  display: inline-block;
}
.order-body-item_header > div > p {
  margin-left: 8px;
}
.order-body-item_header > i::before {
  font-weight: bold !important;
}
.order-body-item_body {
  height: calc(100% - 49px);
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 12px;
  padding: 10px;
  overflow-y: auto;
}
.order-body-item_body::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

.order-body-item_body::-webkit-scrollbar {
  width: 6px;
  background-color: #f5f5f5;
}

.order-body-item_body::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
.order-body-item_body_item {
  width: fit-content;
  height: fit-content;
  background-color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 6px;
  cursor: pointer;
}
/* .order-body-item_body_item:not(:first-child) {
  margin-top: 12px;
} */
.order-body-item_body_item:hover {
  opacity: 0.6;
}
.order-body-item_body_item_header {
  padding: 6px 26px;
  text-align: left;
  font-size: 18px;
  font-weight: bold;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.order-body-item_body_item_body {
  padding: 16px 10px;
  text-align: left;
  font-family: monospace;
  font-size: 16px;
  font-weight: 600;
}
.order-body-item_body_item_body > p:not(:first-child) {
  margin-top: 12px;
}
.order-body-item_body_item_body_content {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
}

/*Horizontal Ipad(1024 x 768)*/
@media screen and (max-width: 1024px) {
  /* .order-body-item {
    width: 32%;
    margin-top: 10px;
  } */
}

@media screen and (max-width: 992px) {
}

@media (max-width: 900px) {
}

/*Vertical Ipad(768 x 1024)*/
@media screen and (max-width: 768px) {
  /* .order-body-item {
    width: 48%;
    margin-top: 10px;
  } */
}
@media screen and (max-width: 700px) {
  .order-body-item_body_item {
    min-width: 86%;
  }
}
@media screen and (max-width: 560px) {
  .order-header > span {
    flex-direction: column;
    align-items: flex-start;
  }
  select {
    margin-left: 0;
    width: 80%;
  }
  /* .order-body-item {
    width: 92%;
    margin-top: 10px;
  } */
}
/*Small tablet(480 x 640)*/
@media screen and (max-width: 480px) {
  .order-header i {
    font-size: 26px;
  }
  .order-header h1 {
    font-size: 16px;
  }
}
/*Iphone(480 x 640)*/
@media screen and (max-width: 320px) {
}
/*Small phone*/
@media screen and (max-width: 240px) {
}
</style>