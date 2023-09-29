<template>
  <div class="row">
    <div class="col">
    <h4>This will be an ad</h4>
    </div>
    
  </div>
</template>

<script>
export default {
  name: "AdView",
  components: {},
  data() {
    return {
      id: this.$route.params.id,
    };
  },
  
  async created() {

    await fetch(`/api/Ads/${this.id}`);


    // const { socket } = this.$root;
    // socket.on("Blahonga", (newGames) => {
    //   console.log("This triggered when updating the times");
    //   this.Games = newGames;
    // });
  },
  methods: {
    redirect(target) {
      this.$router.push(target);
    },
  },
};
</script>
