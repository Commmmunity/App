<template>
  <label class="fieldcheckbox" :class="[{ 'fieldcheckbox--checked': theValue }]"
    ><input type="checkbox" :id="id" :name="name" v-model="theValue" />
    {{ placeholder }}</label
  >
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "FieldCheckbox",
  props: {
    id: {
      required: true,
      type: String
    },
    name: {
      required: false,
      type: String
    },
    placeholder: {
      required: false,
      type: String
    },
    value: {
      required: true
    },
    label: {
      type: String,
      default: ""
    },
    disable: {
      type: Boolean,
      default: false
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
.fieldcheckbox {
  @include icon-checkbox;
  @include field-text;
  background-repeat: no-repeat;
  background-position: left center;
  background-size: contain;
  height: 61px;
  display: block;
  padding-left: 60px;
  padding-top: 15px;
  cursor: pointer;

  &--checked {
    @include icon-checkbox(active);
  }

  input {
    display: none;
  }
}
</style>
