<template>
  <div class="row">
    <h4>Your balance is {{ this.Balance }}</h4>
    <br>
    <h4>Match History</h4>

    <form @submit.prevent="onSubmit" enctype="multipart/form-data">
      <div class="fields">
        <input type="file" ref="file" name="uploaded-file" @change="onSelect">
      </div>
      <div>
        <label for="title" class="form-label h6">Title</label>
        <input
          id="title"
          v-model="title"
          type="text"
          class="form-control"
          placeholder="title..."
          required
          autofocus
        />
      </div>
      <div>
        <label for="body" class="form-label h6">Ad info</label>
        <input
          id="body"
          v-model="body"
          type="text"
          class="form-control"
          placeholder="ad info..."
          required
          autofocus
        />
      </div>
      <div>
        <label for="price" class="form-label h6">Price</label>
        <input
          id="price"
          v-model="price"
          type="text"
          class="form-control"
          placeholder="price...."
          required
          autofocus
        />
      </div>
      <div class="fields">
        <button type="submit" class="btn btn-dark mt-4 float-end">Upload!</button>
      </div>
    </form>
    <button type="submit" class="btn btn-dark mt-4 float-end" @click="logout()"> LOGOUT </button>
  </div>
</template>

<script>
export default {
  name: "ProfileView",
  components: {},
  data() {
    return {
      Ads: [],
      file: null,
      title: "",
      body: "",
      price: "",
    };
  },

  async created() {
    const res = await fetch('/api/profile', 
    {
      method: 'GET',
    })

    const hej = await res.json();
    console.log(hej);

    const { socket } = this.$root;
    socket.on("updateProfileAd", (newAds) => {
      console.log("This triggered when updating the profile Ads");
      this.Ads = newAds;
    });
  },

  methods: {

    onSelect (event) {
      this.file = event.target.files[0]
    },

    async onSubmit(){
      console.log(this.file);
      const formData = new FormData();
      formData.append('uploaded-file', this.file);
      formData.append('title', this.title)
      formData.append('body', this.body)
      formData.append('price', this.price)

      await fetch("/api/profile/uploadImage", {
        method: "POST", 
        body: formData,
        processData: false,
        contentType: false,
      }); 
      this.title = "",
      this.body = "",
      this.price = ""
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
          push("/lobby");
        })
        .catch(console.error);
    },
  },
};
</script>
