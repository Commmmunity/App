import { firebaseApp, firebase } from "../../modules/firebase";
import mime from "mime";

const state = {
  loggedIn: null,
  user: null,
  profile: null,
  notification: null,
  extended: null
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
  getUserProfile: state => {
    return state.profile;
  },
  getUserExtendedProfile: state => {
    return state.extended;
  },
  getUserId: state => {
    return state.user.uid;
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
    state.profile = profile;

    if (
      state.profile &&
      !state.profile.extended &&
      state.profile.extended !== undefined
    )
      state.extended = state.profile.extended;
    else state.extended = false;

    if (
      state.profile &&
      !state.profile.notification &&
      state.profile.notification !== undefined
    )
      state.notification = state.profile.notification;
  },
  RESET(state) {
    state.loggedIn = false;
    state.user = null;
    state.extended = null;
  }
};

const actions = {
  init: store => {
    firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        store.commit("SET_STATUS", true);
        store.commit("SET_USER", firebaseApp.auth().currentUser);
        store.dispatch("getProfile");
      } else {
        store.commit("SET_STATUS", false);
        store.commit("SET_USER", null);
      }
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
        if (profileDoc.exists) store.commit("SET_PROFILE", profileDoc.data());
        else store.commit("SET_PROFILE", false);
        return profileDoc.exists;
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
  saveExtendedProfile: (store, { data, toProcess }) => {
    var processPromises = [];
    var storageRef = firebaseApp.storage().ref();

    for (let [key, value] of Object.entries(toProcess)) {
      if (value === "file" && data[key]) {
        var storageRef = firebaseApp.storage().ref();
        var filename = key + "." + mime.getExtension(data[key].type);

        var imagesRef = storageRef.child(
          "users/" + store.getters.getUserId + "/profile/" + filename
        );

        processPromises.push(
          imagesRef
            .put(data[key].file)
            .then(function(snapshot) {
              return snapshot.ref.getDownloadURL();
            })
            .then(function(downloadURL) {
              data[key] = downloadURL;
              return downloadURL;
            })
            .catch(error => {
              throw error;
            })
        );
      } else if (value === "phone" && data[key]) {
        data[key] = {
          number: data[key].cleaned[0],
          countryCode: data[key].cleaned[1]
        };
      }
    }

    return Promise.all(processPromises)
      .then(function(values) {
        let profileRef = firebaseApp
          .firestore()
          .collection("users/")
          .doc(store.getters.getUserId);

        return profileRef.set(
          {
            extended: data
          },
          { merge: true }
        );
      })
      .then(profileDoc => {
        return true;
      })
      .catch(error => {
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
