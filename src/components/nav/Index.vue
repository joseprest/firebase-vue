<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
        <router-link :to="{ name: 'Screens' }" class="navbar-item">
          Écrans
        </router-link>

        <router-link :to="{ name: 'Users' }" class="navbar-item">
          Utilisateurs
        </router-link>

        <router-link :to="{ name: 'Contents' }" class="navbar-item">
          Contenus
        </router-link>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          {{ user.email }}
        </div>
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-light" @click="logOut">
              Déconnexion
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('auth', ['user', 'loggedIn']),
  },
  methods: {
    logOut() {
      this.$router.push({ name: 'Logout' });
    },
  },
};
</script>
