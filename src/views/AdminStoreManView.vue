<template>
  <div class="container">
    <div class="title">
      <p>Store Management</p>
      <button @click="isOpenModalAddStoreAct">Add Store</button>
    </div>
    <div class="table-container">
      <div class="container-wrap">
        <div class="table-search">
          <h3>Store List</h3>
          <div style="position: relative">
            <input
              type="text"
              placeholder="Search store"
              v-model="searchString"
            />
            <i class="bi bi-search"></i>
          </div>
        </div>
        <div class="table">
          <table>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Open Time</th>
              <th></th>
            </tr>
            <tr
              v-for="store in stores"
              :key="store.id"
              @click="storeDetailAct(store.id)"
            >
              <td>{{ store.name }}</td>
              <td>{{ store.address }}</td>
              <td>{{ store.startTime }}:00 - {{ store.closeTime }}:00</td>
              <td @click.stop="openModalConfirmAct(), (idDelete = store.id)">
                <i class="bi bi-trash"></i>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
  <modal-add-store
    :ModalAddStoreActive="isOpenModalAddStore"
    @closeModalAddStore="isOpenModalAddStoreAct"
  ></modal-add-store>
  <modal-store-detail
    :ModalStoreDetailActive="isOpenModalStoreDetail"
    :StoreDetailId="storeDetailId"
    @closeModalStoreDetail="isOpenModalStoreDetailAct"
  ></modal-store-detail>
  <component
    :is="'modal-confirm'"
    :ModalConfirmActive="openModalConfirm"
    @closeModalConfirm="openModalConfirmAct"
  >
    <div class="modal-confirm">
      <p>Are you sure you want to delete this store</p>
      <p class="modalError">{{ Error }}</p>
      <div>
        <button @click="openModalConfirmAct()" style="background-color: red">
          No
        </button>
        <button @click="deleteStore(idDelete)" style="background-color: green">
          Yes
        </button>
      </div>
    </div>
  </component>
</template>

<script>
var timeOut;
import { ref } from "vue";
import ModalAddStore from "../components/ModalAddStore.vue";
import ModalStoreDetail from "../components/ModalStoreDetail.vue";

export default {
  components: {
    ModalAddStore,
    ModalStoreDetail,
  },
  data() {
    return {
      orders: [],
      stores: [],
      storeDetailId: "",

      searchString: "",
      idDelete: "",
      Error: "",
    };
  },
  methods: {
    storeDetailAct(value) {
      this.storeDetailId = value;
      this.isOpenModalStoreDetailAct();
    },
    async getStores() {
      try {
        const res = await this.$mainAxios.get(
          `StoreLocation/GetStores?searchString=${this.searchString}`
        );
        if (res.status == 200) {
          this.stores = res.data.data;
          console.log(res);
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    async deleteStore(idDelete) {
      try {
        const res = await this.$mainAxios.delete(
          `StoreLocation/DeleteStore/${idDelete}`
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
    searchString() {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        this.getStores();
      }, 300);
    },
  },
  mounted() {
    this.getStores();
  },
  setup() {
    const isOpenModalAddStore = ref(false);
    const isOpenModalAddStoreAct = () => {
      isOpenModalAddStore.value = !isOpenModalAddStore.value;
    };

    const isOpenModalStoreDetail = ref(false);
    const isOpenModalStoreDetailAct = () => {
      isOpenModalStoreDetail.value = !isOpenModalStoreDetail.value;
    };

    const openModalConfirm = ref(false);
    const openModalConfirmAct = () => {
      openModalConfirm.value = !openModalConfirm.value;
    };

    return {
      isOpenModalAddStore,
      isOpenModalAddStoreAct,
      isOpenModalStoreDetail,
      isOpenModalStoreDetailAct,
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
.table-search i {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
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
}
.table th:last-child,
.table td:last-child {
  min-width: unset;
  color: red;
}
.table-container table th {
  text-align: center;
}
.table td {
  text-align: left;
}
.table td:nth-child(3) {
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