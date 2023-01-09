<template>
  <form enctype="multipart/form-data" @submit.prevent="onSubmit">
    <div class="fields">
      <input ref="file" type="file" name="uploaded-file" @change="onSelect" />
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

  methods: {
    onSelect(event) {
      const index = 0;
      this.file = event.target.files[index];
    },

    async onSubmit() {
      const formData = new FormData();
      formData.append("uploaded-file", this.file);
      formData.append("title", this.title);
      formData.append("body", this.body);
      formData.append("price", this.price);

      await fetch("/api/profile/uploadImage", {
        method: "POST",
        body: formData,
        processData: false,
        contentType: false,
      });
      this.title = "";
      this.body = "";
      this.price = "";
      this.file = null;
    },
  },
};
</script>
