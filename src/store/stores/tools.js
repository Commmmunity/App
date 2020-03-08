import {
  firebaseApp,
  firebase,
  functions as firebaseFunctions
} from "../../modules/firebase";

const state = {};

const getters = {};

const mutations = {};

const actions = {
  places: (store, search) => {
    var places = firebaseFunctions.httpsCallable("toolsPlaces");

    return places({
      search: search
    })
      .then(results => {
        return results;
      })
      .catch(error => {
        throw error;
      });
  }
};

export default {
  namespaced: true,
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
};
