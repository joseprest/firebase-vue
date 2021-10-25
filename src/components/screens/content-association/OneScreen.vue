<template>
  <span
    class="tag"
  >
    <span class="icon" v-if="isLoading">
      <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
    </span>
    <span class="icon" v-if="!isLoading">
      <i class="fas fa-check-circle" aria-hidden="true"></i>
    </span>

    {{ device.name }}
  </span>
</template>

<script>
export default {
  name: 'one-screen',
  props: {
    deviceId: {
      required: true,
      type: String,
    },
  },
  computed: {
    device() {
      return this.$store.state.devices.find((d) => d.id === this.deviceId);
    },
    ongoingAction() {
      return this.$store.state.pendingActions.find((a) => a.device.id === this.deviceId && a.action === 'associate-content');
    },
    isLoading() {
      return !!this.ongoingAction;
    },
  },
};
</script>

<style scoped>
</style>
