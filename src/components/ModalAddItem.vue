<template>
  <div class="Modal" v-if="ModalAddItemActive">
    <span class="Modal-backdrop" @click="closeModalAddItem"></span>
    <transition name="bounce" appear>
      <div class="Modal-container">
        <div class="Modal-close" @click="closeModalAddItem">
          <i
            class="bi form-control-feedback bi-x-lg"
            style="font-size: 22px"
          ></i>
        </div>
        <div
          class="Modal-body"
          :style="ErrorText ? 'margin-bottom: 100px;' : ''"
        >
          <h1>Add New Item</h1>
          <div class="Modal-item-content">
            <label class="Modal_item-image" for="img-input">
              <!-- <img src="../assets/Images/Image/DrinkType/Cake.png" /> -->
              <img v-if="previewImage" :src="previewImage" />
            </label>
            <input
              type="file"
              accept="image/*"
              style="display: none"
              id="img-input"
              @change="imageSelected"
            />
            <div class="Modal_item-card-text">
              <div class="Modal_item-card-input">
                <p>Name:</p>
                <input type="text" placeholder="Name" v-model="newItem.name" />
              </div>
              <div class="Modal_item-card-input">
                <p>Price:</p>
                <input
                  type="text"
                  placeholder="Price"
                  v-model="newItem.price"
                  @keypress="isNumber($event)"
                  maxlength="5"
                />
              </div>
            </div>
          </div>
          <div class="Modal-item-category">
            <select v-model="newItem.typeId">
              <option value="" disabled selected hidden></option>
              <option v-for="type in types" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
          </div>
          <div class="Modal-item-size">
            <div class="Modal-item-size_header">
              <p>Size (check)</p>
            </div>
            <div class="Modal-item-size_body">
              <div
                class="Modal-item-size_body_content"
                v-for="size in sizes"
                :key="size.Name"
              >
                <input
                  type="checkbox"
                  :id="size.Name"
                  :name="size.Name"
                  :value="size"
                  :checked="size.Name == 'S'"
                  :disabled="size.Name == 'S'"
                  v-model="newItem.sizes"
                />
                <label
                  class="Modal-item-size_body_content_text"
                  :for="size.Name"
                >
                  <span>{{ size.Name }}</span>
                  <span v-if="size.Name == 'S'"
                    >+ {{ toLocaleNumber(size.Price) }}₫</span
                  >
                  <input
                    type="text"
                    v-else
                    v-model="size.Price"
                    @keypress="isNumber($event)"
                  />
                  <div class="checkbox"></div>
                </label>
              </div>
            </div>
          </div>
          <div class="Modal-item-topping">
            <div class="Modal-item-topping_header">
              <span
                >Topping (optional)
                <!-- <button :disabled="true" :class="true ? 'disabled' : ''">
                  <i class="bi bi-plus"></i></button -->
              </span>
            </div>
            <div
              class="Modal-item-topping_content"
              v-for="topping in toppings"
              :key="topping.id"
            >
              <div class="Modal_item-topping_content_container">
                <label
                  class="Modal-item-topping_content_text"
                  :for="topping.id"
                >
                  <span>{{ topping.name }}</span>
                  <span>+ {{ toLocaleNumber(topping.price) }}₫</span>
                  <input
                    type="checkbox"
                    :id="topping.id"
                    :value="topping.id"
                    v-model="newItem.toppings"
                  />
                  <div class="checkbox"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="Modal-footer">
          <p
            v-if="ErrorText"
            style="font-size: 12px; color: red; text-align: left"
          >
            {{ ErrorText }}
          </p>
          <button @click="addItem">Add Item</button>
        </div>
      </div>
    </transition>
  </div>
  <span v-else style="display: none"></span>
</template>

<script>
export default {
  name: "Modal-AddItem",
  props: {
    ModalAddItemActive: {
      type: Boolean,
    },
    toppings: {
      type: Array,
    },
    types: {
      type: Array,
    },
  },
  setup(props, { emit }) {
    const closeModalAddItem = () => {
      emit("closeModalAddItem");
    };
    return { closeModalAddItem };
  },
  watch: {
    ModalAddItemActive(value) {
      const body = document.querySelector("body");
      if (value) {
        body.style.overflow = "hidden";
      } else {
        body.style.overflow = "auto";
      }
    },
  },
  data() {
    return {
      newItem: {
        name: "",
        price: null,
        typeId: "",
        file: "",
        sizes: [
          {
            Name: "S",
            Price: 0,
          },
        ],
        toppings: [],
      },

      previewImage: undefined,
      sizes: [
        {
          Name: "S",
          Price: 0,
        },
        {
          Name: "M",
          Price: 5000,
        },
        {
          Name: "L",
          Price: 10000,
        },
      ],
      ErrorText: "",
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
    imageSelected(event) {
      this.newItem.file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.newItem.file);
      reader.onload = (event) => {
        this.previewImage = event.target.result;
      };
    },
    toLocaleNumber(value) {
      const result = value
        .toString()
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return result;
    },
    async addItem() {
      try {
        const item = new FormData();
        item.append("Name", this.newItem.name);
        item.append("Image", this.newItem.file);
        item.append("Price", this.newItem.price);
        item.append("TypeId", this.newItem.typeId);
        if (this.newItem.sizes.length > 0) {
          for (let i = 0; i < this.newItem.sizes.length; i++) {
            item.append(`GroupSizes[${i}].Name`, this.newItem.sizes[i].Name);
            item.append(`GroupSizes[${i}].Price`, this.newItem.sizes[i].Price);
          }
        }
        if (this.newItem.toppings.length > 0) {
          for (let i = 0; i < this.newItem.toppings.length; i++) {
            item.append("ToppingIds", this.newItem.toppings[i]);
          }
        }
        const res = await this.$mainAxios.post(`Item/AddItem`, item, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (res.status == 200) {
          window.location.reload();
        }
      } catch (error) {
        console.log(error.response);
        if (error.response.data.errors) {
          this.ErrorText = "";
          const _validateErrors = Object.values(error.response.data.errors);
          _validateErrors.map((value) => {
            if (this.ErrorText) {
              this.ErrorText += " " + value[0];
            } else {
              this.ErrorText += value[0];
            }
          });
        }

        if (error.response.status == 413) {
          this.ErrorText = "Image is too large";
        }
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
  width: 500px;
  max-width: calc(100% - 32px);
  max-height: 96%;
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
  max-height: 500px;
  overflow: auto;
  margin-bottom: 64px;
}

.Modal-body h1 {
  font-size: 22px;
}

.Modal-item-content {
  display: flex;
  margin-top: 16px;
}
.Modal_item-image {
  background-color: #fef3d7;
  width: 140px;
  min-height: 100px;
  height: auto;
  border-radius: 8px;
  position: relative;
  cursor: pointer;
}
.Modal_item-image:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
.Modal_item-image:hover::before {
  content: "Select new image";
  position: absolute;
  font-size: 14px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.Modal_item-image:hover img {
  opacity: 0.1;
}
.Modal_item-image img {
  width: 140px;
  height: 110px;
  object-fit: contain;
}
.Modal_item-card-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: 14px;
}
.Modal_item-card-input {
  display: flex;
  align-items: center;
}
.Modal_item-card-input:last-child {
  margin-top: auto;
}
.Modal_item-card-input p {
  font-size: 18px;
  margin-right: 8px;
  width: 50px;
}
.Modal_item-card-text input {
  padding: 12px;
  border-radius: 20px;
  border-color: black;
  flex: 1;
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

.Modal-item-category {
  margin-top: 18px;
}
.Modal-item-category select {
  width: 100%;
  font-size: 16px;
  padding: 10px 14px;
  border-radius: 6px;
  border-color: #b3b3b3;
  border-style: double;
  border-width: 2px;
  height: 40px;
}
.Modal-item-category select:focus {
  outline: none !important;
  border-color: #ffb100 !important;
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
.disabled {
  border-color: rgba(0, 0, 0, 0.1) !important;
  cursor: auto !important;
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
.Modal-item-size_body_content:not(:first-child) {
  width: 32%;
}
.Modal-item-size_body_content input[type="checkbox"] {
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
.Modal-item-size_body_content
  input[type="checkbox"]:checked
  ~ label
  > .checkbox {
  border: 5px solid #edb724;
}
.Modal-item-size_body_content
  input[type="checkbox"]:checked
  ~ label
  .checkbox::before {
  background: #edb724;
}
.Modal-item-size_body_content input[type="checkbox"]:checked ~ label {
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
.Modal-item-size_body_content_text > input {
  width: 100%;
  border-color: #b3b3b3;
  border-style: double;
  border-radius: 10px;
  padding: 4px;
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
.Modal-item-topping_header button {
  width: fit-content;
  height: fit-content;
  margin-left: 12px;
  border-radius: 8px;
  border: 2px solid black;
  cursor: pointer;
}
.Modal-item-topping_content {
  position: relative;
  padding: 15px 0;
  padding-bottom: 0;
  margin: 0 15px;
  text-align: left;
  font-size: 18px;
}
.Modal-item-topping_content_text {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  padding-right: 40px;
}
.Modal-item-topping_content_text span:first-child {
  padding-left: 6px;
}
.Modal-item-topping_content input[type="checkbox"] {
  position: absolute;
  display: none;
  right: 0;
  top: 0;
}
.Modal_item-topping_content_container {
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
}
.checkbox {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(0, -50%);
  height: 25px;
  width: 25px;
  border-radius: 10px;
  background-color: #eee;
}
.Modal-item-topping_content_text:hover input[type="checkbox"] ~ .checkbox {
  background-color: #ccc;
}
.Modal-item-topping_content_text input[type="checkbox"]:checked ~ .checkbox {
  background-color: #edb724;
}
.checkbox:after {
  content: "";
  position: absolute;
  display: none;
}
.Modal-item-topping_content_text
  input[type="checkbox"]:checked
  ~ .checkbox:after {
  display: block;
}
.Modal-item-topping_content_text .checkbox:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
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

.Modal-body::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

.Modal-body::-webkit-scrollbar {
  width: 8px;
  background-color: #f5f5f5;
}

.Modal-body::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
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

.bi-plus::before {
  font-size: 20px;
  font-weight: 800 !important;
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
  .Modal-item-content {
    flex-direction: column;
    align-items: center;
  }
  .Modal_item-card-text {
    padding: 0;
  }
  .Modal_item-card-input {
    margin-top: 10px !important;
  }
  .Modal_item-plus_minus {
    padding-top: 8px;
  }
  .Modal-item-size_body_content {
    margin-top: 8px;
  }
}
@media screen and (max-width: 400px) {
}
</style>
