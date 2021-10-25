<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-content">
      <p class="image is-4by3">
        <img :src="image" alt="">
      </p>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="$emit('click', null)" />
  </div>
</template>

<script>
export default {
  name: 'big-image',
  props: {
    image: {
      required: true,
      type: String,
    },
  },
  methods: {
  },
};
</script>

<style scoped>
</style>
