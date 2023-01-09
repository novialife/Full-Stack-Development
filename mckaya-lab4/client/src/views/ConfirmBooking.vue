<template>
  <div class="row">
    <div class="col"></div>
    <p class="h4">DO YOU WANT TO BOOK?</p>
    <br />
    <p class="h4">{{ countDown }}</p>

    <form class="col">
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
    </form>
    <button type="submit" class="btn btn-dark mt-4 float-end" @click="book()">
      DO YOU WANT TO SUBMIT
    </button>
    <button type="submit" class="btn btn-dark mt-4 float-end" @click="cancel()">
      DO YOU WANT TO CANCEL
    </button>

    <div class="col"></div>
  </div>
</template>

<script>
export default {
  name: "ConfirmBooking",
  components: {},
  data() {
    return {
      timer: null,
      username: "",
      countDown: 10,
      id: this.$route.params.id,
    };
  },

  async created() {
    this.countDownTimer();

    await fetch(`/api/timeslots/${this.id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  },
  methods: {
    countDownTimer() {
      this.timer = setInterval(() => {
        this.countDown;
        if (this.countDown === 0) {
          console.log("countdown is 0");
          clearInterval(this.timer);
          this.cancel();
        }
      }, 1000);
    },

    async book() {
      console.log("Ok im gonna book");
      await fetch(`/api/timeslots/${this.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: this.username,
        }),
      });
      this.$router.push("/timeslots");
    },

    async cancel() {
      console.log("Ok im gonna cancel");
      clearInterval(this.timer);
      await fetch(`/api/timeslots/${this.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      this.$router.push("/timeslots");
    },
  },
};
</script>
