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
      <div class="table-container">
        <div class="container-wrap">
          <div class="table-search">
            <h3>Order List</h3>
            <select v-model="filter.type">
              <option value="" selected>All Type</option>
              <option :value="0">Online</option>
              <option :value="1">At store</option>
            </select>
            <input
              type="date"
              id="date"
              min="2022-09-01"
              v-model="filter.date"
              @keypress="(e) => e.preventDefault()"
            />
            <div style="position: relative">
              <input
                type="text"
                placeholder="Search id/phone number"
                v-model="filter.searchString"
              />
              <i class="bi bi-search"></i>
            </div>
          </div>
          <div class="table">
            <table>
              <tr>
                <th>Id</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Payment</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
              <tr
                v-for="order in orders"
                :key="order.id"
                @click="orderDetailAct(order.sId)"
              >
                <td>{{ order.sId }}</td>
                <td>{{ order.phonenumber }}</td>
                <td>{{ order.type }}</td>
                <td>{{ order.paymentMethod }}</td>
                <td>{{ toLocaleNumber(order.amount) }}₫</td>
                <td>{{ convertToDate(order.createdDate) }}</td>
                <td>{{ order.status }}</td>
              </tr>
            </table>
          </div>
          <div v-if="orders.length > 0" class="pagination-container pagination">
            <component
              :is="'pagination-list'"
              :totalPages="pagination.totalPage"
              :currentPage="pagination.currentPage"
              @pagechanged="onPageChange"
            >
            </component>
          </div>
          <span v-else style="display: none"></span>
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
var timeOut;
import { ref } from "vue";
import ModalOrderDetail from "../components/ModalOrderDetail.vue";

export default {
  components: {
    ModalOrderDetail,
  },
  data() {
    return {
      orders: [],
      orderDetailId: "",
      stores: [],
      store: {},

      filter: {
        type: "",
        date: "",
        searchString: "",
      },

      pagination: {
        totalPage: 1,
        currentPage: 1,
      },

      interVal: undefined,
    };
  },
  methods: {
    orderDetailAct(value) {
      this.orderDetailId = value;
      this.isOpenModalOrderDetailAct();
    },
    toLocaleNumber(value) {
      const result = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return result;
    },
    onPageChange(page) {
      this.pagination.currentPage = page;
      this.GetOrders();
    },
    convertToDate(value) {
      var date = new Date(value);
      return date.toLocaleDateString();
    },
    async GetOrders() {
      try {
        let date = "";
        if (this.filter.date) {
          date = Date.parse(this.filter.date);
        }
        const res = await this.$mainAxios.get(
          `Order/GetOrdersAtStore/${this.store.id}?currentPage=${this.pagination.currentPage}&searchString=${this.filter.searchString}&type=${this.filter.type}&date=${date}`
        );
        if (res.status == 200) {
          this.orders = res.data.data;
          this.pagination.totalPage = res.data.totalPage;
          console.log(res);
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
    },
    "filter.type"() {
      this.GetOrders();
    },
    "filter.date"() {
      this.GetOrders();
    },
    "filter.searchString"() {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        this.GetOrders();
      }, 300);
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
  /* display: flex;
  flex-wrap: wrap;
  justify-content: space-around; */
}

.table-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.container-wrap {
  width: 98%;
  overflow: auto;
  border-radius: 10px;
  background-color: #e9eeee;
  padding: 30px 6px;
  position: relative;
  padding-bottom: 80px;
}
.table-search {
  /* position: relative; */
  width: 100%;
  /* height: 40px; */
  /* margin: 0 auto; */
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
}
.table-search:nth-child(2) {
  margin-top: 12px;
}
.table-search:nth-child(2) p {
  margin-right: 8px;
}
.table-search input,
.table-search select {
  padding: 10px;
  border-radius: 12px;
  border: 1px solid black;
}
.table-search i {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
.table {
  width: 98%;
  margin-right: auto;
  margin-left: auto;
  height: 420px;
  overflow: auto;
  margin-top: 16px;
  border: 1px solid black;
  border-radius: 6px;
}
.table::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

.table::-webkit-scrollbar {
  width: 8px;
  background-color: #f5f5f5;
}

.table::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
.table-container table {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  text-align: left;
  border-spacing: 0;
  border-collapse: separate;
}
table th {
  position: sticky;
  top: 0;
  background: #eabf43;
}
.table-container table th,
.table-container table td {
  min-width: 160px;
  text-align: center;
}
.table td:last-child:hover {
  opacity: 0.5;
}
.table-container table th:last-child,
.table-container table th:nth-child(3),
.table-container table td:last-child,
.table-container table td:nth-child(3) {
  /* width: 15%; */
}
.table-container table tr:first-child {
  color: #ffffff;
  background: #eabf43;
}
.table-container table tr th:first-child,
.table-container table tr td:first-child {
  padding-left: 18px;
}
.table-container table tr td {
  border-bottom: 2px solid #f2f2f2;
}
.table-container table tr td:first-child {
  border-left: 2px solid #f2f2f2;
}
.table-container table tr td:last-child {
  border-right: 2px solid #f2f2f2;
}
/* .table-container table tr:first-child th:first-child {
  border-top-left-radius: 10px;
}
.table-container table tr:first-child th:last-child {
  border-top-right-radius: 10px;
}
.table-container table tr:last-child td:last-child {
  border-bottom-right-radius: 10px;
}
.table-container table tr:last-child td:first-child {
  border-bottom-left-radius: 10px;
} */
.table-container table tr:not(:first-child) {
  border-bottom: 1px solid #f2f2f2;
  cursor: pointer;
  background-color: white;
}
.table-container table tr:not(:first-child):hover {
  background-color: #ececff;
}
.table-container table th,
.table-container table td {
  padding: 18px 10px;
}
.pagination-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20px;
}

/*Horizontal Ipad(1024 x 768)*/
@media screen and (max-width: 1024px) {
  .order-body-item {
    width: 32%;
    margin-top: 10px;
  }
}

@media screen and (max-width: 992px) {
}

@media (max-width: 900px) {
}

/*Vertical Ipad(768 x 1024)*/
@media screen and (max-width: 768px) {
  .table-search select,
  .table-search input {
    margin: 4px 16px;
  }
  .table-search i {
    right: 24px;
  }
}
@media screen and (max-width: 700px) {
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
  .order-body-item {
    width: 92%;
    margin-top: 10px;
  }
}
/*Small tablet(480 x 640)*/
@media screen and (max-width: 480px) {
  .order-header i {
    font-size: 26px;
  }
  .order-header h1 {
    font-size: 16px;
  }
  .table-search h3 {
    font-size: 14px;
  }
  .table-search input {
    width: 160px;
  }
}
/*Iphone(480 x 640)*/
@media screen and (max-width: 320px) {
}
/*Small phone*/
@media screen and (max-width: 240px) {
}
</style>
