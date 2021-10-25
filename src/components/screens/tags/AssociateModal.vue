<template>
  <form action="" @click.prevent>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Association de tags multi-écrans</p>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Tags à ajouter</label>
          <div class="control">
            <tag-input
              v-model="tags"
            />
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
import TagInput from '@/components/tags/TagInput.vue';

export default {
  name: 'tags-associate',
  components: { TagInput },
  props: {
    deviceIds: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      updating: false,
      tags: [],
    };
  },
  methods: {
    async save() {
      this.updating = true;
      await this.$store.dispatch('devices/attachTags', { tags: this.tags, deviceIds: this.deviceIds });
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
