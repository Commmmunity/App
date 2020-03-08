<template>
  <div class="field">
    <label class="field__label" v-if="label !== ''" :for="id">{{
      label
    }}</label>
    <div v-if="errors.$invalid && touch" class="field__error">
      Il y a des erreurs
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
      this.$emit("input", this.theValue);

      if (oldValue !== null) this.touch = true;
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
