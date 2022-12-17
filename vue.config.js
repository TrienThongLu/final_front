const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
});
module.exports = {
  devServer: {
    // port: 8080,
    // host: "0.0.0.0",
    // allowedHosts: "all",
    // https: true,
    proxy: {
      "/distance": {
        target: "https://maps.googleapis.com/maps/api/distancematrix",
        pathRewrite: { "^/distance": "" },
      },
      //   "/api": {
      //     target: "https://corgicafe.servehttp.com:7096",
      //     pathRewrite: { "^/api": "" },
      //   },
    },
  },
};
