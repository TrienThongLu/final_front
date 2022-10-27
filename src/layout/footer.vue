<template>
  <div class="footer">
    <div class="footer-brandname">
      <div class="footer-brandname_container">
        <div style="display: flex">
          <div class="footer-list">
            <h2>About Us</h2>
            <p>Our Heritage</p>
            <p>Our Company</p>
          </div>
          <div class="footer-list">
            <h2>TERMS OF USE</h2>
            <p>Information privacy policy</p>
            <p>Ordering Policy</p>
          </div>
        </div>
        <span>Corgi Coffee</span>
      </div>
    </div>
    <div style="border-top: 1px solid; margin-top: 10px">
      <div class="footer-social">
        <div>
          <img src="../assets/Images/Icon/facebook.png" />
          <img src="../assets/Images/Icon/instagram.png" />
        </div>
        <p>© 2022 Corgi Coffee. All rights reserved</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "footer-component",
};
</script>

<style scoped>
.footer {
  background-color: rgb(240, 240, 240);
}
.footer-brandname {
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
}
.footer-brandname_container {
  display: flex;
  padding: 56px 56px 0 56px;
  justify-content: space-between;
}
.footer-brandname span {
  text-align: left;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  text-transform: uppercase;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 3px;
}
.footer-list {
  margin-right: 24px;
  margin-left: 40px;
  text-align: left;
}
.footer-list h2 {
  padding: 12px 0;
}
.footer-list p {
  margin-bottom: 16px;
}
.footer-social {
  margin: 0 auto;
  width: 100%;
  max-width: 1360px;
  text-align: left;
  padding: 10px 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.footer-social img {
  width: 40px;
  margin: 0 20px;
}
.footer-social img:first-child {
  margin-left: 40px;
}
@media screen and (max-width: 768px) {
  .footer {
    margin-top: 54px;
  }
  .footer-brandname_container {
    padding: 56px 0px 0 0px;
  }
  .footer-social {
    padding: 10px 0px;
  }
  .footer-social p {
    margin-right: 6px;
  }
}
@media screen and (max-width: 560px) {
  .footer-list {
    margin-left: 20px;
  }
  .footer-brandname_container {
    padding: 30px 0px 0 0px;
  }
  .footer-social img {
    margin: 0 16px !important;
    width: 32px;
  }
}
/*Small tablet(480 x 640)*/
@media screen and (max-width: 480px) {
  .footer-list h2 {
    font-size: 18px;
  }
  .footer-list p {
    font-size: 12px;
  }
  .footer-social {
    display: block;
  }
  .footer-social p {
    margin-left: 16px;
    margin-top: 12px;
  }
}
/*Iphone(480 x 640)*/
@media screen and (max-width: 320px) {
  .footer-brandname span {
    display: none;
  }
}
</style>