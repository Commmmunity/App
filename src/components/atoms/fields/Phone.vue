<template>
  <div class="phone">
    <select class="phone__country" v-model="ext">
      <option value="FRA">+33</option>
      <option value="USA">+1</option>
    </select>
    <input
      class="phone__number"
      :id="id"
      :name="name"
      :type="type"
      :disabled="disable"
      :placeholder="placeholder"
      v-model="phoneNumber"
      v-on:keydown.enter.prevent
      v-on:focus="onFocus"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import phone from "phone";

export default {
  name: "FieldPhone",
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
      ext: "FRA",
      phoneNumber: null
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

<style lang="scss" scoped></style>
