<template>
  <img v-if="imageUrl" :src="imageUrl" @click="$emit('click', imageUrl)"/>
</template>

<script>
import firebase from 'firebase/app';

export default {
  name: 'one-image',
  props: {
    deviceId: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      imageUrl: null,
    };
  },
  created() {
    this.getImageURL();
  },
  methods: {
    async getImageURL() {
      const storage = firebase.storage();
      const ref = storage.ref(`/camera-snapshots/${this.deviceId}.jpg`);
      try {
        this.imageUrl = await ref.getDownloadURL();
        // eslint-disable-next-line
      } catch (e) {
      }
    },
  },
};
</script>

<style scoped>
  img {
    cursor: zoom-in;
  }
</style>
