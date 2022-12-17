<template>
  <div class="header" v-if="screenWidth > 992">
    <div class="header_items">
      <div class="header_navigation">
        <router-link to="/"
          ><img src="../assets/Images/Icon/CorgiCoffee.png"
        /></router-link>
        <router-link :to="{ name: 'product' }" class="header_navigation-box">
          <p>Products</p>
        </router-link>
        <router-link :to="{ name: 'stores' }" class="header_navigation-box">
          <p>Shops Location</p>
        </router-link>
        <router-link
          to="/admin"
          class="header_navigation-box"
          v-if="auth && auth == 'Admin'"
        >
          <p>Admin page</p>
        </router-link>
        <span v-else style="display: none"></span>
        <router-link
          to="/orders"
          class="header_navigation-box"
          v-if="auth && (auth == 'Admin' || auth == 'Reception Staff')"
        >
          <p>New Orders</p>
        </router-link>
        <span v-else style="display: none"></span>
        <router-link
          to="/ordersPrc"
          class="header_navigation-box"
          v-if="auth && (auth == 'Admin' || auth == 'Barista')"
        >
          <p>Orders Processing</p>
        </router-link>
        <span v-else style="display: none"></span>
        <router-link
          to="/allOrders"
          class="header_navigation-box"
          v-if="auth && (auth == 'Admin' || auth == 'Reception Staff')"
        >
          <p>All Orders</p>
        </router-link>
        <span v-else style="display: none"></span>
      </div>
      <div class="header_option">
        <div class="header_option-user">
          <img
            src="../assets/Images/Icon/person.png"
            @click="isOpenModalAct(userStored)"
          />
          <ul class="header-user-info" v-if="userStored != null">
            <li @click="showProfile">
              <i class="bi bi-person-badge"></i>
              My Profile
            </li>
            <li class="header-user-logout" @click="logout">
              <i class="bi bi-door-open"></i>
              Logout
            </li>
          </ul>
          <span v-else style="display: none"></span>
        </div>
        <div style="display: flex">
          <img src="../assets/Images/Icon/cart.png" @click="isOpenCartAct()" />
          <span class="span">{{ cartItemCount }}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="bottomMenuBar" v-else>
    <router-link to="/" class="bottomMenuBar-items">
      <i class="bi bi-house-door"></i>
      <p>Home</p>
    </router-link>
    <router-link to="/product" class="bottomMenuBar-items">
      <i class="bi bi-cup"></i>
      <p>Products</p>
    </router-link>
    <router-link :to="{ name: 'stores' }" class="bottomMenuBar-items">
      <i class="bi bi-map"></i>
      <p>Map</p>
    </router-link>
    <div class="bottomMenuBar-items" @click="isOpenCartAct()">
      <div style="position: relative; margin-bottom: 4px; margin-top: 4px">
        <i class="bi bi-cart3"></i>
        <span>{{ cartItemCount }}</span>
      </div>
      <p>Cart</p>
    </div>
    <router-link
      to="/profile"
      class="bottomMenuBar-items"
      @click="isOpenModalAct(userStored)"
    >
      <i class="bi bi-person-square"></i>
      <p>Profile</p>
    </router-link>
  </div>
  <component
    :is="'modal-login'"
    v-if="isOpenModal && userStored == null"
    :ModalActive="isOpenModal"
    @closeModal="isOpenModalAct"
  >
    <div>
      <p>Welcome To Corgi Coffee</p>
      <form v-if="formNo === 0" @submit.prevent="checkPhonenumber">
        <div>
          <input
            class="modal-input"
            type="text"
            maxlength="10"
            @keypress="isNumber($event)"
            placeholder="Phone number*"
            v-model="phonenumber"
            pattern="[0](1[0-1]|3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}"
            title="The phone number must start with 03[2-9],05[6|7|8],07[0|6-9],08[0-6|8|9],09[0-4|6-9] and it must has at least 10 number"
            required
            autofocus
          />
          <p class="modalError">
            {{ modalError }}
          </p>
          <button class="modal-submit">Submit</button>
        </div>
      </form>

      <form v-else-if="formNo === 1" @submit.prevent="login">
        <div style="position: relative">
          <p style="font-size: 14px">Login for {{ phonenumber }}</p>
          <input
            class="modal-input"
            ref="password"
            :type="isShow ? 'text' : 'password'"
            placeholder="Password*"
            v-model="password"
            required
          />
          <i
            class="bi form-control-feedback"
            style="font-size: 22px; font-style: normal"
            @click="toggle"
          >
            {{ this.isShow ? "🐵" : "🙈" }}
          </i>
          <p class="modalError">
            {{ modalErrorLogIn }}
          </p>
          <button class="modal-submit">Login</button>
          <p
            v-if="fp"
            class="forgotPassword"
            @click="sendOtp('ChangePassword')"
          >
            Forgot password
          </p>
          <span v-else style="display: none"></span>
        </div>
      </form>
      <form v-else-if="formNo === 2" @submit.prevent="sendOtp('Register')">
        <div style="position: relative">
          <p style="font-size: 14px">Register for {{ phonenumber }}</p>
          <input
            class="modal-input"
            type="text"
            maxlength="30"
            placeholder="Name*"
            ref="name"
            v-model="username"
            required
          />
          <input
            class="modal-input"
            :type="isShow ? 'text' : 'password'"
            placeholder="Password*"
            v-model="password"
            required
          />
          <i
            class="bi form-control-feedback"
            style="font-size: 22px; top: 8.7rem; font-style: normal"
            @click="toggle"
            >{{ this.isShow ? "🐵" : "🙈" }}</i
          >
          <input
            class="modal-input"
            :type="isShowRe ? 'text' : 'password'"
            placeholder="Re-enter Password*"
            v-model="reEnterPassword"
            @keypress="checkSamePassword"
            required
          />
          <i
            class="bi form-control-feedback"
            style="font-size: 22px; top: 13.3rem; font-style: normal"
            @click="toggleRe"
            >{{ this.isShowRe ? "🐵" : "🙈" }}</i
          >
          <p
            style="font-size: 12px; color: red; text-align: left"
            :style="usernameCase ? 'color: green' : ''"
          >
            <i class="bi bi-dot" style="font-size: 18px"></i> Name must have at
            least 5 characters
          </p>
          <p style="font-size: 12px; text-align: left">Password must have</p>
          <p
            style="font-size: 12px; color: red; text-align: left"
            :style="lowerCase ? 'color: green' : ''"
          >
            <i class="bi bi-dot" style="font-size: 18px"></i> Lower case [a-z]
          </p>
          <p
            style="font-size: 12px; color: red; text-align: left"
            :style="upperCase ? 'color: green' : ''"
          >
            <i class="bi bi-dot" style="font-size: 18px"></i> Upper case [A-Z]
          </p>
          <p
            style="font-size: 12px; color: red; text-align: left"
            :style="numberCase ? 'color: green' : ''"
          >
            <i class="bi bi-dot" style="font-size: 18px"></i> Number [0-9]
          </p>
          <p
            style="font-size: 12px; color: red; text-align: left"
            :style="countCase ? 'color: green' : ''"
          >
            <i class="bi bi-dot" style="font-size: 18px"></i> At Least 8
            characters and 16 characters maximum
          </p>
          <p class="modalError">
            {{ modalError }}
          </p>
          <button
            class="modal-submit"
            :disabled="
              !usernameCase ||
              !lowerCase ||
              !upperCase ||
              !numberCase ||
              !countCase ||
              password != reEnterPassword
            "
          >
            Register
          </button>
          <p class="forgotPassword" style="color: black" @click="changeNumber">
            Change phone number
          </p>
        </div>
      </form>
      <form v-else-if="formNo === 3" @submit.prevent="resetPassword">
        <div style="position: relative">
          <p style="font-size: 14px">Resetpassword for {{ phonenumber }}</p>
          <div style="position: relative">
            <input
              class="modal-input"
              :type="isShow ? 'text' : 'password'"
              ref="resetPassword"
              placeholder="Password*"
              v-model="password"
              required
            />
            <i
              class="bi form-control-feedback"
              style="font-size: 22px; top: 2.35rem; font-style: normal"
              @click="toggle"
              >{{ this.isShow ? "🐵" : "🙈" }}</i
            >
          </div>
          <div style="position: relative">
            <input
              class="modal-input"
              :type="isShowRe ? 'text' : 'password'"
              placeholder="Re-enter Password*"
              v-model="reEnterPassword"
              @keypress="checkSamePassword"
              required
            />
            <i
              class="bi form-control-feedback"
              style="font-size: 22px; top: 2.35rem; font-style: normal"
              @click="toggleRe"
              >{{ this.isShowRe ? "🐵" : "🙈" }}</i
            >
          </div>
          <p style="font-size: 12px; text-align: left">Password must have</p>
          <p
            style="font-size: 12px; color: red; text-align: left"
            :style="lowerCase ? 'color: green' : ''"
          >
            <i class="bi bi-dot" style="font-size: 18px"></i> Lower case [a-z]
          </p>
          <p
            style="font-size: 12px; color: red; text-align: left"
            :style="upperCase ? 'color: green' : ''"
          >
            <i class="bi bi-dot" style="font-size: 18px"></i> Upper case [A-Z]
          </p>
          <p
            style="font-size: 12px; color: red; text-align: left"
            :style="numberCase ? 'color: green' : ''"
          >
            <i class="bi bi-dot" style="font-size: 18px"></i> Number [0-9]
          </p>
          <p
            style="font-size: 12px; color: red; text-align: left"
            :style="countCase ? 'color: green' : ''"
          >
            <i class="bi bi-dot" style="font-size: 18px"></i> At Least 8
            characters and 16 characters maximum
          </p>
          <p class="modalError">
            {{ modalError }}
          </p>
          <button
            class="modal-submit"
            :disabled="
              !lowerCase ||
              !upperCase ||
              !numberCase ||
              !countCase ||
              password != reEnterPassword
            "
          >
            Reset
          </button>
        </div>
      </form>
      <form v-else @submit.once="accountAction">
        <div>
          <p style="font-size: 14px">An OTP is sent to your phone</p>
          <p style="font-size: 14px">
            Please enter otp
            {{
              otpValue == "Register"
                ? "To create new account"
                : "To reset password"
            }}
          </p>
          <div class="otpInput">
            <input
              type="text"
              id="OTPFirst"
              ref="otpfirst"
              maxlength="1"
              @keypress="isNumber($event)"
              @keyup="otpTrans('OTPFirst', 'OTPSecond')"
            />
            <input
              type="text"
              id="OTPSecond"
              maxlength="1"
              @keypress="isNumber($event)"
              @keyup="otpTrans('OTPSecond', 'OTPThird')"
            />
            <input
              type="text"
              id="OTPThird"
              maxlength="1"
              @keypress="isNumber($event)"
              @keyup="otpTrans('OTPThird', 'OTPFourth')"
            />
            <input
              type="text"
              id="OTPFourth"
              maxlength="1"
              @keypress="isNumber($event)"
              @keyup="otpTrans('OTPFourth', 'OTPFifth')"
            />
            <input
              type="text"
              id="OTPFifth"
              maxlength="1"
              @keypress="isNumber($event)"
              @keyup="otpTrans('OTPFifth', 'OTPSixth')"
            />
            <input
              type="text"
              id="OTPSixth"
              maxlength="1"
              @keypress="isNumber($event)"
            />
          </div>

          <p class="modalError">
            {{ modalError }}
          </p>
          <button class="modal-submit">Enter</button>
          <p class="resendOtp" @click="sendOtp(otpValue)">Resend otp</p>
        </div>
      </form>
    </div>
  </component>
  <span v-else style="display: none"></span>
  <component
    :is="'modal-login'"
    v-if="isOpenModalLogOut"
    :ModalActive="isOpenModalLogOut"
    @closeModal="isOpenModalLogOutAct"
  >
    <form @submit.prevent="checkPassword">
      <div style="position: relative">
        <p style="font-size: 14px">Enter password to logout</p>
        <input
          class="modal-input"
          style="margin: 0"
          ref="password"
          :type="isShow ? 'text' : 'password'"
          placeholder="Password*"
          v-model="password"
          required
        />
        <i
          class="bi form-control-feedback"
          style="font-size: 22px; font-style: normal; top: 2.4rem"
          @click="toggle"
        >
          {{ this.isShow ? "🐵" : "🙈" }}
        </i>
        <p class="modalError">
          {{ modalErrorLogIn }}
        </p>
        <button class="modal-submit">Logout</button>
      </div>
    </form>
  </component>
  <span v-else style="display: none"></span>
  <cart-side :CartActive="isOpenCart" @closeCart="isOpenCartAct"></cart-side>
</template>

<script>
import { ref } from "vue";
import CartSide from "../components/CartSide.vue";

export default {
  components: {
    CartSide,
  },
  data() {
    return {
      isAdmin: true,
      screenWidth: window.innerWidth,
      phonenumber: "",
      password: "",
      reEnterPassword: "",
      lowerCase: false,
      upperCase: false,
      numberCase: false,
      countCase: false,
      usernameCase: false,
      username: "",
      otpCode: "",
      otpValue: "",
      formNo: 0,
      isShow: false,
      isShowRe: false,
      fp: true,

      cartItemCount: JSON.parse(localStorage.getItem("Cart"))
        ? JSON.parse(localStorage.getItem("Cart")).length
        : 0,

      modalError: "",
      modalErrorLogIn: "",
    };
  },
  watch: {
    reEnterPassword(newValue) {
      if (newValue !== this.password) {
        this.modalError = "Passwords must match";
      } else {
        this.modalError = "";
      }
    },
    formNo(newValue) {
      if (newValue != 4) {
        this.password = "";
        this.reEnterPassword = "";
      }
    },
    username(newValue) {
      if (newValue.length >= 5) {
        this.usernameCase = true;
      } else {
        this.usernameCase = false;
      }
    },
    password(newValue) {
      let lowerCase = new RegExp("(?=.*[a-z])");
      let upperCase = new RegExp("(?=.*[A-Z])");
      let number = new RegExp("(?=.*[0-9])");
      if (lowerCase.test(newValue)) {
        this.lowerCase = true;
      } else {
        this.lowerCase = false;
      }
      if (newValue.length >= 8) {
        this.countCase = true;
      } else {
        this.countCase = false;
      }
      if (upperCase.test(newValue)) {
        this.upperCase = true;
      } else {
        this.upperCase = false;
      }
      if (number.test(newValue)) {
        this.numberCase = true;
      } else {
        this.numberCase = false;
      }
      if (newValue !== this.reEnterPassword) {
        this.modalError = "Passwords must match";
      } else {
        this.modalError = "";
      }
    },
  },
  methods: {
    pcResized() {
      this.screenWidth = window.innerWidth;
    },
    otpTrans(first, second) {
      if (document.getElementById(first).value.length) {
        document.getElementById(second).focus();
      }
    },
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
    changeNumber() {
      this.phonenumber = "";
      this.password = "";
      this.reEnterPassword = "";
      this.username = "";
      this.formNo = 0;
      this.isShow = false;
      this.isShowRe = false;
    },
    toggle() {
      this.isShow = !this.isShow;
    },
    toggleRe() {
      this.isShowRe = !this.isShowRe;
    },
    showProfile() {
      this.$router.push({ name: "profile", params: { type: "profile" } });
    },
    async checkPhonenumber() {
      this.modalError = "";
      if (this.phonenumber.length > 9 && this.phonenumber.length < 12) {
        try {
          const res = await this.$mainAxios.get(
            `User/CheckPhonenumber/${this.phonenumber}`
          );
          if (res.status === 200) {
            this.fp = res.data.fp;
            this.formNo = 1;
            this.$nextTick(() => this.$refs.password.focus());
          }
        } catch (error) {
          if (error.response.status == 400) {
            this.formNo = 2;
            this.$nextTick(() => this.$refs.name.focus());
          } else if (!error.response.status) {
            this.modalError = "Server Error";
          }
        }
      } else {
        this.modalError = "Please enter valid phone number";
      }
    },
    async login() {
      if (this.phonenumber && this.password) {
        try {
          const user = {
            phoneNumber: this.phonenumber,
            password: this.password,
          };
          const resLogin = await this.$mainAxios.post(`User/Login`, user);
          if (resLogin.status === 200) {
            this.$cookies.set(
              "UserId",
              resLogin.data.content.user.id,
              null,
              null,
              null,
              true,
              null
            );
            this.$cookies.set(
              "Token",
              resLogin.data.content.token.token,
              null,
              null,
              null,
              true,
              null
            );
            this.$cookies.set(
              "Auth",
              resLogin.data.content.roleName,
              null,
              null,
              null,
              true,
              null
            );
            if (resLogin.data.content.user.storeId) {
              this.$cookies.set(
                "StoreId",
                resLogin.data.content.user.storeId,
                null,
                null,
                null,
                true,
                null
              );
            }
            this.$mainAxios.defaults.headers[
              "Authorization"
            ] = `Bearer ${resLogin.data.content.token.token}`;
            if (this.$cookies.get("UserId")) {
              window.location.reload();
            }
          }
        } catch (error) {
          this.modalErrorLogIn = error.response.data.message;
        }
      }
    },
    async accountAction() {
      this.otpCode =
        document.getElementById("OTPFirst").value +
        document.getElementById("OTPSecond").value +
        document.getElementById("OTPThird").value +
        document.getElementById("OTPFourth").value +
        document.getElementById("OTPFifth").value +
        document.getElementById("OTPSixth").value;
      if (
        this.phonenumber &&
        this.password &&
        this.username &&
        this.otpCode &&
        this.otpValue == "Register"
      ) {
        try {
          const newUser = {
            fullName: this.username,
            phoneNumber: this.phonenumber,
            password: this.password,
          };
          const res = await this.$mainAxios.post(
            `User/Register/${this.otpCode}`,
            newUser
          );
          if (res.status === 200) {
            console.log(res);
            this.login();
          }
        } catch (error) {
          this.modalError = error.response.data.message;
        }
      } else {
        if (this.phonenumber) {
          try {
            const res = await this.$mainAxios.get(
              `User/CheckChangePasswordOTP/${this.otpCode},${this.phonenumber}`
            );
            if (res.status === 200) {
              this.formNo = 3;
              this.$nextTick(() => this.$refs.resetPassword.focus());
            }
          } catch (error) {
            console.log(error.response);
          }
        }
      }
    },
    async resetPassword() {
      try {
        const userData = {
          phoneNumber: this.phonenumber,
          password: this.password,
        };
        const res = await this.$mainAxios.put(
          `User/ResetPassword/${this.otpCode}`,
          userData
        );
        if (res.status === 200) {
          console.log(res);
          this.login();
        }
      } catch (error) {
        console.log(error.response);
        this.modalError = error.response.data.message;
      }
    },
    async sendOtp(value) {
      if (this.phonenumber) {
        this.otpValue = value;
        try {
          const res = await this.$mainAxios.post(
            `User/sendOTP/${this.phonenumber},${this.otpValue}`
          );
          if (res.status === 200) {
            console.log(res);
            this.formNo = 4;
            this.$nextTick(() => this.$refs.otpfirst.focus());
          }
        } catch (error) {
          console.log(error.response);
          this.modalError = error.response.data.message;
        }
      }
    },
    async checkPassword() {
      try {
        const res = await this.$mainAxios.get(
          `User/CheckPassword/${this.$cookies.get("UserId")}/${this.password}`
        );
        if (res.status === 200) {
          console.log(res);
          this.$cookies.remove("UserId");
          this.$cookies.remove("Token");
          this.$cookies.remove("Auth");
          this.$cookies.remove("StoreId");
          window.location.reload();
        }
      } catch (error) {
        console.log(error.response);
        this.modalErrorLogIn = error.response.data.message;
      }
    },
    logout() {
      if (this.auth == "Online Customer" || this.auth == "Admin") {
        this.$cookies.remove("UserId");
        this.$cookies.remove("Token");
        this.$cookies.remove("Auth");
        this.$cookies.remove("StoreId");
        window.location.reload();
      } else {
        this.isOpenModalLogOutAct();
      }
    },
  },
  computed: {
    userStored() {
      if (
        this.$cookies.get("UserId") &&
        this.$cookies.get("Token") &&
        this.$cookies.get("Auth")
      ) {
        return true;
      } else {
        return null;
      }
    },
    auth() {
      return this.$cookies.get("Auth");
    },
  },
  created() {
    window.addEventListener("resize", this.pcResized);
  },
  mounted() {
    this.$mitt.on("openLogin", (isOpen) => {
      if (isOpen) {
        this.isOpenModalAct();
      }
    });
    this.$mitt.on("itemAdded", (isOpen) => {
      if (isOpen) {
        var cartItems = JSON.parse(localStorage.getItem("Cart"));
        this.cartItemCount = 0;
        if (cartItems) {
          this.cartItemCount = JSON.parse(localStorage.getItem("Cart")).length;
        }
      }
    });
  },
  unmounted() {
    window.removeEventListener("resize", this.pcResized);
  },
  setup() {
    const isOpenModal = ref(false);
    const isOpenModalAct = (value) => {
      if (!value) {
        isOpenModal.value = !isOpenModal.value;
      } else {
        isOpenModal.value = ref(false);
      }
    };

    const isOpenModalLogOut = ref(false);
    const isOpenModalLogOutAct = () => {
      isOpenModalLogOut.value = !isOpenModalLogOut.value;
    };

    const isOpenCart = ref(false);
    const isOpenCartAct = () => {
      isOpenCart.value = !isOpenCart.value;
    };
    return {
      isOpenModal,
      isOpenModalAct,
      isOpenModalLogOut,
      isOpenModalLogOutAct,
      isOpenCart,
      isOpenCartAct,
    };
  },
};
</script>

<style scoped>
.forgotPassword {
  font-size: 14px;
  text-align: left;
  color: blue;
  cursor: pointer;
  width: fit-content;
}
.forgotPassword:hover {
  font-weight: 600;
  text-decoration: underline;
}
.header {
  top: 0;
  position: fixed;
  width: 100%;
  height: var(--headerHeight);
  background-color: #fdd7a4;
  z-index: 1;
}
.header_items {
  display: flex;
  justify-content: space-between;
  /* --centerWidth: 50%; */
  width: 100%;
  height: 100%;
  max-width: 1360px;
  margin: 0 auto;
}
.header_address,
.header_option {
  /* width: calc((80% - var(--centerWidth)) / 2); */
  margin-right: 40px;
}
.header_address-box {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #e7b425;
  border-radius: 30px;
  display: flex;
  align-items: center;
  padding: 6px 6px;
  cursor: pointer;
}
.header_address-box img {
  max-width: 40px;
  max-height: 40px;
  border-radius: 30px;
  margin-left: 6px;
}
.header_address-box p {
  width: calc(100% - 46px);
  color: white;
  font-weight: 700;
}

.header_navigation {
  /* width: var(--centerWidth); */
  min-width: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 40px;
}
.header_navigation img {
  width: 180px;
  height: 60px;
  border-radius: 7px;
  cursor: pointer;
}
.header_navigation img:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.header_navigation-box {
  margin-left: 30px;
  text-decoration: none;
}

.header_navigation-box p {
  color: black;
  text-underline-offset: var(--offset, 0.2em);
  text-decoration: none;
  transition: --offset 400ms, text-decoration-color 400ms, color 400ms,
    font-size 400ms;
  cursor: pointer;
}

.header_navigation-box p:hover,
.header_navigation-box p:focus {
  --offset: 0.4em;
  text-decoration-color: orange;
  color: orange;
  font-size: 18px;
}

.header_option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header_option img {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.span {
  position: relative;
  border-radius: 2.75rem;
  min-width: 0.6875rem;
  line-height: 1.2em;
  padding: 0px 0.3125rem;
  text-align: center;
  height: 1.25rem;
  border: 0.125rem solid var(--brand-primary-color, #ee4d2d);
  color: var(--brand-primary-color, #ee4d2d);
  background-color: #fff;
  left: -0.6rem;
  top: -0.5rem;
  margin-right: -0.875rem;
}

.header_option-user {
  position: relative;
  margin-right: 50px;
}
.header-user-info {
  list-style-type: none;
  display: none;
  min-width: 140px;
  height: 87px;
  left: -57px;
  top: 28px;
  /* top: 10%;
  right: 1%; */
  position: absolute;
  border: solid lightslategray;
  line-height: 40px;
  border-radius: 7px;
  padding: 0;
  font-size: 14px;
  background: white;
  color: black;
  font-weight: var(--font-weight-500);
  transition: ease-in-out 0.5s;
  text-align: left;
}
.header-user-info::after {
  content: "";
  position: absolute;
  width: 80px;
  height: 20px;
  top: -17px;
  left: 21px;
  cursor: pointer;
}
.header-user-info li {
  padding: 0 18px;
}
.header-user-info li:hover {
  background-color: #e0f7fa;
  cursor: pointer;
  border-radius: 7px;
}
.header-user-info li i {
  margin-right: 4px;
}
.header_option-user:hover .header-user-info {
  display: block;
}
.header-user-info_Admin {
  height: 124px;
}

.bottomMenuBar {
  display: none;
}

.modal-input {
  width: 100%;
  padding: 16px 14px;
  margin-top: 24px;
  border-radius: 16px;
}
.modal-submit {
  width: 100%;
  padding: 16px 14px;
  margin-top: 14px;
  margin-bottom: 12px;
  border-radius: 16px;
  background-color: #9b8413;
  cursor: pointer;
}
.otpInput {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 20px;
}

.otpInput input {
  height: 35px;
  width: 40px;
  border-radius: 10px;
  text-align: center;
}
.resendOtp {
  font-size: 14px;
  color: blue;
  text-align: left;
  cursor: pointer;
}
.modalError {
  font-size: 13px;
  color: red;
  text-align: left;
  margin-left: 16px;
}
.form-control-feedback {
  position: absolute;
  top: 4rem;
  right: 1rem;
  z-index: 2;
  display: block;
  text-align: center;
  cursor: pointer;
}

@media screen and (max-width: 1200px) {
  .header_navigation-box {
    margin-left: 12px;
    text-decoration: none;
  }
}

/*Horizontal Ipad(1024 x 768)*/
@media screen and (max-width: 1024px) {
  .header_address-box img {
    max-width: 30px;
    max-height: 30px;
  }
  .header_address-box p {
    font-size: 13px;
  }
}
@media screen and (max-width: 992px) {
  .header {
    display: none;
  }
  .bottomMenuBar {
    padding-bottom: 0px;
    min-height: 56px;
    width: 100%;
    position: fixed;
    bottom: 0px;
    left: 0px;
    box-shadow: rgb(44 51 73 / 60%) 0px 0.5rem 1rem 0px;
    display: flex;
    flex-direction: row;
    -webkit-box-align: center;
    align-items: center;
    justify-content: space-around;
    background-color: rgb(248, 249, 250);
    transition: bottom 0.4s ease 0s;
    z-index: 99;
  }
  .bottomMenuBar i {
    font-size: 20px;
    margin-bottom: 4px;
    margin-top: 4px;
  }
  .bottomMenuBar-items {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 12%;
    text-decoration: none;
    color: black;
    border-radius: 20px;
    cursor: pointer;
  }
  .bottomMenuBar-items p {
    font-size: 14px;
    margin-bottom: 4px;
  }
  .bottomMenuBar a.router-link-exact-active {
    color: #ffb100;
  }
  .bottomMenuBar-items span {
    position: absolute;
    border-radius: 2.75rem;
    min-width: 0.6875rem;
    /* line-height: 1.2em; */
    padding: 0px 0.1125rem;
    text-align: center;
    height: 1.25rem;
    border: 0.125rem solid var(--brand-primary-color, #ee4d2d);
    color: var(--brand-primary-color, #ee4d2d);
    background-color: #fff;
    left: 0.6rem;
    top: -0.5rem;
    /* margin-right: -0.875rem; */
  }
}
/*Vertical Ipad(768 x 1024)*/
@media screen and (max-width: 768px) {
}
@media screen and (max-width: 560px) {
}
/*Small tablet(480 x 640)*/
@media screen and (max-width: 480px) {
  .bottomMenuBar-items p {
    font-size: 12px;
  }
  .bottomMenuBar i {
    font-size: 16px;
  }
}
/*Iphone(480 x 640)*/
@media screen and (max-width: 320px) {
}
</style>
