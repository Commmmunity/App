<template>
  <div class="workarea" :class="[getSize]">
    <slot />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "WorkArea",
  computed: {
    getSize: function(params) {
      return "-" + this.size;
    }
  },
  props: {
    size: {
      required: false,
      type: String,
      validator: function(value) {
        return ["default", "small", "xsmall"].indexOf(value) !== -1;
      }
    }
  },
  methods: {
    ...mapActions({})
  }
};
</script>

<style lang="scss" scoped>
.workarea {
  @include view;

  &.-small {
    @include workarea-small;
  }

  &.-xsmall {
    @include workarea-xsmall;
  }
}
</style>
