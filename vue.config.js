const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:"./",
  terser:{
    terserOptions:{
      compress:{
        drop_console:true,
        drop_debugger:true,
        dead_code:true
      }
    }
  }
})
