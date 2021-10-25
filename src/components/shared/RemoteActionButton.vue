<template>
  <button
    class="button"
    type="button"
    :class="customClasses"
    :disabled="disabled"
    @click="initiate"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'remote-action-button',
  props: {
    classes: {
      type: String,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
    action: {
      type: String,
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
    },
    params: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      requestId: null,
      requested: false,
    };
  },
  computed: {
    customClasses() {
      const classes = [];
      if (this.classes) classes.push(this.classes);
      if (this.loading) classes.push('is-loading');
      return classes;
    },
    loading() {
      return !!this.requested;
    },
  },
  methods: {
    async waitForResolution() {
      try {
        await this.$store.dispatch('pendingActions/waitForResolution', this.requestId);
        this.$buefy.toast.open('L\'action s\'est terminée avec succès.');
      } catch (e) {
        this.$buefy.dialog.alert(`Une erreur s'est produite: ${e.error}`);
      }

      this.$emit('action-terminated');
      this.requested = false;
    },

    async initiate() {
      if (this.requested) return;
      this.requested = true;

      this.requestId = await this.$store.dispatch('pendingActions/fire', {
        action: this.action,
        params: this.params,
        deviceId: this.deviceId,
      });

      if (this.requestId) await this.waitForResolution(this.requestId);
    },
  },
};
</script>

<style scoped>
</style>
