const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
// module.exports = {
//   devServer: {
//     port: 8080,
//     host: '0.0.0.0',
//     allowedHosts: "all",

//     proxy: {
//       '/distance': {
//         target: 'https://maps.googleapis.com/maps/api/distancematrix',
//         pathRewrite: {"^/distance": ""},
//       }
//     },
//   }
// }
module.exports = {
  devServer: {
    proxy: {
      '/distance': {
        target: 'https://maps.googleapis.com/maps/api/distancematrix',
        pathRewrite: {"^/distance": ""},
      }
    },
  }
}
