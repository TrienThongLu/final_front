<template>
  <div class="Modal" v-if="ModalModifyItemActive">
    <span class="Modal-backdrop" @click="closeModalModifyItem"></span>
    <transition name="bounce" appear>
      <div class="Modal-container">
        <div class="Modal-close" @click="closeModalModifyItem">
          <i
            class="bi form-control-feedback bi-x-lg"
            style="font-size: 22px"
          ></i>
        </div>
        <div class="Modal-body">
          <h1>Update Item</h1>
          <div class="Modal-item-content">
            <div class="Modal_item-image">
              <!-- <img src="../assets/Images/Image/DrinkType/Cake.png" /> -->
              <img :src="modifyItem.image" />
            </div>
            <div class="Modal_item-card-text">
              <h3>{{ modifyItem.name }}</h3>
              <div class="Modal_item-card-price">
                <p>{{ toLocaleNumber(modifyItem.basePrice) }}₫</p>
                <div class="Modal_item-plus_minus">
                  <button
                    :disabled="modifyItem.quantity == 1"
                    @click="modifyItem.quantity--"
                  >
                    <i class="bi bi-dash-square-fill"></i>
                  </button>
                  <p style="margin: 0 14px">
                    {{ quantityMax == 0 ? quantityMax : modifyItem.quantity }}
                  </p>
                  <button
                    :disabled="
                      modifyItem.quantity == quantityMax || quantityMax == 0
                    "
                    @click="modifyItem.quantity++"
                  >
                    <i class="bi bi-plus-square-fill"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="Modal-item-size">
            <div class="Modal-item-size_header">
              <p>Size (required)</p>
            </div>
            <div class="Modal-item-size_body">
              <div
                class="Modal-item-size_body_content"
                v-for="size in groupSizes"
                :key="size.name"
              >
                <input
                  type="radio"
                  :id="size.name"
                  :name="size.name"
                  :value="size"
                  :disabled="quantityMax == 0"
                  v-model="modifyItem.size"
                />
                <label
                  class="Modal-item-size_body_content_text"
                  :for="size.name"
                >
                  <span>{{ size.name }}</span>
                  <span>+ {{ toLocaleNumber(size.price) }}₫</span>
                  <div class="checkbox"></div>
                </label>
              </div>
            </div>
          </div>
          <div
            class="Modal-item-topping"
            v-if="toppings && toppings.length != 0"
          >
            <div class="Modal-item-topping_header">
              <p>Topping (optional)</p>
            </div>
            <div
              class="Modal-item-topping_content"
              v-for="topping in toppings"
              :key="topping"
            >
              <div class="Modal_item-topping_content_container">
                <div class="Modal-item-topping_content_text">
                  <span>{{ topping.name }}</span>
                  <span>{{ toLocaleNumber(topping.price) }}₫</span>
                </div>
                <div class="Modal-item-topping_content_quantity">
                  <button
                    :disabled="topping.quantity == 0"
                    @click="
                      topping.quantity--;
                      minusTotalPrice(topping.price);
                    "
                  >
                    <i class="bi bi-dash-square-fill"></i>
                  </button>
                  <p style="margin: 0 14px">{{ topping.quantity }}</p>
                  <button
                    :disabled="topping.quantity == 2 || quantityMax == 0"
                    @click="
                      topping.quantity++;
                      plusTotalPrice(topping.price);
                    "
                  >
                    <i class="bi bi-plus-square-fill"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <span v-else style="display: none"></span>
        </div>
        <div class="Modal-footer">
          <button @click="updateItem" :disabled="quantityMax == 0">
            {{ toLocaleNumber(totalPrice) }}₫ - Update Item
          </button>
        </div>
      </div>
    </transition>
  </div>
  <span v-else style="display: none"></span>
</template>

<script>
export default {
  name: "Modal-ModifyItem",
  props: ["ModalModifyItemActive", "Item"],
  setup(props, { emit }) {
    const closeModalModifyItem = () => {
      emit("closeModalModifyItem");
    };
    return { closeModalModifyItem };
  },
  watch: {
    ModalModifyItemActive(value) {
      const body = document.querySelector("body");
      if (value) {
        body.style.overflow = "hidden";
        this.quantityMaxFunc();
      } else {
        body.style.overflow = "auto";
      }
    },
    Item(newValue) {
      this.totalPrice = 0;
      this.modifyItem.id = newValue.item.id;
      this.modifyItem.name = newValue.item.name;
      this.modifyItem.image = newValue.item.image;
      this.modifyItem.typeId = newValue.item.typeId;
      this.modifyItem.size = newValue.item.size;
      this.modifyItem.toppings = newValue.item.toppings;
      this.modifyItem.quantity = newValue.quantity;
      this.modifyItem.basePrice = newValue.item.basePrice;
      this.modifyItem.itemPrice =
        newValue.item.itemTotalPrice - newValue.item.size.price;
      this.totalPrice = newValue.totalPrice;
      this.modifyItem.itemTotalPrice = newValue.item.itemTotalPrice;

      this.getItem(newValue.item.id);
    },
    modifyItem: {
      handler(newValue) {
        this.totalPrice =
          (newValue.itemPrice + newValue.size.price) * newValue.quantity;
      },
      deep: true,
    },
  },
  computed: {},
  data() {
    return {
      modifyItem: {
        id: "",
        name: "",
        image: "",
        typeId: "",
        toppings: [],
        size: {},
        quantity: 0,
        basePrice: 0,
        itemPrice: 0,
        itemTotalPrice: 0,
      },

      groupSizes: [],

      totalPrice: 0,

      quantityMax: 0,

      toppings: [],
      Error: "",
    };
  },
  methods: {
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
    toLocaleNumber(value) {
      const result = value
        .toString()
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return result;
    },
    plusTotalPrice(value) {
      this.modifyItem.itemPrice += value;
    },
    minusTotalPrice(value) {
      this.modifyItem.itemPrice -= value;
    },
    async getItem(value) {
      try {
        const res = await this.$mainAxios.get(`Item/GetItem/${value}`);
        if (res.status == 200) {
          this.toppings = res.data.content.toppings;
          this.groupSizes = res.data.content.groupSizes;
          console.log(res);

          if (this.toppings && this.toppings.length > 0) {
            for (let topping of this.modifyItem.toppings) {
              var index = this.toppings.findIndex((t) => t.id == topping.id);
              this.toppings[index].quantity = topping.quantity;
            }
          }
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    updateItem() {
      let toppings = this.toppings.filter((t) => t.quantity != 0);
      let itemObject = {
        id: this.modifyItem.id,
        name: this.modifyItem.name,
        image: this.modifyItem.image,
        typeId: this.modifyItem.typeId,
        size: this.modifyItem.size,
        basePrice: this.modifyItem.basePrice,
        itemPrice: this.modifyItem.basePrice + this.modifyItem.size.price,
        itemTotalPrice: this.modifyItem.itemPrice + this.modifyItem.size.price,
        toppings: toppings,
      };
      let itemContainer = {
        item: itemObject,
        totalPrice: this.totalPrice,
        quantity: this.modifyItem.quantity,
      };
      var cart = JSON.parse(localStorage.getItem("Cart"));
      var index = cart.findIndex(
        (t) => JSON.stringify(t.item) == JSON.stringify(this.Item.item)
      );
      cart[index] = itemContainer;
      if (cart.length > 1) {
        var res = cart.reduce((acc, e) => {
          const found = acc.find(
            (x) => JSON.stringify(e.item) === JSON.stringify(x.item)
          );
          found ? (found.quantity += e.quantity) : acc.push(e);
          return acc;
        }, []);
        localStorage.setItem("Cart", JSON.stringify(res));
        this.$mitt.emit("itemAdded", true);
      } else {
        localStorage.setItem("Cart", JSON.stringify(cart));
        this.$mitt.emit("itemAdded", true);
      }
    },
  },
  mounted() {},
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
  max-height: 600px;
  overflow: auto;
  padding-bottom: 64px;
}

.Modal-body h1 {
  font-size: 22px;
}

.Modal-item-content {
  display: flex;
  margin-top: 16px;
}
.Modal-item-content h3 {
  font-size: 20px;
  min-height: 48px;
  line-height: 24px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-weight: 600;
  flex: 1;
}
.Modal_item-image {
  background-color: #fef3d7;
  width: fit-content;
  height: auto;
  border-radius: 8px;
}
.Modal_item-image img {
  width: 140px;
}
.Modal_item-card-text {
  text-align: left;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: 14px;
}
.Modal_item-card-price {
  display: flex;
  justify-content: space-between;
}
.Modal_item-plus_minus {
  display: flex;
  font-size: 22px;
}
.Modal_item-plus_minus i {
  font-size: 26px;
  cursor: pointer;
}
.Modal_item-plus_minus button {
  background: none;
  border: none;
}

.Modal-item-size {
  margin-top: 18px;
}
.Modal-item-size_header {
  text-align: left;
  padding: 6px 14px;
  font-size: 18px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
}
.Modal-item-size_body {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  margin-top: 12px;
}
.Modal-item-size_body_content {
  position: relative;
  font-size: 20px;
  cursor: pointer;
}
.Modal-item-size_body_content input[type="radio"] {
  position: absolute;
  visibility: hidden;
  left: 5%;
  top: 50%;
  transform: translateY(-50%);
}
.Modal-item-size_body_content .radio {
  display: block;
  position: absolute;
  border: 5px solid rgba(170, 170, 170, 1);
  border-radius: 100%;
  height: 25px;
  width: 25px;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  z-index: 5;
  transition: border 0.25s linear;
  -webkit-transition: border 0.25s linear;
}
.Modal-item-size_body_content:hover .radio {
  border: 5px solid rgba(170, 170, 170, 0.5);
}
.Modal-item-size_body_content .radio::before {
  display: block;
  position: absolute;
  content: "";
  border-radius: 100%;
  height: 15px;
  width: 15px;
  /* top: 5px;
  left: 5px; */
  margin: auto;
}
.Modal-item-size_body_content {
  position: relative;
  font-size: 20px;
  cursor: pointer;
}
.Modal-item-size_body_content input[type="radio"] {
  position: absolute;
  visibility: hidden;
  left: 5%;
  top: 50%;
  transform: translateY(-50%);
}
.Modal-item-size_body_content .checkbox {
  display: block;
  position: absolute;
  border: 5px solid rgba(170, 170, 170, 1);
  border-radius: 100%;
  height: 25px;
  width: 25px;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  z-index: 5;
  transition: border 0.25s linear;
  -webkit-transition: border 0.25s linear;
}
.Modal-item-size_body_content:hover .checkbox {
  border: 5px solid rgba(170, 170, 170, 0.5);
}
.Modal-item-size_body_content .checkbox::before {
  display: block;
  position: absolute;
  content: "";
  border-radius: 100%;
  height: 15px;
  width: 15px;
  /* top: 5px;
  left: 5px; */
  margin: auto;
}
.Modal-item-size_body_content input[type="radio"]:checked ~ label > .checkbox {
  border: 5px solid #edb724;
}
.Modal-item-size_body_content
  input[type="radio"]:checked
  ~ label
  .checkbox::before {
  background: #edb724;
}
.Modal-item-size_body_content input[type="radio"]:checked ~ label {
  color: #edb724;
}
.Modal-item-size_body_content_text {
  text-align: left;
  display: flex;
  padding-left: 30px;
  flex-direction: column;
  cursor: pointer;
  font-size: 18px;
}
.Modal-item-size_body_content_text span:first-child {
  padding-left: 6px;
}

.Modal-item-topping {
  margin-top: 18px;
}
.Modal-item-topping_header {
  text-align: left;
  padding: 6px 14px;
  font-size: 18px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
}
.Modal-item-topping_content {
  position: relative;
  padding: 15px 0;
  margin: 0 15px;
  text-align: left;
  font-size: 18px;
}
.Modal-item-topping_content_text {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  /* padding-right: 40px; */
}
/* .Modal-item-topping_content_text span:first-child {
  padding-left: 6px;
} */
.Modal-item-topping_content input[type="checkbox"] {
  position: absolute;
  display: none;
  right: 0;
  top: 0;
}
.Modal_item-topping_content_container {
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.Modal-item-topping_content_quantity {
  display: flex;
  font-size: 22px;
}
.Modal-item-topping_content_quantity button {
  background: none;
  border: none;
}
.Modal-item-topping_content_quantity i {
  font-size: 26px;
  cursor: pointer;
}

.Modal-footer {
  position: absolute;
  width: 100%;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.75rem;
  z-index: 5;
  background-color: white;
  border-top: 1px solid rgba(0, 0, 0, 0.3);
}
.Modal-footer button {
  width: 90%;
  border-radius: 20px;
  padding: 12px;
  background-color: #fdd7a4;
  border: none;
  font-weight: 700;
  cursor: pointer;
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
@media screen and (max-width: 560px) {
  .Modal {
    align-items: flex-end;
  }
  .Modal-container {
    max-width: unset;
    width: 100%;
    height: calc(100vh - 100px);
  }
  .Modal-body {
    padding: 24px 16px;
  }
  .Modal_item-card-price {
    flex-direction: column;
  }
  .Modal_item-plus_minus {
    padding-top: 8px;
  }
  .Modal-item-size_body_content {
    margin-top: 8px;
  }
}
</style>