<template>
  <section>
    <button class="button" @click="add">
      <span>
       Ajouter un élément de contenu
      </span>
    </button>

    <b-table
      :data="contents"
      :bordered="false">
      <template slot-scope="props">
        <b-table-column field="name" label="Nom">
          {{ props.row.name }}
        </b-table-column>

        <b-table-column label="Actions">
          <div class="buttons">
            <button
              class="button is-small"
              @click="edit(props.row.id)"
            >edit</button>
          </div>
        </b-table-column>
      </template>

      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>
              <b-icon
                icon="emoticon-sad"
                size="is-large">
              </b-icon>
            </p>
            <p>Nothing here.</p>
          </div>
        </section>
      </template>
    </b-table>
  </section>
</template>

<script>
import ContentModal from './Modal.vue';

export default {
  name: 'contents-list',
  beforeCreate() {
    this.$store.dispatch('contents/fetch');
  },
  computed: {
    contents() {
      return this.$store.state.contents;
    },
  },
  methods: {
    add() {
      this.$buefy.modal.open({
        parent: this,
        component: ContentModal,
        hasModalCard: true,
      });
    },
    edit(contentId) {
      this.$buefy.modal.open({
        parent: this,
        props: { contentId },
        component: ContentModal,
        hasModalCard: true,
      });
    },
  },
};
</script>

<style scoped>

</style>
