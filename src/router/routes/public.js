import Login from "@/views/auth/Login.vue";
import Home from "@/views/page/Home.vue";
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
      onlyLoggedOut: true,
      title: "Connexion",
      backgroundColor: "beige"
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
  },
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      sidebar: false,
      title: "Communities for community"
    }
  }
];

export default routes.map(route => {
  const meta = {
    ...route.meta,
    public: true
  };
  return { ...route, meta };
});
