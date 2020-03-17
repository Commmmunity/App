<template>
  <div class="form">
    <div
      class="form__group"
      v-for="(group, groupId) in form"
      :key="groupId"
      v-show="currentStep === groupId"
    >
      <div class="group__introduction" v-if="group.introduction && introduction">
        <h2
          class="introduction__title"
          v-if="group.introduction.title"
        >{{ group.introduction.title }}</h2>
        <p
          class="introduction__content"
          v-if="group.introduction.content"
        >{{ group.introduction.content }}</p>
      </div>
      <div class="group__fields">
        <div class="fields" v-for="(field, index) in group.fields" :key="index">
          <Field
            :id="field.id"
            :name="field.name"
            :label="field.label"
            :placeholder="field.placeholder"
            :options="field.options"
            :optionsSearch="field.optionsSearch"
            :optionsSearchMapping="field.optionsSearchMapping"
            :optionsQuantity="field.optionsQuantity"
            :optionsQuantityMin="field.optionsQuantityMin"
            :optionsQuantityMax="field.optionsQuantityMax"
            :description="field.description"
            :type="field.type"
            :required="field.required"
            :instantTouch="
              field.instantTouch !== null ? field.instantTouch : false
            "
            :errors="errors[index]"
            v-model="values[index]"
            v-if="field.show ? field.show(values) : true"
          />
        </div>
      </div>
      <div class="group__footer">
        <Button
          @click="nextStep(-1)"
          type="medium"
          variation="back"
          v-show="!firstStep"
          class="footer__back"
        ></Button>
        <Button @click="nextStep(1)" type="medium" v-show="!lastStep" class="footer__next">Continuer</Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from "../../atoms/buttons/Button.vue";
import Field from "../../atoms/fields/Field.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Form",
  components: {
    Field,
    Button
  },
  props: {
    form: {
      type: Object,
      required: true
    },
    introduction: {
      type: Boolean,
      required: false,
      default: true
    },
    errors: null
  },
  data: function() {
    return {
      init: true,
      values: {},
      currentStep: null,
      steps: [],
      firstStep: true,
      lastStep: false
    };
  },
  created() {
    this.refreshForm();
    this.init = false;
  },
  computed: {},
  methods: {
    refreshForm: function() {
      this.steps = [];
      this.currentStep = null;
      this.firstStep = true;
      this.lastStep = false;

      for (let [groupKey, groupData] of Object.entries(this.form)) {
        if (!this.currentStep) this.currentStep = groupKey;
        this.steps.push(groupKey);

        if (Object.entries(this.form).length === 1)
          this.firstStep = this.lastStep = true;

        for (let [fieldsKey, fieldsData] of Object.entries(groupData)) {
          for (let [fieldKey, fieldData] of Object.entries(fieldsData)) {
            if (fieldData.value)
              this.$set(this.values, fieldKey, fieldData.value);
          }
        }
      }
    },
    nextStep: function(direction) {
      var nextStep = this.steps.indexOf(this.currentStep) + direction;
      if (nextStep => 0 && nextStep < this.steps.length) {
        this.currentStep = this.steps[nextStep];
      }

      if (this.steps.indexOf(this.currentStep) === 0) this.firstStep = true;
      else this.firstStep = false;

      if (nextStep === this.steps.length - 1) this.lastStep = true;
      else this.lastStep = false;

      window.scrollTo(0, 0);
    }
  },
  watch: {
    form: function() {
      this.refreshForm();
    },
    values: function() {
      this.$emit("update", this.values);
    },
    currentStep: function() {
      this.$emit("stepChange", this.currentStep);
    }
  }
};
</script>

<style lang="scss" scoped>
.group__footer {
  @include flex;
}

.footer__next {
  width: 100%;
}

.footer__back {
  margin-right: $margin-small;
}
</style>
