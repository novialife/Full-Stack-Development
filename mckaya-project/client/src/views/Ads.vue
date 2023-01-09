<template>
  <div class="row">
    <div class="col"></div>
    <div class="col list-group">
      <button
        v-for="Ad in Ads"
        :key="Ad.id"
        type="button"
        class="list-group-item list-group-item-action my-2 py-2"
        :disabled="Ad.players.length >= 4"
        @click="redirect(Ad.id)"
      >
        {{ Ad.host }}
        {{ Ad.players }}
      </button>
    </div>
    <div class="col"></div>
  </div>
</template>

<script>
export default {
  name: "AdsView",
  components: {},
  data: () => ({
    Ads: [],
  }),
  async created() {
    const res = await fetch("/api/ads");
    const { Ads } = await res.json();
    this.Ads = Ads;

    const { socket } = this.$root;
    socket.on("updateAds", (newAds) => {
      console.log("This triggered when updating the Ads");
      this.Ads = newAds;
    });
  },
  methods: {
    redirect(target) {
      this.$router.push(`/Ads/${target}`);
    },
  },
};
</script>
