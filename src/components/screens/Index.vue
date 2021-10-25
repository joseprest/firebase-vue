<template>
  <section>
    <div class="columns">
      <div class="column is-narrow">
        <div class="buttons">
          <button class="button" @click="openCameraGrid">
            <span class="icon">
              <i class="fas fa-th" aria-hidden="true"></i>
            </span>
            <span>
              caméras
            </span>
          </button>

          <div class="dropdown is-hoverable" v-if="selectedDevices.length">
            <div class="dropdown-trigger">
              <button class="button" aria-haspopup="true">
                <span>Actions</span>
                <span class="icon is-small">
                  <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
              </button>
            </div>
            <div class="dropdown-menu" role="menu">
              <div class="dropdown-content">
                <a class="dropdown-item"
                  @click="associateContent"
                >
                  Associer le contenu
                </a>
                <hr class="dropdown-divider">
                <a
                  class="dropdown-item"
                  @click="openAssociateTags"
                >
                  Associer des tags
                </a>
                <a
                  class="dropdown-item"
                  :class="!poolOfTags.length && 'is-disabled'"
                  @click="openDissociateTags"
                >
                  Dissocier des tags
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-narrow">
        <div class="select">
          <select
            v-model="filter.state"
            @change="getDevices()"
          >
            <option value="all">Tous</option>
            <option value="online">Écrans online seulement</option>
            <option value="offline">Écrans offline seulement</option>
          </select>
        </div>
      </div>
      <div class="column">
        <p class="control has-icons-left">
          <input
            v-model="filter.txt"
            class="input"
            type="email"
            placeholder="Rechercher..."
            @keydown.enter="getDevices()"
          >
          <span class="icon is-small is-left">
            <i class="fas fa-search"></i>
          </span>
        </p>
      </div>
    </div>

    <b-table
      :loading="tableLoading"
      :data="devices"
      detailed
      :show-detail-icon="true"
      icon-pack="fas"
      detail-transition="fade"
      backend-sorting
      :bordered="false"
      :checkable="true"
      :checked-rows="selectedDevices"
      :row-class="(row) => isOffline(row) && 'is-offline'"
      @check="rowChecked"
      @sort="sortClicked"
    >
      <b-table-column field="statuses" width="70" label="États" v-slot="props">
        <span>
          <b-icon
            pack="fas"
            icon="plug"
            size="is-small"
            :type="!isOffline(props.row) ? 'is-success' : ''"
          ></b-icon>
        </span>&nbsp;
        <span>
          <b-icon pack="fas"
            icon="desktop"
            size="is-small"
            :type="!isOffline(props.row) && televisionIsOn(props.row) ? 'is-success' : ''">
          </b-icon>
        </span>
      </b-table-column>

      <b-table-column field="temperature" label="Température" v-slot="props" sortable>
        <b-tag :type="temperatureType(props.row)">
        <span>
          <b-icon pack="fas"
                  icon="thermometer-half"
                  size="is-small">
          </b-icon>
        </span>
        {{ temperature(props.row) }} °C
        </b-tag>
      </b-table-column>

      <b-table-column field="lastSeen" label="Last Seen" v-slot="props" sortable>
        {{ timeFormatted(props.row, 'lastSeen') }}
      </b-table-column>

      <b-table-column field="name" label="Nom" v-slot="props" sortable>
        {{ props.row.name }}
      </b-table-column>

      <b-table-column field="location" label="Localisation" v-slot="props" sortable>
        {{ props.row.location }}
      </b-table-column>

      <b-table-column label="Tags" v-slot="props">
        <tag-list :tag-selection="props.row.tags || []" />
      </b-table-column>

      <b-table-column label="Actions" v-slot="props">
        <div class="buttons is-flex-wrap-nowrap">
          <!-- <button
            class="button is-small"
            :disabled="isOffline(props.row)"
            @click="openConfigWifi(props.row.id)">wifi</button> -->

          <button
            class="button is-small"
            @click="openOneCamera(props.row.id)"
          >
            <b-icon pack="fas"
              icon="camera"
              size="is-medium">
            </b-icon>
          </button>

          <button
            class="button is-small"
            @click="openConfig(props.row.id)"
          >
            <b-icon pack="fas"
              icon="edit"
              size="is-medium">
            </b-icon>
          </button>

          <!-- <remote-action-button
            classes="is-small"
            :disabled="isOffline(props.row)"
            action="camera-adjust"
            :device-id="props.row.id"
            :params="{}"
          >
            Calibrer
          </remote-action-button> -->
        </div>
      </b-table-column>

      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>
              <b-icon
                icon="emoticon-sad"
                size="is-large">
              </b-icon>
            </p>
            <p>Aucun écran selon la sélection voulue!</p>
          </div>
        </section>
      </template>

      <template #detail="props">
        <article class="media">
          <figure class="media-left">
            <one-camera
              :hide-name="true"
              :device-id="props.row.id"
              @click="img => bigImage = img"
            />
          </figure>
          <div class="media-content">
            <div class="content">
              <div class="detail-attr">
                <div class="detail-label">Signal Quality</div> <div>{{ signalQuality(props.row) }}</div>
              </div>
              <div class="detail-attr">
                <div class="detail-label">Last updated state</div> <div>{{ timeFormatted(props.row, 'state.lastUpdated') }}</div>
              </div>
              <div class="detail-attr">
                <div class="detail-label">IP address</div> <div>{{ getDeviceInfo(props.row, 'state.modem.address') }}</div>
              </div>
              <div class="detail-attr">
                <div class="detail-label">Modem serial number</div> <div>{{ getDeviceInfo(props.row, 'state.modem.serial') }}</div>
              </div>
              <div class="detail-attr">
                <div class="detail-label">Version</div> <div>{{ getDeviceInfo(props.row, 'state.version') }}</div>
              </div>
            </div>
          </div>
        </article>
      </template>
    </b-table>

    <button class="button navbar-end" @click="getDevices(true)">
      Load more...
    </button>

    <big-image
      v-if="bigImage"
      :image="bigImage"
      @click="bigImage = null"
    />
  </section>
</template>

<script>
import _ from 'lodash';
import { mapActions } from 'vuex';
import TagList from '@/components/tags/TagList.vue';
import WifiConfigModal from './wifi-config/Modal.vue';
import CameraGridModal from './camera-grid/Modal.vue';
import AssociateTagsModal from './tags/AssociateModal.vue';
import DissociateTagsModal from './tags/DissociateModal.vue';
import ContentAssociationModal from './content-association/Modal.vue';
import BasicConfigModal from './basic-config/Modal.vue';
import OneCamera from './camera-grid/OneCamera.vue';
import BigImage from './camera-grid/BigImage.vue';
// import RemoteActionButton from '../shared/RemoteActionButton.vue';

import { format } from '../../utils/helpers';

export default {
  name: 'screens-list',
  components: {
    TagList,
    OneCamera,
    BigImage,
    // RemoteActionButton,
  },
  mounted() {
    this.getDevices();
    this.$store.dispatch('contents/fetch');
    this.$store.dispatch('tags/fetch');
  },
  data() {
    return {
      selectedIds: [],
      bigImage: null,
      tableLoading: false,
      filter: {
        state: null,
        txt: null,
      },
      sort: {
        field: 'name',
        order: 'asc',
      },
    };
  },
  computed: {
    devices() {
      return this.$store.state.devices;
    },
    selectedDevices() {
      return this.devices.filter(d => this.selectedIds.includes(d.id)); // this.devices;
    },
    poolOfTags() {
      const devicesTags = this.selectedDevices.map((d) => d.tags || []);
      return _.unionBy(...devicesTags, 'id');
    },
  },
  methods: {
    ...mapActions('devices', ['fetch']),
    async getDevices(append = false) {
      this.tableLoading = true;

      try {
        await this.fetch({
          filter: this.filter,
          sort: this.sort,
          append,
        });
      } catch (err) {
        console.log(err);
      } finally {
        this.tableLoading = false;
      }
    },
    timeFormatted(data, key) {
      const d = _.get(data, key, null);

      return d ? format(d.toDate()) : '--';
    },
    signalQuality(data) {
      let signal = _.get(data, 'shadow.modem.signal.quality', _.get(data, 'state.modem.signal.quality', null));

      if (signal === null) return '--';

      signal = parseInt(signal, 10);

      if (signal <= 9) return '+';
      if (signal > 9 && signal <= 14) return '++';
      if (signal > 14 && signal <= 19) return '+++';
      if (signal > 19) return '++++';

      return signal;
    },
    sortClicked(field, order) {
      this.sort = { field, order };

      this.getDevices();
    },
    getDeviceInfo(data, key) {
      return _.get(data, key, '--');
    },
    signalStrength(data) {
      const signal = _.get(data, 'state.modem.signal.strength', null);
      if (signal === null) return '--';
      return signal;
    },
    modemSerial(data) {
      const a = _.get(data, 'state.modem.serial', null);
      if (a === null) return '--';
      return a;
    },
    rowChecked(checkedList/* , row */) {
      this.selectedIds = _.uniq(checkedList.map(x => x.id));
    },
    isOffline(data) {
      return !_.get(data, 'shadow.online');
    },
    televisionIsOn(data) {
      return _.get(data, 'shadow.television') === 'on';
    },
    temperature(data) {
      const tString = _.get(data, 'shadow.temperature');
      if (!tString) return '---';
      const t = Number.parseFloat(tString);
      if (Number.isNaN(t)) return tString;
      return t;
    },
    temperatureType(data) {
      const t = this.temperature(data);
      if (typeof t === 'string') return '';
      if (t < -10) return '';
      if (t >= -10 && t < 0) return 'is-warning';
      if (t >= 0) return 'is-danger';
      return '';
    },
    associatedContent(deviceId) {
      const device = this.$store.state.devices.find((d) => d.id === deviceId);
      const contentId = _.get(device, 'shadow.contentId', null);
      if (!contentId) return '(Aucun)';
      const content = this.$store.state.contents.find(c => c.id === contentId);
      if (!content) return '[Erreur: contenu non trouvé]';
      return content.name;
    },
    openConfigWifi(id) {
      this.$buefy.modal.open({
        parent: this,
        props: {
          deviceId: id,
        },
        component: WifiConfigModal,
        hasModalCard: true,
        trapFocus: true,
      });
    },
    openConfig(id) {
      this.$buefy.modal.open({
        parent: this,
        props: {
          deviceId: id,
        },
        component: BasicConfigModal,
        hasModalCard: true,
        trapFocus: true,
      });
    },
    openCameraGrid() {
      this.$buefy.modal.open({
        parent: this,
        props: {
          deviceIds: this.devices.map((d) => d.id),
        },
        component: CameraGridModal,
        hasModalCard: true,
      });
    },
    associateContent() {
      this.$buefy.modal.open({
        parent: this,
        props: {
          deviceIds: this.selectedDevices.map((d) => d.id),
        },
        component: ContentAssociationModal,
        hasModalCard: true,
      });
    },
    openOneCamera(deviceId) {
      this.$buefy.modal.open({
        parent: this,
        props: {
          deviceIds: [deviceId],
        },
        component: CameraGridModal,
        hasModalCard: true,
      });
    },
    openAssociateTags() {
      this.$buefy.modal.open({
        parent: this,
        props: {
          deviceIds: this.selectedDevices.map((d) => d.id),
        },
        component: AssociateTagsModal,
        hasModalCard: true,
        trapFocus: true,
      });
    },
    openDissociateTags() {
      if (!this.poolOfTags.length) return this.$buefy.dialog.alert('Ces écrans n\'ont aucun tag!');

      this.$buefy.modal.open({
        parent: this,
        props: {
          tags: this.poolOfTags,
          deviceIds: this.selectedDevices.map((d) => d.id),
        },
        component: DissociateTagsModal,
        hasModalCard: true,
        trapFocus: true,
      });

      return null;
    },
  },
};
</script>

<style scoped>
.is-disabled {
  pointer-events: none;
  opacity: .65;
}
.media-content .detail-attr {
  display: flex;
}
.media-content .detail-attr .detail-label {
  width: 200px;
  font-weight: bold;
}
</style>
