<template>
  <div class="home-slider_container">
    <div class="slider">
      <div class="slides">
        <input type="radio" name="radio-btn" id="corgi-picture1" />
        <input type="radio" name="radio-btn" id="corgi-picture2" />
        <input type="radio" name="radio-btn" id="corgi-picture3" />
        <div class="slide first">
          <img src="../assets/Images/Carousel/Corgi3.png" alt="" />
        </div>
        <div class="slide">
          <img src="../assets/Images/Carousel/Corgi1.png" alt="" />
        </div>
        <div class="slide">
          <img src="../assets/Images/Carousel/Corgi2.png" alt="" />
        </div>
      </div>
    </div>
  </div>
  <div class="home-body">
    <div class="home-body_first">
      <div class="home-body_second_element">
        <img src="../assets/Images/Carousel/CorgiPic1.png" />
      </div>
      <div class="home-body_first_element">
        <p>LET'S TRY OUR ADORABLE CORGI!!</p>
        <span @click="changeRoute('product')">TRY IT NOW</span>
      </div>
    </div>
    <div class="home-body_first" v-if="screenWidth > 768">
      <div class="home-body_first_element">
        <p>COME AND HAVE FUN WITH OUR LOVELY CORGIS!!</p>
        <span @click="changeRoute('stores')">LOCATION OF STORES</span>
      </div>
      <div class="home-body_second_element_location">
        <img src="../assets/Images/Carousel/corgiPic2.png" />
      </div>
    </div>
    <div class="home-body_first" v-else>
      <div class="home-body_second_element_location">
        <img src="../assets/Images/Carousel/corgiPic2.png" />
      </div>
      <div class="home-body_first_element">
        <p>COME AND HAVE FUN WITH OUR LOVELY CORGIS!!</p>
        <span>LOCATION OF STORES</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  components: {},
  data() {
    return {
      screenWidth: 0,
      interVal: undefined,
    };
  },
  mounted() {
    this.pcResized();
    var counter = 1;
    this.interVal = setInterval(function () {
      document.getElementById("corgi-picture" + counter).checked = true;
      counter++;
      if (counter > 3) {
        counter = 1;
      }
    }, 5000);
  },
  methods: {
    pcResized() {
      this.screenWidth = window.innerWidth;
    },
    changeRoute(value) {
      this.$router.push({ name: value });
    },
  },
  computed: {
    pcScreen() {
      if (window.innerWidth > 992) {
        return true;
      }
      return false;
    },
  },
  created() {
    window.addEventListener("resize", this.pcResized);
  },
  unmounted() {
    window.removeEventListener("resize", this.pcResized);
    clearInterval(this.interVal);
  },
};
</script>

<style scoped>
.home-slider_container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 560px;
  --sliderWidth: 800px;
  --sliderHeight: 500px;
  position: relative;
}
.home-slider_container::after {
  content: "";
  opacity: 0.5;
  display: block;
  position: absolute;
  background-image: url("../assets/Images/Carousel/corgi-background.png");
  background-color: #ff7f7e;
  z-index: -1;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}
.slider {
  width: var(--sliderWidth);
  height: var(--sliderHeight);
  border-radius: 16px;
  border: 2px solid black;
  overflow: hidden;
}

.slides {
  width: 500%;
  height: var(--sliderHeight);
  display: flex;
}

.slides input {
  display: none;
}

.slide {
  width: 20%;
  transition: 2s;
}

.slide img {
  width: var(--sliderWidth);
  height: var(--sliderHeight);
  /* image-rendering: pixelated; */
}

.navigation-manual {
  position: absolute;
  width: var(--sliderWidth);
  margin-top: -40px;
  display: flex;
  justify-content: center;
}

#corgi-picture1:checked ~ .first {
  margin-left: 0;
}

#corgi-picture2:checked ~ .first {
  margin-left: -20%;
}

#corgi-picture3:checked ~ .first {
  margin-left: -40%;
}

.home-body {
  min-height: calc((100vh - 72px) - 350px);
}
.home-body_first {
  height: 560px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 50px;
  max-width: 1360px;
  margin: 0 auto;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  font-weight: 600;
}

.home-body_first_element,
.home-body_second_element {
  width: 50%;
}
.home-body_first_element p {
  margin-bottom: 12px;
}
.home-body_first_element span {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  border-bottom: 1px dotted;
  font-weight: 700;
  cursor: pointer;
}
.home-body_first_element span::after {
  content: " »";
  font-size: 22px;
}

.home-body_second_element {
  transform: rotate(4deg);
  background-color: black;
}
.home-body_second_element img {
  width: 488px;
  height: auto;
}
.home-body_second_element_location {
  transform: rotate(-4deg);
  background-color: black;
  width: 50%;
}
.home-body_second_element_location img {
  width: 488px;
  height: auto;
}
.home-body_first:last-child {
  padding-top: 0;
  padding-bottom: 0;
}

/*Horizontal Ipad(1024 x 768)*/
@media screen and (max-width: 1024px) {
  .home-body img {
    width: 400px;
  }
}

@media (max-width: 900px) {
  .home-slider_container {
    --sliderWidth: 600px;
    --sliderHeight: 400px;
    height: 460px;
  }
  .slider {
    width: var(--sliderWidth);
  }
  .slide img {
    width: var(--sliderWidth);
  }
  .home-body img {
    width: 300px;
    background-color: transparent;
  }
  .home-body_second_element {
    background-color: transparent;
  }
  .home-body_second_element_location {
    background-color: transparent;
  }
}

/*Vertical Ipad(768 x 1024)*/
@media screen and (max-width: 768px) {
  .home-body_first_element,
  .home-body_second_element,
  .home-body_second_element_location {
    width: 96%;
  }
  .home-body_second_element {
    transform: rotate(2deg);
  }
  .home-body_second_element_location {
    transform: rotate(-2deg);
  }
  .home-body img {
    width: 400px;
  }
  .home-body_first {
    flex-direction: column;
    justify-content: space-evenly;
  }
  .home-body_first:first-child {
    padding-bottom: 0;
    padding: 0;
  }
  .home-body_first:last-child {
    padding-top: 0;
    padding-bottom: 0;
  }
  .home-body_first {
    height: 460px;
  }
}
@media screen and (max-width: 700px) {
  .home-slider_container {
    --sliderWidth: 500px;
    --sliderHeight: 300px;
    height: 360px;
  }
  .slider {
    width: var(--sliderWidth);
  }
  .slide img {
    width: var(--sliderWidth);
  }
  .home-body img {
    width: 400px;
  }
}
@media screen and (max-width: 560px) {
  .home-slider_container {
    --sliderWidth: 430px;
    --sliderHeight: 270px;
    height: 360px;
  }
  .slider {
    width: var(--sliderWidth);
  }
  .slide img {
    width: var(--sliderWidth);
  }
  .home-body img {
    width: 350px;
  }
}
/*Small tablet(480 x 640)*/
@media screen and (max-width: 480px) {
  .home-slider_container {
    --sliderWidth: 340px;
    --sliderHeight: 190px;
    height: 240px;
  }
  .slider {
    width: var(--sliderWidth);
  }
  .slide img {
    width: var(--sliderWidth);
  }
  .home-body_first {
    padding-right: 0;
    padding-left: 0;
  }
  .home-body img {
    width: 350px;
  }
}
/*Iphone(480 x 640)*/
@media screen and (max-width: 320px) {
  .home-slider_container {
    --sliderWidth: 250px;
    --sliderHeight: 130px;
    height: 160px;
  }
  .slider {
    width: var(--sliderWidth);
  }
  .slide img {
    width: var(--sliderWidth);
  }
}
/*Small phone*/
@media screen and (max-width: 240px) {
}
</style>
