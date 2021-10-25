<template>
  <div
    class="device element"
    :class="isLoading && 'is-loading'"
    v-if="device">
    <div v-if="!hideName">
      {{ device.name }}
    </div>
    <div class="image-container">
      <one-image
        :device-id="device.id"
        :key="timestamp"
        @click="image => $emit('click', image)"
      />
      <div class="error" v-if="errorMessage">
        {{ errorMessage }}
      </div>
      <div class="timestamp" v-if="timestamp">
        {{ timestamp }}
      </div>
      <div v-else class="no-image">
        Aucune image
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import format from 'date-fns/format';
import OneImage from './OneImage.vue';

export default {
  name: 'one-camera',
  components: { OneImage },
  props: {
    deviceId: {
      required: true,
      type: String,
    },
    hideName: {
      required: false,
      default: false,
    },
    errorMessage: {
      required: false,
      type: String,
    },
  },
  computed: {
    device() {
      return this.$store.state.devices.find((d) => d.id === this.deviceId);
    },
    timestamp() {
      if (!this.device) return null;

      const datetime = _.get(this.device, 'shadow.camera.datetime', null);

      if (datetime) {
        return format(new Date(datetime), 'MMMM co yyyy, hh:mm:ss aaa');
      }

      return 'N/A';
    },
    ongoingAction() {
      return this.$store.state.pendingActions.find((a) => a.device.id === this.deviceId && a.action === 'camera-picture');
    },
    isLoading() {
      return !!this.ongoingAction;
    },
  },
};
</script>

<style scoped>
  .device {
    width: 260px;
    margin-right: 1em;
  }

  .image-container {
    position: relative;
  }

  .image-container .timestamp {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 0.5em 0.25em;
    padding: 0 0.5em;
    background-color: rgba(0,0,0,0.5);
    color: #fff;
    font-size: 0.75em;
  }

  .image-container .error {
    position: absolute;
    top: 0;
    right: 0;
    margin: 0.5em 0.25em;
    padding: 0 0.5em;
    background-color: rgba(255,255,255,0.5);
    color: red;
    font-weight: bold;
    font-size: 0.75em;
  }

  .no-image {
    background-color: #000;
    color: #fff;
    min-height: 150px;
  }
</style>
