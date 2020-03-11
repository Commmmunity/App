<template>
  <div class="login">
    Acceder à Communties
    <div v-on:click="onClick">Me connecter</div>
    <div class="login__legal">
      En cliquant sur "Continuer avec Google / Microsoft / Email" ci-dessus,
      vous reconnaissez que vous avez lu et compris,
      <router-link :to="{ name: 'terms-and-conditions' }"
        >nos conditions d'utilisation</router-link
      >
      et notre
      <router-link :to="{ name: 'privacy' }"
        >politique de confidentialité</router-link
      >.
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Login",
  components: {},
  methods: {
    ...mapActions({
      StoreAuthLogin: "auth/login"
    }),
    onClick: function() {
      this.StoreAuthLogin("google").then(user => {});
    }
  }
};
</script>
