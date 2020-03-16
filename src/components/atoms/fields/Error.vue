<template>
  <div class="error">{{ getError }}</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "FieldError",
  props: {
    type: {
      required: true,
      default: null
    },
    message: {
      required: false,
      default: null
    },
    optionsQuantityMin: {
      type: Number,
      default: -1
    },
    optionsQuantityMax: {
      type: Number,
      default: -1
    }
  },
  computed: {
    getError: function() {
      if (this.type === "required") return "Ce champ est obligatoire";
      else if (this.type === "url")
        return "Doit être en format lien : https://example.com";
      else if (this.type === "mustBePhoneNumber")
        return "Doit être un numéro de téléphone valide";
      else if (this.type === "isAnImage") return "Doit être un fichier image";
      else if (this.type === "minLength") return "Trop court";
      else if (this.type === "maxLength") return "Trop long";
      else if (this.type === "arrayMin") {
        if (this.optionsQuantityMin === -1)
          return "Vous devez sélectionner une ou plusieurs options";
        else if (this.optionsQuantityMin === 1)
          return "Vous devez sélectionner une option minimum";
        else if (this.optionsQuantityMin > 1)
          return (
            "Vous devez sélectionner " +
            this.optionsQuantityMin +
            " options minimum"
          );
      } else if (this.type === "arrayMax")
        return (
          "Vous devez sélectionner " + this.optionsQuantityMax + " maximum"
        );
      else if (this.type === "isLinkedinLink")
        return "Doit être un lien LinkedIn";
      else if (this.type === "maxSize")
        return "Dépasse la limite autorisée de taille de fichier";
      else if (this.message) return this.message;
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
