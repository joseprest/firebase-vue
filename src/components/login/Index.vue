<template>
  <section>
    <div class="columns">
      <div class="column is-4 is-offset-4">
        <h1 class="title">Log In</h1>
        <b-field label="Email">
          <b-input type="email" v-model="email"/>
        </b-field>
        <b-field label="Password">
          <b-input type="password" v-model="password" password-reveal/>
        </b-field>
        <button class="button" @click="logIn">Log me In</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async logIn() {
      await this.$store.dispatch('auth/logIn', { email: this.email, password: this.password });
      await this.$router.push({ name: 'Screens' });
    },
  },
};
</script>
