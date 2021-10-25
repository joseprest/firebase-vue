<template>
  <div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Caméras</p>
        <button
          class="is-pulled-right button"
          :disabled="requestingAllPictures"
          @click="pictureAll"
        >
          Tout reprendre
        </button>
      </header>
      <section class="modal-card-body">
        <div class="grid">
          <one-camera
            v-for="id in deviceIds"
            :device-id="id"
            :key="id"
            :error-message="errorForDevice(id)"
            @click="img => bigImage = img"
          />
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="close">Fermer</button>
      </footer>
    </div>
    <big-image
      v-if="bigImage"
      :image="bigImage"
      @click="bigImage = null"
    />
  </div>
</template>

<script>
import firebase from 'firebase/app';

import OneCamera from './OneCamera.vue';
import BigImage from './BigImage.vue';

export default {
  name: 'camera-grid',
  components: { BigImage, OneCamera },
  props: {
    deviceIds: {
      required: true,
      type: Array,
    },
  },
  beforeCreate() {
    this.$store.dispatch('pendingActions/fetch');
  },
  data() {
    return {
      requestingAllPictures: false,
      actionResults: [],
      bigImage: null,
    };
  },
  methods: {
    errorForDevice(id) {
      const result = this.actionResults.find(ar => ar.deviceId === id);
      if (!result || !result.result === 'error') return null;
      return result.result.error;
    },
    close() {
      this.$parent.close();
    },
    async pictureAll() {
      this.requestingAllPictures = true;
      const startAction = firebase.functions().httpsCallable('startAction');
      const promises = this.deviceIds.map(async (deviceId) => ({
        deviceId,
        result: (await startAction({
          action: 'camera-picture',
          params: {},
          deviceId,
        })).data,
      }));
      this.actionResults = await Promise.all(promises);
      this.requestingAllPictures = false;
    },
  },
};
</script>

<style scoped>
  .grid {
    display: flex;
    flex-wrap: wrap;
  }

  .modal-card {
    width: auto;
  }
</style>
