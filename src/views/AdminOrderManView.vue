<template>
  <div class="container">
    <!-- <div class="order-dashboard">
      <div class="order-dashboard_item">
        <div class="order-dashboard_item_icon">
          <i class="bi bi-receipt"></i>
        </div>
        <div class="order-dashboard_item_text">
          <p>Orders</p>
          <p>{{ toLocaleNumber(1000) }}</p>
        </div>
      </div>
      <div class="order-dashboard_item">
        <div class="order-dashboard_item_icon">
          <i class="bi bi-currency-dollar"></i>
        </div>
        <div class="order-dashboard_item_text">
          <p>Revenue</p>
          <p><i class="bi bi-currency-dollar"></i>{{ toLocaleNumber(1000) }}</p>
        </div>
      </div>
    </div> -->
    <div class="title">
      <p>Order Management</p>
    </div>
    <div class="table-container">
      <div class="container-wrap">
        <div class="table-search">
          <h3>Order List</h3>
          <select v-model="filter.storeId" style="max-width: 200px">
            <option value="" selected>All Stores</option>
            <option v-for="store in stores" :key="store.id" :value="store.id">
              {{ store.name }}
            </option>
          </select>
          <select v-model="filter.type">
            <option value="" selected>All Type</option>
            <option :value="0">Online</option>
            <option :value="1">At store</option>
          </select>
          <input
            type="date"
            id="date"
            min="2022-09-01"
            :max="new Date().toISOString().split('T')[0]"
            v-model="filter.date"
            @keypress="(e) => e.preventDefault()"
          />
        </div>
        <div class="table">
          <table>
            <tr>
              <th>Id</th>
              <th>Store</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th></th>
            </tr>
            <tr
              v-for="order in orders"
              :key="order.sId"
              @click="orderDetailAct(order.sId)"
            >
              <td>{{ order.sId }}</td>
              <td>{{ order.store }}</td>
              <td>{{ order.type }}</td>
              <td>{{ toLocaleNumber(order.amount) }}₫</td>
              <td>{{ convertToDate(order.createdDate) }}</td>
              <td>{{ order.status }}</td>
              <td @click.stop="openModalConfirmAct(), (idDelete = order.sId)">
                <i class="bi bi-trash"></i>
              </td>
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
  <modal-order-detail
    :ModalOrderDetailActive="isOpenModalOrderDetail"
    :OrderId="orderDetailId"
    @closeModalOrderDetail="isOpenModalOrderDetailAct"
  ></modal-order-detail>
  <component
    :is="'modal-confirm'"
    :ModalConfirmActive="openModalConfirm"
    @closeModalConfirm="openModalConfirmAct"
  >
    <div class="modal-confirm">
      <p>Are you sure you want to delete this order</p>
      <p class="modalError">{{ Error }}</p>
      <div>
        <button @click="openModalConfirmAct()" style="background-color: red">
          No
        </button>
        <button @click="deleteOrder(idDelete)" style="background-color: green">
          Yes
        </button>
      </div>
    </div>
  </component>
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
      orders: [],
      stores: [],
      orderDetailId: "",

      pagination: {
        totalPage: 1,
        currentPage: 1,
      },
      filter: {
        storeId: "",
        type: "",
        date: "",
      },
      idDelete: "",
      Error: "",
    };
  },
  methods: {
    orderDetailAct(value) {
      this.orderDetailId = value;
      this.isOpenModalOrderDetailAct();
    },
    onPageChange(page) {
      this.pagination.currentPage = page;
      this.getListOrders();
    },
    convertToDate(value) {
      var date = new Date(value);
      return date.toLocaleDateString();
    },
    toLocaleNumber(value) {
      const result = value
        .toString()
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return result;
    },
    async getListOrders() {
      try {
        let date = "";
        if (this.filter.date) {
          date = Date.parse(this.filter.date);
        }
        const res = await this.$mainAxios.get(
          `Order/GetOrder?currentPage=${this.pagination.currentPage}&type=${this.filter.type}&storeId=${this.filter.storeId}&date=${date}`
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
      try {
        const res = await this.$mainAxios.get(`StoreLocation/GetStores`);
        if (res.status == 200) {
          this.stores = res.data.data;
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    async deleteOrder(idDelete) {
      try {
        const res = await this.$mainAxios.delete(
          `Order/DeleteOrder/${idDelete}`
        );
        if (res.status == 200) {
          console.log(res);
          this.$router.go();
        }
      } catch (error) {
        console.log(error.response);
      }
    },
  },
  watch: {
    "filter.storeId"() {
      this.getListOrders();
    },
    "filter.type"() {
      this.getListOrders();
    },
    "filter.date"() {
      this.getListOrders();
    },
  },
  mounted() {
    this.getListOrders();
    this.getStores();
  },
  setup() {
    const isOpenModalOrderDetail = ref(false);
    const isOpenModalOrderDetailAct = () => {
      isOpenModalOrderDetail.value = !isOpenModalOrderDetail.value;
    };

    const openModalConfirm = ref(false);
    const openModalConfirmAct = () => {
      openModalConfirm.value = !openModalConfirm.value;
    };

    return {
      isOpenModalOrderDetail,
      isOpenModalOrderDetailAct,
      openModalConfirm,
      openModalConfirmAct,
    };
  },
};
</script>

<style scoped>
.container {
  position: relative;
  overflow-x: auto;
  left: 244px;
  width: calc(100vw - 244px);
  /* height: calc(100vh - 72px); */
  height: 100vh;
  background-color: #e9eeee;
  padding-top: 20px;
}
.order-dashboard {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  width: 94%;
  margin: 0 auto;
}
.order-dashboard_item {
  width: 30%;
  height: 100px;
  background-color: white;
  border-radius: 1rem;
  padding: 20px;
  display: flex;
  align-items: center;
}
.order-dashboard_item_icon {
  color: white;
  position: relative;
  border-radius: 20px;
  padding: 10px;
  margin-right: 12px;
  background-color: rgba(59, 118, 225, 1) !important;
  height: 52px;
  width: 52px;
}
.order-dashboard_item_icon i {
  font-size: 26px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.order-dashboard_item_text {
  display: flex;
  flex-direction: column;
  text-align: left;
  justify-content: space-around;
  height: 100%;
}
.order-dashboard_item_text p:first-child {
  color: #7f838b !important;
}
.order-dashboard_item_text p:last-child {
  font-size: 18px;
  font-weight: 800;
}
.title {
  position: relative;
  top: 34px;
  margin-right: auto;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 88%;
}
.title p {
  font-size: 20px;
  font-weight: 700;
}
.title button {
  color: white;
  height: 32px;
  width: 130px;
  font-weight: 800;
  border-radius: 12px;
  border-color: transparent;
  background-color: #ffb100;
  cursor: pointer;
}
.title button:hover {
  color: black;
}
.table-container {
  margin-top: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container-wrap {
  width: 98%;
  overflow: auto;
  border-radius: 10px;
  background-color: white;
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
.table th:last-child,
.table td:last-child {
  min-width: unset;
  color: red;
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
.table tr td img {
  width: 100px;
  height: 100px;
  object-fit: contain;
}
.pagination-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20px;
}

.modal-confirm p {
  font-size: 16px;
}
.modal-confirm > div {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 16px;
}
.modal-confirm button {
  height: 40px;
  width: 120px;
  font-weight: 600;
  border-radius: 12px;
  border-color: transparent;
  cursor: pointer;
}

@media screen and (max-width: 1140px) {
  .container {
    left: 190px;
    width: calc(100vw - 190px);
  }
}
@media screen and (max-width: 992px) {
  .container {
    position: relative;
    left: 0;
    width: 100vw;
    height: calc(100vh - 53px);
    padding-top: 20px;
  }
}

/*Vertical Ipad(768 x 1024)*/
@media screen and (max-width: 768px) {
  .table-search select,
  .table-search input {
    margin: 4px 16px;
  }
}
@media screen and (max-width: 700px) {
}
@media screen and (max-width: 640px) {
  .order-dashboard {
    flex-direction: column;
  }
  .order-dashboard_item {
    width: 100%;
  }
  .order-dashboard_item:last-child {
    margin-top: 20px;
  }
}
@media screen and (max-width: 560px) {
  /* .table-search {
    width: 94%;
  } */
}
/*Small tablet(480 x 640)*/
@media screen and (max-width: 480px) {
  .title p {
    font-size: 14px;
  }
  .title button {
    height: 28px;
    width: 100px;
    font-size: 12px;
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
