<template>
  <div>
    <tag-editor
      v-if="editedTag"
      :value="editedTag"
      @close="editedTag = null"
      @input="saveTag"
    />
    <b-taginput
      :value="expandedSelection"
      :data="proposedTags"
      :create-tag="tagCreator"
      autocomplete
      :allow-new="true"
      dropdown-position="top"
      @typing="setFilter"
      @add="addTag"
      @remove="tag => removeTag(tag.id)"
    >
      <template v-slot="props">
        {{ props.option.main }}
      </template>

      <template #selected="props">
        <one-tag
          v-for="tag in props.tags"
          :key="tag.id"
          :data="tag"
          @clicked="startEdit(tag)"
          @choice="v => setTagChoice(tag, v)"
          @delete="removeTag(tag.id)"
        />
      </template>
    </b-taginput>
  </div>
</template>

<script>
import OneTag from '@/components/tags/Tag.vue';
import TagEditor from '@/components/tags/Editor.vue';

export default {
  name: 'tag-input',
  components: { TagEditor, OneTag },
  props: {
    value: {
      required: true,
    },
  },
  data() {
    return {
      editedTag: null,
      filterText: null,
    };
  },
  beforeCreate() {
    this.$store.dispatch('tags/fetch');
  },
  computed: {
    proposedTags() {
      if (!this.filterText) return [];
      return this.allTags
        .filter((tag) => tag.main.toLowerCase().indexOf(this.filterText.toLowerCase()) >= 0)
        .filter((tag) => !this.selection.find(s => s.id === tag.id));
    },
    selection() {
      return this.value || [];
    },
    allTags() {
      return this.$store.state.tags;
    },
    expandedSelection() {
      return this.selection
        .map(({ id, choiceIndex, temp }) => {
          if (temp) return temp;
          const tag = this.allTags.find(t => t.id === id);
          if (!tag) return null;
          return { ...tag, choiceIndex };
        })
        .filter(x => !!x);
    },
  },
  methods: {
    async addTag(param) {
      if (typeof param === 'string') {
        const base = [...this.selection];
        this.updateValue([...base, { temp: { main: param } }]);
        const id = await this.$store.dispatch('tags/create', { tag: { main: param } });
        this.updateValue([...base, { id }]);
      } else {
        this.updateValue([...this.selection, { id: param.id }]);
      }
    },
    removeTag(tagId) {
      const indexInSelection = this.selection.findIndex(s => s.id === tagId);
      if (indexInSelection < 0) return;
      const newValue = [...this.selection];
      newValue.splice(indexInSelection, 1);
      this.updateValue(newValue);
    },
    tagCreator(str) {
      /* We got no choice to create a temp tag for b-taginput.
        Will be replaced when it'll be created in db.
        */
      return {
        id: (new Date()) + 0,
        $temp: true,
        main: str,
      };
    },
    startEdit(tag) {
      this.editedTag = tag;
    },
    saveTag(v) {
      const value = { ...v };
      Object.keys(value).forEach((key) => {
        if (value[key] === undefined) {
          delete value[key];
        }
      });
      const { id } = this.editedTag;
      this.$store.dispatch('tags/update', { id, value });
    },
    setTagChoice(tag, choiceIndex) {
      const indexInSelection = this.selection.findIndex(s => s.id === tag.id);
      if (indexInSelection < 0) return;
      const newValue = [...this.selection];
      newValue.splice(indexInSelection, 1, { id: tag.id, choiceIndex });
      this.updateValue(newValue);
    },
    updateValue(newValue) {
      this.$emit('input', newValue);
    },
    setFilter(text) {
      this.filterText = text;
    },
  },
};
</script>

<style scoped>
</style>
