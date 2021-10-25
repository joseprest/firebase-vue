<template>
  <form action="">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Contenu</p>
      </header>
      <section class="modal-card-body">

        <div class="field">
          <label class="label">Nom</label>
          <div class="control">
            <input class="input" type="text" v-model="name">
          </div>
        </div>

        <div class="field">
          <label class="label">Type</label>
          <div class="control">
            <div class="select">
              <select v-model="type">
                <option value="html">Site web HTML</option>
                <option value="video">Vidéo</option>
              </select>
            </div>
          </div>
        </div>

        <div class="field" v-if="type === 'html'">
          <label class="label">Site web</label>
          <div class="control">
            <input class="input" type="text" v-model="website">
          </div>
        </div>

        <div class="field" v-if="type === 'video'">
          <label class="label">Video</label>
          <div class="control">
            Vous pourrez bientôt uploader votre video ici!
          </div>
        </div>

      </section>

      <footer class="modal-card-foot">
        <button
          :disabled="!hasModifiedPayload"
          class="button is-primary element"
          :class="updating && 'is-loading'"
          @click.prevent="save"
        >
          Ok
        </button>
        <button class="button" type="button" @click="close">Annuler</button>
      </footer>
    </div>
  </form>
</template>

<script>
import firebase from 'firebase/app';

export default {
  name: 'content-modal',
  props: {
    contentId: {
      required: false,
      type: String,
      default: '',
    },
  },
  data() {
    return {
      modifiedPayload: {},
      updating: false,
    };
  },
  computed: {
    name: {
      get() {
        return this.payload.name;
      },
      set(v) {
        this.$set(this.modifiedPayload, 'name', v);
      },
    },
    type: {
      get() {
        return this.payload.type;
      },
      set(v) {
        this.$set(this.modifiedPayload, 'type', v);
      },
    },
    website: {
      get() {
        return this.payload.website;
      },
      set(v) {
        this.$set(this.modifiedPayload, 'website', v);
      },
    },
    currentObjectState() {
      if (this.contentId) {
        return this.$store.state.contents.find(c => c.id === this.contentId);
      }
      return {};
    },
    payload() {
      return { ...this.currentObjectState, ...this.modifiedPayload };
    },
    hasModifiedPayload() {
      return Object.entries(this.modifiedPayload).length > 0;
    },
  },
  methods: {
    async save() {
      if (!this.payload.name) return this.$buefy.dialog.alert('Le nom doit être indiqué');
      if (!this.payload.type) return this.$buefy.dialog.alert('Le type doit être indiqué');

      this.updating = true;
      const update = firebase.functions().httpsCallable('update');
      await update({
        collection: 'contents',
        payload: this.modifiedPayload,
        id: this.contentId || null, /* converts '' to null */
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
