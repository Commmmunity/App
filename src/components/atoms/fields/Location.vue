<template>
  <div class="location">
    <input
      class="location__entry"
      :id="id"
      :name="name"
      type="text"
      :disabled="disable"
      :placeholder="placeholder"
      v-model="entry"
      v-on:keydown.enter.prevent
      v-on:keydown="prevent = false"
      v-on:focus="onFocus"
    />
    <div class="location__predictions">
      <div
        class="prediction"
        v-for="(prediction, index) in predictions"
        :key="index"
        v-on:click="pickPlace(prediction)"
      >
        {{ prediction.description }}
      </div>
    </div>
  </div>
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
      entry: null,
      theValue: null,
      debouncedCall: null,
      geocode: null,
      predictions: null,
      prevent: true
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
      if (!this.entry || this.entry === "" || this.prevent) {
        this.predictions = null;
        return;
      }

      this.theValue = null;

      this.StorePlaces(this.entry)
        .then(results => {
          if (results.data) this.predictions = results.data.predictions;
          else this.predictions = null;
        })
        .catch(err => {
          console.log(err);
        });
    },
    pickPlace: function(location) {
      this.prevent = true;
      this.theValue = location;
      this.entry = location.description;
      this.predictions = null;
    }
  },
  created() {
    this.entry = this.value;
    this.theValue = this.value;
    this.debouncedCall = debounce(this.getPlace, 200);
  },
  watch: {
    entry: function() {
      this.debouncedCall();
    },
    theValue: function() {
      this.$emit("input", this.theValue);
    },
    value: function() {
      this.theValue = this.value;
    }
  }
};
</script>

<style lang="scss" scoped></style>
