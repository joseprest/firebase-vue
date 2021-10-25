<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Dissociation de tags multi-écrans</p>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Tags à enlever</label>
          <div class="control">
            <b-table
              :data="expandedTags"
              :checked-rows="selectedTags"
              :checkable="true"
              @check="rowChecked"
            >
              <b-table-column label="Tag" v-slot="props">
                <one-tag
                  :data="props.row"
                  :read-only="true"
                  :match-all="true"
                />
              </b-table-column>
            </b-table>
          </div>
        </div>

      </section>
      <footer class="modal-card-foot">
        <button
          class="button is-primary element"
          :class="updating && 'is-loading'"
          @click.prevent="save"
          :disabled="!tags.length || updating"
        >Enregistrer</button>
        <button class="button" type="button" @click.prevent="close">Annuler</button>
      </footer>
    </div>
  </form>
</template>

<script>
import _ from 'lodash';
import OneTag from '@/components/tags/Tag.vue';

export default {
  name: 'tags-dissociate',
  components: { OneTag },
  props: {
    deviceIds: {
      required: true,
      type: Array,
    },
    tags: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      updating: false,
      selectedTagIds: [],
    };
  },
  computed: {
    expandedTags() {
      const allTags = this.$store.state.tags;
      return this.tags.map((tag) => allTags.find(t => t.id === tag.id));
    },
    selectedTags() {
      const allTags = this.$store.state.tags;
      return this.selectedTagIds.map((id) => allTags.find(t => t.id === id));
    },
  },
  methods: {
    rowChecked(checkedList) {
      this.selectedTagIds = _.uniq(checkedList.map(x => x.id));
    },
    async save() {
      this.updating = true;
      await this.$store.dispatch('devices/detachTags', { tagIds: this.selectedTagIds, deviceIds: this.deviceIds });
      this.updating = false;
      this.$parent.close();
      return null;
    },
    close() {
      this.$parent.close();
    },
  },
};
</script>

<style scoped>
</style>
