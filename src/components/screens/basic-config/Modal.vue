<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Informations sur l'écran</p>
      </header>
      <section class="modal-card-body">

        <div class="field">
          <label class="label">Nom</label>
          <div class="control">
            <input class="input" type="text" v-model="name">
          </div>
        </div>

        <div class="field">
          <label class="label">Localisation</label>
          <div class="control">
            <input class="input" type="text" v-model="location">
          </div>
        </div>

        <div class="field">
          <label class="label">Tags</label>
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
          :disabled="!hasModifiedPayload || updating"
        >Enregistrer</button>
        <button class="button" type="button" @click.prevent="close">Annuler</button>
      </footer>
    </div>
  </form>
</template>

<script>
import firebase from 'firebase/app';
import TagInput from '@/components/tags/TagInput.vue';

export default {
  name: 'general-config',
  components: { TagInput },
  props: {
    deviceId: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      modifiedPayload: {},
      updating: false,
    };
  },
  computed: {
    currentObjectState() {
      if (this.deviceId) {
        return this.$store.state.devices.find(d => d.id === this.deviceId);
      }
      return {};
    },
    payload() {
      return { ...this.currentObjectState, ...this.modifiedPayload };
    },
    hasModifiedPayload() {
      return Object.entries(this.modifiedPayload).length > 0;
    },
    name: {
      get() {
        return this.payload.name;
      },
      set(v) {
        this.$set(this.modifiedPayload, 'name', v);
      },
    },
    location: {
      get() {
        return this.payload.location;
      },
      set(v) {
        this.$set(this.modifiedPayload, 'location', v);
      },
    },
    tags: {
      get() {
        return this.payload.tags;
      },
      set(v) {
        this.$set(this.modifiedPayload, 'tags', v);
      },
    },
  },
  methods: {
    async save() {
      if (!this.payload.name) return this.$buefy.dialog.alert('Le nom doit être indiqué');

      this.updating = true;
      const update = firebase.functions().httpsCallable('update');
      await update({
        collection: 'devices',
        payload: this.modifiedPayload,
        id: this.deviceId,
      });
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
