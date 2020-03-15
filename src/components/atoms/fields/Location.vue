<template>
  <div class="fieldlocation">
    <input
      class="fieldlocation__entry"
      :id="id"
      :name="name"
      type="text"
      :disabled="disable"
      :placeholder="placeholder"
      v-model="entry"
      v-on:keydown.enter.prevent
      v-on:keydown="prevent = false"
      v-on:focus="onFocus"
      v-on:blur="onBlur"
    />
    <div class="fieldlocation__predictions" v-if="predictions">
      <div
        class="prediction__loading loading-part"
        v-if="status.autocomplete === 'PENDING'"
      ></div>
      <div v-else class="content-part">
        <div
          class="prediction content-item"
          v-for="(prediction, index) in predictions"
          :key="index"
          v-on:click="pickPlace(prediction)"
        >
          {{ prediction.description }}
        </div>
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
      prevent: true,
      status: {
        autocomplete: "KO",
        location: "KO"
      }
    };
  },
  computed: {},
  methods: {
    ...mapActions({
      StorePlaces: "tools/places",
      StorePlaceDetails: "tools/place"
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

      this.status.autocomplete = "PENDING";

      this.theValue = null;

      this.StorePlaces(this.entry)
        .then(results => {
          if (results.data) this.predictions = results.data.predictions;
          else this.predictions = null;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.status.autocomplete = "OK";
        });
    },
    pickPlace: function(location) {
      this.prevent = true;
      this.entry = location.description;
      this.predictions = null;
      this.status.location = "PENDING";

      this.StorePlaceDetails(location.place_id)
        .then(thing => {
          if (!thing.data) return false;
          this.theValue = {
            address: thing.data.formatted_address,
            latitude: thing.data.geometry.location.lat,
            longitude: thing.data.geometry.location.lng,
            _geoloc: {
              lat: thing.data.geometry.location.lat,
              lng: thing.data.geometry.location.lng
            },
            address_components: thing.data.address_components,
            place_id: thing.data.place_id
          };
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.status.location = "OK";
        });
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

<style lang="scss" scoped>
.fieldlocation__entry {
  @include field($type: "search");
}

.fieldlocation__predictions {
  @include field-autocomplete;
}

.prediction__loading {
  height: 70px;
  @include icon-loading();
  background-position: center;
  background-repeat: no-repeat;
  background-size: 50px;
}
</style>
