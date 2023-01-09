<template>
  <div class="row">
    <div class="row">
      <div v-if="Ads.length > 0">
        <div class="col text-center"></div>
        <div v-for="ad in Ads" :key="ad.id">
          <ad-comp
            :id="ad.id"
            :title="ad.title"
            :price="ad.price"
            :body="ad.body"
            :filename="ad.filename"
          >
          </ad-comp>
        </div>
        <div class="col text-center"></div>
      </div>
      <button
        type="submit"
        class="btn btn-dark mt-4 float-end"
        @click="logout()"
      >
        LOGOUT
      </button>
    </div>
  </div>
</template>

<script>
import AdComp from "./AdComp.vue";

export default {
  name: "ProfileView",
  components: { AdComp },
  data() {
    return {
      Ads: [],
    };
  },

  async created() {
    const res = await fetch("/api/userImages");
    const { Ads } = await res.json();
    this.Ads = Ads;

    const { socket } = this.$root;
    socket.on("updateUserAds", (newAds) => {
      console.log("This triggered when updating the profile Ads");
      this.Ads = newAds;
    });
  },

  methods: {
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
            push("/");
          }
        })
        .catch(console.error);
    },
  },
};
</script>
