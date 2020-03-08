<template>
  <div class="onboarding">
    <h1>Onboarding</h1>
    <Form :fields="fields" @update="onFormUpdate" :errors="$v.entries" />
    {{ entries }}
    <div v-on:click="submit">Send</div>
  </div>
</template>

<script>
import Form from "@/components/molecules/form/Form.vue";
import { mapGetters, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { required, minLength, between } from "vuelidate/lib/validators";

export default {
  name: "OnBoarding",
  components: { Form },
  mixins: [validationMixin],
  methods: {
    onFormUpdate: function(formData) {
      this.entries = formData;
    },
    submit() {
      console.log("submit!");
      this.$v.$touch();
      if (this.$v.$invalid) {
        console.log("INVALID");
      } else {
        console.log("GOOOO");
      }
    }
  },
  data: function() {
    return {
      fields: {
        identity: {
          fields: {
            profileFirstName: {
              type: "text",
              id: "profileFirstName",
              name: "profileFirstName",
              value: null,
              label: "Votre prénom"
            }
          }
        }
      },
      entries: null
    };
  },
  validations: {
    entries: {
      profileFirstName: {
        required,
        minLength: minLength(5)
      }
    }
  }
};
</script>
