import { firebaseApp, firebase } from "../../modules/firebase";

const state = {
  loggedIn: null,
  user: null,
  profile: null,
  notification: null
};

const getters = {
  getLoggedInStatus: state => state.loggedIn,
  getUser: state => {
    if (!state.loggedIn) return false;

    return {
      email: state.user.email,
      displayName: state.user.displayName,
      id: state.user.uid,
      photoURL: state.user.photoURL,
      profile: state.user.profile
    };
  },
  profile: state => {
    return state.profile;
  },
  getUserId: state => {
    return state.user.uid;
  },
  getWorkplaces: state => state.workplaces,
  getFigmaToken: state => {
    if (!state.loggedIn || !state.profile || !state.profile.figmaToken)
      return false;

    return state.profile.figmaToken;
  },
  getProfileMeta: state => {
    return meta => {
      if (!state.profile || state.profile[meta] === undefined) {
        return false;
      }

      return state.profile[meta];
    };
  }
};

const mutations = {
  SET_STATUS(state, is) {
    state.loggedIn = is;
  },
  SET_USER(state, user) {
    state.user = user;
  },
  SET_PROFILE(state, profile) {
    if (profile.notification === undefined) profile.notification = {};

    state.profile = profile;
  },
  RESET(state) {
    state.loggedIn = false;
    state.user = null;
    state.workplaces = null;
  }
};

const actions = {
  init: store => {
    return new Promise((resolve, reject) => {
      firebaseApp.auth().onAuthStateChanged(user => {
        if (user) {
          store.commit("SET_STATUS", true);
          store.commit("SET_USER", firebaseApp.auth().currentUser);
          resolve(true);
        } else {
          store.commit("SET_STATUS", false);
          store.commit("SET_USER", null);
          resolve(false);
        }
      });
    });
  },
  login: (store, providerType) => {
    let provider = null;

    if (providerType === "google")
      provider = new firebase.auth.GoogleAuthProvider();
    else if (providerType === "microsoft")
      provider = new firebase.auth.OAuthProvider("microsoft.com");

    firebaseApp
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        console.log(firebaseApp.auth().currentUser);
        return firebaseApp.auth().currentUser;
      })
      .catch(err => {
        console.log(err);
      });
  },
  getProfile: store => {
    let profileRef = firebaseApp
      .firestore()
      .collection("users/")
      .doc(store.getters.getUserId);

    return profileRef
      .get()
      .then(profileDoc => {
        store.commit("SET_PROFILE", profileDoc.data());
        return profileDoc.data();
      })
      .catch(error => {
        throw error;
      });
  },
  saveProfile: store => {
    let profileRef = firebaseApp
      .firestore()
      .collection("users/")
      .doc(store.getters.getUserId);

    return profileRef
      .update(store.getters.profile)
      .then(profileDoc => {
        return store.getters.profile;
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  },
  addMeta: (store, { meta, value }) => {
    let profileRef = firebaseApp
      .firestore()
      .collection("users/")
      .doc(store.getters.getUserId);

    var data = {};
    data[meta] = value;

    return profileRef
      .update(data)
      .then(profileDoc => {
        return store.getters.profile;
      })
      .catch(error => {
        throw error;
      });
  },
  logout: store => {
    return firebaseApp
      .auth()
      .signOut()
      .then(() => {
        store.commit("RESET");
        return true;
      })
      .catch(err => {
        return err;
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
