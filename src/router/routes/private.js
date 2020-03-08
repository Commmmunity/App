import Dashboard from "@/views/app/global/Dashboard";
import OnBoarding from "@/views/app/global/OnBoarding";

const routes = [
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard
  },
  {
    path: "/onboarding",
    name: "onboarding",
    component: OnBoarding
  }
];

export default routes.map(route => {
  return { ...route, meta: { public: false } };
});
