<template>
  <input
    class="fieldinput"
    :id="id"
    :name="name"
    :type="type"
    :disabled="disable"
    :placeholder="placeholder"
    v-model="theValue"
    v-on:keydown.enter.prevent
    v-on:focus="onFocus"
    v-on:blur="onBlur"
  />
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "FieldInput",
  props: {
    id: {
      required: true,
      type: String
    },
    name: {
      required: false,
      type: String
    },
    value: {
      required: true
    },
    description: {
      type: String,
      required: false
    },
    type: {
      type: String,
      default: "text",
      validator: function(value) {
        return (
          ["text", "email", "password", "number", "url", "tel"].indexOf(
            value
          ) !== -1
        );
      }
    },
    label: {
      type: String,
      default: ""
    },
    disable: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      required: false,
      default: ""
    }
  },
  data: function() {
    return {
      theValue: null
    };
  },
  computed: {},
  methods: {
    ...mapActions({}),
    onFocus: function() {
      this.$emit("focus");
    },
    onBlur: function() {
      this.$emit("blur");
    }
  },
  created() {
    this.theValue = this.value;
  },
  watch: {
    theValue: function() {
      this.$emit("input", this.theValue);
    },
    value: function() {
      this.theValue = this.value;
    }
  }
};
</script>

<style lang="scss" scoped>
.fieldinput {
  @include field;
}
</style>
