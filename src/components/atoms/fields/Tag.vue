<template>
  <div class="FieldTag" v-on:click="onClick">
    <label>
      <input class="FieldTag__checkbox" type="checkbox" v-model="theValue" value="ddd" />
      {{
      label
      }}
      {{ theValue }}
    </label>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "FieldTag",
  props: {
    label: {
      type: String,
      default: ""
    },
    value: null,
    checked: {
      required: false,
      default: true
    }
  },
  data: function() {
    return {
      theValue: null
    };
  },
  created() {
    this.theValue = this.value;
  },
  computed: {
    getValueIfChecked: function() {
      return this.checked;
    }
  },
  methods: {
    onClick: function() {}
  },
  watch: {
    theValue: function() {
      this.$emit("input", this.theValue);
      if (this.theValue) this.$emit("checked");
      else this.$emit("unchecked");
    }
  }
};
</script>

<style lang="scss" scoped>
.FieldTag__checkbox {
  display: none;
}
</style>
