<template>
  <div class="container">
    <div class="title">
      <p>Item Management</p>
      <button @click="modalAddItemAct">Add Item</button>
    </div>
    <div class="table-container">
      <div class="container-wrap">
        <div class="table-search">
          <h3>Item List</h3>
          <div class="table-search-search">
            <select v-model="filter.typeFilter">
              <option value="" selected>All Type</option>
              <option v-for="type in types" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
          </div>
          <div class="table-search-search">
            <select v-model="filter.stock">
              <option value="" selected>All Stock</option>
              <option :value="0">In Stock</option>
              <option :value="1">Out of Stock</option>
            </select>
          </div>
          <div style="position: relative">
            <input
              type="text"
              placeholder="Search item"
              v-model="filter.searchString"
            />
            <i class="bi bi-search"></i>
          </div>
        </div>
        <div class="table">
          <table>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Type</th>
              <th>Price</th>
              <th>In Stock</th>
              <th></th>
            </tr>
            <tr
              v-for="item in items"
              :key="item.id"
              @click="
                modalItemDetailAct();
                itemDetailAct(item);
              "
            >
              <td>
                <div
                  style="
                    width: fit-content;
                    border: 1px solid;
                    border-radius: 26px;
                    overflow: hidden;
                  "
                >
                  <img :src="item.image" alt="" />
                </div>
              </td>
              <td>{{ item.name }}</td>
              <td>{{ getItemType(item.typeId) }}</td>
              <td>{{ toLocaleNumber(item.price) }}₫</td>
              <!-- <td><input type="checkbox" v-model="item.isStock" /></td> -->
              <td class="check">
                <input type="checkbox" v-model="item.isStock" />
                <div class="checkbox" @click.stop="stock(item.id)"></div>
              </td>
              <td>
                <div @click.stop="openModalConfirmAct(), (idDelete = item.id)">
                  <i class="bi bi-trash"></i
                  ><span style="margin-left: 10px">Delete</span>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div v-if="items.length > 0" class="pagination-container pagination">
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
  <modal-add-Item
    :ModalAddItemActive="modalAddItem"
    :toppings="toppings"
    :types="types"
    @closeModalAddItem="modalAddItemAct"
  ></modal-add-Item>
  <modal-modify-Item
    :ModalModifyItemActive="modalItemDetail"
    :item="itemDetail"
    :toppings="toppings"
    :types="types"
    @closeModalModifyItem="modalItemDetailAct"
  ></modal-modify-Item>
  <component
    :is="'modal-confirm'"
    :ModalConfirmActive="openModalConfirm"
    @closeModalConfirm="openModalConfirmAct"
  >
    <div class="modal-confirm">
      <p>Are you sure you want to delete this item</p>
      <p class="modalError">{{ Error }}</p>
      <div>
        <button @click="openModalConfirmAct" style="background-color: red">
          No
        </button>
        <button @click="deleteItem(idDelete)" style="background-color: green">
          Yes
        </button>
      </div>
    </div>
  </component>
</template>

<script>
var timeOut;
import { ref } from "vue";
import modalAddItem from "../components/ModalAddItem.vue";
import modalModifyItem from "../components/ModalModifyItem.vue";

export default {
  components: {
    modalAddItem,
    modalModifyItem,
  },
  data() {
    return {
      items: [],
      filter: {
        searchString: "",
        typeFilter: "",
        stock: "",
      },
      itemDetail: {},

      types: [],
      toppings: [],

      Error: "",
      pagination: {
        totalPage: 1,
        currentPage: 1,
      },
    };
  },
  methods: {
    itemDetailAct(value) {
      this.itemDetail = value;
    },
    onPageChange(page) {
      this.pagination.currentPage = page;
      this.getListItems();
    },
    getItemType(value) {
      try {
        var result = this.types.filter((t) => t.id == value);
        return result[0].name;
      } catch {
        return;
      }
    },
    toLocaleNumber(value) {
      const result = value
        .toString()
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return result;
    },
    async stock(value) {
      try {
        const res = await this.$mainAxios.put(`Item/UpdateItemStock/${value}`);
        if (res.status == 200) {
          this.items.find((i) => i.id == value).isStock = !this.items.find(
            (i) => i.id == value
          ).isStock;
          this.getListItems();
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    async getTypes() {
      try {
        const res = await this.$mainAxios.get(`ItemType/GetType`);
        if (res.status == 200) {
          this.types = res.data.content;
          console.log(res);
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    async getTopping() {
      try {
        const res = await this.$mainAxios.get(`Topping/GetTopping`);
        if (res.status == 200) {
          this.toppings = res.data.content;
          console.log(res);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getListItems() {
      try {
        const searchData = this.filter.searchString.trim();
        const res = await this.$mainAxios.get(
          `Item/GetItem?currentPage=${this.pagination.currentPage}&searchString=${searchData}&typeId=${this.filter.typeFilter}&stock=${this.filter.stock}`
        );
        if (res.status == 200) {
          this.items = res.data.data;
          this.pagination.totalPage = res.data.totalPage;
          console.log(res);
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    async deleteItem(value) {
      try {
        const res = await this.$mainAxios.delete(`Item/DeleteItem/${value}`);
        if (res.status == 200) {
          window.location.reload();
        }
      } catch (error) {
        console.log(error.response);
        if (error.response.data.message) {
          this.Error = error.response.data.message;
        }
      }
    },
  },
  watch: {
    "filter.searchString"() {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        this.pagination.currentPage = 1;
        this.getListItems();
      }, 300);
    },
    "filter.typeFilter"() {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        this.pagination.currentPage = 1;
        this.getListItems();
      }, 300);
    },
    "filter.stock"() {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        this.pagination.currentPage = 1;
        this.getListItems();
      }, 300);
    },
  },
  mounted() {
    this.getListItems();
    this.getTopping();
    this.getTypes();
  },
  setup() {
    const modalAddItem = ref(false);
    const modalAddItemAct = () => {
      modalAddItem.value = !modalAddItem.value;
    };

    const modalItemDetail = ref(false);
    const modalItemDetailAct = () => {
      modalItemDetail.value = !modalItemDetail.value;
    };

    const openModalConfirm = ref(false);
    const openModalConfirmAct = () => {
      openModalConfirm.value = !openModalConfirm.value;
    };
    return {
      modalAddItem,
      modalAddItemAct,
      modalItemDetail,
      modalItemDetailAct,
      openModalConfirm,
      openModalConfirmAct,
    };
  },
};
</script>

<style scoped>
.container {
  position: relative;
  left: 244px;
  width: calc(100vw - 244px);
  /* height: calc(100vh - 72px); */
  height: 100vh;
  background-color: #e9eeee;
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
}
.table-search {
  /* position: relative; */
  width: 84%;
  /* height: 40px; */
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
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
  z-index: 2;
}
.table-container table th,
.table-container table td {
  min-width: 160px;
  text-align: center;
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
.table-container table td:last-child > div {
  background-color: #232539;
  color: #b4b7c1;
  width: fit-content;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}
.table-container table td:last-child > div:hover {
  opacity: 0.5;
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
.modalError {
  font-size: 15px;
  margin-top: 8px;
  color: red;
}

.pagination-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20px;
}

.check input[type="checkbox"] {
  position: absolute;
  display: none;
  right: 0;
  top: 0;
}
.check {
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
}
.checkbox {
  position: absolute;
  top: 50%;
  right: 36%;
  transform: translate(-50%, -50%);
  height: 25px;
  width: 25px;
  border-radius: 10px;
  background-color: #edb724;
}
.checkbox:hover {
  opacity: 0.6;
}
.checkbox:after {
  content: "";
  position: absolute;
  display: none;
}
.check input[type="checkbox"]:checked ~ .checkbox:after {
  display: block;
}
.check .checkbox:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
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
  }
}

/*Vertical Ipad(768 x 1024)*/
@media screen and (max-width: 768px) {
}
@media screen and (max-width: 700px) {
}
@media screen and (max-width: 640px) {
  /* .table-container table th:first-child,
  .table-container table th:nth-child(2),
  .table-container table td:first-child,
  .table-container table td:nth-child(2) {
    min-width: 200px;
  }
  .table-container table th:last-child,
  .table-container table th:nth-child(3),
  .table-container table td:last-child,
  .table-container table td:nth-child(3) {
    min-width: 100px;
  } */
}
@media screen and (max-width: 560px) {
  .table-search {
    width: 94%;
    justify-content: space-around;
  }
  .table-search-search {
    margin: 8px 0;
  }
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
