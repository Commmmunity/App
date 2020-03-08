import Vue from "vue";
import Vuex from "vuex";
import firebaseApp from "../modules/firebase";
import auth from "./stores/auth";
import tools from "./stores/tools";

Vue.use(Vuex);

var store = new Vuex.Store({
  modules: {
    auth,
    tools
  },
  state: {
    state: {
      version: ""
    }
  },
  mutations: {
    reset(state) {}
  },
  actions: {
    init() {
      this.dispatch("auth/init");
    }
  }
});

export default store;
