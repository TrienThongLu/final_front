<template>
  <div class="Modal" v-if="ModalSearchUserActive">
    <span class="Modal-backdrop" @click="closeModalSearchUser"></span>
    <transition name="bounce" appear>
      <div class="Modal-container">
        <div class="Modal-close" @click="closeModalSearchUser">
          <i
            class="bi form-control-feedback bi-x-lg"
            style="font-size: 22px"
          ></i>
        </div>
        <div class="Modal-body">
          <h1>Search User</h1>
          <div class="Modal_inputs">
            <div class="Modal_input" style="width: 96%">
              <label>Phone number</label>
              <input
                type="text"
                placeholder="Phone number"
                @keypress="isNumber($event)"
                @keydown.enter="searchUser"
                v-model="phonenumber"
                maxlength="10"
              />
            </div>
          </div>
          <p class="modalError">{{ Error }}</p>
          <div class="Modal_inputs">
            <button
              :style="phonenumber == '' ? 'opacity: 0.3' : ''"
              :disabled="phonenumber == ''"
              @click="clear()"
            >
              Clear
            </button>
            <button @click="searchUser">Search</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <span v-else style="display: none"></span>
</template>

<script>
export default {
  name: "Modal-SearchUser",
  props: ["ModalSearchUserActive"],
  setup(props, { emit }) {
    const closeModalSearchUser = () => {
      emit("closeModalSearchUser");
    };
    return { closeModalSearchUser };
  },
  data() {
    return {
      phonenumber: "",
      userDetail: {
        id: "",
        fullname: "",
        phonenumber: "",
        ranking: "",
      },
      Error: "",
    };
  },
  methods: {
    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (evt.keyCode == 86 && evt.ctrlKey) {
        evt.preventDefault();
      }
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    clear() {
      this.userDetail = {
        id: "",
        fullname: "",
        phonenumber: "",
        ranking: "",
      };
      this.phonenumber = "";
      this.Error = "";
      this.$emit("searchUser", this.userDetail);
      this.closeModalSearchUser();
    },
    async searchUser() {
      try {
        const res = await this.$mainAxios.get(
          `User/GetUserViaPhonenumber/${this.phonenumber}`
        );
        if (res.status == 200) {
          this.userDetail.id = res.data.content.id;
          this.userDetail.phonenumber = res.data.content.phonenumber;
          this.userDetail.fullname = res.data.content.name;
          this.userDetail.ranking = res.data.content.ranking;
          this.$emit("searchUser", this.userDetail);
          this.closeModalSearchUser();
        }
      } catch (error) {
        console.log(error.response);
        this.Error = error.response.data.message;
      }
    },
  },
  watch: {
    ModalSearchUserActive(value) {
      const body = document.querySelector("body");
      if (value) {
        body.style.overflow = "hidden";
      } else {
        body.style.overflow = "auto";
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

.Modal_inputs:last-child {
  justify-content: space-between;
  margin: 12px 16px 0;
}
.Modal_inputs button {
  height: 32px;
  width: 72px;
  font-weight: 600;
  border-radius: 12px;
  border-color: transparent;
  background-color: #ffb100;
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
