import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import Room from "../views/Room.vue";
import ConfirmBooking from "../views/ConfirmBooking.vue";

// Importera Admin Vuen
import AdminLogin from "../views/AdminLogin.vue";
import AdminProfile from "../views/AdminProfile.vue";
import AdminRegister from "../views/AdminRegister.vue";

const routes = [
  {
    path: "/",
    redirect: "/timeslots",
  },

  {
    path: "/timeslots",
    component: Room,
  },

  {
    path: "/timeslots/:id",
    component: ConfirmBooking,
  },

  {
    path: "/admin/login",
    component: AdminLogin,
  },

  {
    path: "/admin/profile",
    component: AdminProfile,
  },

  {
    path: "/admin/register",
    component: AdminRegister,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Setup authentication guard.
router.beforeEach((to, from, next) => {
  console.log(store.state.admin, "Admin status");
  console.log(store.state.authenticated, "Auth status");
  if (!store.state.authenticated && to.path === "/admin/profile") {
    console.info("Unauthenticated user. Redirecting to login page.");
    next("/admin/login");
  } else if (
    store.state.admin &&
    store.state.authenticated &&
    (to.path === "/admin/login" || to.path === "/register")
  ) {
    console.log("Already logged in as admin. Redirecting to admin profile");
    next("/admin/profile");
  } else {
    next();
  }
});

export default router;
