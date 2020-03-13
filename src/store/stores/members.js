import {
  firebaseApp,
  firebase,
  functions as firebaseFunctions
} from "../../modules/firebase";
import algoliasearch from "algoliasearch/lite";
const client = algoliasearch(
  process.env.VUE_APP_ALGOLIA_APP,
  process.env.VUE_APP_ALGOLIA_ADMINKEY
);
const index = client.initIndex("users");

const state = {};

const getters = {};

const mutations = {};

const actions = {
  search: (store, searchkey) => {
    if (!searchkey) searchkey = "";
    return index.search(searchkey, {}).then(({ hits }) => {
      return hits;
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
