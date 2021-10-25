<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Associer le contenu ({{ count }} écrans)</p>
      </header>
      <section class="modal-card-body">

        <div class="field">
          <label class="label">Contenu à associer</label>
          <div class="control">
            <div class="select">
              <select v-model="contentId">
                <option
                  v-for="content in contents"
                  :value="content.id"
                  :key="content.id"
                >
                  {{ content.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="tags" v-if="launched && allRequested">
          <one-screen
            v-for="deviceId in deviceIds"
            :key="deviceId"
            :device-id="deviceId"
          />
        </div>

      </section>
      <footer class="modal-card-foot">
        <button v-if="allCompleted" class="button is-primary" @click.prevent="close">Fermer</button>
        <button v-if="contentId && !allCompleted" :disabled="launched" class="button is-primary" type="button" @click.prevent="launch">Go</button>
        <button v-if="!allCompleted" :disabled="launched" class="button" type="button" @click.prevent="close">Annuler</button>
      </footer>
    </div>
  </form>
</template>

<script>
import firebase from 'firebase/app';
import OneScreen from './OneScreen.vue';

export default {
  name: 'content-associate',
  components: { OneScreen },
  props: {
    deviceIds: {
      required: true,
      type: Array,
    },
  },
  beforeCreate() {
    this.$store.dispatch('pendingActions/fetch');
  },
  data() {
    return {
      contentId: null,
      launched: false,
      allRequested: false,
    };
  },
  computed: {
    count() {
      return this.deviceIds.length;
    },
    contents() {
      return this.$store.state.contents;
    },
    content() {
      return this.contents.find((c) => c.id === this.contentId);
    },
    allCompleted() {
      return this.launched && this.deviceIds.every((deviceId) => {
        const ongoingAction = this.$store.state.pendingActions.find((a) => a.device.id === deviceId && a.action === 'associate-content');
        return !ongoingAction;
      });
    },
  },
  methods: {
    close() {
      this.$parent.close();
    },
    async launch() {
      this.launched = true;
      const startAction = firebase.functions().httpsCallable('startAction');
      const promises = this.deviceIds.map(async (deviceId) => {
        await startAction({
          action: 'associate-content',
          params: {
            content: this.content,
          },
          deviceId,
        });
      });
      await Promise.all(promises);
      this.allRequested = true;
    },
  },
};
</script>

<style scoped>
</style>
