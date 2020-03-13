<template>
  <div class="numberedlist" :class="['numberedlist--' + direction]">
    <div
      class="numberedlist__item"
      v-for="(item, key, index) in items"
      :key="key"
      :class="{ 'numberedlist__item--active': item.active }"
    >
      {{ index + 1 }}. {{ item.name }}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "NumberedList",
  props: {
    items: {
      type: Object,
      required: true,
      validator: function(value) {
        if (Object.keys(value).length === 0) return false;
        else {
          if (value[Object.keys(value)[0]].name !== undefined) return true;
        }

        return false;
      }
    },
    direction: {
      type: String,
      required: false,
      default: "column",
      validator: function(value) {
        return ["column", "line"].indexOf(value) !== -1;
      }
    }
  },
  computed: {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.numberedlist__item {
  @include text-body;

  &--active {
    @include text-body-black;
  }
}
</style>
