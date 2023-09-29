<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark">
    <button
      class="navbar-toggler mx-2 mb-2"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div id="navbarNav" class="collapse navbar-collapse mx-2">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="#" @click="redirect('/profile')">Profile</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" @click="redirect('/ads')">Ads</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" @click="redirect('/new')">New Listing</a>
        </li>
      </ul>
    </div>
  </nav>
  <section class="container-fluid py-4">
    <router-view />
  </section>
</template>

<script>
// @ is an alias to /src
import "bootstrap";
import io from "socket.io-client";

export default {
  name: "App",
  components: {},
  data: () => ({
    socket: io(/* socket.io options */).connect(),
  }),
  created() {
    const { commit } = this.$store;
    const { push } = this.$router;

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    events.forEach(async (event) => {
      document.addEventListener(event, await this.sendActivity);
    });

    this.startInactivityTimer();

    fetch("/api/users/me")
      .then((res) => res.json())
      .then(({ authenticated }) => {
        commit("setAuthenticated", authenticated);
        push("/");
      })
      .catch(console.error);
  },

  methods: {
    redirect(target) {
      this.$router.push(target);
    },

    async sendActivity() {
      if (this.$store.state.authenticated) {
        await fetch("/api/activity", {
          method: "PUT",
        });
      }
    },

    // Detect inactivity and logout
    async checkInactivity() {
      const res = await fetch("/api/checkActivity");
      const { activity } = await res.json();

      if (!activity) {
        this.logout();
        this.$router.push("/login");
      }
    },

    // Check inactivity every 30 sec
    inactivityTimer() {
      setInterval(async () => {
        if (window.location.pathname === "/profile") {
          console.log("Checking inactivity");
          await this.checkInactivity();
        }
      }, 1000 * 300);
    },

    startInactivityTimer() {
      setInterval(async () => {
        if (this.$store.state.authenticated === true) {
          console.log("Checking inactivity");
          await this.checkInactivity();
        }
      }, 1000 * 300);
    },

    async logout() {
      const { commit } = this.$store;
      const { push } = this.$router;

      fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: this.username }),
      })
        .then((res) => res.json())
        .then(({ authenticated }) => {
          commit("setAuthenticated", authenticated);
          if (!authenticated) {
            push("/login");
          }
        })
        .catch(console.error);
    },
  },
};
</script>

<style>
@import "bootstrap/dist/css/bootstrap.css";

html,
body {
  /* https://designs.ai/colors */
  background-color: #a7d7c5;
}
</style>
