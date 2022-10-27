<template>
  <div style="min-height: calc(100vh - 422px)">
    <div
      class="ty-header"
      v-if="
        resultCode == 0 ||
        (this.$route.query.partnerCode == 'empty' &&
          this.$route.query.orderId == 'empty')
      "
    >
      <i class="bi bi-heart-fill"></i>
      <h1>Thank You for your purchase</h1>
    </div>
    <div class="ty-header" v-else>
      <i class="bi bi-emoji-frown"></i>
      <h1>Order Failed. Please try again later</h1>
    </div>
    <h1 style="font-size: 20px" v-show="redirect">
      Redirecting to home in {{ timerCount }}
    </h1>
  </div>
</template>

<script>
var timeout;

export default {
  components: {},
  data() {
    return {
      timerCount: undefined,
      redirect: false,
    };
  },
  methods: {
    async transactionReturn() {
      if (
        !this.redirect &&
        this.$route.query.partnerCode != "empty" &&
        this.$route.query.orderId != "empty"
      ) {
        try {
          const transactionObject = {
            partnerCode: this.$route.query.partnerCode,
            orderId: this.$route.query.orderId,
            requestId: this.$route.query.requestId,
            transId: this.$route.query.transId,
            resultCode: this.$route.query.resultCode,
          };
          const res = await this.$mainAxios.put(
            `Order/MoMoTransaction`,
            transactionObject
          );
          if (res.status == 200) {
            console.log(res);
          }
        } catch (error) {
          console.log(error.response);
        }

        this.timerCount = 30;
        this.redirect = true;
        timeout = setTimeout(() => {
          this.$router.push({ name: "product" });
        }, 31000);
      } else {
        this.timerCount = 30;
        this.redirect = true;
        timeout = setTimeout(() => {
          this.$router.push({ name: "product" });
        }, 31000);
      }
    },
  },
  computed: {
    resultCode() {
      return this.$route.query.resultCode;
    },
  },
  watch: {
    timerCount: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.timerCount--;
          }, 1000);
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.transactionReturn();
  },
  unmounted() {
    clearTimeout(timeout);
  },
  setup() {},
};
</script>

<style scoped>
.ty-header {
  margin: 20px;
  display: flex;
  justify-content: center;
}
.ty-header i {
  font-size: 30px;
  margin-right: 16px;
  border-radius: 50%;
  padding: 2px 4px;
}

@media screen and (max-width: 480px) {
  .ty-header h1 {
    font-size: 24px;
  }
}
</style>