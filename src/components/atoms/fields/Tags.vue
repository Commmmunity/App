<template>
  <div class="tags">
    <div class="tags__search">
      <input
        class="search__input"
        type="text"
        placeholder="Chercher une option"
        v-model="filter"
      />
      <span
        class="search__remove"
        v-show="filter && filter !== ''"
        v-on:click="filter = null"
      >
        <Icon type="close" />
      </span>
    </div>
    <div class="tags__options">
      <div
        class="tags__option"
        :class="{ 'tags__option--selected': theValue.includes(option.value) }"
        v-for="(option, index) in getOption"
        :key="index"
      >
        <Icon
          class="option__selected-icon"
          type="check"
          v-show="theValue.includes(option.value)"
        />
        <span class="option__label" v-on:click="onChoice(option)">{{
          option.label
        }}</span>
        <span
          class="option__remove"
          v-show="theValue.includes(option.value)"
          v-on:click="onRemove(option)"
        >
          <Icon type="close" />
        </span>
      </div>
    </div>
    <p
      class="tags__indication"
      v-if="optionsQuantity && optionsQuantity !== -1"
    >
      {{ optionsQuantity }} choix maximum,
      <span v-if="theValue.length >= 0 && optionsQuantity - theValue.length > 0"
        >encore {{ optionsQuantity - theValue.length }} choix.</span
      >
      <span v-else-if="theValue.length >= 0">vous n'avez plus de choix.</span>
    </p>
  </div>
</template>

<script>
import Icon from "../icons/Icon.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "FieldTags",
  components: {
    Icon
  },
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
    options: {
      type: Array,
      required: true,
      default: function() {
        return [];
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
    },
    optionsQuantity: {
      required: false,
      default: -1
    }
  },
  data: function() {
    return {
      theValue: [],
      filter: null
    };
  },
  computed: {
    getOption: function() {
      var options = this.options.filter(option => {
        if (
          this.filter &&
          !option.label.toLowerCase().includes(this.filter.toLowerCase())
        )
          return false;

        return true;
      });

      return options;
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
    onChoice: function(option) {
      if (
        this.optionsQuantity &&
        this.optionsQuantity !== -1 &&
        this.theValue.length >= this.optionsQuantity
      )
        return;

      if (!this.theValue.includes(option.value))
        this.theValue.push(option.value);
    },
    onRemove: function(option) {
      if (this.theValue.includes(option.value))
        this.theValue.splice(this.theValue.indexOf(option.value), 1);
    }
  },
  created() {
    if (this.value) this.theValue = this.value;
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

<style lang="scss" scoped></style>
