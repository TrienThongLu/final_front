<template>
  <div class="Modal" v-if="ModalUserDeActive">
    <span class="Modal-backdrop" @click="closeModalUserDe"></span>
    <transition name="bounce" appear>
      <div class="Modal-container">
        <div class="Modal-close" @click="closeModalUserDe">
          <i
            class="bi form-control-feedback bi-x-lg"
            style="font-size: 22px"
          ></i>
        </div>
        <div class="Modal-body">
          <h1>User Detail</h1>
          <form @submit.prevent="modify">
            <div class="Modal_inputs">
              <div class="Modal_input" style="width: 96%">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Full name"
                  v-model="userDetail.fullname"
                  maxlength="30"
                />
              </div>
            </div>
            <div class="Modal_inputs">
              <div class="Modal_input" style="width: 96%">
                <label>Phone number</label>
                <input
                  type="text"
                  placeholder="Phone number"
                  maxlength="10"
                  @keypress="isNumber($event)"
                  pattern="[0](1[0-1]|3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}"
                  title="The phone number must start with 03[2-9],05[6|7|8],07[0|6-9],08[0-6|8|9],09[0-4|6-9] and it must has at least 10 number"
                  v-model="userDetail.phonenumber"
                />
              </div>
            </div>
            <p class="modalError">{{ Error }}</p>
            <div class="Modal_inputs">
              <button
                :disabled="
                  userDetail.fullname === '' || userDetail.phonenumber === ''
                "
              >
                Change
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
  <span v-else style="display: none"></span>
</template>

<script>
export default {
  name: "Modal-UserDe",
  props: ["ModalUserDeActive", "Fullname", "Phonenumber"],
  setup(props, { emit }) {
    const closeModalUserDe = () => {
      emit("closeModalUserDe");
    };
    return { closeModalUserDe };
  },
  data() {
    return {
      userDetail: {
        fullname: "",
        phonenumber: "",
      },
      Error: "",
    };
  },
  methods: {
    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
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
    modify() {
      this.$emit("userDe", this.userDetail);
      this.closeModalUserDe();
    },
  },
  watch: {
    ModalUserDeActive(value) {
      const body = document.querySelector("body");
      if (value) {
        body.style.overflow = "hidden";
        this.userDetail.fullname = this.Fullname;
        this.userDetail.phonenumber = this.Phonenumber;
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
  justify-content: flex-end;
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