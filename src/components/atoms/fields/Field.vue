<template>
  <div class="field">
    <label class="field__label" v-if="label !== ''" :for="id">{{
      label
    }}</label>
    <div
      v-if="errors !== undefined && errors.$invalid && touch"
      class="field__errors"
    >
      Il y a des erreurs
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
    <component
      v-bind:is="component"
      class="field__component"
      :id="id"
      :name="name"
      :type="type"
      :options="options"
      :disabled="disable"
      :placeholder="placeholder"
      :optionsQuantity="optionsQuantity"
      :optionsQuantityMin="optionsQuantityMin"
      :optionsQuantityMax="optionsQuantityMax"
      v-model="theValue"
    />
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
    label: {
      type: String,
      default: ""
    },
    disable: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: function() {
        return [];
      }
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
      touch: false
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
  }
};
</script>

<style scoped lang="scss"></style>
