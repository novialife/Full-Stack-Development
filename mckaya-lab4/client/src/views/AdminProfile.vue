<template>
  <div class="row">
    <div class="col"></div>
    <div class="col list-group">
      <form class="col" @submit.prevent="remove()">
        <div
          v-for="TimeSlot in TimeSlots"
          :key="TimeSlot.time"
          class="form-group form-check"
        >
          <label class="form-check-label" :for="TimeSlot">{{
            TimeSlot.time + " " + TimeSlot.assistant + " " + TimeSlot.room
          }}</label>
          <input
            :id="TimeSlot.id"
            v-model="choice"
            type="checkbox"
            :value="TimeSlot.id"
          />
        </div>
        <div class="form-group">
          <button class="submit">REMOVE</button>
        </div>
      </form>
    </div>
    <div class="col"></div>
    <div class="col">
      <div class="col-2">
        <form class="col" @submit.prevent="addTimeSlot()">
          <div>
            <label for="Time" class="form-label h4">Time</label>
            <input
              id="Time"
              v-model="Time"
              type="text"
              class="form-control"
              placeholder="Time..."
              required
              autofocus
            />
          </div>
          <div>
            <label for="Assistant" class="form-label h6">Assistant</label>
            <input
              id="Assistant"
              v-model="Assistant"
              type="text"
              class="form-control"
              placeholder="Assistant..."
              required
              autofocus
            />
          </div>
          <div>
            <label for="Room" class="form-label h6">Room</label>
            <input
              id="Room"
              v-model="Room"
              type="text"
              class="form-control"
              placeholder="Room..."
              required
              autofocus
            />
          </div>
          <button type="submit" class="btn btn-dark mt-4 float-end">OK</button>
        </form>
      </div>
      <button
        type="submit"
        class="btn btn-dark mt-4 float-end"
        @click="logout()"
      >
        LOGOUT
      </button>
      <div class="col"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminProfileView",
  components: {},
  data() {
    return {
      name: this.$route.params.name,
      TimeSlots: [],
      choice: [],
      Time: "",
      Assistant: "",
      Room: "",
    };
  },

  async created() {
    const res = await fetch("/api/admin/profile");
    const { TimeSlots } = await res.json();
    this.TimeSlots = TimeSlots;

    const { socket } = this.$root;
    socket.on("updateTimes", (newTime) => {
      console.log("This triggered when updating the times");
      this.TimeSlots = newTime;
    });
  },

  methods: {
    async remove() {
      console.log(this.choice);
      await fetch("/api/admin/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookings: this.choice,
        }),
      });
      this.choice = [];
    },

    async addTimeSlot() {
      await fetch("/api/admin/profile/addTime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Time: this.Time,
          Assistant: this.Assistant,
          Room: this.Room,
        }),
      });
      this.Time = "";
      this.Assistant = "";
      this.Room = "";
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
          commit("setAdmin", authenticated);
          push("/timeslots");
        })
        .catch(console.error);
    },
  },
};
</script>
