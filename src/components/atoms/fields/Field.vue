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
          <div v-if="fieldKey === 'required' && !errors[fieldKey]">Requis</div>
        </div>
        <div
          v-else
          class="error__type"
          v-for="(error, errorType) in errors[fieldKey].$params"
          :key="errorType"
        >
          <div v-if="errorType === 'required' && !errors[fieldKey][errorType]">
            Ce champ est obligatoire
          </div>
          <div
            v-else-if="
              errorType === 'isAnImage' && !errors[fieldKey][errorType]
            "
          >
            Doit être un fichier image
          </div>
          <div
            v-else-if="errorType === 'maxSize' && !errors[fieldKey][errorType]"
          >
            Dépasse la limite autorisée de taille
          </div>
        </div>
      </div>
    </div>
    <component
      v-bind:is="component"
      class="field__component"
      :id="id"
      :name="name"
      :type="type"
      :disabled="disable"
      :placeholder="placeholder"
      v-model="theValue"
    />
    <div class="field__description" v-if="description">{{ description }}</div>
  </div>
</template>

<script>
export default {
  name: "Field",
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
      if ((oldValue !== null && oldValue !== undefined) || this.instantTouch)
        this.touch = true;
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
      if (["text", "email", "password", "number"].indexOf(type) !== -1)
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
