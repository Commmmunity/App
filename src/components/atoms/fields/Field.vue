<template>
  <div
    class="field"
    :class="[
      { 'field--label': label !== '' },
      { 'field--error': errors !== undefined && errors.$invalid && touch },
      { 'field--focus': focus }
    ]"
  >
    <label class="field__label" v-if="label !== ''" :for="id"
      >{{ label }}<span v-if="required">*</span></label
    >
    <div class="field__container">
      <component
        v-bind:is="component"
        class="field__component"
        :id="id"
        :name="name"
        :type="type"
        :disabled="disable"
        :placeholder="placeholder"
        :options="options"
        :optionsSearch="optionsSearch"
        :optionsSearchMapping="optionsSearchMapping"
        :optionsQuantity="optionsQuantity"
        :optionsQuantityMin="optionsQuantityMin"
        :optionsQuantityMax="optionsQuantityMax"
        v-model="theValue"
        @focus="onFocus"
        @blur="onBlur"
      />
    </div>

    <div
      v-if="errors !== undefined && errors.$invalid && touch && !focus"
      class="field__errors"
    >
      <div class="errors__container">
        <div
          class="error"
          v-for="(fieldValue, fieldKey) in errors.$params"
          :key="fieldKey"
        >
          <div v-if="typeof errors[fieldKey] !== 'object'">
            <Error
              :type="fieldKey"
              v-if="!errors[fieldKey]"
              :optionsQuantityMin="optionsQuantityMin"
              :optionsQuantityMax="optionsQuantityMax"
            />
          </div>
          <div
            v-else
            class="error__type"
            v-for="(error, errorType) in errors[fieldKey].$params"
            :key="errorType"
          >
            <Error :type="errorType" v-if="!errors[fieldKey][errorType]" />
          </div>
        </div>
      </div>
    </div>
    <div class="field__description" v-if="description">{{ description }}</div>
  </div>
</template>

<script>
import Error from "./Error.vue";
export default {
  name: "Field",
  components: {
    Error
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
    type: {
      type: String,
      default: "text",
      validator: function(value) {
        return (
          [
            "text",
            "url",
            "email",
            "password",
            "number",
            "phone",
            "file",
            "location",
            "select",
            "editor",
            "textarea",
            "tags",
            "checkbox"
          ].indexOf(value) !== -1
        );
      }
    },
    required: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ""
    },
    disable: {
      type: Boolean,
      default: false
    },
    options: {
      default: function() {
        return [];
      }
    },
    optionsSearch: {
      type: Function,
      default: null
    },
    optionsSearchMapping: {
      type: Object,
      default: null
    },
    optionsQuantity: {
      type: Number,
      default: -1
    },
    optionsQuantityMin: {
      type: Number,
      default: -1
    },
    optionsQuantityMax: {
      type: Number,
      default: -1
    },
    placeholder: {
      type: String,
      required: false,
      default: ""
    },
    errors: {
      type: Object,
      required: false
    },
    instantTouch: {
      // Permet de forcer l'affichage des erreurs à la première modification
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      theValue: null,
      component: null,
      touch: false,
      focus: false
    };
  },
  created() {
    this.theValue = this.value;
  },
  watch: {
    theValue: function(newValue, oldValue) {
      if (newValue === undefined) return;
      this.$emit("input", this.theValue);
      this.touch = true;
      /*
      if ((oldValue !== null && oldValue !== undefined) || this.instantTouch)
        this.touch = true;*/
    },
    value: function() {
      this.theValue = this.value;
    }
  },
  computed: {
    getFieldComponent: function() {
      if (!this.type) {
        return null;
      }
      var type = this.type;
      if (
        ["text", "email", "password", "number", "url", "tel"].indexOf(type) !==
        -1
      )
        type = "input";

      return () => import(`./${type.charAt(0).toUpperCase() + type.slice(1)}`);
    }
  },
  mounted() {
    this.getFieldComponent()
      .then(() => {
        this.component = () => this.getFieldComponent();
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    onFocus: function(params) {
      this.focus = true;
    },
    onBlur: function(params) {
      this.focus = false;
    }
  }
};
</script>

<style scoped lang="scss">
.field {
  margin-bottom: $margin-default;
  position: relative;
}

.field__label {
  display: block;
  @include label-input;
  margin-bottom: $margin-small;
}

.field__errors {
  z-index: 2;
  position: absolute;
  left: 0px;
  padding-top: 30px;
  max-width: 100%;
  pointer-events: none;

  &:before {
    position: absolute;
    top: -20px;
    left: 90px;
    content: "";
    display: block;
    background-image: url("~@/assets/images/ui/field/arrow-error-up.svg");
    width: 58px;
    height: 67px;
  }

  .errors__container {
    margin-left: 125px;
    background-color: $color-negative;
    padding: 20px;
    margin-right: -40px;
    border: $color-text $border-width-ml solid;
    @include text-body-black;
  }
}

.field__container {
  position: relative;

  &:before {
    z-index: 1;
    position: absolute;
    top: $border-width-ml;
    bottom: $border-width-ml;
    left: $border-width-ml;
    border-top-left-radius: $border-radius;
    border-bottom-left-radius: $border-radius;
    content: "";
    display: block;
    width: 0px;
    background-color: $color-negative;
    transition: width 0.2s;
  }

  .field--error &:before {
    width: $border-width-ml;
  }
}
</style>
