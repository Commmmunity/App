<template>
  <div id="app" v-if="getLoggedInStatus !== null && getUserProfile !== null">
    <div v-if="getUserProfile">
      <div id="nav">
        <router-link to="/login">Login</router-link>
        <router-link to="/dashboard">Dashboard</router-link>
      </div>
    </div>
    <router-view />
  </div>
  <div v-else>
    Wait...
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "App",
  components: {},
  computed: {
    ...mapGetters("auth", ["getLoggedInStatus", "getUserProfile"])
  },
  methods: {
    ...mapActions({
      StoreAuthLogin: "auth/login"
    })
  },
  watch: {
    getUserProfile: function(profile) {
      if (this.$route.name !== "onboarding" && !profile)
        this.$router.push("onboarding");
      else if (this.$route.name === "onboarding" && profile)
        this.$router.push("dashboard");
    }
  }
};
</script>
