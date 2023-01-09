<!-- Ska vara Admin Profilsida -->
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
          id="username"
          v-model="password"
          type="password"
          class="form-control"
          placeholder="password..."
          required
          autofocus
        />
      </div>
      <div>
        <label for="confirm" class="form-label h6">Confirm</label>
        <input
          id="confirm"
          v-model="confirm"
          type="password"
          class="form-control"
          placeholder="confirm..."
          required
          autofocus
        />
      </div>
      <button type="submit" class="btn btn-dark mt-4 float-end">OK</button>
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
    confirm: "",
    message: "Enter username, password and confirm",
  }),
  methods: {
    authenticate() {
      const { commit } = this.$store;
      const { push } = this.$router;

      fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
          confirm: this.confirm,
        }),
      })
        .then((res) => res.json())
        .then(({ authenticated }) => {
          commit("setAdmin", authenticated);
          if (authenticated) {
            push("/admin/profile");
          } else {
            this.message = "Bad confirm";
          }
        })
        .catch(console.error);
    },
  },
};
</script>
