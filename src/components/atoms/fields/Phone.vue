<template>
  <div class="phone">
    <SelectCustom
      id="phone__country"
      :options="getCountryCode"
      v-model="ext"
      class="phone__country"
      :shortName="true"
    />
    <FieldInput
      class="phone__number"
      :id="id"
      :name="name"
      type="tel"
      :disabled="disable"
      :placeholder="placeholder"
      v-model="phoneNumber"
      v-on:keydown.enter.prevent
      v-on:focus="onFocus"
      v-on:blur="onBlur"
    />
  </div>
</template>

<script>
import SelectCustom from "./SelectCustom.vue";
import { mapGetters, mapActions } from "vuex";
import phone from "phone";
import countryCode from "@/modules/countryCode";
import FieldInput from "./Input";

export default {
  name: "FieldPhone",
  components: { SelectCustom, FieldInput },
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
      default: "text"
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
      ext: "FR",
      phoneNumber: null
    };
  },
  computed: {
    getCountryCode: function() {
      var output = [];

      countryCode.forEach(country =>
        output.push({
          name: country.name + " (" + country.dial_code + ")",
          shortName: country.dial_code,
          value: country.code
        })
      );

      return output;
    }
  },
  methods: {
    ...mapActions({}),
    onFocus: function() {
      this.$emit("focus");
    },
    onBlur: function() {
      this.$emit("blur");
    },
    emit: function(countryChange) {
      if (countryChange && (!this.phoneNumber || this.phoneNumber === ""))
        return;

      this.$emit("input", {
        country: this.ext,
        number: this.phoneNumber,
        cleaned: phone(this.phoneNumber, this.ext)
      });
    }
  },
  created() {
    if (this.value && this.value.number) this.phoneNumber = this.value.number;
    if (this.value && this.value.country) this.ext = this.value.country;
  },
  watch: {
    phoneNumber: function() {
      this.emit();
    },
    ext: function() {
      this.emit(true);
    },
    value: function() {
      this.theValue = this.value;
    }
  }
};
</script>

<style lang="scss" scoped>
.phone {
  @include flex;
}

.phone__country {
  margin-right: $margin-small;
}
</style>
