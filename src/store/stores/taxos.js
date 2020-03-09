import {
  firebaseApp,
  firebase,
  functions as firebaseFunctions
} from "../../modules/firebase";

const state = {
  interests: [
    {
      label: "Rencontrer des gens",
      id: "meet-people",
      value: "meet-people"
    },
    {
      label: "Apprendre",
      id: "learn",
      value: "learn"
    },
    {
      label: "Contribuer",
      id: "contribute",
      value: "contribute"
    }
  ],
  skills: [
    {
      label: "Animation de groupe",
      id: "group-animation",
      value: "group-animation"
    },
    {
      label: "Facilitation d'atelier",
      id: "facilitation",
      value: "facilitation"
    },
    {
      label: "Recrutement de bénévoles",
      id: "recruit-volunteer",
      value: "recruit-volunteer"
    },
    {
      label: "Trouver des financements",
      id: "fund-raising",
      value: "fund-raising"
    }
  ]
};

const getters = {
  getInterests: state => {
    return state.interests;
  },
  getSkills: state => {
    return state.skills;
  }
};

const mutations = {};

const actions = {};

export default {
  namespaced: true,
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
};
