<template>
  <form action="" @click.prevent>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Configuration Wifi</p>
      </header>
      <section class="modal-card-body element" :class="settingNetwork && 'is-loading'">
        <div class="field">
          <label class="label">Réseau connecté</label>
          <div class="control">
            <span v-if="!connectedNetwork">
              Aucun réseau Wifi connecté
            </span>
            <span v-else>
              {{ connectedNetwork.ssid }}
            </span>
            <button class="button is-small" @click="showAvailableNetworks()">modifier</button>
          </div>
        </div>
        <div
          class="field"
          v-if="showingAvailableNetworks"
        >
          <label class="label">
            Sélectionnez un réseau
            <button
              class="button is-small element"
              :class="refreshingNetworks && 'is-loading'"
              @click="refreshNetworks">
              Rafraîchir
            </button>
          </label>
          <div class="control">
            <ul>
              <li
                v-for="availableNetwork in availableNetworks"
                :key="availableNetwork.ssid"
              >
                <button class="button is-small is-fullwidth" @click="selectNetwork(availableNetwork)">
                  <span>{{ availableNetwork.ssid }}</span>
                  <span class="icon is-small" v-if="!availableNetwork.isOpen">
                    <i class="fas fa-lock"></i>
                  </span>
                </button>
              </li>
              <li>
                <button class="button is-small is-fullwidth" @click="selectOtherNetwork">
                  Autre réseau
                </button>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="close">Fermer</button>
      </footer>
    </div>
  </form>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'wifi-config',
  props: {
    deviceId: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      refreshingNetworks: false,
      showingAvailableNetworks: false,
      settingNetwork: false,
    };
  },
  computed: {
    device() {
      return this.$store.state.devices.find((d) => d.id === this.deviceId);
    },
    connectedNetwork() {
      let obj = _.get(this.device, 'shadow.wifi.activeAccessPoint', null);
      if (obj && !obj.ssid) obj = null;
      return obj;
    },
    availableNetworks() {
      return _.get(this.device, 'shadow.accessPoints', []);
    },
  },
  methods: {
    close() {
      this.$parent.close();
    },
    async refreshNetworks() {
      this.refreshingNetworks = true;
      const requestId = await this.$store.dispatch('pendingActions/fire', {
        action: 'refresh-access-points',
        params: {},
        deviceId: this.deviceId,
      });
      try {
        if (requestId) await this.$store.dispatch('pendingActions/waitForResolution', requestId);
      } catch (e) {
        this.$buefy.dialog.alert('Erreur lors du refresh des réseaux!');
      }
      this.refreshingNetworks = false;
    },
    showAvailableNetworks() {
      this.showingAvailableNetworks = true;
      this.refreshNetworks();
    },
    async selectNetwork(network) {
      if (network.isOpen) {
        return this.setNetwork(network.ssid);
      }
      return this.selectSSID(network.ssid);
    },
    async selectSSID(ssid) {
      const { result } = await this.$buefy.dialog.prompt({
        message: `Entrez le mot de passe pour le réseau ${ssid}`,
      });
      if (!result) return null;
      return this.setNetwork(ssid, result);
    },
    async setNetwork(ssid, password = false) {
      this.settingNetwork = true;
      const requestId = await this.$store.dispatch('pendingActions/fire', {
        action: 'add-wifi',
        params: { ssid, password },
        deviceId: this.deviceId,
      });
      try {
        if (requestId) await this.$store.dispatch('pendingActions/waitForResolution', requestId);
      } catch (e) {
        this.$buefy.dialog.alert('Erreur lors du changement de réseau!');
      }
      this.settingNetwork = false;
      this.showingAvailableNetworks = false;
    },
    async selectOtherNetwork() {
      const { result } = await this.$buefy.dialog.prompt({
        message: 'Entrez le nom (SSID) du réseau',
      });
      if (!result) return null;
      return this.selectSSID(result);
    },
  },
};
</script>

<style scoped lang="scss">
  li {
    margin-bottom: 0.25em;
  }
</style>
