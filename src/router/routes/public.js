import Login from "@/views/auth/Login.vue";
import PageNotFound from "@/views/page/NotFound.vue";
import About from "@/views/page/About.vue";
import Terms from "@/views/page/TermsAndConditions.vue";
import Privacy from "@/views/page/Privacy.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      sidebar: false,
      title: "Connexion"
    }
  },
  {
    path: "/about",
    name: "about",
    component: About,
    meta: {
      sidebar: false,
      title: "À propos de Communities"
    }
  },
  {
    path: "/terms-and-conditions",
    name: "terms-and-conditions",
    component: Terms,
    meta: {
      sidebar: false,
      title: "Conditions générales d'utilisation"
    }
  },
  {
    path: "/privacy",
    name: "privacy",
    component: Privacy,
    meta: {
      sidebar: false,
      title: "Charte de confidentialité"
    }
  },
  {
    path: "*",
    name: "pageNotFound",
    component: PageNotFound,
    meta: {
      sidebar: false,
      title: "Hum, page non trouvée"
    }
  }
];

export default routes.map(route => {
  const meta = {
    ...route.meta,
    public: true,
    onlyLoggedOut: true
  };
  return { ...route, meta };
});
