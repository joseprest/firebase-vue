<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Edition du tag</p>
        <button class="delete" aria-label="close" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Texte</label>
          <div class="control">
            <input
              class="input"
              type="text"
              :value="valueOf('main')"
              @input="evt => update('main', evt.target.value)"
            >
          </div>
        </div>
        <div class="field">
          <b-switch :value="valueOf('isAssociative')" @input="v => update('isAssociative', v)">
            Permettre l'association
          </b-switch>
        </div>
        <div class="field" v-if="valueOf('isAssociative')">
          <label class="label">Valeurs possibles</label>
          <div class="control">
            <b-taginput
              :value="valueOf('possibleValues')"
              @input="v => update('possibleValues', v)"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Couleur</label>
          <div class="control">
            <tag-color-picker :value="colorValueOrDefault" @input="v => update('color', v)" />
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" @click="save">Sauvegarder</button>
        <button class="button" @click="close">Annuler</button>
      </footer>
    </div>
  </div>
</template>

<script>
import TagColorPicker from '@/components/tags/ColorPicker.vue';

export default {
  name: 'tag-editor',
  components: { TagColorPicker },
  props: {
    value: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      modifiedValue: {},
    };
  },
  computed: {
    mergedPayload() {
      return { ...this.value, ...this.modifiedValue };
    },
    colorValueOrDefault() {
      const color = this.valueOf('color');
      if (color) return color;
      return (this.valueOf('isAssociative') && 'is-dark') || 'is-light';
    },
  },
  methods: {
    update(what, value) {
      this.$set(this.modifiedValue, what, value);
    },
    close() {
      this.$emit('close');
    },
    save() {
      this.$emit('input', this.mergedPayload);
      this.$emit('close');
    },
    valueOf(what) {
      return this.mergedPayload[what];
    },
  },
};
</script>

<style scoped>
</style>
