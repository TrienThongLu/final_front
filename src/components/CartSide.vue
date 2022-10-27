<template>
  <transition name="slide-fade">
    <div class="Modal" v-if="CartActive">
      <span class="Modal-backdrop" @click="closeCart"></span>
      <div class="Modal-container">
        <div class="Modal-header">
          <div class="Modal-title">
            <i class="bi bi-bag-heart"></i>
            <p>Your cart ({{ cartItems ? cartItems.length : "0" }} items)</p>
          </div>
          <div class="Modal-close">
            <div @click="clearCart">
              <i class="bi bi-x-octagon"></i>
              Clear Cart
            </div>
            <i
              class="bi form-control-feedback bi-x-lg"
              style="font-size: 22px"
              @click="closeCart"
            ></i>
          </div>
        </div>
        <div class="Modal-body">
          <div class="no-items" v-if="!cartItems || cartItems.length == 0">
            <img src="../assets/Images/Icon/corgiCry.png" />
            <p>Your cart is empty</p>
          </div>
          <div class="has-items" v-else>
            <div class="item" v-for="cart in cartItems" :key="cart.item">
              <div class="item-image">
                <img :src="cart.item.image" />
              </div>
              <div class="item-description">
                <div class="item-description-first">
                  <h2>
                    {{ cart.item.name }} -
                    {{ toLocaleNumber(cart.item.itemPrice) }}₫
                  </h2>
                  <div class="item-description-topping">
                    <span>Size: {{ cart.item.size.name }}</span
                    ><span v-if="cart.item.toppings.length > 0"
                      >, Topping:
                      <span v-for="topping in cart.item.toppings" :key="topping"
                        >{{ topping.name }} x {{ topping.quantity }},
                      </span></span
                    ><span v-else style="display: none"></span>
                  </div>
                  <div class="item-description-plus_minus">
                    <button
                      :disabled="cart.quantity == 1"
                      @click="
                        cart.quantity--;
                        totalQuantity--;
                        updateCart();
                      "
                    >
                      <i class="bi bi-dash-square-fill"></i>
                    </button>
                    <p style="margin: 0 6px">{{ cart.quantity }}</p>
                    <button
                      :disabled="totalQuantity == 20"
                      @click="
                        cart.quantity++;
                        totalQuantity++;
                        updateCart();
                      "
                    >
                      <i class="bi bi-plus-square-fill"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="item-delete">
                <i
                  class="bi bi-pencil"
                  @click="
                    isOpenModalModifyItemAct();
                    itemDetail = cart;
                  "
                ></i>
                <i class="bi bi-trash3" @click="removeItem(cart)"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="Modal-footer">
          <div class="Modal-footer_price">
            <p>Total Price:</p>
            <p>{{ toLocaleNumber(totalPrice) }}₫</p>
          </div>
          <button
            :disabled="!cartItems || cartItems.length == 0"
            :style="!cartItems || cartItems.length == 0 ? 'opacity: 0.3' : ''"
            @click="payment"
          >
            PAYMENT
          </button>
        </div>
      </div>
    </div>
    <span v-else style="display: none"></span>
  </transition>
  <modal-modify-item-in-cart
    :ModalModifyItemActive="isOpenModalModifyItem"
    :Item="itemDetail"
    @closeModalModifyItem="isOpenModalModifyItemAct"
  ></modal-modify-item-in-cart>
</template>

<script>
import { ref } from "vue";
import ModalModifyItemInCart from "../components/ModalModifyItemInCart.vue";

export default {
  name: "Cart-Side",
  components: {
    ModalModifyItemInCart,
  },
  props: {
    CartActive: {
      type: Boolean,
      required: true,
    },
    // cartItems: {
    //   type: Array,
    //   default: () => [],
    // },
  },
  data() {
    return {
      cartItems: JSON.parse(localStorage.getItem("Cart")),
      itemDetail: {},

      totalPrice: 0,
      quantityMax: 0,
      totalQuantity: 0,
    };
  },
  watch: {
    CartActive(value) {
      const body = document.querySelector("body");
      if (value) {
        body.style.overflow = "hidden";
        this.quantityMaxFunc();
        this.totalPrice = 0;
        this.totalQuantity = 0;
        this.calcTotal();
      } else {
        body.style.overflow = "auto";
      }
    },
  },
  // computed: {
  //   cartItems() {
  //     var cart = JSON.parse(this.$cookies.get("Cart"));
  //     if (cart) {
  //       return cart;
  //     }
  //     return [];
  //   },
  // },
  methods: {
    clearCart() {
      localStorage.removeItem("Cart");
      this.$mitt.emit("itemAdded", true);
    },
    removeItem(value) {
      var cart = JSON.parse(localStorage.getItem("Cart"));
      cart = cart.filter((i) => JSON.stringify(i) != JSON.stringify(value));
      localStorage.setItem("Cart", JSON.stringify(cart));
      this.$mitt.emit("itemAdded", true);
    },
    toLocaleNumber(value) {
      const result = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return result;
    },
    calcTotal() {
      this.totalPrice = 0;
      this.totalQuantity = 0;
      if (this.cartItems && this.cartItems.length > 0) {
        for (let item of this.cartItems) {
          this.totalPrice += item.totalPrice;
          this.totalQuantity += item.quantity;
        }
      }
    },
    quantityMaxFunc() {
      var cart = JSON.parse(localStorage.getItem("Cart"));
      var totalQuantity = 0;
      if (cart) {
        for (let item of cart) {
          totalQuantity += item.quantity;
        }
      }
      this.quantityMax = 20 - totalQuantity;
    },
    updateCart() {
      for (let item of this.cartItems) {
        item.totalPrice = item.item.itemPrice * item.quantity;
      }
      console.log(this.cartItems);
      this.calcTotal();
      localStorage.setItem("Cart", JSON.stringify(this.cartItems));
      this.$mitt.emit("itemAdded", true);
    },
    payment() {
      this.closeCart();
      var userId = this.$cookies.get("UserId");
      var auth = this.$cookies.get("Auth");
      var token = this.$cookies.get("Token");
      if (userId == null && auth == null && token == null) {
        this.$mitt.emit("openLogin", true);
      } else {
        this.$router.push({ name: "payment" });
      }
    },
  },
  mounted() {
    this.$mitt.on("itemAdded", (isOpen) => {
      if (isOpen) {
        this.cartItems = JSON.parse(localStorage.getItem("Cart"));
        this.calcTotal();
      }
    });
  },
  emits: ["closeCart"],
  setup(props, { emit }) {
    const closeCart = () => {
      emit("closeCart");
    };

    const isOpenModalModifyItem = ref(false);
    const isOpenModalModifyItemAct = () => {
      isOpenModalModifyItem.value = !isOpenModalModifyItem.value;
    };

    return { closeCart, isOpenModalModifyItem, isOpenModalModifyItemAct };
  },
};
</script>


<style scoped>
.Modal {
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
  float: right;
  width: 664px;
  height: 100%;
  /* min-height: 300px; */
  background-color: white;

  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 26px;
  line-height: 26px;
  z-index: 2;
}

.Modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 26px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
}

.Modal-title {
  display: flex;
  align-items: center;
  color: #ff9f68;
}

.Modal-title p {
  font-size: 20px;
  margin-left: 12px;
}

.Modal-close {
  display: flex;
  align-items: center;
}

.Modal-close > i {
  cursor: pointer;
}

.Modal-close > div {
  display: flex;
  align-items: center;
  margin-right: 26px;
  font-size: 17px;
  cursor: pointer;
}

.Modal-close > div:hover {
  color: #ff9f68;
}

.Modal-close > div i {
  margin-right: 8px;
}

.Modal-body {
  height: calc(100vh - 188px);
  overflow-y: auto;
}

.Modal-body::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

.Modal-body::-webkit-scrollbar {
  width: 4px;
  background-color: #f5f5f5;
}

.Modal-body::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}

.no-items {
  margin-top: 36px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  color: #ff9f68;
}

.no-items img {
  width: 250px;
}

.item {
  padding: 16px 24px;
  height: 130px;
  border-bottom: 1px solid rgb(236, 239, 241);
  display: flex;
  align-items: flex-start;
}

.item-image {
  width: 84px;
  height: 100%;
  /* padding: 16px 14px; */
  /* background: rgba(175, 164, 150, 0.5); */
  border-radius: 8px;
}

.item-image img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.item-description {
  margin-left: 6px;
  width: calc(100% - 112px);
}

.item-description h2 {
  font-size: 20px;
  text-align: left;
  color: #ff9f68;
}

.item-description-topping {
  min-height: 40px;
  font-size: 16px;
  text-align: left;
  font-weight: 500;
}

.item-description-plus_minus {
  display: flex;
  font-size: 22px;
  justify-content: flex-end;
  /* margin-left: 14px; */
}
.item-description-plus_minus button {
  background: none;
  border: none;
}
.item-description-plus_minus i {
  font-size: 26px;
  cursor: pointer;
}

.item-delete {
  font-size: 22px;
}
.item-delete i {
  cursor: pointer;
  color: red;
}
/* .item-delete .bi::before {
  font-weight: 600 !important;
} */
.item-delete .bi-pencil {
  color: #ff9f68;
}

.Modal-footer {
  border-top: 2px solid rgba(0, 0, 0, 0.2);
  padding: 18px;
}

.Modal-footer_price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 12px;
  margin-bottom: 12px;
  font-size: 18px;
}

.Modal-footer button {
  width: 100%;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  background-color: #b19672;
}

.slide-fade-enter-active {
  transition: all 0.15s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.15s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

@media screen and (max-width: 992px) {
  .Modal-container {
    width: 100%;
    height: 100%;
  }
}
</style>