<template>
  <div>
    <b-radio
      v-for="color in allColors"
      :key="color"
      :value="value"
      @input="v => $emit('input', v)"
      name="a-color"
      :native-value="color">
      <span class="tag" :class="color">
        &nbsp;
      </span>
    </b-radio>
  </div>
</template>

<script>
export default {
  name: 'tag-color-picker',
  props: {
    value: {
      required: false,
      type: String,
      default: 'is-light',
    },
  },
  data() {
    return {
      modifiedValue: {},
    };
  },
  computed: {
    allColors() {
      return [
        'is-black',
        'is-dark',
        'is-light',
        'is-white',
        'is-primary',
        'is-info',
        'is-success',
        'is-warning',
        'is-danger',
      ];
    },
  },
  methods: {
  },
};
</script>

<style scoped>
span {
  margin-right: 3em;
}
</style>
