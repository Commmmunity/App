import Vue from "vue";
import Router from "vue-router";
import store from "@/store/index.js";
import routes from "@/router/routes/index.js";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [].concat(routes)
});

router.beforeEach((to, from, next) => {
  const authenticated = store.getters["auth/getLoggedInStatus"];

  if (authenticated === null) {
    return next();
  }

  const onlyLoggedOut = to.matched.some(record => record.meta.onlyLoggedOut);
  const isPublic = to.matched.some(record => record.meta.public);

  // SI la page est privée et que l'utilisateur n'est pas connecté, on le redirige vers la page de connexion

  if (!isPublic && !authenticated) {
    return next({
      path: "/login",
      query: { redirect: to.fullPath }
    });
  }

  // SI L'utilsateur est connecté mais essaye d'acceder à une page uniquement pour les users non connecté,
  // on redirige vers la page par défaut des connectés

  if (authenticated && onlyLoggedOut) {
    return next("/");
  }

  // SI l'utilisateur est connecté mais n'a pas fait son onboarding, on force !
  if (
    authenticated &&
    !to.meta.public &&
    to.name !== "onboarding" &&
    !store.getters["auth/getUserExtendedProfile"]
  ) {
    return next("onboarding");
  }

  if (to.meta.title !== undefined && to.meta.title !== "")
    document.title = to.meta.title + " - Communities";
  else document.title = "Communities";

  next();
});

export default router;
