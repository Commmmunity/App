import Vue from "vue";
import Vuex from "vuex";
import firebaseApp from "../modules/firebase";
import auth from "./stores/auth";
import tools from "./stores/tools";
import taxos from "./stores/taxos";

Vue.use(Vuex);

var store = new Vuex.Store({
  modules: {
    auth,
    tools,
    taxos
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
