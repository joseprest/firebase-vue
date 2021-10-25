<template>
  <div class="field is-grouped is-grouped-multiline">
    <div
      class="control"
      v-for="tag in expandedSelection"
      :key="tag.id"
    >
      <one-tag
        :data="tag"
        :read-only="true"
      />
    </div>
  </div>
</template>

<script>
import OneTag from '@/components/tags/Tag.vue';

export default {
  name: 'tag-list',
  components: { OneTag },
  props: {
    tagSelection: {
      required: false,
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    allTags() {
      return this.$store.state.tags;
    },
    expandedSelection() {
      return this.tagSelection
        .map(({ id, choiceIndex }) => {
          const tag = this.allTags.find(t => t.id === id);
          if (!tag) return null;
          return { ...tag, choiceIndex };
        })
        .filter(x => !!x);
    },
  },
  methods: {
  },
};
</script>

<style scoped lang="scss">
</style>
