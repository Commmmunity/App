<template>
  <header class="header">
    <div class="header__container">
      <div class="header__links" v-if="!custom">
        <router-link
          class="menu__item menu__item--logotype"
          :to="{ name: 'home' }"
          ><Logotype class=""
        /></router-link>
        <router-link class="menu__item" :to="{ name: 'home' }"
          >À propos</router-link
        >
      </div>
      <div class="header__profile" v-if="!custom">
        <router-link class="menu__item" to="/dashboard">Dashboard</router-link>
        <router-link :to="{ name: 'dashboard' }"
          ><Button type="small">Rejoindre</Button></router-link
        >
      </div>
      <div class="header__left" v-if="custom">
        <router-link
          v-if="logotype"
          class="menu__item menu__item--logotype"
          :to="{ name: 'home' }"
          ><Logotype class=""
        /></router-link>
        <slot />
      </div>
      <div class="header__right" v-if="custom">
        <slot name="right"></slot>
      </div>
    </div>
  </header>
</template>

<script>
import Button from "../atoms/buttons/Button.vue";
import Logotype from "../atoms/brand/Logotype.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Header",
  components: {
    Logotype,
    Button
  },
  props: {
    logotype: {
      type: Boolean,
      default: true
    },
    custom: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters("auth", ["getLoggedInStatus", "getUserExtendedProfile"])
  },
  methods: {
    ...mapActions({})
  }
};
</script>

<style lang="scss" scoped>
$header-height: 95px;

.header {
  position: sticky;
  top: 0px;
  z-index: 100;
  width: 100%;
  padding: 10px;
}

.header__container {
  background-color: $color-white;
  height: $header-height;
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-row: 1;
  grid-column: content;
  align-self: center;
}

.header__links,
.header__profile,
.header__left {
  display: flex;
  align-items: center;
  height: 100%;
}

.header__profile {
  padding-right: $main-size;
}

.menu__item {
  height: 100%;
  padding-left: $main-size;
  padding-right: $main-size;
  display: flex;
  align-items: center;
  @include menu-item;
}

.menu__item--logotype {
  padding-right: 0px;
}
</style>
