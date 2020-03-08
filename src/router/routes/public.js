import Login from "@/views/auth/Login.vue";
import PageNotFound from "@/views/page/NotFound.vue";

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
