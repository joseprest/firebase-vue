<template>
  <div class="tags has-addons">
    <span
      class="tag"
      :class="mainColor"
      @click="$emit('clicked')"
    >
      {{ data.main }}
    </span>
    <div class="tag" v-if="data.isAssociative" :class="!readOnly && 'pointer'">
      <div class="dropdown is-up" :class="{ 'is-active': showChoices }" v-if="!readOnly">
        <div class="dropdown-trigger" @click="toggleChoices">
          <span v-if="selectedChoice">{{ selectedChoice }}</span>
          <span v-else>(empty)</span>
        </div>
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
          <div class="dropdown-content">
            <a
              v-for="(tagChoice, index) in data.possibleValues"
              :key="tagChoice"
              class="dropdown-item"
              @click="selectChoice(index)"
            >
              {{ tagChoice }}
            </a>
          </div>
        </div>
      </div>
      <span v-else-if="matchAll">
        *
      </span>
      <span v-else>
        {{ selectedChoice }}
      </span>
    </div>
    <a class="tag is-delete" @click="$emit('delete')" v-if="!readOnly"></a>
  </div>
</template>

<script>
export default {
  name: 'one-tag',
  props: {
    data: {
      required: true,
      type: Object,
    },
    readOnly: {
      required: false,
      type: Boolean,
      default: false,
    },
    matchAll: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showChoices: false,
    };
  },
  computed: {
    selectedChoice() {
      const { choiceIndex } = this.data;
      if (Number(choiceIndex) >= 0) {
        return this.data.possibleValues[choiceIndex] || null;
      }
      return null;
    },
    mainColor() {
      if (this.data.color) return this.data.color;
      if (this.data.possibleValues && this.data.possibleValues.length) return 'is-dark';
      return null;
    },
  },
  methods: {
    toggleChoices() {
      this.showChoices = !this.showChoices;
    },
    selectChoice(index) {
      this.showChoices = false;
      this.$emit('choice', index);
    },
  },
};
</script>

<style scoped lang="scss">
.pointer {
  cursor: pointer;
}
.pointer:hover {
  background-color: #e8e8e8;
}
</style>
