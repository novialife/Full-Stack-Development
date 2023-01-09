<template>
  <div class="conteiner">
    <div class="row">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h4>{{ name }}</h4>
          </div>
          <div class="card-body">
            <img :src="`/api/uploads/${filename}`" width="500" height="500" />
            <p class="m-2">Price: {{ price }}kr</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h4>Contact the seller</h4>
          </div>
          <div class="card-body">
            <p>{{ user }}</p>
            <!--
                        <p>{{ phone }}</p>
                        <p>{{ email }}</p>
                        -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdView",
  data() {
    return {
      name: "",
      price: "",
      filename: "",
      user: "",
    };
  },
  async mounted() {
    console.log(this.$route.params.id);
    const res = await fetch(`/api/${this.$route.params.id}`);
    const { ad } = await res.json();

    this.name = ad.title;
    this.price = ad.price;
    this.filename = ad.filename;
    this.user = ad.username;
  },
};
</script>
