import { createRouter, createWebHistory } from "vue-router";
import store from "../store";

// Importera Admin Vuen
import Login from "../views/Login.vue";
import Profile from "../views/Profile.vue";
import Register from "../views/Register.vue";
import Ads from "../views/Ads.vue";
import Ad from "../views/Ad.vue";

const routes = [
  {
    path: "/",
    redirect: "/ads",
  },

  {
    path: "/ads",
    component: Ads,
  },

  {
    path: "/login",
    component: Login,
  },

  {
    path: "/profile",
    component: Profile,
  },

  {
    path: "/register",
    component: Register,
  },

  {
    path: "/ads/:id",
    component: Ad
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Setup authentication guard.
router.beforeEach((to, from, next) => {
  console.log(store.state.authenticated, "Auth status");
  if (!store.state.authenticated && to.path === "/profile") {
    console.info("Unauthenticated user. Redirecting to login page.");
    next("/login");
  } else if (
    store.state.authenticated &&
    (to.path === "/login" || to.path === "/register")
  ) {
    console.log("Already logged in. Redirecting to profile");
    next("/profile");
  } else {
    next();
  }
});

export default router;
