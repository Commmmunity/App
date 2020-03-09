<template>
  <div class="onboarding">
    <h1>Onboarding</h1>
    <Form :form="form" @update="onFormUpdate" :errors="$v.entries" />
    {{ entries }}
    <div v-on:click="submit">Send</div>
  </div>
</template>

<script>
import Form from "@/components/molecules/form/Form.vue";
import { mapGetters, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { required, minLength, between } from "vuelidate/lib/validators";
import phone from "phone";

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
      form: {
        identity: {
          fields: {
            firstName: {
              type: "text",
              id: "firstName",
              name: "firstName",
              value: "eee",
              label: "Prénom"
            },
            lastName: {
              type: "text",
              id: "lastName",
              name: "lastName",
              value: null,
              label: "Nom"
            },
            phone: {
              type: "phone",
              id: "phone",
              name: "phone",
              value: null,
              label: "Numéro de téléphone"
            },
            location: {
              type: "location",
              id: "location",
              name: "location",
              value: null,
              label: "Votre adresse ou Ville"
            },
            profilePicture: {
              type: "file",
              id: "profilePicture",
              name: "profilePicture",
              value: null,
              label: "Votre photo",
              description: "Png, Jpg ou Gif",
              instantTouch: true
            }
          }
        }
      },
      entries: null
    };
  },
  validations: {
    entries: {
      firstName: {
        required
      },
      lastName: {
        required
      },
      phone: {
        country: {
          required
        },
        number: {
          required
        },
        mustBePhoneNumber: function(value) {
          return phone(value.number, value.country).length > 0;
        }
      },
      location: {
        required
      },
      profilePicture: {
        type: {
          isAnImage: function(value) {
            var available = ["image/png", "image/jpg", "image/gif"];
            return available.includes(value);
          }
        },
        size: {
          required,
          maxSize: function(value) {
            return value <= 2000000;
          }
        }
      }
    }
  }
};
</script>
