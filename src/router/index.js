import Vue from "vue";
import Router from "vue-router";
import store from "@/store/index.js";
import routes from "@/router/routes/index.js";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/dashboard"
    }
  ].concat(routes)
});

router.beforeEach((to, from, next) => {
  const authenticated = store.getters["auth/getLoggedInStatus"];
  if (authenticated === null) return next();

  const onlyLoggedOut = to.matched.some(record => record.meta.onlyLoggedOut);
  const isPublic = to.matched.some(record => record.meta.public);
  if (!isPublic && !authenticated) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    return next({
      path: "/login",
      query: { redirect: to.fullPath }
    });
  }
  if (authenticated && onlyLoggedOut) {
    return next("/");
  }

  if (to.meta.title !== undefined && to.meta.title !== "")
    document.title = to.meta.title + " - Commmmunity";
  else document.title = "Commmmunity";

  next();
});

export default router;
