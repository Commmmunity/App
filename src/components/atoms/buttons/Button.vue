<template>
  <component
    :is="tag"
    :class="[
      `button button--${type} button--variation--${variation} button--state--${state} button--width--${width} button--color--${color}`,
      { 'button--icon': icon }
    ]"
    v-on:click="$emit('click')"
    :type="inputType"
    :disabled="disabled"
  >
    <span v-show="icon" class="button__icon" :style="{ backgroundImage: 'url(' + icon + ')' }"></span>
    <div v-if="!loading" class="button__label">
      <slot />
    </div>
    <div v-else name="loading" class="button__loading">Processing...</div>
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
    width: {
      type: String,
      default: "default",
      validator: function(value) {
        return ["default", "full"].indexOf(value) !== -1;
      }
    },
    type: {
      type: String,
      default: "primary",
      validator: function(value) {
        return ["big", "primary", "medium", "small"].indexOf(value) !== -1;
      }
    },
    variation: {
      type: String,
      default: "primary",
      validator: function(value) {
        return ["primary", "secondary", "back"].indexOf(value) !== -1;
      }
    },
    state: {
      type: String,
      default: "default",
      validator: function(value) {
        return ["default", "disabled"].indexOf(value) !== -1;
      }
    },
    color: {
      type: String,
      default: "primary",
      validator: function(value) {
        return (
          ["primary", "secondary", "pink", "beige", "google"].indexOf(value) !==
          -1
        );
      }
    },
    icon: {
      required: false,
      default: null
    }
  },
  computed: {
    getIcon: function() {}
  }
};
</script>

<style lang="scss" scoped>
.button {
  position: relative;
  @include border-round;
  @include button-reset;
  @include padding-button;
  cursor: pointer;
  display: inline-block;
  background-color: $color-main;
  border-color: $color-black;
  font-weight: $font-weight-extrabold; // override text-body
  border-width: $border-width-l;
  border-style: solid;
  font-size: $font-size-x;
  line-height: 1em;
  text-decoration: none !important;
  transition: background-color 0.2s, border-color 0.2s;
  text-align: center;

  &.button--width--full {
    display: block;
  }
}

/* PRIMARY */
.button--primary {
  @include border-shadow;
}

/* MEDIUM */
.button--medium {
  font-size: $font-size-large;
  border-width: $border-width-ml;
}

/* SMALL*/

.button--small {
  color: $color-white;
  border: none;
  font-size: $font-size-medium-small;
}

.button--color--google {
  background-color: $color-google;
  color: $color-white;
}

.button__label {
  position: relative;
}

$icon-width: 75px;

.button__icon {
  @include border-round;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;

  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  background-color: $color-white;
  width: $icon-width;

  background-repeat: no-repeat;
  background-position: center;
  background-size: 40px;
}

.button--icon {
  .button__label,
  .button__loading {
    padding-left: $icon-width;
  }
}

/* VARIATION */

// --BACK
.button--variation--back {
  background-color: transparent;
  @include icon-arrow;
  background-repeat: no-repeat;
  background-position: center;

  &:after {
    display: block;
    height: 30px;
    content: "";
    width: 20px;
  }
}
</style>
