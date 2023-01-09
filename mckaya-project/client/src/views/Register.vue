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
        <label for="country" class="form-label h6">Country</label>
        <input
          id="country"
          v-model="country"
          type="text"
          class="form-control"
          placeholder="country...."
          required
          autofocus
        />
      </div>
      <div>
        <label for="city" class="form-label h6">City</label>
        <input
          id="city"
          v-model="city"
          type="text"
          class="form-control"
          placeholder="city..."
          required
          autofocus
        />
      </div>
      <div>
        <label for="postalcode" class="form-label h6">Postal Code</label>
        <input
          id="postalcode"
          v-model="postalcode"
          type="text"
          class="form-control"
          placeholder="postal code..."
          required
          autofocus
        />
      </div>
      <div>
        <label for="nr" class="form-label h6">Phone Number</label>
        <input
          id="nr"
          v-model="nr"
          type="text"
          class="form-control"
          placeholder="phone number...."
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
  name: "RegisterView",
  components: {},
  data: () => ({
    username: "",
    country: "",
    city: "",
    postalcode: "",
    nr: "",
    password: "",
    confirm: "",
    message: "Enter username, password and confirm",
  }),
  methods: {
    authenticate() {
      const { push } = this.$router;

      fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: this.username,
          country: this.country,
          city: this.city,
          postalcode: this.postalcode,
          nr: this.nr,
          password: this.password,
          confirm: this.confirm,
        }),
      })
        .then((res) => res.json())
        .then(({ authenticated }) => {
          if (authenticated) {
            push("/profile");
          } else {
            this.message = "Bad confirm";
          }
        })
        .catch(console.error);
    },
  },
};
</script>
