<template>
  <div class="container">
    <div class="title">
      <p>User Management</p>
      <button @click="modalAddUserAct">Add User</button>
    </div>
    <div class="table-container">
      <div class="container-wrap">
        <div class="table-search">
          <h3>User List</h3>
          <div class="table-search-search">
            <select v-model="filter.roleFilter">
              <option value="" selected>All Role</option>
              <option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>
          <div class="table-search-search">
            <select v-model="filter.rankingFilter">
              <option value="" selected>All Ranking</option>
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Diamond">Diamond</option>
            </select>
          </div>
          <div class="table-search-search" style="position: relative">
            <input
              type="text"
              maxlength="30"
              placeholder="Search user"
              v-model="filter.searchString"
            />
            <i class="bi bi-search"></i>
          </div>
        </div>
        <div class="table">
          <table>
            <thead>
              <tr>
                <th>Phone Number</th>
                <th>Full Name</th>
                <th>Ranking</th>
                <th>Role</th>
                <th>Store</th>
                <th>Status</th>
              </tr>
            </thead>
            <tr
              v-for="user in users"
              :key="user.id"
              @click="
                modalUserDetailAct(user);
                userDetailAct(user);
              "
            >
              <td>{{ user.phoneNumber }}</td>
              <td>{{ user.fullname }}</td>
              <td>{{ user.ranking }}</td>
              <td>{{ user.role.name }}</td>
              <td>{{ user.store.name }}</td>
              <td>{{ user.isBanned ? "Deactivated" : "Active" }}</td>
            </tr>
          </table>
        </div>
        <div v-if="users.length > 0" class="pagination-container pagination">
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
  <modal-add-user
    :ModalAddUserActive="modalAddUser"
    @closeModalAddUser="modalAddUserAct"
  ></modal-add-user>
  <modal-user-detail
    :ModalUserDetailActive="modalUserDetail"
    :userDetail="userDetail"
    @closeModalUserDetail="modalUserDetailAct"
  ></modal-user-detail>
</template>

<script>
var timeOut;
import { ref } from "vue";
import modalAddUser from "../components/ModalAddUser.vue";
import modalUserDetail from "../components/ModalUserDetail.vue";

export default {
  components: {
    modalAddUser,
    modalUserDetail,
  },
  data() {
    return {
      users: [],
      roles: [],
      filter: {
        searchString: "",
        roleFilter: "",
        rankingFilter: "",
      },

      userDetail: {},

      pagination: {
        totalPage: 1,
        currentPage: 1,
      },
    };
  },
  methods: {
    userDetailAct(value) {
      this.userDetail = value;
    },
    onPageChange(page) {
      this.pagination.currentPage = page;
      this.getListUsers();
    },
    getRolesName(value) {
      try {
        return this.roles.filter((r) => r.id == value)[0].name;
      } catch {
        return;
      }
    },
    async getListUsers() {
      try {
        const searchData = this.filter.searchString.trim();
        const res = await this.$mainAxios.get(
          `User/GetUser?currentPage=${this.pagination.currentPage}&searchString=${searchData}&role=${this.filter.roleFilter}&ranking=${this.filter.rankingFilter}`
        );
        if (res.status == 200) {
          this.users = res.data.data;
          this.pagination.totalPage = res.data.totalPage;
          console.log(res);
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    async getRoles() {
      try {
        const res = await this.$mainAxios.get(`Role/GetRole`);
        if (res.status == 200) {
          this.roles = res.data.content;
        }
      } catch (error) {
        console.log(error.response);
      }
    },
  },
  watch: {
    // $route(to, from) {
    //   if (to !== from && to.name == "profile") {
    //     this.route(this.$route.params.type);
    //   }
    // },
    "filter.searchString"() {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        this.pagination.currentPage = 1;
        this.getListUsers();
      }, 300);
    },
    "filter.roleFilter"() {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        this.pagination.currentPage = 1;
        this.getListUsers();
      }, 300);
    },
    "filter.rankingFilter"() {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        this.pagination.currentPage = 1;
        this.getListUsers();
      }, 300);
    },
  },
  mounted() {
    this.getListUsers();
    this.getRoles();
  },
  setup() {
    const modalAddUser = ref(false);
    const modalAddUserAct = () => {
      modalAddUser.value = !modalAddUser.value;
    };

    const modalUserDetail = ref(false);
    const modalUserDetailAct = () => {
      modalUserDetail.value = !modalUserDetail.value;
    };
    return {
      modalAddUser,
      modalAddUserAct,
      modalUserDetail,
      modalUserDetailAct,
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
  position: relative;
  width: 98%;
  overflow: auto;
  border-radius: 10px;
  background-color: white;
  padding: 30px 6px;
  padding-bottom: 80px;
}
.table-search {
  /* position: relative; */
  width: 100%;
  /* margin: 0 auto; */
  display: flex;
  align-items: center;
  justify-content: space-around;
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
table thead th {
  position: sticky;
  top: 0;
  background: #eabf43;
}
.table-container table th,
.table-container table td {
  min-width: 160px;
}
.table-container table th:last-child,
.table-container table td:last-child {
  min-width: 100px;
}
.table-container table th:first-child,
.table-container table th:nth-child(2),
.table-container table td:first-child,
.table-container table td:nth-child(2) {
  /* width: 35%; */
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
  .container-wrap {
    padding-bottom: 100px;
  }
}

/*Vertical Ipad(768 x 1024)*/
@media screen and (max-width: 768px) {
  .table-search-search {
    margin: 4px 16px;
  }
}
@media screen and (max-width: 700px) {
}
@media screen and (max-width: 640px) {
  /* .table-container table th:first-child,
  .table-container table th:nth-child(2),
  .table-container table td:first-child,
  .table-container table td:nth-child(2) {
    min-width: 220px;
  } */
  /* .table-container table th:last-child,
  .table-container table th:nth-child(3),
  .table-container table td:last-child,
  .table-container table td:nth-child(3) {
    min-width: 100px;
  } */
}
@media screen and (max-width: 560px) {
  /* .table-search {
    width: 94%;
  } */
}
@media screen and (max-height: 820px) {
  /* .container {
    height: unset;
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