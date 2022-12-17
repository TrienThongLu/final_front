<template>
  <div class="userInfo_header">
    <i class="bi bi-person-fill"></i>
    <h1>My Account</h1>
  </div>
  <div class="userInfo_container">
    <div class="userInfo_items">
      <div
        class="userInfo_items-card"
        :class="userProfile.ranking ? userProfile.ranking : 'Bronze'"
      >
        <img src="../assets/Images/Icon/CorgiCoffee.png" />
        <div
          class="qr-code_container"
          v-if="auth == 'Online Customer' || auth == 'Admin'"
        >
          <qrcode-vue
            :value="JSON.stringify(qrCodeValue)"
            level="H"
            class="qr-code"
          />
        </div>
        <span v-else style="display: none"></span>
      </div>
      <ul>
        <li
          :class="paramType == 'profile' ? 'active' : ''"
          @click="route('profile')"
        >
          <i class="bi bi-person-square"></i>
          <p>Personal Information</p>
        </li>
        <li
          v-if="auth == 'Admin'"
          @click="this.$router.push({ name: 'admin' })"
        >
          <i class="bi bi-stars"></i>
          <p>Admin Page</p>
        </li>
        <span v-else style="display: none"></span>
        <li
          v-if="!auth.includes('Customer')"
          @click="this.$router.push({ name: 'orders' })"
        >
          <i class="bi bi-receipt-cutoff"></i>
          <p>Orders</p>
        </li>
        <span v-else style="display: none"></span>
        <li
          v-if="!auth.includes('Customer')"
          @click="this.$router.push({ name: 'ordersPrc' })"
        >
          <i class="bi bi-receipt-cutoff"></i>
          <p>Orders Processing</p>
        </li>
        <span v-else style="display: none"></span>
        <li
          v-if="auth == 'Online Customer' || auth == 'Admin'"
          :class="paramType == 'addresses' ? 'active' : ''"
          @click="route('addresses')"
        >
          <i class="bi bi-pin-map-fill"></i>
          <p>Addresses</p>
        </li>
        <span v-else style="display: none"></span>
        <li
          v-if="auth == 'Online Customer' || auth == 'Admin'"
          :class="paramType == 'history' ? 'active' : ''"
          @click="route('history')"
        >
          <i class="bi bi-clock-history"></i>
          <p>Purchase History</p>
        </li>
        <span v-else style="display: none"></span>
        <li
          @click="isOpenModalAct()"
          v-if="auth == 'Online Customer' || auth == 'Admin'"
        >
          <i class="bi bi-key" style="transform: rotate(90deg)"></i>
          <p>Change password</p>
        </li>
        <span v-else style="display: none"></span>
        <li @click="logout()">
          <i class="bi bi-door-open"></i>
          <p>Logout</p>
        </li>
      </ul>
    </div>
    <div class="userInfo_detail">
      <div class="userInfo_profile" v-if="paramType == 'profile'">
        <div style="margin-bottom: 20px">
          <h1>Current Ranking: {{ userProfile.ranking }}</h1>
          <div class="progress-container">
            <div
              class="progress-circular"
              :style="`background: conic-gradient(#ffb100 ${
                (userProfile.point / userProfile.targetPoint) * 100 * 3.6
              }deg, #ededed 0deg)`"
            >
              <p class="progress-value">
                {{ userProfile.point }} / {{ userProfile.targetPoint }}
              </p>
              <p class="progress-value">To Get {{ userProfile.targetRank }}</p>
            </div>
          </div>
        </div>
        <div>
          <h1>Personal Information</h1>
          <form @submit.prevent="updateUser">
            <div class="userInfo_profile_inputs">
              <div class="userInfo_profile_input">
                <label>Full Name</label>
                <input
                  type="text"
                  v-model="userProfile.fullname"
                  maxlength="30"
                />
              </div>
              <div class="userInfo_profile_input" v-if="auth != 'Customer'">
                <label>Phone number</label>
                <input
                  disabled
                  type="text"
                  readonly
                  v-model="userProfile.phonenumber"
                />
              </div>
              <span v-else style="display: none"></span>
            </div>
            <div class="userInfo_profile_inputs">
              <div class="userInfo_profile_input">
                <label>Date of Birth</label>
                <input type="date" v-model="userProfile.dob" />
              </div>
              <div class="userInfo_profile_input">
                <label>Gender</label>
                <select v-model="userProfile.gender">
                  <option value="" disabled selected hidden>
                    Please Choose...
                  </option>
                  <option value="0">Male</option>
                  <option value="1">Female</option>
                  <option value="2">Other</option>
                </select>
              </div>
            </div>
            <p class="modalError" v-html="Error"></p>
            <div
              class="userInfo_profile_inputs"
              v-if="auth == 'Online Customer' || auth == 'Admin'"
            >
              <button>Update</button>
            </div>
            <span v-else style="display: none"></span>
          </form>
        </div>
      </div>
      <div class="userInfo_addresses" v-else-if="paramType == 'addresses'">
        <div class="userInfo_addresses_element">
          <p>
            You added <b>{{ userProfile.addresses.length }}</b> addresses
          </p>
          <button @click="isOpenModalAddAddressAct">Add</button>
        </div>
        <div class="userInfo_addresses_element" style="flex-wrap: wrap">
          <div
            v-for="address in userProfile.addresses"
            :key="address"
            class="userInfo_addresses_element_address"
          >
            <div class="userInfo_addresses_element_address-top">
              <div class="userInfo_addresses_element_address-top-1">
                <i class="bi bi-geo-alt"></i>
              </div>
              <div class="userInfo_addresses_element_address-top-2">
                <p @click="deleteAddress(address)">Delete</p>
              </div>
            </div>
            <p v-html="addressSplit(address)"></p>
            <div class="userInfo_addresses_element_address-address">
              <span style="text-decoration: underline">Address:</span>
              <span v-html="addressRemove(address)"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="userInfo_point" v-else-if="paramType == 'history'">
        <div>
          <h1>Purchase History</h1>
          <select v-model="orderStatusSearch">
            <option value="" selected>All</option>
            <option
              v-for="status in statusList"
              :key="status.value"
              :value="status.value"
            >
              {{ status.name }}
            </option>
          </select>
        </div>
        <div class="table-container">
          <table class="table-container-responsive">
            <thead>
              <tr class="table-container-header">
                <th>Store</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="table-row"
                v-for="order in orders"
                :key="order.id"
                @click="
                  isOpenModalOrderDetailAct();
                  orderDetailId = order.sId;
                "
              >
                <td class="col-1">{{ order.store }}</td>
                <td class="col-2">{{ order.type }}</td>
                <td class="col-3">{{ order.amount }}</td>
                <td class="col-4">{{ order.paymentMethod }}</td>
                <td class="col-5">
                  {{ convertToDateTime(order.createdDate) }}
                </td>
                <td class="col-6">{{ order.status }}</td>
              </tr>
            </tbody>
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
      <span v-else style="display: none"></span>
    </div>
  </div>
  <component
    :is="'modal-login'"
    v-if="isOpenModal"
    :ModalActive="isOpenModal"
    @closeModal="isOpenModalAct"
  >
    <div>
      <form @submit.prevent="changePassword">
        <div style="position: relative">
          <p style="font-size: 14px">
            Change password for {{ userProfile.phonenumber }}
          </p>
          <div style="position: relative">
            <input
              class="modal-input"
              :type="isShow ? 'text' : 'password'"
              ref="resetPassword"
              placeholder="Password*"
              v-model="password"
              maxlength="16"
              required
            />
            <i
              class="bi form-control-feedback"
              style="font-size: 22px; top: 2.35rem; font-style: normal"
              @click="isShow = !isShow"
              >{{ isShow ? "🐵" : "🙈" }}</i
            >
          </div>
          <div style="position: relative">
            <input
              class="modal-input"
              :type="isShowRe ? 'text' : 'password'"
              placeholder="Re-enter Password*"
              v-model="reEnterPassword"
              maxlength="16"
              @keypress="checkSamePassword"
              required
            />
            <i
              class="bi form-control-feedback"
              style="font-size: 22px; top: 2.35rem; font-style: normal"
              @click="isShowRe = !isShowRe"
              >{{ isShowRe ? "🐵" : "🙈" }}</i
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
              modalError != '' ||
              !lowerCase ||
              !upperCase ||
              !numberCase ||
              !countCase
            "
          >
            Reset
          </button>
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
        <p>Enter password to logout</p>
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
          {{ modalError }}
        </p>
        <button class="modal-submit" style="margin-top: 0">Logout</button>
      </div>
    </form>
  </component>
  <span v-else style="display: none"></span>
  <modal-add-address
    :ModalActive="isOpenModalAddAddress"
    @closeModalAddAddress="isOpenModalAddAddressAct"
  ></modal-add-address>
  <modal-order-detail
    :ModalOrderDetailActive="isOpenModalOrderDetail"
    :OrderId="orderDetailId"
    @closeModalOrderDetail="isOpenModalOrderDetailAct"
  ></modal-order-detail>
</template>

<script>
import { ref } from "vue";
import ModalAddAddress from "../components/ModalAddAddress.vue";
import ModalOrderDetail from "../components/ModalOrderDetail.vue";
import QrcodeVue from "qrcode.vue";

export default {
  components: {
    ModalOrderDetail,
    ModalAddAddress,
    QrcodeVue,
  },
  data() {
    return {
      paramType: this.$route.params.type,
      cardName: "",
      userProfile: {
        phonenumber: null,
        fullname: null,
        dob: null,
        gender: null,
        point: null,
        targetPoint: null,
        targetRank: null,
        ranking: null,
        addresses: [],
      },
      qrCodeValue: {
        id: "",
        phonenumber: "",
      },
      pagination: {
        totalPage: 1,
        currentPage: 1,
      },
      statusList: [
        {
          value: 0,
          name: "Pending Payment",
        },
        {
          value: 1,
          name: "Processing",
        },
        {
          value: 2,
          name: "On Delivery",
        },
        {
          value: 3,
          name: "Completed",
        },
      ],
      orderStatusSearch: "",
      orders: [],
      orderDetailId: "",
      Error: "",
      modalError: "",

      password: "",
      reEnterPassword: "",
      lowerCase: false,
      upperCase: false,
      numberCase: false,
      countCase: false,
      isShow: false,
      isShowRe: false,
    };
  },
  methods: {
    route(value) {
      this.$router.push({ name: "profile", params: { type: value } });
      this.$nextTick(() => {
        this.paramType = value;
      });
    },
    convertToDateTime(value) {
      var date = new Date(value);
      return date.toLocaleDateString();
    },
    onPageChange(page) {
      this.pagination.currentPage = page;
      this.getOrders();
    },
    toggle() {
      this.isShow = !this.isShow;
    },
    img(url) {
      if (url !== "") {
        try {
          url = require("@/assets/Images/Rank/" + url + ".png");
        } catch (e) {
          url = require("@/assets/Images/Rank/Bronze.png");
        }
      } else url = require("@/assets/Images/Rank/Bronze.png");
      return url;
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
    addressSplit(value) {
      let province = "Province: " + value.split(",")[3];
      return province;
    },
    addressRemove(value) {
      const arrayAddress = value.split(",");
      let address = " " + arrayAddress[0] + arrayAddress[1] + arrayAddress[2];
      return address;
    },
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
      }
    },
    async getUser() {
      try {
        const _userId = this.$cookies.get("UserId");
        const res = await this.$mainAxios.get(`User/GetUser/${_userId}`);
        if (res.status == 200) {
          console.log(res);
          this.cardName = res.data.content.fullname;
          this.userProfile.phonenumber = res.data.content.phoneNumber;
          this.userProfile.fullname = res.data.content.fullname;
          this.userProfile.gender = res.data.content.gender;
          this.userProfile.ranking = res.data.content.ranking;
          this.userProfile.point = res.data.content.point;
          this.userProfile.targetPoint = res.data.content.targetPoint;
          this.userProfile.targetRank = res.data.content.targetRank;

          this.qrCodeValue.id = _userId;
          this.qrCodeValue.phonenumber = res.data.content.phoneNumber;
          if (res.data.content.addresses) {
            this.userProfile.addresses = res.data.content.addresses;
          }
          if (res.data.content.doB) {
            this.userProfile.dob = this.getDate(res.data.content.doB);
          }
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    async updateUser() {
      this.Error = "";
      try {
        let date = null;
        if (this.userProfile.dob) {
          date = Date.parse(this.userProfile.dob);
        }
        const editUser = {
          id: this.$cookies.get("UserId"),
          fullname: this.userProfile.fullname,
          gender: this.userProfile.gender,
          doB: date,
        };
        const res = await this.$mainAxios.put(
          `User/UpdateProfileUser`,
          editUser
        );
        if (res.status == 200) {
          window.location.reload();
        }
      } catch (error) {
        const _validateErrors = Object.values(error.response.data.errors);
        _validateErrors.map((value) => {
          if (this.Error) {
            this.Error += "<br>" + value[0];
          } else {
            this.Error += value[0];
          }
        });
      }
    },
    async deleteAddress(value) {
      try {
        const address = {
          id: this.$cookies.get("UserId"),
          address: value,
        };
        console.log(address);
        const res = await this.$mainAxios.delete(`User/RemoveAddress`, {
          data: address,
        });
        if (res.status == 200) {
          window.location.reload();
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    async changePassword() {
      try {
        const userData = {
          id: this.$cookies.get("UserId"),
          password: this.password,
        };
        const res = await this.$mainAxios.put(`User/ChangePassword/`, userData);
        if (res.status === 200) {
          console.log(res);
          window.location.reload();
        }
      } catch (error) {
        console.log(error.response);
        this.modalError = error.response.data.message;
      }
    },
    async getOrders() {
      try {
        const res = await this.$mainAxios.get(
          `Order/UserGetOrders/${this.$cookies.get("UserId")}?currentPage=${
            this.pagination.currentPage
          }&status=${this.orderStatusSearch}`
        );
        if (res.status === 200) {
          this.orders = res.data.data.data;
          this.pagination.totalPage = res.data.data.totalPage;
          console.log(res);
        }
      } catch (error) {
        console.log(error.response);
        this.modalError = error.response.data.message;
      }
    },
  },
  watch: {
    // $route(to, from) {
    //   if (to !== from && to.name == "profile") {
    //     this.route(this.$route.params.type);
    //   }
    // },
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
    },
    reEnterPassword(newValue) {
      if (newValue !== this.password) {
        this.modalError = "Passwords must match";
      } else {
        this.modalError = "";
      }
    },
    orderStatusSearch() {
      this.getOrders();
    },
  },
  mounted() {
    this.getUser();
    this.getOrders();
  },
  computed: {
    auth() {
      return this.$cookies.get("Auth");
    },
  },
  setup() {
    const isOpenModalAddAddress = ref(false);
    const isOpenModalAddAddressAct = () => {
      isOpenModalAddAddress.value = !isOpenModalAddAddress.value;
    };

    const isOpenModal = ref(false);
    const isOpenModalAct = () => {
      isOpenModal.value = !isOpenModal.value;
    };

    const isOpenModalLogOut = ref(false);
    const isOpenModalLogOutAct = () => {
      isOpenModalLogOut.value = !isOpenModalLogOut.value;
    };

    const isOpenModalOrderDetail = ref(false);
    const isOpenModalOrderDetailAct = () => {
      isOpenModalOrderDetail.value = !isOpenModalOrderDetail.value;
    };

    return {
      isOpenModalAddAddress,
      isOpenModalAddAddressAct,
      isOpenModal,
      isOpenModalAct,
      isOpenModalLogOut,
      isOpenModalLogOutAct,
      isOpenModalOrderDetail,
      isOpenModalOrderDetailAct,
    };
  },
};
</script>

<style scoped>
.black {
  color: black;
}
.modalError {
  font-size: 13px;
  color: red;
  text-align: left;
  margin-left: 16px;
  margin-top: 16px;
}
.userInfo_header {
  margin: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.userInfo_header i {
  font-size: 30px;
  color: white;
  margin-right: 16px;
  background-color: #fdd7a4;
  border: 2px solid #fdd7a4;
  border-radius: 50%;
  padding: 2px 4px;
}
.userInfo_container {
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  min-height: 500px;
  margin-bottom: 30px;
}
.userInfo_items-card {
  position: relative;
  height: 200px;
  border-radius: 16px;
}
.Bronze {
  background-color: rgba(205, 127, 50, 1);
}
.Silver {
  background-color: rgba(192, 192, 192, 0.5);
}
.Gold {
  /* background-color: rgba(212, 175, 55, 1); */
  background-image: url("../assets/Images/Rank/g.png");
  background-repeat: no-repeat;
  background-size: cover;
}
.Diamond {
  background-image: url("../assets/Images/Rank/Diamond.png");
  background-repeat: no-repeat;
  background-size: cover;
}
.userInfo_items-card img {
  width: 60%;
  position: absolute;
  left: 32%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.userInfo_items-card .qr-code_container {
  position: absolute;
  left: 80%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 8px;
  border: 2px solid black;
  border-radius: 20px;
}
.userInfo_items-card .qr-code {
  width: 84px;
  height: 82px;
}
.userInfo_items-card p {
  position: absolute;
  top: 10%;
  left: 28px;
  font-weight: 600;
  letter-spacing: 1.5px;
  white-space: nowrap;
  text-overflow: clip;
  width: 270px;
  overflow: hidden;
  text-align: left;
}
.userInfo_items-card .number {
  top: 22%;
}
.userInfo_items-card span {
  position: absolute;
  bottom: 17%;
  right: 10%;
  font-size: 26px;
  color: white;
}
.userInfo_items {
  width: 30%;
  max-width: 340px;
  margin-right: 20px;
}
.userInfo_items ul {
  list-style: none;
  margin-top: 20px;
  padding: 24px;
  border: 1px solid rgb(217, 217, 217);
  height: fit-content;
  border-radius: 8px;
  text-align: left;
}
.userInfo_items ul li {
  margin-bottom: 12px;
  padding: 0 12px;
  cursor: pointer;
  padding-bottom: 6px;
  border-bottom: 2px solid #c4c4c4;
}
.userInfo_items ul li i {
  color: #c4c4c4;
}
.active {
  color: #ffb100 !important;
  border-bottom: 2px solid #ffb100 !important;
}
.active i {
  color: #ffb100 !important;
}
.userInfo_items ul li:last-child {
  margin: 0;
}
.userInfo_items ul li i {
  font-size: 22px;
  margin-right: 18px;
}
.userInfo_items ul li p {
  font-size: 16px;
}
.userInfo_items ul li i,
.userInfo_items ul li p {
  display: inline-block;
}

.userInfo_detail {
  width: 62%;
}
.userInfo_profile {
  padding: 24px;
  border: 1px solid rgb(217, 217, 217);
  height: fit-content;
  border-radius: 8px;
}
.userInfo_profile h1 {
  font-size: 20px;
  text-align: left;
}
.progress-container {
  display: flex;
  width: 100%;
  padding: 50px 0;
  border-radius: 8px;
  background: #fff;
  row-gap: 30px;
  flex-direction: column;
  align-items: center;
}
.progress-circular {
  position: relative;
  height: 250px;
  width: 250px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.progress-circular::before {
  content: "";
  position: absolute;
  height: 210px;
  width: 210px;
  border-radius: 50%;
  background-color: #fff;
}
.progress-value {
  position: relative;
  font-size: 22px;
  font-weight: 600;
  color: #ffb100;
  width: 70%;
}
.userInfo_profile_inputs:last-child {
  justify-content: flex-end;
}
.userInfo_profile_inputs button {
  height: 32px;
  width: 72px;
  font-weight: 600;
  border-radius: 12px;
  border-color: transparent;
  background-color: #ffb100;
  margin-right: 16px;
  cursor: pointer;
}
.userInfo_profile_inputs {
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
}
.userInfo_profile_input {
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 46%;
}
.userInfo_profile_input label {
  margin-left: 16px;
  margin-bottom: 6px;
}
.userInfo_profile_input input {
  width: 100%;
  min-width: 95%;
  padding: 10px 14px;
  border-radius: 6px;
  border-color: #b3b3b3;
  border-style: double;
  height: 40px;
}
input:read-only {
  background-color: rgba(128, 128, 128, 0.4);
}
.userInfo_profile_input input:focus {
  outline: none !important;
  border-color: #ffb100 !important;
}
.userInfo_profile_input select {
  width: 100%;
  padding: 10px 14px;
  border-radius: 6px;
  border-color: #b3b3b3;
  border-style: double;
  border-width: 2px;
  height: 40px;
}
.userInfo_profile_input select:focus {
  outline: none !important;
  border-color: #ffb100 !important;
}

.userInfo_addresses {
  padding: 24px;
  border: 1px solid rgb(217, 217, 217);
  height: fit-content;
  border-radius: 8px;
}
.userInfo_addresses_element {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.userInfo_addresses_element:last-child {
  margin-top: 20px;
}
.userInfo_addresses_element p {
  text-align: left;
}
.userInfo_addresses_element button {
  height: 32px;
  width: 72px;
  font-weight: 600;
  border-radius: 12px;
  border-color: transparent;
  background-color: #ffb100;
  cursor: pointer;
}
.userInfo_addresses_element_address {
  min-height: 160px;
  width: 49%;
  border: 2px solid rgb(217, 217, 217);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 12px;
  cursor: pointer;
}
.userInfo_addresses_element_address:hover {
  border: 2px solid #ffb100;
}
.userInfo_addresses_element_address-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.userInfo_addresses_element_address-top-1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.userInfo_addresses_element_address-top-1 p {
  background-color: #ffb100;
  border-radius: 8px;
  padding: 4px;
  font-size: 14px;
  color: white;
  font-weight: 600;
}
.userInfo_addresses_element_address-top-1 i {
  font-size: 20px;
  margin-right: 12px;
}
.userInfo_addresses_element_address-top-2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.userInfo_addresses_element_address-top-2 p {
  text-decoration: underline;
  color: #ffb100;
  font-weight: 600;
  cursor: pointer;
}
.userInfo_addresses_element_address-top-2 p:first-child {
  margin-right: 12px;
}
.userInfo_addresses_element_address > p {
  font-weight: 600;
  margin: 10px 4px;
}
.userInfo_addresses_element_address span {
  text-align: left;
}
.userInfo_addresses_element_address-bottom {
  display: none;
}
.userInfo_addresses_element_address-address {
  text-align: left;
  margin: 0 4px;
  margin-bottom: 4px;
  line-height: 24px;
}
.userInfo_addresses_element_address-phonenumber {
  text-align: left;
  margin: 0 4px;
}

.userInfo_point {
  padding: 24px;
  border: 1px solid rgb(217, 217, 217);
  height: fit-content;
  border-radius: 8px;
  position: relative;
}
.userInfo_point h1 {
  font-size: 20px;
  text-align: left;
}
.userInfo_point > div:first-child {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.userInfo_point select {
  /* width: 100%; */
  font-size: 16px;
  padding: 10px 14px;
  border-radius: 6px;
  border-color: #b3b3b3;
  border-style: double;
  border-width: 2px;
  height: 40px;
}
.userInfo_point select:focus {
  outline: none !important;
  border-color: #ffb100 !important;
}

.table-container {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  /* padding-left: 10px;
  padding-right: 10px; */
  margin-bottom: 40px;
  height: 384px;
  overflow-y: auto;
  margin-top: 22px;
}
.table-container-responsive {
  border-spacing: unset !important;
  width: 100%;
}
.table-container::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

.table-container::-webkit-scrollbar {
  width: 10px;
  background-color: #f5f5f5;
}

.table-container::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
.table-container-responsive tr {
  border-radius: 3px;
  /* padding: 25px 30px;
  display: flex;
  justify-content: space-between; */
  margin-bottom: 10px;
}
.table-container-header {
  background-color: #95a5a6;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  position: sticky;
  top: 0;
  width: fit-content;
}
.table-row {
  background-color: #ffffff;
  box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  width: fit-content;
}
.table-row:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
.table-row > td,
.table-container-header > th {
  padding: 25px 30px;
}
.col-1 {
  min-width: 130px;
}
.col-2 {
  min-width: 100px;
}
.col-3 {
  min-width: 100px;
}
.col-4 {
  min-width: 100px;
}
.col-5 {
  min-width: 128px;
}
.col-6 {
  min-width: 100px;
}

.modal-input {
  width: 100%;
  padding: 16px 14px;
  margin-top: 24px;
  border-radius: 16px;
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
.modal-submit {
  width: 100%;
  padding: 16px 14px;
  margin-top: 14px;
  margin-bottom: 12px;
  border-radius: 16px;
  background-color: #9b8413;
  cursor: pointer;
}

.pagination-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20px;
}

/*Horizontal Ipad(1024 x 768)*/
@media screen and (max-width: 1024px) {
  .userInfo_items-card span {
    position: absolute;
    bottom: 17%;
    right: 10%;
    font-size: 24px;
    color: white;
  }
}

@media screen and (max-width: 992px) {
  .userInfo_detail {
    width: 86%;
    margin-top: 24px;
  }
  .userInfo_container {
    height: auto;
    padding-bottom: 30px;
    flex-direction: column;
    align-items: center;
  }
  .userInfo_items {
    margin: 0;
    max-width: none;
    width: 60%;
  }
  .userInfo_items-card {
    width: 340px;
    margin: 0 auto;
  }
  /* .userInfo_items-card img {
    border-radius: 35px;
  }
  .userInfo_items-card span {
    bottom: 18%;
    right: 12%;
    font-size: 3.8vw;
  } */
  .userInfo_items-card p {
    font-size: 4vw;
  }
}

@media (max-width: 900px) {
  .userInfo_addresses_element_address {
    width: 100%;
  }
}

/*Vertical Ipad(768 x 1024)*/
@media screen and (max-width: 768px) {
  .userInfo_items {
    width: 76%;
  }
  .userInfo_items-card span {
    bottom: 18%;
    right: 11%;
    font-size: 4.8vw;
  }
}
@media screen and (max-width: 700px) {
}
@media screen and (max-width: 560px) {
  .userInfo_items {
    width: 86%;
  }
  .userInfo_items-card img {
    border-radius: 26px;
  }
  .userInfo_items-card span {
    bottom: 18%;
    right: 11%;
    font-size: 5.8vw;
  }
  .userInfo_profile_inputs {
    flex-wrap: wrap;
  }
  .userInfo_profile_input {
    width: 100%;
  }
  .userInfo_profile_inputs > .userInfo_profile_input:first-child {
    margin-bottom: 16px;
  }
}
/*Small tablet(480 x 640)*/
@media screen and (max-width: 480px) {
  .userInfo_container {
    align-items: flex-start;
  }
  .userInfo_items,
  .userInfo_detail {
    width: 340px;
    margin-left: auto;
    margin-right: auto;
  }
}
/*Iphone(480 x 640)*/
@media screen and (max-width: 320px) {
  .userInfo_header h1 {
    font-size: 20px;
  }
  .userInfo_items ul {
    padding: 12px;
  }
  .userInfo_items-card p {
    font-size: 6vw;
  }
  .userInfo_profile {
    padding: 6px;
  }
  /* .userInfo_detail {
    width: 94%;
  } */
}
/*Small phone*/
@media screen and (max-width: 240px) {
}
</style>
