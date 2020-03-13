<template>
  <div class="avatar">
    <div
      class="avatar__image"
      :style="{ backgroundImage: 'url(' + getImageUrl + ')' }"
    ></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Avatar",
  props: {
    image: {
      required: false,
      type: String
    }
  },
  computed: {
    getImageUrl: function(params) {
      return this.image;
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.avatar {
  width: 150px;
  height: 150px;
}

.avatar__image {
  height: 100%;
  width: 100%;
  background-position: center;
  background-size: cover;
  @include border-radius;
  background-color: $color-main;
}
</style>
