<template>
  <div id="AdComp" class="row">
    <button :key="id" class="col m-4" @click="redirect(id)">
      <div class="row">
        <img
          class="col"
          :src="`/api/uploads/${filename}`"
          contain
          with="100"
          height="100"
        />
        <div class="col text-center">
          {{ title }}
        </div>
        <div class="col">
          {{ body }}
        </div>
        <div class="col">
          {{ price }}
        </div>
      </div>
    </button>
  </div>
</template>

<script>
export default {
  name: "AdComp",
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: "",
    },
    price: {
      type: String,
      required: true,
      default: "",
    },
    body: {
      type: String,
      required: true,
      default: "",
    },
    filename: {
      type: String,
      required: true,
      default: "",
    },
  },

  methods: {
    redirect(target) {
      if (window.location.pathname === "/profile") {
        this.$router.push(`/profile/${target}`);
      } else {
        this.$router.push(`/ads/${target}`);
      }
    },
  },
};
</script>
