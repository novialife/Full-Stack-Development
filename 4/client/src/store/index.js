import { createStore } from "vuex";

export default createStore({
  state: {
    admin: false,
    authenticated: false,
  },
  getters: {
    isAuthenticated(state) {
      return state.authenticated;
    },
    isAdmin(state) {
      return state.admin;
    },
  },
  mutations: {
    setAuthenticated(state, authenticated) {
      state.authenticated = authenticated;
    },
    setAdmin(state, admin) {
      state.admin = admin;
    },
  },
  actions: {},
  modules: {},
});
