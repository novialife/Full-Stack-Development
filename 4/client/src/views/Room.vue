<template>
  <div class="row">
    <div class="col"></div>
    <div class="col list-group">
      <button
        v-for="TimeSlot in TimeSlots"
        :key="TimeSlot.time"
        type="button"
        class="list-group-item list-group-item-action my-2 py-2"
        :disabled="
          TimeSlot.bookedBy !== 'EMPTY' || TimeSlot.reservedByID !== null
        "
        @click="redirect(TimeSlot.id)"
      >
        {{ TimeSlot.assistant }}
        {{ TimeSlot.time }}
        {{ TimeSlot.bookedBy }}
      </button>
    </div>
    <div class="col"></div>
  </div>
</template>

<script>
export default {
  name: "RoomView",
  components: {},
  data: () => ({
    TimeSlots: [],
  }),
  async created() {
    const res = await fetch("/api/timeslots");
    const { TimeSlots } = await res.json();
    this.TimeSlots = TimeSlots;

    const { socket } = this.$root;
    socket.on("updateTimes", (newTime) => {
      console.log("This triggered when updating the times");
      this.TimeSlots = newTime;
    });
  },
  methods: {
    redirect(target) {
      this.$router.push(`/timeslots/${target}`);
    },
  },
};
</script>
