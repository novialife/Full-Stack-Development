<template>
  <div class="row">
    <div class="col"></div>
    <label class="form-label h4"> {{ message }} </label>
    <form class="col" @submit.prevent="authenticate()">
      <div>
        <label for="username" class="form-label h4">Username</label>
        <input
          id="username"
          v-model="username"
          type="text"
          class="form-control"
          placeholder="username..."
          required
          autofocus
        />
      </div>
      <div>
        <label for="password" class="form-label h6">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="form-control"
          placeholder="password..."
          required
          autofocus
        />
      </div>
      <button type="submit" class="btn btn-dark mt-4 float-end">OK</button>
      <button
        type="submit"
        class="btn btn-dark mt-4 float-end"
        @click="redirect('/admin/register')"
      >
        Register
      </button>
    </form>
    <div class="col"></div>
  </div>
</template>

<script>
export default {
  name: "AdminView",
  components: {},
  data: () => ({
    username: "",
    password: "",
    message: "Please log in",
  }),
  methods: {
    authenticate() {
      const { commit } = this.$store;
      const { push } = this.$router;

      fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      })
        .then((res) => res.json())
        .then(({ authenticated }) => {
          commit("setAuthenticated", authenticated);
          commit("setAdmin", authenticated);
          if (authenticated) {
            push("/admin/profile");
          } else {
            this.message = "Bad credentials";
          }
        })
        .catch(console.error);
    },
    redirect(target) {
      this.$router.push(target);
    },
  },
};
</script>
