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
    </div>
  </div>
</template>

<script>
import AdComp from "./AdComp.vue";

export default {
  name: "AdsView",
  components: { AdComp },
  data() {
    return {
      Ads: [],
    };
  },

  async created() {
    const res = await fetch("/api/allImages");
    const { Ads } = await res.json();
    this.Ads = Ads;

    fetch("/api/connect");

    const { socket } = this.$root;
    socket.on("updateAllAds", (newAds) => {
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
