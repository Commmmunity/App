<template>
  <div class="fieldselectcustom">
    <div class="fieldselectcustom__choices" ref="fieldselectcustom" v-on:click="wantToChoose">
      <span v-if="!theValue">Sélectionnez une option</span>
      <span v-else>{{getSelectedOptions}}</span>
    </div>
    <div class="fieldselectcustom__overlay" v-on:click="showChoices = false" v-show="showChoices"></div>
    <ContainedInWindow
      :reference="getContainerReference"
      :bus="bus"
      class="fieldselectcustom__popin"
      v-show="showChoices"
      :superposition="true"
    >
      <div class="fieldselectcustom__input">
        <header>
          <FieldInput
            class="fieldselectcustom__search"
            id="searchOption"
            name="searchOption"
            placeholder="Chercher un élément"
            v-model="search"
            ref="search"
            :bus="bus"
          />
        </header>
        <div v-if="Object.entries(this.getOptions).length > 0">
          <div
            v-for="(option, index) in this.getOptions"
            :key="index"
            v-on:click="onClick(option.value)"
            class="input__option"
            :class="[{ 'input__option--selected': value === option.value }]"
          >{{ option.name }}</div>
        </div>
        <div v-else class="input__nooptions">Pas de résultats</div>
      </div>
    </ContainedInWindow>
  </div>
</template>

<script>
import ContainedInWindow from "../../layouts/ContainedInWindow.vue";
import { mapGetters, mapActions } from "vuex";
import FieldInput from "./Input";
import Vue from "vue";

export default {
  name: "SelectCutomField",
  components: { ContainedInWindow, FieldInput },
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
    },
    placeholderSearch: {
      type: String,
      required: false,
      default: ""
    },
    shortName: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      theValue: null,
      first: true,
      anchorReference: null,
      search: null,
      bus: null,
      showChoices: false
    };
  },
  computed: {
    getContainerReference: function() {
      return this.anchorReference;
    },
    getOptions: function() {
      if (!this.search || this.search === "") return this.options;

      var options = this.options.filter(option => {
        if (
          this.search &&
          !option.name.toLowerCase().includes(this.search.toLowerCase())
        )
          return false;

        return true;
      });

      return options;
    },
    getSelectedOptions: function() {
      var option = this.options.find(item => item.value === this.theValue);

      if (!this.shortName) return option.name;
      else return option.shortName;
    }
  },
  created() {
    this.bus = new Vue();
    this.theValue = this.value;
  },
  mounted() {
    this.anchorReference = this.$refs.fieldselectcustom;
  },
  methods: {
    wantToChoose: function() {
      this.showChoices = this.showChoices ? false : true;
      this.bus.$emit("refresh");
      if (this.showChoices) this.bus.$emit("focus");
    },
    onClick: function(value) {
      if (this.theValue !== value) {
        this.theValue = value;
        this.showChoices = false;
      } else this.theValue = null;
    }
  },
  watch: {
    theValue: function(newValue, oldValue) {
      if (this.first) return (this.first = false);
      this.$emit("input", this.theValue);
    },
    value: function(newValue, oldValue) {
      this.theValue = this.value;
    },
    getOptions: function() {
      this.bus.$emit("refresh");
    }
  }
};
</script>

<style lang="scss" scoped>
.fieldselectcustom {
}

.fieldselectcustom__popin {
  background-color: $color-white;
  overflow: scroll;
  border-radius: $border-radius;
  @include elevated-xxl;
  border: $color-text $border-width-ml solid;
  width: 100%;
}

.fieldselectcustom__input {
  header {
    position: sticky;
    left: 0px;
    right: 0px;
    top: 0px;
    z-index: 1;
  }
}

.fieldselectcustom__search {
  border: none;
  border-radius: 0px;
  border-bottom: solid $border-width-ml $color-gray-tinted;
  padding-top: $padding-field-vertical / 2;
  padding-bottom: $padding-field-vertical / 2;
}

.input__option {
  @include select-option;
  @include icon-checkbox;
  background-position: right;
  padding-right: 100px;
  text-overflow: ellipsis;

  /* Required for text-overflow to do anything */
  white-space: nowrap;
  overflow: hidden;

  &--selected {
    @include icon-checkbox(active);
  }
}

.fieldselectcustom__choices {
  @include field;
  @include select;
}

.input__nooptions {
  @include select-option;
  cursor: inherit;

  &:hover {
    background-color: $color-background;
  }
}

.fieldselectcustom__overlay {
  position: fixed;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  background-color: transparent;
  z-index: 1;
}
</style>
