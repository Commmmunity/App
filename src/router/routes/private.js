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
    component: OnBoarding,
    meta: {
      header: false,
      backgroundColor: "pink"
    }
  }
];

export default routes.map(route => {
  const meta = {
    ...route.meta,
    public: false
  };

  return { ...route, meta };
});
