<template>
  <div id="app" v-if="getLoggedInStatus !== null" :class="[getBackgroundColor]">
    <Header v-show="showHeader" />
    <router-view />
  </div>
  <div v-else>
    Wait...
  </div>
</template>

<script>
import Header from "./components/organisms/Header.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "App",
  components: { Header },
  computed: {
    ...mapGetters("auth", ["getLoggedInStatus", "getUserExtendedProfile"]),

    showHeader: function() {
      if (this.$route.meta.header === false) return false;

      return true;
    },

    getBackgroundColor: function() {
      if (this.$route.meta.backgroundColor)
        return "background-" + this.$route.meta.backgroundColor;
      else return "background-default";
    }
  },
  methods: {
    ...mapActions({
      StoreAuthLogin: "auth/login"
    })
  },
  watch: {
    getUserExtendedProfile: function(profile) {
      if (
        !this.$route.meta.public &&
        this.$route.name !== "onboarding" &&
        !profile
      )
        this.$router.push("onboarding");
      else if (this.$route.name === "onboarding" && profile)
        this.$router.push("dashboard");
    }
  }
};
</script>

<style lang="scss" scoped>
.background-gray-tinted {
  background-color: $color-gray-tinted;
}

.background-pink {
  background-color: $color-pink;
}

.background-beige {
  background-color: $color-beige;
}
</style>
