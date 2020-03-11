<template>
  <div class="onboarding">
    <h1>Onboarding</h1>
    <Form :form="getForm" @update="onFormUpdate" :errors="$v.entries" />
    {{ entries }}
    <Button v-on:click="submit" :loading="status.submit === 'PENDING'"
      >Submit</Button
    >
  </div>
</template>

<script>
import Button from "../../../components/atoms/buttons/Button.vue";
import Form from "@/components/molecules/form/Form.vue";
import { mapGetters, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  minLength,
  url,
  between
} from "vuelidate/lib/validators";
import phone from "phone";

export default {
  name: "OnBoarding",
  components: { Form, Button },
  mixins: [validationMixin],
  computed: {
    ...mapGetters("taxos", [
      "getInterests",
      "getSkills",
      "getCountries",
      "getCommunitySize"
    ]),
    getForm: function() {
      return {
        identity: {
          title: "Qui êtes-vous ?",
          introduction: {
            title: "Qui êtes-vous ?",
            content: "Et oui"
          },
          fields: {
            firstName: {
              type: "text",
              id: "firstName",
              name: "firstName",
              value: "ee",
              label: "Prénom",
              required: true,
              validations: {
                required
              }
            },
            lastName: {
              type: "text",
              id: "lastName",
              name: "lastName",
              value: null,
              label: "Nom",
              required: true,
              validations: {
                required
              }
            },
            phone: {
              type: "phone",
              id: "phone",
              name: "phone",
              value: null,
              label: "Numéro de téléphone",
              required: true,
              validations: {
                country: {
                  required
                },
                number: {
                  required
                },
                mustBePhoneNumber: function(value) {
                  return phone(value.number, value.country).length > 0;
                }
              }
            },
            country: {
              type: "select",
              id: "country",
              name: "country",
              value: "FR",
              options: this.getCountries,
              label: "Pays",
              required: true,
              validations: {
                required
              }
            },
            location: {
              type: "location",
              id: "location",
              name: "location",
              value: null,
              label: "Votre adresse ou ville",
              required: true,
              validations: {
                required
              }
            },
            profilePicture: {
              type: "file",
              id: "profilePicture",
              name: "profilePicture",
              value: null,
              label: "Votre photo",
              description: "Png, Jpg ou Gif",
              instantTouch: true,
              required: true,
              validations: {
                type: {
                  isAnImage: function(value) {
                    var available = [
                      "image/png",
                      "image/jpg",
                      "image/jpeg",
                      "image/gif"
                    ];
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
        },
        profile: {
          title: "Profil",
          introduction: {
            title: "Votre profil",
            content: "Présentez-vous aux membres"
          },
          fields: {
            biography: {
              type: "textarea",
              id: "biography",
              name: "biography",
              value: "azeazeazeazeaze azea zeaze azeaz eaze zae aze ",
              label: "Décrivez-vous en quelques mots",
              description:
                "Ex: Membre de la communauté makesense depuis plus de 5 ans, je suis en charge...",
              required: true,
              validations: {
                required,
                minLength: minLength(40),
                maxLength: maxLength(300)
              }
            },
            linkedinLink: {
              type: "url",
              id: "linkedinLink",
              name: "linkedinLink",
              value: null,
              label: "Page LinkedIn",
              required: true,
              validations: {
                required,
                url,
                isLinkedinLink: function(value) {
                  return value.indexOf("linkedin.com") !== -1;
                }
              }
            },
            community: {
              type: "text",
              id: "community",
              name: "community",
              value: null,
              label: "Nom de votre communauté",
              description:
                "Que ce soit un projet, une association, une entreprise...",
              required: true,
              validations: {
                required,
                maxLength: maxLength(150)
              }
            },
            job: {
              type: "text",
              id: "job",
              name: "job",
              value: null,
              label: "Intitulé de votre poste ou rôle dans cette communauté",
              description:
                "Ex: Leader, Community manager, Coordinateur communauté...",
              required: false,
              validations: {
                maxLength: maxLength(150)
              }
            },
            communityLink: {
              type: "url",
              id: "communityLink",
              name: "communityLink",
              value: null,
              label: "Site internet de votre communauté",
              required: false,
              validations: {
                url
              }
            },
            communitySize: {
              type: "select",
              id: "communitySize",
              name: "communitySize",
              value: "0-100",
              options: this.getCommunitySize,
              label: "Taille de votre communauté",
              required: true,
              validations: {
                required
              }
            },
            communityOrganisation: {
              type: "checkbox",
              id: "communityOrganisation",
              name: "communityOrganisation",
              value: false,
              label:
                "Votre communauté est-elle liée à une organisation / entreprise ?",
              required: false
            },
            organisation: {
              type: "text",
              id: "organisation",
              name: "organisation",
              value: null,
              label: "Nom de votre organisation",
              show: function(entries) {
                var toshow = entries["communityOrganisation"] === true;
                if (!toshow && entries["organisation"] !== undefined)
                  delete entries["organisation"];

                return toshow;
              },
              required: true,
              validations: {
                required
              }
            }
          }
        },
        interests: {
          title: "Intérêts",
          introduction: {
            title: "Vos intérêts",
            content: "Parlons un peu de ce qui vous intéresse"
          },
          fields: {
            mainInterests: {
              type: "tags",
              id: "mainInterests",
              name: "mainInterests",
              value: null,
              options: this.getInterests,
              label: "Intérêts",
              required: true,
              optionsQuantity: 2,
              optionsQuantityMin: 1,
              optionsQuantityMax: 2,
              validations: {
                arrayMin: function(value) {
                  return value !== undefined && value.length >= 1;
                },
                arrayMax: function(value) {
                  return value !== undefined && value.length <= 2;
                }
              }
            },
            yourSkills: {
              type: "tags",
              id: "yourSkills",
              name: "yourSkills",
              value: null,
              options: this.getSkills,
              label: "Vos 5 compétences clées",
              required: true,
              optionsQuantity: 5,
              optionsQuantityMin: 1,
              optionsQuantityMax: 5,
              description:
                "Cela nous permet de vous mettre en relation avec des personnes qui ont des besoins liés à ces sujets",
              validations: {
                arrayMin: function(value) {
                  return value !== undefined && value.length >= 1;
                },
                arrayMax: function(value) {
                  return value !== undefined && value.length <= 5;
                }
              }
            },
            skillsMissing: {
              type: "tags",
              id: "skillsMissing",
              name: "skillsMissing",
              value: null,
              options: this.getSkills,
              label:
                "Les 5 compétences que vous recherchez / qui vous manquent",
              required: true,
              optionsQuantity: 5,
              optionsQuantityMin: 1,
              optionsQuantityMax: 5,
              description:
                "Nous vous mettons en relation avec les personnes qui maitrisent ces compétences",
              validations: {
                arrayMin: function(value) {
                  return value !== undefined && value.length >= 1;
                },
                arrayMax: function(value) {
                  return value !== undefined && value.length <= 5;
                }
              }
            }
          }
        },
        buddy: {
          title: "Votre réseau",
          introduction: {
            title: "Qui connaissez-vous dans la communauté ?",
            content: "Prévenez les membres du réseau de votre arrivée"
          },
          fields: {
            buddies: {
              type: "tags",
              id: "buddies",
              name: "buddies",
              value: null,
              options: [],
              optionsSearch: this.StoreSearchMembers,
              optionsSearchMapping: {
                label: function(option) {
                  return option.firstName + " " + option.lastName;
                },
                id: function(option) {
                  return option.objectID;
                },
                value: function(option) {
                  return option.objectID;
                }
              },
              label: "Membres du réseau",
              required: false,
              description:
                "Sélectionnez les membres de la communauté que vous connaissez"
            }
          }
        }
      };
    }
  },
  created() {},
  methods: {
    ...mapActions({
      StoreGetWorkspaces: "auth/getWorkspaces",
      StoreSaveExtentedProfile: "auth/saveExtendedProfile",
      StoreSearchMembers: "members/search"
    }),
    onFormUpdate: function(formData) {
      this.entries = formData;
    },
    submit() {
      if (this.status.submit === "PENDING") return;
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$toasted.show("Il y a des erreurs dans le formulaire", {
          position: "bottom-right",
          duration: 2000,
          type: "error"
        });
      } else {
        this.status.submit = "PENDING";

        var toast = this.$toasted.show("Enregistrement...", {
          position: "bottom-right",
          type: "error"
        });

        this.StoreSaveExtentedProfile({
          data: this.entries,
          toProcess: {
            profilePicture: "file",
            phone: "phone"
          }
        })
          .then(thing => {
            this.status.submit = "OK";
          })
          .catch(err => {
            this.status.submit = "ERROR";
            console.log(err);
          })
          .finally(() => {
            toast.goAway(0);
          });
      }
    }
  },
  data: function() {
    return {
      entries: null,
      status: {
        submit: "KO"
      }
    };
  },
  validations() {
    var fieldsValidations = {};
    for (let [groupName, group] of Object.entries(this.getForm)) {
      for (let [fieldName, field] of Object.entries(group.fields)) {
        if (
          field.validations &&
          (!field.show || (this.entries && field.show(this.entries)))
        )
          fieldsValidations[fieldName] = field.validations;
      }
    }

    return {
      entries: {
        ...fieldsValidations
      }
    };
  }
};
</script>
