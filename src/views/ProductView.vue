<template>
  <div class="product_container">
    <div class="product_header">
      <i class="bi bi-cup-straw"></i>
      <h1>Products</h1>
    </div>
    <ul>
      <li
        v-for="type in types"
        :key="type.id"
        @click="
          this.$router.push({
            name: 'product',
            params: { category: type.name },
          })
        "
      >
        <div class="product_type_item">
          <div class="product_type-img">
            <img :src="type.image" />
          </div>
          <p :class="category == type.name ? 'menu-active' : ''">
            {{ type.name }}
          </p>
        </div>
      </li>
    </ul>
    <div class="product_items">
      <div
        class="product_item-card"
        v-for="item in items"
        :key="item.id"
        @click="
          isOpenModalAddItemAct();
          itemDetail = item;
        "
      >
        <div class="product_item-card-content">
          <div class="product_item-card-image">
            <img :src="item.image" />
          </div>
          <div class="product_item-card-text">
            <h3>{{ item.name }}</h3>
            <div class="product_item-card-price">
              <p>{{ toLocaleNumber(item.price) }}₫</p>
              <i class="bi bi-patch-plus"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <modal-add-item-to-cart
    :ModalAddItemActive="isOpenModalAddItem"
    :Item="itemDetail"
    @closeModalAddItem="isOpenModalAddItemAct"
  ></modal-add-item-to-cart>
</template>

<script>
import { ref } from "vue";
import ModalAddItemToCart from "../components/ModalAddItemToCart.vue";

export default {
  components: {
    ModalAddItemToCart,
  },
  data() {
    return {
      types: [],
      items: [],

      itemDetail: {},
    };
  },
  methods: {
    toLocaleNumber(value) {
      const result = value
        .toString()
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return result;
    },
    async getListTypes() {
      try {
        const res = await this.$mainAxios.get(`ItemType/GetType`);
        if (res.status == 200) {
          this.types = res.data.content;
          // if (this.items.length == 0) {
          //   this.getListItems(res.data.content[0].id);
          // }
          // var result = this.types.filter((t) => t.name == this.category);
          // if (result) {
          //   this.getListItems(result[0].id);
          // }
          console.log(res);
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    async getListItems(value) {
      try {
        const res = await this.$mainAxios.get(`Item/GetItemByType/${value}`);
        if (res.status == 200) {
          this.items = res.data.content;
          console.log(res);
        }
      } catch (error) {
        console.log(error.response);
      }
    },
  },
  computed: {
    category() {
      if (this.$route.params.category) {
        return this.$route.params.category;
      }
      if (this.types.length > 0) {
        return this.types[0].name;
      }
      return "";
    },
  },
  watch: {
    category(newValue) {
      var result = this.types.filter((t) => t.name == newValue);
      if (result.length > 0 && result) {
        this.getListItems(result[0].id);
      }
    },
  },
  mounted() {
    // setTimeout(() => {
    //   this.getListTypes();
    // }, 5000);
    this.getListTypes();
  },
  setup() {
    const isOpenModalAddItem = ref(false);
    const isOpenModalAddItemAct = () => {
      isOpenModalAddItem.value = !isOpenModalAddItem.value;
    };

    return { isOpenModalAddItem, isOpenModalAddItemAct };
  },
};
</script>

<style scoped>
.menu-active {
  color: #fdd7a4 !important;
}
.product_container {
  width: 100%;
  max-width: 1360px;
  min-height: calc(100vh - 417px);
  margin: 0 auto;
  margin-top: 40px;
  margin-bottom: 4rem;
}
.product_header {
  display: flex;
  align-items: center;
  justify-content: center;
}
.product_header i:first-child {
  font-size: 30px;
  color: white;
  margin-right: 16px;
  background-color: #fdd7a4;
  border: 2px solid #fdd7a4;
  border-radius: 50%;
  padding: 2px 4px;
}
.product_header i:last-child {
  font-size: 26px;
  color: white;
  margin-left: 16px;
  background-color: #fdd7a4;
  border: 2px solid rgba(255, 255, 255, 0);
  border-radius: 30%;
  padding: 2px 4px;
}

.product_type {
  max-width: 500px;
  margin: 14px auto;
}
ul {
  display: flex;
  list-style: none;
  align-items: center;
  max-width: fit-content;
  margin: 0 auto;
  overflow-x: auto;
}
ul::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

ul::-webkit-scrollbar {
  height: 8px;
  background-color: #f5f5f5;
}

ul::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
ul > li {
  margin-left: 14px;
  margin-bottom: 10px;
  cursor: pointer;
}
.product_type_item {
  padding: 0.5rem 1rem;
}
.product_type-img {
  height: 86px;
  width: 86px;
  background-color: #fef3d7;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}
.product_type-img img {
  height: 80%;
}
.product_type_item > p {
  margin-top: 6px;
  color: #b2b2b2;
  font-weight: bold;
}

.product_items {
  display: flex;
  flex-wrap: wrap;
  margin: 0 60px;
  align-items: center;
}
.product_item-card {
  height: auto;
  flex: 0 0 calc(100% / 6);
  max-width: calc(100% / 6);
  padding: 0 12px;
  margin-top: 16px;
  cursor: pointer;
}
.product_item-card-content {
  padding: 10px;
  width: 100%;
  height: 100%;
  box-shadow: 5px 10px 18px #888888;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}
.product_item-card-image {
  background-color: #fef3d7;
  width: 100%;
  height: 200px;
  border-radius: 8px;
}
.product_item-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.product_item-card-text {
  padding-top: 14px;
  text-align: left;
  display: flex;
  flex-direction: column;
}
.product_item-card-text h3 {
  font-size: 16px;
  min-height: 48px;
  line-height: 24px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-weight: 600;
  flex: 1;
}
.product_item-card-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.product_item-card-price p {
  font-weight: bold;
}
.product_item-card-price i {
  cursor: pointer;
  font-size: 24px;
}
.product_item-card-price i:hover::before {
  opacity: 0.5;
}
@media screen and (max-width: 1300px) {
  .product_item-card {
    flex: 0 0 calc(100% / 5);
    max-width: calc(100% / 5);
  }
}
@media screen and (max-width: 1300px) {
  .product_item-card {
    flex: 0 0 calc(100% / 4);
    max-width: calc(100% / 4);
  }
}
@media screen and (max-width: 992px) {
  .product_item-card {
    flex: 0 0 calc(100% / 2);
    max-width: calc(100% / 2);
  }
  .product_item-card-content {
    flex-direction: row;
  }
  .product_item-card-image {
    width: 100px;
    height: 100px;
  }
  .product_item-card-text {
    padding-left: 14px;
    flex: 1;
    padding-top: 0;
  }
  .product_container {
    padding: 0 30px;
  }
}
@media screen and (max-width: 768px) {
  .product_items {
    margin: 0 auto;
    max-width: 540px;
  }
  .product_item-card {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
@media screen and (max-width: 560px) {
  .product_header h1 {
    font-size: 20px;
  }
  .product_header i:first-child {
    font-size: 26px;
  }
  .product_header i:last-child {
    font-size: 20px;
  }
}
@media screen and (max-width: 320px) {
}
</style>