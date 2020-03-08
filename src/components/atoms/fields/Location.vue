<template>
  <input
    :id="id"
    :name="name"
    type="text"
    :disabled="disable"
    :placeholder="placeholder"
    v-model="theValue"
    v-on:keydown.enter.prevent
    v-on:focus="onFocus"
  />
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import debounce from "lodash.debounce";

export default {
  name: "FieldLocation",
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
      theValue: null,
      debouncedCall: null,
      geocode: null
    };
  },
  computed: {},
  methods: {
    ...mapActions({
      StorePlaces: "tools/places"
    }),
    onFocus: function() {
      this.$emit("focus");
    },
    onBlur: function() {
      this.$emit("blur");
    },
    getPlace: function() {
      if (!this.theValue || this.theValue === "") return;
      this.StorePlaces(this.theValue)
        .then(results => {
          console.log(results);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.theValue = this.value;
    this.debouncedCall = debounce(this.getPlace, 200);
  },
  watch: {
    theValue: function() {
      this.$emit("input", this.theValue);
      this.debouncedCall();
    },
    value: function() {
      this.theValue = this.value;
    }
  }
};
</script>

<style lang="scss" scoped></style>
