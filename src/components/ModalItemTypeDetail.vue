<template>
  <div class="Modal" v-if="ModalTypeDetailActive">
    <span class="Modal-backdrop" @click="closeModalTypeDetail"></span>
    <transition name="bounce" appear>
      <div class="Modal-container">
        <div class="Modal-close" @click="closeModalTypeDetail">
          <i
            class="bi form-control-feedback bi-x-lg"
            style="font-size: 22px"
          ></i>
        </div>
        <div class="Modal-body">
          <h1>Item Detail</h1>
          <form @submit.prevent="updateItemType">
            <div class="Modal_inputs">
              <div class="Modal_input">
                <label>Type Name</label>
                <input
                  type="text"
                  placeholder="Type name"
                  maxlength="14"
                  v-model="Type.name"
                />
              </div>
              <div class="Modal_input">
                <label>Category</label>
                <select v-model="Type.style">
                  <option :value="0">Food</option>
                  <option :value="1">Drink</option>
                </select>
              </div>
            </div>
            <div class="Modal_inputs">
              <input
                type="file"
                accept="image/*"
                class="custom-image-input"
                @change="imageSelected"
              />
              <img v-if="previewImage" :src="previewImage" />
              <img v-else :src="Type.image" />
            </div>
            <p class="modalError">{{ Error }}</p>
            <div class="Modal_inputs">
              <button>Edit</button>
            </div>
          </form>
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
      <p>Are you sure you want to edit this type</p>
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
  name: "Modal-ItemTypeDetail",
  props: {
    ModalTypeDetailActive: {
      type: Boolean,
    },
    typeDetail: {
      type: Object,
    },
  },
  emits: ["closeModalTypeDetail"],
  setup(props, { emit }) {
    const closeModalTypeDetail = () => {
      emit("closeModalTypeDetail");
    };
    const openModalConfirm = ref(false);
    const openModalConfirmAct = () => {
      openModalConfirm.value = !openModalConfirm.value;
    };
    return { closeModalTypeDetail, openModalConfirm, openModalConfirmAct };
  },

  data() {
    return {
      Type: {
        id: "",
        image: "",
        name: "",
        style: null,
      },
      previewImage: undefined,
      image: null,
      Error: "",
    };
  },
  methods: {
    imageSelected(event) {
      this.image = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.image);
      reader.onload = (event) => {
        this.previewImage = event.target.result;
      };
    },
    async updateItemType() {
      this.Error = "";
      try {
        const type = new FormData();
        type.append("TypeId", this.Type.id);
        type.append("Name", this.Type.name);
        type.append("ImageUpload", this.image);
        const res = await this.$mainAxios.put(`ItemType/UpdateType`, type, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
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
  },
  watch: {
    typeDetail(value) {
      this.Type.id = value.id;
      this.Type.image = value.image;
      this.Type.name = value.name;
      this.Type.style = value.style;
      this.image = null;
    },
    ModalTypeDetailActive(value) {
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
.Modal_inputs:nth-child(2) {
  justify-content: flex-start;
  padding: 0 8px;
  align-items: center;
}
.Modal_inputs:last-child {
  justify-content: flex-end;
}
.Modal_inputs img {
  width: 115px;
  height: auto;
  margin-left: 26px;
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

.custom-image-input {
  color: transparent;
  width: 130px;
}
.custom-image-input::-webkit-file-upload-button {
  visibility: hidden;
}
.custom-image-input::before {
  content: "Select new image";
  color: black;
  display: inline-block;
  background: -webkit-linear-gradient(top, #f9f9f9, #e3e3e3);
  border: 1px solid #999;
  border-radius: 3px;
  padding: 5px 8px;
  outline: none;
  white-space: nowrap;
  -webkit-user-select: none;
  cursor: pointer;
  text-shadow: 1px 1px #fff;
  font-weight: 700;
  font-size: 10pt;
}
.custom-image-input:hover::before {
  border-color: black;
}
.custom-image-input:active {
  outline: 0;
}
.custom-image-input:active::before {
  background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9);
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
    justify-content: center;
  }
  .Modal_inputs img {
    margin-left: 0;
    margin-top: 16px;
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