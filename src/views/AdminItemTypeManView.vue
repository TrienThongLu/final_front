<template>
  <div class="container">
    <div class="title">
      <p>Item Type Management</p>
      <button @click="modalAddTypeAct">Add Type</button>
    </div>
    <div class="table-container">
      <div class="container-wrap">
        <div class="table-search">
          <h3>Type List</h3>
        </div>
        <div class="table">
          <table>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Type</th>
              <th></th>
            </tr>
            <tr
              v-for="type in types"
              :key="type.id"
              @click="
                typeDetail = type;
                modalTypeDetailAct();
              "
            >
              <td>
                <div
                  style="
                    width: fit-content;
                    border: 1px solid;
                    border-radius: 26px;
                  "
                >
                  <img :src="type.image" alt="" />
                </div>
              </td>
              <td>{{ type.name }}</td>
              <td>{{ type.style == 0 ? "Food" : "Drink" }}</td>
              <td>
                <div @click.stop="openModalConfirmAct(), (idDelete = type.id)">
                  <i class="bi bi-trash"></i
                  ><span style="margin-left: 10px">Delete</span>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
  <modal-add-Type
    :ModalAddTypeActive="modalAddType"
    @closeModalAddType="modalAddTypeAct"
  ></modal-add-Type>
  <modal-type-detail
    :ModalTypeDetailActive="modalTypeDetail"
    :typeDetail="typeDetail"
    @closeModalTypeDetail="modalTypeDetailAct"
  ></modal-type-detail>
  <component
    :is="'modal-confirm'"
    :ModalConfirmActive="openModalConfirm"
    @closeModalConfirm="openModalConfirmAct"
  >
    <div class="modal-confirm">
      <p>Are you sure you want to delete this type</p>
      <p class="modalError">{{ Error }}</p>
      <div>
        <button @click="openModalConfirmAct" style="background-color: red">
          No
        </button>
        <button @click="deleteType(idDelete)" style="background-color: green">
          Yes
        </button>
      </div>
    </div>
  </component>
</template>

<script>
import { ref } from "vue";
import modalAddType from "../components/ModalAddItemType.vue";
import modalTypeDetail from "../components/ModalItemTypeDetail.vue";

export default {
  components: {
    modalAddType,
    modalTypeDetail,
  },
  data() {
    return {
      types: [],
      searchString: "",
      Error: "",
      idDelete: "",
      typeDetail: {},

      item2: {
        name: "cac",
        price: 45,
      },

      pro: [
        {
          item: {
            name: "cac",
            price: 45,
          },
          quantity: 1,
        },
      ],
    };
  },
  methods: {
    combine() {
      console.log(this.pro[0].item);
      if (JSON.stringify(this.pro[0].item) === JSON.stringify(this.item2)) {
        console.log("cac");
      }
      // console.log(isEqual);
    },
    async getListTypes() {
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
    async deleteType(value) {
      try {
        const res = await this.$mainAxios.delete(
          `ItemType/DeleteType/${value}`
        );
        if (res.status == 200) {
          this.$router.go();
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
    // $route(to, from) {
    //   if (to !== from && to.name == "profile") {
    //     this.route(this.$route.params.type);
    //   }
    // },
  },
  mounted() {
    this.getListTypes();
  },
  setup() {
    const modalAddType = ref(false);
    const modalAddTypeAct = () => {
      modalAddType.value = !modalAddType.value;
    };

    const modalTypeDetail = ref(false);
    const modalTypeDetailAct = () => {
      modalTypeDetail.value = !modalTypeDetail.value;
    };

    const openModalConfirm = ref(false);
    const openModalConfirmAct = () => {
      openModalConfirm.value = !openModalConfirm.value;
    };
    return {
      modalAddType,
      modalAddTypeAct,
      modalTypeDetail,
      modalTypeDetailAct,
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
  position: relative;
  width: 84%;
  height: 40px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.table-search input {
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
.table-container table th:nth-child(2),
.table-container table td:nth-child(2),
.table-container table th:nth-child(3),
.table-container table td:nth-child(3) {
  width: 23%;
}

.table-container table td img {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

/* .table-container table th:nth-child(1),
.table-container table td:nth-child(1),
.table-container table th:nth-child(3),
.table-container table td:nth-child(3) {
  width: 27%;
} */

/* .table-container table td:last-child {
  display: flex;
  justify-content: center;
  align-items: center;
} */

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
@media screen and (max-width: 768px) {
}
@media screen and (max-width: 700px) {
}
@media screen and (max-width: 640px) {
  .table-container table th:first-child,
  .table-container table th:nth-child(2),
  .table-container table td:first-child,
  .table-container table td:nth-child(2) {
    min-width: 160px;
  }
  .table-container table th:last-child,
  .table-container table th:nth-child(3),
  .table-container table td:last-child,
  .table-container table td:nth-child(3) {
    min-width: 130px;
  }
}
@media screen and (max-width: 560px) {
  .table-search {
    width: 94%;
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