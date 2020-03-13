module.exports = {
  runtimeCompiler: true,
  configureWebpack: {
    plugins: []
  },
  // importing global scss variables and mixins
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/scss/styles.scss";`
      }
    }
  }
};
