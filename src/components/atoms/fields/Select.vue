<template>
  <div class="fieldselect">
    <select
      class="fieldselect__input"
      v-model="theValue"
      :id="id"
      :disabled="disable"
      :name="name"
    >
      <option v-for="(option, index) in options" :key="index" :value="index">{{
        option
      }}</option>
    </select>
  </div>
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
    options: {
      required: true
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
.fieldselect {
  position: relative;

  &:after {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 13px;
    content: "";
    display: block;
    background-image: url("~@/assets/images/ui/icons/arrow-down.svg");
    background-repeat: no-repeat;
    background-position: center;
    width: 59px;
    height: 44px;
    pointer-events: none;
  }
}

.fieldselect__input {
  @include field;
  cursor: pointer;
}
</style>
