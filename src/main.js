import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  created: function() {
    this.$store.dispatch("init");
  },
  mounted: () => {
    document.dispatchEvent(new Event("x-app-rendered"));
  },
  computed: {
    logged: function() {
      return this.$store.getters["auth/getLoggedInStatus"];
    }
  },
  watch: {
    logged: function(value) {
      if (!value && this.$route.name !== "login" && !this.$route.meta.public)
        this.$router.push({ name: "login" });
    }
  },
  render: h => h(App)
}).$mount("#app");
