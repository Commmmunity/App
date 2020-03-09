<template>
  <FontAwesomeIcon :icon="getIcon" class="icon" :class="['-color-' + color]" />
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
  faArrowDown,
  faSort,
  faBars,
  faSearch,
  faRemoveFormat,
  faArrowUp,
  faTimes,
  faArrowRight,
  faArrowLeft,
  faLock,
  faCheck,
  faClock,
  faWallet,
  faShare
} from "@fortawesome/free-solid-svg-icons";

export default {
  name: "Icon",
  components: {
    FontAwesomeIcon
  },
  props: {
    type: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "default"
    }
  },
  computed: {
    getIcon: function() {
      switch (this.type) {
        case "arrowDown":
          return faArrowDown;
        case "arrowUp":
          return faArrowUp;
        case "arrowRight":
          return faArrowRight;
        case "arrowLeft":
          return faArrowLeft;
        case "close":
          return faTimes;
        case "search":
          return faSearch;
        case "share":
          return faShare;
        case "check":
          return faCheck;
        case "sort":
          return faSort;
        case "clock":
          return faClock;
        case "wallet":
          return faWallet;
        case "lock":
          return faLock;
        case "menu":
          return faBars;
        default:
          return faSearch;
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
