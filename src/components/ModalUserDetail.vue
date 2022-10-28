<template>
  <div class="Modal" v-if="ModalUserDetailActive">
    <span class="Modal-backdrop" @click="closeModalUserDetail"></span>
    <transition name="bounce" appear>
      <div class="Modal-container">
        <div class="Modal-close" @click="closeModalUserDetail">
          <i
            class="bi form-control-feedback bi-x-lg"
            style="font-size: 22px"
          ></i>
        </div>
        <div class="Modal-body">
          <h1>User Detail</h1>
          <form @submit.prevent="confirm('Edit'), openModalConfirmAct()">
            <div class="Modal_inputs">
              <div class="Modal_input">
                <label>Phone number</label>
                <input
                  type="text"
                  placeholder="Phone number"
                  maxlength="10"
                  @keypress="isNumber($event)"
                  pattern="[0](1[0-1]|3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}"
                  title="The phone number must start with 03[2-9],05[6|7|8],07[0|6-9],08[0-6|8|9],09[0-4|6-9] and it must has at least 10 number"
                  v-model="User.phoneNumber"
                  readonly
                />
              </div>
              <div class="Modal_input">
                <label>Role</label>
                <select v-model="User.role.id">
                  <option value="" disabled selected hidden></option>
                  <option v-for="role in roles" :key="role.id" :value="role.id">
                    {{ role.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="Modal_inputs">
              <div class="Modal_input">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Full name"
                  maxlength="30"
                  v-model="User.fullname"
                />
              </div>
              <div class="Modal_input">
                <label>Ranking</label>
                <input type="text" readonly v-model="User.ranking" />
              </div>
            </div>
            <div class="Modal_inputs">
              <div class="Modal_input widthModal">
                <label>Store</label>
                <select :disabled="storeDisable" v-model="User.store.id">
                  <option :value="null" selected>Null</option>
                  <option
                    v-for="store in stores"
                    :key="store.id"
                    :value="store.id"
                  >
                    {{ store.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="Modal_inputs">
              <div class="Modal_input">
                <label>Gender</label>
                <select v-model="User.gender">
                  <option value="" disabled selected hidden></option>
                  <option value="0" :selected="User.gender == 0">Male</option>
                  <option value="1" :selected="User.gender == 1">Female</option>
                  <option value="2" :selected="User.gender == 2">Other</option>
                </select>
              </div>
              <div class="Modal_input">
                <label>Date of Birth</label>
                <input type="date" v-model="User.doB" />
              </div>
            </div>
            <div class="Modal_inputs">
              <div class="Modal_input widthModal">
                <label>Status</label>
                <input
                  type="text"
                  readonly
                  :value="User.isBanned ? 'Deactivate' : 'Active'"
                />
              </div>
            </div>
            <p class="modalError">{{ Error }}</p>
            <div class="Modal_inputs">
              <button>Edit</button>
            </div>
          </form>
          <div class="modalAction">
            <button
              @click="
                confirm(User.isBanned ? 'Activate' : 'Deactivate'),
                  openModalConfirmAct()
              "
              style="background-color: #232539; color: white"
            >
              <i class="bi bi-slash-circle"></i>
              {{ User.isBanned ? "Activate" : "Deactivate" }}
            </button>
            <button
              @click="confirm('Delete'), openModalConfirmAct()"
              style="background-color: red; color: white"
              :style="!User.isBanned ? 'opacity: 0.3' : ''"
              :disabled="!User.isBanned"
            >
              <i class="bi bi-trash3"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <span v-else style="display: none"></span>
  <component
    :is="'modal-confirm'"
    :ModalConfirmActive="openModalConfirm"
    @closeModalConfirm="openModalConfirmAct"
  >
    <div class="modal-confirm">
      <p>Are you sure you want to {{ confirmType }} this user</p>
      <div>
        <button @click="openModalConfirmAct" style="background-color: red">
          No
        </button>
        <button @click="userAction" style="background-color: green">Yes</button>
      </div>
    </div>
  </component>
</template>

<script>
import { ref } from "vue";

export default {
  name: "Modal-UserDetail",
  props: {
    ModalUserDetailActive: {
      type: Boolean,
    },
    userDetail: {
      type: Object,
    },
  },
  emits: ["closeModalUserDetail"],
  setup(props, { emit }) {
    const closeModalUserDetail = () => {
      emit("closeModalUserDetail");
    };
    const openModalConfirm = ref(false);
    const openModalConfirmAct = () => {
      openModalConfirm.value = !openModalConfirm.value;
    };
    return { closeModalUserDetail, openModalConfirm, openModalConfirmAct };
  },

  data() {
    return {
      User: {
        id: "",
        fullname: "",
        phoneNumber: "",
        doB: undefined,
        gender: undefined,
        isBanned: undefined,
        ranking: "",
        role: {
          id: "",
          name: "",
        },
        store: {
          id: "",
          name: "",
        },
      },
      roles: [],
      stores: [],
      storeDisable: false,
      confirmType: "",
      Error: "",
    };
  },
  methods: {
    getDate(value) {
      const date = new Date(parseInt(value));
      var month;
      var dateVal;
      if (date.getMonth() < 9) {
        month = "0" + (parseInt(date.getMonth()) + 1).toString();
      } else {
        month = (parseInt(date.getMonth()) + 1).toString();
      }
      if (date.getDate() < 10) {
        dateVal = "0" + date.getDate();
      } else {
        dateVal = date.getDate();
      }
      const dateConverted = date.getFullYear() + "-" + month + "-" + dateVal;
      return dateConverted;
    },
    confirm(value) {
      this.confirmType = value;
    },
    userAction() {
      switch (this.confirmType) {
        case "Edit":
          this.editUser();
          break;
        case "Delete":
          this.deleteUser();
          break;
        case "Deactivate":
          this.banUser();
          break;
        case "Activate":
          this.unbanUser();
          break;
      }
    },
    async editUser() {
      this.Error = "";
      try {
        let date = null;
        if (this.User.doB) {
          date = Date.parse(this.User.doB);
        }
        const editUser = {
          id: this.User.id,
          roleId: this.User.role.id,
          fullname: this.User.fullname,
          gender: this.User.gender,
          storeId: this.User.store.id,
          doB: date,
        };
        console.log(editUser);
        const res = await this.$mainAxios.put(`User/UpdateUser`, editUser);
        if (res.status == 200) {
          this.$router.go();
        }
      } catch (error) {
        console.log(error.response);
        if (error.response.data.message) {
          this.Error = error.response.data.message;
        }
        if (error.response.data.errors) {
          const _validateErrors = Object.values(error.response.data.errors);
          _validateErrors.map((value) => {
            if (this.Error) {
              this.Error += "<br>" + value[0];
            } else {
              this.Error += value[0];
            }
          });
        }
      }
    },
    async deleteUser() {
      try {
        const res = await this.$mainAxios.delete(
          `User/DeleteUser/${this.User.id}`
        );
        if (res.status == 200) {
          this.$router.go();
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
    async banUser() {
      try {
        const res = await this.$mainAxios.put(`User/BanUser/${this.User.id}`);
        if (res.status == 200) {
          this.$router.go();
        }
      } catch (error) {
        if (error.response.data.message) {
          this.Error = error.response.data.message;
        }
      }
    },
    async unbanUser() {
      try {
        const res = await this.$mainAxios.put(`User/UnbanUser/${this.User.id}`);
        if (res.status == 200) {
          this.$router.go();
        }
      } catch (error) {
        if (error.response.data.message) {
          this.Error = error.response.data.message;
        }
      }
    },
  },
  watch: {
    userDetail(value) {
      this.User.id = value.id;
      this.User.fullname = value.fullname;
      this.User.phoneNumber = value.phoneNumber;
      this.User.doB = value.doB;
      this.User.gender = value.gender;
      this.User.ranking = value.ranking;
      this.User.isBanned = value.isBanned;
      this.User.role.id = value.role.id;
      this.User.role.name = value.role.name;
      this.User.store.id = value.store.id;
      this.User.store.name = value.store.name;
      if (this.User.doB) {
        this.User.doB = this.getDate(this.User.doB);
      }
      console.log(value);
    },
    ModalUserDetailActive(value) {
      const body = document.querySelector("body");
      if (value) {
        body.style.overflow = "hidden";
      } else {
        body.style.overflow = "auto";
      }
    },
    "User.role.id"(newValue) {
      if (
        this.roles.filter((r) => r.id == newValue)[0].name == "Online Customer"
      ) {
        this.storeDisable = true;
        this.User.store.id = null;
      } else {
        this.storeDisable = false;
      }
    },
  },
  mounted() {
    this.getRoles();
    this.getStores();
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
  width: 500px;
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

.Modal_inputs:last-child {
  justify-content: flex-end;
}
.Modal_inputs button {
  height: 38px;
  width: 90px;
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
.Modal_input input {
  width: 100%;
  min-width: 95%;
  padding: 10px 14px;
  border-radius: 6px;
  border-color: #b3b3b3;
  border-style: double;
  height: 40px;
}
.Modal_input input:read-only {
  background-color: rgba(128, 128, 128, 0.4);
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
.widthModal {
  width: 96%;
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

.modalAction {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 16px;
}

.modalAction button {
  height: 40px;
  width: 120px;
  font-weight: 600;
  border-radius: 12px;
  border-color: transparent;
  cursor: pointer;
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

@media screen and (max-width: 560px) {
  .Modal_inputs {
    flex-direction: column;
  }
  .Modal_inputs:last-child {
    flex-direction: inherit;
  }
  .Modal_input {
    width: 100% !important;
  }
  .Modal_input:nth-child(2) {
    margin-top: 8px;
  }
  .Modal_inputs {
    margin-top: 8px;
  }
}
@media screen and (max-width: 320px) {
  .Modal_inputs button {
    height: 34px;
    width: 84px;
  }
  .modalAction button {
    height: 36px;
    width: 100px;
  }
  .Modal-body {
    padding: 24px 12px;
  }
}
</style>