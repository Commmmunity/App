<template>
  <component
    :is="tag"
    :class="`button button--${type} button--${size}`"
    v-on:click="$emit('click')"
    :type="inputType"
    :disabled="disabled"
  >
    <slot v-if="!loading" />
    <slot v-else name="loading">Processing...</slot>
  </component>
</template>

<script>
export default {
  name: "Button",
  props: {
    tag: {
      type: String,
      default: "div",
      validator: function(value) {
        return ["div", "a", "input", "button", "span"].indexOf(value) !== -1;
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    inputType: {
      type: String,
      required: false,
      default: ""
    },
    type: {
      type: String,
      default: "default",
      validator: function(value) {
        return (
          ["default", "positive", "negative", "shy", "black"].indexOf(value) !==
          -1
        );
      }
    },
    size: {
      type: String,
      default: "default",
      validator: function(value) {
        return ["default", "small"].indexOf(value) !== -1;
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
