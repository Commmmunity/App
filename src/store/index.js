import Vue from "vue";
import Vuex from "vuex";
import firebaseApp from "../modules/firebase";
import auth from "./stores/auth";

Vue.use(Vuex);

var store = new Vuex.Store({
  modules: {
    auth
  },
  state: {
    state: {
      version: ""
    }
  },
  mutations: {
    reset(state) {}
  },
  actions: {}
});

export default store;
