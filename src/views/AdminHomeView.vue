<template>
  <div class="container" v-if="dataReturned">
    <div class="container-content">
      <div class="order-dashboard">
        <div class="order-dashboard_item">
          <div class="order-dashboard_item_icon">
            <i class="bi bi-receipt"></i>
          </div>
          <div class="order-dashboard_item_text">
            <p>Orders Completed</p>
            <p>{{ toLocaleNumber(total.tOrder) }}</p>
          </div>
        </div>
        <div class="order-dashboard_item">
          <div class="order-dashboard_item_icon">
            <i class="bi bi-currency-dollar"></i>
          </div>
          <div class="order-dashboard_item_text">
            <p>Revenue</p>
            <p>{{ toLocaleNumber(total.tRev) }}₫</p>
          </div>
        </div>
        <div class="order-dashboard_item">
          <div class="order-dashboard_item_icon">
            <i class="bi bi-person-fill"></i>
          </div>
          <div class="order-dashboard_item_text">
            <p>User</p>
            <p>{{ toLocaleNumber(total.tUser) }}</p>
          </div>
        </div>
      </div>
      <div class="storesRev">
        <h1>Revenue of each stores on {{ thisMonth() }}</h1>
        <Bar
          class="bar-chart"
          :chart-options="{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              Revenue: {
                type: 'linear',
                display: true,
                position: 'left',
              },
              OrderCount: {
                type: 'linear',
                display: true,
                position: 'right',

                // grid line settings
                grid: {
                  drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
              },
            },
          }"
          :chart-data="{
            labels: revEachStore.map(function (item) {
              return item['storeName'];
            }),
            datasets: [
              {
                label: 'Revenue',
                backgroundColor: '#ffb100',
                data: revEachStore.map(function (item) {
                  return item['revenue'];
                }),
                yAxisID: 'Revenue',
              },
              {
                label: 'Order Count',
                backgroundColor: '#FF9F68',
                data: revEachStore.map(function (item) {
                  return item['totalOrder'];
                }),
                yAxisID: 'OrderCount',
              },
            ],
          }"
          :chart-id="'bar-chart'"
          :dataset-id-key="'label'"
          :width="400"
          :height="400"
        />
      </div>
      <div class="pies">
        <div class="pie">
          <h1>Total orders</h1>
          <Pie
            :chart-options="{
              responsive: true,
            }"
            :chart-data="{
              labels: Object.keys(orderSt).map((item) => {
                item = item.replace(/([A-Z])/g, ' $1').trim();
                return item.charAt(0).toUpperCase() + item.slice(1);
              }),
              datasets: [
                {
                  backgroundColor: ['rgba(59, 118, 225, 1)', 'red'],
                  data: Object.values(orderSt),
                },
              ],
            }"
            :chart-id="'pie-chart'"
            :width="100"
            :height="50"
          ></Pie>
        </div>
        <div class="pie">
          <h1>5 trending items on {{ thisMonth() }}</h1>
          <Pie
            :chart-options="{
              responsive: true,
            }"
            :chart-data="{
              labels: top5PurItems.map(function (item) {
                return item['name'];
              }),
              datasets: [
                {
                  backgroundColor: [
                    '#41B883',
                    '#E46651',
                    '#00D8FF',
                    '#DD1B16',
                    '#FF9F68',
                  ],
                  data: top5PurItems.map(function (item) {
                    return item['count'];
                  }),
                },
              ],
            }"
            :chart-id="'pie-chart'"
            :width="100"
            :height="50"
          ></Pie>
        </div>
      </div>
      <div class="table-container">
        <div class="container-wrap">
          <div class="table-search">
            <h3>Top Users</h3>
          </div>
          <div class="table">
            <table>
              <tr>
                <th>Phone number</th>
                <th>Full name</th>
                <th>Point</th>
                <th>Rank</th>
              </tr>
              <tr v-for="user in topUser" :key="user.phoneNumber">
                <td>{{ user.phoneNumber }}</td>
                <td>{{ user.fullname }}</td>
                <td>{{ user.point }}</td>
                <td>{{ user.ranking }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <span v-else style="display: none"></span>
</template>

<script>
import { Bar } from "vue-chartjs";
import { Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

export default {
  components: {
    Bar,
    Pie,
  },
  data() {
    return {
      dataReturned: false,

      total: {
        tOrder: undefined,
        tRev: undefined,
        tUser: undefined,
      },
      topUser: [],
      top5PurItems: [],
      revEachStore: [],
      orderSt: {
        cOrder: undefined,
        fOrder: undefined,
      },

      month: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    };
  },
  methods: {
    toLocaleNumber(value) {
      if (value) {
        const result = value
          .toString()
          .replace(/\D/g, "")
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return result;
      }
    },
    thisMonth() {
      const d = new Date();
      let name = this.month[d.getMonth()];
      return name;
    },
    async getStatistic() {
      try {
        const res = await this.$mainAxios.get(`Order/Statistic`);
        if (res.status == 200) {
          this.total = res.data.total;
          this.topUser = res.data.topUser;
          this.top5PurItems = res.data.top5PurItems;
          this.revEachStore = res.data.revEachStore;
          this.orderSt = res.data.orderSt;

          console.log(res);
          this.dataReturned = true;
        }
      } catch (error) {
        console.log(error.response);
      }
    },
  },
  watch: {},
  mounted() {
    this.getStatistic();
  },
  setup() {},
};
</script>

<style scoped>
.container {
  position: relative;
  overflow-x: auto;
  left: 244px;
  width: calc(100vw - 244px);

  /* height: calc(100vh - 72px); */
  height: 100vh;
  background-color: #e9eeee;
  padding-top: 20px;
}
.container-content {
  max-width: 1360px;
  margin: 0 auto;
  margin-bottom: 30px;
}

.order-dashboard {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  width: 94%;
  margin: 0 auto;
}
.order-dashboard_item {
  width: 30%;
  height: 100px;
  background-color: white;
  border-radius: 1rem;
  padding: 20px;
  display: flex;
  align-items: center;
}
.order-dashboard_item_icon {
  color: white;
  position: relative;
  border-radius: 20px;
  padding: 10px;
  margin-right: 12px;
  background-color: rgba(59, 118, 225, 1) !important;
  height: 52px;
  width: 52px;
}
.order-dashboard_item_icon i {
  font-size: 26px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.order-dashboard_item_text {
  display: flex;
  flex-direction: column;
  text-align: left;
  justify-content: space-around;
  height: 100%;
}
.order-dashboard_item_text p:first-child {
  color: #7f838b !important;
}
.order-dashboard_item_text p:last-child {
  font-size: 18px;
  font-weight: 800;
}

.storesRev {
  width: 94%;
  padding: 20px;
  margin: 0 auto;
  margin-top: 20px;
  background: #fff;
  border-radius: 20px;
  overflow: auto;
  max-width: 850px;
}
.storesRev > h1,
.pie > h1 {
  font-size: 18px;
  margin-bottom: 16px;
}

.pies {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 94%;
  margin: 0 auto;
  margin-top: 20px;
  max-width: 850px;
}
.pie {
  width: 48%;
  background: #fff;
  border-radius: 20px;
  padding: 20px;
  overflow: auto;
}

.table-container {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container-wrap {
  width: 98%;
  overflow: auto;
  border-radius: 10px;
  background-color: white;
  padding: 30px 6px;
}
.table {
  width: 98%;
  margin-right: auto;
  margin-left: auto;
  height: 420px;
  overflow: auto;
  margin-top: 16px;
  /* border: 1px solid black; */
  border-radius: 6px;
}
.table::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}
.table::-webkit-scrollbar {
  width: 8px;
  background-color: #f5f5f5;
}
.table::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
.table-search {
  text-align: left;
  width: 84%;
  margin: 0 auto;
}
.table-container table {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  text-align: left;
  border-spacing: 0;
  border-collapse: separate;
}
table tr th {
  position: sticky;
  top: 0;
  background: #eabf43;
}

.table-container table td:last-child > div {
  background-color: #232539;
  color: #b4b7c1;
  width: fit-content;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.table-container table td:last-child > div:hover {
  opacity: 0.5;
}

.table-container table tr:first-child {
  color: #ffffff;
  background: #eabf43;
}
.table-container table tr th:first-child,
.table-container table tr td:first-child {
  padding-left: 18px;
}
.table-container table tr td {
  border-bottom: 2px solid #f2f2f2;
}
.table-container table tr:not(:first-child) {
  border-bottom: 1px solid #f2f2f2;
  cursor: pointer;
  background-color: white;
}
.table-container table tr:not(:first-child):hover {
  background-color: #ececff;
}
.table-container table th:first-child,
.table-container table th:nth-child(2),
.table-container table td:first-child,
.table-container table td:nth-child(2) {
  padding: 18px 10px;
  min-width: 160px;
}

.table-container table th:last-child,
.table-container table th:nth-child(3),
.table-container table td:last-child,
.table-container table td:nth-child(3) {
  padding: 18px 10px;
  min-width: 100px;
}

#bar-chart {
  overflow-x: auto;
}

@media screen and (max-width: 1140px) {
  .container {
    left: 190px;
    width: calc(100vw - 190px);
  }
}
@media screen and (max-width: 992px) {
  .container {
    position: relative;
    left: 0;
    width: 100vw;
    height: calc(100vh - 53px);
    padding-top: 20px;
  }
}

/*Vertical Ipad(768 x 1024)*/
@media screen and (max-width: 768px) {
  .pies {
    flex-direction: column;
  }
  .pie {
    width: 66%;
  }
  .pie:last-child {
    margin-top: 20px;
  }
}
@media screen and (max-width: 700px) {
}
@media screen and (max-width: 640px) {
  .order-dashboard {
    flex-direction: column;
  }
  .order-dashboard_item {
    width: 100%;
  }
  .order-dashboard_item:not(:first-child) {
    margin-top: 20px;
  }
  .pie {
    width: 80%;
  }
}
@media screen and (max-width: 560px) {
}
/*Small tablet(480 x 640)*/
@media screen and (max-width: 480px) {
}
/*Iphone(480 x 640)*/
@media screen and (max-width: 320px) {
}
/*Small phone*/
@media screen and (max-width: 240px) {
}
</style>