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
          <a class="nav-link" href="#" @click="redirect('/timeslots')"
            >TimeSlots</a
          >
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" @click="redirect('/admin/login')"
            >Admin</a
          >
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
    const { push } = this.$router;

    push("/timeslots");
  },
  methods: {
    redirect(target) {
      this.$router.push(target);
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
