<template>
  <div class="home">
    <div v-on:click="onClick">Login</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "home",
  components: {},
  methods: {
    ...mapActions({
      StoreAuthLogin: "auth/login"
    }),
    onClick: function() {
      console.log("eee");
      this.StoreAuthLogin("google").then(user => {
        console.log("HELLO");
      });
    }
  }
};
</script>
