<template>
  <div class="onboarding">
    <Header :custom="true" :logotype="true">
      <div class="header__title">
        Créez votre profil
        <br />de membre
      </div>
      <NumberedList :items="getSteps" direction="line" />
    </Header>
    <div class="onboarding__form">
      <WorkArea size="xsmall">
        <Form
          :form="getForm"
          @update="onFormUpdate"
          :errors="$v.entries"
          @stepChange="onStepChange"
          :introduction="false"
        />
      </WorkArea>
    </div>

    <Button v-on:click="submit" v-show="false" :loading="status.submit === 'PENDING'">Submit</Button>
  </div>
</template>

<script>
import WorkArea from "../../../components/layouts/WorkArea.vue";
import NumberedList from "../../../components/molecules/list/NumberedList.vue";
import Header from "../../../components/organisms/Header.vue";
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
  components: { Form, Button, Header, NumberedList, WorkArea },
  mixins: [validationMixin],
  computed: {
    ...mapGetters("taxos", [
      "getInterests",
      "getSkills",
      "getCountries",
      "getCommunitySize"
    ]),
    getSteps: function(params) {
      var steps = {};

      for (let [groupId, group] of Object.entries(this.getForm)) {
        steps[groupId] = {
          name: group.title,
          active: this.currentFormStep === groupId,
          id: groupId
        };
      }

      return steps;
    },
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
              value: null,
              placeholder: "Michel",
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
              placeholder: "Strogoff",
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
              value: {
                country: "FR",
                number: null
              },
              label: "Numéro de téléphone",
              placeholder: "06 75 94 03 94",
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
              placeholder: "11 rue biscornet, 75012",
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
              placeholder: "Amoure.ux.se des commaunauté j'ai...",
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
              placeholder: "https://linkedin.com/mon_profil",
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
              placeholder: "Ex: makesense",
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
              placeholder: "Ex: Ambassadeur, Community dev",
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
              placeholder: "https://macommunaute.com",
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
              placeholder: "Oui c'est le cas",
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
              placeholder: "Ex: association makesense",
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
              placeholder: "Intérêt (ex: Contribuer)",
              value: null,
              options: this.getInterests,
              label: "Intérêts",
              required: true,
              optionsQuantity: 2,
              optionsQuantityMin: 1,
              optionsQuantityMax: 2,
              separator: {
                bottom: true
              },
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
              placeholder: "Votre compétence (ex: Animation)",
              optionsQuantity: 5,
              optionsQuantityMin: 1,
              optionsQuantityMax: 5,
              separator: {
                bottom: true
              },
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
              placeholder: "Compétence recherchée (ex: Design)",
              label:
                "Les 5 compétences que vous recherchez / qui vous manquent",
              required: true,
              optionsQuantity: 5,
              optionsQuantityMin: 1,
              optionsQuantityMax: 5,
              separator: {
                bottom: true
              },
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
              placeholder: "Nom, Prénom, Communauté... (ex: Solène makesense)",
              value: null,
              options: [],
              variation: "user",
              optionsSearch: this.StoreSearchMembers,
              optionsSearchMapping: {
                label: function(option) {
                  return option.firstName + " " + option.lastName;
                },
                image: function(option) {
                  return option.profilePicture;
                },
                description: function(option) {
                  return option.community;
                },
                id: function(option) {
                  return option.objectID;
                },
                value: function(option) {
                  return option.objectID;
                }
              },
              label: "Retrouvez vos connaissances",
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
    },
    onStepChange: function(stepId) {
      this.currentFormStep = stepId;
    }
  },
  data: function() {
    return {
      entries: null,
      currentFormStep: null,
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

<style lang="scss" scoped>
.header__title {
  @include text-large-black;
  margin-left: $margin-small;
  margin-right: $margin-large * 2;
}

.onboarding__form {
  @include padding-container-page;
}
</style>
